import { spawnSync } from "node:child_process";

const cases = [
  {
    name: "canonical valid envelope",
    envelope: "fixtures/v3.0/canonical-valid-envelope.json",
    manifest: "fixtures/v3.0/manifest.json",
    expectExit: 0,
  },
  {
    name: "tampered content",
    envelope: "fixtures/v3.0/tampered-content-envelope.json",
    manifest: "fixtures/v3.0/manifest.json",
    expectExit: 1,
  },
  {
    name: "invalid signature",
    envelope: "fixtures/v3.0/invalid-signature-envelope.json",
    manifest: "fixtures/v3.0/manifest.json",
    expectExit: 1,
  },
  {
    name: "missing manifest",
    envelope: "fixtures/v3.0/missing-manifest-envelope.json",
    manifest: null,
    expectExit: 1,
  },
  {
    name: "invalid TSA is warning-only in clean-room stub",
    envelope: "fixtures/v3.0/invalid-tsa-envelope.json",
    manifest: "fixtures/v3.0/manifest.json",
    expectExit: 0,
  },
];

for (const testCase of cases) {
  const args = ["run", "scripts/interop-verify.mjs", "--envelope", testCase.envelope];
  if (testCase.manifest) args.push("--manifest", testCase.manifest);
  args.push("--json");

  const result = spawnSync("bun", args, { encoding: "utf8" });
  if (result.status !== testCase.expectExit) {
    console.error(`interop fixture case failed: ${testCase.name}`);
    console.error(`expected exit ${testCase.expectExit}, got ${result.status}`);
    console.error(result.stdout);
    console.error(result.stderr);
    process.exit(1);
  }
  console.log(`interop fixture ok: ${testCase.name}`);
}

console.log("interop fixtures ok");
