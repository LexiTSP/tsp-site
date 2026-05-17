# TSP External Validation Program

Purpose: remove the biggest credibility bottleneck by making third-party validation concrete, repeatable, and public when the participant allows it.

## What Counts

External validation counts only when at least one of these happens:

1. **Gate A protocol validation:** a named external organization signs a TrustEnvelope with its own key, hosts its own manifest at `https://<domain>/.well-known/tsp-manifest.json`, and produces a passing independent verifier result.
2. **Independent implementation:** a non-LexiCo verifier or issuer passes `fixtures/v3.0` and publishes its own repository or reproducible test output.
3. **Independent technical review:** a cryptographer, security engineer, standards participant, or architecture reviewer publishes a review, or provides a review that can be quoted with permission.
4. **Public integration:** a third-party product exposes TSP envelopes, TrustBadge output, or manifest-backed issuer identity without LexiCo-written integration code.

LexiCo-authored demos, localhost manifests, internal pilots, and private screenshots do not count as external validation.

## Gate A Evidence Package

Every Gate A record must include:

- organization name, or a reason the name cannot be public yet;
- manifest URL;
- envelope fixture, redacted envelope, or hash plus verifier transcript;
- command used to verify signature, content hash, manifest signature, instance certificate, and ledger hash;
- whether the implementation used `@lexitsp/sdk`, clean-room code, or another language;
- what the adopter found confusing in the written spec.

## Reviewer Packages

Prepare three review tracks:

| Track | Reviewer | Deliverable |
|---|---|---|
| Cryptographic review | applied cryptographer or security engineer | signing domain, canonicalization, key lifecycle, TSA and manifest review |
| Architecture review | distributed systems or platform engineer | manifest hosting, revocation, rollout, failure modes, production deploy path |
| Interop review | external implementer | fixture pass/fail report and spec ambiguity notes |

## Outreach Targets

Start with low-friction groups before enterprise procurement:

- open-source AI infrastructure projects;
- academic labs with AI assurance, digital trust, or applied cryptography interest;
- independent compliance or security consultancies;
- small SaaS tools selling into regulated domains;
- public-sector digital trust forums where "review request" is acceptable language.

## Public Wording Rule

Allowed wording before external proof:

> TSP is a public-alpha open specification and reference implementation. The next validation milestone is a named external organization signing with its own key and DNS-hosted manifest.

Allowed wording after Gate A:

> TSP has passed one external protocol validation: a named organization signed with its own key and DNS-hosted manifest, and the envelope was checked independently.

Avoid wording that implies regulator acceptance, auditor acceptance, official EU-standard status, per-request compliance, industry-standard status, or a production-proven ecosystem before evidence exists.
