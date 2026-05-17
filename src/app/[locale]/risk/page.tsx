import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ModuleLayout } from "@/components/ModuleLayout";
import {
  ModuleSection,
  FeatureGrid,
  CodeBlock,
  CoverageList,
  LicenseBox,
  IntegrationCallout,
  ModuleCTA,
} from "@/components/ModuleBlocks";
import {
  Bell,
  Activity,
  AlertTriangle,
  BarChart3,
  GitCompare,
  FileText,
  Webhook,
  ArrowRight,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "moduleRisk" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function RiskModulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("moduleRisk");

  return (
    <ModuleLayout moduleSlug="risk">
      <ModuleSection
        eyebrow={t("practiceEyebrow")}
        title={t("practiceTitle")}
        intro={
          <>
            <p>
              <strong>{t("practiceP1Strong")}</strong> {t("practiceP1")}
            </p>
            <p>
              <strong>{t("practiceP2Strong")}</strong>{" "}
              {t.rich("practiceP2", {
                em: (c) => <em>{c}</em>,
                code: (c) => <code>{c}</code>,
              })}
            </p>
          </>
        }
      >
        <LicenseBox
          license="Commercial"
          summary={t("licenseSummary")}
          details={[
            t("licenseDetail1"),
            t("licenseDetail2"),
            t("licenseDetail3"),
            t("licenseDetail4"),
          ]}
        />
      </ModuleSection>

      <ModuleSection eyebrow={t("featuresEyebrow")} title={t("featuresTitle")}>
        <FeatureGrid
          items={[
            { title: t("feature1Title"), desc: t("feature1Desc"), Icon: BarChart3 },
            { title: t("feature2Title"), desc: t("feature2Desc"), Icon: GitCompare },
            { title: t("feature3Title"), desc: t("feature3Desc"), Icon: Bell },
            { title: t("feature4Title"), desc: t("feature4Desc"), Icon: AlertTriangle },
            { title: t("feature5Title"), desc: t("feature5Desc"), Icon: FileText },
            { title: t("feature6Title"), desc: t("feature6Desc"), Icon: Webhook },
          ]}
        />
      </ModuleSection>

      <ModuleSection
        eyebrow={t("alertsEyebrow")}
        title={t("alertsTitle")}
        intro={<p>{t("alertsIntro")}</p>}
      >
        <CodeBlock
          label="tsp-risk-config.yaml"
          lang="yaml"
          code={`# Deterministic rules over TSP v3 envelope metadata.
# Risk receives envelope pointers and metadata, not raw user content.
alerts:
  - name: high_stakes_flag_rate
    description: Detects changes in structured risk flags after model or policy changes
    trigger:
      metric: alignment.flags[].code
      filter:
        contains: high-stakes
        policy_id: welfare
      method: rolling_average
      window_days: 14
      baseline_days: 60
      threshold:
        type: std_deviation
        multiplier: 2
    severity: high
    notifications:
      - slack: "#compliance-alerts"
      - jira: { project: "COMPLY", type: "Incident" }
      - email: compliance@example.com
    sla_hours: 24

  - name: human_review_missing
    description: High-severity uncertainty without human review routing
    trigger:
      filter:
        alignment.uncertainty[].severity: high
        alignment.humanReviewRequired: false
      method: count
      threshold: 1  # should never be > 0
    severity: critical
    notifications:
      - webhook: "https://customer.example/incidents/tsp"`}
        />
      </ModuleSection>

      <ModuleSection eyebrow={t("euEyebrow")} title={t("euTitle")}>
        <CoverageList
          title={t("coverageTitle")}
          articles={[
            { slug: "article-9", ref: "Art. 9", text: t("coverageArt9"), coverage: "primary" },
            { slug: "article-15", ref: "Art. 15", text: t("coverageArt15"), coverage: "partial" },
            { slug: "article-17", ref: "Art. 17", text: t("coverageArt17"), coverage: "support" },
          ]}
        />
      </ModuleSection>

      <IntegrationCallout>
        <p>{t("integrationP1")}</p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            <strong>{t("integrationRule1Strong")}</strong>{" "}
            {t.rich("integrationRule1", { code: (c) => <code>{c}</code> })}
          </li>
          <li>
            <strong>{t("integrationRule2Strong")}</strong>{" "}
            {t.rich("integrationRule2", { code: (c) => <code>{c}</code> })}
          </li>
          <li>
            <strong>{t("integrationRule3Strong")}</strong>{" "}
            {t.rich("integrationRule3", { code: (c) => <code>{c}</code> })}
          </li>
          <li>
            <strong>{t("integrationRule4Strong")}</strong>{" "}
            {t.rich("integrationRule4", { code: (c) => <code>{c}</code> })}
          </li>
        </ul>
        <p className="text-xs text-muted">{t("integrationP2")}</p>
      </IntegrationCallout>

      {/* Preview tease */}
      <section className="border-l-2 border-accent bg-elevated p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="tsp-eyebrow tsp-accent-text mb-1">{t("previewEyebrow")}</div>
            <h3 className="text-xl font-bold mb-2">{t("previewTitle")}</h3>
            <p className="text-sm text-muted leading-relaxed mb-4">{t("previewDesc")}</p>
            <Link href="/risk/preview" className="tsp-btn-primary text-sm">
              {t("previewCta")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <ModuleCTA
        primaryText={t("ctaPrimary")}
        primaryHref="/eu-ai-act/article-9"
        secondaryText={t("ctaSecondary")}
        secondaryHref="/kontakt"
      />
    </ModuleLayout>
  );
}
