#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# TSP public-repo split.
#
# Extracts three public repos from the LexiCo monorepo:
#   - tsp-site            (workspace root minus commercial backends + internal docs)
#   - sdk                 (packages/lexitsp-sdk/ as repo root)
#   - trustbadge-react    (packages/trustbadge-react/ as repo root)
#
# History is preserved per file via git-filter-repo. The commercial backend
# packages and internal docs are stripped — verify the list below matches the
# current state of docs/ before running on a fresh state.
#
# Prerequisites:
#   - git ≥ 2.36
#   - git-filter-repo:  pip install git-filter-repo   (or apt install git-filter-repo)
#   - bun (only if --verify is passed)
#
# Usage:
#   scripts/public-repo-split.sh [SOURCE_PATH] [OUTPUT_DIR]
#   scripts/public-repo-split.sh                        # source=., output=../tsp-public-split
#   scripts/public-repo-split.sh . ../tsp-public-split  # explicit
#
# Flags (set as env vars):
#   DRY_RUN=1     # list what would happen, change nothing
#   VERIFY=1     # after split, install deps in tsp-site and run check:release
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SOURCE="${1:-$(pwd)}"
OUTPUT_DIR="${2:-$(dirname "$SOURCE")/tsp-public-split}"
SOURCE=$(cd "$SOURCE" && pwd)
DRY_RUN="${DRY_RUN:-0}"
VERIFY="${VERIFY:-0}"

# ─── Private paths: removed from tsp-site (and never extracted standalone) ──
# Review this list before each run. Anything not listed here lands in tsp-site.
PRIVATE_PATHS=(
  # Commercial backend packages
  "packages/risk-server"
  "packages/evidence-server"
  "packages/oversight-server"
  "packages/control-plane-server"

  # Internal-only docs (commercial review, pricing, market intel)
  "docs/PRODUCT_READINESS_AND_SKUS.md"
  "docs/TSP_WHOLE_PRODUCT_REVIEW.md"
  "docs/PUBLIC_FOUNDATION_LAUNCH.md"
  "docs/MARKET-ANALYSIS.md"
  "docs/PILOT-PROGRAM.md"
  "docs/LAUNCH-CHECKLIST.md"
  "docs/EXTERNAL_PROOF_SPRINT.md"

  # Internal ops runbooks (per-backend) — keep HETZNER_DEPLOYMENT.md public
  "docs/ops/RISK_RUNBOOK.md"
  "docs/ops/EVIDENCE_RUNBOOK.md"
  "docs/ops/OVERSIGHT_RUNBOOK.md"
  "docs/ops/CONTROL_PLANE_RUNBOOK.md"

  # Backend/pilot scripts that import stripped commercial packages
  "scripts/pilot-golden-path.mjs"
  "scripts/hosted-pilot-golden-path.mjs"
  "scripts/smoke-sqlite-backup.mjs"

  # Private pilot examples for hosted backend modules
  "examples/pilot"
)

# ─── Logging ────────────────────────────────────────────────────────────────
log()  { printf "\033[1;34m▸\033[0m %s\n" "$*"; }
ok()   { printf "\033[1;32m✓\033[0m %s\n" "$*"; }
warn() { printf "\033[1;33m!\033[0m %s\n" "$*" >&2; }
die()  { printf "\033[1;31m✗\033[0m %s\n" "$*" >&2; exit 1; }

rewrite_public_site_package() {
  local repo="$1"
  "$PYTHON_BIN" - "$repo/package.json" <<'PY'
import json
import sys
from pathlib import Path

path = Path(sys.argv[1])
pkg = json.loads(path.read_text(encoding="utf-8"))

pkg["description"] = (
    "TSP — Trust Standard Protocol. Open specification and public site for "
    "cryptographically verifiable AI provenance."
)
pkg["workspaces"] = ["packages/lexitsp-sdk", "packages/trustbadge-react"]

scripts = pkg.setdefault("scripts", {})
scripts["test"] = "bun run test:all"
scripts["check"] = "bun run build && bun run test:all"
scripts["test:all"] = "bun run test:sdk && bun run test:trustbadge"
scripts["check:release"] = (
    "bun run check && bun run check:claims && bun run check:manifest "
    "&& bun run check:interop && bun run smoke:packages && bun run smoke:production-start"
)

for name in [
    "test:risk",
    "test:evidence",
    "test:oversight",
    "test:control-plane",
    "typecheck:servers",
    "pilot:golden",
    "pilot:hosted",
    "smoke:backup",
]:
    scripts.pop(name, None)

path.write_text(json.dumps(pkg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
PY
}

# ─── Preflight ──────────────────────────────────────────────────────────────
command -v git              >/dev/null || die "git not installed"
command -v git-filter-repo  >/dev/null || die "git-filter-repo not installed (pip install git-filter-repo)"
[[ -d "$SOURCE/.git" ]]                || die "$SOURCE is not a git repository"

PYTHON_BIN=""
if command -v python3 >/dev/null; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null; then
  PYTHON_BIN="python"
else
  die "python not installed (required to rewrite public package metadata)"
fi

# Refuse to run on a dirty source
if ! git -C "$SOURCE" diff --quiet || ! git -C "$SOURCE" diff --cached --quiet; then
  die "$SOURCE has uncommitted changes — commit or stash before running"
fi

# Filter PRIVATE_PATHS to only those that exist (filter-repo errors on missing paths)
EXISTING_PRIVATE=()
for p in "${PRIVATE_PATHS[@]}"; do
  if [[ -e "$SOURCE/$p" ]]; then
    EXISTING_PRIVATE+=("$p")
  else
    warn "Listed private path does not exist: $p (skipping)"
  fi
done

log "Source:         $SOURCE"
log "Output:         $OUTPUT_DIR"
log "Private paths:  ${#EXISTING_PRIVATE[@]} entries will be stripped from tsp-site"
log "Mode:           $([ "$DRY_RUN" = "1" ] && echo "DRY-RUN (no changes)" || echo "EXECUTE")"
echo

if [[ "$DRY_RUN" = "1" ]]; then
  log "Would create three repos:"
  echo "    $OUTPUT_DIR/tsp-site"
  echo "    $OUTPUT_DIR/sdk"
  echo "    $OUTPUT_DIR/trustbadge-react"
  echo
  log "Would strip from tsp-site:"
  for p in "${EXISTING_PRIVATE[@]}"; do
    echo "    $p"
  done
  echo
  log "Would extract these subdirectories as their own repos with preserved history:"
  echo "    packages/lexitsp-sdk         → sdk/"
  echo "    packages/trustbadge-react    → trustbadge-react/"
  exit 0
fi

# Refuse to overwrite existing output
if [[ -e "$OUTPUT_DIR" ]]; then
  die "Output directory already exists: $OUTPUT_DIR (rm -rf or move it first)"
fi

mkdir -p "$OUTPUT_DIR"

# ─── 1. tsp-site (root minus private paths) ─────────────────────────────────
log "[1/3] Building tsp-site"
git clone --no-local "$SOURCE" "$OUTPUT_DIR/tsp-site" >/dev/null
pushd "$OUTPUT_DIR/tsp-site" >/dev/null

INVERT_ARGS=()
for p in "${EXISTING_PRIVATE[@]}"; do
  INVERT_ARGS+=(--path "$p")
done
git filter-repo --invert-paths "${INVERT_ARGS[@]}" --force >/dev/null

# Verify: no private path survived
LEAK=0
for p in "${EXISTING_PRIVATE[@]}"; do
  if [[ -e "$p" ]]; then
    warn "LEAK: $p still present in tsp-site after filter-repo"
    LEAK=1
  fi
done
[[ "$LEAK" = "0" ]] || die "Private path leak detected — abort and inspect"

# Verify: no private path in git log either
for p in "${EXISTING_PRIVATE[@]}"; do
  if git log --all --diff-filter=A --name-only --pretty=format: -- "$p" 2>/dev/null | grep -q .; then
    warn "LEAK in history: $p still appears in tsp-site git log"
    LEAK=1
  fi
done
[[ "$LEAK" = "0" ]] || die "History leak detected — abort and inspect"

rewrite_public_site_package "$OUTPUT_DIR/tsp-site"
ok "tsp-site package.json rewritten for public-only release gate"

SIZE=$(du -sh . 2>/dev/null | cut -f1)
COMMITS=$(git rev-list --count HEAD)
ok "tsp-site:    $SIZE, $COMMITS commits, no private path leaks"
popd >/dev/null

# ─── 2. sdk (packages/lexitsp-sdk as root) ──────────────────────────────────
log "[2/3] Building sdk"
if [[ ! -d "$SOURCE/packages/lexitsp-sdk" ]]; then
  warn "packages/lexitsp-sdk not found — skipping sdk extraction"
else
  git clone --no-local "$SOURCE" "$OUTPUT_DIR/sdk" >/dev/null
  pushd "$OUTPUT_DIR/sdk" >/dev/null
  git filter-repo --subdirectory-filter packages/lexitsp-sdk --force >/dev/null
  SIZE=$(du -sh . 2>/dev/null | cut -f1)
  COMMITS=$(git rev-list --count HEAD)
  ok "sdk:         $SIZE, $COMMITS commits"
  popd >/dev/null
fi

# ─── 3. trustbadge-react (packages/trustbadge-react as root) ────────────────
log "[3/3] Building trustbadge-react"
if [[ ! -d "$SOURCE/packages/trustbadge-react" ]]; then
  warn "packages/trustbadge-react not found — skipping trustbadge-react extraction"
else
  git clone --no-local "$SOURCE" "$OUTPUT_DIR/trustbadge-react" >/dev/null
  pushd "$OUTPUT_DIR/trustbadge-react" >/dev/null
  git filter-repo --subdirectory-filter packages/trustbadge-react --force >/dev/null
  SIZE=$(du -sh . 2>/dev/null | cut -f1)
  COMMITS=$(git rev-list --count HEAD)
  ok "trustbadge-react: $SIZE, $COMMITS commits"
  popd >/dev/null
fi

# ─── Optional verify pass on tsp-site ───────────────────────────────────────
if [[ "$VERIFY" = "1" ]]; then
  log "Verifying tsp-site (install + public check:release)"
  pushd "$OUTPUT_DIR/tsp-site" >/dev/null
  if ! command -v bun >/dev/null; then
    warn "bun not installed — skipping verify"
  else
    bun install --frozen-lockfile >/dev/null
    bun run check:release
    ok "tsp-site passes public check:release on the split"
  fi
  popd >/dev/null
fi

# ─── Summary ────────────────────────────────────────────────────────────────
echo
ok "Split complete."
echo
echo "Three repos at $OUTPUT_DIR:"
echo "    tsp-site/            ← lexitsp/tsp-site             (workspace minus commercial)"
echo "    sdk/                 ← lexitsp/sdk                   (npm package: @lexitsp/sdk)"
echo "    trustbadge-react/    ← lexitsp/trustbadge-react      (npm package: @lexitsp/trustbadge-react)"
echo
echo "Next steps:"
echo "    1. cd $OUTPUT_DIR/tsp-site && git remote add origin git@github.com:lexitsp/tsp-site.git && git push -u origin main"
echo "    2. cd $OUTPUT_DIR/sdk      && git remote add origin git@github.com:lexitsp/sdk.git      && git push -u origin main"
echo "    3. cd $OUTPUT_DIR/trustbadge-react && git remote add origin git@github.com:lexitsp/trustbadge-react.git && git push -u origin main"
echo
echo "Pre-push checklist:"
echo "    □ Run \`bun run check:release\` in tsp-site"
echo "    □ Run \`bun publish --dry-run\` in sdk and trustbadge-react"
echo "    □ Confirm fixtures/v3.0/ landed in tsp-site (interop conformance suite)"
echo "    □ Confirm infra/ and .github/workflows/ landed in tsp-site"
echo "    □ Verify no LexiCo-internal LICENSE/COMMERCIAL_TERMS contamination in sdk or trustbadge-react"
