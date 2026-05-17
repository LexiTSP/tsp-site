# TSP v3 Core Stability Guarantee

Purpose: make the protocol feel stable enough to implement while staying honest about public-alpha status.

## Stability Statement

TSP v3 core is treated as a frozen wire contract for public-alpha implementers. Breaking changes require a new major wire version. Clarifications, examples, and optional extensions may evolve without changing the v3 core.

This is a stability promise from the current maintainers, not recognition by a standards body.

## Normative Core

The v3 core consists of:

- `tsp: "3.0"` wire version;
- RFC 8785 canonical JSON behavior;
- SHA-256 content hash and ledger hash behavior;
- Ed25519 signature domain and verification rules;
- manifest root key, instance certificates, and revocation list shape;
- RFC 3161 timestamp token field and production policy;
- named local and online verification checks;
- `fixtures/v3.0` canonical valid and invalid vectors.

## Optional or Experimental

| Feature | Status | Compatibility Rule |
|---|---|---|
| DANE binding | Optional | verifiers may support it, but HTTPS well-known manifest remains the Gate A path |
| external anchoring | Experimental | must not be required for v3 envelope validity |
| tombstone pattern | Informative | may be used for redaction workflows, but v3 verification must still explain hash breakage |
| hosted Risk, Evidence, Oversight | Commercial alpha | never required to issue or verify a TrustEnvelope |

## Compliance Matrix

| Capability | Required | Optional | Experimental |
|---|---:|---:|---:|
| Envelope schema version | Yes |  |  |
| RFC 8785 canonicalization | Yes |  |  |
| SHA-256 content hash | Yes |  |  |
| Ed25519 envelope signature | Yes |  |  |
| Manifest-backed issuer identity | Yes |  |  |
| Instance certificate chain | Yes |  |  |
| Revocation list check | Yes for online verification |  |  |
| RFC 3161 TSA token | Yes for production issuing |  |  |
| DANE/TLSA manifest binding |  | Yes |  |
| External anchoring |  |  | Yes |
| Hosted Risk/Evidence/Oversight |  | Yes |  |

## Change Policy

- Clarifying language: patch.
- New optional field: minor, only when old envelopes remain valid.
- Change to canonicalization, signature domain, required hash fields, or manifest chain: major.
- Every change that affects validators must include fixture updates.

## Deprecation Policy

A future major version must keep v3 verification support in the reference SDK for at least five years after deprecation starts, because old signed envelopes still need to be checked.
