"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
  ArrowRight,
  Sparkles,
  AlertOctagon,
  ShieldCheck,
  RotateCcw,
  Pencil,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  generateKeyPair,
  exportPublicKeyJwk,
  sign as edSign,
  sha256Hex,
  canonicalize,
  wrap,
  verifyLocal,
  type TrustEnvelope,
  type Declaration,
  type Process,
  type Alignment,
  type Signer,
  type JwkEd25519Public,
  type VerifyResult,
} from "@lexitsp/sdk/v3";

type SourcePreset = "lovdata" | "internal" | "model-knowledge";

function sourcePresets(isEn: boolean): Record<
  SourcePreset,
  { label: string; tagline: string; declaration: Declaration }
> {
  return {
    lovdata: {
      label: isEn ? "Lovdata / laws and rules" : "Lovdata / lover og regler",
      tagline: isEn
        ? "The AI answer is grounded in a concrete legal source."
        : "AI-svaret bygger på en konkret lov-paragraf.",
      declaration: {
        primarySource: {
          type: "legal-database",
          url: "https://lovdata.no/lov/1997-02-28-19/§11-5",
          title: "Folketrygdloven § 11-5",
          retrieved: new Date().toISOString(),
        },
        citations: [],
      },
    },
    internal: {
      label: isEn ? "Internal knowledge base" : "Intern kunnskapsbase",
      tagline: isEn
        ? "The AI answer is based on internal documents or a RAG database."
        : "AI-svaret bygger på interne dokumenter eller en RAG-database.",
      declaration: {
        primarySource: {
          type: "verified-website",
          title: isEn
            ? "Internal KB · work assessment benefits"
            : "Intern KB · arbeidsavklaringspenger",
          retrieved: new Date().toISOString(),
        },
        citations: [],
      },
    },
    "model-knowledge": {
      label: isEn ? "Model knowledge" : "Modellens egen kunnskap",
      tagline: isEn
        ? "No external source. The answer comes from the model itself."
        : "Ingen ekstern kilde. Svaret kommer fra AI-en selv.",
      declaration: {
        primarySource: {
          type: "model-knowledge",
          title: isEn
            ? "Model knowledge (no external source)"
            : "Modell-kunnskap (ingen ekstern kilde)",
        },
        citations: [],
      },
    },
  };
}

const COPY = {
  no: {
    defaultContent:
      "Du har rett på arbeidsavklaringspenger fordi arbeidsevnen din er nedsatt med minst 50 % og du oppfyller folketrygdloven § 11-5.",
    h1: "Prøv det selv — i nettleseren.",
    lead:
      "Skriv et AI-svar, velg hvor det kommer fra, klikk «Signer». Vi lager en ekte signert TrustEnvelope i nettleseren din — ingenting sendes til oss. Klikk «Endre svaret» etterpå for å se hva som skjer når noen tukler.",
    real:
      "Dette er ikke en simulering.",
    realAfter:
      " som kjører — Ed25519 + SHA-256 + RFC 8785 — bare uten ekstern TSA-tjeneste (vi bruker en placeholder-token i dev-modus).",
    step1: "Steg 1 · Skriv et AI-svar",
    placeholder: "Lim inn et AI-svar her, eller bruk eksempelet.",
    helper: "Default-eksempel: et velferds-relevant AAP-svar. Skriv ditt eget hvis du vil.",
    step2: "Steg 2 · Hvor kommer svaret fra?",
    sourceHelper:
      "Bak knappen settes declaration.primarySource i envelope-en. Compliance-ansvarlig får en strukturert kilde-erklæring uten å måtte forstå skjemaet.",
    signing: "Signerer i nettleseren …",
    sign: "Signer svaret",
    signHelper:
      "Genererer en Ed25519-nøkkel, signerer envelope-en, og verifiserer den — alt i nettleseren din.",
    error: "Feil",
    valid: "Signert og verifisert",
    invalid: "Hash brutt — manipulasjon oppdaget",
    content: "Innhold",
    source: "Kilde",
    noSource: "Ingen ekstern kilde — modellens egen kunnskap",
    model: "Modell",
    temp: "temperatur",
    timestamp: "Tidspunkt",
    devTimestamp: "(playground-modus: dev-tidspunkt, ikke RFC 3161 TSA)",
    chainHash: "Kjede-hash",
    chainDetail: "SHA-256 av canonical envelope",
    checked: "Hva ble sjekket",
    contentCheck: "Innhold matcher hash",
    signatureCheck: "Signatur er gyldig",
    ledgerCheck: "Kjede-binding er konsistent",
    verifying: "Verifiserer …",
    tamper: "Endre svaret etter signering",
    tamperSuffix: " (ENDRET ETTER SIGNERING)",
    reset: "Start på nytt",
    caughtTitle: "Det er det TSP fanger.",
    caught:
      "Vi la til ett eneste tegn etter at svaret ble signert. Re-hash-en stemmer ikke lenger med det signaturen ble lagd over — så signaturen blir matematisk ugyldig. Det er ikke en regel vi har programmert. Det er fysikk i kryptografien.",
    raw: "Vis rå JSON (for utviklere)",
    notShownTitle: "Hva playgrounden ikke viser",
    notShown1:
      "Ekstern tidsstempling (RFC 3161 TSA) krever et nettverkskall til en ekstern tjeneste. SDK-en har det innebygd, men vi hopper over det her for enkelhets skyld.",
    notShown2:
      "Manifest + cert-kjede: i en ekte deployment ligger nøkkelen i organisasjonens manifest. Her genererer vi en ny nøkkel hver gang i nettleseren.",
    notShown3:
      "Plattform-modulene (Risk-alarmer, reviewer-kø, evidence-pakker) krever en backend.",
    docs: "Les API-referansen",
    spec: "Les spec",
    mapping: "Se EU AI Act-mapping",
  },
  en: {
    defaultContent:
      "You are entitled to work assessment benefits because your work capacity is reduced by at least 50% and you meet the legal threshold in Folketrygdloven § 11-5.",
    h1: "Try it yourself — in the browser.",
    lead:
      "Write an AI answer, choose where it came from, and click “Sign”. We create a real signed TrustEnvelope in your browser — nothing is sent to us. Then click “Change the answer” to see what tampering does.",
    real: "This is not a simulation.",
    realAfter:
      " running in the browser — Ed25519 + SHA-256 + RFC 8785 — just without an external TSA service here (we use a placeholder token in dev mode).",
    step1: "Step 1 · Write an AI answer",
    placeholder: "Paste an AI answer here, or use the example.",
    helper: "Default example: a welfare-domain answer. Replace it with your own if you want.",
    step2: "Step 2 · Where did the answer come from?",
    sourceHelper:
      "Behind the button, the playground sets declaration.primarySource in the envelope. Compliance gets a structured source declaration without reading the schema.",
    signing: "Signing in the browser …",
    sign: "Sign answer",
    signHelper:
      "Generates an Ed25519 key, signs the envelope, and verifies it — all inside your browser.",
    error: "Error",
    valid: "Signed and verified",
    invalid: "Hash broken — tampering detected",
    content: "Content",
    source: "Source",
    noSource: "No external source — model knowledge",
    model: "Model",
    temp: "temperature",
    timestamp: "Timestamp",
    devTimestamp: "(playground mode: dev timestamp, not RFC 3161 TSA)",
    chainHash: "Chain hash",
    chainDetail: "SHA-256 over the canonical envelope",
    checked: "What was checked",
    contentCheck: "Content matches hash",
    signatureCheck: "Signature is valid",
    ledgerCheck: "Chain binding is consistent",
    verifying: "Verifying …",
    tamper: "Change the answer after signing",
    tamperSuffix: " (CHANGED AFTER SIGNING)",
    reset: "Start over",
    caughtTitle: "That is what TSP catches.",
    caught:
      "We added a few characters after the answer was signed. The recomputed hash no longer matches what the signature covered, so the signature becomes mathematically invalid. This is not a policy rule. It is cryptography doing its job.",
    raw: "Show raw JSON (for developers)",
    notShownTitle: "What the playground does not show",
    notShown1:
      "External timestamping (RFC 3161 TSA) requires a network call to a trusted timestamp authority. The SDK supports it, but this browser demo skips it for simplicity.",
    notShown2:
      "Manifest + certificate chain: in a real deployment, the key lives in the organization manifest. Here we generate a new browser key every run.",
    notShown3:
      "Platform modules (Risk alerts, reviewer queue, evidence packages) require a backend.",
    docs: "Read API reference",
    spec: "Read spec",
    mapping: "See EU AI Act mapping",
  },
};

export default function PlaygroundPage() {
  const locale = useLocale();
  const isEn = locale === "en";
  const copy = isEn ? COPY.en : COPY.no;
  const presets = sourcePresets(isEn);
  const [content, setContent] = useState(copy.defaultContent);
  const [preset, setPreset] = useState<SourcePreset>("lovdata");

  const [working, setWorking] = useState<"idle" | "wrapping" | "verifying">("idle");
  const [envelope, setEnvelope] = useState<TrustEnvelope | null>(null);
  const [publicJwk, setPublicJwk] = useState<JwkEd25519Public | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [tampered, setTampered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWrap = async () => {
    setError(null);
    setWorking("wrapping");
    setEnvelope(null);
    setVerifyResult(null);
    setTampered(false);
    try {
      const keyPair = await generateKeyPair();
      const jwk = await exportPublicKeyJwk(keyPair.publicKey);

      const signer: Signer = {
        sign: (data) => edSign(keyPair.privateKey, data),
        publicKey: jwk,
        keyRef: "playground://demo-instance",
        certChain: ["playground-cert-placeholder"],
      };

      const declaration = presets[preset].declaration;
      const proc: Process = {
        model: {
          name: "playground-demo",
          version: "v3-alpha",
          provider: "lexitsp-playground",
          temperature: 0.0,
          contextWindow: 8192,
        },
        systemPrompt: {
          hash: await sha256Hex(canonicalize("you are a helpful AI assistant")),
          redacted: true,
          reason: "playground-default",
        },
        pipeline: [{ name: "playground-demo", durationMs: 0 }],
      };
      const alignment: Alignment = {
        uncertainty: [],
        flags: [],
        humanReviewRequired: false,
        policy: { id: "playground", version: "1.0" },
      };

      const env = await wrap(
        { type: "text", value: content },
        {
          signer,
          declaration,
          process: proc,
          alignment,
          prevHash: "0".repeat(64),
          skipTsa: true,
        }
      );

      setEnvelope(env);
      setPublicJwk(jwk);

      const result = await verifyLocal(env, { knownPublicKey: jwk });
      setVerifyResult(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setWorking("idle");
    }
  };

  const handleTamper = async () => {
    if (!envelope || !publicJwk) return;
    setError(null);
    setWorking("verifying");
    try {
      const tamperedEnv: TrustEnvelope = {
        ...envelope,
        content: {
          ...envelope.content,
          value: envelope.content.value + copy.tamperSuffix,
        },
      };
      setTampered(true);
      const result = await verifyLocal(tamperedEnv, { knownPublicKey: publicJwk });
      setVerifyResult(result);
      setEnvelope(tamperedEnv);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setWorking("idle");
    }
  };

  const handleReset = () => {
    setEnvelope(null);
    setPublicJwk(null);
    setVerifyResult(null);
    setTampered(false);
    setError(null);
  };

  return (
    <div className="tsp-container py-12 max-w-5xl">
      <div className="tsp-section-marker mb-3">§ Playground · alpha</div>
      <h1 className="mb-3">{copy.h1}</h1>
      <p className="text-lg text-muted max-w-2xl mb-3 leading-relaxed">
        {copy.lead}
      </p>
      <p className="text-sm text-muted max-w-2xl mb-10">
        <strong>{copy.real}</strong>{" "}
        {isEn ? (
          <>
            It is the actual <code className="tsp-code">@lexitsp/sdk/v3</code>
            {copy.realAfter}
          </>
        ) : (
          <>
            Det er den faktiske <code className="tsp-code">@lexitsp/sdk/v3</code>
            {copy.realAfter}
          </>
        )}
      </p>

      {/* STEG 1 + 2 — input */}
      <section className="border border-border bg-surface mb-6">
        <div className="border-b border-border bg-paper px-5 py-3">
          <div className="tsp-eyebrow text-ink">{copy.step1}</div>
        </div>
        <div className="p-5">
          <textarea
            className="w-full border border-border bg-paper px-3 py-2 text-sm leading-relaxed font-mono min-h-[110px] resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={working !== "idle" || envelope !== null}
            placeholder={copy.placeholder}
          />
          <p className="text-xs text-muted mt-2">{copy.helper}</p>
        </div>
      </section>

      <section className="border border-border bg-surface mb-6">
        <div className="border-b border-border bg-paper px-5 py-3">
          <div className="tsp-eyebrow text-ink">{copy.step2}</div>
        </div>
        <div className="p-5">
          <div className="grid sm:grid-cols-3 gap-3">
            {(Object.keys(presets) as SourcePreset[]).map((key) => {
              const p = presets[key];
              const active = preset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPreset(key)}
                  disabled={working !== "idle" || envelope !== null}
                  className={
                    "text-left border p-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed " +
                    (active
                      ? "border-brand bg-brand/5 ring-1 ring-brand"
                      : "border-border bg-paper hover:border-brand-light")
                  }
                >
                  <div className="font-medium text-ink text-sm mb-1">{p.label}</div>
                  <div className="text-xs text-muted leading-snug">{p.tagline}</div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted mt-3">{copy.sourceHelper}</p>
        </div>
      </section>

      {/* STEG 3 — handling */}
      {!envelope && (
        <div className="text-center mb-12">
          <button
            type="button"
            onClick={handleWrap}
            disabled={working !== "idle" || !content.trim()}
            className="tsp-btn-primary text-base px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {working === "wrapping" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> {copy.signing}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> {copy.sign}
              </>
            )}
          </button>
          <p className="text-xs text-muted mt-3">
            {copy.signHelper}
          </p>
        </div>
      )}

      {error && (
        <div className="border-l-2 border-danger pl-4 py-3 bg-danger/5 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertOctagon className="w-4 h-4 text-danger" />
            <span className="text-sm font-semibold text-ink">{copy.error}</span>
          </div>
          <p className="text-sm text-muted font-mono break-all">{error}</p>
        </div>
      )}

      {envelope && verifyResult && (
        <>
          {/* Signed result panel */}
          <section
            className={
              "border-2 mb-6 " +
              (verifyResult.valid
                ? "border-verify"
                : "border-danger")
            }
          >
            <div
              className={
                "px-5 py-3 flex items-center justify-between gap-3 flex-wrap " +
                (verifyResult.valid ? "bg-verify/5" : "bg-danger/5")
              }
            >
              <div className="flex items-center gap-2">
                {verifyResult.valid ? (
                  <ShieldCheck className="w-5 h-5 text-verify" />
                ) : (
                  <AlertOctagon className="w-5 h-5 text-danger" />
                )}
                <div className="font-semibold text-ink">
                  {verifyResult.valid
                    ? copy.valid
                    : copy.invalid}
                </div>
              </div>
              <span className="tsp-section-marker">TrustEnvelope · TSP/3.0</span>
            </div>

            <div className="p-5 bg-surface">
              {/* Envelope content shown plain */}
              <div className="border border-border bg-paper p-4 mb-5">
                <div className="tsp-eyebrow text-muted mb-2">{copy.content}</div>
                <p className="text-sm text-ink leading-relaxed font-mono">
                  {envelope.content.value}
                </p>
              </div>

              {/* Field summary in plain language */}
              <dl className="grid sm:grid-cols-2 gap-3 mb-5 text-sm">
                <Field
                  label={copy.source}
                  value={presets[preset].label}
                  detail={
                    envelope.declaration.primarySource.type === "model-knowledge"
                      ? copy.noSource
                      : envelope.declaration.primarySource.title
                  }
                />
                <Field
                  label={copy.model}
                  value={`${envelope.process.model.name} ${envelope.process.model.version}`}
                  detail={`${copy.temp} ${envelope.process.model.temperature}`}
                />
                <Field
                  label={copy.timestamp}
                  value={new Date(envelope.timestamp.claimed).toLocaleString(isEn ? "en-GB" : "no-NB")}
                  detail={copy.devTimestamp}
                />
                <Field
                  label={copy.chainHash}
                  value={envelope.ledger.hash.slice(0, 14) + "…"}
                  detail={copy.chainDetail}
                  mono
                />
              </dl>

              {/* Verify checks (compact) */}
              <div className="border-t border-border pt-4 mb-5">
                <div className="tsp-eyebrow text-muted mb-2">{copy.checked}</div>
                <ul className="text-sm space-y-1.5">
                  <Check
                    label={copy.contentCheck}
                    detail={verifyResult.checks.contentHash.detail}
                    status={verifyResult.checks.contentHash.status}
                  />
                  <Check
                    label={copy.signatureCheck}
                    detail={
                      verifyResult.checks.signatures[0]?.detail ?? "ingen signatur funnet"
                    }
                    status={verifyResult.checks.signatures[0]?.status ?? "failed"}
                  />
                  <Check
                    label={copy.ledgerCheck}
                    detail={verifyResult.checks.ledgerHash.detail}
                    status={verifyResult.checks.ledgerHash.status}
                  />
                </ul>
              </div>

              {/* Tamper / reset actions */}
              <div className="flex flex-wrap gap-3">
                {!tampered && (
                  <button
                    type="button"
                    onClick={handleTamper}
                    disabled={working !== "idle"}
                    className="tsp-btn-secondary text-sm"
                  >
                    {working === "verifying" ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> {copy.verifying}
                      </>
                    ) : (
                      <>
                        <Pencil className="w-3 h-3" /> {copy.tamper}
                      </>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  className="tsp-btn-secondary text-sm"
                >
                  <RotateCcw className="w-3 h-3" /> {copy.reset}
                </button>
              </div>

              {/* Plain-language explainer when tampered */}
              {tampered && !verifyResult.valid && (
                <div className="mt-5 border-l-2 border-danger pl-4 py-3 bg-danger/5">
                  <div className="text-sm font-semibold text-ink mb-1">
                    {copy.caughtTitle}
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {copy.caught}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Raw JSON for developers */}
          <details className="border border-border bg-surface mb-12">
            <summary className="cursor-pointer px-5 py-3 bg-paper border-b border-border text-sm font-medium text-ink hover:text-brand">
              {copy.raw}
            </summary>
            <pre className="text-xs leading-relaxed font-mono p-5 overflow-x-auto bg-ink text-gray-100">
              {JSON.stringify(envelope, null, 2)}
            </pre>
          </details>
        </>
      )}

      {/* What's NOT in the playground (honest framing) */}
      <section className="border-l-2 border-muted pl-4 py-3 mb-8 bg-paper">
        <div className="text-sm font-semibold text-ink mb-2">
          {copy.notShownTitle}
        </div>
        <ul className="text-sm text-muted space-y-1 list-disc list-inside leading-relaxed">
          <li>
            {copy.notShown1}
          </li>
          <li>
            {copy.notShown2}
          </li>
          <li>
            {copy.notShown3} <Link href="/risk" className="text-brand">Risk</Link>,{" "}
            <Link href="/oversight" className="text-brand">Oversight</Link>,{" "}
            <Link href="/evidence" className="text-brand">Evidence</Link>.
          </li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/docs" className="tsp-btn-primary">
          {copy.docs} <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/spec" className="tsp-btn-secondary">
          {copy.spec}
        </Link>
        <Link href="/eu-ai-act" className="tsp-btn-secondary">
          {copy.mapping}
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  detail,
  mono,
}: {
  label: string;
  value: string;
  detail?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="tsp-eyebrow text-muted mb-1">{label}</dt>
      <dd className={"text-ink text-sm " + (mono ? "font-mono" : "")}>{value}</dd>
      {detail && (
        <dd className="text-xs text-muted mt-0.5 leading-snug">{detail}</dd>
      )}
    </div>
  );
}

function Check({
  label,
  detail,
  status,
}: {
  label: string;
  detail: string;
  status: "passed" | "failed" | "skipped" | "warning";
}) {
  const ok = status === "passed";
  const skipped = status === "skipped";
  return (
    <li className="flex items-start gap-2">
      {ok ? (
        <CheckCircle2 className="w-4 h-4 text-verify shrink-0 mt-0.5" />
      ) : skipped ? (
        <span className="w-4 h-4 shrink-0 mt-0.5 text-muted text-xs">—</span>
      ) : (
        <XCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <div className={"text-ink " + (skipped ? "opacity-60" : "")}>{label}</div>
        {!ok && !skipped && (
          <div className="text-xs text-muted font-mono leading-snug">{detail}</div>
        )}
      </div>
    </li>
  );
}
