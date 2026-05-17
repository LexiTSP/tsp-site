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
      ? "EU AI Act Art. 14 — Human oversight · TSP"
      : "EU AI Act Art. 14 — Human oversight · TSP",
    description: isEn
      ? "TSP Oversight delivers components, reviewer queue, and escalation workflows for Art. 14 human oversight."
      : "TSP Oversight leverer komponenter, reviewer queue, og escalation-workflows for art. 14 menneskelig tilsyn.",
  };
}

export default async function Article14Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <ArticleLayout
      articleSlug="article-14"
      articleNumber="14"
      articleTitle={isEn ? "Human oversight — a human with the real ability to intervene" : "Human oversight — menneske med reell evne til å gripe inn"}
      tspCoverage="Oversight"
      coveragePercent={75}
    >
      <ArticleIntro>
        {isEn ? (
          <>
            Article 14 is the most subtle of the technical articles. It is not just about a human
            &quot;being able to see&quot; output — it is about the human having actual tools to{" "}
            <strong>understand</strong>, <strong>override</strong> and <strong>halt</strong> the system.
            TSP Oversight gives you the infrastructure; your organisation provides the human.
          </>
        ) : (
          <>
            Artikkel 14 er den mest subtile av de tekniske artiklene. Den handler ikke bare om at et menneske
            &quot;kan se&quot; output — det handler om at mennesket har faktiske verktøy for å <strong>forstå</strong>,{" "}
            <strong>overprøve</strong> og <strong>stanse</strong> systemet. TSP Oversight gir deg
            infrastrukturen; din organisasjon gir mennesket.
          </>
        )}
      </ArticleIntro>

      <RequirementBlock
        articleRef="Art. 14 (1)"
        title={isEn ? "The legal text" : "Lovteksten"}
        quote="High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which they are in use. Human oversight shall aim at preventing or minimising the risks to health, safety or fundamental rights."
      />

      <TspSolutionBlock
        module="Oversight"
        moduleHref="/oversight"
        summary={isEn
          ? "TSP Oversight delivers four components: signalling, reviewer queue, escalation flow, and override log. Together they form a complete human-in-the-loop system."
          : "TSP Oversight leverer fire komponenter: signalering, vurderingskø, eskaleringsflyt, og overstyringslogg. Sammen utgjør de et ferdig human-in-the-loop-system."}
      >
        <SectionHeading>{isEn ? "Signalling — the AI says when it needs help" : "Signalering — AI-en sier fra når den trenger hjelp"}</SectionHeading>
        <Prose>
          <p>
            {isEn ? (
              <>
                The envelope field <code>alignment.humanReviewRequired</code> is a first-class part of the spec.
                It is not a comment or a warning indicator — it is a boolean that routes directly to a
                reviewer queue.
              </>
            ) : (
              <>
                Envelope-feltet <code>alignment.humanReviewRequired</code> er en førsteklasses del av spec-en.
                Det er ikke en kommentar eller et varselsignal — det er en boolean som direkte rutes til en
                reviewer queue.
              </>
            )}
          </p>
          <p>
            {isEn ? "The flag is set automatically when:" : "Flagget settes automatisk når:"}
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><code>alignment.refusal</code> {isEn ? "is set (the model refused)" : "er satt (modellen avslo)"}</li>
            <li><code>alignment.flags[]</code> {isEn ? <>contains categorical risk tags such as <code>&quot;irreversible&quot;</code> or <code>&quot;high-stakes&quot;</code></> : <>inneholder kategoriske risiko-tags som <code>&quot;irreversible&quot;</code> eller <code>&quot;high-stakes&quot;</code></>}</li>
            <li><code>alignment.uncertainty[]</code> {isEn ? <>has <code>severity: &quot;high&quot;</code> on a central field</> : <>har <code>severity: &quot;high&quot;</code> på et sentralt felt</>}</li>
            <li>{isEn ? <>The Risk module has triggered an alarm (customer-written deterministic rules — <em>not</em> AI-suggested routing)</> : <>Risk-modulen har trigget en alarm (kunde-skrevne deterministiske regler — <em>ikke</em> AI-foreslått ruting)</>}</li>
          </ul>
          <p>
            {isEn
              ? "The rules can be overridden by the deployer, but the defaults are designed to fail on the safe side."
              : "Reglene kan overstyres av deployer, men defaultene er designet for å feile på sikre siden."}
          </p>
        </Prose>

        <SectionHeading>{isEn ? "Reviewer Queue — where AI answers needing a human end up" : "Reviewer Queue — der AI-svar som trenger menneske havner"}</SectionHeading>
        <EvidenceBlock
          label={isEn ? "Reviewer Queue workflow (typical setup)" : "Reviewer Queue workflow (typisk oppsett)"}
          lang="typescript"
          code={`// 1. Envelope generated med humanReviewRequired: true
import { wrap } from "@lexitsp/sdk/v3";
const envelope = await wrap(input, {
  signer, declaration, process,
  alignment: {
    uncertainty: [{ field: "declaration.primarySource",
                    reason: "below-policy-threshold", severity: "high" }],
    flags: [{ code: "high-stakes" }],
    policy: { id: "welfare", version: "2.1" },
    humanReviewRequired: true,        // ← denne
  },
  prevHash, tsaUrls,
});

// 2. Oversight oppretter ReviewItem — server holder aldri
//    reviewer-keys og gir aldri AI-foreslåtte forslag.
POST /v1/items  (Bearer customer-token)
{
  "envelopeId": "01HF8K3E5Q...",
  "assignedTeam": "welfare-reviewers",
  "priority": "high",
  "slaMinutes": 60
}

// 3. Reviewer åpner portal, ser:
//    - envelope-innhold + alignment-flags som trigget køen
//    - declaration.citations[] (lovhjemler)
//    - tre valg: approved / approved-with-concerns / rejected
//
// 4. Reviewer signerer client-side med WebCrypto (extractable=false).
//    Output er en ReviewEnvelope (tsp-review-1.0) som binder dommen
//    til opprinnelig contentHash.`}
        />

        <SectionHeading>{isEn ? "Override log" : "Overstyrings-logg"}</SectionHeading>
        <Prose>
          <p>
            {isEn ? (
              <>
                When a human overrides the AI, <em>this is recorded in the same ledger</em>. An auditor sees
                not just the AI response — they see that &quot;AI proposed X, reviewer Lisa rejected, changed to Y,
                at 14:32&quot;. Responsibility is traceable. The chain remains intact.
              </>
            ) : (
              <>
                Når et menneske overstyrer AI-en, <em>registreres dette i samme ledger</em>. En auditor ser
                ikke bare AI-responsen — de ser at &quot;AI foreslo X, reviewer Lisa avviste, endret til Y, klokka
                14:32&quot;. Ansvaret er sporbart. Kjeden er intakt.
              </>
            )}
          </p>
        </Prose>

        <EvidenceBlock
          label="ReviewEnvelope (tsp-review-1.0)"
          lang="json"
          code={`{
  "kind": "tsp-review-1.0",
  "targetEnvelopeId": "01HF8K3E5Q7M...",
  "targetContentHash": "a3f8...d91c",
  "verdict": "approved-with-concerns",
  "tags": ["welfare-eligibility-edge"],
  "rationale": "Bruker har dokumentert nedsatt arbeidsevne, men §11-5...",
  "reviewer": {
    "keyRef": "https://nav.no/.well-known/tsp-manifest.json#reviewer-lh-1",
    "role": "human-reviewer"
  },
  "decidedAt": "2026-04-22T14:32:18Z",
  "signature": {
    "algorithm": "ed25519",
    "value": "MEUCIQDx7..."          // signert client-side, server holder aldri privatekey
  }
}`}
        />
      </TspSolutionBlock>

      <DeploymentExample>
        <p>
          {isEn ? (
            <>
              A deployment can route envelopes with <code>humanReviewRequired: true</code> to a review
              queue staffed by the customer&apos;s own reviewers. Typical triggers include a high-stakes
              domain, missing source confidence, refusal metadata, or structured uncertainty on a central field.
            </>
          ) : (
            <>
              En deployment kan rute envelope-er med <code>humanReviewRequired: true</code> til en
              gjennomgangskø bemannet av kundens egne reviewers. Typiske triggere er high-stakes domene,
              manglende kildekonfidens, refusal-metadata eller strukturert usikkerhet på et sentralt felt.
            </>
          )}
        </p>
        <p>
          {isEn
            ? "The important property is not the review rate. It is that approved, edited, and rejected outcomes become signed review evidence tied to the original envelope hash."
            : "Det viktige er ikke review-raten. Det viktige er at godkjente, redigerte og avviste utfall blir signert review-bevis bundet til den opprinnelige envelope-hashen."}
        </p>
        <p>
          {isEn ? (
            <>
              The whole trail can be visible in <ExternalRef href="https://example.com/ledger">a deployment transparency log</ExternalRef> —
              both the AI proposal and the human override decision.
            </>
          ) : (
            <>
              Hele dette sporet kan vises i <ExternalRef href="https://example.com/ledger">en deployment-åpenhetslogg</ExternalRef> —
              både AI-forslaget og det menneskelige overstyringsvedtaket.
            </>
          )}
        </p>
      </DeploymentExample>

      <section className="space-y-3">
        <SectionHeading>{isEn ? "Covered by TSP Oversight" : "Dekkes av TSP Oversight"}</SectionHeading>
        <CoverageNote type="covered" title="Human-machine interface tools (14 (1))">
          {isEn
            ? "TrustBadge, TrustModal, ReviewerQueue, OverrideInterface — four components, all available as React/Vue drop-ins."
            : "TrustBadge, TrustModal, ReviewerQueue, OverrideInterface — fire komponenter, alle som React/Vue-drop-ins."}
        </CoverageNote>
        <CoverageNote type="covered" title="Interpreting the output correctly (14 (4) (a))">
          {isEn
            ? "Transparency data from Core is rendered with Oversight. Confidence level becomes actionable language."
            : "Transparens-data fra Core rendres med Oversight. Confidence-nivå blir handlingsrettet språk."}
        </CoverageNote>
        <CoverageNote type="covered" title="Aware of automation bias (14 (4) (b))">
          {isEn ? (
            <>TrustBadge <em>can</em> show &quot;double-check this&quot; as an active interrupt — not just passive info.</>
          ) : (
            <>TrustBadge <em>kan</em> vise &quot;dobbeltsjekk dette&quot; som en aktiv interrupt — ikke bare passiv info.</>
          )}
        </CoverageNote>
        <CoverageNote type="covered" title="Override / disregard the output (14 (4) (d))">
          {isEn
            ? "Override functionality is built in. All overrides are signed and added to the same chain."
            : "Override-funksjonaliteten er bygd inn. Alle overstyringer blir signert og lagt i samme kjede."}
        </CoverageNote>
        <CoverageNote type="partial" title="Stop-button (14 (4) (e))">
          {isEn ? (
            <>TSP delivers a technical stop primitive (kill-switch API). The <em>process</em> for when the
            button is pressed and who is allowed to press it is organisational.</>
          ) : (
            <>TSP leverer teknisk stop-primitiv (kill-switch-API). Selve <em>prosessen</em> for når knappen
            trykkes og hvem som har lov til det er organisatorisk.</>
          )}
        </CoverageNote>
        <CoverageNote type="not-covered" title="Selection of oversight measures (14 (3))">
          {isEn
            ? "The choice between \"real-time oversight\" vs \"post-hoc review\" vs \"statistical sampling\" is an organisational risk assessment. TSP supports all three models, but you must choose which one fits your deployment."
            : "Valget mellom \"real-time oversight\" vs \"post-hoc review\" vs \"statistical sampling\" er en organisatorisk risikovurdering. TSP støtter alle tre modeller, men du må selv velge hvilken som passer din deployment."}
        </CoverageNote>
        <CoverageNote type="not-covered" title="Competent and trained personnel">
          {isEn ? (
            <>That the human is actually <em>qualified</em> for the task is HR and training, not software.</>
          ) : (
            <>At mennesket faktisk er <em>kvalifisert</em> for oppgaven er HR og opplæring, ikke software.</>
          )}
        </CoverageNote>
      </section>
    </ArticleLayout>
  );
}
