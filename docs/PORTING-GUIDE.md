# TSP Porting Guide — Implement TSP in Other Languages

> Hvordan implementere TSP-spec-en (`TSP/3.0`) i et språk eller miljø som ikke er TypeScript. Hvis du leser dette, vurderer du å lage en referanse-implementasjon — takk.
>
> Dette dokumentet er skrevet på engelsk (med norsk note) fordi tredjeparts-implementasjoner sannsynligvis ikke er norsk-talende, og fordi spec-en er det kontraktuelle laget mellom implementasjoner.

---

## 1 · Why port TSP?

TSP is intentionally an open standard (CC-BY 4.0 spec, MIT reference SDK). The reference implementation is TypeScript because Node/Bun gives a fast path for SDK, CLI and browser playground work. But the format is language-agnostic, and the standard's value compounds with each additional implementation.

Reasons you might port:

- **Different runtime:** You run AI inference in Python, Go, Rust, Java, .NET, or PHP, and want native TSP wrap/verify without shelling out to Node.
- **Different platform:** Mobile (Swift, Kotlin), embedded (Rust, C), or constrained environments where the JS SDK is too heavy.
- **Different ecosystem:** A vendor or framework that has its own auth/crypto infrastructure and wants to integrate TSP idiomatically.
- **Standard credibility:** The TSP standard becomes more credible as a *standard* the more independent implementations exist (charter §5).

---

## 2 · Conformance levels

A TSP implementation may target one of three levels:

| Level | What it does | Minimum required |
|---|---|---|
| **Verifier** | Parses and verifies envelopes signed by others | RFC 8785, Ed25519 verify, SHA-256, manifest fetch, 10 verify-checks |
| **Issuer** | Generates and signs envelopes | All of Verifier + Ed25519 sign + canonical-JSON serialization + RFC 3161 client (or skip-TSA dev mode) |
| **Manifest authority** | Issues and revokes certs in a TSP manifest | All of Issuer + cert lifecycle + manifest signing |

Most ports start with **Verifier-only** because it's the simplest and the highest-leverage — it lets the language ecosystem verify envelopes from any TSP issuer.

---

## 3 · Required cryptographic primitives

The reference implementation uses standard primitives available in nearly every modern language:

| Primitive | Why | Common library |
|---|---|---|
| **Ed25519** | Signature algorithm | `ed25519-dalek` (Rust), `cryptography` (Python), `nacl` (most), built-in (Go 1.13+) |
| **SHA-256** | Content hashing | Standard library in nearly every language |
| **HMAC-SHA256** | Webhook auth (only for platform integrations, not core protocol) | Standard library |
| **RFC 8785 (JCS)** | Canonical JSON serialization | Less common — you may need to implement |
| **RFC 3161** | Time-stamping client (optional in dev mode) | `cryptography` (Python), `bouncycastle` (Java), various others |
| **X.509** | Certificate chain validation | Standard in most languages |

**The hardest part for most ports is RFC 8785 (JCS).** It's a specific JSON canonicalization spec — number formatting, key sorting, Unicode normalization. The reference implementation lives in `packages/lexitsp-sdk/src/v3/canonical.ts` and includes test vectors. **You must produce byte-identical output to the reference for the same input** — otherwise hashes won't match across implementations.

---

## 4 · Test vectors

The spec ships with canonical test vectors at `spec/test-vectors/3.0/`. Your implementation **must** pass all of them to be conformant. Categories:

- **Canonical JSON:** Input → expected canonical bytes
- **SHA-256:** Canonical bytes → expected hex digest
- **Ed25519:** Key + message → expected signature (deterministic)
- **Wrap roundtrip:** Inputs → expected envelope (signed by a known test key)
- **Verify positive:** Valid envelope → all 10 checks pass
- **Verify tamper cases:** Modified envelopes → specific check fails

If your port passes the test vectors and can wrap/verify against the reference SDK, you have a conformant implementation.

---

## 5 · API shape (suggestion)

You don't have to mirror the TypeScript API exactly. Idiomatic naming in the host language is preferred. But the conceptual surface should include:

```
// Issuer surface
generateKeyPair() -> KeyPair
wrap(content, source, process, alignment, signer, manifestRef, options) -> TrustEnvelope

// Verifier surface
verifyLocal(envelope, manifest, options) -> VerifyResult { ok, checks[], failures[] }
fetchManifest(url) -> Manifest

// Manifest authority surface (optional)
manifestInit(orgIdentity) -> Manifest
certAdd(manifest, cert) -> Manifest
certRevoke(manifest, certId, reason) -> Manifest
```

Type-system bindings for `source`, `process`, `alignment` should enforce charter §3 — discriminated unions where applicable. In Rust this is `enum`; in Python, use TypedDict + Literal types or pydantic models.

---

## 6 · The 10 verify-checks (must implement all)

Every conformant verifier runs these and reports which failed:

1. `canonical-rebuild` — re-canonicalize content, recompute contentHash, compare to envelope.contentHash
2. `signature-verify` — Ed25519 verify(envelope.signatures[0], sigDomain || contentHash, manifest.signingKey)
3. `cert-chain` — verify manifest.signingCert chains to manifest.orgRoot
4. `cert-not-revoked` — check cert is not in manifest.revokedCerts
5. `ledger-chain` — if previousEnvelopeId is present, verify chainHash = SHA256(prev.ledger || ledgerDomain)
6. `tsa-timestamp` — verify RFC 3161 token against operator-configured trust list
7. `previous-envelope-exists` — soft check, often skipped in stateless verifiers
8. `alignment-schema-form` — alignment field validates against schema
9. `source-schema-form` — source field validates against schema (charter §3 unions)
10. `process-schema-form` — process field validates against schema

Order is not strictly required, but failure reporting must use these names so cross-implementation debugging works.

---

## 7 · Domain separation

The reference SDK uses two domain prefix strings before signing:

- `sigDomain = "TSP-SIG-v3"` — prefixed before contentHash for signature
- `ledgerDomain = "TSP-LEDGER-v3"` — prefixed before previous ledger for chainHash

These are byte-identical between wrap and verify. **Do not change them in your port** — that would break interop. Source: `packages/lexitsp-sdk/src/v3/crypto.ts`.

---

## 8 · How to register your implementation

Once you have a port that passes all test vectors:

1. **Open an issue** on `github.com/LexiTSP/spec` with tag `implementation-claim`.
2. **Provide:**
   - Repository URL
   - Language + runtime versions supported
   - Conformance level (Verifier / Issuer / Manifest Authority)
   - Test vector results (typically a CI link)
   - License (we suggest MIT or Apache 2.0 to match the ecosystem)
3. **We list it** in `IMPLEMENTATIONS.md` after a brief review.

We do **not** vet or endorse implementations — listing means "this implementation claims conformance and passes test vectors." Users should run their own validation.

---

## 9 · Things we'd love to see

In rough priority order, the ports that would unlock the most adoption:

1. **Python** — most AI/ML stacks have Python in them somewhere; even if inference is via API, audit/verify code lives in Python.
2. **Rust** — performance-sensitive verifiers, embedded use, browser via WASM.
3. **Go** — backend services, K8s operators, CLI tools.
4. **Java/Kotlin** — enterprise, regulated sector, mobile.
5. **Swift** — iOS apps with on-device verify.
6. **C# / .NET** — public sector, financial services.

We're happy to support any of these. Open an issue early — we'd rather help you avoid known foot-guns than review a finished port.

---

## 10 · What stays in TypeScript (for now)

The reference implementation will continue to be maintained primarily in TypeScript through `@lexitsp/sdk`. Spec changes go through the RFC process (see `SPEC-GOVERNANCE.md`); the TS SDK gets updated first because it's the canonical implementation.

Other implementations should track spec versions, not SDK versions. A port targeting `TSP/3.0` should remain valid as long as `TSP/3.0` is the current major version.

---

## 11 · Charter bindings on implementations

If your port wants to be listed as conformant, it must:

- **§5:** Be open-source under MIT, Apache 2.0, BSD, or similar permissive license.
- **§5:** Ship with empty default TSA trust list. Operators opt in.
- **§3:** Enforce explicit-declaration unions in the type system, not silent optionality.
- **§9:** Implement verify support for at least the previous major spec version (currently `TSP/2.x` if you're on `TSP/3.x`).

We do **not** enforce charter §6 (language=architecture) on third-party implementations beyond requiring accurate description of conformance level.

---

## 12 · Norsk note

(For norsk-talende lesere som vurderer en port:)

Hvis du vurderer en TSP-implementasjon i et annet språk: ta kontakt tidlig. Vi vil heller hjelpe deg unngå designfeller enn vurdere en ferdig port. Spec-en er stabil (`TSP/3.0`), test-vektorene er stabile, og charteret er bindende — men vi er åpne for at idiomatisk API-design varierer mellom språk. E-post: julian@lexico.no.

---

## 13 · Contact and resources

- **Spec:** `https://truststandardprotocol.com/spec` and `github.com/LexiTSP/spec`
- **Test vectors:** `spec/test-vectors/3.0/`
- **Reference SDK:** `github.com/LexiTSP/sdk`
- **RFC process:** `docs/SPEC-GOVERNANCE.md`
- **Email:** julian@lexico.no
- **Issues / questions:** `github.com/LexiTSP/spec/issues`

---

*Last updated 2026-05-09. This guide will evolve as ports happen — feedback from real implementers will reshape it.*
