import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, FileCode, AlertOctagon, FileText, Calendar, Building2 } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "whitepaper" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

export default async function WhitepaperPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("whitepaper");

  return (
    <div className="tsp-container py-16 max-w-3xl">
      <div className="tsp-section-marker mb-3 flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5" /> {t("eyebrow")}
      </div>
      <h1 className="mb-4">{t("h1")}</h1>
      <p className="text-lg text-muted max-w-2xl mb-3">{t("leadP1")}</p>
      <p className="text-sm text-muted max-w-2xl mb-3">{t("leadP2")}</p>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted mb-10">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          {t("metaEta")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="w-4 h-4" />
          {t("metaCompany")}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <Link
          href="/spec"
          className="tsp-cell-lift block border border-border bg-surface p-6 hover:border-brand no-underline"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="w-5 h-5 text-brand" />
            <span className="font-semibold text-ink">{t("card1Title")}</span>
          </div>
          <p className="text-sm text-muted leading-snug mb-3">{t("card1Desc")}</p>
          <span className="text-sm text-brand inline-flex items-center gap-1">
            {t("card1Cta")} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          href="/eu-ai-act"
          className="tsp-cell-lift block border border-border bg-surface p-6 hover:border-brand no-underline"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-brand" />
            <span className="font-semibold text-ink">{t("card2Title")}</span>
          </div>
          <p className="text-sm text-muted leading-snug mb-3">{t("card2Desc")}</p>
          <span className="text-sm text-brand inline-flex items-center gap-1">
            {t("card2Cta")} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          href="/kontakt"
          className="tsp-cell-lift block border border-border bg-surface p-6 hover:border-brand no-underline"
        >
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-brand" />
            <span className="font-semibold text-ink">{t("card3Title")}</span>
          </div>
          <p className="text-sm text-muted leading-snug mb-3">{t("card3Desc")}</p>
          <span className="text-sm text-brand inline-flex items-center gap-1">
            {t("card3Cta")} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          href="/kontakt"
          className="tsp-cell-lift block border border-border bg-surface p-6 hover:border-brand no-underline"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className="w-5 h-5 text-brand" />
            <span className="font-semibold text-ink">{t("card4Title")}</span>
          </div>
          <p className="text-sm text-muted leading-snug mb-3">{t("card4Desc")}</p>
          <span className="text-sm text-brand inline-flex items-center gap-1">
            {t("card4Cta")} <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      <div className="border-l-2 border-warn pl-4 py-3 bg-warn/5">
        <div className="flex items-center gap-2 mb-1">
          <AlertOctagon className="w-4 h-4 text-warn" />
          <span className="text-sm font-semibold text-ink">{t("honestQ")}</span>
        </div>
        <p className="text-sm text-muted">{t("honestA")}</p>
      </div>
    </div>
  );
}
