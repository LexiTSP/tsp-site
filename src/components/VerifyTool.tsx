"use client";

import { useMemo, useState } from "react";
import {
  AlertOctagon,
  CheckCircle2,
  FileJson,
  Loader2,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import {
  verifyLocal,
  verifyOnline,
  type CheckResult,
  type JwkEd25519Public,
  type TrustEnvelope,
  type VerifyResult,
} from "@lexitsp/sdk/v3";

type Mode = "local" | "online";

interface VerifyToolProps {
  locale: string;
}

const SAMPLE_PUBLIC_KEY = `{
  "kty": "OKP",
  "crv": "Ed25519",
  "x": "paste-instance-public-key-here"
}`;

const COPY = {
  no: {
    mode: "Modus",
    local: "Lokal",
    online: "Online",
    envelope: "TrustEnvelope JSON",
    envelopeHelp: "Lim inn en TSP v3 envelope. Innholdet forlater ikke nettleseren i lokal modus.",
    publicKey: "Instans public key eller manifest JSON",
    publicKeyHelp:
      "Lokal modus trenger en Ed25519 public JWK. Hvis du limer inn manifest JSON, bruker vi instance-id fra envelope.signatures[0].keyRef.",
    manifestUrl: "Manifest URL",
    manifestJson: "Valgfri manifest JSON",
    manifestHelp:
      "Online modus henter manifest fra keyRef. Hvis du limer inn manifest JSON, brukes den i stedet for nettverkskall til manifest-URLen.",
    allowLegacy: "Tillat legacy alpha-TSA placeholder",
    allowLegacyHelp: "Kun for alpha/dev envelopes. Produksjon skal feile lukket uten ekte TSA-token.",
    verify: "Verifiser",
    file: "Last JSON-fil",
    result: "Resultat",
    waiting: "Lim inn en envelope og kjør verifisering.",
    valid: "Gyldig",
    invalid: "Ikke gyldig",
    warnings: "Advarsler",
    error: "Feil",
    checks: "Checks",
    skipped: "Skippet",
    passed: "Bestått",
    failed: "Feilet",
    productionTitle: "Produksjonsregel",
    productionBody:
      "Bruk tsaUrls + trustedTsas, host manifest stabilt, og ikke bruk skipTsa i produksjon.",
  },
  en: {
    mode: "Mode",
    local: "Local",
    online: "Online",
    envelope: "TrustEnvelope JSON",
    envelopeHelp: "Paste a TSP v3 envelope. In local mode, it never leaves the browser.",
    publicKey: "Instance public key or manifest JSON",
    publicKeyHelp:
      "Local mode needs an Ed25519 public JWK. If you paste manifest JSON, we use the instance id from envelope.signatures[0].keyRef.",
    manifestUrl: "Manifest URL",
    manifestJson: "Optional manifest JSON",
    manifestHelp:
      "Online mode fetches the manifest from keyRef. If you paste manifest JSON, it is used instead of a network fetch to the manifest URL.",
    allowLegacy: "Allow legacy alpha TSA placeholder",
    allowLegacyHelp: "Only for alpha/dev envelopes. Production should fail closed without a real TSA token.",
    verify: "Verify",
    file: "Load JSON file",
    result: "Result",
    waiting: "Paste an envelope and run verification.",
    valid: "Valid",
    invalid: "Invalid",
    warnings: "Warnings",
    error: "Error",
    checks: "Checks",
    skipped: "Skipped",
    passed: "Passed",
    failed: "Failed",
    productionTitle: "Production rule",
    productionBody:
      "Use tsaUrls + trustedTsas, host the manifest on a stable URL, and do not use skipTsa in production.",
  },
};

export function VerifyTool({ locale }: VerifyToolProps) {
  const isEn = locale === "en";
  const copy = isEn ? COPY.en : COPY.no;
  const [mode, setMode] = useState<Mode>("local");
  const [envelopeText, setEnvelopeText] = useState("");
  const [publicKeyText, setPublicKeyText] = useState(SAMPLE_PUBLIC_KEY);
  const [manifestUrl, setManifestUrl] = useState("");
  const [manifestText, setManifestText] = useState("");
  const [acceptLegacyTsa, setAcceptLegacyTsa] = useState(false);
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checks = useMemo(() => flattenChecks(result), [result]);

  async function handleFile(file: File | null) {
    if (!file) return;
    setEnvelopeText(await file.text());
  }

  async function runVerify() {
    setWorking(true);
    setError(null);
    setResult(null);
    try {
      const envelope = JSON.parse(envelopeText) as TrustEnvelope;
      if (mode === "local") {
        const publicKey = publicKeyFromInput(publicKeyText, envelope);
        setResult(await verifyLocal(envelope, { knownPublicKey: publicKey }));
      } else {
        setResult(
          await verifyOnline(envelope, {
            acceptLegacyTsa,
            fetch: manifestText.trim()
              ? manifestFetchFromJson(manifestUrl || manifestUrlFromEnvelope(envelope), manifestText)
              : globalThis.fetch,
          })
        );
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <section className="border border-border bg-surface p-5 md:p-6 mb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 text-ink font-semibold mb-1">
            <ShieldCheck className="w-5 h-5 text-brand" />
            Browser verify
          </div>
          <p className="text-sm text-muted max-w-2xl">{copy.envelopeHelp}</p>
        </div>
        <div className="inline-flex border border-border bg-paper p-1 w-fit">
          {(["local", "online"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-2 text-sm font-semibold ${
                mode === m ? "bg-brand text-white" : "text-muted hover:text-ink"
              }`}
            >
              {m === "local" ? copy.local : copy.online}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {copy.envelope}
            </span>
            <textarea
              value={envelopeText}
              onChange={(e) => setEnvelopeText(e.target.value)}
              className="mt-2 w-full min-h-[280px] border border-border bg-paper p-3 font-mono text-xs text-ink"
              spellCheck={false}
              placeholder='{"tsp":"3.0", ...}'
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-brand cursor-pointer">
            <Upload className="w-4 h-4" />
            {copy.file}
            <input
              className="sr-only"
              type="file"
              accept="application/json,.json"
              onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="space-y-4">
          {mode === "local" ? (
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {copy.publicKey}
              </span>
              <textarea
                value={publicKeyText}
                onChange={(e) => setPublicKeyText(e.target.value)}
                className="mt-2 w-full min-h-[178px] border border-border bg-paper p-3 font-mono text-xs text-ink"
                spellCheck={false}
              />
              <span className="mt-2 block text-xs text-muted">{copy.publicKeyHelp}</span>
            </label>
          ) : (
            <>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {copy.manifestUrl}
                </span>
                <input
                  value={manifestUrl}
                  onChange={(e) => setManifestUrl(e.target.value)}
                  className="mt-2 w-full border border-border bg-paper p-3 text-sm text-ink"
                  placeholder="https://org.example/.well-known/tsp-manifest.json"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {copy.manifestJson}
                </span>
                <textarea
                  value={manifestText}
                  onChange={(e) => setManifestText(e.target.value)}
                  className="mt-2 w-full min-h-[120px] border border-border bg-paper p-3 font-mono text-xs text-ink"
                  spellCheck={false}
                  placeholder='{"schemaVersion":"tsp-manifest-1.0", ...}'
                />
                <span className="mt-2 block text-xs text-muted">{copy.manifestHelp}</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={acceptLegacyTsa}
                  onChange={(e) => setAcceptLegacyTsa(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="font-semibold">{copy.allowLegacy}</span>
                  <span className="block text-xs text-muted">{copy.allowLegacyHelp}</span>
                </span>
              </label>
            </>
          )}

          <button
            type="button"
            onClick={() => void runVerify()}
            disabled={working || !envelopeText.trim()}
            className="tsp-btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {working ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileJson className="w-4 h-4" />}
            {copy.verify}
          </button>

          <div className="border-l-2 border-brand pl-4 py-3 bg-brand/5">
            <div className="text-sm font-semibold text-ink">{copy.productionTitle}</div>
            <p className="text-xs text-muted mt-1">{copy.productionBody}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 border border-border bg-paper p-4">
        <h2 className="text-base mb-3">{copy.result}</h2>
        {error ? (
          <StatusLine icon="error" label={copy.error} text={error} />
        ) : result ? (
          <>
            <StatusLine
              icon={result.valid ? "ok" : "fail"}
              label={result.valid ? copy.valid : copy.invalid}
              text={result.valid ? "TSP v3 checks passed." : "One or more required checks failed."}
            />
            {result.warnings.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                  {copy.warnings}
                </div>
                <ul className="text-sm text-muted list-disc pl-5 space-y-1">
                  {result.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                {copy.checks}
              </div>
              <div className="grid gap-2">
                {checks.map((check) => (
                  <div key={check.name} className="flex gap-3 border border-border bg-surface p-3">
                    <CheckIcon status={check.result.status} />
                    <div>
                      <div className="text-sm font-semibold text-ink">
                        {check.name} · {labelStatus(check.result.status, copy)}
                      </div>
                      <div className="text-xs text-muted break-words">{check.result.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">{copy.waiting}</p>
        )}
      </div>
    </section>
  );
}

function StatusLine({ icon, label, text }: { icon: "ok" | "fail" | "error"; label: string; text: string }) {
  const Icon = icon === "ok" ? CheckCircle2 : icon === "fail" ? XCircle : AlertOctagon;
  const color = icon === "ok" ? "text-verify" : icon === "fail" ? "text-danger" : "text-warn";
  return (
    <div className="flex items-start gap-3">
      <Icon className={`w-5 h-5 mt-0.5 ${color}`} />
      <div>
        <div className="font-semibold text-ink">{label}</div>
        <div className="text-sm text-muted">{text}</div>
      </div>
    </div>
  );
}

function CheckIcon({ status }: { status: CheckResult["status"] }) {
  if (status === "passed") return <CheckCircle2 className="w-4 h-4 text-verify mt-0.5 shrink-0" />;
  if (status === "failed") return <XCircle className="w-4 h-4 text-danger mt-0.5 shrink-0" />;
  return <AlertOctagon className="w-4 h-4 text-warn mt-0.5 shrink-0" />;
}

function labelStatus(status: CheckResult["status"], copy: typeof COPY.en) {
  if (status === "passed") return copy.passed;
  if (status === "failed") return copy.failed;
  return copy.skipped;
}

function flattenChecks(result: VerifyResult | null): Array<{ name: string; result: CheckResult }> {
  if (!result) return [];
  const checks = result.checks;
  const out: Array<{ name: string; result: CheckResult }> = [
    { name: "schema", result: checks.schema },
    { name: "contentHash", result: checks.contentHash },
    { name: "ledgerHash", result: checks.ledgerHash },
    { name: "manifestFetch", result: checks.manifestFetch },
    { name: "rootSignature", result: checks.rootSignature },
    { name: "certChain", result: checks.certChain },
    { name: "certValidity", result: checks.certValidity },
    { name: "revocation", result: checks.revocation },
    { name: "tsa", result: checks.tsa },
  ];
  if (checks.dane) out.push({ name: "dane", result: checks.dane });
  checks.signatures.forEach((result, i) => out.push({ name: `signature[${i}]`, result }));
  return out;
}

function publicKeyFromInput(input: string, envelope: TrustEnvelope): JwkEd25519Public {
  const parsed = JSON.parse(input);
  if (parsed.kty === "OKP" && parsed.crv === "Ed25519" && parsed.x) return parsed;
  const instanceId = envelope.signatures[0]?.keyRef?.split("#")[1];
  const instance = parsed.instances?.find((entry: { id?: string }) => entry.id === instanceId);
  if (instance?.publicKey) return instance.publicKey;
  throw new Error("Could not find an Ed25519 public key in the local input.");
}

function manifestUrlFromEnvelope(envelope: TrustEnvelope): string {
  const keyRef = envelope.signatures[0]?.keyRef;
  if (!keyRef || !keyRef.includes("#")) throw new Error("Envelope signature keyRef is missing a manifest URL.");
  return keyRef.slice(0, keyRef.indexOf("#"));
}

function manifestFetchFromJson(manifestUrl: string, manifestText: string): typeof globalThis.fetch {
  const manifest = JSON.parse(manifestText);
  return async (input) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    if (manifestUrl && url !== manifestUrl) {
      return new Response(JSON.stringify({ error: "manifest_url_mismatch", expected: manifestUrl, got: url }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }
    return new Response(JSON.stringify(manifest), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
}
