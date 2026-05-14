#!/usr/bin/env bun
import { readFile } from "node:fs/promises";

const enc = new TextEncoder();
const REQUIRES_ESCAPE = /[\x00-\x1f"\\]/g;
const ESCAPE_MAP = {
  "\b": "\\b",
  "\t": "\\t",
  "\n": "\\n",
  "\f": "\\f",
  "\r": "\\r",
  '"': '\\"',
  "\\": "\\\\",
};

const args = parseArgs(process.argv.slice(2));
if (!args.envelope) {
  usage(1);
}

const envelope = await readJson(args.envelope);
const manifest = args.manifest ? await readJson(args.manifest) : null;
const result = await verifyEnvelope(envelope, { manifest });

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  printHuman(result);
}

if (!result.valid) process.exit(1);

export async function verifyEnvelope(envelope, opts = {}) {
  const checks = [];

  checks.push(
    envelope.tsp === "3.0"
      ? pass("schema", "tsp version is 3.0")
      : fail("schema", `expected tsp 3.0, got ${JSON.stringify(envelope.tsp)}`)
  );

  if (!envelope.content || !envelope.ledger || !Array.isArray(envelope.signatures)) {
    checks.push(fail("schema-shape", "missing content, ledger or signatures"));
    return finalize(checks);
  }

  const expectedContentHash = await sha256Hex(canonicalize(envelope.content.value));
  checks.push(
    expectedContentHash === envelope.content.hash
      ? pass("contentHash", "content hash matches canonical content.value")
      : fail("contentHash", `claimed ${envelope.content.hash}, computed ${expectedContentHash}`)
  );

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
  const expectedLedgerHash = await sha256Hex(canonicalize(ledgerDomain));
  checks.push(
    expectedLedgerHash === envelope.ledger.hash
      ? pass("ledgerHash", "ledger hash matches canonical envelope minus ledger.hash")
      : fail("ledgerHash", `claimed ${envelope.ledger.hash}, computed ${expectedLedgerHash}`)
  );

  const firstSignature = envelope.signatures[0];
  if (!firstSignature) {
    checks.push(fail("signature", "no signature entries"));
    return finalize(checks);
  }

  const keyRef = parseKeyRef(firstSignature.keyRef);
  checks.push(
    keyRef.ok
      ? pass("keyRef", `manifest ${keyRef.manifestUrl}, instance ${keyRef.instanceId}`)
      : fail("keyRef", keyRef.error)
  );
  if (!keyRef.ok) return finalize(checks);

  if (!opts.manifest) {
    checks.push(fail("manifest", "manifest JSON was not provided to clean-room verifier"));
    return finalize(checks);
  }

  checks.push(
    opts.manifest.organization?.domain
      ? pass("manifestShape", `manifest domain ${opts.manifest.organization.domain}`)
      : fail("manifestShape", "manifest missing organization.domain")
  );

  checks.push(
    opts.manifest.rootSignatureOverManifest
      ? await verifyManifestSignature(opts.manifest)
      : fail("manifestSignature", "manifest missing rootSignatureOverManifest")
  );

  const instance = opts.manifest.instances?.find((entry) => entry.id === keyRef.instanceId);
  if (!instance) {
    checks.push(fail("instanceCert", `instance ${keyRef.instanceId} not found in manifest`));
    return finalize(checks);
  }
  checks.push(await verifyInstanceCert(instance, opts.manifest.rootKey));

  const claimedMs = Date.parse(envelope.timestamp?.claimed ?? "");
  checks.push(
    claimedMs >= Date.parse(instance.validFrom) && claimedMs <= Date.parse(instance.validUntil)
      ? pass("certValidity", "instance cert valid at envelope timestamp")
      : fail("certValidity", "instance cert not valid at envelope timestamp")
  );

  const sigDomain = {
    tsp: envelope.tsp,
    content: envelope.content,
    declaration: envelope.declaration,
    process: envelope.process,
    alignment: envelope.alignment,
    timestamp: { claimed: envelope.timestamp.claimed, tsaUrl: envelope.timestamp.tsaUrl },
    ledger: { id: envelope.ledger.id, prevHash: envelope.ledger.prevHash },
  };
  checks.push(await verifyEd25519Check("signature", instance.publicKey, firstSignature.signature, canonicalize(sigDomain)));

  if (envelope.timestamp?.tsaToken === "__phase1__") {
    checks.push(warn("tsa", "placeholder TSA token: RFC 3161 validation intentionally not performed by this stub"));
  } else {
    checks.push(warn("tsa", "non-placeholder TSA token present: clean-room stub does not implement RFC 3161 validation"));
  }

  return finalize(checks);
}

async function verifyManifestSignature(manifest) {
  const { rootSignatureOverManifest, ...unsigned } = manifest;
  return verifyEd25519Check(
    "manifestSignature",
    manifest.rootKey,
    rootSignatureOverManifest,
    canonicalize(unsigned)
  );
}

async function verifyInstanceCert(cert, rootKey) {
  const { rootSignature, ...payload } = cert;
  return verifyEd25519Check("instanceCert", rootKey, rootSignature, canonicalize(payload));
}

async function verifyEd25519Check(name, publicJwk, b64Signature, canonicalPayload) {
  try {
    const publicKey = await crypto.subtle.importKey("jwk", publicJwk, { name: "Ed25519" }, true, ["verify"]);
    const ok = await crypto.subtle.verify(
      { name: "Ed25519" },
      publicKey,
      base64ToBytes(b64Signature),
      enc.encode(canonicalPayload)
    );
    return ok ? pass(name, "Ed25519 signature valid") : fail(name, "Ed25519 signature invalid");
  } catch (error) {
    return fail(name, `Ed25519 verification failed: ${error.message}`);
  }
}

function finalize(checks) {
  return {
    valid: checks.every((check) => check.status === "passed" || check.status === "warning"),
    checks,
  };
}

function pass(name, detail) {
  return { name, status: "passed", detail };
}

function fail(name, detail) {
  return { name, status: "failed", detail };
}

function warn(name, detail) {
  return { name, status: "warning", detail };
}

function parseKeyRef(keyRef) {
  if (typeof keyRef !== "string" || !keyRef.includes("#")) {
    return { ok: false, error: "keyRef must be manifestUrl#instanceId" };
  }
  const [manifestUrl, instanceId] = keyRef.split("#");
  if (!manifestUrl || !instanceId) {
    return { ok: false, error: "keyRef must include both manifest URL and instance id" };
  }
  return { ok: true, manifestUrl, instanceId };
}

async function sha256Hex(input) {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return Array.from(new Uint8Array(buf), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function canonicalize(value) {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`canonicalize: non-finite number ${value}`);
    if (Object.is(value, -0)) return "0";
    return JSON.stringify(value);
  }
  if (typeof value === "string") return canonicalString(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${canonicalString(key)}:${canonicalize(value[key])}`)
      .join(",")}}`;
  }
  throw new Error(`canonicalize: unsupported type ${typeof value}`);
}

function canonicalString(value) {
  return `"${value.replace(REQUIRES_ESCAPE, (char) => {
    if (char in ESCAPE_MAP) return ESCAPE_MAP[char];
    return `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
  })}"`;
}

function base64ToBytes(b64) {
  return Uint8Array.from(atob(b64), (char) => char.charCodeAt(0));
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--envelope") out.envelope = argv[++i];
    else if (arg === "--manifest") out.manifest = argv[++i];
    else if (arg === "--json") out.json = true;
    else if (arg === "--help" || arg === "-h") usage(0);
  }
  return out;
}

function printHuman(result) {
  for (const check of result.checks) {
    console.log(`${check.status.toUpperCase().padEnd(7)} ${check.name}: ${check.detail}`);
  }
  console.log(`\nvalid=${result.valid}`);
}

function usage(code) {
  console.log("Usage: bun run scripts/interop-verify.mjs --envelope fixtures/v3.0/canonical-valid-envelope.json --manifest fixtures/v3.0/manifest.json [--json]");
  process.exit(code);
}
