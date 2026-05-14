# TSP Commercial Tools Terms

Alpha draft: 2026-05-13

**Lawyer review required before signature.** This document is an operator/product draft for public-alpha clarity, not a final customer agreement.

These terms describe the intended commercial boundary in this standalone TSP workspace. They are product terms, not a final lawyer-reviewed customer agreement.

## Free Standard Zone

The TSP protocol, public specification, `@lexitsp/sdk`, and `@lexitsp/trustbadge-react` are intended to spread freely so TSP can become a practical standard.

- TSP spec: CC-BY 4.0.
- `@lexitsp/sdk`: MIT.
- `@lexitsp/trustbadge-react`: MIT.
- Local playground, docs, examples, and basic verification flows remain free to use.

## Commercial Tools Zone

The following packages are commercial LexiCo tools:

- `@lexitsp/risk-server`
- `@lexitsp/evidence-server`
- `@lexitsp/oversight-server`

Running these tools in production, offering them as a service, distributing modified versions, or using them for a customer deployment requires a written commercial license from LexiCo AS.

## Standalone Rule

The commercial tools must remain standalone by default:

- No LexiCo-issued runtime token is required.
- No phone-home license check is performed.
- No external LexiCo service is required for the software to start.
- A customer can run licensed deployments on-prem or hosted.

Licensing is contractual and documented, not enforced by hidden network dependencies.

## Customer Data

Commercial tools must not introduce vendor lock-in at the evidence layer. TrustEnvelopes, ReviewEnvelopes, RiskEnvelopes, manifests, and exported evidence packages must remain verifiable without LexiCo.

## Notes

Before external commercial use, replace this draft with lawyer-reviewed terms and a signed customer agreement.
