# Brand and Stack Overview

## Brand Architecture

Current decision:

- Company / operator: LexiCo AS
- Product shorthand: TSP
- Plain-language product line: TSP is the receipt layer for AI work.
- Market/category line: Open verification for regulated AI.
- Formal protocol: Trust Standard Protocol
- Domain: truststandardprotocol.com
- Technical names: `tsp` CLI, `@lexitsp` packages, TrustEnvelope, `/.well-known/tsp-manifest.json`

Recommended public phrasing:

```text
LexiCo AS builds TSP, the receipt layer for AI work.

Open verification for regulated AI.
Powered by Trust Standard Protocol.
```

Recommended metadata phrasing:

```text
TSP — open verification for regulated AI.
Signed, verifiable receipts for AI answers, decisions, and oversight.
```

Recommended homepage framing:

```text
Open verification for regulated AI.

TSP turns AI work into signed receipts: what was produced, by which system,
under which process, and whether the record still verifies.
```

## Naming Boundaries

Do change public-facing copy first:

- Homepage and metadata
- Footer language
- About/company references
- README positioning
- Contact and commercial wording where useful

Do not rename these during the first pass:

- `truststandardprotocol.com`
- `/home/tsp/tsp-site`
- `tsp-site.service`
- `tsp` CLI
- `@lexitsp` packages
- TrustEnvelope
- `/.well-known/tsp-manifest.json`
- GitHub repo and deploy workflow names

Reason: the current technical names are already wired into package identity,
manifest URLs, deploy scripts, server paths, documentation, and external
verification. A public copy pass gives the project a clearer market story
without creating compatibility or deployment risk.

## Current Production Stack

Observed production flow:

```text
Cloudflare -> Caddy on Hetzner -> Bun -> Next.js on port 3838
```

Server facts:

- VPS provider: Hetzner
- Reverse proxy: Caddy
- App runtime: Bun running `next start -p 3838`
- App directory: `/home/tsp/tsp-site`
- Deploy user: `tsp`
- Git remote: `https://github.com/LexiTSP/tsp-site.git`
- Public site repo: `tsp-site`
- Data directory: `/home/tsp/data`

Current production does not appear to require a separate web database for the
public website. Backend/pilot modules in the repo use SQLite where needed.

## Is This Stack Appropriate?

Short answer: yes, for the current stage.

This stack is a good fit for a public-alpha protocol site because it is simple,
cheap, reproducible, and easy to reason about:

- Next.js is appropriate for a documentation-heavy product site with interactive
  proof surfaces.
- Bun is acceptable for this repo because the package and backend tooling already
  use Bun heavily.
- Caddy is a strong fit for a small production server: simple HTTPS/reverse proxy
  config, clean headers, and low operational overhead.
- Cloudflare is useful here for DNS, edge TLS, caching, and shielding the origin.
- Hetzner is cost-effective and avoids early managed-platform lock-in.
- SQLite is reasonable for pilot/backend modules when the workload is small,
  local, and operational simplicity matters.

The stack is not the final answer for every future version. It should change
only when real constraints appear.

## When To Keep This Stack

Keep the current stack if the main needs are:

- Public website and protocol documentation
- Browser verifier and playground
- Static or mostly-static pages
- Low-cost production hosting
- Simple origin control
- Small pilot services
- Reproducible self-hosting story
- No heavy multi-tenant database workload yet

## When To Upgrade

Consider changes when one of these becomes true:

- The commercial backend becomes multi-tenant with real customer data.
- You need strict audit retention, role-based access, and operational reporting.
- SQLite files become hard to back up, restore, or coordinate safely.
- Deploys need blue/green or zero-downtime guarantees.
- Multiple app servers are needed.
- Background jobs, queues, or scheduled processing become core behavior.
- Observability needs exceed `journalctl`, Caddy logs, and simple smoke checks.

Likely future upgrades:

- Postgres for commercial control-plane data.
- Object storage for evidence packages and exports.
- A queue/worker layer for evidence generation, verification jobs, and webhooks.
- Proper observability: uptime checks, structured app logs, error reporting, and
  deployment dashboards.
- Blue/green or artifact-based deploys once downtime or host-build drift matters.

## Practical Recommendation

Do not rebuild the infrastructure now.

First, make the brand/copy pass:

```text
LexiCo AS builds TSP, the receipt layer for AI work.
Open verification for regulated AI.
Powered by Trust Standard Protocol.
```

Then run the normal validation gates:

```bash
bun run check:claims
bun run check:campaign
bun run build
```

After that, deploy through the existing GitHub/Hetzner flow.

The current stack is good enough for the public protocol surface. The next
engineering improvements should focus on release cleanliness, production
observability, backup verification, and eventual database architecture for paid
backend services.
