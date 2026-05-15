# TSP First Adopter Kit

Purpose: let an external implementer prove TSP from its own key and own DNS-hosted manifest.

## Minimum deployment shape

The adopter hosts:

- `https://<adopter-domain>/.well-known/tsp-manifest.json`;
- one org-root key in that manifest;
- one active instance certificate in that manifest;
- one signed TrustEnvelope whose `signatures[0].keyRef` is `https://<adopter-domain>/.well-known/tsp-manifest.json#<instance-id>`.

This HTTPS well-known path is the primary Gate A shape. Other manifest transports can be supported later, but they do not count for the first external protocol validation.

## Steps

1. Install `@lexitsp/sdk@3.0.0-alpha.6`.
2. Generate an org-root key and an instance key.
3. Publish the signed manifest at `/.well-known/tsp-manifest.json` on a domain controlled by the adopter.
4. Sign one non-sensitive TrustEnvelope with the instance key.
5. Run online verification against the hosted manifest.
6. Tamper one content byte and confirm verification fails.
7. Send the envelope, manifest URL and verifier output back as the Gate A evidence package.

The adopter can use the SDK, another implementation, or a clean-room implementation. LexiCo may answer spec questions, but LexiCo-written integration code means the result is not Gate A.

## Interop fixtures

The repository includes `fixtures/v3.0` as `TSP-Spec-1.0-Candidate` test vectors, revision 1:

- `canonical-valid-envelope.json`;
- `tampered-content-envelope.json`;
- `invalid-signature-envelope.json`;
- `missing-manifest-envelope.json`;
- `invalid-tsa-envelope.json`;
- `manifest.json`;
- `README.json`.

Run:

```bash
bun run check:interop
```

Or verify one vector without importing the SDK:

```bash
bun run scripts/interop-verify.mjs --envelope fixtures/v3.0/canonical-valid-envelope.json --manifest fixtures/v3.0/manifest.json
```

The clean-room verifier checks schema version, content hash, ledger hash, manifest signature, instance cert signature, cert validity and envelope signature. It warns, rather than passes, on TSA tokens because the stub does not implement RFC 3161 validation.

## Success criterion

Gate A is achieved when a named external organization signs with its own key, hosts its own manifest at the well-known HTTPS path, and produces a passing verifier result. Localhost manifests and LexiCo-hosted manifests do not count.
