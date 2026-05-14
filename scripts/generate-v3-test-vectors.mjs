import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  canonicalize,
  importPrivateKeyJwk,
  sign,
  sha256Hex,
  signInstanceCert,
  signManifest,
} from "../packages/lexitsp-sdk/src/v3/index.ts";

const outDir = join(process.cwd(), "fixtures", "v3.0");

const rootPrivateJwk = {
  crv: "Ed25519",
  d: "gx4a_o5RTfRTx4ZGkJzeRtE6FUU5wH0WqSerms2wMH8",
  ext: true,
  key_ops: ["sign"],
  kty: "OKP",
  x: "izUTWpwv-oV-olqmSiDUpe_C4WNyqjf3e1794vxYiaA",
};

const rootPublicJwk = {
  crv: "Ed25519",
  ext: true,
  key_ops: ["verify"],
  kty: "OKP",
  x: "izUTWpwv-oV-olqmSiDUpe_C4WNyqjf3e1794vxYiaA",
};

const instancePrivateJwk = {
  crv: "Ed25519",
  d: "ADnc5LRdbifED5tbpUMxFILfvTjQmmV_fxYZ4ACzHZg",
  ext: true,
  key_ops: ["sign"],
  kty: "OKP",
  x: "vpuBt1cdmmb4O0pfS3u_l99SBm8LB2DivPws3vSEpJo",
};

const instancePublicJwk = {
  crv: "Ed25519",
  ext: true,
  key_ops: ["verify"],
  kty: "OKP",
  x: "vpuBt1cdmmb4O0pfS3u_l99SBm8LB2DivPws3vSEpJo",
};

const metadata = {
  spec: "TSP-Spec-1.0-Candidate",
  revision: 1,
  generatedAt: "2026-05-13T00:00:00.000Z",
  manifestUrl: "https://adopter.example/.well-known/tsp-manifest.json",
  instanceId: "adopter-instance-1",
  notes: [
    "Fixtures are stable interop vectors for SDK v3.0.0-alpha.4.",
    "The private keys are test-only and must never be used for live envelopes.",
    "TSA fixtures use placeholder or structurally invalid tokens until a real timestamp token fixture is added.",
  ],
};

await mkdir(outDir, { recursive: true });

const rootPrivateKey = await importPrivateKeyJwk(rootPrivateJwk);
const instancePrivateKey = await importPrivateKeyJwk(instancePrivateJwk);

const rootSigner = {
  publicKey: rootPublicJwk,
  sign: (data) => sign(rootPrivateKey, data),
};

const instanceCert = await signInstanceCert({
  rootSigner,
  payload: {
    id: metadata.instanceId,
    publicKey: instancePublicJwk,
    validFrom: "2026-05-13T00:00:00.000Z",
    validUntil: "2027-05-13T00:00:00.000Z",
  },
});

const manifest = await signManifest({
  rootSigner,
  organization: {
    name: "External Adopter Example",
    domain: "adopter.example",
  },
  instances: [instanceCert],
  revoked: [],
  sequence: 1,
  issuedAt: "2026-05-13T00:00:00.000Z",
  acceptableAge: { seconds: 31536000 },
});

const contentValue = "This response is a TSP v3.0 candidate interop fixture.";
const envelope = {
  tsp: "3.0",
  content: {
    type: "text",
    value: contentValue,
    hash: await sha256Hex(canonicalize(contentValue)),
  },
  declaration: {
    primarySource: {
      type: "official-document",
      url: "https://adopter.example/policies/source-a",
      title: "External adopter source policy",
      retrieved: "2026-05-13T00:00:00.000Z",
    },
    citations: [
      {
        url: "https://adopter.example/policies/source-a#section-1",
        paragraph: "1",
        quote: "Fixture source quote for interop testing.",
        retrieved: "2026-05-13T00:00:00.000Z",
      },
    ],
  },
  process: {
    model: {
      name: "fixture-model",
      version: "1",
      provider: "external-adopter-example",
      temperature: 0,
      contextWindow: 8192,
    },
    systemPrompt: {
      hash: "0".repeat(64),
      text: "Return only the fixture response.",
    },
    pipeline: [
      {
        name: "fixture-generation",
        durationMs: 12,
        meta: { deterministicFixture: true },
      },
    ],
  },
  alignment: {
    uncertainty: [],
    flags: [],
    humanReviewRequired: false,
    policy: { id: "fixture-policy", version: "1.0" },
  },
  timestamp: {
    claimed: "2026-05-13T00:00:00.000Z",
    tsaToken: "__phase1__",
    tsaUrl: "https://placeholder.invalid/phase1",
  },
  ledger: {
    id: "019e1d3b-4000-7000-8000-000000000001",
    prevHash: "0".repeat(64),
    hash: "",
  },
  signatures: [],
};

const keyRef = `${metadata.manifestUrl}#${metadata.instanceId}`;
const sigDomain = {
  tsp: envelope.tsp,
  content: envelope.content,
  declaration: envelope.declaration,
  process: envelope.process,
  alignment: envelope.alignment,
  timestamp: { claimed: envelope.timestamp.claimed, tsaUrl: envelope.timestamp.tsaUrl },
  ledger: { id: envelope.ledger.id, prevHash: envelope.ledger.prevHash },
};
const sigBytes = await sign(instancePrivateKey, new TextEncoder().encode(canonicalize(sigDomain)));
envelope.signatures = [
  {
    role: "instance",
    algorithm: "ed25519",
    keyRef,
    signature: bytesToBase64(sigBytes),
    certChain: [],
  },
];

const ledgerDomain = {
  tsp: envelope.tsp,
  content: envelope.content,
  declaration: envelope.declaration,
  process: envelope.process,
  alignment: envelope.alignment,
  timestamp: envelope.timestamp,
  signatures: envelope.signatures,
  ledger: { id: envelope.ledger.id, prevHash: envelope.ledger.prevHash },
};
envelope.ledger.hash = await sha256Hex(canonicalize(ledgerDomain));

const tampered = structuredClone(envelope);
tampered.content.value = "This tampered response should fail content hash verification.";

const invalidSignature = structuredClone(envelope);
invalidSignature.signatures[0].signature = invalidSignature.signatures[0].signature.replace(/.$/, "A");

const missingManifest = structuredClone(envelope);
missingManifest.signatures[0].keyRef =
  "https://missing-manifest.example/.well-known/tsp-manifest.json#adopter-instance-1";

const invalidTsa = structuredClone(envelope);
invalidTsa.timestamp = {
  claimed: "2026-05-13T00:00:00.000Z",
  tsaToken: "not-a-valid-rfc3161-token",
  tsaUrl: "https://placeholder.invalid/phase1",
};
invalidTsa.ledger.hash = await sha256Hex(
  canonicalize({
    tsp: invalidTsa.tsp,
    content: invalidTsa.content,
    declaration: invalidTsa.declaration,
    process: invalidTsa.process,
    alignment: invalidTsa.alignment,
    timestamp: invalidTsa.timestamp,
    signatures: invalidTsa.signatures,
    ledger: { id: invalidTsa.ledger.id, prevHash: invalidTsa.ledger.prevHash },
  })
);

await writeJson("README.json", metadata);
await writeJson("manifest.json", manifest);
await writeJson("canonical-valid-envelope.json", envelope);
await writeJson("tampered-content-envelope.json", tampered);
await writeJson("invalid-signature-envelope.json", invalidSignature);
await writeJson("missing-manifest-envelope.json", missingManifest);
await writeJson("invalid-tsa-envelope.json", invalidTsa);

console.log(`wrote TSP v3.0 candidate test vectors to ${outDir}`);

async function writeJson(name, value) {
  const file = join(outDir, name);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

function bytesToBase64(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
