import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "docs/STRATEGIC_FIXES_IMPLEMENTATION.md",
  "docs/EXTERNAL_VALIDATION_PROGRAM.md",
  "docs/ECOSYSTEM_AND_CONFORMANCE.md",
  "docs/TSP_V3_CORE_STABILITY_GUARANTEE.md",
  "docs/WORKING_GROUP_CHARTER.md",
  "docs/INDUSTRY_ADOPTION_NARRATIVES.md",
  "docs/STANDARDS_AND_RESEARCH_BRIEF.md",
  "docs/PUBLIC_METRICS.md",
  "docs/FIRST_ADOPTER_KIT.md",
  "docs/PORTING-GUIDE.md",
  "fixtures/v3.0/canonical-valid-envelope.json",
];

const requiredPhrases = [
  ["docs/EXTERNAL_VALIDATION_PROGRAM.md", /Gate A protocol validation/i],
  ["docs/EXTERNAL_VALIDATION_PROGRAM.md", /own key/i],
  ["docs/EXTERNAL_VALIDATION_PROGRAM.md", /DNS-hosted manifest|well-known/i],
  ["docs/ECOSYSTEM_AND_CONFORMANCE.md", /One-Hour Implementer Path/i],
  ["docs/ECOSYSTEM_AND_CONFORMANCE.md", /Conformance Levels/i],
  ["docs/TSP_V3_CORE_STABILITY_GUARANTEE.md", /Normative Core/i],
  ["docs/TSP_V3_CORE_STABILITY_GUARANTEE.md", /Compliance Matrix/i],
  ["docs/WORKING_GROUP_CHARTER.md", /currently maintained by LexiCo AS/i],
  ["docs/INDUSTRY_ADOPTION_NARRATIVES.md", /Public Sector/i],
  ["docs/STANDARDS_AND_RESEARCH_BRIEF.md", /not an official standard/i],
  ["docs/PUBLIC_METRICS.md", /Named external Gate A validations \| 0/i],
  ["README.md", /Strategic readiness/i],
];

const bannedClaims = [
  /regulator accepted TSP/i,
  /auditor accepted TSP/i,
  /official EU standard/i,
  /industry standard/i,
  /production-proven ecosystem/i,
  /compliance per request/i,
  /guarantees AI Act compliance/i,
];

const negativeContext =
  /\b(not|never|avoid|avoids|forbid|forbidden|unsupported|misleading|before evidence|ikke|ingen|unngå|forbudt)\b/i;

const findings = [];

for (const rel of requiredFiles) {
  const abs = join(root, rel);
  if (!existsSync(abs) || statSync(abs).size === 0) {
    findings.push(`missing or empty: ${rel}`);
  }
}

for (const [rel, pattern] of requiredPhrases) {
  const abs = join(root, rel);
  if (!existsSync(abs)) continue;
  const text = await readFile(abs, "utf8");
  if (!pattern.test(text)) {
    findings.push(`${rel}: missing required phrase ${pattern}`);
  }
}

for (const rel of requiredFiles.concat(["README.md"])) {
  const abs = join(root, rel);
  if (!existsSync(abs)) continue;
  const text = await readFile(abs, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of bannedClaims) {
      if (pattern.test(line) && !negativeContext.test(line)) {
        findings.push(`${rel}:${index + 1}: banned strategic claim ${pattern}`);
      }
    }
  });
}

if (findings.length > 0) {
  console.error("Strategic readiness assertion failed:");
  for (const finding of findings) console.error(`  - ${finding}`);
  process.exit(1);
}

console.log("strategic readiness assertion ok");
