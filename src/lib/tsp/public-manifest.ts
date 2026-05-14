import type { TrustManifest } from "@lexitsp/sdk/v3";

// Alpha demo manifest for the public well-known endpoint. It is a valid,
// self-signed TSP v3 TrustManifest for canonical-domain smoke tests, but it is
// not a production signing identity for customer envelopes.
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
    "x": "nUoVqNgu5zJlVImc4-xXF4VJLFEuXAkUbzgbOndSKeY"
  },
  "instances": [
    {
      "id": "lexico-alpha-demo-i1",
      "publicKey": {
        "crv": "Ed25519",
        "ext": true,
        "key_ops": [
          "verify"
        ],
        "kty": "OKP",
        "x": "CDRSXG4ljBpJTEZcz_s2x0gh9ZqUkzH7J0SF7mURK6Q"
      },
      "validFrom": "2026-05-14T00:00:00.000Z",
      "validUntil": "2027-05-14T00:00:00.000Z",
      "rootSignature": "gQnq7DQ132rN3U2rtBmU9rrGT3eZ8B8REk2FVm+kF68/nJl/t4BJRAJCI5V3udFAft+h4tBroKhbOUBW8zMKAg=="
    }
  ],
  "revoked": [],
  "sequence": 1,
  "issuedAt": "2026-05-14T00:00:00.000Z",
  "acceptableAge": {
    "seconds": 86400
  },
  "rootSignatureOverManifest": "FWW6gzhcM64oPVosWxiE95C0gU+g6T3Msxp+8Kaj4YHlCtjWaW4rUypdF6/f6NuxSKtRPzrOQ1dIkry6qq6/BQ=="
} as unknown as TrustManifest;
