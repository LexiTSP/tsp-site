"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertOctagon,
  CheckCircle2,
  ChevronDown,
  FileJson,
  Loader2,
  RotateCcw,
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

import {
  ADVANCED_VERIFY_DEFAULT_OPEN,
  canRunManualVerify,
  createValidatorSample,
  tamperValidatorEnvelope,
} from "@/lib/tsp/validator-sample";

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
    envelopeHelp:
      "Start med en nettleser-generert TrustEnvelope som verifiserer lokalt. Lim inn din egen eller last opp JSON når du vil sjekke ekte output.",
    publicKey: "Instans public key eller manifest JSON",
    publicKeyHelp:
      "Lokal modus trenger en Ed25519 public JWK. Hvis du limer inn manifest JSON, bruker vi instance-id fra envelope.signatures[0].keyRef.",
    manifestUrl: "Manifest URL",
    manifestJson: "Valgfri manifest JSON",
    manifestHelp:
      "Online modus henter manifest fra keyRef. Hvis du limer inn manifest JSON, brukes den i stedet for nettverkskall til manifest-URLen.",
    allowLegacy: "Tillat legacy alpha-TSA placeholder",
    allowLegacyHelp: "Kun for alpha/dev envelopes. Produksjon skal feile lukket uten ekte TSA-token.",
    verify: "Verifiser envelope",
    verifySample: "Verifiser sample",
    tamperSample: "Manipuler sample",
    file: "Last JSON-fil",
    result: "Kvittering",
    waiting: "Sample genereres i nettleseren.",
    verified: "VERIFISERT",
    invalid: "INVALID",
    verifiedText: "Schema, innholdshash, ledgerhash og signatur holder.",
    invalidText: "En endring ble oppdaget. Kvitteringen holder ikke lenger.",
    warnings: "Advarsler",
    error: "Feil",
    coreChecks: "Kjernebevis",
    allChecks: "Alle checks",
    skipped: "Skippet",
    passed: "Bestått",
    failed: "Feilet",
    advanced: "Avansert verifisering",
    advancedHelp: "Manual public key, online manifest, TSA og revokering ligger her.",
    productionTitle: "Produksjonsregel",
    productionBody:
      "Bruk tsaUrls + trustedTsas, host manifest stabilt, og ikke bruk skipTsa i produksjon.",
  },
  en: {
    mode: "Mode",
    local: "Local",
    online: "Online",
    envelope: "TrustEnvelope JSON",
    envelopeHelp:
      "Start with a browser-generated TrustEnvelope that verifies locally. Paste your own or upload JSON when you want to inspect real output.",
    publicKey: "Instance public key or manifest JSON",
    publicKeyHelp:
      "Local mode needs an Ed25519 public JWK. If you paste manifest JSON, we use the instance id from envelope.signatures[0].keyRef.",
    manifestUrl: "Manifest URL",
    manifestJson: "Optional manifest JSON",
    manifestHelp:
      "Online mode fetches the manifest from keyRef. If you paste manifest JSON, it is used instead of a network fetch to the manifest URL.",
    allowLegacy: "Allow legacy alpha TSA placeholder",
    allowLegacyHelp: "Only for alpha/dev envelopes. Production should fail closed without a real TSA token.",
    verify: "Verify envelope",
    verifySample: "Verify sample",
    tamperSample: "Tamper sample",
    file: "Load JSON file",
    result: "Receipt",
    waiting: "Generating the sample in your browser.",
    verified: "VERIFIED",
    invalid: "INVALID",
    verifiedText: "Schema, content hash, ledger hash and signature hold.",
    invalidText: "A change was detected. The receipt no longer holds.",
    warnings: "Warnings",
    error: "Error",
    coreChecks: "Core evidence",
    allChecks: "All checks",
    skipped: "Skipped",
    passed: "Passed",
    failed: "Failed",
    advanced: "Advanced verification",
    advancedHelp: "Manual public key, online manifest, TSA and revocation live here.",
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
  const [advancedOpen, setAdvancedOpen] = useState(ADVANCED_VERIFY_DEFAULT_OPEN);
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const receiptChecks = useMemo(() => primaryReceiptChecks(result), [result]);
  const allChecks = useMemo(() => flattenChecks(result), [result]);

  useEffect(() => {
    let active = true;

    async function initSample() {
      setWorking(true);
      setError(null);
      try {
        const sample = await createValidatorSample(locale);
        if (!active) return;
        setMode("local");
        setEnvelopeText(sample.envelopeText);
        setPublicKeyText(sample.publicKeyText);
        setResult(sample.result);
      } catch (err) {
        if (active) setError((err as Error).message);
      } finally {
        if (active) setWorking(false);
      }
    }

    void initSample();
    return () => {
      active = false;
    };
  }, [locale]);

  async function handleFile(file: File | null) {
    if (!file) return;
    setEnvelopeText(await file.text());
    setResult(null);
    setError(null);
  }

  async function loadSample() {
    setWorking(true);
    setError(null);
    try {
      const sample = await createValidatorSample(locale);
      setMode("local");
      setEnvelopeText(sample.envelopeText);
      setPublicKeyText(sample.publicKeyText);
      setResult(sample.result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setWorking(false);
    }
  }

  async function runTamper() {
    setWorking(true);
    setError(null);
    try {
      let envelope: TrustEnvelope;
      let publicKey: JwkEd25519Public;
      if (!envelopeText.trim()) {
        const sample = await createValidatorSample(locale);
        envelope = sample.envelope;
        publicKey = sample.publicKey;
        setPublicKeyText(sample.publicKeyText);
      } else {
        envelope = JSON.parse(envelopeText) as TrustEnvelope;
        publicKey = publicKeyFromInput(publicKeyText, envelope);
      }

      const tampered = await tamperValidatorEnvelope(envelope, publicKey, locale);
      setMode("local");
      setEnvelopeText(tampered.envelopeText);
      setResult(tampered.result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setWorking(false);
    }
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
          }),
        );
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <section className="mb-10 overflow-hidden border border-brand/25 bg-[#060b12] text-white shadow-[0_24px_80px_rgba(6,11,18,0.18)]">
      <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(184,132,43,0.18),rgba(255,255,255,0.03))] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-5 w-5 text-[#d7a548]" />
              TrustEnvelope Validator
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/72">{copy.envelopeHelp}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <button
              type="button"
              onClick={() => void loadSample()}
              disabled={working}
              data-cta="load_sample"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#d7a548]/70 hover:bg-[#d7a548]/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {copy.verifySample}
            </button>
            <button
              type="button"
              onClick={() => void runTamper()}
              disabled={working}
              data-cta="tamper_sample"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-danger/50 bg-danger/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw className="h-4 w-4" />
              {copy.tamperSample}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="border-b border-white/10 p-5 md:p-6 lg:border-b-0 lg:border-r">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/55">
              {copy.envelope}
            </span>
            <textarea
              value={envelopeText}
              onChange={(e) => {
                setEnvelopeText(e.target.value);
                setResult(null);
                setError(null);
              }}
              data-cta="paste_envelope"
              className="mt-2 h-[420px] w-full resize-y border border-white/12 bg-black/35 p-3 font-mono text-xs leading-relaxed text-[#dce7f5] outline-none transition placeholder:text-white/30 focus:border-[#d7a548]/70"
              spellCheck={false}
              placeholder='{"tsp":"3.0", ...}'
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#d7a548]">
              <Upload className="h-4 w-4" />
              {copy.file}
              <input
                className="sr-only"
                type="file"
                accept="application/json,.json"
                onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <button
              type="button"
              onClick={() => void runVerify()}
              disabled={!canRunManualVerify(envelopeText, working)}
              data-cta="verify_envelope"
              className="tsp-btn-primary min-h-11 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {working ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
              {copy.verify}
            </button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="border border-white/12 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-white/45">
                  {copy.result}
                </div>
                <div
                  className={`mt-1 text-3xl font-semibold tracking-[0.08em] ${
                    result?.valid ? "text-verify" : result ? "text-danger" : "text-white"
                  }`}
                >
                  {result ? (result.valid ? copy.verified : copy.invalid) : "..."}
                </div>
              </div>
              {result ? (
                <CheckIcon status={result.valid ? "passed" : "failed"} size="lg" />
              ) : working ? (
                <Loader2 className="h-8 w-8 animate-spin text-[#d7a548]" />
              ) : (
                <AlertOctagon className="h-8 w-8 text-white/35" />
              )}
            </div>

            {error ? (
              <StatusLine icon="error" label={copy.error} text={error} />
            ) : result ? (
              <>
                <p className="text-sm leading-relaxed text-white/65">
                  {result.valid ? copy.verifiedText : copy.invalidText}
                </p>
                <div className="mt-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/45">
                    {copy.coreChecks}
                  </div>
                  <div className="grid gap-2">
                    {receiptChecks.map((check) => (
                      <ReceiptRow
                        key={check.name}
                        name={check.name}
                        result={check.result}
                        copy={copy}
                      />
                    ))}
                  </div>
                </div>
                {result.warnings.length > 0 && (
                  <div className="mt-5 border-l-2 border-[#d7a548] bg-[#d7a548]/8 py-3 pl-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/45">
                      {copy.warnings}
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-white/62">
                      {result.warnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-white/62">{copy.waiting}</p>
            )}
          </div>

          <details
            className="mt-4 border border-white/12 bg-black/25"
            open={advancedOpen}
            onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
              <span>
                <span className="block text-sm font-semibold text-white">{copy.advanced}</span>
                <span className="block text-xs text-white/52">{copy.advancedHelp}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-white/55" />
            </summary>

            <div className="space-y-4 border-t border-white/10 p-4">
              <div className="inline-flex border border-white/12 bg-black/30 p-1">
                {(["local", "online"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-3 py-2 text-sm font-semibold ${
                      mode === m ? "bg-[#d7a548] text-[#060b12]" : "text-white/62 hover:text-white"
                    }`}
                  >
                    {m === "local" ? copy.local : copy.online}
                  </button>
                ))}
              </div>

              {mode === "local" ? (
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/45">
                    {copy.publicKey}
                  </span>
                  <textarea
                    value={publicKeyText}
                    onChange={(e) => setPublicKeyText(e.target.value)}
                    className="mt-2 min-h-[170px] w-full border border-white/12 bg-black/35 p-3 font-mono text-xs leading-relaxed text-[#dce7f5] outline-none focus:border-[#d7a548]/70"
                    spellCheck={false}
                  />
                  <span className="mt-2 block text-xs text-white/55">{copy.publicKeyHelp}</span>
                </label>
              ) : (
                <>
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/45">
                      {copy.manifestUrl}
                    </span>
                    <input
                      value={manifestUrl}
                      onChange={(e) => setManifestUrl(e.target.value)}
                      className="mt-2 w-full border border-white/12 bg-black/35 p-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#d7a548]/70"
                      placeholder="https://org.example/.well-known/tsp-manifest.json"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/45">
                      {copy.manifestJson}
                    </span>
                    <textarea
                      value={manifestText}
                      onChange={(e) => setManifestText(e.target.value)}
                      className="mt-2 min-h-[120px] w-full border border-white/12 bg-black/35 p-3 font-mono text-xs leading-relaxed text-[#dce7f5] outline-none placeholder:text-white/30 focus:border-[#d7a548]/70"
                      spellCheck={false}
                      placeholder='{"schemaVersion":"tsp-manifest-1.0", ...}'
                    />
                    <span className="mt-2 block text-xs text-white/55">{copy.manifestHelp}</span>
                  </label>
                  <label className="flex items-start gap-2 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={acceptLegacyTsa}
                      onChange={(e) => setAcceptLegacyTsa(e.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-semibold">{copy.allowLegacy}</span>
                      <span className="block text-xs text-white/55">{copy.allowLegacyHelp}</span>
                    </span>
                  </label>
                </>
              )}

              {allChecks.length > 0 && (
                <details className="border border-white/10 bg-white/[0.02]">
                  <summary className="cursor-pointer p-3 text-sm font-semibold text-white">
                    {copy.allChecks}
                  </summary>
                  <div className="grid gap-2 border-t border-white/10 p-3">
                    {allChecks.map((check) => (
                      <ReceiptRow
                        key={check.name}
                        name={check.name}
                        result={check.result}
                        copy={copy}
                      />
                    ))}
                  </div>
                </details>
              )}

              <div className="border-l-2 border-[#d7a548] bg-[#d7a548]/8 py-3 pl-4">
                <div className="text-sm font-semibold text-white">{copy.productionTitle}</div>
                <p className="mt-1 text-xs text-white/60">{copy.productionBody}</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

function StatusLine({ icon, label, text }: { icon: "ok" | "fail" | "error"; label: string; text: string }) {
  const Icon = icon === "ok" ? CheckCircle2 : icon === "fail" ? XCircle : AlertOctagon;
  const color = icon === "ok" ? "text-verify" : icon === "fail" ? "text-danger" : "text-warn";
  return (
    <div className="flex items-start gap-3">
      <Icon className={`mt-0.5 h-5 w-5 ${color}`} />
      <div>
        <div className="font-semibold text-white">{label}</div>
        <div className="text-sm text-white/65">{text}</div>
      </div>
    </div>
  );
}

function CheckIcon({ status, size = "sm" }: { status: CheckResult["status"]; size?: "sm" | "lg" }) {
  const className = size === "lg" ? "h-8 w-8 shrink-0" : "mt-0.5 h-4 w-4 shrink-0";
  if (status === "passed") return <CheckCircle2 className={`${className} text-verify`} />;
  if (status === "failed") return <XCircle className={`${className} text-danger`} />;
  return <AlertOctagon className={`${className} text-warn`} />;
}

function ReceiptRow({
  name,
  result,
  copy,
}: {
  name: string;
  result: CheckResult;
  copy: typeof COPY.en;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-3 border border-white/10 bg-black/25 p-3">
      <CheckIcon status={result.status} />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white">
          {name} · {labelStatus(result.status, copy)}
        </div>
        <div className="break-words text-xs leading-relaxed text-white/55">{result.detail}</div>
      </div>
    </div>
  );
}

function labelStatus(status: CheckResult["status"], copy: typeof COPY.en) {
  if (status === "passed") return copy.passed;
  if (status === "failed") return copy.failed;
  return copy.skipped;
}

function primaryReceiptChecks(result: VerifyResult | null): Array<{ name: string; result: CheckResult }> {
  if (!result) return [];
  const signature = result.checks.signatures[0] ?? {
    status: "failed",
    detail: "No signature present.",
  } satisfies CheckResult;

  return [
    { name: "schema", result: result.checks.schema },
    { name: "contentHash", result: result.checks.contentHash },
    { name: "ledgerHash", result: result.checks.ledgerHash },
    { name: "signature", result: signature },
  ];
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
