import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const findings = [];

function pathOf(rel) {
  return join(root, rel);
}

function read(rel) {
  return readFileSync(pathOf(rel), "utf8");
}

function requireFile(rel) {
  if (!existsSync(pathOf(rel))) findings.push(`missing required public-surface file: ${rel}`);
}

function requireIncludes(rel, needle) {
  if (!read(rel).includes(needle)) findings.push(`${rel}: missing ${needle}`);
}

function forbidIncludes(rel, needle) {
  if (existsSync(pathOf(rel)) && read(rel).includes(needle)) {
    findings.push(`${rel}: stale public reference ${needle}`);
  }
}

for (const rel of [
  ".github/dependabot.yml",
  ".github/workflows/pr-check.yml",
  ".github/workflows/deploy.yml",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/implementation_question.yml",
  ".github/ISSUE_TEMPLATE/spec_rfc.yml",
  ".github/ISSUE_TEMPLATE/adopter_validation.yml",
  "docs/PRE_PUBLISH_AUDIT.md",
  "docs/EXTERNAL_VALIDATION_PROGRAM.md",
  "docs/ECOSYSTEM_AND_CONFORMANCE.md",
  "docs/PUBLIC_METRICS.md",
  "docs/WORKING_GROUP_CHARTER.md",
  "docs/CLOUDFLARE_ROTATION_RUNBOOK.md",
  "scripts/scan-secrets.mjs",
]) {
  requireFile(rel);
}

const sdkPkg = JSON.parse(read("packages/lexitsp-sdk/package.json"));
const badgePkg = JSON.parse(read("packages/trustbadge-react/package.json"));

requireIncludes("SECURITY.md", `@lexitsp/sdk\` \`${sdkPkg.version}`);
requireIncludes("SECURITY.md", `@lexitsp/trustbadge-react\` \`${badgePkg.version}`);
requireIncludes("README.md", "docs/PRE_PUBLISH_AUDIT.md");
requireIncludes("package.json", "check:public-surface");
requireIncludes("package.json", "check:links");
requireIncludes("package.json", "check:secrets");
requireIncludes(".gitignore", ".deploy-backups/");

if (existsSync(pathOf("scripts/public-repo-split.sh"))) {
  requireIncludes("scripts/public-repo-split.sh", "check:strategy");
  requireIncludes("scripts/public-repo-split.sh", "check:public-surface");
}

for (const rel of ["docs/PORTING-GUIDE.md", "docs/SPEC-GOVERNANCE.md"]) {
  forbidIncludes(rel, "github.com/LexiTSP/spec");
  forbidIncludes(rel, "spec/test-vectors/3.0");
}

const publicTexts = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "packages/lexitsp-sdk/README.md",
  "packages/trustbadge-react/README.md",
  "docs/EXTERNAL_VALIDATION_PROGRAM.md",
  "docs/ECOSYSTEM_AND_CONFORMANCE.md",
  "docs/PUBLIC_METRICS.md",
  "docs/STANDARDS_AND_RESEARCH_BRIEF.md",
  "docs/WORKING_GROUP_CHARTER.md",
  "docs/PRE_PUBLISH_AUDIT.md",
];

const riskyPublicClaims = [
  /AI Act compliant/i,
  /guaranteed compliance/i,
  /regulator approved/i,
  /certified compliant/i,
  /official EU standard/i,
  /production-proven ecosystem/i,
  /compliance per request/i,
];

const negativeContext =
  /\b(not|never|avoid|avoids|forbid|forbidden|unsupported|misleading|before evidence|does not|do not)\b/i;

for (const rel of publicTexts) {
  if (!existsSync(pathOf(rel))) continue;
  const lines = read(rel).split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of riskyPublicClaims) {
      if (pattern.test(line) && !negativeContext.test(line)) {
        findings.push(`${rel}:${index + 1}: risky public claim ${pattern}`);
      }
    }
  });
}

if (findings.length > 0) {
  console.error("Public surface assertion failed:");
  for (const finding of findings) console.error(`  - ${finding}`);
  process.exit(1);
}

console.log("public surface assertion ok");
