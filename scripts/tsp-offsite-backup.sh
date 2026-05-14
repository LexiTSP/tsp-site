#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# TSP offsite backup script.
# Run nightly via cron from the tsp user on the Hetzner server.
#
# Charter §1: backups never leak content outside operator control.
# The output is gpg-encrypted with AES-256 before leaving the host.
#
# Prerequisites on the server (one-time setup):
#   sudo apt install -y rclone gpg sqlite3
#   rclone config           # set up an R2 or B2 remote called "offsite"
#   echo "<strong-passphrase>" | sudo tee /root/.backup-key
#   sudo chmod 600 /root/.backup-key
#   sudo chown root:tsp /root/.backup-key
#
# Cron entry (run as root so we can read /root/.backup-key):
#   0 3 * * * /usr/local/bin/tsp-offsite-backup.sh >> /var/log/tsp-backup.log 2>&1
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ─── Config ──────────────────────────────────────────────────────────────────
DATE=$(date -u +%Y-%m-%dT%H-%M-%SZ)
TMP=$(mktemp -d /tmp/tsp-backup-XXXXXX)
DATA_DIR=${TSP_DATA_DIR:-/home/tsp/data}
SITE_DIR=${TSP_SITE_DIR:-/home/tsp/tsp-site}
RCLONE_REMOTE=${TSP_RCLONE_REMOTE:-offsite:tsp-backups}
PASS_FILE=${TSP_BACKUP_PASS_FILE:-/root/.backup-key}
RETENTION_DAYS=${TSP_BACKUP_RETENTION_DAYS:-30}

# ─── Cleanup on exit ─────────────────────────────────────────────────────────
cleanup() {
  rm -rf "$TMP"
}
trap cleanup EXIT

# ─── Logging ─────────────────────────────────────────────────────────────────
log() {
  echo "[$(date -u +%FT%TZ)] $*"
}

log "▸ TSP offsite backup starting (date=$DATE)"

# ─── Validate prerequisites ──────────────────────────────────────────────────
[[ -r $PASS_FILE ]] || { log "✗ Cannot read $PASS_FILE"; exit 1; }
command -v rclone >/dev/null || { log "✗ rclone not installed"; exit 1; }
command -v gpg    >/dev/null || { log "✗ gpg not installed"; exit 1; }
command -v sqlite3 >/dev/null || { log "✗ sqlite3 not installed"; exit 1; }

# ─── Snapshot SQLite databases (atomic, WAL-safe) ────────────────────────────
log "▸ Snapshotting SQLite databases from $DATA_DIR"
if [[ -d $DATA_DIR ]]; then
  shopt -s nullglob
  for db in "$DATA_DIR"/*.sqlite "$DATA_DIR"/*.db; do
    name=$(basename "$db")
    log "  ↳ $name"
    sqlite3 "$db" ".backup $TMP/$name"
    # Verify the snapshot
    sqlite3 "$TMP/$name" "PRAGMA integrity_check;" | head -1 | grep -q "^ok$" \
      || { log "✗ Integrity check failed for $name"; exit 1; }
  done
  shopt -u nullglob
fi

# ─── Capture host config (helps cold-restore on a new VPS) ───────────────────
log "▸ Capturing host config"
mkdir -p "$TMP/host-config"
{
  # Caddyfile
  cp /etc/caddy/Caddyfile "$TMP/host-config/" 2>/dev/null || true
  # Systemd units
  cp /etc/systemd/system/tsp-*.service "$TMP/host-config/" 2>/dev/null || true
  # UFW rules
  cp /etc/ufw/user.rules "$TMP/host-config/" 2>/dev/null || true
  cp /etc/ufw/user6.rules "$TMP/host-config/" 2>/dev/null || true
  # Fail2ban
  cp /etc/fail2ban/jail.d/sshd.conf "$TMP/host-config/" 2>/dev/null || true
  # Env files (non-secret production config)
  cp "$SITE_DIR/.env.production" "$TMP/host-config/" 2>/dev/null || true
  # Deploy SHA marker
  cp "$SITE_DIR/.deploy-sha"  "$TMP/host-config/" 2>/dev/null || true
  cp "$SITE_DIR/.deploy-time" "$TMP/host-config/" 2>/dev/null || true
}

# Sanity: never include private keys
find "$TMP" -type f \( -name "*.key" -o -name "*.pem" -o -name "id_*" \) -delete

# ─── Manifest of contents (audit trail) ──────────────────────────────────────
log "▸ Building manifest"
{
  echo "# TSP backup manifest"
  echo "date_utc=$DATE"
  echo "hostname=$(hostname)"
  echo "kernel=$(uname -r)"
  echo "deploy_sha=$(cat "$SITE_DIR/.deploy-sha" 2>/dev/null || echo unknown)"
  echo "deploy_time=$(cat "$SITE_DIR/.deploy-time" 2>/dev/null || echo unknown)"
  echo ""
  echo "## Files"
  (cd "$TMP" && find . -type f | sort)
  echo ""
  echo "## Checksums"
  (cd "$TMP" && find . -type f -exec sha256sum {} \; | sort -k 2)
} > "$TMP/MANIFEST.txt"

# ─── Encrypt and upload ──────────────────────────────────────────────────────
ARCHIVE="/tmp/tsp-backup-$DATE.tar.gz.gpg"
log "▸ Encrypting and packaging to $ARCHIVE"

tar czf - -C "$TMP" . | \
  gpg --batch --yes --symmetric \
      --cipher-algo AES256 \
      --s2k-mode 3 --s2k-count 65011712 \
      --s2k-digest-algo SHA512 \
      --passphrase-file "$PASS_FILE" \
      -o "$ARCHIVE"

ARCHIVE_SIZE=$(stat -c%s "$ARCHIVE" 2>/dev/null || stat -f%z "$ARCHIVE")
log "  ↳ Archive size: $((ARCHIVE_SIZE / 1024)) KB"

log "▸ Uploading to $RCLONE_REMOTE"
rclone copy "$ARCHIVE" "$RCLONE_REMOTE/" --no-traverse

# ─── Verify upload ───────────────────────────────────────────────────────────
log "▸ Verifying upload"
REMOTE_NAME="tsp-backup-$DATE.tar.gz.gpg"
if ! rclone ls "$RCLONE_REMOTE/" | grep -q "$REMOTE_NAME"; then
  log "✗ Upload verification failed — $REMOTE_NAME not visible at remote"
  exit 1
fi
log "  ↳ Verified: $REMOTE_NAME present at $RCLONE_REMOTE"

# ─── Retention: delete remote archives older than RETENTION_DAYS ─────────────
log "▸ Pruning remote archives older than ${RETENTION_DAYS} days"
rclone delete --min-age "${RETENTION_DAYS}d" "$RCLONE_REMOTE/" || true

# ─── Cleanup local archive ───────────────────────────────────────────────────
rm -f "$ARCHIVE"

log "✓ TSP offsite backup complete"
log ""

# ─── Health hint: write last-success marker for monitoring ───────────────────
echo "$DATE" > /var/log/tsp-backup-last-success
