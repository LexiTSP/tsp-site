# TSP — Trust Standard Protocol

Public site, open specification, reference SDK, and TrustBadge package for cryptographically checkable AI provenance.

TSP wraps important AI outputs as signed `TrustEnvelope` receipts. A recipient, auditor, or browser verifier can check the envelope signature, content hash, issuer manifest, and timestamp evidence against the public specification instead of trusting a vendor dashboard.

Canonical site: https://truststandardprotocol.com

## Public Alpha Status

TSP is in public alpha. The open standard layer is public:

- Public site and documentation
- `@lexitsp/sdk`
- `@lexitsp/trustbadge-react`
- Interop fixtures and local verification flows

Commercial hosted tools for Risk, Evidence, Oversight, and implementation support are separate pilot offerings and are not included in this public repository.

## Workspace Contents

```text
tsp-site/
├── src/app/[locale]/              Next.js 15 App Router pages for Norwegian and English
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
