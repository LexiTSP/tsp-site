# Security Policy

TSP is security-sensitive software: envelopes, manifests, signatures, revocation, TSA verification, and reviewer decisions are all trust boundaries.

## Supported Versions

The current alpha line is:

- `@lexitsp/sdk` `3.0.0-alpha.6`
- `@lexitsp/trustbadge-react` `0.2.2`
- Risk, Evidence, and Oversight `0.1.0-alpha.*` for licensed pilot use only

Alpha APIs may change, but security reports against the current code are welcome.

## Reporting A Vulnerability

Report suspected vulnerabilities privately to `security@lexico.no`.

Please include:

- A short description of the issue and affected package/module.
- Reproduction steps or a minimal proof of concept.
- Whether the issue affects signing, verification, manifest trust, revocation, TSA/DANE, content retention, auth, or reviewer signing.
- Any known impact on existing envelopes or manifests.

Do not open a public issue for a vulnerability before LexiCo has had time to assess and coordinate a fix.

## Security Boundaries

In scope:

- Signature bypass or incorrect `valid: true` verification.
- Manifest, certificate-chain, revocation, DANE, TSA, or sequence rollback bugs.
- Persistence of content in Risk/Evidence/Oversight where docs promise pointer-only or temporary storage.
- Auth bypass in commercial module APIs.
- Reviewer decision forgery or server-side private-key handling.

Out of scope for this repo:

- Vulnerabilities in customer AI models or prompts.
- Legal sufficiency of a customer deployment.
- Social engineering against LexiCo or pilot customers.

## Disclosure

LexiCo will acknowledge credible reports, investigate, and coordinate a fix or mitigation. Public disclosure should wait until a patched release or documented mitigation is available.
