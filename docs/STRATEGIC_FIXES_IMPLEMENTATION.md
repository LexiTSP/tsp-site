# TSP Strategic Fixes Implementation Map

This file closes the findings from `TSP_Weaknesses_and_Strategic_Fixes.md` by turning each weakness into a maintained public artifact, a measurable next action, and a release assertion.

## Status Boundary

TSP is public alpha infrastructure. The open layer is real: public site, SDK, TrustBadge, fixtures, manifest checks, clean-room interop checks, and local cryptographic verification. The missing proof is ecosystem proof: named external use, non-LexiCo implementations, independent review, and visible adoption metrics.

Do not describe these missing signals as complete until the evidence exists.

## Finding to Fix Map

| Finding | Concrete Fix | Evidence Artifact |
|---|---|---|
| Limited external validation | Define Gate A, review packages, evidence record, reviewer brief, and non-LexiCo integration rule. | `docs/EXTERNAL_VALIDATION_PROGRAM.md` |
| Ecosystem gravity is early | Create one-hour implementer path, conformance levels, compatibility listing, and ecosystem metrics. | `docs/ECOSYSTEM_AND_CONFORMANCE.md` |
| Protocol maturity signaling | Separate normative core from optional extensions; freeze v3 core behavior; publish compliance matrix. | `docs/TSP_V3_CORE_STABILITY_GUARANTEE.md` |
| Governance centralization | Create transparent working-group stages, RFC lifecycle, current maintainer disclosure, and expansion criteria. | `docs/WORKING_GROUP_CHARTER.md` |
| Adoption narrative is too technical | Translate protocol mechanics into buyer outcomes for concrete sectors without compliance overclaims. | `docs/INDUSTRY_ADOPTION_NARRATIVES.md` |
| Missing institutional signals | Publish a standards and research outreach brief that asks for review rather than implying endorsement. | `docs/STANDARDS_AND_RESEARCH_BRIEF.md` |
| Too-early perception | Pick one beachhead, define production evidence, and publish honest public metrics. | `docs/PUBLIC_METRICS.md` |

## Release Gate

`bun run check:strategy` asserts that the core artifacts exist and keep the honest public-alpha status visible:

- Gate A is still named and measurable.
- v3 core stability is documented.
- conformance levels and one-hour implementation path exist.
- governance centralization is disclosed.
- metrics distinguish current counts from targets.
- forbidden claims such as authority acceptance, official standard status, and compliance guarantees are absent.

## Operating Rule

The next phase is not to add more generic pages. The next phase is to convert one artifact into one external event:

1. a named external organization signs a TrustEnvelope with its own key and DNS-hosted manifest;
2. a non-LexiCo implementation passes the fixtures;
3. an external reviewer publishes a cryptographic, architectural, or interoperability review;
4. one vertical pilot produces a redacted public evidence note.

Until one of those happens, TSP should speak as a serious public-alpha protocol, not as established industry infrastructure.
