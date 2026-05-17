import { Link } from "@/i18n/navigation";
import { VerifyTool } from "@/components/VerifyTool";
import { ArrowRight, FileCode, AlertOctagon, ShieldCheck, Terminal } from "lucide-react";
import { V2BoundaryNote, V2CanonicalStrip, V2PageHero } from "@/components/V2ProofSurface";

const COPY = {
  no: {
    title: "TrustEnvelope Validator — TSP",
    description:
      "Verifiser en TrustEnvelope i nettleseren, manipuler samplet, og se kryptografien fange endringen.",
    h1: "Verifiser en TrustEnvelope.",
    lead:
      "Last samplet, se VERIFISERT, endre ett tegn, og se kvitteringen falle til INVALID. Dette er gapet TSP dekker: ikke mer tillit basert på påstander, men bevis som kan kontrolleres.",
    status:
      "Lokal modus gjør ingen nettverkskall. Avansert modus kan bruke manifest, revokering, TSA og sequence-state når du vil teste en produksjonslignende flyt.",
    terminalTitle: "Verifiser lokalt",
    terminalHelp:
      "Lokal-modus krever at du kjenner instansens offentlige nøkkel. Den gjør ingen nettverkskall.",
    apiReference: "API-referansen",
    onlineTitle: "Verifiser online",
    onlineHelp:
      "Online-modus henter manifestet fra signature.keyRef og feiler lukket ved nettverks-, trust- eller TSA-feil med mindre legacy alpha-TSA er eksplisitt tillatt.",
    playgroundTitle: "Signing playground",
    playgroundBody:
      "Bygg og signer en envelope i nettleseren før du verifiserer eller manipulerer den her.",
    playgroundCta: "Åpne playground",
    specTitle: "Full v3-skjema",
    specBody:
      "Les hva som signeres, hvordan canonical JSON beregnes, og hvordan manifest-PKI, TSA og DANE henger sammen.",
    specCta: "Les spec",
    statusLabel: "Status",
    heroEyebrow: "Bevisobjekt · verifiserbart i nettleseren",
    heroTitle: "Kan noen andre verifisere AI-svaret?",
    heroLead:
      "Dette er kvitteringsøyeblikket. Last en signert TrustEnvelope, verifiser lokalt, endre ett tegn, og se beviset ryke.",
    heroProof1: "Ingen leverandørtillit kreves",
    heroProof2: "Lokal og online modus",
    heroProof3: "Manipulasjon blir synlig",
    boundaryTitle: "Hva denne validatoren ikke gjør",
    boundaryBody:
      "Nettleser-validatoren beviser integriteten til en envelope. Den avgjør ikke juridisk samsvar, erstatter ikke menneskelig review og garanterer ikke at alle kilder i kvitteringen er juridisk tilstrekkelige.",
  },
  en: {
    title: "TrustEnvelope Validator — TSP",
    description:
      "Verify a TrustEnvelope in the browser, tamper the sample, and watch cryptography catch the change.",
    h1: "Verify a TrustEnvelope.",
    lead:
      "Load the sample, see VERIFIED, change one character, and watch the receipt flip to INVALID. This is the gap TSP closes: trust by proof, not trust by assertion.",
    status:
      "Local mode performs no network calls. Advanced mode can use manifest, revocation, TSA and sequence-state checks when you want to test a production-style path.",
    terminalTitle: "Verify locally",
    terminalHelp:
      "Local mode requires the instance public key. It performs no network calls.",
    apiReference: "API reference",
    onlineTitle: "Verify online",
    onlineHelp:
      "Online mode fetches the manifest from signature.keyRef and fails closed on network, trust, or TSA failures unless legacy alpha TSA is explicitly allowed.",
    playgroundTitle: "Signing playground",
    playgroundBody:
      "Build and sign an envelope in the browser before verifying or tampering with it here.",
    playgroundCta: "Open playground",
    specTitle: "Full v3 schema",
    specBody:
      "Read what is signed, how canonical JSON is computed, and how manifest PKI, TSA, and DANE fit together.",
    specCta: "Read spec",
    statusLabel: "Status",
    heroEyebrow: "Proof object · browser-verifiable",
    heroTitle: "Can someone else verify the AI answer?",
    heroLead:
      "This is the receipt moment. Load a signed TrustEnvelope, verify it locally, change one character, and watch the proof break.",
    heroProof1: "No vendor trust required",
    heroProof2: "Local and online modes",
    heroProof3: "Tamper result is visible",
    boundaryTitle: "What this validator does not do",
    boundaryBody:
      "The browser validator proves envelope integrity. It does not decide legal conformity, replace human review, or guarantee that every source inside the envelope was legally sufficient.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = locale === "en" ? COPY.en : COPY.no;
  return { title: copy.title, description: copy.description };
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = locale === "en" ? COPY.en : COPY.no;
  return (
    <>
      <V2PageHero
        eyebrow={copy.heroEyebrow}
        title={copy.heroTitle}
        lead={copy.heroLead}
        primaryCta={{ href: "#validator", label: locale === "en" ? "Verify the sample" : "Verifiser samplet" }}
        secondaryCta={{ href: "/playground", label: copy.playgroundCta }}
        proofItems={[
          { label: "Independence", value: copy.heroProof1 },
          { label: "Verification", value: copy.heroProof2 },
          { label: "Outcome", value: copy.heroProof3 },
        ]}
      />
      <V2CanonicalStrip locale={locale} />

    <div id="validator" className="tsp-container py-16 scroll-mt-20">
      <p className="text-sm text-muted max-w-2xl mb-10">{copy.status}</p>

      <VerifyTool locale={locale} />

      <div className="mb-10">
        <V2BoundaryNote title={copy.boundaryTitle}>{copy.boundaryBody}</V2BoundaryNote>
      </div>

      <div className="border border-border bg-surface p-6 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-5 h-5 text-brand" />
          <span className="font-semibold text-ink">{copy.terminalTitle}</span>
        </div>
        <pre className="bg-ink text-gray-100 text-xs font-mono p-4 overflow-x-auto leading-relaxed">{`import { verifyLocal } from "@lexitsp/sdk/v3";

const envelope = JSON.parse(await Bun.file("envelope.json").text());
const publicKey = JSON.parse(await Bun.file("instance-public.jwk").text());
const result = await verifyLocal(envelope, { knownPublicKey: publicKey });

console.log(result.valid ? "OK" : "FAIL", result);`}</pre>
        <p className="text-xs text-muted mt-3">
          {copy.terminalHelp}{" "}
          <Link href="/docs#verify" className="text-brand">{copy.apiReference}</Link>.
        </p>
      </div>

      <div className="border border-border bg-surface p-6 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-brand" />
          <span className="font-semibold text-ink">{copy.onlineTitle}</span>
        </div>
        <pre className="bg-ink text-gray-100 text-xs font-mono p-4 overflow-x-auto leading-relaxed">{`import { verifyOnline } from "@lexitsp/sdk/v3";

const envelope = JSON.parse(await Bun.file("envelope.json").text());
const result = await verifyOnline(envelope, {
  trustedTsas: [
    // { name: "Your TSA", certSha256: "..." }
  ]
});

console.log(result.valid ? "OK" : "FAIL", result.checks);`}</pre>
        <p className="text-xs text-muted mt-3">{copy.onlineHelp}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <Link
          href="/playground"
          className="block border border-border bg-surface p-6 hover:border-brand no-underline"
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-brand" />
            <span className="font-semibold text-ink">{copy.playgroundTitle}</span>
          </div>
          <p className="text-sm text-muted leading-snug mb-3">
            {copy.playgroundBody}
          </p>
          <span className="text-sm text-brand inline-flex items-center gap-1">
            {copy.playgroundCta} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          href="/spec"
          data-cta="read_spec"
          className="block border border-border bg-surface p-6 hover:border-brand no-underline"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="w-5 h-5 text-brand" />
            <span className="font-semibold text-ink">{copy.specTitle}</span>
          </div>
          <p className="text-sm text-muted leading-snug mb-3">
            {copy.specBody}
          </p>
          <span className="text-sm text-brand inline-flex items-center gap-1">
            {copy.specCta} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      <div className="border-l-2 border-warn pl-4 py-3 bg-warn/5">
        <div className="flex items-center gap-2 mb-1">
          <AlertOctagon className="w-4 h-4 text-warn" />
          <span className="text-sm font-semibold text-ink">{copy.statusLabel}</span>
        </div>
        <p className="text-sm text-muted">
          {copy.status}
        </p>
      </div>
    </div>
    </>
  );
}
