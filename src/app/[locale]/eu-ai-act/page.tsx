import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Calendar,
  FileCheck2,
  ArrowRight,
  XCircle,
  Scale,
} from "lucide-react";
import { ArticleMatrix } from "@/components/ArticleMatrix";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "euAiAct" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

export default async function EuAiActPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("euAiAct");

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
          <p className="text-ink text-lg max-w-3xl leading-relaxed">
            {t.rich("lead", { strong: (c) => <strong>{c}</strong> })}
          </p>
        </div>
      </section>

    <div className="tsp-container py-12">
      <div className="mb-12 border-l-2 border-accent bg-elevated p-6 md:p-8">
        <div className="tsp-eyebrow text-muted mb-3">{t("simpleEyebrow")}</div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">{t("simpleTitle")}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-bold text-ink mb-1.5">{t("simple1Title")}</div>
            <p className="text-sm text-muted leading-relaxed">{t("simple1Body")}</p>
          </div>
          <div>
            <div className="text-sm font-bold text-ink mb-1.5">{t("simple2Title")}</div>
            <p className="text-sm text-muted leading-relaxed">{t("simple2Body")}</p>
          </div>
          <div>
            <div className="text-sm font-bold text-ink mb-1.5">{t("simple3Title")}</div>
            <p className="text-sm text-muted leading-relaxed">{t("simple3Body")}</p>
          </div>
        </div>
        <div className="mt-5 text-sm text-muted">
          {t.rich("simpleOutro", { strong: (c) => <strong className="text-ink">{c}</strong> })}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <FactCard
          icon={<Calendar className="w-5 h-5" />}
          label={t("factFullForceLabel")}
          value={t("factFullForceValue")}
          sub={t("factFullForceSub")}
        />
        <FactCard
          icon={<FileCheck2 className="w-5 h-5" />}
          label={t("factTspTrailLabel")}
          value={t("factTspTrailValue")}
          sub={t("factTspTrailSub")}
        />
        <FactCard
          icon={<Scale className="w-5 h-5" />}
          label={t("factCoverageLabel")}
          value={t("factCoverageValue")}
          sub={t("factCoverageSub")}
        />
      </div>

      <div className="mb-14 p-6 border border-border bg-elevated tsp-bg-elevated">
        <div className="tsp-eyebrow tsp-accent-text mb-3">{t("claimEyebrow")}</div>
        <p className="text-2xl font-bold leading-tight mb-3">
          {t("claimP1Before")}
          <span className="line-through text-muted">{t("claimP1Strikethrough")}</span>
          {t("claimP1After")}
        </p>
        <p className="text-muted leading-relaxed max-w-3xl">
          {t.rich("claimP2", { em: (c) => <em>{c}</em> })}
        </p>
      </div>

      <section className="mb-14">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t("matrixTitle")}</h2>
            <p className="text-sm text-muted">{t("matrixLead")}</p>
          </div>
        </div>
        <ArticleMatrix />
      </section>

      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-5">{t("articlesTitle")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ArticleCard number="12" name={t("art12Name")} desc={t("art12Desc")} module="Core" coverage={95} slug="article-12" />
          <ArticleCard number="13" name={t("art13Name")} desc={t("art13Desc")} module="Core + Oversight" coverage={90} slug="article-13" />
          <ArticleCard number="14" name={t("art14Name")} desc={t("art14Desc")} module="Oversight" coverage={75} slug="article-14" />
          <ArticleCard number="15" name={t("art15Name")} desc={t("art15Desc")} module="Core" coverage={85} slug="article-15" />
          <ArticleCard number="9" name={t("art9Name")} desc={t("art9Desc")} module="Risk" coverage={70} slug="article-9" highlighted />
          <ArticleCard number="17" name={t("art17Name")} desc={t("art17Desc")} module="Evidence + ISO 42001" coverage={40} slug="article-17" />
        </div>
      </section>

      <section className="mb-14">
        <div className="tsp-eyebrow text-muted mb-3">{t("honestEyebrow")}</div>
        <h2 className="text-2xl font-bold mb-2">
          {t.rich("honestTitle", { em: (c) => <em>{c}</em> })}
        </h2>
        <p className="text-muted mb-6 max-w-2xl">{t("honestLead")}</p>
        <div className="grid md:grid-cols-3 gap-4">
          <NotCoveredCard title={t("notCovered1Title")} desc={t("notCovered1Desc")} suggestion={t("notCovered1Suggestion")} />
          <NotCoveredCard title={t("notCovered2Title")} desc={t("notCovered2Desc")} suggestion={t("notCovered2Suggestion")} />
          <NotCoveredCard title={t("notCovered3Title")} desc={t("notCovered3Desc")} suggestion={t("notCovered3Suggestion")} />
        </div>
      </section>

    </div>

    <section className="tsp-inverse border-t border-border-strong">
      <div className="tsp-container py-14 md:py-18 relative">
        <div className="tsp-section-eyebrow mb-5">
          <span className="tsp-section-num tsp-section-num--accent">→</span>
          <span className="tsp-section-label">{t("ctaEyebrow")}</span>
        </div>
        <h2 className="mb-4 max-w-3xl">{t("ctaH2")}</h2>
        <p className="text-white/75 max-w-2xl mb-8 leading-relaxed text-lg">{t("ctaLead")}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/playground" className="tsp-btn-primary" style={{ background: "var(--color-accent)", borderColor: "var(--color-accent)", color: "#fff" }}>
            {t("ctaPrimary")} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/spec" className="tsp-btn-secondary" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}>
            {t("ctaSecondary")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}

function FactCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  href?: string;
}) {
  const content = (
    <div className="tsp-card p-5 hover:border-brand/40 transition-colors h-full">
      <div className="flex items-center gap-2 tsp-eyebrow text-muted mb-2">
        <span className="text-brand">{icon}</span>
        {label}
      </div>
      <div className="text-2xl font-bold text-ink">{value}</div>
      <div className="text-sm text-muted mt-0.5">{sub}</div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function ArticleCard({
  number,
  name,
  desc,
  module,
  coverage,
  slug,
  highlighted,
}: {
  number: string;
  name: string;
  desc: string;
  module: string;
  coverage: number;
  slug: string;
  highlighted?: boolean;
}) {
  return (
    <Link
      href={`/eu-ai-act/${slug}`}
      className={`tsp-card p-5 hover:border-brand/40 transition-all group flex flex-col ${
        highlighted ? "ring-2 ring-brand/30 bg-brand/[0.02]" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="tsp-eyebrow text-muted mb-0.5">Artikkel {number}</div>
          <div className="text-xl font-bold text-ink group-hover:text-brand">{name}</div>
        </div>
        {highlighted && (
          <span className="tsp-pill border-brand/40 bg-brand/5 text-brand text-xxxs">
            ⭐ Kjerne-SKU
          </span>
        )}
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">{desc}</p>
      <div className="mt-auto flex items-center justify-between text-xs">
        <span className="font-mono text-ink/70">
          → TSP <strong className="text-ink">{module}</strong>
        </span>
        <div className="flex items-center gap-2">
          <div className="w-12 h-1 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                coverage >= 80 ? "bg-verify" : coverage >= 50 ? "bg-brand" : "bg-warn"
              }`}
              style={{ width: `${coverage}%` }}
            />
          </div>
          <span className="font-mono tabular-nums font-semibold">{coverage}%</span>
        </div>
      </div>
    </Link>
  );
}

function NotCoveredCard({ title, desc, suggestion }: { title: string; desc: string; suggestion: string }) {
  return (
    <div className="tsp-card p-5 border-warn/20 bg-warn/[0.03]">
      <div className="flex items-start gap-2 mb-2">
        <XCircle className="w-4 h-4 text-warn shrink-0 mt-0.5" />
        <div className="font-bold text-ink text-sm">{title}</div>
      </div>
      <p className="text-xs text-muted leading-relaxed mb-3">{desc}</p>
      <div className="text-xs text-brand italic border-t border-border pt-2">{suggestion}</div>
    </div>
  );
}
