import { readFile } from "node:fs/promises";
import { relative } from "node:path";

const root = process.cwd();

const scanGlobs = [
  "README.md",
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
    pattern: /Datatilsynet[-\s]?accepted|DigDir[-\s]?accepted|EU AI Office[-\s]?accepted|auditor[-\s]?accepted|EU[-\s]?approved|EU (has )?approved TSP|akseptert\s+av\s+(Datatilsynet|DigDir|EU AI Office|revisor)|EU[-\s]?godkjent/i,
    allowNegative: true,
    message: "Do not claim authority/auditor acceptance without written confirmation.",
  },
  {
    id: "official-standard",
    pattern: /\b(official|offisiell)\s+(EU\s+)?(standard|protocol|protokoll)\b|\bEU\s+(standardized|standardised|standardiserte?)\s+TSP\b/i,
    allowNegative: true,
    message: "Use proposal/candidate language; do not imply TSP is an official EU standard.",
  },
  {
    id: "compliance-guarantee",
    pattern: /\bguarantees?\s+(AI Act\s+)?compliance\b|\bcompliance\s+guarantee\b|\bgaranterer\s+(AI Act[-\s]+)?(compliance|etterlevelse)\b/i,
    allowNegative: true,
    message: "TSP can support evidence and verification; it does not guarantee compliance.",
  },
  {
    id: "automatic-compliance",
    pattern: /compliance follows automatically|compliance følger automatisk|etterlevelse følger automatisk/i,
    allowNegative: true,
    message: "Do not imply TSP automatically creates legal or certification compliance.",
  },
  {
    id: "fully-covers-compliance",
    pattern: /\bfully covers\b|\bfullt ut dekker\b|\bdekker den første,\s*full/i,
    allowNegative: true,
    message: "Use supports/reduces evidence gap instead of fully covers compliance scope.",
  },
  {
    id: "finished-technical-compliance",
    pattern: /finished technical part|ferdige tekniske delen/i,
    allowNegative: true,
    message: "Avoid implying the technical compliance layer is complete for every deployment.",
  },
  {
    id: "certification-backbone",
    pattern: /technical backbone for certification|teknisk ryggrad for sertifisering/i,
    allowNegative: true,
    message: "Use technical evidence support instead of certification backbone.",
  },
  {
    id: "solves-digital-components",
    pattern: /solves the digital components fully|løser de digitale komponentene fullstendig/i,
    allowNegative: true,
    message: "Use reduces the evidence gap instead of fully solves certification components.",
  },
  {
    id: "campaign-definitive-protocol",
    pattern: /\bdefinitive protocol\b|\bTSP is the format\b|\bden definitive protokollen\b|\bTSP er formatet\b/i,
    allowNegative: true,
    message: "Use proposal/candidate language; TSP is not an official or definitive protocol.",
  },
  {
    id: "ai-act-flat-date",
    pattern: /\b(every|all)\s+high-risk\b.*\b2\s+August\s+2026\b|\balle\s+høy?risiko\b.*\b2\.\s*august\s+2026\b|\bno grace period\b|\bingen overgangsperiode\b/i,
    allowNegative: true,
    message: "Do not flatten the staged AI Act timeline into one date or deny transition periods.",
  },
  {
    id: "unsourced-lobbying-names",
    pattern: /\b(ASML|Airbus|Mistral|SAP)\b.*\b(open letter|pause|postpone|utsette|pause)\b/i,
    allowNegative: false,
    message: "Avoid named-company lobbying claims in public copy unless sourced and reviewed.",
  },
];


const verifiablePattern = /\b(verifiable|verify|verified|etterprøvbar|etterprøve|verifiserbar|verifisere|verifisert)\b/i;
const verifiableQualifiers =
  /\b(cryptographic|cryptographically|signature|signed|hash|manifest|local|locally|independent|independently|auditor|provider|envelope|TrustEnvelope|Ed25519|SHA-256|RFC|browser|math|mathematical|tamper|kryptografisk|signert|signatur|uavhengig|uavhengige|revisor|leverandør|lokal|lokalt|matematisk|nettleser|uendret|uten|mot|hvem|hva|begrensning)\b/i;


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
