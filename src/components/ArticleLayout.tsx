import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { TranslationBanner } from "./TranslationBanner";
import { V2BoundaryNote, V2CanonicalStrip, V2PageHero } from "./V2ProofSurface";

/**
 * ArticleLayout — felles skall for alle /eu-ai-act/article-*-sider.
 * Sidenav, breadcrumb, prev/next-navigering. Children inneholder artikkel-spesifikt innhold.
 */

export const AI_ACT_ARTICLES = [
  { slug: "article-12", number: "12", name: "Record-keeping", tsp: "Core" },
  { slug: "article-13", number: "13", name: "Transparency", tsp: "Core + Oversight" },
  { slug: "article-14", number: "14", name: "Human oversight", tsp: "Oversight" },
  { slug: "article-15", number: "15", name: "Accuracy & robustness", tsp: "Core" },
  { slug: "article-9", number: "9", name: "Risk management", tsp: "Risk" },
  { slug: "article-17", number: "17", name: "Quality management", tsp: "Evidence" },
];

interface Props {
  articleSlug: string;
  articleNumber: string;
  articleTitle: string;
  tspCoverage: string;
  coveragePercent: number;
  children: React.ReactNode;
}

export function ArticleLayout({
  articleSlug,
  articleNumber,
  articleTitle,
  tspCoverage,
  coveragePercent,
  children,
}: Props) {
  const t = useTranslations("articleLayout");
  const locale = useLocale();
  const isEn = locale === "en";
  const currentIdx = AI_ACT_ARTICLES.findIndex((a) => a.slug === articleSlug);
  const prev = currentIdx > 0 ? AI_ACT_ARTICLES[currentIdx - 1] : null;
  const next = currentIdx < AI_ACT_ARTICLES.length - 1 ? AI_ACT_ARTICLES[currentIdx + 1] : null;

  return (
    <>
      <V2PageHero
        eyebrow={isEn ? "EU AI Act mapping · technical evidence" : "EU AI Act-mapping · teknisk bevis"}
        title={articleTitle}
        lead={
          isEn
            ? `Article ${articleNumber} mapped to the TSP layer that can produce runtime evidence. This is a technical mapping, not a legal conformity decision.`
            : `Artikkel ${articleNumber} mappet til TSP-laget som kan produsere runtime-bevis. Dette er en teknisk mapping, ikke en juridisk samsvarsbeslutning.`
        }
        primaryCta={{ href: "#article-detail", label: isEn ? "Read the mapping" : "Les mappingen" }}
        secondaryCta={{ href: "/verify", label: isEn ? "Verify a receipt" : "Verifiser kvittering" }}
        proofItems={[
          { label: isEn ? "Article" : "Artikkel", value: articleNumber },
          { label: isEn ? "TSP layer" : "TSP-lag", value: tspCoverage },
          { label: isEn ? "Technical fit" : "Teknisk treff", value: `${coveragePercent}%` },
        ]}
      />
      <V2CanonicalStrip locale={locale} />

    <div id="article-detail" className="tsp-container py-10 scroll-mt-20">
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-4">
        <Link href="/" className="hover:text-brand">TSP</Link>
        <span className="opacity-50">/</span>
        <Link href="/eu-ai-act" className="hover:text-brand">{t("breadcrumbAct")}</Link>
        <span className="opacity-50">/</span>
        <span className="text-ink">{t("breadcrumbArticle")} {articleNumber}</span>
      </nav>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="tsp-eyebrow text-muted mb-3 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5" />
            {t("sidenavTitle")}
          </div>
          <Link
            href="/eu-ai-act"
            className="block mb-3 px-3 py-2 text-sm text-muted hover:text-brand hover:bg-brand/5 rounded-lg"
          >
            {t("backToOverview")}
          </Link>
          <div className="space-y-0.5">
            {AI_ACT_ARTICLES.map((a) => {
              const isActive = a.slug === articleSlug;
              return (
                <Link
                  key={a.slug}
                  href={`/eu-ai-act/${a.slug}`}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm transition-colors border-l-2",
                    isActive
                      ? "bg-brand/5 border-brand text-brand font-semibold"
                      : "border-transparent text-muted hover:bg-gray-50 hover:text-ink",
                  )}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs opacity-60">{t("articleAbbr")}</span>
                    <span className="font-bold">{a.number}</span>
                    <span className="text-xxs opacity-70 truncate">{a.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 p-3 border-l-2 border-accent">
            <div className="tsp-eyebrow tsp-accent-text mb-1">{t("helpEyebrow")}</div>
            <p className="text-xs text-muted leading-relaxed mb-2">{t("helpBody")}</p>
            <Link href="/kontakt" className="text-xs font-semibold text-ink hover:underline">
              {t("helpCta")}
            </Link>
          </div>
        </aside>

        <article className="max-w-3xl">
          <div className="mb-8 pb-6 border-b">
            <div className="inline-flex items-center gap-2 tsp-pill border-brand/30 bg-brand/5 text-brand mb-3">
              <FileCheck className="w-3 h-3" />
              {t("headerPill")} {articleNumber}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted">{t("coveredBy")}</span>
                <span className="font-semibold text-ink">TSP {tspCoverage}</span>
              </div>
              <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                <span className="text-muted whitespace-nowrap">{t("coverage")}</span>
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      coveragePercent >= 80 ? "bg-verify" : coveragePercent >= 50 ? "bg-brand" : "bg-warn",
                    )}
                    style={{ width: `${coveragePercent}%` }}
                  />
                </div>
                <span className="font-mono text-xs tabular-nums font-semibold">{coveragePercent}%</span>
              </div>
            </div>
          </div>

          <TranslationBanner />

          <div className="mb-10">
            <V2BoundaryNote title={isEn ? "What this mapping means" : "Hva denne mappingen betyr"}>
              {isEn
                ? "TSP can create evidence objects for parts of the obligation: signed outputs, source declarations, process metadata, timestamps, and verification results. It does not replace legal assessment, notified-body work, organisational controls, or human accountability."
                : "TSP kan lage bevisobjekter for deler av forpliktelsen: signerte svar, kildeerklæringer, prosessmetadata, tidsstempel og verifikasjonsresultater. Det erstatter ikke juridisk vurdering, notified-body arbeid, organisatoriske kontroller eller menneskelig ansvar."}
            </V2BoundaryNote>
          </div>

          <div className="space-y-12">{children}</div>

          <nav className="mt-16 pt-8 border-t grid sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/eu-ai-act/${prev.slug}`}
                className="tsp-card p-4 hover:border-brand/40 group"
              >
                <div className="text-xs text-muted mb-1 flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> {t("prev")}
                </div>
                <div className="font-semibold text-ink group-hover:text-brand">
                  {t("articleAbbr")} {prev.number} — {prev.name}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                href={`/eu-ai-act/${next.slug}`}
                className="tsp-card p-4 hover:border-brand/40 group text-right"
              >
                <div className="text-xs text-muted mb-1 flex items-center justify-end gap-1">
                  {t("next")} <ArrowRight className="w-3 h-3" />
                </div>
                <div className="font-semibold text-ink group-hover:text-brand">
                  {t("articleAbbr")} {next.number} — {next.name}
                </div>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
    </>
  );
}
