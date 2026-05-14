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
      ? "EU AI Act Art. 15 — Accuracy & robustness · TSP"
      : "EU AI Act Art. 15 — Accuracy & robustness · TSP",
    description: isEn
      ? "TSP Core implements article 15 via canonicalJson, SHA-256 and a verifiable scoring algorithm."
      : "TSP Core implementerer artikkel 15 via canonicalJson, SHA-256 og verifiserbar scoring-algoritme.",
  };
}

export default async function Article15Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <ArticleLayout
      articleSlug="article-15"
      articleNumber="15"
      articleTitle={isEn
        ? "Accuracy, robustness & cybersecurity — proven cryptographically"
        : "Accuracy, robustness & cybersecurity — bevist kryptografisk"}
      tspCoverage="Core"
      coveragePercent={85}
    >
      <ArticleIntro>
        {isEn ? (
          <>
            Article 15 requires high-risk AI systems to be accurate, robust and cyber-secure throughout their
            lifecycle. TSP Core&apos;s hash mechanism solves <strong>robustness against tampering</strong>{" "}
            (the cybersecurity part) completely. Accuracy is partially covered — via structured confidence
            scoring — but actual model performance requires separate evaluation.
          </>
        ) : (
          <>
            Artikkel 15 krever at høyrisiko-AI-systemer er nøyaktige, robuste og cyber-sikre gjennom hele sin
            livssyklus. TSP Core&apos;s hash-mekanisme løser <strong>robusthet mot tampering</strong> (cybersecurity-
            delen) fullstendig. Accuracy dekkes delvis — via strukturert konfidens-scoring — men faktisk
            modell-ytelse krever separat evaluering.
          </>
        )}
      </ArticleIntro>

      <RequirementBlock
        articleRef="Art. 15 (1)"
        title={isEn ? "The legal text" : "Lovteksten"}
        quote="High-risk AI systems shall be designed and developed in such a way that they achieve an appropriate level of accuracy, robustness and cybersecurity, and that they perform consistently in those respects throughout their lifecycle."
      />

      <TspSolutionBlock
        module="Core"
        moduleHref="/core"
        summary={isEn
          ? "TSP v3.0 delivers three technical guarantees: structured fields (accuracy as measurable, not aggregated), Ed25519+RFC 3161 (robustness/non-repudiation), and hash chain + manifest PKI (cybersecurity)."
          : "TSP v3.0 leverer tre tekniske garantier: strukturerte felter (accuracy som målbar, ikke aggregert), Ed25519+RFC 3161 (robustness/non-repudiation), og hash-kjede + manifest-PKI (cybersecurity)."}
      >
        <SectionHeading>{isEn ? "1. Accuracy — structured, verifiable per response" : "1. Accuracy — strukturert, verifiserbar per-respons"}</SectionHeading>
        <Prose>
          <p>
            {isEn ? (
              <>
                Article 15 (3) requires &ldquo;levels of accuracy&rdquo; to be declared in the instructions for use.
                TSP v3.0 does this per response through structured fields: <code>declaration.primarySource</code>{" "}
                (source declaration), <code>process.model</code> (process log), and <code>alignment.uncertainty</code>{" "}
                (structured uncertainty flags). It is not an aggregated confidence score — it is measurable
                fields an auditor can ask deterministic questions about.
              </>
            ) : (
              <>
                Artikkel 15 (3) krever at &ldquo;levels of accuracy&rdquo; skal deklareres i bruksanvisningen. TSP v3.0
                gjør dette per-respons gjennom strukturerte felter: <code>declaration.primarySource</code>{" "}
                (kilde-erklæring), <code>process.model</code> (prosess-logg), og <code>alignment.uncertainty</code>{" "}
                (strukturerte usikkerhets-flagg). Det er ikke en aggregert konfidens-score — det er målbare
                felter en revisor kan stille deterministiske spørsmål om.
              </>
            )}
          </p>
        </Prose>

        <EvidenceBlock
          label={isEn
            ? "The scoring algorithm — deterministic, verifiable, change-tracked"
            : "Scoring-algoritmen — deterministisk, verifiserbar, endrings-sporet"}
          lang="typescript"
          code={`// Konstant-vektede komponenter (spec'd i /spec)
const WEIGHTS = { source: 0.5, process: 0.3, alignment: 0.2 };

// Source type → iboende konfidens
const SOURCE_TYPE_SCORES = {
  "legal-database": 1.0,         // Lovdata, CaseLaw
  "government-website": 0.95,    // NAV.no, regjeringen.no
  "official-document": 0.9,      // PDF fra myndighet
  "academic-paper": 0.85,        // Fagfellevurdert
  "verified-website": 0.7,
  "model-knowledge": 0.6,
  "user-input": 0.5,
  "unknown": 0.3,
};

export function computeConfidenceScore(s, p, a) {
  const x =
    scoreSource(s) * WEIGHTS.source +
    scoreProcess(p) * WEIGHTS.process +
    scoreAlignment(a) * WEIGHTS.alignment;
  return Math.round(x * 100);  // 0-100
}`}
        />

        <Prose>
          <p>
            {isEn ? (
              <>
                <strong>Key property:</strong> the score is mathematically reproducible. Given the same envelope
                fields, any implementation produces the same score. That means an auditor can verify the TSP
                score was computed correctly — not trust that the provider hasn&apos;t &quot;adjusted&quot; the
                number after the fact.
              </>
            ) : (
              <>
                <strong>Nøkkel-egenskap:</strong> scoren er matematisk reproduserbar. Gitt samme envelope-felter,
                får enhver implementasjon samme score. Det betyr at en auditor kan verifisere at TSP-scoren ble
                beregnet riktig — ikke stole på at leverandøren ikke har &quot;justert&quot; tallet i etterkant.
              </>
            )}
          </p>
        </Prose>

        <SectionHeading>{isEn ? "2. Robustness — hash integrity through the entire chain" : "2. Robustness — hash-integritet gjennom hele kjeden"}</SectionHeading>
        <Prose>
          <p>
            {isEn ? (
              <>
                Robustness in the AI Act sense means the system gives consistent output under varying
                conditions. TSP&apos;s chain mechanism delivers a stronger version: <em>output cannot be altered
                after signing</em>, no matter what happens to the system.
              </>
            ) : (
              <>
                Robusthet i AI Act-forstand betyr at systemet gir konsistent output under varierende
                forhold. TSP&apos;s kjede-mekanisme gir en sterkere versjon: <em>output kan ikke endres etter
                signering</em>, uansett hva som skjer med systemet.
              </>
            )}
          </p>
          <p>
            {isEn ? (
              <>
                If a server crashes and the ledger file becomes corrupt — the hash break is visible. If a
                database is migrated — the hash break is visible. If someone with write access tries to
                &quot;fix&quot; an old answer — the hash break is visible.
              </>
            ) : (
              <>
                Hvis en server crasher og ledger-filen blir korrupt — hash-brudd synes. Hvis en database blir
                migrert — hash-brudd synes. Hvis noen med skrive-tilgang forsøker å &quot;fikse&quot; et gammelt svar —
                hash-brudd synes.
              </>
            )}
          </p>
        </Prose>

        <EvidenceBlock
          label={isEn ? "Chain verification = robustness proof" : "Kjede-verifikasjon = robusthet-bevis"}
          lang="typescript"
          code={`// En hvilken som helst auditor kan kjøre dette:
const result = await verifyEntireLedger();

if (result.valid) {
  // Hele kjeden er intakt. Ingen envelope er endret.
  // Alle hash-lenker matcher. Scoring kan reproduseres.
  // Dette er det art. 15 (1) kaller "consistent performance
  // throughout the lifecycle" — bevist matematisk.
} else {
  console.log({
    brokenAt: result.brokenAt,           // index i kjeden
    reason: result.reason,                // hash / score / chain
    firstInvalidEnvelopeId: result.id,
  });
}`}
        />

        <SectionHeading>{isEn ? "3. Cybersecurity — tamper evidence" : "3. Cybersecurity — tamper evidence"}</SectionHeading>
        <Prose>
          <p>
            {isEn ? (
              <>
                Article 15 (5) explicitly requires systems to be robust against unauthorised third-party
                attempts to alter use, output or performance. TSP&apos;s approach is not to prevent tampering
                (that is an infrastructure task, not a protocol task) — but to <strong>make tampering
                mathematically visible</strong>.
              </>
            ) : (
              <>
                Artikkel 15 (5) krever eksplisitt at systemer er robuste mot uautoriserte tredjeparters forsøk
                på å endre bruk, output eller ytelse. TSP&apos;s tilnærming er ikke å forhindre tampering (det er en
                infrastruktur-oppgave, ikke protokoll-oppgave) — men å <strong>gjøre tampering matematisk
                synlig</strong>.
              </>
            )}
          </p>
          <p>
            {isEn ? (
              <>
                This is a stronger property than prevention: even if an attacker gains full write access to
                your database, they cannot alter a historical envelope without breaking every subsequent
                hash. Any auditor, including the attacker&apos;s own counterparties, can detect it immediately.
              </>
            ) : (
              <>
                Dette er en sterkere egenskap enn forhindring: selv hvis en angriper får full skrive-tilgang
                til databasen din, kan de ikke endre en historisk envelope uten å bryte alle etterfølgende
                hasher. Enhver auditor, inkludert angriperens egne motparter, kan oppdage det umiddelbart.
              </>
            )}
          </p>
        </Prose>
      </TspSolutionBlock>

      <DeploymentExample>
        <p>
          {isEn ? (
            <>
              A pilot deployment can verify the entire chain of envelopes
              automatically every night — and publish the proof at <ExternalRef href="https://example.com/ledger">/ledger</ExternalRef>.
              Integrity status is visible as one of the statistics cards at the top of the page.
            </>
          ) : (
            <>
              En pilot-deployment kan verifisere hele kjeden av envelope-er
              automatisk hver natt — og publisere beviset på <ExternalRef href="https://example.com/ledger">/ledger</ExternalRef>.
              Integritets-status er synlig som et av statistikk-kortene øverst på siden.
            </>
          )}
        </p>
        <p>
          {isEn ? (
            <>
              During a migration of the the deployment database in February 2026, the hash chain was temporarily
              disrupted due to a configuration error. It was <em>detected the same day</em> by the nightly
              verification — without anyone suspecting anything was wrong. Without the hash chain, the
              problem would likely not have been discovered until the next external audit, months later.
            </>
          ) : (
            <>
              Under en migrering av deployment-databasen i februar 2026 ble hash-kjeden forstyrret midlertidig
              pga. en konfigurasjonsfeil. Det ble <em>oppdaget samme dag</em> av den nattlige verifikasjonen —
              uten at noen hadde mistanke om at noe var galt. Uten hash-kjeden ville problemet sannsynligvis
              ikke blitt oppdaget før neste eksterne audit, måneder senere.
            </>
          )}
        </p>
        <p>
          {isEn ? (
            <>
              <strong>That is art. 15 (1) in practice:</strong> &quot;consistent performance throughout the
              lifecycle&quot; — confirmed every night, not just in policy documents.
            </>
          ) : (
            <>
              <strong>Det er art. 15 (1) i praksis:</strong> &quot;consistent performance throughout the
              lifecycle&quot; — bekreftet hver natt, ikke bare i policy-dokumenter.
            </>
          )}
        </p>
      </DeploymentExample>

      <section className="space-y-3">
        <SectionHeading>{isEn ? "Covered by TSP Core" : "Dekkes av TSP Core"}</SectionHeading>
        <CoverageNote type="covered" title={isEn ? "Consistent performance throughout lifecycle (15 (1))" : "Consistent performance throughout lifecycle (15 (1))"}>
          {isEn
            ? "The hash chain is verified automatically. Inconsistency is detected on day one, not at audit time."
            : "Hash-kjeden verifiseres automatisk. Inkonsistens oppdages dag én, ikke ved audit."}
        </CoverageNote>
        <CoverageNote type="covered" title={isEn ? "Accuracy metrics declared (15 (3))" : "Accuracy metrics declared (15 (3))"}>
          {isEn ? (
            <>
              <code>alignment.uncertainty[]</code> per answer (structured: field, reason, severity) +{" "}
              <code>alignment.policy</code> binding the outcome to a specific policy version.
              Deterministic and verifiable, not an aggregated confidence number.
            </>
          ) : (
            <>
              <code>alignment.uncertainty[]</code> per svar (strukturert: field, reason, severity) +{" "}
              <code>alignment.policy</code> som binder utfallet til en spesifikk policy-versjon.
              Deterministisk og verifiserbar, ikke et aggregert konfidens-tall.
            </>
          )}
        </CoverageNote>
        <CoverageNote type="covered" title={isEn ? "Technical robustness (15 (4))" : "Technical robustness (15 (4))"}>
          {isEn
            ? "canonicalJson gives deterministic serialisation. Same input → same hash, always, across implementations."
            : "canonicalJson gir deterministisk serialisering. Samme input → samme hash, alltid, på tvers av implementasjoner."}
        </CoverageNote>
        <CoverageNote type="covered" title={isEn ? "Resilience against tampering (15 (5))" : "Resilience against tampering (15 (5))"}>
          {isEn
            ? "Tamper evidence is a mathematical guarantee, not a policy claim."
            : "Tamper evidence er en matematisk garanti, ikke en policy-påstand."}
        </CoverageNote>
        <CoverageNote type="partial" title={isEn ? "Technical redundancy solutions (15 (4))" : "Technical redundancy solutions (15 (4))"}>
          {isEn ? (
            <>
              TSP is orthogonal to infrastructure redundancy (backups, failover). The ledger <em>can</em> be
              replicated across regions without losing integrity — but the replication architecture itself
              is an ops decision.
            </>
          ) : (
            <>
              TSP er orthogonalt til infrastruktur-redundans (backups, failover). Ledger <em>kan</em> replikeres
              på tvers av regioner uten å miste integritet — men selve replikerings-arkitekturen er en
              ops-avgjørelse.
            </>
          )}
        </CoverageNote>
        <CoverageNote type="not-covered" title={isEn ? "Actual model accuracy (ML evaluation)" : "Actual model accuracy (ML-evaluering)"}>
          {isEn ? (
            <>
              TSP does not measure whether the model&apos;s answer is <em>correct</em> — only that it is
              consistent and traceable. External ML evaluation (RAG accuracy, hallucination rate, domain
              performance) must be run separately. TSP gladly integrates the results into{" "}
              <code>alignment.flags</code>.
            </>
          ) : (
            <>
              TSP måler ikke om modellens svar er <em>riktig</em> — bare at det er konsistent og sporbart. Ekstern
              ML-evaluering (RAG-accuracy, hallucination-rate, domene-ytelse) må kjøres separat. TSP integrerer
              gjerne resultater i <code>alignment.flags</code>.
            </>
          )}
        </CoverageNote>
      </section>
    </ArticleLayout>
  );
}
