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
      ? "EU AI Act Art. 9 — Risk management · TSP"
      : "EU AI Act Art. 9 — Risk management · TSP",
    description: isEn
      ? "The TSP Risk module delivers continuous risk management with dashboard, drift detection and alerting."
      : "TSP Risk-modulen leverer kontinuerlig risikostyring med dashboard, drift-deteksjon og alerting.",
  };
}

export default async function Article9Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <ArticleLayout
      articleSlug="article-9"
      articleNumber="9"
      articleTitle={isEn ? "Risk management system — continuous, not annual" : "Risk management system — kontinuerlig, ikke årlig"}
      tspCoverage="Risk"
      coveragePercent={70}
    >
      <ArticleIntro>
        {isEn ? (
          <>
            Article 9 requires a <em>continuous</em> risk management system for high-risk AI. It is not a
            risk analysis you perform once a year — it shall be a living process with continuous detection,
            assessment and mitigation. TSP Risk turns the ledger data (from Core) into such a system.
          </>
        ) : (
          <>
            Artikkel 9 krever et <em>kontinuerlig</em> risikostyringssystem for høyrisiko-AI. Det er ikke en
            risikoanalyse du gjør én gang per år — det skal være en levende prosess med kontinuerlig
            deteksjon, vurdering og mitigering. TSP Risk gjør ledger-dataene (fra Core) om til et slikt
            system.
          </>
        )}
      </ArticleIntro>

      <RequirementBlock
        articleRef={isEn ? "Art. 9 (1) and (2)" : "Art. 9 (1) og (2)"}
        title={isEn ? "The legal text" : "Lovteksten"}
        quote="A risk management system shall be established, implemented, documented and maintained in relation to high-risk AI systems. The risk management system shall be understood as a continuous iterative process planned and run throughout the entire lifecycle of a high-risk AI system, requiring regular systematic review and updating."
      />

      <TspSolutionBlock
        module="Risk"
        moduleHref="/risk"
        summary={isEn
          ? "TSP Risk is a dashboard over the ledger data — risk distribution over time, bias drift detection, alerting on flagging. A core SKU in our commercial model."
          : "TSP Risk er et dashboard over ledger-dataene — risk-distribusjon over tid, bias-drift-deteksjon, alerting på flagging. Kjerne-SKU i vår kommersielle modell."}
      >
        <SectionHeading>{isEn ? "What the Risk module reads" : "Hva Risk-modulen leser"}</SectionHeading>
        <Prose>
          <p>
            {isEn ? (
              <>
                Every envelope written by Core already contains all the data points needed for art. 9. The
                Risk module subscribes to the ledger and builds the analysis layer on top of it — <em>without</em>{" "}
                duplicating data.
              </>
            ) : (
              <>
                Hvert envelope skrevet av Core inneholder allerede alle datapunktene som trengs for art. 9.
                Risk-modulen abonnerer på ledgeren og bygger analyse-laget over det — <em>uten</em> å duplisere
                data.
              </>
            )}
          </p>
        </Prose>

        <EvidenceBlock
          label={isEn ? "The data sources Risk relies on" : "Datakildene Risk baserer seg på"}
          lang="typescript"
          code={`// Risk aggregerer på envelope-nivå, aldri på bruker — hard grense.
// Risk-modulen får pekere (envelope-id + alignment-metadata),
// ikke selve innholdet.
const riskSignals = pointers.map(p => ({
  envelopeId:           p.envelopeId,
  claimedAt:            p.timestamp.claimed,        // ISO-8601 fra TSA
  flags:                p.alignment.flags,           // [{ code, detail? }]
  uncertainty:          p.alignment.uncertainty,     // [{ field, reason, severity }]
  policy:               p.alignment.policy,          // { id, version }
  refusal:              p.alignment.refusal,         // { reason } | undefined
  humanReviewRequired:  p.alignment.humanReviewRequired,
  modelVersion:         p.process.model.version,
  systemPromptHash:     p.process.systemPrompt.hash,
}));

// Og bygger tidsserier, distribusjoner, alarmer over disse.
// Ingen brukerdata, ingen content — bare alignment- og process-metadata.`}
        />

        <SectionHeading>{isEn ? "What Risk produces (article 9 requirement-by-requirement)" : "Hva Risk produserer (artikkel 9 krav-for-krav)"}</SectionHeading>

        <div className="grid md:grid-cols-2 gap-3 not-prose">
          <RiskCapability
            articleRef="9 (2) (a)"
            title="Identification of known/foreseeable risks"
            desc={isEn
              ? "Live distribution over flags[], uncertainty[].severity and humanReviewRequired. Trends visible in real time."
              : "Live distribusjon over flags[], uncertainty[].severity og humanReviewRequired. Trender synlig i sanntid."}
          />
          <RiskCapability
            articleRef="9 (2) (b)"
            title="Estimation/evaluation of risks"
            desc={isEn
              ? "Deterministic rules over alignment metadata. Probability × consequence per policy.id and policy.version."
              : "Deterministiske regler over alignment-metadata. Sannsynlighet × konsekvens per policy.id og policy.version."}
          />
          <RiskCapability
            articleRef="9 (2) (c)"
            title="Evaluation of other risks from data"
            desc={isEn
              ? "Drift detection: does the flag/uncertainty distribution shift after a model or systemPrompt change (bound to process.model.version + systemPrompt.hash)?"
              : "Drift-deteksjon: endrer flag-/uncertainty-distribusjonen seg etter modell- eller systemPrompt-bytte (binder til process.model.version + systemPrompt.hash)?"}
          />
          <RiskCapability
            articleRef="9 (2) (d)"
            title="Targeted risk management measures"
            desc={isEn
              ? "Alerting rules per domain/risk level. Webhook to compliance officer on threshold breach."
              : "Alerting-regler per domene/risikonivå. Webhook til compliance officer ved terskelbrudd."}
          />
          <RiskCapability
            articleRef="9 (4)"
            title="Eliminate or reduce identified risks"
            desc={isEn
              ? "Risk assessments are logged in the same ledger. Mitigations are tracked from identification to closure."
              : "Risikovurderinger loggføres i samme ledger. Mitigations spores fra identifisering til lukking."}
          />
          <RiskCapability
            articleRef="9 (8)"
            title="Testing throughout development"
            desc={isEn
              ? "Testing envelopes are marked with pipeline: 'evaluation'. Results are aggregated automatically."
              : "Testing-envelopes markeres med pipeline: 'evaluation'. Resultater aggregeres automatisk."}
          />
        </div>

        <SectionHeading>{isEn ? "Example: bias drift alarm" : "Eksempel: bias-drift-alarm"}</SectionHeading>
        <Prose>
          <p>
            {isEn ? (
              <>
                Scenario: You have a chat AI for recruitment (high-risk category Annex III pt. 4). After a
                model swap in March you suddenly notice that the share of envelopes with{" "}
                <code>flags: [&quot;candidate-screening-edge&quot;]</code> has gone from 4 % to 12 % — for one
                particular policy version.
              </>
            ) : (
              <>
                Scenario: Du har en chat-AI for rekruttering (høyrisiko-kategori Annex III pkt. 4). Etter et
                modellbytte i mars ser du plutselig at andelen envelopes med{" "}
                <code>flags: [&quot;candidate-screening-edge&quot;]</code> har gått fra 4 % til 12 % — for én bestemt
                policy-versjon.
              </>
            )}
          </p>
          <p>
            {isEn
              ? "Without the Risk module: nobody notices until someone complains and you end up with a supervisory case."
              : "Uten Risk-modulen: ingen oppdager det før noen klager og dere får en tilsynssak."}
          </p>
          <p>
            {isEn ? (
              <>
                With Risk: the alarm webhook fires after 48 hours. &quot;Flag rate for{" "}
                <code>flags.code=candidate-screening-edge</code> has risen &gt;2 standard deviations since{" "}
                <code>process.model.version</code> changed on 2026-03-14. Recommend review.&quot;
              </>
            ) : (
              <>
                Med Risk: alarm-webhook utløses etter 48 timer. &quot;Flag-rate for{" "}
                <code>flags.code=candidate-screening-edge</code> har økt &gt;2 standardavvik siden{" "}
                <code>process.model.version</code> endret seg 2026-03-14. Anbefaler review.&quot;
              </>
            )}
          </p>
        </Prose>

        <EvidenceBlock
          label={isEn
            ? "Alarm rule (deterministic JSON DSL — no eval, no scripting)"
            : "Alarm-regel (deterministisk JSON-DSL — ingen eval, ingen scripting)"}
          lang="json"
          code={`{
  "name": "flag_rate_candidate_screening",
  "trigger": {
    "filter": {
      "and": [
        { "eq": ["alignment.policy.id", "hr-screening"] },
        { "contains": ["alignment.flags[].code", "candidate-screening-edge"] }
      ]
    },
    "method": "rolling_rate",
    "windowDays": 14,
    "threshold": { "type": "std_deviation", "multiplier": 2 }
  },
  "severity": "high",
  "webhooks": [
    { "url": "https://hooks.slack.com/...", "auth": "hmac-sha256" },
    { "url": "https://jira.corp.com/api/issue", "auth": "hmac-sha256" }
  ],
  "slaHours": 24
}`}
        />
      </TspSolutionBlock>

      <DeploymentExample>
        <p>
          {isEn
            ? "A pilot deployment runs an internal TSP Risk instance that monitors all envelopes written by the deployment ledger. The most important alert rules:"
            : "En pilot-deployment har en intern TSP Risk-instans som overvåker alle envelopes skrevet av deployment-ledgeren. Viktigste alert-regler:"}
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <strong>{isEn ? "Refusal without human review:" : "Refusal uten human review:"}</strong>{" "}
            {isEn ? (
              <>Alarm if <code>alignment.refusal</code> is set and <code>humanReviewRequired=false</code> — should never happen for the welfare policy.</>
            ) : (
              <>Alarm hvis <code>alignment.refusal</code> er satt og <code>humanReviewRequired=false</code> — bør aldri skje for welfare-policy.</>
            )}
          </li>
          <li>
            <strong>{isEn ? "Source absence:" : "Kilde-fravær:"}</strong>{" "}
            {isEn ? (
              <>Alarm if the share of envelopes with <code>declaration.primarySource.provided=false</code> rises above the policy threshold.</>
            ) : (
              <>Alarm hvis andelen envelopes med <code>declaration.primarySource.provided=false</code> stiger over policy-terskel.</>
            )}
          </li>
          <li>
            <strong>{isEn ? "SystemPrompt change:" : "SystemPrompt-endring:"}</strong>{" "}
            {isEn ? (
              <>Alarm when new <code>process.systemPrompt.hash</code> values appear in production — catches unintended prompt changes in CI/CD.</>
            ) : (
              <>Alarm når nye <code>process.systemPrompt.hash</code>-verdier dukker opp i produksjon — fanger utilsiktede prompt-endringer i CI/CD.</>
            )}
          </li>
          <li>
            <strong>{isEn ? "Policy mismatch:" : "Policy-mismatch:"}</strong>{" "}
            {isEn ? (
              <>Alarm if <code>alignment.policy.id</code> does not match the expected domain — welfare envelopes with <code>policy.id=general</code> signal a routing error.</>
            ) : (
              <>Alarm hvis <code>alignment.policy.id</code> ikke matcher forventet domene — welfare-envelopes med <code>policy.id=general</code> er et signal på feil ruting.</>
            )}
          </li>
        </ul>
        <p>
          {isEn
            ? "All alerts land in a dedicated Slack channel and in the monthly report that is generated automatically for the LexiCo board."
            : "Alle alerts havner i en dedikert Slack-kanal og i månedsrapporten som genereres automatisk for LexiCo-styret."}
        </p>
      </DeploymentExample>

      <section className="space-y-3">
        <SectionHeading>{isEn ? "Covered by TSP Risk" : "Dekkes av TSP Risk"}</SectionHeading>
        <CoverageNote type="covered" title="Continuous iterative process (9 (2))">
          {isEn
            ? <>The Risk module monitors the ledger in real time. &quot;Continuous&quot; is the default, not a peculiarity.</>
            : <>Risk-modulen overvåker ledger i sanntid. &quot;Kontinuerlig&quot; er default, ikke en særegenhet.</>}
        </CoverageNote>
        <CoverageNote type="covered" title="Identification of risks (9 (2) (a))">
          {isEn ? (
            <>Structured fields (<code>flags[]</code>, <code>uncertainty[]</code>, <code>policy</code>) from Core become risk categories directly.</>
          ) : (
            <>Strukturerte felter (<code>flags[]</code>, <code>uncertainty[]</code>, <code>policy</code>) fra Core blir direkte risiko-kategorier.</>
          )}
        </CoverageNote>
        <CoverageNote type="covered" title="Evaluation/estimation (9 (2) (b))">
          {isEn
            ? "Distributions, time series, Bayesian estimation over ledger history."
            : "Distribusjoner, tidsserier, bayesiansk estimering over ledger-historikk."}
        </CoverageNote>
        <CoverageNote type="covered" title="Mitigation measures (9 (2) (d))">
          {isEn
            ? "Alerting + webhook-to-action closes the loop between detection and mitigation."
            : "Alerting + webhook-til-action lukker loopen mellom deteksjon og mitigation."}
        </CoverageNote>
        <CoverageNote type="partial" title="Documentation (9 (2) (a-e))">
          {isEn ? (
            <>TSP Risk exports monthly reports, but the <em>risk management plan</em> document itself is an organisational task. TSP Evidence has templates — they must be filled in by humans.</>
          ) : (
            <>TSP Risk eksporterer månedsrapporter, men selve <em>risk management plan</em>-dokumentet er en organisatorisk oppgave. TSP Evidence har maler — de må fylles ut av mennesker.</>
          )}
        </CoverageNote>
        <CoverageNote type="not-covered" title="Adopted risk management decisions">
          {isEn ? (
            <>That somebody <em>acts</em> on the alerts — that meetings are held, that mitigations are implemented, that responsibility is assigned — is organisational. Risk can prove that an alert was sent. Not that anyone took it seriously.</>
          ) : (
            <>At noen <em>handler</em> på varslene — at møter holdes, at mitigations implementeres, at ansvaret plasseres — er organisatorisk. Risk kan bevise at varsel ble sendt. Ikke at noen tok det på alvor.</>
          )}
        </CoverageNote>
        <CoverageNote type="not-covered" title="Specific measures for children/vulnerable groups (9 (9))">
          {isEn
            ? "Requires domain-specific expertise. TSP structures the data; the assessment is done by humans."
            : "Krever domene-spesifikk ekspertise. TSP strukturerer dataene; vurderingen gjøres av mennesker."}
        </CoverageNote>
      </section>
    </ArticleLayout>
  );
}

function RiskCapability({
  articleRef,
  title,
  desc,
}: {
  articleRef: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4 bg-white">
      <div className="tsp-pill border-brand/30 bg-brand/5 text-brand text-xxxs mb-2">{articleRef}</div>
      <div className="font-semibold text-sm mb-1">{title}</div>
      <div className="text-xs text-muted leading-relaxed">{desc}</div>
    </div>
  );
}
