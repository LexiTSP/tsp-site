import {
  canonicalize,
  exportPublicKeyJwk,
  generateKeyPair,
  sha256Hex,
  sign as edSign,
  verifyLocal,
  wrap,
  type Alignment,
  type Declaration,
  type JwkEd25519Public,
  type Process,
  type Signer,
  type TrustEnvelope,
  type VerifyResult,
} from "@lexitsp/sdk/v3";

export const ADVANCED_VERIFY_DEFAULT_OPEN = false;

export type ValidatorLocale = "en" | "no" | string;

export interface ValidatorSample {
  envelope: TrustEnvelope;
  envelopeText: string;
  publicKey: JwkEd25519Public;
  publicKeyText: string;
  result: VerifyResult;
}

export interface TamperedValidatorSample {
  envelope: TrustEnvelope;
  envelopeText: string;
  result: VerifyResult;
}

const SAMPLE_OUTPUT =
  "TSP demo: this AI answer can be checked after delivery. If one character changes, the receipt no longer verifies.";

const SAMPLE_OUTPUT_NO =
  "TSP-demo: dette AI-svaret kan kontrolleres etter levering. Hvis ett tegn endres, verifiserer ikke kvitteringen lenger.";

const TAMPER_SUFFIX: Record<string, string> = {
  en: " [tampered after signing]",
  no: " [endret etter signering]",
};

export function canRunManualVerify(envelopeText: string, working: boolean): boolean {
  return !working && envelopeText.trim().length > 0;
}

export async function createValidatorSample(locale: ValidatorLocale = "en"): Promise<ValidatorSample> {
  const keyPair = await generateKeyPair();
  const publicKey = await exportPublicKeyJwk(keyPair.publicKey);

  const signer: Signer = {
    sign: (data) => edSign(keyPair.privateKey, data),
    publicKey,
    keyRef: "validator://browser-demo-instance",
    certChain: ["validator-demo-cert-placeholder"],
  };

  const declaration: Declaration = {
    primarySource: {
      type: "official-document",
      title: locale === "no" ? "TSP-validator demo" : "TSP validator demo",
      url: "https://truststandardprotocol.com/spec",
      retrieved: "2026-05-15T00:00:00.000Z",
    },
    citations: [
      {
        url: "https://truststandardprotocol.com/spec",
        paragraph: "TrustEnvelope",
        quote: "A signed evidence artifact for AI output verification.",
        retrieved: "2026-05-15T00:00:00.000Z",
      },
    ],
  };

  const process: Process = {
    model: {
      name: "validator-demo",
      version: "v3-alpha",
      provider: "lexitsp-browser",
      temperature: 0,
      contextWindow: 8192,
    },
    systemPrompt: {
      hash: await sha256Hex(canonicalize("produce a short protocol verification demo")),
      redacted: true,
      reason: "browser-demo",
    },
    pipeline: [{ name: "browser-generated-sample", durationMs: 0 }],
  };

  const alignment: Alignment = {
    uncertainty: [],
    flags: [],
    humanReviewRequired: false,
    policy: { id: "validator-demo", version: "1.0" },
  };

  const envelope = await wrap(
    { type: "text", value: locale === "no" ? SAMPLE_OUTPUT_NO : SAMPLE_OUTPUT },
    {
      signer,
      declaration,
      process,
      alignment,
      prevHash: "0".repeat(64),
      now: new Date("2026-05-15T00:00:00.000Z"),
      skipTsa: true,
    },
  );

  const result = await verifyLocal(envelope, { knownPublicKey: publicKey });

  return {
    envelope,
    envelopeText: formatJson(envelope),
    publicKey,
    publicKeyText: formatJson(publicKey),
    result,
  };
}

export async function tamperValidatorEnvelope(
  envelope: TrustEnvelope,
  publicKey: JwkEd25519Public,
  locale: ValidatorLocale = "en",
): Promise<TamperedValidatorSample> {
  const suffix = TAMPER_SUFFIX[locale] ?? TAMPER_SUFFIX.en;
  const tampered: TrustEnvelope = {
    ...envelope,
    content: {
      ...envelope.content,
      value: `${envelope.content.value}${suffix}`,
    },
  };
  const result = await verifyLocal(tampered, { knownPublicKey: publicKey });

  return {
    envelope: tampered,
    envelopeText: formatJson(tampered),
    result,
  };
}

export function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
