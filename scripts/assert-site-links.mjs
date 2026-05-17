import { existsSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const findings = [];

function pathOf(rel) {
  return join(root, rel);
}

function read(rel) {
  return readFileSync(pathOf(rel), "utf8");
}

function requireFile(rel) {
  if (!existsSync(pathOf(rel))) findings.push(`missing required file: ${rel}`);
}

function requireNonEmptyFile(rel) {
  requireFile(rel);
  if (existsSync(pathOf(rel)) && statSync(pathOf(rel)).size === 0) {
    findings.push(`empty required file: ${rel}`);
  }
}

function requireIncludes(rel, needle) {
  if (!existsSync(pathOf(rel))) {
    findings.push(`missing required file: ${rel}`);
    return;
  }
  if (!read(rel).includes(needle)) findings.push(`${rel}: missing ${needle}`);
}

function forbidIncludes(rel, needle, message = `forbidden reference ${needle}`) {
  if (existsSync(pathOf(rel)) && read(rel).includes(needle)) {
    findings.push(`${rel}: ${message}`);
  }
}

const localizedRoutes = [
  "ai-act-august-2",
  "verification-gap",
  "eu-ai-act",
  "iso-42001",
  "priser",
  "evidence",
  "docs",
  "spec",
  "verify",
  "kontakt",
  "newsletter",
];

for (const route of localizedRoutes) {
  requireFile(`src/app/[locale]/${route}/page.tsx`);
  requireIncludes("src/app/sitemap.ts", `/${route}`);
}

requireIncludes("src/components/TspFooter.tsx", "/newsletter");
requireIncludes("messages/en.json", "\"linkNewsletter\"");
requireIncludes("messages/no.json", "\"linkNewsletter\"");
requireIncludes("README.md", "bun run check:links");
requireIncludes("README.md", "/newsletter");
requireIncludes("README.md", "tsp@lexico.no");
requireIncludes("packages/lexitsp-sdk/README.md", "/.well-known/tsp-manifest.json");
requireIncludes("packages/trustbadge-react/README.md", "/.well-known/tsp-manifest.json");

const campaignFiles = [
  "public/campaign/tsp-ai-act-august-2-policy-memo.docx",
  "public/campaign/tsp-ai-act-august-2-policy-deck.pptx",
];

for (const rel of campaignFiles) {
  requireNonEmptyFile(rel);
  requireIncludes(
    "src/app/[locale]/ai-act-august-2/page.tsx",
    `/${rel.replace(/^public\//, "")}`,
  );
}

forbidIncludes(
  "src/app/[locale]/ai-act-august-2/page.tsx",
  'ctaHref("/playground", "run_demo")',
  "proof/tamper CTA must route to /verify, not /playground",
);
forbidIncludes(
  "src/app/[locale]/kontakt/page.tsx",
  'href="/playground"',
  "contact try-first card must route to /verify",
);

const scanGlobs = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "docs/**/*.md",
  "messages/*.json",
  "src/**/*.{ts,tsx}",
  "packages/*/README.md",
];

const files = (
  await Array.fromAsync(new Bun.Glob(`{${scanGlobs.join(",")}}`).scan({ cwd: root, absolute: true }))
).filter((file) => !file.includes("node_modules") && !file.includes(".next"));

const staleReferences = [
  { id: "@lexico/tsp", pattern: /@lexico\/tsp\b/i },
  { id: "spec-v2-url", pattern: /truststandardprotocol\.com\/spec\/v2\.0/i },
  { id: "context-v2-url", pattern: /truststandardprotocol\.com\/context\/v2/i },
  { id: "old-keys-ref", pattern: /\/\.well-known\/tsp\/keys\.json#i1/i },
];

const allowedEmails = new Set(["tsp@lexico.no", "security@lexico.no", "hello@lexico.no"]);
const publicContactOnly = /^(README\.md|CONTRIBUTING\.md|docs[\\/]|messages[\\/]|src[\\/]|packages[\\/].*[\\/]README\.md$)/i;

for (const file of files) {
  const rel = relative(root, file);
  const text = readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const stale of staleReferences) {
      if (stale.pattern.test(line)) {
        findings.push(`${rel}:${index + 1}: stale public reference ${stale.id}`);
      }
    }

    if (publicContactOnly.test(rel)) {
      for (const match of line.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
        const email = match[0].toLowerCase();
        if (!allowedEmails.has(email)) {
          findings.push(`${rel}:${index + 1}: non-canonical public email ${email}`);
        }
      }
    }
  });
}

if (findings.length > 0) {
  console.error("Site link/contact assertion failed:");
  for (const finding of findings) console.error(`  - ${finding}`);
  process.exit(1);
}

console.log("site link/contact assertion ok");
