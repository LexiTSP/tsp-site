import type { TrustManifest } from "@lexitsp/sdk/v3";

// Alpha demo manifest for the public well-known endpoint. It is a valid,
// self-signed TSP v3 TrustManifest for canonical-domain smoke tests, but it is
// not a production signing identity for customer envelopes.
export const PUBLIC_TSP_MANIFEST = {
  tsp: "3.0",
  organization: {
    name: "LexiCo AS",
    domain: "truststandardprotocol.org",
  },
  rootKey: {
    crv: "Ed25519",
    ext: true,
    key_ops: [
      "verify",
    ],
    kty: "OKP",
    x: "1zJ7bMy0T_s-pKBzXooD64MALxlBo0jNueZV4zeqPBY",
  },
  instances: [
    {
      id: "lexico-alpha-demo-i1",
      publicKey: {
        crv: "Ed25519",
        ext: true,
        key_ops: [
          "verify",
        ],
        kty: "OKP",
        x: "CIq2KjXDYe9jFe341xXcMIAC4d1Wt3CUQjC6Jbfgzns",
      },
      validFrom: "2026-05-13T00:00:00.000Z",
      validUntil: "2027-05-13T00:00:00.000Z",
      rootSignature:
        "+kh+zMsHyF07SM2983wQypEs2DRu6kYSqgBgX5LRlZZ/gIa9Bo7+s1TTOUQ0Fafxj+b+lyNABX2QPcL1DNb9Dw==",
    },
  ],
  revoked: [],
  sequence: 1,
  issuedAt: "2026-05-13T02:03:43.462Z",
  acceptableAge: {
    seconds: 86400,
  },
  rootSignatureOverManifest:
    "Cr3udi55UdXdevdIvVEhoqqdrbYqY8rl4bSNSokq2RVZwXzI3jk7SOe5OFUm6NpGf5fZAehySEqQbioBMY6oCA==",
} as unknown as TrustManifest;
