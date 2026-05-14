#!/usr/bin/env bun
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dir, "..");
const keep = process.argv.includes("--keep");
const workDir = await mkdtemp(join(tmpdir(), "tsp-package-smoke-"));
const packDir = join(workDir, "packs");
const appDir = join(workDir, "app");

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, {
    cwd: opts.cwd ?? root,
    encoding: "utf8",
    shell: process.platform === "win32",
    env: { ...process.env, ...opts.env },
  });
  if (res.status !== 0) {
    throw new Error(
      [
        `Command failed: ${cmd} ${args.join(" ")}`,
        `cwd: ${opts.cwd ?? root}`,
        res.stdout,
        res.stderr,
      ]
        .filter(Boolean)
        .join("\n")
    );
  }
  return res.stdout;
}

async function packPackage(packagePath) {
  const out = run("npm", ["pack", "--json", "--pack-destination", packDir], {
    cwd: packagePath,
  });
  const parsed = JSON.parse(out);
  const filename = parsed[0]?.filename;
  if (!filename) throw new Error(`npm pack did not return a filename for ${packagePath}`);
  const tarball = join(packDir, filename);
  if (!existsSync(tarball)) throw new Error(`Packed tarball missing: ${tarball}`);
  return `file:../packs/${filename}`;
}

try {
  await mkdir(packDir, { recursive: true });
  await mkdir(appDir, { recursive: true });

  const sdkTarball = await packPackage(join(root, "packages", "lexitsp-sdk"));
  const badgeTarball = await packPackage(join(root, "packages", "trustbadge-react"));

  await writeFile(
    join(appDir, "package.json"),
    JSON.stringify(
      {
        name: "tsp-package-smoke",
        private: true,
        type: "module",
        dependencies: {
          "@lexitsp/sdk": sdkTarball,
          "@lexitsp/trustbadge-react": badgeTarball,
          react: "19.0.0",
          "react-dom": "19.0.0",
        },
      },
      null,
      2
    )
  );

  run("npm", ["install", "--ignore-scripts"], { cwd: appDir });

  const help = run("bun", ["node_modules/@lexitsp/sdk/bin/tsp.mjs", "--help"], {
    cwd: appDir,
  });
  if (!help.includes("Trust Standard Protocol CLI")) {
    throw new Error("SDK CLI smoke failed: help text did not render");
  }

  await writeFile(
    join(appDir, "smoke.mjs"),
    String.raw`import * as React from "react";
import { renderToString } from "react-dom/server";
import { TrustBadge } from "@lexitsp/trustbadge-react";
import {
  generateKeyPair,
  exportPublicKeyJwk,
  sign,
  sha256Hex,
  canonicalize,
  wrap,
  verifyLocal,
} from "@lexitsp/sdk/v3";

const keyPair = await generateKeyPair();
const publicKey = await exportPublicKeyJwk(keyPair.publicKey);
const envelope = await wrap(
  { type: "text", value: "Package smoke: verifiable TSP output." },
  {
    signer: {
      sign: (data) => sign(keyPair.privateKey, data),
      publicKey,
      keyRef: "smoke://instance",
      certChain: ["smoke-cert"],
    },
    declaration: {
      primarySource: {
        type: "verified-website",
        title: "Package smoke fixture",
        retrieved: new Date().toISOString(),
      },
      citations: [],
    },
    process: {
      model: {
        name: "package-smoke",
        version: "1",
        provider: "local",
        temperature: 0,
        contextWindow: 1024,
      },
      systemPrompt: {
        hash: await sha256Hex(canonicalize("package smoke")),
        redacted: true,
        reason: "smoke",
      },
      pipeline: [{ name: "smoke", durationMs: 1 }],
    },
    alignment: {
      uncertainty: [],
      flags: [],
      humanReviewRequired: false,
      policy: { id: "smoke", version: "1" },
    },
    prevHash: "0".repeat(64),
    skipTsa: true,
  }
);

const result = await verifyLocal(envelope, { knownPublicKey: publicKey });
if (!result.valid) {
  throw new Error("wrap -> verifyLocal smoke failed");
}

const html = renderToString(
  React.createElement(TrustBadge, {
    envelope,
    initialResult: result,
    verifyMode: "manual",
  })
);
if (!html.includes("tsp-badge") || !html.includes("Verified")) {
  throw new Error("TrustBadge SSR smoke failed");
}

console.log("package smoke ok");
`
  );

  const smoke = run("bun", ["smoke.mjs"], { cwd: appDir });
  if (!smoke.includes("package smoke ok")) {
    throw new Error("Smoke script did not report success");
  }

  console.log("✓ public package smoke passed");
  console.log(`  SDK tarball: ${sdkTarball}`);
  console.log(`  TrustBadge tarball: ${badgeTarball}`);
} finally {
  if (keep) {
    console.log(`Kept smoke workspace: ${workDir}`);
  } else {
    await rm(workDir, { recursive: true, force: true });
  }
}
