import { Link } from "@/i18n/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import {
  RequirementBlock,
  TspSolutionBlock,
  EvidenceBlock,
  DeploymentExample,
  CoverageNote,
  ArticleIntro,
  SectionHeading,
  Prose,
  ExternalRef,
} from "@/components/ArticleBlocks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn
      ? "EU AI Act Art. 17 — QMS · TSP"
      : "EU AI Act Art. 17 — QMS · TSP",
    description: isEn
      ? "TSP Evidence is the technical backbone for ISO 42001 / EU AI Act art. 17 Quality Management System."
      : "TSP Evidence er teknisk ryggrad for ISO 42001 / EU AI Act art. 17 Quality Management System.",
  };
}

export default async function Article17Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <ArticleLayout
      articleSlug="article-17"
      articleNumber="17"
      articleTitle={isEn ? "Quality management system — technical backbone, organisational body" : "Quality management system — teknisk ryggrad, organisatorisk kropp"}
      tspCoverage="Evidence"
      coveragePercent={40}
    >
      <ArticleIntro>
        {isEn ? (
          <>
            Article 17 is a <strong>meta-article</strong>. It requires a system that ensures all the other
            obligations are actually met — 13 components including a compliance strategy, testing, data
            management, post-market monitoring and incident reporting. TSP Evidence covers the technical
            backbone; people and process cover the rest.
          </>
        ) : (
          <>
            Artikkel 17 er en <strong>meta-artikkel</strong>. Den krever et system som sikrer at alle de andre
            kravene faktisk overholdes — 13 komponenter inkludert compliance-strategi, testing, data
            management, post-market monitoring og hendelsesrapportering. TSP Evidence dekker den tekniske
            ryggraden; mennesker og prosess dekker resten.
          </>
        )}
      </ArticleIntro>

      <RequirementBlock
        articleRef="Art. 17 (1)"
        title={isEn ? "The legal text" : "Lovteksten"}
        quote="Providers of high-risk AI systems shall put a quality management system in place that ensures compliance with this Regulation. That system shall be documented in a systematic and orderly manner in the form of written policies, procedures and instructions, and shall include at least [13 aspects listed]."
      />

      <TspSolutionBlock
        module="Evidence"
        moduleHref="/evidence"
        summary={isEn
          ? "TSP Evidence produces audit-ready dossiers and maps envelope data to ISO 42001 clauses. Not a QMS in itself — but the technical layer that makes QMS documentation 10× cheaper."
          : "TSP Evidence produserer audit-ready dossiers og mapper envelope-data til ISO 42001-klausuler. Ikke en QMS — men det tekniske laget som gjør QMS-dokumentasjon 10× billigere."}
      >
        <SectionHeading>{isEn ? "Strategy: TSP + ISO 42001 = art. 17 compliance" : "Strategi: TSP + ISO 42001 = art. 17-compliance"}</SectionHeading>
        <Prose>
          <p>
            {isEn
              ? <>ISO 42001 (published 2023) is the most likely <em>harmonised standard</em> for art. 17 in
                 the EU. It specifies an AI Management System (AIMS) — in practice an AI-specific variant
                 of ISO 9001.</>
              : <>ISO 42001 (publisert 2023) er den mest sannsynlige <em>harmoniserte standarden</em> for art. 17 i
                 EU. Den spesifiserer et AI Management System (AIMS) — som i praksis er en AI-spesifikk variant
                 av ISO 9001.</>}
          </p>
          <p>
            {isEn
              ? "Strategy: build the QMS to ISO 42001, use TSP Evidence as the technical backbone, and obtain certification. Art. 17 compliance follows automatically."
              : "Strategi: bygg QMS etter ISO 42001, bruk TSP Evidence som teknisk ryggrad, og få sertifisering. Art. 17-compliance følger automatisk."}
          </p>
          <p>
            {isEn ? <>We have a dedicated mapping page for this: <Link href="/iso-42001" className="text-brand hover:underline">
            ISO 42001 ↔ TSP Evidence</Link>.</> : <>Vi har laget en egen mapping-side for dette: <Link href="/iso-42001" className="text-brand hover:underline">
            ISO 42001 ↔ TSP Evidence</Link>.</>}
          </p>
        </Prose>

        <SectionHeading>{isEn ? "Which art. 17 components does TSP Evidence cover?" : "Hvilke art. 17-komponenter dekker TSP Evidence?"}</SectionHeading>
        <div className="grid md:grid-cols-2 gap-3 not-prose">
          <QmsRow
            articleRef="17 (1) (b)"
            title="Techniques & procedures for design"
            tsp={isEn
              ? "Envelope structure documents design choices per answer (pipeline, source strategy, risk posture)."
              : "Envelope-struktur dokumenterer design-valg per svar (pipeline, source strategy, risk posture)."}
            coverage={70}
          />
          <QmsRow
            articleRef="17 (1) (c)"
            title="Testing & validation procedures"
            tsp={isEn
              ? "Test envelopes are marked with pipeline='evaluation'. Automatic aggregation and reporting."
              : "Test-envelopes markeres med pipeline='evaluation'. Automatisk aggregering og rapport."}
            coverage={60}
          />
          <QmsRow
            articleRef="17 (1) (d)"
            title="Technical specifications & standards"
            tsp={isEn
              ? "Spec'd per version tag. canonicalJson + SHA-256 is the harmonised technical spec."
              : "Spec'et per version-tag. canonicalJson + SHA-256 er harmonisert teknisk spec."}
            coverage={90}
          />
          <QmsRow
            articleRef="17 (1) (f)"
            title="Systems & procedures for data management"
            tsp={isEn
              ? "Runtime data lineage via the source field. Training-data governance is out of scope."
              : "Runtime data-lineage via source-feltet. Trenings-data governance er out-of-scope."}
            coverage={40}
          />
          <QmsRow
            articleRef="17 (1) (g)"
            title="Risk management system"
            tsp={isEn
              ? "The TSP Risk module — covered in its own chapter under art. 9."
              : "TSP Risk modulen — eget kapittel i art. 9."}
            coverage={80}
          />
          <QmsRow
            articleRef="17 (1) (h)"
            title="Post-market monitoring"
            tsp={isEn
              ? "The Ledger is by definition post-market data. Risk dashboards read directly from it."
              : "Ledger er per definisjon post-market-data. Risk-dashboards leser direkte fra den."}
            coverage={85}
          />
          <QmsRow
            articleRef="17 (1) (i)"
            title="Procedures for serious incidents reporting"
            tsp={isEn
              ? "Critical envelopes with relevant flags are routed to incident management via Oversight."
              : "Critical-envelopes med relevante flags ruter til incident-management via Oversight."}
            coverage={60}
          />
          <QmsRow
            articleRef="17 (1) (j)"
            title="Communication with authorities"
            tsp={isEn
              ? "Evidence can export ledger excerpts per case number. The format conforms to Annex IV."
              : "Evidence kan eksportere utdrag av ledger per saksnummer. Formatet samsvarer med Annex IV."}
            coverage={70}
          />
          <QmsRow
            articleRef="17 (1) (k)"
            title="Resource management"
            tsp={isEn
              ? "Not TSP — purely organisational work. Evidence does, however, document what has run on which models."
              : "Ikke TSP — rent organisatorisk arbeid. Evidence dokumenterer derimot hva som er kjørt på hvilke modeller."}
            coverage={20}
          />
          <QmsRow
            articleRef="17 (1) (m)"
            title="Accountability framework"
            tsp={isEn
              ? "Every envelope documents the responsible model/pipeline. Human overrides have a traceable reviewer."
              : "Hver envelope har dokumentert ansvarlig model/pipeline. Human-overrides har sporbar reviewer."}
            coverage={65}
          />
        </div>

        <SectionHeading>{isEn ? "What Evidence dossiers actually contain" : "Hva Evidence-dossiers faktisk inneholder"}</SectionHeading>
        <EvidenceBlock
          label={isEn ? "Audit-ready dossier from TSP Evidence" : "Audit-ready dossier for TSP Evidence"}
          lang="typescript"
          code={`// Eksempel: månedsrapport til compliance officer
{
  "dossier_version": "evidence-1.0",
  "period": { "from": "2026-03-01", "to": "2026-03-31" },
  "deployment": "Regulated AI Deployment",
  "ai_act_mapping": {
    "article_9":  { "status": "covered",   "evidence_refs": [...] },
    "article_12": { "status": "covered",   "evidence_refs": [...] },
    "article_13": { "status": "covered",   "evidence_refs": [...] },
    "article_14": { "status": "covered",   "evidence_refs": [...] },
    "article_15": { "status": "covered",   "evidence_refs": [...] },
    "article_17": { "status": "partial",   "notes": "ISO 42001 certification in progress" }
  },
  "iso_42001_mapping": {
    "clause_7_3":  { "status": "covered", "refs": [...] },  // Competence
    "clause_8_1":  { "status": "covered", "refs": [...] },  // Operational planning
    "clause_9_1":  { "status": "covered", "refs": [...] },  // Performance evaluation
  },
  "chain_integrity": { "valid": true, "verified_at": "..." },
  "statistics": {
    "total_envelopes": 124561,
    "confidence_distribution": { "high": 87.3, "medium": 10.1, "low": 2.1, "critical": 0.5 },
    "human_reviews_triggered": 3847,
    "human_reviews_resolved": 3823,
    "incidents_reported": 2,
    "bias_alerts": 0
  },
  "changes_since_last_dossier": [],
  "attestations": []
}`}
        />
      </TspSolutionBlock>

      <DeploymentExample>
        <p>
          {isEn
            ? "A pilot deployment can schedule ISO 42001 certification for Q3 2026. The Evidence module automatically generates monthly reports that are \"audit-ready\" — the compliance officer spends about 2 hours per month reviewing and signing the report, instead of 2 weeks of manual collation."
            : "En pilot-deployment kan planlegge ISO 42001-sertifisering for Q3 2026. Evidence-modulen genererer automatisk månedsrapporter som er \"audit-ready\" — compliance officer bruker ca. 2 timer per måned på å gjennomgå og signere rapporten, i stedet for 2 uker med manuell samling."}
        </p>
        <p>
          {isEn
            ? "The dossier format is designed to be sent directly to the certification auditor as part of a stage-1 audit. The mapping between envelope fields and ISO 42001 clauses is consistent and reproducible."
            : "Dossier-formatet er designet for å kunne sendes direkte til sertifiseringsauditor som del av stage 1-audit. Mapping mellom envelope-felter og ISO 42001-klausuler er konsistent og reproduserbar."}
        </p>
        <p>
          {isEn ? (
            <><strong>The hypothesis we test with a pilot deployment:</strong> ISO 42001 certification on a TSP
              foundation costs 10–20 % of equivalent certification without it (manual QMS documents only).
              Figures will be published once certification is complete.</>
          ) : (
            <><strong>Hypotesen vi tester med en pilot-deployment:</strong> ISO 42001-sertifisering med TSP-grunnlag
              koster 10-20 % av hva tilsvarende sertifisering koster uten (kun manuelle QMS-dokumenter). Tall
              offentliggjøres etter gjennomført sertifisering.</>
          )}
        </p>
      </DeploymentExample>

      <section className="space-y-3">
        <SectionHeading>{isEn ? "Honest status — why 40 % coverage?" : "Ærlig status — hvorfor 40 % dekning?"}</SectionHeading>
        <Prose>
          <p>
            {isEn
              ? "TSP Evidence is the backbone, not the body. Art. 17 has 13 components — of which 8 are partially or well covered by the TSP stack. The remaining 5 require people, meetings and decisions that software cannot make."
              : "TSP Evidence er ryggraden, ikke kroppen. Art. 17 har 13 komponenter — av dem er 8 delvis eller godt dekket av TSP-stacken. De resterende 5 krever mennesker, møter, og vedtak som software ikke kan ta."}
          </p>
          <p>
            {isEn
              ? "We are deliberate about that boundary. We always recommend the combination:"
              : "Vi er bevisst på denne grensen. Vi anbefaler alltid kombinasjonen:"}
          </p>
          <ol className="list-decimal list-inside ml-2">
            <li>{isEn ? "TSP Core + Risk + Evidence as the technical foundation" : "TSP Core + Risk + Evidence som teknisk grunnlag"}</li>
            <li>{isEn ? "ISO 42001 certification for the organisational process" : "ISO 42001-sertifisering for organisatorisk prosess"}</li>
            <li>{isEn ? "A compliance-officer role with real authority (not just a title)" : "Compliance officer-rolle med reell myndighet (ikke kun tittel)"}</li>
          </ol>
        </Prose>

        <CoverageNote type="covered" title={isEn ? "Technical components of art. 17 (7 of 13)" : "Tekniske komponenter av art. 17 (7 av 13)"}>
          {isEn
            ? "Design procedures, testing, technical specs, data management (runtime), risk system, post-market monitoring, incident reporting. The TSP stack covers these well."
            : "Design-procedures, testing, technical specs, data management (runtime), risk system, post-market monitoring, incident reporting. TSP-stacken dekker disse godt."}
        </CoverageNote>
        <CoverageNote type="partial" title={isEn ? "Partial (3 of 13)" : "Delvis (3 av 13)"}>
          {isEn
            ? "Communication with authorities (format supported, the process is organisational). Record-keeping (TSP = full, but QMS documentation is separate). Accountability framework."
            : "Communication with authorities (format støttes, prosess er organisatorisk). Record-keeping (TSP=full, men QMS-dokumentasjon er separat). Accountability framework."}
        </CoverageNote>
        <CoverageNote type="not-covered" title={isEn ? "Organisational (3 of 13)" : "Organisatorisk (3 av 13)"}>
          {isEn
            ? "Resource management, HR / competence, management review. These are ISO 42001's domain — clauses 7.1, 7.2, 9.3."
            : "Resource management, HR / competence, management review. Disse er ISO 42001's domene — klausul 7.1, 7.2, 9.3."}
        </CoverageNote>
      </section>
    </ArticleLayout>
  );
}

function QmsRow({
  articleRef,
  title,
  tsp,
  coverage,
}: {
  articleRef: string;
  title: string;
  tsp: string;
  coverage: number;
}) {
  const colorKey = coverage >= 70 ? "verify" : coverage >= 40 ? "brand" : "warn";
  const colorClass =
    colorKey === "verify" ? "text-verify" : colorKey === "brand" ? "text-brand" : "text-warn";
  return (
    <div className="rounded-lg border border-border p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="tsp-pill border-brand/30 bg-brand/5 text-brand text-xxxs">Art. {articleRef}</span>
        <span className={`text-xs font-mono tabular-nums font-semibold ${colorClass}`}>{coverage}%</span>
      </div>
      <div className="font-semibold text-sm mb-1">{title}</div>
      <div className="text-xs text-muted leading-relaxed">{tsp}</div>
    </div>
  );
}
