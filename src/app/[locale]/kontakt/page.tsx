import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Mail,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Building2,
  Code2,
  Scale,
  ExternalLink,
} from "lucide-react";

const CONTACT_EMAIL = "tsp@lexico.no";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kontakt" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kontakt");

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
          <p className="text-ink text-lg leading-relaxed max-w-2xl">
            {t("leadBefore")}
            <a className="text-accent-dark font-medium" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            {t("leadAfter")}
          </p>
        </div>
      </section>

      <div className="tsp-container py-12 max-w-4xl">

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <AudienceCard
          icon={<Building2 className="w-5 h-5" />}
          title={t("buyerTitle")}
          body={t("buyerBody")}
          ctaLabel={t("buyerCta")}
          mailto={`Subject=${encodeURIComponent(t("buyerSubject"))}&body=${encodeURIComponent(t("buyerEmailBody"))}`}
        />
        <AudienceCard
          icon={<Scale className="w-5 h-5" />}
          title={t("complianceTitle")}
          body={t("complianceBody")}
          ctaLabel={t("complianceCta")}
          mailto={`Subject=${encodeURIComponent(t("complianceSubject"))}&body=${encodeURIComponent(t("complianceEmailBody"))}`}
        />
        <AudienceCard
          icon={<Code2 className="w-5 h-5" />}
          title={t("devTitle")}
          body={t("devBody")}
          ctaLabel={t("devCta")}
          mailto={`Subject=${encodeURIComponent(t("devSubject"))}&body=${encodeURIComponent(t("devEmailBody"))}`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-12">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="tsp-card p-6 hover:border-brand/40 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <div className="font-bold text-lg mb-1">{t("emailTitle")}</div>
          <div className="text-sm text-muted mb-2">{t("emailDesc")}</div>
          <div className="font-mono text-sm text-brand inline-flex items-center gap-1">
            {CONTACT_EMAIL} <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </a>

        <Link
          href="/playground"
          className="tsp-card p-6 hover:border-brand/40 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-verify/10 text-verify flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="font-bold text-lg mb-1">{t("playgroundTitle")}</div>
          <div className="text-sm text-muted mb-2">{t("playgroundDesc")}</div>
          <div className="text-sm text-brand font-medium inline-flex items-center gap-1">
            {t("playgroundCta")} <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      <div className="border-l-2 border-accent bg-elevated p-6">
        <h2 className="text-xl mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent-dark" />
          {t("expectTitle")}
        </h2>
        <ol className="text-sm text-ink space-y-2 list-decimal list-inside">
          <li>
            <strong>{t("expect1Strong")}</strong> {t("expect1")}
          </li>
          <li>
            <strong>{t("expect2Strong")}</strong> {t("expect2")}
          </li>
          <li>
            <strong>{t("expect3Strong")}</strong> {t("expect3")}
          </li>
        </ol>
      </div>

      <div className="mt-12 text-sm text-muted flex flex-wrap gap-x-6 gap-y-2">
        <span>
          <strong className="text-ink">{t("metaCompany")}</strong> {t("metaCompanyValue")}
        </span>
        <a
          href="https://github.com/Lexi-Co"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand inline-flex items-center gap-1"
        >
          GitHub <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://lexico.no"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand inline-flex items-center gap-1"
        >
          lexico.no <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
    </>
  );
}

function AudienceCard({
  icon,
  title,
  body,
  ctaLabel,
  mailto,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  ctaLabel: string;
  mailto: string;
}) {
  return (
    <div className="tsp-card p-5 flex flex-col">
      <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="font-bold text-base mb-1.5">{title}</div>
      <p className="text-sm text-muted leading-relaxed flex-1 mb-3">{body}</p>
      <a
        href={`mailto:${CONTACT_EMAIL}?${mailto}`}
        className="text-sm text-brand font-medium hover:underline inline-flex items-center gap-1"
      >
        {ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
