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
      ? "EU AI Act Art. 13 — Transparency · TSP"
      : "EU AI Act Art. 13 — Transparency · TSP",
    description: isEn
      ? "TSP Core + Oversight delivers transparency data as envelope fields and UI components."
      : "TSP Core + Oversight leverer transparency-data som envelope-felter og UI-komponenter.",
  };
}

const CODE = `// (i)  Identity of provider
envelope.process.model.name           // → "normistral"
envelope.process.model.version        // → "11b-warm-3-2026q1"
envelope.process.model.provider       // → "norwai-local"

// (ii) Characteristics, capabilities, limitations
envelope.alignment.uncertainty        // → strukturert: { field, reason, severity }
envelope.alignment.policy             // → { id, version } — hvilken policy var aktiv

// (iii) Circumstances that may lead to risk
envelope.alignment.flags              // → [{ code: "high-stakes" }, { code: "irreversible" }]
envelope.alignment.humanReviewRequired // → true når menneske må verifisere
envelope.alignment.refusal            // → { reason } hvis modellen avslo

// (iv) Performance on specific persons/groups
//      (Risk-modulen aggregerer på envelope-nivå, aldri på bruker)
envelope.alignment.flags              // → kategoriske domene-/risiko-tags

// (v) Input data characteristics
envelope.declaration.primarySource    // → { provided: true, type, url, title, retrieved }
                                       //   eller { provided: false, reason: "no-source-needed" | ... }
envelope.declaration.citations        // → strukturerte paragraf-referanser

// (vi) Expected lifetime and maintenance
envelope.tsp                          // → "3.0" — spec-versjon
envelope.timestamp.claimed            // → ISO-8601 fra RFC 3161 TSA
envelope.timestamp.tsaUrl             // → hvilken TSA stemplet`;

export default async function Article13Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <ArticleLayout
      articleSlug="article-13"
      articleNumber="13"
      articleTitle={isEn ? "Transparency — the user must understand the system" : "Transparency — brukeren skal forstå systemet"}
      tspCoverage="Core + Oversight"
      coveragePercent={90}
    >
      <ArticleIntro>
        {isEn ? (
          <>
            Article 13 says that high-risk AI systems shall be sufficiently transparent so that the deployer
            can interpret the output and use it correctly. TSP splits this in two: <strong>data</strong> is
            delivered by Core (structured transparency info in every envelope), and <strong>UI</strong> is
            delivered by Oversight (TrustBadge, TrustModal, confidence levels).
          </>
        ) : (
          <>
            Artikkel 13 sier at høyrisiko-AI-systemer skal være tilstrekkelig transparente til at brukeren kan
            tolke outputen og bruke den riktig. TSP deler dette i to: <strong>data</strong> leveres av Core
            (strukturert transparency-info i hver envelope), og <strong>UI</strong> leveres av Oversight
            (TrustBadge, TrustModal, confidens-nivåer).
          </>
        )}
      </ArticleIntro>

      <RequirementBlock
        articleRef="Art. 13 (1)"
        title={isEn ? "The legal text" : "Lovteksten"}
        quote="High-risk AI systems shall be designed and developed in such a way as to ensure that their operation is sufficiently transparent to enable deployers to interpret the system's output and use it appropriately. An appropriate type and degree of transparency shall be ensured with a view to achieving compliance with the relevant obligations of the provider and deployer set out in Section 3."
      />

      <TspSolutionBlock
        module="Core"
        moduleHref="/core"
        summary={isEn
          ? "Core delivers structured transparency metadata as part of every Trust Envelope. Not in a separate file no one reads — but in the runtime response itself."
          : "Core leverer strukturert transparency-metadata som en del av hver Trust Envelope. Ikke i en separat fil som ingen leser — men i selve runtime-responsen."}
      >
        <Prose>
          <p>
            {isEn
              ? <>Article 13 (3) (b) specifies six sub-points about what the user must be informed of: the system&apos;s
                 purpose, accuracy level, known or foreseeable risks, input-data characteristics, and more. TSP
                 maps each of these to a concrete field:</>
              : <>Artikkel 13 (3) (b) spesifiserer seks underpunkter om hva brukeren skal informeres om: systemets
                 formål, nøyaktighetsgrad, kjente eller forutsigbare risikoer, input-data-egenskaper, og mer. TSP
                 mapper hvert av disse til et konkret felt:</>}
          </p>
        </Prose>

        <EvidenceBlock
          label="Art. 13 (3) (b) ↔ envelope-felter"
          lang="typescript"
          code={CODE}
        />
      </TspSolutionBlock>

      <TspSolutionBlock
        module="Oversight"
        moduleHref="/oversight"
        summary={isEn
          ? "The Oversight module presents the transparency data to the end user — in natural language, with visual hierarchy, not as technical fields."
          : "Oversight-modulen presenterer transparency-dataene til sluttbrukeren — i naturlig språk, med visuell hierarki, ikke som tekniske felter."}
      >
        <Prose>
          <p>
            {isEn ? (
              <>
                Raw JSON is not transparency for an ordinary user. Transparency means a citizen understanding{" "}
                <em>&quot;you can rely on this answer&quot;</em> or <em>&quot;double-check this with a caseworker&quot;</em>.
                Oversight translates envelope fields into actionable language.
              </>
            ) : (
              <>
                Rå JSON er ikke transparency for en vanlig bruker. Transparency er at en NAV-klient forstår{" "}
                <em>&quot;du kan stole på dette svaret&quot;</em> eller <em>&quot;dobbeltsjekk dette med en saksbehandler&quot;</em>.
                Oversight oversetter envelope-felter til handlingsrettet språk.
              </>
            )}
          </p>
        </Prose>

        <SectionHeading>{isEn ? "TrustBadge — five status categories" : "TrustBadge-komponenten — fem status-kategorier"}</SectionHeading>
        <Prose>
          <p className="text-sm">
            {isEn ? (
              <>
                v3 has no continuous confidence score. Status is categorical and derived deterministically
                from the envelope fields <code>alignment.refusal</code>, <code>alignment.flags</code>,{" "}
                <code>alignment.policy</code> and <code>alignment.humanReviewRequired</code>.
              </>
            ) : (
              <>
                v3 har ingen kontinuerlig konfidens-score. Status er kategorisk og utledes deterministisk
                fra envelope-feltene <code>alignment.refusal</code>, <code>alignment.flags</code>,{" "}
                <code>alignment.policy</code> og <code>alignment.humanReviewRequired</code>.
              </>
            )}
          </p>
        </Prose>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="border border-verify p-4 bg-verify/5">
            <div className="tsp-eyebrow text-verify mb-1">verified</div>
            <div className="font-semibold mb-0.5">{isEn ? "Signed & no flags" : "Signert & uten flagg"}</div>
            <div className="text-xs text-muted">{isEn ? "All ten verifyLocal checks green, no flags or refusal." : "Alle ti verifyLocal-sjekker grønne, ingen flags eller refusal."}</div>
          </div>
          <div className="border border-warn p-4 bg-warn/5">
            <div className="tsp-eyebrow text-warn mb-1">flagged</div>
            <div className="font-semibold mb-0.5">{isEn ? "Structured flags" : "Strukturerte flagg"}</div>
            <div className="text-xs text-muted">
              {isEn ? <><code>alignment.flags[]</code> contains entries — show which ones to the user.</> : <><code>alignment.flags[]</code> har innslag — vis hvilke for brukeren.</>}
            </div>
          </div>
          <div className="border border-warn p-4 bg-warn/5">
            <div className="tsp-eyebrow text-warn mb-1">refusal</div>
            <div className="font-semibold mb-0.5">{isEn ? "The model refused" : "Modellen avslo"}</div>
            <div className="text-xs text-muted">
              {isEn ? <><code>alignment.refusal.reason</code> communicated in natural language.</> : <><code>alignment.refusal.reason</code> kommunisert på naturlig språk.</>}
            </div>
          </div>
          <div className="border border-danger p-4 bg-danger/5">
            <div className="tsp-eyebrow text-danger mb-1">policy-blocked</div>
            <div className="font-semibold mb-0.5">{isEn ? "Policy rejected output" : "Policy avviste output"}</div>
            <div className="text-xs text-muted">{isEn ? "Shown to the user with policy id and version." : "Vises for brukeren med policy-id og -versjon."}</div>
          </div>
        </div>

        <SectionHeading>{isEn ? "TrustModal — the six art. 13 (3) (b) points" : "TrustModal — de seks art. 13 (3) (b)-punktene"}</SectionHeading>
        <Prose>
          <p>
            {isEn ? (
              <>
                When the user clicks TrustBadge, TrustModal opens with all six points translated into plain
                language: <em>&quot;Source: Lovdata&quot;</em>, <em>&quot;Legal basis used: Ftrl. § 11-5&quot;</em>,{" "}
                <em>&quot;Auto-double-checked&quot;</em>. Nothing is hidden, but nothing overwhelms either.
              </>
            ) : (
              <>
                Når brukeren klikker TrustBadge, åpnes TrustModal med alle seks punktene oversatt til norsk,
                naturlig språk: <em>&quot;Kilde: Lovdata&quot;</em>, <em>&quot;Lovhjemler som er brukt: Ftrl. § 11-5&quot;</em>,{" "}
                <em>&quot;Dobbeltsjekket automatisk&quot;</em>. Ingenting skjules, men ingenting overvelder heller.
              </>
            )}
          </p>
        </Prose>
      </TspSolutionBlock>

      <DeploymentExample>
        <p>
          {isEn
            ? "A TrustBadge-based deployment can show the badge next to every AI answer. Clicking the badge opens TrustModal which explains:"
            : "En TrustBadge-basert deployment kan vise badge-en ved siden av hvert AI-svar. Klikk på badge-en åpner TrustModal som forklarer:"}
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>{isEn ? "Source:" : "Kilde:"}</strong> {isEn ? "Lovdata / NAV.no / Public Administration Act" : "Lovdata / NAV.no / forvaltningsloven"}</li>
          <li><strong>{isEn ? "Legal basis used:" : "Lovhjemler brukt:"}</strong> {isEn ? "Ftrl. § 11-5 (linked to Lovdata)" : "Ftrl. § 11-5 (lenket til Lovdata)"}</li>
          <li><strong>{isEn ? "Double-checked:" : "Dobbeltsjekket:"}</strong> {isEn ? "hash, timestamp, audit trail" : "hash, tidspunkt, revisjonsspor"}</li>
          <li><strong>{isEn ? "What you should do now:" : "Hva du bør gjøre nå:"}</strong> {isEn ? "concrete advice based on status category and flags" : "konkret råd basert på status-kategori og flags"}</li>
        </ul>
        <p>
          {isEn ? (
            <>This isn&apos;t technical jargon. It&apos;s one plain sentence per point, at LIX-level 8. It is{" "}
              <em>usable</em> transparency, not just documentation text.</>
          ) : (
            <>Dette er ikke teknisk jargon. Det er en norsk setning per punkt, på nivå 8 i LIX-skalaen. Det
              er <em>brukbar</em> transparency, ikke bare dokumentasjonstekst.</>
          )}
        </p>
      </DeploymentExample>

      <section className="space-y-3">
        <SectionHeading>{isEn ? "Covered by TSP (Core + Oversight)" : "Dekkes av TSP (Core + Oversight)"}</SectionHeading>
        <CoverageNote type="covered" title={isEn ? "Identity of provider / system" : "Identity of provider / system"}>
          {isEn ? (
            <>Explicit in <code>process.model.&#123;name,version,provider&#125;</code> and{" "}
            <code>process.pipeline[]</code>.</>
          ) : (
            <>Eksplisitt i <code>process.model.&#123;name,version,provider&#125;</code> og{" "}
            <code>process.pipeline[]</code>.</>
          )}
        </CoverageNote>
        <CoverageNote type="covered" title={isEn ? "Characteristics, capabilities, limitations" : "Characteristics, capabilities, limitations"}>
          {isEn ? (
            <><code>alignment.uncertainty[]</code> + <code>alignment.policy</code> communicate
            structured uncertainty per answer — not an aggregated score.</>
          ) : (
            <><code>alignment.uncertainty[]</code> + <code>alignment.policy</code> kommuniserer
            strukturert usikkerhet per svar — ikke en aggregert score.</>
          )}
        </CoverageNote>
        <CoverageNote type="covered" title={isEn ? "Risk circumstances" : "Risk circumstances"}>
          <code>alignment.flags[]</code> + <code>alignment.humanReviewRequired</code> +{" "}
          <code>alignment.refusal</code>.
        </CoverageNote>
        <CoverageNote type="covered" title={isEn ? "Input data characteristics" : "Input data characteristics"}>
          <code>declaration.primarySource</code> ({isEn ? "explicit-declaration union" : "eksplisitt-deklarasjons-union"}) +{" "}
          <code>declaration.citations[]</code>.
        </CoverageNote>
        <CoverageNote type="partial" title={isEn ? "Instructions of use / documentation" : "Instructions of use / documentation"}>
          {isEn
            ? <>TSP delivers per-answer data. Overall instructions for use (Art. 13 (3) (c–f)) must still be
               produced by the deployer — but can be auto-generated from aggregated envelope data.</>
            : <>TSP leverer per-svar-data. Overordnede bruksinstrukser (Art. 13 (3) (c–f)) må fortsatt
               produseres av deployer — men kan auto-genereres fra aggregert envelope-data.</>}
        </CoverageNote>
      </section>
    </ArticleLayout>
  );
}
