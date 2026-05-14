# TSP v3.0 Candidate Test Vectors

These fixtures are `TSP-Spec-1.0-Candidate` test vectors, revision 1. They are intended for implementers who want to validate a TSP verifier without importing the TypeScript SDK.

Files:

- `manifest.json` — signed example manifest for `adopter.example`.
- `canonical-valid-envelope.json` — expected to pass the clean-room verifier.
- `tampered-content-envelope.json` — expected to fail content hash verification.
- `invalid-signature-envelope.json` — expected to fail envelope signature verification.
- `missing-manifest-envelope.json` — expected to fail unless a matching manifest is supplied.
- `invalid-tsa-envelope.json` — structurally valid except for the TSA token; the clean-room stub warns because it does not implement RFC 3161 validation.
- `README.json` — machine-readable fixture metadata.

Regenerate with:

```bash
bun run fixtures:v3
```

Validate with:

```bash
bun run check:interop
```
