# TSP Working Group Charter

Purpose: reduce governance centralization without pretending that independent governance already exists.

## Current Status

TSP is currently maintained by LexiCo AS. The open protocol and public packages are available for use and contribution, but the working group is not yet an independent foundation, consortium, or standards body.

This disclosure is intentional. Governance credibility begins by saying who actually controls the process today.

## Governance Layers

| Layer | Current Owner | Target State |
|---|---|---|
| Open protocol spec | LexiCo maintainers | TSP Working Group with external maintainers |
| Test vectors and interop suite | LexiCo maintainers | open governance with fixture review |
| SDK and TrustBadge reference packages | LexiCo maintainers | maintainers plus external contributors |
| Compatibility mark | LexiCo during alpha | neutral process after multiple implementations |
| Commercial modules | LexiCo | LexiCo or licensed operators |

## Working Group Activation Criteria

Create the first formal TSP Working Group when at least two of these are true:

- one named external Gate A validation exists;
- one non-LexiCo implementation passes `fixtures/v3.0`;
- one external organization uses TSP in a bounded pilot;
- one external technical review has been published or quote-approved;
- two non-LexiCo contributors have merged meaningful docs, fixture, or implementation changes.

## RFC Lifecycle

1. Draft: proposer states problem, proposed change, compatibility impact, and affected fixtures.
2. Discussion: minimum 14 calendar days for material protocol changes.
3. Review: maintainers check charter fit, compatibility, security impact, and fixture coverage.
4. Decision: accepted, rejected, or deferred with written rationale.
5. Implementation: spec, reference SDK, fixtures, and docs update together.

## Advisory Seats

Target advisory profiles:

- applied cryptography;
- AI governance and compliance;
- public-sector digital infrastructure;
- enterprise procurement;
- open-source protocol maintenance;
- regulated-domain engineering.

Advisors do not imply endorsement. They provide review and challenge.

## Conflict Rule

Commercial module priorities cannot override the open protocol contract. If a Risk, Evidence, Oversight, or Control Plane feature would make the protocol proprietary in practice, the feature loses.
