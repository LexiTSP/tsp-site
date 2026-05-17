import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { HomeChapterNav } from "@/components/HomeChapterNav";
import { Link } from "@/i18n/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileCheck2,
  FileText,
  LockKeyhole,
  Play,
  ReceiptText,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users,
  XCircle,
} from "lucide-react";

type LocaleCopy = {
  hero: {
    h1: string;
    lead: string;
    primary: string;
    secondary: string;
    campaign: string;
    trustLine: string;
  };
  proof: {
    title: string;
    rows: Array<[string, string]>;
  };
  stakes: {
    label: string;
    title: string;
    lead: string;
    items: Array<{ title: string; body: string }>;
  };
  gives: {
    label: string;
    title: string;
    lead: string;
    items: Array<{ title: string; body: string; icon: ReactNode }>;
  };
  plan: {
    label: string;
    title: string;
    lead: string;
    steps: Array<{ time: string; title: string; body: string; href: string; cta: string }>;
  };
  paths: {
    label: string;
    title: string;
    cards: Array<{ audience: string; problem: string; action: string; href: string }>;
  };
  boundary: {
    label: string;
    title: string;
    lead: string;
    standardTitle: string;
    standardItems: string[];
    toolsTitle: string;
    toolsItems: string[];
  };
  close: {
    title: string;
    lead: string;
    primary: string;
    secondary: string;
  };
};

const COPY: Record<"en" | "no", LocaleCopy> = {
  en: {
    hero: {
      h1: "AI answers need receipts.",
      lead:
        "TSP gives every important AI output a signed receipt: what was said, which source and process made it, when it happened, and whether anyone changed it later.",
      primary: "Verify a receipt",
      secondary: "See the practical plan",
      campaign: "AI Act pressure is moving from policy to proof. Are your AI answers verifiable?",
      trustLine: "Open standard. MIT SDK. Optional paid pilot tools.",
    },
    proof: {
      title: "One receipt that survives procurement, audit and incident review.",
      rows: [
        ["Where did this answer come from?", "Declared source, model, policy and timestamp."],
        ["Can someone prove it changed?", "One character changed after signing breaks verification."],
        ["Do we need to trust a dashboard?", "No. The envelope can be checked independently."],
      ],
    },
    stakes: {
      label: "Why this matters",
      title: "Ignoring provenance turns every AI answer into a future dispute.",
      lead:
        "Most teams can show policy documents. Far fewer can prove what a live AI system actually returned to a customer, citizen or employee last month.",
      items: [
        {
          title: "You argue from screenshots",
          body:
            "Screenshots, exported logs and vendor dashboards are easy to question. A signed receipt gives reviewers an object they can inspect.",
        },
        {
          title: "Audit work becomes manual",
          body:
            "Without runtime evidence, teams rebuild the story after the fact: source, model, review status, timestamps and changes.",
        },
        {
          title: "Buyers ask harder questions",
          body:
            "If a customer asks for proof and the answer is 'trust our platform', procurement has a reason to slow down.",
        },
      ],
    },
    gives: {
      label: "What you get",
      title: "TSP is the receipt layer for AI work.",
      lead:
        "It does not claim to replace lawyers, auditors or governance. It creates the technical proof those people need to do their jobs faster.",
      items: [
        {
          icon: <ReceiptText className="h-5 w-5" />,
          title: "Signed TrustEnvelope",
          body: "Source, process, policy, timestamp, hashes and signatures travel with the output.",
        },
        {
          icon: <ShieldCheck className="h-5 w-5" />,
          title: "Independent verification",
          body: "Anyone with the public key can check whether the receipt still holds.",
        },
        {
          icon: <BadgeCheck className="h-5 w-5" />,
          title: "Human-readable badge",
          body: "TrustBadge lets non-technical users inspect the receipt instead of reading JSON.",
        },
        {
          icon: <FileCheck2 className="h-5 w-5" />,
          title: "Pilot evidence tools",
          body: "Risk, Evidence and Oversight are paid alpha tools for teams that want the operations layer handled.",
        },
      ],
    },
    plan: {
      label: "What to do first",
      title: "Start with one AI workflow. Not a giant transformation.",
      lead:
        "The useful first step is small enough for a developer to ship and concrete enough for compliance to inspect.",
      steps: [
        {
          time: "5 min",
          title: "Break the verifier",
          body: "Load a signed receipt, change one character, and see verification fail.",
          href: "/verify",
          cta: "Open validator",
        },
        {
          time: "30 min",
          title: "Wrap one output",
          body: "Use the SDK pattern around one AI response your product already creates.",
          href: "/docs",
          cta: "Read API docs",
        },
        {
          time: "Pilot",
          title: "Turn receipts into evidence",
          body: "If the workflow matters, add Risk, Oversight and Evidence as a focused paid pilot.",
          href: "/kontakt",
          cta: "Talk to us",
        },
      ],
    },
    paths: {
      label: "Choose your path",
      title: "Different teams need the same proof for different reasons.",
      cards: [
        {
          audience: "Compliance and legal",
          problem: "You need evidence that survives questions, not another policy PDF.",
          action: "Map TSP receipts to the EU AI Act evidence points.",
          href: "/eu-ai-act",
        },
        {
          audience: "Developers and security",
          problem: "You need a simple standard, not a black-box provenance vendor.",
          action: "Use the MIT SDK, CLI and verifier.",
          href: "/docs",
        },
        {
          audience: "Leaders and buyers",
          problem: "You need to reduce future audit and procurement friction.",
          action: "See the verification gap before buyers ask.",
          href: "/verification-gap",
        },
      ],
    },
    boundary: {
      label: "Honest product boundary",
      title: "Free standard first. Paid convenience when the workflow is real.",
      lead:
        "The current product reality is alpha, but useful: the standard and reference packages are the adoption surface; commercial tools are for focused pilots.",
      standardTitle: "Ready as the standard layer",
      standardItems: [
        "Public spec and schema",
        "MIT SDK and CLI",
        "TrustBadge React component",
        "Live validator and public manifest flow",
      ],
      toolsTitle: "Sold only as pilot tools today",
      toolsItems: [
        "Risk Monitor backend alpha",
        "Evidence dossier engine alpha",
        "Oversight review queue alpha",
        "Implementation support for one workflow",
      ],
    },
    close: {
      title: "The question is no longer 'why prove it?'",
      lead:
        "The better question is: what happens when a buyer, auditor or user asks for proof and your AI system has no receipt?",
      primary: "Verify a receipt",
      secondary: "Request a pilot",
    },
  },
  no: {
    hero: {
      h1: "AI-svar trenger kvittering.",
      lead:
        "TSP gir viktige AI-svar en signert kvittering: hva som ble sagt, hvilken kilde og prosess som laget det, når det skjedde, og om noen endret det etterpå.",
      primary: "Verifiser en kvittering",
      secondary: "Se den praktiske planen",
      campaign: "AI Act-presset flytter seg fra policy til bevis. Er AI-svarene dine verifiserbare?",
      trustLine: "Åpen standard. MIT SDK. Valgfrie betalte pilotverktøy.",
    },
    proof: {
      title: "Én kvittering som tåler innkjøp, audit og hendelsesgjennomgang.",
      rows: [
        ["Hvor kom svaret fra?", "Deklarert kilde, modell, policy og tidspunkt."],
        ["Kan vi bevise at noe ble endret?", "Ett tegn endret etter signering bryter verifisering."],
        ["Må vi stole på et dashboard?", "Nei. Kvitteringen kan sjekkes uavhengig."],
      ],
    },
    stakes: {
      label: "Hvorfor du trenger det",
      title: "Uten proveniens blir hvert AI-svar en fremtidig diskusjon.",
      lead:
        "De fleste kan vise policy-dokumenter. Færre kan bevise hva et levende AI-system faktisk svarte en kunde, innbygger eller ansatt forrige måned.",
      items: [
        {
          title: "Du ender med skjermbilder",
          body:
            "Skjermbilder, eksporterte logger og leverandør-dashboard er enkle å stille spørsmål ved. En signert kvittering er et objekt andre kan inspisere.",
        },
        {
          title: "Audit blir manuelt arbeid",
          body:
            "Uten runtime-bevis må team rekonstruere historien i etterkant: kilde, modell, review-status, tidspunkt og endringer.",
        },
        {
          title: "Kjøpere stiller hardere krav",
          body:
            "Hvis kunden ber om bevis og svaret er 'stol på plattformen vår', har innkjøp en grunn til å stoppe opp.",
        },
      ],
    },
    gives: {
      label: "Hva du får",
      title: "TSP er kvitteringslaget for AI-arbeid.",
      lead:
        "Det erstatter ikke jurister, revisorer eller governance. Det lager det tekniske beviset de trenger for å gjøre jobben raskere.",
      items: [
        {
          icon: <ReceiptText className="h-5 w-5" />,
          title: "Signert TrustEnvelope",
          body: "Kilde, prosess, policy, tid, hasher og signaturer følger svaret.",
        },
        {
          icon: <ShieldCheck className="h-5 w-5" />,
          title: "Uavhengig verifisering",
          body: "Alle med offentlig nøkkel kan sjekke om kvitteringen fortsatt holder.",
        },
        {
          icon: <BadgeCheck className="h-5 w-5" />,
          title: "Lesbar TrustBadge",
          body: "Ikke-tekniske brukere kan inspisere kvitteringen uten å lese JSON.",
        },
        {
          icon: <FileCheck2 className="h-5 w-5" />,
          title: "Pilotverktøy for bevis",
          body: "Risk, Evidence og Oversight er betalte alpha-verktøy for team som vil ha driftslaget håndtert.",
        },
      ],
    },
    plan: {
      label: "Hva du gjør først",
      title: "Start med én AI-flyt. Ikke en stor transformasjon.",
      lead:
        "Første nyttige steg er lite nok til at en utvikler kan shippe det, og konkret nok til at compliance kan inspisere det.",
      steps: [
        {
          time: "5 min",
          title: "Bryt verifieren",
          body: "Last en signert kvittering, endre ett tegn, og se verifisering feile.",
          href: "/verify",
          cta: "Åpne validator",
        },
        {
          time: "30 min",
          title: "Pakk inn ett output",
          body: "Bruk SDK-mønsteret rundt ett AI-svar produktet ditt allerede lager.",
          href: "/docs",
          cta: "Les API-docs",
        },
        {
          time: "Pilot",
          title: "Gjør kvitteringer til bevis",
          body: "Hvis flyten betyr noe, legg på Risk, Oversight og Evidence som en fokusert betalt pilot.",
          href: "/kontakt",
          cta: "Snakk med oss",
        },
      ],
    },
    paths: {
      label: "Velg inngang",
      title: "Ulike team trenger samme bevis av ulike grunner.",
      cards: [
        {
          audience: "Compliance og juridisk",
          problem: "Du trenger bevis som tåler spørsmål, ikke enda en policy-PDF.",
          action: "Map TSP-kvitteringer til EU AI Act-bevispunkter.",
          href: "/eu-ai-act",
        },
        {
          audience: "Utviklere og sikkerhet",
          problem: "Du trenger en enkel standard, ikke en svart boks for proveniens.",
          action: "Bruk MIT SDK, CLI og verifier.",
          href: "/docs",
        },
        {
          audience: "Ledere og innkjøp",
          problem: "Du vil redusere fremtidig audit- og innkjøpsfriksjon.",
          action: "Se verifikasjonsgapet før kjøpere spør.",
          href: "/verification-gap",
        },
      ],
    },
    boundary: {
      label: "Ærlig produktgrense",
      title: "Gratis standard først. Betalt convenience når flyten er reell.",
      lead:
        "Produktet er fortsatt alpha, men nyttig: standarden og referansepakkene er adopsjonsflaten; kommersielle verktøy er for fokuserte piloter.",
      standardTitle: "Klart som standardlag",
      standardItems: [
        "Offentlig spec og schema",
        "MIT SDK og CLI",
        "TrustBadge React-komponent",
        "Live validator og offentlig manifest-flyt",
      ],
      toolsTitle: "Selges kun som pilotverktøy nå",
      toolsItems: [
        "Risk Monitor backend alpha",
        "Evidence dossier engine alpha",
        "Oversight review queue alpha",
        "Implementeringshjelp for én flyt",
      ],
    },
    close: {
      title: "Spørsmålet er ikke lenger 'hvorfor bevise det?'",
      lead:
        "Det bedre spørsmålet er: hva skjer når en kjøper, auditor eller bruker ber om bevis og AI-systemet ditt ikke har kvittering?",
      primary: "Verifiser en kvittering",
      secondary: "Be om pilot",
    },
  },
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const localeKey = locale === "en" ? "en" : "no";
  const copy = COPY[localeKey];

  return (
    <div className="bg-elevated text-ink">
      <section className="relative isolate min-h-[78vh] overflow-hidden bg-[#07111f] text-white">
        <ProofScene />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-elevated to-transparent" />
        <div className="tsp-container relative z-10 flex min-h-[78vh] flex-col justify-center py-20 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white/75 backdrop-blur">
              <span className="h-2 w-2 bg-verify" />
              {copy.hero.trustLine}
            </div>
            <h1 className="mb-6 text-[clamp(3rem,8vw,7.25rem)] font-semibold leading-[0.92] tracking-[0em] text-white">
              {copy.hero.h1}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
              {copy.hero.lead}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/verify" className="tsp-btn-primary-lg bg-white text-[#07111f] hover:bg-accent hover:text-[#07111f]">
                <Play className="h-4 w-4" />
                {copy.hero.primary}
              </Link>
              <a href="#plan" className="tsp-btn-secondary-lg border-white/40 text-white hover:bg-white/10">
                {copy.hero.secondary}
              </a>
            </div>
            <Link
              href="/ai-act-august-2"
              className="mt-5 inline-flex text-sm font-semibold text-accent underline-offset-4 hover:text-white hover:underline"
            >
              {copy.hero.campaign} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <HomeChapterNav locale={localeKey} />

      <section id="proof" className="scroll-mt-28 border-b border-border bg-elevated">
        <div className="tsp-container grid gap-10 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionLabel icon={<LockKeyhole className="h-4 w-4" />} label="Proof" />
            <h2 className="mt-4 max-w-lg">{copy.proof.title}</h2>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {copy.proof.rows.map(([question, answer]) => (
              <ProofRow key={question} question={question} answer={answer} />
            ))}
          </div>
        </div>
      </section>

      <section id="stakes" className="scroll-mt-28 border-b border-border bg-paper">
        <div className="tsp-container py-16 md:py-20">
          <SectionLabel icon={<ShieldAlert className="h-4 w-4" />} label={copy.stakes.label} tone="warn" />
          <div className="mt-4 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <h2 className="max-w-xl">{copy.stakes.title}</h2>
              <p className="mt-5 max-w-xl text-muted">{copy.stakes.lead}</p>
            </div>
            <div className="grid gap-3">
              {copy.stakes.items.map((item) => (
                <ConsequenceItem key={item.title} title={item.title} body={item.body} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="gives" className="scroll-mt-28 border-b border-border bg-elevated">
        <div className="tsp-container py-16 md:py-20">
          <SectionLabel icon={<Sparkles className="h-4 w-4" />} label={copy.gives.label} tone="verify" />
          <div className="mt-4 max-w-2xl">
            <h2>{copy.gives.title}</h2>
            <p className="mt-4 text-muted">{copy.gives.lead}</p>
          </div>
          <div className="mt-10 grid gap-px border border-border-strong bg-border-strong md:grid-cols-2 lg:grid-cols-4">
            {copy.gives.items.map((item) => (
              <ValueTile key={item.title} icon={item.icon} title={item.title} body={item.body} />
            ))}
          </div>
        </div>
      </section>

      <section id="plan" className="scroll-mt-28 border-b border-border bg-[#f7fbf8]">
        <div className="tsp-container py-16 md:py-20">
          <SectionLabel icon={<TimerReset className="h-4 w-4" />} label={copy.plan.label} />
          <div className="mt-4 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2>{copy.plan.title}</h2>
              <p className="mt-4 text-muted">{copy.plan.lead}</p>
            </div>
            <div className="space-y-3">
              {copy.plan.steps.map((step, index) => (
                <ActionStep key={step.title} index={index + 1} {...step} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="paths" className="scroll-mt-28 border-b border-border bg-elevated">
        <div className="tsp-container py-16 md:py-20">
          <SectionLabel icon={<Users className="h-4 w-4" />} label={copy.paths.label} />
          <h2 className="mt-4 max-w-2xl">{copy.paths.title}</h2>
          <div className="mt-10 grid gap-px border border-border-strong bg-border-strong md:grid-cols-3">
            {copy.paths.cards.map((card) => (
              <AudiencePath key={card.audience} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-28 border-b border-border bg-[#111827] text-white">
        <div className="tsp-container py-16 md:py-20">
          <SectionLabel icon={<Scale className="h-4 w-4" />} label={copy.boundary.label} inverse />
          <div className="mt-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-white">{copy.boundary.title}</h2>
              <p className="mt-4 text-white/68">{copy.boundary.lead}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <BoundaryList title={copy.boundary.standardTitle} items={copy.boundary.standardItems} good />
              <BoundaryList title={copy.boundary.toolsTitle} items={copy.boundary.toolsItems} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-elevated">
        <div className="tsp-container py-16 md:py-20">
          <div className="grid gap-8 border-y border-border py-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="max-w-3xl">{copy.close.title}</h2>
              <p className="mt-4 max-w-2xl text-muted">{copy.close.lead}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/verify" className="tsp-btn-primary-lg">
                {copy.close.primary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/kontakt" className="tsp-btn-secondary-lg">
                {copy.close.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProofScene() {
  const receipts = [
    ["content", "AI output signed"],
    ["source", "declared"],
    ["model", "versioned"],
    ["hash", "a3f8...d91c"],
    ["signature", "valid"],
    ["tamper", "detected"],
  ];

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(4,120,87,0.34),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(181,137,90,0.28),transparent_24%),linear-gradient(135deg,#07111f_0%,#101827_52%,#1b2434_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute right-[-230px] top-24 hidden w-[600px] rotate-[-7deg] opacity-75 lg:block xl:right-[-120px]">
        <div className="border border-white/20 bg-white/10 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-white/45">TrustEnvelope</div>
            <div className="inline-flex items-center gap-2 text-verify">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-mono text-sm">verified</span>
            </div>
          </div>
          <div className="space-y-2">
            {receipts.map(([key, value], index) => (
              <div key={key} className="grid grid-cols-[110px_1fr] gap-4 border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm">
                <span className="text-white/38">{key}</span>
                <span className={index === receipts.length - 1 ? "text-accent" : "text-white/80"}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({
  icon,
  label,
  tone,
  inverse,
}: {
  icon: ReactNode;
  label: string;
  tone?: "verify" | "warn";
  inverse?: boolean;
}) {
  const color = inverse
    ? "border-white/20 bg-white/10 text-white/75"
    : tone === "verify"
      ? "border-verify/25 bg-verify/6 text-verify"
      : tone === "warn"
        ? "border-warn/25 bg-warn/6 text-warn"
        : "border-brand/20 bg-brand/6 text-brand";

  return (
    <div className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] ${color}`}>
      {icon}
      {label}
    </div>
  );
}

function ProofRow({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="grid gap-3 py-5 md:grid-cols-[0.8fr_1.2fr]">
      <div className="font-semibold text-ink">{question}</div>
      <div className="text-muted">{answer}</div>
    </div>
  );
}

function ConsequenceItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="grid gap-4 border border-border bg-elevated p-5 sm:grid-cols-[auto_1fr]">
      <div className="flex h-10 w-10 items-center justify-center border border-warn/30 bg-warn/10 text-warn">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <h3 className="mb-2 text-lg">{title}</h3>
        <p className="text-sm text-muted">{body}</p>
      </div>
    </div>
  );
}

function ValueTile({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="bg-elevated p-6">
      <div className="mb-5 flex h-11 w-11 items-center justify-center border border-brand/20 bg-brand/6 text-brand">
        {icon}
      </div>
      <h3 className="mb-2 text-lg">{title}</h3>
      <p className="text-sm text-muted">{body}</p>
    </div>
  );
}

function ActionStep({
  index,
  time,
  title,
  body,
  href,
  cta,
}: {
  index: number;
  time: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="grid gap-4 border border-border bg-elevated p-5 sm:grid-cols-[72px_1fr_auto] sm:items-center">
      <div>
        <div className="font-mono text-3xl font-semibold leading-none text-brand">0{index}</div>
        <div className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-muted">{time}</div>
      </div>
      <div>
        <h3 className="mb-1 text-lg">{title}</h3>
        <p className="text-sm text-muted">{body}</p>
      </div>
      <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-brand no-underline hover:underline">
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function AudiencePath({
  audience,
  problem,
  action,
  href,
}: {
  audience: string;
  problem: string;
  action: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block bg-elevated p-6 no-underline hover:bg-paper">
      <div className="mb-5 flex h-10 w-10 items-center justify-center border border-border bg-paper text-brand">
        {audience.includes("Developer") || audience.includes("Utviklere") ? (
          <Code2 className="h-5 w-5" />
        ) : audience.includes("Compliance") ? (
          <ClipboardCheck className="h-5 w-5" />
        ) : (
          <BookOpenCheck className="h-5 w-5" />
        )}
      </div>
      <h3 className="mb-3 text-lg">{audience}</h3>
      <p className="mb-4 text-sm text-muted">{problem}</p>
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-brand group-hover:underline">
        {action} <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

function BoundaryList({ title, items, good }: { title: string; items: string[]; good?: boolean }) {
  return (
    <div className="border border-white/14 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center gap-2 font-semibold text-white">
        {good ? <CheckCircle2 className="h-5 w-5 text-verify" /> : <FileText className="h-5 w-5 text-accent" />}
        {title}
      </div>
      <ul className="space-y-3 text-sm text-white/68">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            {good ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-verify" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
