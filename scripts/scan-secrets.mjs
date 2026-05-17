import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([
  ".git",
  ".next",
  ".next-dev",
  ".deploy-backups",
  ".rework-backup",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);
const maxTextBytes = 2 * 1024 * 1024;
const textExts = new Set([
  "",
  ".cjs",
  ".css",
  ".env",
  ".gitignore",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".sh",
  ".svg",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);

const privateKeyPattern = new RegExp(
  "-----BEGIN (?:(?:RSA|EC|OPENSSH|DSA) )?PRIVATE " + "KEY-----",
);

const forbiddenPatterns = [
  { label: "PEM private key", pattern: privateKeyPattern },
  { label: "OpenAI API key", pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/ },
  {
    label: "Cloudflare API token assignment",
    pattern: /\bCLOUDFLARE_(?:API_TOKEN|AUTH_KEY)\s*=\s*["']?[A-Za-z0-9_-]{24,}/i,
  },
  {
    label: "GitHub token",
    pattern: /\b(?:ghp|github_pat)_[A-Za-z0-9_]{30,}\b/,
  },
];

const forbiddenNames = [
  /(^|[/\\])TSPREACH\.txt$/i,
  /(^|[/\\])origin\.(?:key|pem|p12|pfx)$/i,
  /(^|[/\\]).*private.*key.*$/i,
];

const findings = [];

function displayPath(path) {
  return relative(root, path).split(sep).join("/");
}

function shouldSkipDir(name) {
  return ignoredDirs.has(name) || name.startsWith(".next-dev");
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!shouldSkipDir(entry.name)) walk(fullPath);
      continue;
    }
    if (entry.isFile()) scanFile(fullPath);
  }
}

function scanFile(path) {
  const rel = displayPath(path);
  for (const pattern of forbiddenNames) {
    if (pattern.test(rel)) {
      findings.push(`${rel}: forbidden secret-bearing filename`);
    }
  }

  const stats = statSync(path);
  const ext = extname(path).toLowerCase();
  if (!textExts.has(ext) || stats.size > maxTextBytes) return;

  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return;
  }

  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const { label, pattern } of forbiddenPatterns) {
      if (pattern.test(line)) {
        findings.push(`${rel}:${index + 1}: ${label}`);
      }
    }
  });
}

if (!existsSync(root)) {
  console.error(`missing scan root: ${root}`);
  process.exit(1);
}

walk(root);

if (findings.length > 0) {
  console.error("Secret scan failed:");
  for (const finding of findings) console.error(`  - ${finding}`);
  process.exit(1);
}

console.log("secret scan ok");
