# TSP — Trust Standard Protocol

Open specification and reference implementation for cryptographically checkable AI provenance.

TSP wraps an AI output in a signed `TrustEnvelope`. A recipient, auditor, or browser verifier can check the envelope signature, content hash, issuer manifest, and timestamp evidence against the public specification instead of trusting a vendor dashboard.

Canonical site: https://truststandardprotocol.com

## Public Alpha Status

TSP is in public alpha. The open standard layer is public; the commercial hosted pilot tools are private alpha services.

- Public GitHub organization: `LexiTSP`
- Public npm scope: `@lexitsp`
- Public repositories: `LexiTSP/tsp-site`, `LexiTSP/sdk`, `LexiTSP/trustbadge-react`
- Public packages: `@lexitsp/sdk`, `@lexitsp/trustbadge-react`
- Commercial hosted pilot tools: Risk, Evidence, Oversight, and Control Plane

Until an external organization signs a TrustEnvelope with its own key and DNS-hosted manifest, TSP should be described as an open specification plus reference implementation.

## Repository Contents

This repository contains the public website and documentation for TSP, plus the public package workspaces used by the site.

```text
tsp-site/
├── src/app/[locale]/          Next.js 15 App Router pages for Norwegian and English
├── src/components/            Site components, verifier UI, playground UI, shared layouts
├── messages/                  `no.json` and `en.json` translations
├── fixtures/v3.0/             TSP-Spec-1.0-Candidate test vectors
├── packages/lexitsp-sdk/      Public SDK workspace package
├── packages/trustbadge-react/ Public React TrustBadge workspace package
├── scripts/                   Release, claim-lint, interop, manifest, and smoke scripts
├── docs/                      Public alpha docs, first adopter kit, launch docs, runbooks
└── infra/                     Optional deployment infrastructure
```

The public split intentionally excludes the private commercial backend packages.

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

Build and release checks:

```bash
bun run build
bun run check:claims
bun run check:interop
bun run smoke:packages
bun run check:release
```

`bun run check:release` is the public release gate. It runs the production build, package tests, Charter §6 claim-lint, clean-room interop fixture checks, package smoke, manifest smoke, and production-start smoke.

## Public Routes

The site is bilingual. Norwegian is the default route set, and English routes are prefixed with `/en`.

Key routes:

- `/` and `/en`
- `/docs` and `/en/docs`
- `/spec` and `/en/spec`
- `/playground` and `/en/playground`
- `/verify` and `/en/verify`
- `/priser` and `/en/priser`
- `/.well-known/tsp-manifest.json`
- `/examples/manifest.json`

The manifest shipped in public alpha is a demo identity for site and verifier smoke tests. Replace it with production root and instance keys before using it as external Gate A evidence.

## npm Packages

Public packages are published from their dedicated repositories:

- `@lexitsp/sdk`
- `@lexitsp/trustbadge-react`

Clean install smoke:

```bash
npm init -y
npm install @lexitsp/sdk@alpha @lexitsp/trustbadge-react@alpha react react-dom
npx tsp --help
```

The public npm scope is `@lexitsp`. It is separate from LexiCo's private GitHub Packages scope.

## Charter §6

TSP copy is treated as part of the architecture. Public language must match what the code and specification actually support.

Avoid overclaims such as:

- transport-protocol metaphors that TSP does not implement
- broad proof claims that exceed the envelope checks
- unsupported compliance guarantees
- production claims for alpha services
- claims that a regulator accepts TSP unless that has been confirmed in writing

Prefer concrete language:

- signed TrustEnvelope
- local verification of signature and content hash
- manifest-backed issuer identity
- public alpha reference implementation
- commercial hosted pilot alpha

The release gate includes a bilingual claim-lint to keep this discipline in CI.

## Gate A

The next protocol validation milestone is Gate A:

```text
A named external organization signs a TrustEnvelope with its own key,
its own DNS-hosted manifest, and integration code not written by LexiCo.
```

The first adopter kit is in [`docs/FIRST_ADOPTER_KIT.md`](docs/FIRST_ADOPTER_KIT.md).

## Security

Report suspected vulnerabilities privately. See [`SECURITY.md`](SECURITY.md).

Security-sensitive areas include envelope verification, signature validation, manifests, revocation, DANE, TSA evidence, and reviewer decisions.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

Contributions should preserve the boundary between:

- the open standard layer: specification, SDK, TrustBadge, fixtures, docs, and local verifier tooling
- the commercial hosted pilot layer: Risk, Evidence, Oversight, and Control Plane

The open standard path must remain useful without LexiCo-hosted infrastructure.

## License

- `@lexitsp/sdk`: MIT
- `@lexitsp/trustbadge-react`: MIT
- TSP specification text: CC BY 4.0
- Website content and brand assets: Copyright LexiCo AS
- Commercial hosted pilot tools: separate commercial terms

LexiCo AS, Tonsberg, Norway.
