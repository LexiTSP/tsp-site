## Summary

- 

## Public Surface

- [ ] I changed public copy, routes, package docs, manifests, or verifier behavior.
- [ ] I checked that `/.well-known/tsp-manifest.json`, `/verify`, docs, SDK, and TrustBadge terminology still agree.
- [ ] I avoided claims that imply EU approval, guaranteed compliance, production maturity for alpha tools, or official standard status.

## Proof Loop

- [ ] A valid sample receipt verifies.
- [ ] A tampered sample fails verification.
- [ ] The user-facing path points to `/verify` for proof/tamper validation and `/playground` for build/sign flows.

## Release Checks

```bash
bun run check:claims
bun run check:links
bun run check:public-surface
bun run test:site
bun run build
```

## Notes

- 
