"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  ShieldCheck,
  Menu,
  X,
  FileCheck,
  Scale,
  Eye,
  Archive,
  BookOpen,
  ClipboardCheck,
  FileText,
  Play,
  Package,
  ReceiptText,
  SearchCheck,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MenuDropdown } from "./MenuDropdown";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function TspHeader() {
  const pathname = usePathname();
  const t = useTranslations("header");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const isNo = locale === "no";
  const copy = isNo ? NAV_COPY.no : NAV_COPY.en;

  const WHY_GROUP = {
    intro: copy.whyIntro,
    groups: [
      {
        heading: copy.whyHeading,
        links: [
          { href: "/", label: copy.whyNeed.label, question: copy.whyNeed.question, desc: copy.whyNeed.desc, action: copy.whyNeed.action, icon: ReceiptText },
          { href: "/sammenligning", label: copy.whyUseful.label, question: copy.whyUseful.question, desc: copy.whyUseful.desc, action: copy.whyUseful.action, icon: SearchCheck },
          { href: "/eu-ai-act", label: copy.whyRisk.label, question: copy.whyRisk.question, desc: copy.whyRisk.desc, action: copy.whyRisk.action, icon: AlertTriangle },
        ],
      },
    ],
  };

  const USE_GROUP = {
    intro: copy.useIntro,
    groups: [
      {
        heading: copy.useHeading,
        links: [
          { href: "/core", label: "Core", question: copy.core.question, desc: copy.core.desc, action: copy.core.action, icon: Package, badge: "MIT" },
          { href: "/risk", label: "Risk", question: copy.risk.question, desc: copy.risk.desc, action: copy.risk.action, icon: Scale, badge: "Pilot" },
          { href: "/evidence", label: "Evidence", question: copy.evidence.question, desc: copy.evidence.desc, action: copy.evidence.action, icon: Archive, badge: "Pilot" },
          { href: "/oversight", label: "Oversight", question: copy.oversight.question, desc: copy.oversight.desc, action: copy.oversight.action, icon: Eye, badge: "Pilot" },
        ],
      },
    ],
  };

  const BUILD_GROUP = {
    intro: copy.buildIntro,
    groups: [
      {
        heading: copy.buildHeading,
        links: [
          { href: "/playground", label: copy.demo.label, question: copy.demo.question, desc: copy.demo.desc, action: copy.demo.action, icon: Play },
          { href: "/verify", label: copy.validator.label, question: copy.validator.question, desc: copy.validator.desc, action: copy.validator.action, icon: ShieldCheck },
          { href: "/docs", label: copy.docs.label, question: copy.docs.question, desc: copy.docs.desc, action: copy.docs.action, icon: BookOpen },
          { href: "/spec", label: copy.spec.label, question: copy.spec.question, desc: copy.spec.desc, action: copy.spec.action, icon: FileText },
          { href: "/iso-42001", label: "ISO 42001", question: copy.iso.question, desc: copy.iso.desc, action: copy.iso.action, icon: ClipboardCheck },
          { href: "/eu-ai-act", label: "EU AI Act", question: copy.aiAct.question, desc: copy.aiAct.desc, action: copy.aiAct.action, icon: FileCheck },
        ],
      },
    ],
  };

  const isWhy = pathname === "/" || pathname.startsWith("/sammenligning");
  const isUse = pathname.startsWith("/core") || pathname.startsWith("/risk") || pathname.startsWith("/oversight") || pathname.startsWith("/evidence");
  const isBuild = pathname.startsWith("/spec") || pathname.startsWith("/docs") || pathname.startsWith("/playground") || pathname.startsWith("/verify") || pathname.startsWith("/eu-ai-act") || pathname.startsWith("/iso-42001");

  return (
    <header className="border-b border-border bg-paper/85 backdrop-blur-md sticky top-0 z-40">
      <div className="tsp-container flex items-center justify-between h-14">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 no-underline"
        >
          <span
            className="tsp-live-dot"
            aria-label="Spec live (alpha)"
            role="img"
          />
          <span className="font-medium text-ink tracking-tight text-[1.05rem]">TSP</span>
          <span className="font-mono text-xs text-muted">verifiable AI · MIT</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          <MenuDropdown trigger={copy.whyTrigger} active={isWhy} intro={WHY_GROUP.intro} groups={WHY_GROUP.groups} />
          <MenuDropdown trigger={copy.useTrigger} active={isUse} intro={USE_GROUP.intro} groups={USE_GROUP.groups} />
          <MenuDropdown trigger={copy.buildTrigger} active={isBuild} intro={BUILD_GROUP.intro} groups={BUILD_GROUP.groups} />
        </nav>

        <div className="hidden lg:flex items-center gap-1 text-sm">
          <Link
            href="/priser"
            className="px-3 py-1.5 text-muted hover:text-ink no-underline"
          >
            {t("pricing")}
          </Link>
          <Link
            href="/kontakt"
            className="px-3 py-1.5 text-muted hover:text-ink no-underline"
          >
            {t("contact")}
          </Link>
          <span className="ml-3 mr-2">
            <LocaleSwitcher />
          </span>
          <Link
            href="/playground"
            className="ml-1 tsp-btn-primary text-sm"
            style={{ paddingTop: "6px", paddingBottom: "6px" }}
          >
            Demo
          </Link>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label={t("menu")}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-paper max-h-[80vh] overflow-y-auto">
          <nav className="tsp-container py-4 flex flex-col gap-4">
            <MobileGroup title={copy.whyTrigger} links={WHY_GROUP.groups[0].links} onClick={() => setOpen(false)} pathname={pathname} />
            <MobileGroup title={copy.useTrigger} links={USE_GROUP.groups[0].links} onClick={() => setOpen(false)} pathname={pathname} />
            <MobileGroup title={copy.buildTrigger} links={BUILD_GROUP.groups[0].links} onClick={() => setOpen(false)} pathname={pathname} />
            <div className="flex items-center justify-between border-t border-border pt-3">
              <LocaleSwitcher />
              <Link
                href="/playground"
                className="tsp-btn-primary"
                onClick={() => setOpen(false)}
              >
                Demo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileGroup({
  title,
  links,
  pathname,
  onClick,
}: {
  title: string;
  links: Array<{ href: string; label: string; question?: string; desc?: string; action?: string }>;
  pathname: string;
  onClick: () => void;
}) {
  return (
    <div>
      <div className="tsp-eyebrow text-muted mb-1.5 px-1">{title}</div>
      <div className="flex flex-col gap-0.5">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClick}
            className={cn(
              "px-3 py-2 text-sm no-underline border-l-2",
              pathname === l.href
                ? "border-ink text-ink font-medium"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            <span className="block font-medium">{l.label}</span>
            {l.question && <span className="mt-0.5 block text-xs leading-relaxed text-ink">{l.question}</span>}
            {l.desc && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{l.desc}</span>}
            {l.action && <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-[0.12em] text-brand">{l.action}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

const NAV_COPY = {
  en: {
    whyTrigger: "Why TSP?",
    useTrigger: "Use cases",
    buildTrigger: "Try / build",
    whyIntro: {
      title: "Start with the business question.",
      body: "TSP is useful when an AI answer may need to be inspected later by a buyer, user, auditor or regulator.",
    },
    whyHeading: "Questions buyers ask",
    whyNeed: {
      label: "Why do I need this?",
      question: "What if someone asks where an AI answer came from?",
      desc: "TSP gives the answer a signed receipt instead of a screenshot or dashboard claim.",
      action: "See the homepage argument",
    },
    whyUseful: {
      label: "Is it useful?",
      question: "When is TSP better than normal logs?",
      desc: "Use it when proof must travel outside your system: procurement, audit, support disputes, incident review.",
      action: "Compare alternatives",
    },
    whyRisk: {
      label: "What if we ignore it?",
      question: "What breaks when provenance is missing?",
      desc: "Teams end up reconstructing source, model, timestamp and review status after the fact.",
      action: "See AI Act mapping",
    },
    useIntro: {
      title: "Pick the job you need done.",
      body: "The standard is free. The operational tools are paid alpha modules for focused pilots.",
    },
    useHeading: "What it does",
    core: {
      question: "Do we need signed AI receipts?",
      desc: "Wrap outputs as TrustEnvelopes with source, process, timestamp, hash and signature.",
      action: "Free MIT standard",
    },
    risk: {
      question: "Do we need to watch outputs over time?",
      desc: "Ingest envelope streams and generate signed alerts when aggregate risk signals drift.",
      action: "Paid pilot backend",
    },
    evidence: {
      question: "Do we need audit evidence?",
      desc: "Turn verified runtime artifacts into signed Annex IV and ISO 42001-oriented evidence packs.",
      action: "Paid pilot engine",
    },
    oversight: {
      question: "Do humans need to approve risky outputs?",
      desc: "Queue review items and produce signed ReviewEnvelopes for decisions.",
      action: "Paid pilot queue",
    },
    buildIntro: {
      title: "Try the proof before reading the spec.",
      body: "The quickest way to understand TSP is to sign an answer, change it, and watch verification fail.",
    },
    buildHeading: "Hands-on paths",
    demo: {
      label: "Tamper demo",
      question: "Does it do anything special?",
      desc: "Yes: one changed character flips a signed receipt from valid to broken.",
      action: "Try in browser",
    },
    validator: {
      label: "Validator",
      question: "Can someone else check the receipt?",
      desc: "Paste or load a TrustEnvelope and verify the signature, hash and manifest path.",
      action: "Verify a receipt",
    },
    docs: {
      label: "API docs",
      question: "How hard is integration?",
      desc: "Start with the SDK flow around one output before planning a bigger rollout.",
      action: "Build one workflow",
    },
    spec: {
      label: "Spec v3.0",
      question: "Is this open or vendor-only?",
      desc: "The protocol is public, structured and independently implementable.",
      action: "Read the standard",
    },
    iso: {
      question: "Can this support ISO 42001 work?",
      desc: "Use TSP as technical evidence input, not as a full certification shortcut.",
      action: "See mapping",
    },
    aiAct: {
      question: "Can this support EU AI Act work?",
      desc: "Map receipts to record-keeping, transparency, oversight and evidence duties.",
      action: "See article map",
    },
  },
  no: {
    whyTrigger: "Hvorfor TSP?",
    useTrigger: "Brukstilfeller",
    buildTrigger: "Prøv / bygg",
    whyIntro: {
      title: "Start med forretningsspørsmålet.",
      body: "TSP er nyttig når et AI-svar kan måtte inspiseres senere av kjøper, bruker, auditor eller regulator.",
    },
    whyHeading: "Spørsmål kjøpere stiller",
    whyNeed: {
      label: "Hvorfor trenger jeg dette?",
      question: "Hva om noen spør hvor et AI-svar kom fra?",
      desc: "TSP gir svaret en signert kvittering i stedet for et skjermbilde eller dashboard-påstand.",
      action: "Se hovedargumentet",
    },
    whyUseful: {
      label: "Er det nyttig?",
      question: "Når er TSP bedre enn vanlige logger?",
      desc: "Bruk det når bevis må leve utenfor systemet ditt: innkjøp, audit, klager og hendelser.",
      action: "Sammenlign alternativer",
    },
    whyRisk: {
      label: "Hva hvis vi ignorerer det?",
      question: "Hva ryker når proveniens mangler?",
      desc: "Team må rekonstruere kilde, modell, tidspunkt og review-status i etterkant.",
      action: "Se AI Act-mapping",
    },
    useIntro: {
      title: "Velg jobben du trenger gjort.",
      body: "Standarden er gratis. Driftsverktøyene er betalte alpha-moduler for fokuserte piloter.",
    },
    useHeading: "Hva det gjør",
    core: {
      question: "Trenger vi signerte AI-kvitteringer?",
      desc: "Pakk output som TrustEnvelopes med kilde, prosess, tid, hash og signatur.",
      action: "Gratis MIT-standard",
    },
    risk: {
      question: "Trenger vi å følge med over tid?",
      desc: "Ingest envelope-strømmer og lag signerte varsler når aggregerte risikosignaler driver.",
      action: "Betalt pilot-backend",
    },
    evidence: {
      question: "Trenger vi audit-bevis?",
      desc: "Gjør verifiserte runtime-artefakter til signerte Annex IV- og ISO 42001-orienterte bevispakker.",
      action: "Betalt pilotmotor",
    },
    oversight: {
      question: "Må mennesker godkjenne risikable output?",
      desc: "Legg review-saker i kø og produser signerte ReviewEnvelopes for beslutninger.",
      action: "Betalt pilotkø",
    },
    buildIntro: {
      title: "Prøv beviset før du leser specen.",
      body: "Den raskeste måten å forstå TSP på er å signere et svar, endre det, og se verifisering feile.",
    },
    buildHeading: "Praktiske innganger",
    demo: {
      label: "Tamper-demo",
      question: "Gjør det noe spesielt?",
      desc: "Ja: ett endret tegn gjør en signert kvittering fra valid til broken.",
      action: "Prøv i browser",
    },
    validator: {
      label: "Validator",
      question: "Kan andre sjekke kvitteringen?",
      desc: "Lim inn eller last en TrustEnvelope og verifiser signatur, hash og manifest-path.",
      action: "Verifiser kvittering",
    },
    docs: {
      label: "API-docs",
      question: "Hvor vanskelig er integrasjonen?",
      desc: "Start med SDK-flyten rundt ett output før du planlegger større utrulling.",
      action: "Bygg én workflow",
    },
    spec: {
      label: "Spec v3.0",
      question: "Er dette åpent eller vendor-only?",
      desc: "Protokollen er offentlig, strukturert og mulig å implementere uavhengig.",
      action: "Les standarden",
    },
    iso: {
      question: "Kan dette støtte ISO 42001-arbeid?",
      desc: "Bruk TSP som teknisk evidence-input, ikke som snarvei til sertifisering.",
      action: "Se mapping",
    },
    aiAct: {
      question: "Kan dette støtte EU AI Act-arbeid?",
      desc: "Map kvitteringer til logging, transparens, oversight og evidence-plikter.",
      action: "Se artikkelmap",
    },
  },
};
