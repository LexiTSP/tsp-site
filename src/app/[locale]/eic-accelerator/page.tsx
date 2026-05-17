import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BadgeEuro,
  Building2,
  CheckCircle2,
  FileCheck2,
  Landmark,
  Network,
  ShieldCheck,
} from "lucide-react";

const COPY = {
  en: {
    metaTitle: "EIC Accelerator narrative - TSP",
    metaDesc:
      "TSP as European AI trust infrastructure: an open receipt layer plus commercial pilot tooling.",
    h1: "Europe needs AI systems that can prove what they said.",
    lead:
      "TSP is positioned as an open standard candidate and reference implementation for verifiable AI output receipts, with commercial pilot tools for teams that need operational evidence now.",
    primary: "Discuss pilot evidence",
    secondary: "Read the protocol docs",
    thesis: "The EIC narrative",
    thesisLead:
      "The opportunity is not another governance dashboard. It is a protocol-level evidence layer that lets deployers, buyers and auditors check AI outputs without depending on one vendor UI.",
    boundary: "Current boundary",
    boundaryLead:
      "Public alpha means useful, runnable and externally inspectable - not institutionally adopted. The right claim is readiness for external validation, not completed standardization.",
    closeTitle: "The fundable wedge is simple.",
    closeLead:
      "Ship the open receipt layer, prove external interoperability, and sell the operational tooling around evidence, risk and oversight where teams need help.",
  },
  no: {
    metaTitle: "EIC Accelerator-narrativ - TSP",
    metaDesc:
      "TSP som europeisk AI-tillitsinfrastruktur: et apent kvitteringslag pluss kommersielle pilotverktoy.",
    h1: "Europa trenger AI-systemer som kan bevise hva de sa.",
    lead:
      "TSP posisjoneres som en apen standardkandidat og referanseimplementasjon for verifiserbare AI-output-kvitteringer, med kommersielle pilotverktoy for team som trenger operasjonelle bevis na.",
    primary: "Diskuter pilotbevis",
    secondary: "Les protokoll-docs",
    thesis: "EIC-narrativet",
    thesisLead:
      "Muligheten er ikke enda et governance-dashboard. Det er et protokollniva for evidens som lar deployere, kjopere og auditorer sjekke AI-output uten a stole pa ett vendor-UI.",
    boundary: "Navaerende grense",
    boundaryLead:
      "Public alpha betyr nyttig, kjortbart og eksternt inspiserbart - ikke institusjonelt adoptert. Riktig claim er klar for ekstern validering, ikke ferdig standardisering.",
    closeTitle: "Den finansierbare kilen er enkel.",
    closeLead:
      "Ship det apne kvitteringslaget, bevis ekstern interoperabilitet, og selg driftsverktoyene rundt evidence, risk og oversight der team trenger hjelp.",
  },
} as const;

const pillars = {
  en: [
    ["Open layer", "MIT SDK, public schema, TrustEnvelope, TrustBadge and public manifest verification."],
    ["European timing", "AI Act pressure raises the cost of unverifiable AI outputs and weak audit trails."],
    ["Commercial path", "Risk, Evidence and Oversight remain paid pilot tools around the open standard."],
  ],
  no: [
    ["Apent lag", "MIT SDK, offentlig schema, TrustEnvelope, TrustBadge og offentlig manifest-verifisering."],
    ["Europeisk timing", "AI Act-press oker kostnaden ved unverifiserbare AI-output og svake audit trails."],
    ["Kommersiell sti", "Risk, Evidence og Oversight forblir betalte pilotverktoy rundt den apne standarden."],
  ],
} as const;

const validation = {
  en: [
    "Gate A: another organization hosts its own keys and manifest.",
    "Independent review from cryptography, assurance or public-sector trust practitioners.",
    "One-hour implementer path with test vectors and conformance checks.",
    "Hosted verifier proof loop: valid receipt, tamper failure, valid reload.",
  ],
  no: [
    "Gate A: en annen organisasjon hoster egne nokler og eget manifest.",
    "Uavhengig review fra kryptografi-, assurance- eller offentlig tillitsmiljo.",
    "En-times implementeringssti med testvektorer og conformance-sjekker.",
    "Hosted verifier-proof-loop: valid kvittering, tamper-feil, valid reload.",
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

export default async function EicAcceleratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale === "en";
  const copy = isEn ? COPY.en : COPY.no;
  const pillarRows = isEn ? pillars.en : pillars.no;
  const validationRows = isEn ? validation.en : validation.no;

  return (
    <div className="bg-elevated">
      <section className="border-b border-border bg-[#07111f] text-white">
        <div className="tsp-container grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="mb-6 font-mono text-sm text-white/55">
              <Link href="/" className="text-white/70 hover:text-white">
                TSP
              </Link>{" "}
              / EIC Accelerator
            </div>
            <div className="mb-5 inline-flex items-center gap-2 border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-accent">
              <BadgeEuro className="h-4 w-4" />
              {isEn ? "European AI trust infrastructure" : "Europeisk AI-tillitsinfrastruktur"}
            </div>
            <h1 className="max-w-4xl text-white">{copy.h1}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{copy.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kontakt" className="tsp-btn-primary-lg bg-white text-[#07111f] hover:bg-accent hover:text-[#07111f]">
                {copy.primary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/docs" className="tsp-btn-secondary-lg border-white/30 text-white hover:bg-white/10">
                {copy.secondary}
              </Link>
            </div>
          </div>
          <div className="border-l-2 border-accent bg-white/10 p-5 text-sm leading-relaxed text-white/70">
            <div className="mb-3 flex items-center gap-2 font-semibold text-white">
              <Landmark className="h-4 w-4 text-accent" />
              {isEn ? "Claim discipline" : "Claim-disiplin"}
            </div>
            {isEn
              ? "Use this as an investor and grant narrative, not as proof that TSP is already adopted by EU institutions."
              : "Bruk dette som investor- og tilskuddsnarrativ, ikke som bevis pa at TSP allerede er adoptert av EU-institusjoner."}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-paper">
        <div className="tsp-container py-14 md:py-16">
          <SectionLabel icon={<Network className="h-4 w-4" />} label={copy.thesis} />
          <div className="mt-4 max-w-3xl">
            <h2>{copy.thesis}</h2>
            <p className="mt-4 text-muted">{copy.thesisLead}</p>
          </div>
          <div className="mt-10 grid gap-px border border-border-strong bg-border-strong md:grid-cols-3">
            {pillarRows.map(([title, body]) => (
              <div key={title} className="bg-elevated p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center border border-brand/25 bg-brand/10 text-brand">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="mb-2">{title}</h3>
                <p className="text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-elevated">
        <div className="tsp-container grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel icon={<FileCheck2 className="h-4 w-4" />} label={copy.boundary} />
            <h2 className="mt-4">{copy.boundary}</h2>
            <p className="mt-4 text-muted">{copy.boundaryLead}</p>
          </div>
          <div className="grid gap-3">
            {validationRows.map((item) => (
              <div key={item} className="flex gap-3 border border-border bg-paper p-4 text-sm text-ink">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-verify" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111827] text-white">
        <div className="tsp-container grid gap-8 py-14 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-white/55">
              <ShieldCheck className="h-4 w-4 text-accent" />
              {isEn ? "Open standard plus tools" : "Apen standard pluss verktoy"}
            </div>
            <h2 className="max-w-3xl text-white">{copy.closeTitle}</h2>
            <p className="mt-4 max-w-2xl text-white/68">{copy.closeLead}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/verify" className="tsp-btn-primary-lg bg-accent text-white hover:bg-white hover:text-[#111827]">
              {isEn ? "Show proof" : "Vis bevis"}
            </Link>
            <Link href="/kontakt" className="tsp-btn-secondary-lg border-white/30 text-white hover:bg-white/10">
              {isEn ? "Book discussion" : "Book samtale"}
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
