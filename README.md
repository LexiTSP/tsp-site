# TSP - Trust Standard Protocol

Public site, open specification, reference SDK, TrustBadge package, fixtures, and release checks for cryptographically checkable AI provenance.

TSP wraps important AI outputs as signed `TrustEnvelope` receipts. A recipient, auditor, or browser verifier can check the envelope signature, content hash, issuer manifest, and timestamp evidence against the public specification instead of trusting a vendor dashboard.

Canonical site: https://truststandardprotocol.com

## Public Alpha Status

TSP is in public alpha. The open protocol layer is public:

- public site and documentation;
- `@lexitsp/sdk`;
- `@lexitsp/trustbadge-react`;
- interop fixtures and local verification flows;
- release checks for public-surface claims.

Commercial hosted tools for Risk, Evidence, Oversight, and implementation support are separate pilot offerings and are not included in this public repository.

## Canonical Surface

| Surface | Public convention |
| --- | --- |
| Trust root | `/.well-known/tsp-manifest.json` |
| Canonicalization | RFC 8785 / JCS basis |
| Offline verification | `verifyLocal()` |
| Network-backed verification | `verifyOnline()` |
| Public package scope | `@lexitsp` |

Older manifest-route examples should be treated as stale documentation and removed during release review.

## Maturity And Proof Path

The public site should separate four layers clearly:

- **Required core:** TrustEnvelope structure, hashing, signing, manifest discovery, and verification modes.
- **Informative examples:** SDK snippets, playground flows, starter paths, and UI examples.
- **Experimental extensions:** anchoring, tombstones, sector evidence packs, and future language implementations until backed by fixtures and review.
- **Pilot support:** operational workflows layered on top of signed envelopes.

The next proof milestones are external implementations, public pilot proof packs, independent review, and a public RFC/working-group lane. Do not imply these exist until a public artifact exists.

## Workspace Contents

```text
tsp-site/
├── src/app/[locale]/              Next.js App Router pages for Norwegian and English
├── src/components/                Site components, verifier UI, playground UI, shared layouts
├── messages/                      `no.json` and `en.json` translations
├── fixtures/v3.0/                 TSP test vectors
├── packages/lexitsp-sdk/          Public SDK workspace package
├── packages/trustbadge-react/     Public React TrustBadge workspace package
├── scripts/                       Public release, claim-lint, interop, manifest, and smoke scripts
└── docs/                          Public protocol and adopter documentation
```

## Quick Start

Requirements:

- Bun 1.x
- Node.js 18+ for compatibility with some tooling

```bash
bun install
bun run dev
```

The local site runs on:

```text
http://localhost:3838
```

Public release check:

```bash
bun run check:release
```

## Key Routes

- `/` and `/en`
- `/docs` and `/en/docs`
- `/spec` and `/en/spec`
- `/playground` and `/en/playground`
- `/verify` and `/en/verify`
- `/.well-known/tsp-manifest.json`
- `/examples/manifest.json`

## Packages

- `@lexitsp/sdk`
- `@lexitsp/trustbadge-react`

The public npm scope is `@lexitsp`.

## Security

Report suspected vulnerabilities privately. See [`SECURITY.md`](SECURITY.md).

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).
