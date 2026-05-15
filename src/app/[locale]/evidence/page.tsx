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
  FileText,
  ClipboardCheck,
  Calendar,
  ShieldCheck,
  Stamp,
  FolderArchive,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "moduleEvidence" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

export default async function EvidenceModulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("moduleEvidence");

  return (
    <ModuleLayout moduleSlug="evidence">
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
              {t.rich("practiceP2", { strong: (c) => <strong>{c}</strong> })}
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
            { title: t("feature1Title"), desc: t("feature1Desc"), Icon: FolderArchive },
            { title: t("feature2Title"), desc: t("feature2Desc"), Icon: ClipboardCheck },
            { title: t("feature3Title"), desc: t("feature3Desc"), Icon: Calendar },
            { title: t("feature4Title"), desc: t("feature4Desc"), Icon: FileText },
            { title: t("feature5Title"), desc: t("feature5Desc"), Icon: ShieldCheck },
            { title: t("feature6Title"), desc: t("feature6Desc"), Icon: Stamp },
          ]}
        />
      </ModuleSection>

      <ModuleSection
        eyebrow={t("anatomyEyebrow")}
        title={t("anatomyTitle")}
        intro={<p>{t("anatomyIntro")}</p>}
      >
        <CodeBlock
          label="dossier-structure.json"
          lang="json"
          code={`{
  "dossier_version": "evidence-1.0",
  "period": { "from": "2026-03-01", "to": "2026-03-31" },
  "deployment": "Regulated AI Deployment",
  "generated_at": "2026-04-01T06:00:00Z",
  "generated_by": "TSP Evidence v1.2.0",

  "ai_act_mapping": {
    "article_9":  { "status": "covered",  "evidence_refs": [...], "gaps": [] },
    "article_12": { "status": "covered",  "evidence_refs": [...], "gaps": [] },
    "article_13": { "status": "covered",  "evidence_refs": [...], "gaps": [] },
    "article_14": { "status": "covered",  "evidence_refs": [...], "gaps": [] },
    "article_15": { "status": "covered",  "evidence_refs": [...], "gaps": [] },
    "article_17": { "status": "partial",  "notes": "ISO 42001 cert in progress" }
  },

  "iso_42001_mapping": {
    "clause_6_1":  { "status": "covered", "refs": [...] },
    "clause_7_3":  { "status": "covered", "refs": [...] },
    "clause_8_1":  { "status": "covered", "refs": [...] },
    "clause_9_1":  { "status": "covered", "refs": [...] },
    "clause_10_2": { "status": "partial", "notes": "..." }
  },

  "chain_integrity": {
    "valid": true,
    "verified_at": "2026-04-01T06:00:12Z",
    "total_envelopes": 124561,
    "first_envelope": "2026-03-01T00:00:14Z",
    "last_envelope":  "2026-03-31T23:58:41Z",
    "merkle_root": "c7d2..."
  },

  "statistics": { ... },
  "incidents":  [ ... ],
  "changes":    [ ... ],
  "attestations": [ ... ]
}`}
        />
      </ModuleSection>

      <ModuleSection eyebrow={t("euEyebrow")} title={t("euTitle")}>
        <CoverageList
          title={t("coverageTitle")}
          articles={[
            { slug: "article-17", ref: "Art. 17", text: t("coverageArt17"), coverage: "primary" },
            { slug: "article-12", ref: "Art. 12", text: t("coverageArt12"), coverage: "support" },
            { slug: "article-9", ref: "Art. 9", text: t("coverageArt9"), coverage: "support" },
            { slug: "article-15", ref: "Art. 15", text: t("coverageArt15"), coverage: "support" },
          ]}
        />
      </ModuleSection>

      <IntegrationCallout>
        <p>{t("integrationP1")}</p>
        <p>{t.rich("integrationP2", { strong: (c) => <strong>{c}</strong> })}</p>
        <p>{t("integrationP3")}</p>
      </IntegrationCallout>

      <ModuleCTA
        primaryText={t("ctaPrimary")}
        primaryHref="/iso-42001"
        secondaryText={t("ctaSecondary")}
        secondaryHref="/eu-ai-act/article-17"
      />
    </ModuleLayout>
  );
}
