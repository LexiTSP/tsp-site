import type { TrustManifest } from "@lexitsp/sdk/v3";

// Public-alpha production manifest for the canonical well-known endpoint.
// Private root and instance key material lives outside the repository.
export const PUBLIC_TSP_MANIFEST = {
  "tsp": "3.0",
  "organization": {
    "name": "LexiCo AS",
    "domain": "truststandardprotocol.com"
  },
  "rootKey": {
    "crv": "Ed25519",
    "ext": true,
    "key_ops": [
      "verify"
    ],
    "kty": "OKP",
    "x": "zTM6zg02f_MbN3D_wEmEevxaBbskzGjlbkAXID5db9c"
  },
  "instances": [
    {
      "id": "lexico-public-alpha-i1",
      "publicKey": {
        "crv": "Ed25519",
        "ext": true,
        "key_ops": [
          "verify"
        ],
        "kty": "OKP",
        "x": "epYMfvfpOqqMaeoHVp1mCdzSfssc8PV4ozD2nXP-lxE"
      },
      "validFrom": "2026-05-14T00:00:00.000Z",
      "validUntil": "2027-05-14T00:00:00.000Z",
      "rootSignature": "1q2TH4C/jfh8B3VNThoTIjaVdlgtmanmgI91yUgP6CRlIIAvibNM+bTfgtwalL85s8EFEYf+cNtwGsmyDDKRAA=="
    }
  ],
  "revoked": [],
  "sequence": 1,
  "issuedAt": "2026-05-14T20:52:06.038Z",
  "acceptableAge": {
    "seconds": 2592000
  },
  "rootSignatureOverManifest": "kpKXLd8QNQdOASPSviUMjWeFxYQ71ooqRRqkT3U3L9ZOhOvXDI/0ftVlTJGG+7ScmU+fdA2DYRJlxwZGGPprBA=="
} as unknown as TrustManifest;
