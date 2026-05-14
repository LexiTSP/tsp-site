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
  Eye,
  Users,
  AlertCircle,
  Info,
  Check,
  Inbox,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "moduleOversight" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

export default async function OversightModulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("moduleOversight");

  return (
    <ModuleLayout moduleSlug="oversight">
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
                strong: (c) => <strong>{c}</strong>,
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

      <ModuleSection eyebrow={t("componentsEyebrow")} title={t("componentsTitle")}>
        <FeatureGrid
          items={[
            { title: t("feature1Title"), desc: t("feature1Desc"), Icon: Check },
            { title: t("feature2Title"), desc: t("feature2Desc"), Icon: Info },
            { title: t("feature3Title"), desc: t("feature3Desc"), Icon: Inbox },
            { title: t("feature4Title"), desc: t("feature4Desc"), Icon: Users },
            { title: t("feature5Title"), desc: t("feature5Desc"), Icon: AlertCircle },
            { title: t("feature6Title"), desc: t("feature6Desc"), Icon: Eye },
          ]}
        />
      </ModuleSection>

      <ModuleSection
        eyebrow={t("integrationEyebrow")}
        title={t("integrationTitle")}
        intro={<p>{t("integrationIntro")}</p>}
      >
        <CodeBlock
          label={t("codeReact")}
          lang="tsx"
          code={`import { TrustBadge, TrustModal } from "@lexitsp/oversight-react";

function ChatMessage({ envelope }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <p>{envelope.content}</p>
      <TrustBadge
        envelope={envelope}
        onDetailsClick={() => setModalOpen(true)}
      />
      {modalOpen && (
        <TrustModal
          envelope={envelope}
          language="${locale === "en" ? "en-US" : "nb-NO"}"
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}`}
        />

        <CodeBlock
          label={t("codeQueue")}
          lang="typescript"
          code={`import { queueForReview } from "@lexitsp/oversight";

// Automatic when envelope has humanReviewRequired=true
await queueForReview({
  envelopeId: envelope.ledger.id,
  assignedTeam: "welfare-reviewers",
  priority: envelope.alignment.riskLevel >= 4 ? "urgent" : "normal",
  slaMinutes: envelope.alignment.riskLevel >= 4 ? 60 : 1440,
  context: {
    reason: envelope.alignment.flags.join(", "),
    userRequest: originalUserMessage,
  },
});`}
        />

        <CodeBlock
          label={t("codeDecision")}
          lang="typescript"
          code={`const reviewEnvelope = await submitDecision(item.id, {
  reviewerId: "lisa.hansen",
  decision: "approve", // or "edit" / "reject"
  targetEnvelopeId: originalEnvelope.ledger.id,
  contentHash: originalEnvelope.content.hash,
});

// Oversight signs a ReviewEnvelope and links it back to the original TrustEnvelope.`}
        />
      </ModuleSection>

      <ModuleSection eyebrow={t("euEyebrow")} title={t("euTitle")}>
        <CoverageList
          title={t("coverageTitle")}
          articles={[
            { slug: "article-14", ref: "Art. 14", text: t("coverageArt14"), coverage: "primary" },
            { slug: "article-13", ref: "Art. 13", text: t("coverageArt13"), coverage: "primary" },
            { slug: "article-9", ref: "Art. 9", text: t("coverageArt9"), coverage: "support" },
          ]}
        />
      </ModuleSection>

      <IntegrationCallout>
        <p>{t("integrationP1")}</p>
        <p>{t.rich("integrationP2", { code: (c) => <code>{c}</code> })}</p>
        <p className="text-xs text-muted">{t("integrationP3")}</p>
      </IntegrationCallout>

      <ModuleCTA
        primaryText={t("ctaPrimary")}
        primaryHref="/eu-ai-act/article-14"
        secondaryText={t("ctaSecondary")}
        secondaryHref="/core"
      />
    </ModuleLayout>
  );
}
