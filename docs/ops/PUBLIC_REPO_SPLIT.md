# Public Repo Split — Runbook

The LexiCo monorepo is split into three public repos plus one private one:

| Repo | Visibility | Source paths |
|---|---|---|
| `lexitsp/tsp-site` | public | workspace root, minus `packages/*-server/` and internal docs |
| `lexitsp/sdk` | public | `packages/lexitsp-sdk/` extracted as root |
| `lexitsp/trustbadge-react` | public | `packages/trustbadge-react/` extracted as root |
| `lexico/tsp-backends` | private | (stays in the monorepo; not extracted by this script) |

`scripts/public-repo-split.sh` produces the three public repos with git history preserved per file.

## Prerequisites

- `git ≥ 2.36`
- `git-filter-repo`:
  ```bash
  # Linux/macOS:
  pip install git-filter-repo
  # Windows (Git Bash):
  pip install git-filter-repo
  # Or via Homebrew on macOS:
  brew install git-filter-repo
  ```
- Clean working tree (no uncommitted changes in the monorepo)

## Run

```bash
# Dry-run first — list what would happen, change nothing
DRY_RUN=1 ./scripts/public-repo-split.sh

# Real run — produces ../tsp-public-split/{tsp-site,sdk,trustbadge-react}
./scripts/public-repo-split.sh

# Real run with full public release-gate verification on the resulting tsp-site
VERIFY=1 ./scripts/public-repo-split.sh
```

On Windows, run via Git Bash or WSL — the script uses POSIX shell features.

## What the script checks

1. **No private path survives in the public tsp-site working tree.** Loops over every entry in `PRIVATE_PATHS` and aborts if any are still present after `filter-repo`.
2. **No private path survives in tsp-site git log.** Greps the post-filter history for any `A`-status commits touching listed private paths. Aborts on leak.
3. **tsp-site `package.json` is rewritten to public-only scripts.** The public repo keeps SDK and TrustBadge tests, claim-lint, manifest check, interop fixtures, package smoke and production-start smoke; private backend tests/typechecks are removed from the public release gate.
4. **(Optional) tsp-site passes public `check:release` after split.** Enabled with `VERIFY=1`.

## Private path list

Maintained at the top of `scripts/public-repo-split.sh` in the `PRIVATE_PATHS` array.

Currently stripped from tsp-site:

```
packages/risk-server
packages/evidence-server
packages/oversight-server
packages/control-plane-server
docs/PRODUCT_READINESS_AND_SKUS.md
docs/TSP_WHOLE_PRODUCT_REVIEW.md
docs/PUBLIC_FOUNDATION_LAUNCH.md
docs/MARKET-ANALYSIS.md
docs/PILOT-PROGRAM.md
docs/LAUNCH-CHECKLIST.md
docs/EXTERNAL_PROOF_SPRINT.md
docs/ops/RISK_RUNBOOK.md
docs/ops/EVIDENCE_RUNBOOK.md
docs/ops/OVERSIGHT_RUNBOOK.md
docs/ops/CONTROL_PLANE_RUNBOOK.md
scripts/pilot-golden-path.mjs
scripts/hosted-pilot-golden-path.mjs
scripts/smoke-sqlite-backup.mjs
examples/pilot
```

`docs/ops/HETZNER_DEPLOYMENT.md` and `docs/FIRST_ADOPTER_KIT.md` are deliberately **public** — they help adopters and signal operational maturity. Review this list before each run if new docs/packages have been added.

## After splitting

1. **Push each public repo.** GitHub commands printed at the end of the script.
2. **First push triggers GitHub Actions** on tsp-site if `.github/workflows/` was copied across. Verify the release gate passes.
3. **Publish sdk and trustbadge-react to npm.** Run `bun publish --dry-run` first to confirm package metadata is correct.
4. **Verify externally.** Fresh clone of `lexitsp/tsp-site` on a different machine, `bun install && bun run check:release` from zero. In the public repo this is the public-only gate: site build, SDK/TrustBadge tests, claim-lint, manifest check, interop fixtures, package smoke and production-start smoke.
5. **Tag releases.** `git tag -a v3.0.0-alpha.6 -m "Public alpha"` in each repo, then `git push --tags`.

## When to re-run

Whenever the monorepo's public/private boundary shifts. Specifically:

- A new commercial backend package is added → add to `PRIVATE_PATHS` and re-split
- A doc moves from internal to public (or vice versa) → update `PRIVATE_PATHS`
- A major SDK refactor — re-split from scratch and force-push (only if you're certain about history rewrites)

For day-to-day commits, **don't re-split**. Push public-facing changes directly to the individual public repos. The monorepo is the LexiCo-internal source of truth; the three public repos are independent forks of their respective slices.

## Reversibility

The split produces new repos in `$OUTPUT_DIR/` — it never modifies the source monorepo. To undo: `rm -rf $OUTPUT_DIR`. The monorepo is untouched.

## Footguns

- **Force-push to a public repo rewrites history for every external clone.** After the first push, treat each public repo as the canonical history. Future changes go in via normal commits, not by re-running this script.
- **`git filter-repo` rewrites commit hashes.** SHAs in the public repos will not match the monorepo SHAs. The `.deploy-sha` mechanism in the GitHub Actions workflow uses the *public* repo's SHA after the first split, which is fine — but don't try to cross-reference between monorepo and public SHAs.
- **A new private file added to the monorepo and committed before a re-split will be silently included** if it doesn't match a `PRIVATE_PATHS` entry. Review `PRIVATE_PATHS` regularly. Run `DRY_RUN=1` first whenever the boundary may have changed.
