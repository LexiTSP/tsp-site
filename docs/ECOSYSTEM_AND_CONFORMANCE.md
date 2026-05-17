# TSP Ecosystem and Conformance Program

Purpose: make TSP useful to someone unrelated to LexiCo in under one hour, then make that work visible.

## One-Hour Implementer Path

The first external builder should be able to:

1. install `@lexitsp/sdk`;
2. run the playground or CLI;
3. sign one sample answer;
4. change one byte and watch cryptographic verification fail;
5. host or mock a manifest;
6. run `bun run check:interop`;
7. decide whether they are building a verifier, issuer, or manifest authority.

The public path is:

- `README.md` for setup;
- `docs/FIRST_ADOPTER_KIT.md` for Gate A;
- `docs/PORTING-GUIDE.md` for other languages;
- `fixtures/v3.0` for canonical pass/fail vectors;
- `scripts/interop-verify.mjs` for SDK-independent fixture checks.

## Conformance Levels

| Level | Required Behavior | Public Signal |
|---|---|---|
| Verifier | parse envelope, recompute content and ledger hashes, verify Ed25519 signature and manifest chain | fixture pass report |
| Issuer | everything in Verifier plus envelope creation, canonical JSON, signing, keyRef, and timestamp policy | round-trip report |
| Manifest authority | everything in Issuer plus root key, instance certs, revocation, and sequence handling | hosted manifest report |

## Compatibility Listing

An implementation can be listed when it provides:

- repository URL or package URL;
- language and runtime versions;
- conformance level;
- fixture result transcript;
- license;
- maintainer contact;
- known gaps.

Listing means "claims compatibility with the TSP fixtures." It is not an endorsement and not a security certification.

## TSP Compatibility Mark

Use "TSP-compatible" only for implementations or services that publish:

- the supported TSP wire version;
- the conformance level;
- a manifest URL or verification instructions;
- fixture results or a public verifier transcript.

Do not use "certified" until a separate governance body, review process, and dispute path exist.

## Ecosystem Metrics

Public metrics should distinguish current counts from targets:

- named external Gate A validations;
- independent implementations;
- fixture pass reports;
- public integrations;
- external contributors;
- SDK downloads;
- public verifier runs if telemetry is explicitly opt-in.

Zero is an acceptable number. Hidden zero is not.
