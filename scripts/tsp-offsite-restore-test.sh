#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# TSP backup restore test.
# Pulls the most recent (or specified) backup from offsite, decrypts, verifies
# integrity. Run monthly. Backups you don't test are hypotheses.
#
# Usage:
#   tsp-offsite-restore-test.sh                 # latest backup
#   tsp-offsite-restore-test.sh <archive-name>  # specific backup
#
# Exit code 0 = restore round-trip verified.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

DATE=$(date -u +%Y-%m-%dT%H-%M-%SZ)
WORK=$(mktemp -d /tmp/tsp-restore-test-XXXXXX)
RCLONE_REMOTE=${TSP_RCLONE_REMOTE:-offsite:tsp-backups}
PASS_FILE=${TSP_BACKUP_PASS_FILE:-/root/.backup-key}
LOG=/var/log/tsp-restore-test.log

cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

log() {
  local msg="[$(date -u +%FT%TZ)] $*"
  echo "$msg"
  echo "$msg" >> "$LOG"
}

log "▸ TSP restore test starting"

# ─── Pick archive ────────────────────────────────────────────────────────────
if [[ $# -ge 1 ]]; then
  ARCHIVE_NAME=$1
  log "▸ Using specified archive: $ARCHIVE_NAME"
else
  ARCHIVE_NAME=$(rclone lsf "$RCLONE_REMOTE/" --format=tp \
    | sort -r | head -1 | cut -d';' -f2-)
  [[ -n $ARCHIVE_NAME ]] || { log "✗ No archives found at $RCLONE_REMOTE"; exit 1; }
  log "▸ Using latest archive: $ARCHIVE_NAME"
fi

# ─── Download ────────────────────────────────────────────────────────────────
log "▸ Downloading"
rclone copy "$RCLONE_REMOTE/$ARCHIVE_NAME" "$WORK/"
[[ -f "$WORK/$ARCHIVE_NAME" ]] || { log "✗ Download failed"; exit 1; }

# ─── Decrypt ─────────────────────────────────────────────────────────────────
log "▸ Decrypting"
gpg --batch --yes --decrypt \
    --passphrase-file "$PASS_FILE" \
    -o "$WORK/archive.tar.gz" \
    "$WORK/$ARCHIVE_NAME"

# ─── Extract ─────────────────────────────────────────────────────────────────
log "▸ Extracting"
mkdir -p "$WORK/extracted"
tar -xzf "$WORK/archive.tar.gz" -C "$WORK/extracted"

# ─── Verify manifest ─────────────────────────────────────────────────────────
log "▸ Verifying manifest"
[[ -f "$WORK/extracted/MANIFEST.txt" ]] || { log "✗ No MANIFEST.txt in archive"; exit 1; }

DEPLOY_SHA=$(grep "^deploy_sha=" "$WORK/extracted/MANIFEST.txt" | cut -d'=' -f2)
DEPLOY_TIME=$(grep "^deploy_time=" "$WORK/extracted/MANIFEST.txt" | cut -d'=' -f2)
log "  ↳ deploy_sha=$DEPLOY_SHA"
log "  ↳ deploy_time=$DEPLOY_TIME"

# ─── Verify file checksums against the archive's own manifest ────────────────
log "▸ Verifying file checksums"
(cd "$WORK/extracted" && \
  grep -A1000 "^## Checksums" MANIFEST.txt | tail -n +2 | \
  grep -v "MANIFEST.txt" | \
  while read -r hash file; do
    [[ -z $hash ]] && continue
    actual=$(sha256sum "$file" 2>/dev/null | awk '{print $1}')
    if [[ "$hash" != "$actual" ]]; then
      log "  ✗ MISMATCH: $file (expected $hash, got $actual)"
      exit 1
    fi
  done)

# ─── Verify each SQLite database opens and passes integrity check ────────────
log "▸ Verifying SQLite databases"
shopt -s nullglob
for db in "$WORK/extracted"/*.sqlite "$WORK/extracted"/*.db; do
  [[ -e $db ]] || continue
  name=$(basename "$db")
  result=$(sqlite3 "$db" "PRAGMA integrity_check;" | head -1)
  if [[ "$result" != "ok" ]]; then
    log "  ✗ $name failed integrity_check: $result"
    exit 1
  fi
  rows=$(sqlite3 "$db" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
  log "  ↳ $name ok ($rows tables)"
done
shopt -u nullglob

# ─── Record success ──────────────────────────────────────────────────────────
echo "$DATE  $ARCHIVE_NAME" >> /var/log/tsp-restore-test-success
log "✓ Restore test passed for $ARCHIVE_NAME"
log ""
