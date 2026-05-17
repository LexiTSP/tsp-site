# TSP v2 Pre-Publish Audit

Last checked: 2026-05-17

Purpose: keep the v2 website, public repositories, npm packages, SDK docs, and
domain release path aligned before anything reaches the main domain.

## Current Release Posture

| Area | Status | Notes |
|---|---|---|
| Working branch | In progress | `website-v2-redesign` is the active local branch. |
| Public remote | Present | `origin` points to `https://github.com/LexiTSP/tsp-site.git`. |
| V1 fallback | Present | Git tags `website-v1-live-style` and `v1-live-before-v2` point to the last known V1-style site. Local archive: `.deploy-backups/website-v1-live-style-20260516/`. |
| Main branch protection | Present on GitHub | `LexiTSP/tsp-site` requires `Release Gate` on `main`. |
| SDK branch protection | Present on GitHub | `LexiTSP/sdk` requires `Build and Test` on `main`. |
| TrustBadge branch protection | Present on GitHub | `LexiTSP/trustbadge-react` requires `Build and Test` on `main`. |
| GitHub Pages | Not configured | `LexiTSP/tsp-site` does not expose a GitHub Pages site. Production is handled outside GitHub Pages. |
| Public package versions | Current docs aligned | `@lexitsp/sdk@3.0.0-alpha.6`, `@lexitsp/trustbadge-react@0.2.2`. |
| Secret exposure posture | Rotation confirmed | Plaintext Cloudflare origin material was found in the parent launch folder and removed locally. Operator confirmed Cloudflare origin certificate rotation on 2026-05-17; keep scan output and hosted smoke evidence with the release note. |

## Must Not Publish

These stay out of public split repositories and out of the public website:

- private keys, `.env` files, tokens, deploy secrets, or TSA credentials;
- internal pricing, paid-tier mechanics, sponsor economics, or commercial terms;
- named pilots, private screenshots, or customer notes without approval;
- claims that imply regulator approval, auditor acceptance, official standard
  status, or guaranteed legal compliance;
- internal migration tooling unless it has been converted into a public-safe
  release checklist.

## Public-Safe Release Gates

Run these before opening or merging a release PR:

```bash
bun run check:claims
bun run check:secrets
bun run check:manifest
bun run check:campaign
bun run check:strategy
bun run check:public-surface
bun run check:interop
bun run check:release
```

`bun run check:release` is the full gate. The shorter checks are listed because
they fail faster and identify the type of release risk.

## Before / After Evidence

Before promoting v2 to the main domain, capture:

| Surface | Evidence |
|---|---|
| V1 fallback | Commit/tag, source archive, and screenshot of current live design. |
| V2 preview | Branch deployment URL or local Browser screenshot. |
| `/en/verify` | `VERIFIED` -> tamper to `INVALID` -> reload to `VERIFIED`. |
| Manifest | `/.well-known/tsp-manifest.json` response and header/status notes. |
| SDK/npm | `bun run smoke:packages` and package version review. |
| Public split | `DRY_RUN=1 ./scripts/public-repo-split.sh` output reviewed before any push. |

## GitHub Repository Metadata

The public repos should keep these roles:

| Repository | Role | Homepage |
|---|---|---|
| `LexiTSP/tsp-site` | Public site, docs, fixtures, and launch infrastructure. | `https://truststandardprotocol.com` |
| `LexiTSP/sdk` | TypeScript SDK and CLI for Trust Standard Protocol. | `https://truststandardprotocol.com` |
| `LexiTSP/trustbadge-react` | React TrustBadge component for TSP envelopes. | `https://truststandardprotocol.com` |

Descriptions and topics should stay practical: AI provenance, cryptographic
verification, TrustEnvelopes, EU AI Act evidence support, open specification,
and local or offline verification. Avoid broad "compliance product" positioning.

## Remaining Approval Gates

1. Review this audit and the generated V1 backup archive.
2. Run the full release gate locally.
3. Create or update a GitHub PR from `website-v2-redesign`.
4. Attach Browser screenshots and release-check output.
5. Merge only after required GitHub checks pass.
6. Deploy, smoke-test the manifest and `/en/verify`, then keep the V1 rollback
   tag and archive available.

## Audit Evidence From 2026-05-17

Local checks completed:

| Check | Result | Notes |
|---|---|---|
| `bun run check:release` | Pass | Build, package tests, server typechecks, claim lint, manifest, campaign, strategy, public-surface, interop, package smoke, and production-start smoke passed. |
| `bun audit` | Pass | No vulnerabilities found after the Next/Vitest/PostCSS upgrade and PostCSS override. |
| `bun run check:public-surface` | Pass | Stale repo links, package version drift, Dependabot presence, and public-surface claim guard passed. |
| `DRY_RUN=1 ./scripts/public-repo-split.sh` | Pass | Dry-run listed public repos and private paths to strip before generating the verified public split. |
| npm registry sanity | Pass | `@lexitsp/sdk` resolves to `3.0.0-alpha.6`; `@lexitsp/trustbadge-react` resolves to `0.2.2`. |
| Browser QA | Pass | `/en`, `/en/docs`, `/en/spec`, `/en/verify`, and mobile `/en` rendered with zero console errors. |
| Verifier loop | Pass | `/en/verify` sample starts `VERIFIED`, tamper flips invalid, reload sample returns `VERIFIED`. |

Non-blocking observations:

- Next.js emitted cache-invalidation warnings from `next-intl` dynamic imports during build, but the build completed successfully.
- Git reports LF-to-CRLF warnings on Windows. No whitespace errors were reported by `git diff --check`.
- GitHub Pages is not configured for `LexiTSP/tsp-site`; this is not a blocker because production deploy uses the external Hetzner workflow.
