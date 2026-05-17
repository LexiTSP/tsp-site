# Contributing To TSP

TSP is split into two zones:

- Open specification zone: spec, `@lexitsp/sdk`, TrustBadge, examples, docs, and local verification tooling.
- Commercial tools zone: Risk, Evidence, Oversight, and hosted pilot operations.

Contributions should preserve that boundary. The open specification must stay useful without LexiCo-hosted infrastructure.

## Development

Use Bun from the workspace root:

```sh
bun install
bun run dev
bun run check
```

Before release-oriented changes, also run:

```sh
bun run check:release
```

`bun run check` runs the production build, package tests, and server typechecks. `bun run check:release` adds a clean package smoke for SDK and TrustBadge.

## Charter Rules

Charter §6 is the practical review rule: language must match what the code actually guarantees.

Avoid claims such as:

- transport-protocol metaphors that TSP does not implement
- unsupported proof or compliance guarantees
- "Production-ready" for alpha modules
- Finished self-serve SaaS or dashboard claims before those flows exist

Prefer concrete language:

- "Signed TrustEnvelope"
- "AI provenance that recipients can check against signatures, hashes, and manifests"
- "Local verify"
- "Paid pilot backend"
- "Hosted pilot alpha"

## Pull Request Checklist

- Keep public standard and commercial tooling boundaries explicit.
- Add or update tests when behavior changes.
- Update docs when user-facing claims, command names, test totals, or readiness status changes.
- Run `bun run check`; for release changes, run `bun run check:release`.
- Do not add phone-home checks, LexiCo token requirements, or hosted dependencies to the open standard path.

## Security

Do not report vulnerabilities in public issues. See `SECURITY.md`.
