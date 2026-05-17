import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  FileSearch,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

const COPY = {
  en: {
    metaTitle: "The AI verification gap - TSP",
    metaDesc:
      "Why screenshots, logs and dashboards are not enough proof for AI outputs, and how TSP receipts close the gap.",
    breadcrumb: "Verification gap",
    h1: "The verification gap is where AI trust breaks.",
    lead:
      "AI systems are moving into decisions, support, procurement and public services. When someone asks what happened later, most teams still answer with screenshots, mutable logs or vendor dashboards.",
    primary: "Open the validator",
    secondary: "Read the SDK path",
    painTitle: "What fails without a receipt",
    painLead:
      "The risk is not only a bad answer. The deeper risk is being unable to prove the source, process, policy, timestamp and tamper state after the answer has left the system.",
    proofTitle: "What TSP adds",
    proofLead:
      "TSP turns an AI output into a signed TrustEnvelope that can be checked independently, even when the original app or vendor is not in the room.",
    closeTitle: "The buyer question is simple: can this answer be verified later?",
    closeLead:
      "If the answer is no, procurement, audit and incident review all get harder. If the answer is yes, trust shifts from promises to evidence.",
  },
  no: {
    metaTitle: "Verifikasjonsgapet for AI - TSP",
    metaDesc:
      "Hvorfor skjermbilder, logger og dashboard ikke er nok bevis for AI-output, og hvordan TSP-kvitteringer lukker gapet.",
    breadcrumb: "Verifikasjonsgap",
    h1: "Verifikasjonsgapet er der AI-tillit ryker.",
    lead:
      "AI-systemer flytter inn i beslutninger, support, innkjop og offentlige tjenester. Nar noen spor hva som skjedde senere, svarer mange team fortsatt med skjermbilder, mutable logger eller leverandor-dashboard.",
    primary: "Apne validatoren",
    secondary: "Les SDK-stien",
    painTitle: "Hva som feiler uten kvittering",
    painLead:
      "Risikoen er ikke bare et darlig svar. Den dypere risikoen er at du ikke kan bevise kilde, prosess, policy, tidspunkt og tamper-status etter at svaret har forlatt systemet.",
    proofTitle: "Hva TSP legger til",
    proofLead:
      "TSP gjor et AI-output til en signert TrustEnvelope som kan sjekkes uavhengig, selv nar den opprinnelige appen eller leverandoren ikke er i rommet.",
    closeTitle: "Kjopersporsmalet er enkelt: kan dette svaret verifiseres senere?",
    closeLead:
      "Hvis svaret er nei, blir innkjop, audit og hendelsesgjennomgang vanskeligere. Hvis svaret er ja, flyttes tillit fra lovnader til bevis.",
  },
} as const;

const pains = {
  en: [
    ["Screenshots do not prove integrity", "They can show what someone saw, not whether the object was changed later."],
    ["Logs do not travel well", "Internal logs help operators, but buyers and auditors need a portable artifact."],
    ["Dashboards create vendor dependency", "A reviewer should be able to check the receipt without trusting a hosted UI."],
    ["Policy does not equal runtime evidence", "A policy says what should happen. A receipt proves what happened for one output."],
  ],
  no: [
    ["Skjermbilder beviser ikke integritet", "De kan vise hva noen sa de sa, ikke om objektet ble endret senere."],
    ["Logger reiser darlig", "Interne logger hjelper drift, men kjopere og auditorer trenger et flyttbart artefakt."],
    ["Dashboard skaper leverandoravhengighet", "En reviewer bor kunne sjekke kvitteringen uten a stole pa et hosted UI."],
    ["Policy er ikke runtime-bevis", "En policy sier hva som burde skje. En kvittering beviser hva som skjedde for ett output."],
  ],
} as const;

const proof = {
  en: [
    ["Sign", "Bind the output to content hash, source declaration, model/process metadata and timestamp."],
    ["Publish", "Expose the public manifest at /.well-known/tsp-manifest.json so others can verify the key path."],
    ["Verify", "Run local or online verification and prove whether the receipt still holds."],
  ],
  no: [
    ["Signer", "Bind output til content-hash, kildeerklaering, modell/prosess-metadata og tidspunkt."],
    ["Publiser", "Eksponer offentlig manifest pa /.well-known/tsp-manifest.json slik at andre kan verifisere nokkelstien."],
    ["Verifiser", "Kjor lokal eller online verifisering og bevis om kvitteringen fortsatt holder."],
  ],
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = locale === "en" ? COPY.en : COPY.no;
  return { title: copy.metaTitle, description: copy.metaDesc };
}

export default async function VerificationGapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const copy = isEn ? COPY.en : COPY.no;
  const painRows = isEn ? pains.en : pains.no;
  const proofRows = isEn ? proof.en : proof.no;

  return (
    <div className="bg-elevated">
      <section className="border-b border-border bg-[#07111f] text-white">
        <div className="tsp-container py-16 md:py-20">
          <div className="mb-6 font-mono text-sm text-white/55">
            <Link href="/" className="text-white/70 hover:text-white">
              TSP
            </Link>{" "}
            / {copy.breadcrumb}
          </div>
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-accent">
              <AlertTriangle className="h-4 w-4" />
              {isEn ? "Evidence gap" : "Bevisgap"}
            </div>
            <h1 className="max-w-4xl text-white">{copy.h1}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{copy.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/verify" className="tsp-btn-primary-lg bg-white text-[#07111f] hover:bg-accent hover:text-[#07111f]">
                {copy.primary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/docs" className="tsp-btn-secondary-lg border-white/30 text-white hover:bg-white/10">
                {copy.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-paper">
        <div className="tsp-container grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel icon={<FileSearch className="h-4 w-4" />} label={isEn ? "The risk" : "Risikoen"} />
            <h2 className="mt-4">{copy.painTitle}</h2>
            <p className="mt-4 text-muted">{copy.painLead}</p>
          </div>
          <div className="grid gap-3">
            {painRows.map(([title, body]) => (
              <div key={title} className="border border-border bg-elevated p-5">
                <h3 className="mb-2 text-lg">{title}</h3>
                <p className="text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-elevated">
        <div className="tsp-container py-14 md:py-16">
          <SectionLabel icon={<ReceiptText className="h-4 w-4" />} label={isEn ? "The receipt layer" : "Kvitteringslaget"} />
          <div className="mt-4 max-w-3xl">
            <h2>{copy.proofTitle}</h2>
            <p className="mt-4 text-muted">{copy.proofLead}</p>
          </div>
          <div className="mt-10 grid gap-px border border-border-strong bg-border-strong md:grid-cols-3">
            {proofRows.map(([title, body], index) => (
              <div key={title} className="bg-elevated p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center border border-brand/25 bg-brand/10 font-mono text-sm font-semibold text-brand">
                  0{index + 1}
                </div>
                <h3 className="mb-2">{title}</h3>
                <p className="text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111827] text-white">
        <div className="tsp-container grid gap-8 py-14 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-white/55">
              <LockKeyhole className="h-4 w-4 text-accent" />
              {isEn ? "Boardroom test" : "Styreromstest"}
            </div>
            <h2 className="max-w-3xl text-white">{copy.closeTitle}</h2>
            <p className="mt-4 max-w-2xl text-white/68">{copy.closeLead}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/verify" className="tsp-btn-primary-lg bg-accent text-white hover:bg-white hover:text-[#111827]">
              <ShieldCheck className="h-4 w-4" />
              {isEn ? "Prove it" : "Bevis det"}
            </Link>
            <Link href="/kontakt" className="tsp-btn-secondary-lg border-white/30 text-white hover:bg-white/10">
              <ClipboardCheck className="h-4 w-4" />
              {isEn ? "Plan a pilot" : "Planlegg pilot"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 border border-brand/20 bg-brand/6 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand">
      {icon}
      {label}
    </div>
  );
}
