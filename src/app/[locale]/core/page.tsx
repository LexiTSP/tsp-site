import { setRequestLocale, getTranslations } from "next-intl/server";
import { ModuleLayout } from "@/components/ModuleLayout";
import { V2BoundaryNote } from "@/components/V2ProofSurface";
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
  Zap,
  Link as LinkIcon,
  Lock,
  GitBranch,
  FileJson,
  ShieldCheck,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "moduleCore" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function CoreModulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("moduleCore");

  return (
    <ModuleLayout moduleSlug="core">
      <ModuleSection
        eyebrow={t("practiceEyebrow")}
        title={t("practiceTitle")}
        intro={
          <>
            <p>
              <strong>{t("practiceIntroP1Strong")}</strong> {t("practiceIntroP1")}
            </p>
            <p>
              <strong>{t("practiceIntroP2Strong")}</strong>{" "}
              {t.rich("practiceIntroP2", { strong: (c) => <strong>{c}</strong> })}
            </p>
          </>
        }
      >
        <V2BoundaryNote title={locale === "en" ? "Core is the primitive, not the platform" : "Core er primitivet, ikke plattformen"}>
          {locale === "en"
            ? "TSP Core is the open receipt format: content hash, source declaration, process evidence, timestamp, ledger hash and signature. Risk, Evidence and Oversight are optional operational tools on top of the receipt."
            : "TSP Core er det åpne kvitteringsformatet: innholdshash, kilde-erklæring, prosessbevis, tidsstempel, ledger-hash og signatur. Risk, Evidence og Oversight er valgfrie driftsverktøy oppå kvitteringen."}
        </V2BoundaryNote>

        <LicenseBox
          license="MIT"
          summary={t("licenseSummary")}
          details={[t("licenseDetail1"), t("licenseDetail2"), t("licenseDetail3")]}
        />
      </ModuleSection>

      <ModuleSection
        eyebrow={t("guaranteesEyebrow")}
        title={t("guaranteesTitle")}
      >
        <FeatureGrid
          items={[
            { title: t("feature1Title"), desc: t("feature1Desc"), Icon: FileJson },
            { title: t("feature2Title"), desc: t("feature2Desc"), Icon: LinkIcon },
            { title: t("feature3Title"), desc: t("feature3Desc"), Icon: Lock },
            { title: t("feature4Title"), desc: t("feature4Desc"), Icon: Zap },
            { title: t("feature5Title"), desc: t("feature5Desc"), Icon: ShieldCheck },
            { title: t("feature6Title"), desc: t("feature6Desc"), Icon: GitBranch },
          ]}
        />
      </ModuleSection>

      <ModuleSection
        eyebrow={t("quickstartEyebrow")}
        title={t("quickstartTitle")}
        intro={<p>{t("quickstartIntro")}</p>}
      >
        <CodeBlock
          label={t("codeMinIntegration")}
          lang="typescript"
          code={`import { wrap } from "@lexitsp/sdk/v3";

// Before: direct call to OpenAI
const response = await openai.chat.completions.create({ ... });

// After: same call, wrapped in an envelope
const envelope = await wrap({
  type: "text",
  value: response.choices[0].message.content,
}, {
  signer,
  declaration: {
    primarySource: { type: "document", title: "Lovdata" },
    citations: [...],
  },
  process: {
    model: { provider: "openai", name: "gpt-4o", version: "2026-05", temperature: 0.2, contextWindow: 128000 },
    systemPrompt: { hash: systemPromptHash },
  },
  alignment: { uncertainty: [], humanReviewRequired: false, policy: { id: "legal", version: "1.0" } },
  prevHash,
  tsaUrls,
});

// envelope.content.value = the AI answer
// envelope.content.hash  = SHA-256 over canonical content
// envelope.ledger.hash   = SHA-256 over the signed envelope`}
        />

        <CodeBlock
          label={t("codeVerify")}
          lang="typescript"
          code={`import { verifyOnline } from "@lexitsp/sdk/v3";

const envelope = await fetchEnvelope();
const result = await verifyOnline(envelope, { trustedTsas });

if (result.valid) {
  console.log("Envelope is valid.");
} else {
  console.log(result.failures);
}`}
        />
      </ModuleSection>

      <ModuleSection
        eyebrow={t("euEyebrow")}
        title={t("euTitle")}
      >
        <CoverageList
          title={t("coverageTitle")}
          articles={[
            { slug: "article-12", ref: "Art. 12", text: t("coverageArt12"), coverage: "primary" },
            { slug: "article-13", ref: "Art. 13", text: t("coverageArt13"), coverage: "primary" },
            { slug: "article-15", ref: "Art. 15", text: t("coverageArt15"), coverage: "primary" },
            { slug: "article-14", ref: "Art. 14", text: t("coverageArt14"), coverage: "support" },
            { slug: "article-9", ref: "Art. 9", text: t("coverageArt9"), coverage: "support" },
          ]}
        />
      </ModuleSection>

      <IntegrationCallout>
        <p>{t.rich("integrationP1", { code: (c) => <code>{c}</code> })}</p>
        <p>{t.rich("integrationP2", { code: (c) => <code>{c}</code> })}</p>
      </IntegrationCallout>

      <ModuleCTA
        primaryText={t("ctaPrimary")}
        primaryHref="/spec"
        secondaryText={t("ctaSecondary")}
        secondaryHref="/docs"
      />
    </ModuleLayout>
  );
}
