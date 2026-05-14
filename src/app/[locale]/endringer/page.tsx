import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Sparkles,
  AlertCircle,
  ArrowRight,
  Calendar,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "endringer" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

type Tag = "feature" | "fix" | "security" | "breaking" | "docs";

interface Entry {
  date: string;
  version: string;
  title: string;
  body: string;
  changes: Array<{ tag: Tag; text: string }>;
}

const TAG_STYLES: Record<Tag, { label: string; classes: string }> = {
  feature: {
    label: "Ny",
    classes: "bg-brand/10 text-brand border-brand/20",
  },
  fix: {
    label: "Fix",
    classes: "bg-amber-100 text-amber-800 border-amber-200",
  },
  security: {
    label: "Sikkerhet",
    classes: "bg-red-100 text-red-700 border-red-200",
  },
  breaking: {
    label: "Brytende",
    classes: "bg-purple-100 text-purple-800 border-purple-200",
  },
  docs: {
    label: "Docs",
    classes: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

const ENTRIES_NO: Entry[] = [
  {
    date: "2026-04-30",
    version: "v3.0.0-alpha",
    title: "TSP Spec v3.0 — Ed25519, RFC 3161, manifest-PKI, DANE",
    body: "Hard break fra v2: full kryptografisk proveniens-stakk. SDK shipped, TrustBadge React shipped, plus three commercial platform backends (Risk + Evidence + Oversight). Sub-prosjekt I + II + III komplett.",
    changes: [
      { tag: "breaking", text: "v2-konvolutter er IKKE kompatible med v3 — egen migration path TBD før stable" },
      { tag: "feature", text: "Ed25519 instans-signaturer over RFC 8785-kanonikalisert envelope" },
      { tag: "feature", text: "RFC 3161 TSA-stempel med sequential multi-TSA fallback" },
      { tag: "feature", text: "Manifest-basert PKI (org-rot + instans-cert), well-known URL + valgfri DNS DANE" },
      { tag: "feature", text: "@lexitsp/sdk@3.0.0-alpha.6 (101 tester, TS strict)" },
      { tag: "feature", text: "@lexitsp/trustbadge-react@0.2.2 — visuell kvittering for sluttbruker" },
      { tag: "feature", text: "Risk-modul: signal-aggregering med signerte alarm-envelopes (Merkle-bundet)" },
      { tag: "feature", text: "Evidence-modul: signerte Annex IV + ISO 42001 §9.1-rapporter" },
      { tag: "feature", text: "Oversight-modul: human-in-the-loop med signed ReviewEnvelopes (client-side signing)" },
      { tag: "security", text: "Schema-unions for systemPrompt og alignment.refusal — eksplisitt redaksjon, ikke silent optionality" },
      { tag: "security", text: "Sequence-state for rollback-deteksjon i verifyOnline" },
    ],
  },
  {
    date: "2026-04-28",
    version: "v2.1.0",
    title: "Whitepaper, /kontakt og audience-strip",
    body: "Konkrete konverterings-veier for offentlig sektor og utviklere. Vi begynte å bygge ut markedssiden seriøst — fortsatt åpen og ærlig, men med faktiske handlings­knapper.",
    changes: [
      { tag: "feature", text: "Whitepaper v0.1 (PDF) — runtime-compliance for EU AI Act, ~28 sider" },
      { tag: "feature", text: "/kontakt-side med audience-spesifikke pre-utfylte mailto-er" },
      { tag: "feature", text: "/priser med tre tier-kort + ærlig pilot-prising-disclaimer" },
      { tag: "feature", text: "Audience-strip på hjemme­siden (compliance / utvikler / innkjøper)" },
      { tag: "feature", text: "\"Sett enkelt\"-pattern på /eu-ai-act for ikke-jurister" },
      { tag: "fix", text: "16 hardkodede localhost:3737-lenker erstattet med env-driven URL" },
      { tag: "fix", text: "Ærlig install-instruks i /docs (ikke npm-install-løgn)" },
      { tag: "docs", text: "Sett-enkelt 3-kort-intro på TSP-forsiden" },
    ],
  },
  {
    date: "2026-04-22",
    version: "v2.0.5",
    title: "Lovdata real-time + improved chat UX",
    body: "Hevet kvalitets­signalet på TSP-konvolutter: lovreferanser kan nå hentes ferskt fra lovdata.no inline i TrustModal.",
    changes: [
      { tag: "feature", text: "Lovdata real-time-fetcher med 24t cache" },
      { tag: "feature", text: "LovdataPreview-komponent inline i TrustModal" },
      { tag: "fix", text: "Zod schema-fix: nullable felter i deadline + lawRef" },
      { tag: "fix", text: "Chat maxTokens 1200 → 2500 (Gemma 4 thinking-buffer)" },
    ],
  },
  {
    date: "2026-04-15",
    version: "v2.0.0",
    title: "TSP Spec v2.0 — stable",
    body: "Første stabile spec-utgivelse. JSON-LD-format frosset, signaturkjede konsolidert, alle moduler bygd mot samme protokoll.",
    changes: [
      { tag: "breaking", text: "Spec v1.x-konvolutter er ikke kompatible — kjør migrate-script" },
      { tag: "feature", text: "JSON-LD context fastsatt: truststandardprotocol.com/spec/v2.0" },
      { tag: "feature", text: "Risk Dashboard som første betalte modul" },
      { tag: "security", text: "SHA-256 erstatter SHA-1 i ledger-kjede" },
    ],
  },
  {
    date: "2026-03-10",
    version: "v1.9.0",
    title: "Første produksjons-deploy",
    body: "Første regulerte system signert kontinuerlig med TSP. Målet er stabil kjedeintegritet og målbare envelope-volumer i drift.",
    changes: [
      { tag: "feature", text: "Kunde-deployment skiftet til TSP-signert AI på relevante output-flater" },
      { tag: "feature", text: "Live ledger publisert på /ledger" },
      { tag: "fix", text: "Performance: envelope-write under 5ms i p95" },
    ],
  },
];

const ENTRIES_EN: Entry[] = [
  {
    date: "2026-04-30",
    version: "v3.0.0-alpha",
    title: "TSP Spec v3.0 — Ed25519, RFC 3161, manifest-PKI, DANE",
    body: "Hard break from v2: full cryptographic provenance stack. SDK shipped, TrustBadge React shipped, plus three commercial platform backends (Risk + Evidence + Oversight). Sub-projects I + II + III complete.",
    changes: [
      { tag: "breaking", text: "v2 envelopes are NOT compatible with v3 — dedicated migration path TBD before stable" },
      { tag: "feature", text: "Ed25519 instance signatures over RFC 8785-canonicalised envelope" },
      { tag: "feature", text: "RFC 3161 TSA timestamp with sequential multi-TSA fallback" },
      { tag: "feature", text: "Manifest-based PKI (org root + instance cert), well-known URL + optional DNS DANE" },
      { tag: "feature", text: "@lexitsp/sdk@3.0.0-alpha.6 (101 tests, TS strict)" },
      { tag: "feature", text: "@lexitsp/trustbadge-react@0.2.2 — visual receipt for end users" },
      { tag: "feature", text: "Risk module: signal aggregation with signed alarm envelopes (Merkle-bound)" },
      { tag: "feature", text: "Evidence module: signed Annex IV + ISO 42001 §9.1 reports" },
      { tag: "feature", text: "Oversight module: human-in-the-loop with signed ReviewEnvelopes (client-side signing)" },
      { tag: "security", text: "Schema unions for systemPrompt and alignment.refusal — explicit redaction, not silent optionality" },
      { tag: "security", text: "Sequence-state for rollback detection in verifyOnline" },
    ],
  },
  {
    date: "2026-04-28",
    version: "v2.1.0",
    title: "Whitepaper, /kontakt and audience strip",
    body: "Concrete conversion paths for public sector and developers. We started building out the marketing site seriously — still open and honest, but with actual action buttons.",
    changes: [
      { tag: "feature", text: "Whitepaper v0.1 (PDF) — runtime compliance for EU AI Act, ~28 pages" },
      { tag: "feature", text: "/kontakt page with audience-specific pre-filled mailtos" },
      { tag: "feature", text: "/priser with three tier cards + honest pilot pricing disclaimer" },
      { tag: "feature", text: "Audience strip on the home page (compliance / developer / buyer)" },
      { tag: "feature", text: "\"Plain English\" pattern on /eu-ai-act for non-lawyers" },
      { tag: "fix", text: "16 hardcoded localhost:3737 links replaced with env-driven URL" },
      { tag: "fix", text: "Honest install instructions in /docs (no npm-install fiction)" },
      { tag: "docs", text: "Plain-English 3-card intro on the TSP front page" },
    ],
  },
  {
    date: "2026-04-22",
    version: "v2.0.5",
    title: "Lovdata real-time + improved chat UX",
    body: "Raised the quality signal on TSP envelopes: legal references can now be fetched fresh from lovdata.no inline in TrustModal.",
    changes: [
      { tag: "feature", text: "Lovdata real-time fetcher with 24h cache" },
      { tag: "feature", text: "LovdataPreview component inline in TrustModal" },
      { tag: "fix", text: "Zod schema fix: nullable fields in deadline + lawRef" },
      { tag: "fix", text: "Chat maxTokens 1200 → 2500 (Gemma 4 thinking buffer)" },
    ],
  },
  {
    date: "2026-04-15",
    version: "v2.0.0",
    title: "TSP Spec v2.0 — stable",
    body: "First stable spec release. JSON-LD format frozen, signature chain consolidated, all modules built against the same protocol.",
    changes: [
      { tag: "breaking", text: "Spec v1.x envelopes are not compatible — run migrate script" },
      { tag: "feature", text: "JSON-LD context locked: truststandardprotocol.com/spec/v2.0" },
      { tag: "feature", text: "Risk Dashboard as the first paid module" },
      { tag: "security", text: "SHA-256 replaces SHA-1 in the ledger chain" },
    ],
  },
  {
    date: "2026-03-10",
    version: "v1.9.0",
    title: "First production deploy",
    body: "First regulated system signed continuously with TSP. The goal is stable chain integrity and measurable envelope volume in operation.",
    changes: [
      { tag: "feature", text: "Customer deployment switched to TSP-signed AI across relevant output surfaces" },
      { tag: "feature", text: "Live ledger published at /ledger" },
      { tag: "fix", text: "Performance: envelope write under 5ms at p95" },
    ],
  },
];

const ROADMAP_NO = [
  {
    title: "v3.0 — Federerte ledgers",
    desc: "Flere parter kan signere én envelope (joint controllers). Multi-party verifisering uten sentral autoritet.",
    when: "Q3 2026",
  },
  {
    title: "Notarized timestamps",
    desc: "Integrasjon mot Norges Bank / Posten/RFC 3161 for tidsstempler som er rettssikre i Norge.",
    when: "Q4 2026",
  },
  {
    title: "@lexico/tsp på npm",
    desc: "Etter v3.0-stabilitet publiseres SDK-en formelt. Foreløpig: clone fra GitHub.",
    when: "Q1 2027",
  },
  {
    title: "ZK-proofs (eksperimentelt)",
    desc: "Verifisere envelope-egenskaper uten å avsløre innhold. Forsknings­spor sammen med UiO.",
    when: "Forskning",
  },
];

const ROADMAP_EN = [
  {
    title: "v3.0 — Federated ledgers",
    desc: "Multiple parties can sign one envelope (joint controllers). Multi-party verification without a central authority.",
    when: "Q3 2026",
  },
  {
    title: "Notarised timestamps",
    desc: "Integration with Norges Bank / Posten/RFC 3161 for timestamps that are legally binding in Norway.",
    when: "Q4 2026",
  },
  {
    title: "@lexico/tsp on npm",
    desc: "After v3.0 stability the SDK is published formally. For now: clone from GitHub.",
    when: "Q1 2027",
  },
  {
    title: "ZK proofs (experimental)",
    desc: "Verify envelope properties without revealing the contents. Research track with the University of Oslo.",
    when: "Research",
  },
];

export default async function EndringerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("endringer");
  const ENTRIES = locale === "en" ? ENTRIES_EN : ENTRIES_NO;
  const ROADMAP = locale === "en" ? ROADMAP_EN : ROADMAP_NO;

  const TAG_LABELS: Record<Tag, string> = {
    feature: t("tagFeature"),
    fix: t("tagFix"),
    security: t("tagSecurity"),
    breaking: t("tagBreaking"),
    docs: t("tagDocs"),
  };

  return (
    <>
      <section className="tsp-hero-surface border-b border-border">
        <div className="tsp-container py-12 md:py-16">
          <nav className="tsp-section-marker mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-ink no-underline">TSP</Link>
            <span className="opacity-40">·</span>
            <span className="text-ink">{t("breadcrumb")}</span>
          </nav>
          <div className="tsp-section-eyebrow mb-5">
            <span className="tsp-section-num tsp-section-num--accent">{t("eyebrowChip")}</span>
            <span className="tsp-section-label">{t("eyebrowLabel")}</span>
          </div>
          <h1 className="mb-5 max-w-3xl">{t("h1")}</h1>
          <p className="text-ink text-lg leading-relaxed max-w-3xl">{t("lead")}</p>
        </div>
      </section>

    <div className="tsp-container py-12 max-w-4xl">
      {/* Versions */}
      <div className="space-y-8 mb-16">
        {ENTRIES.map((entry) => (
          <article key={entry.version} className="tsp-card p-6 md:p-7">
            <div className="flex flex-wrap items-baseline gap-3 mb-3">
              <span className="text-2xl font-bold tabular-nums">
                {entry.version}
              </span>
              <span className="text-xs text-muted inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(entry.date, locale)}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2">{entry.title}</h2>
            <p className="text-muted leading-relaxed mb-4">{entry.body}</p>
            <ul className="space-y-1.5">
              {entry.changes.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span
                    className={
                      "text-[10px] uppercase tracking-wider font-bold rounded px-1.5 py-0.5 border shrink-0 mt-0.5 " +
                      TAG_STYLES[c.tag].classes
                    }
                  >
                    {TAG_LABELS[c.tag]}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{c.text}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* Roadmap */}
      <section className="mb-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> {t("roadmapEyebrow")}
        </div>
        <h2 className="text-3xl font-bold mb-2">{t("roadmapTitle")}</h2>
        <p className="text-muted mb-6">{t("roadmapLead")}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {ROADMAP.map((item) => (
            <div key={item.title} className="tsp-card p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-bold text-ink">{item.title}</div>
                <span className="text-[11px] uppercase tracking-wider text-muted bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {item.when}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Honesty */}
      <section className="border-l-2 border-accent bg-elevated p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent-dark shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg mb-1.5">{t("honestTitle")}</h2>
            <p className="text-sm text-ink leading-relaxed">{t("honestBody")}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/kontakt" className="tsp-btn-primary inline-flex items-center gap-2">
          {t("ctaPrimary")} <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/spec" className="tsp-btn-secondary">
          {t("ctaSecondary")}
        </Link>
      </div>
    </div>
    </>
  );
}

function formatDate(iso: string, locale: string = "no"): string {
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
