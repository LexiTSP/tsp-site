import { Link } from "@/i18n/navigation";
import { VerifyTool } from "@/components/VerifyTool";
import { ArrowRight, FileCode, AlertOctagon, ShieldCheck, Terminal } from "lucide-react";

const COPY = {
  no: {
    title: "Verifisering — TSP v3",
    description:
      "Verifiser TSP v3-envelopes lokalt med verifyLocal eller online med manifest, revokering, TSA og sequence-state.",
    h1: "Verifiser TSP v3-envelopes.",
    lead:
      "Den autoritative verify-flyten ligger i @lexitsp/sdk/v3. Lokal verifisering sjekker schema, content hash, ledger hash og signatur. Online-verifisering legger til manifest, org-root, cert-kjede, revokering, TSA og valgfri DANE.",
    status:
      "Denne siden kjører lokal og online TSP v3-verifisering i nettleseren. Lokal modus gjør ingen nettverkskall; online modus feiler lukket på manifest-, trust- eller TSA-feil.",
    terminalTitle: "Verifiser lokalt",
    terminalHelp:
      "Lokal-modus krever at du kjenner instansens offentlige nøkkel. Den gjør ingen nettverkskall.",
    apiReference: "API-referansen",
    onlineTitle: "Verifiser online",
    onlineHelp:
      "Online-modus henter manifestet fra signature.keyRef og feiler lukket ved nettverks-, trust- eller TSA-feil med mindre legacy alpha-TSA er eksplisitt tillatt.",
    playgroundTitle: "Interaktiv demo",
    playgroundBody:
      "Playgrounden signerer et svar i nettleseren og viser hvordan verifisering bryter når innholdet endres etter signering.",
    playgroundCta: "Åpne playground",
    specTitle: "Full v3-skjema",
    specBody:
      "Les hva som signeres, hvordan canonical JSON beregnes, og hvordan manifest-PKI, TSA og DANE henger sammen.",
    specCta: "Les spec",
    statusLabel: "Status",
  },
  en: {
    title: "Verification — TSP v3",
    description:
      "Verify TSP v3 envelopes locally with verifyLocal or online with manifest, revocation, TSA, and sequence-state checks.",
    h1: "Verify TSP v3 envelopes.",
    lead:
      "The authoritative verification flow lives in @lexitsp/sdk/v3. Local verification checks schema, content hash, ledger hash, and signature. Online verification adds manifest, org-root, certificate chain, revocation, TSA, and optional DANE.",
    status:
      "This page runs local and online TSP v3 verification in the browser. Local mode performs no network calls; online mode fails closed on manifest, trust, or TSA failures.",
    terminalTitle: "Verify locally",
    terminalHelp:
      "Local mode requires the instance public key. It performs no network calls.",
    apiReference: "API reference",
    onlineTitle: "Verify online",
    onlineHelp:
      "Online mode fetches the manifest from signature.keyRef and fails closed on network, trust, or TSA failures unless legacy alpha TSA is explicitly allowed.",
    playgroundTitle: "Interactive demo",
    playgroundBody:
      "The playground signs an answer in the browser and shows how verification breaks when content changes after signing.",
    playgroundCta: "Open playground",
    specTitle: "Full v3 schema",
    specBody:
      "Read what is signed, how canonical JSON is computed, and how manifest PKI, TSA, and DANE fit together.",
    specCta: "Read spec",
    statusLabel: "Status",
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
    <div className="tsp-container py-16">
      <div className="tsp-section-marker mb-3">§ Verify · alpha</div>
      <h1 className="mb-4">{copy.h1}</h1>
      <p className="text-lg text-muted max-w-2xl mb-3">
        {copy.lead}
      </p>
      <p className="text-sm text-muted max-w-2xl mb-10">
        {copy.status}
      </p>

      <VerifyTool locale={locale} />

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
  );
}
