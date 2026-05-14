import { readFile } from "node:fs/promises";
import { relative } from "node:path";

const root = process.cwd();

const scanGlobs = [
  "README.md",
  "COMMERCIAL_TERMS.md",
  "docs/**/*.md",
  "messages/*.json",
  "src/**/*.{ts,tsx}",
  "packages/*/README.md",
  "packages/lexitsp-sdk/src/**/*.{ts,tsx}",
];

const files = (
  await Array.fromAsync(new Bun.Glob(`{${scanGlobs.join(",")}}`).scan({ cwd: root, absolute: true }))
).filter((file) => !file.includes("node_modules") && !file.includes(".next"));

const negativeContext =
  /\b(not|never|avoid|avoids|forbid|forbidden|banned|previous|formerly|deprecated|misleading|overclaim|ikke|ingen|unngå|forbudt|forbyr|forlatt|tidligere|overselger)\b/i;

const explicitAllow = /tsp-claim-lint:\s*allow/i;

const bannedPatterns = [
  {
    id: "https-for-ai",
    pattern: /HTTPS\s+for\s+AI/i,
    allowNegative: true,
    message: "Do not market TSP as HTTPS for AI; cite it only as a rejected phrase.",
  },
  {
    id: "proof-of-x",
    pattern: /\bProof\s+of\s+[A-Z0-9_-]+|\bProof\s+of\s+X/i,
    allowNegative: true,
    message: "Proof-of phrasing overclaims what the protocol proves.",
  },
  {
    id: "magic-compliance",
    pattern: /magic compliance|magisk compliance/i,
    allowNegative: true,
    message: "TSP is not magic compliance.",
  },
  {
    id: "ai-truth",
    pattern: /AI[-\s]?truth|AI[-\s]?sannhet|sannhet\s+for\s+AI/i,
    allowNegative: true,
    message: "TSP proves provenance/integrity, not AI truth.",
  },
  {
    id: "guaranteed",
    pattern: /\bguaranteed\b|\bgarantert\b/i,
    allowNegative: false,
    message: "Use narrower engineering language instead of guaranteed/garantert.",
  },
  {
    id: "authority-accepted",
    pattern: /Datatilsynet[-\s]?accepted|DigDir[-\s]?accepted|EU AI Office[-\s]?accepted|auditor[-\s]?accepted|akseptert\s+av\s+(Datatilsynet|DigDir|EU AI Office|revisor)/i,
    allowNegative: true,
    message: "Do not claim authority/auditor acceptance without written confirmation.",
  },
];

const paidToolPaths = /packages[\\/](risk-server|evidence-server|oversight-server|control-plane-server)|docs[\\/](ops|PRODUCT_READINESS_AND_SKUS|TSP_WHOLE_PRODUCT_REVIEW|PUBLIC_FOUNDATION_LAUNCH)|COMMERCIAL_TERMS\.md/i;

const verifiablePattern = /\b(verifiable|verify|verified|etterprøvbar|etterprøve|verifiserbar|verifisere|verifisert)\b/i;
const verifiableQualifiers =
  /\b(cryptographic|cryptographically|signature|signed|hash|manifest|local|locally|independent|independently|auditor|provider|envelope|TrustEnvelope|Ed25519|SHA-256|RFC|browser|math|mathematical|tamper|kryptografisk|signert|signatur|uavhengig|uavhengige|revisor|leverandør|lokal|lokalt|matematisk|nettleser|uendret|uten|mot|hvem|hva|begrensning)\b/i;

const lexiNavAllowPaths = [
  /docs[\\/]PRODUCT_READINESS_AND_SKUS\.md$/i,
  /docs[\\/]TSP_WHOLE_PRODUCT_REVIEW\.md$/i,
  /scripts[\\/]assert-charter-claims\.mjs$/i,
];

const findings = [];

for (const file of files) {
  const rel = relative(root, file);
  const text = await readFile(file, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    if (explicitAllow.test(line)) return;

    for (const rule of bannedPatterns) {
      if (!rule.pattern.test(line)) continue;
      if (rule.allowNegative && negativeContext.test(line)) continue;
      findings.push({ rel, lineNo, id: rule.id, message: rule.message, line });
    }

    if (/production-ready/i.test(line) && !negativeContext.test(line) && paidToolPaths.test(rel)) {
      findings.push({
        rel,
        lineNo,
        id: "paid-tool-production-ready",
        message: "Paid tools are commercial hosted pilot alpha, not production-ready.",
        line,
      });
    }

    if (/LexiNAV/i.test(line) && !lexiNavAllowPaths.some((rx) => rx.test(rel))) {
      findings.push({
        rel,
        lineNo,
        id: "lexinav-proof-point",
        message: "Do not use LexiNAV as a public proof point for TSP.",
        line,
      });
    }

    if (verifiablePattern.test(line) && !verifiableQualifiers.test(line)) {
      findings.push({
        rel,
        lineNo,
        id: "unqualified-verifiable",
        message: "Qualify verifiable/etterprøvbar with who verifies, what is checked, or the technical boundary.",
        line,
      });
    }
  });
}

if (findings.length > 0) {
  console.error("Charter §6 claim lint failed:\n");
  for (const f of findings) {
    console.error(`${f.rel}:${f.lineNo} [${f.id}] ${f.message}`);
    console.error(`  ${f.line.trim()}`);
  }
  process.exit(1);
}

console.log("charter claim lint ok");
