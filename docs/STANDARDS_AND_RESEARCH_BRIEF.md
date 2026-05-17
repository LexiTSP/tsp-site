# TSP Standards and Research Brief

Purpose: create institutional signals the honest way: by asking for review, participating in adjacent forums, and publishing technical material that can be criticized.

## Positioning

TSP is not an official standard. It is a public-alpha open specification and reference implementation for cryptographically checkable AI output provenance.

The standards goal is to make the evidence object narrow, interoperable, and inspectable enough that other institutions can evaluate it.

## Review Targets

Prioritize review from:

- applied cryptography reviewers;
- AI assurance researchers;
- public-sector digital trust forums;
- standards-adjacent working groups;
- compliance and audit practitioners;
- open-source implementation maintainers.

## Papers and Technical Notes to Publish

| Paper | Purpose | Owner |
|---|---|---|
| TSP threat model | document what the envelope proves and does not prove | protocol maintainer |
| Cryptographic rationale | justify canonicalization, signature domain, manifest chain, TSA, and revocation design | security reviewer |
| Interoperability report | record fixture behavior across implementations | working group or external implementer |
| AI Act evidence mapping | map TSP fields to evidence support without claiming legal compliance | compliance reviewer |
| Governance transition note | explain how LexiCo-led alpha becomes working-group governance | maintainer group |

## Outreach Language

Use review language:

> We are developing a public-alpha evidence format for AI output provenance. We are looking for critique of the protocol shape, fixture coverage, and failure modes before wider adoption.

Avoid endorsement language:

- accepted by;
- approved by;
- aligned with because a named body said so;
- official standard;
- compliance guarantee.

## Publication Rule

Every external review should produce one of:

- a public link;
- a quote-approved summary;
- a private note recorded as "not public";
- an issue or RFC opened from the feedback.

Silence is not validation.
