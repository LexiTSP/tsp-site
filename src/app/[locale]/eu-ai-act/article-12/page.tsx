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
    title: "EU AI Act Art. 12 — Record-keeping · TSP",
    description: isEn
      ? "How TSP Core implements automatic logging with integrity for high-risk AI systems."
      : "Hvordan TSP Core implementerer automatisk logging med integritet for høyrisiko-AI-systemer.",
  };
}

const ENVELOPE_CODE = `{
  tsp: "3.0",
  content: {
    type: "text",
    value: "...",                // selve svaret
    hash: "a3f8...d91c"           // SHA-256 av canonical JSON
  },
  declaration: {                  // kilde-erklæring
    primarySource: {
      provided: true,
      type: "legal-database",
      url: "https://lovdata.no/...",
      title: "Folketrygdloven §11-5",
      retrieved: "2026-04-22T..."
    },
    citations: [...]              // strukturerte sitater
  },
  process: {                      // prosess-logg
    model: { name: "normistral", version: "11b-warm-3-2026q1",
             provider: "norwai-local", temperature: 0, contextWindow: 8192 },
    systemPrompt: { hash: "sha256:...", redacted: true, reason: "internal-policy" },
    pipeline: [{ name: "rag-retrieve", durationMs: 84 }, { name: "generate", durationMs: 412 }]
  },
  alignment: {                    // alignment-metadata
    uncertainty: [],               // strukturert: { field, reason, severity }
    flags: [],                    // kategoriske flagg
    policy: { id: "default", version: "1.0" },
    humanReviewRequired: false
  },
  timestamp: {                    // tids-attestasjon
    claimed: "2026-04-22T...",
    tsaToken: "MIIEXTCCBC2g...",   // RFC 3161
    tsaUrl: "https://freetsa.org/tsr"
  },
  ledger: {
    id: "01HF8K3E5Q7M...",         // UUIDv7
    prevHash: "e7b2...0f4a",       // lenke tilbake
    hash: "a3f8...d91c"            // SHA-256 av canonical envelope
  },
  signatures: [{                  // Ed25519
    role: "instance",
    algorithm: "ed25519",
    keyRef: "https://din-org.no/.well-known/tsp-manifest.json#i1",
    signature: "MEUCIQDx7...vK4=",
    certChain: [...]
  }]
}`;

const VERIFY_CODE = `// En hvilken som helst tredjepart kan verifisere en kjede
import { verifyLocal } from "@lexitsp/sdk/v3";

async function verifyChain(envelopes: TrustEnvelope[]) {
  for (let i = 0; i < envelopes.length; i++) {
    const e = envelopes[i];

    // 1. Full lokal verifisering: 10 navngitte sjekker
    //    (contentHash, signaturer, cert-chain, ledger.hash, ...)
    const expectedPrev = i > 0 ? envelopes[i - 1].ledger.hash : undefined;
    const result = await verifyLocal(e, { expectedPrevHash: expectedPrev });

    if (!result.valid) {
      return { valid: false, brokenAt: i, failures: result.failures };
    }
  }
  return { valid: true };
}`;

export default async function Article12Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <ArticleLayout
      articleSlug="article-12"
      articleNumber="12"
      articleTitle={isEn
        ? "Record-keeping — cryptographic logging through the entire lifecycle"
        : "Record-keeping — kryptografisk logging gjennom hele livssyklusen"}
      tspCoverage="Core"
      coveragePercent={95}
    >
      <ArticleIntro>
        {isEn ? (
          <>
            Article 12 requires high-risk AI systems to have automatic logging of events throughout their
            operational lifetime. TSP Core makes this <strong>cryptographic</strong> logging — meaning not
            just that a file exists somewhere, but that it is <em>impossible</em> to alter an earlier entry
            without it becoming visible.
          </>
        ) : (
          <>
            Artikkel 12 krever at høyrisiko-AI-systemer skal ha automatisk logging av hendelser i hele deres
            operasjonelle levetid. TSP Core gjør dette til <strong>kryptografisk</strong> logging — altså ikke
            bare at det finnes en fil et sted, men at det er <em>umulig</em> å endre en tidligere entry uten at
            det blir synlig.
          </>
        )}
      </ArticleIntro>

      <RequirementBlock
        articleRef="Art. 12 (1)"
        title={isEn ? "The legal text" : "Lovteksten"}
        quote="High-risk AI systems shall technically allow for the automatic recording of events ('logs') over the lifetime of the system. In order to ensure a level of traceability of the AI system's functioning, logging capabilities shall enable the recording of events relevant for identifying situations that may result in the AI system presenting a risk or undergoing a substantial modification, and post-market monitoring."
      />

      <TspSolutionBlock
        module="Core"
        moduleHref="/core"
        summary={isEn
          ? "Every AI response is wrapped in a Trust Envelope and linked to the previous one via SHA-256. Append-only, signed backward, impossible to silently amend."
          : "Hver AI-respons pakkes i en Trust Envelope og lenkes til forrige via SHA-256. Append-only, bakover-signert, umulig å rette opp i hemmelighet."}
      >
        <Prose>
          {isEn ? (
            <>
              <p>
                <strong>This isn&apos;t ordinary logging.</strong> A regular log file can be edited. A JSON in a
                database can be edited. An S3 bucket with write-once restrictions is better — but still
                requires trust in the cloud provider.
              </p>
              <p>
                TSP&apos;s chain mechanism means that if anyone alters an old envelope after later envelopes are
                signed, the <em>hash chain breaks mathematically</em>. Anyone can verify it, with only
                publicly available information. Same mechanism as Bitcoin, without the energy footprint.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Dette er ikke vanlig logging.</strong> En vanlig log-fil kan redigeres. En JSON i en
                database kan redigeres. En S3-bucket med write-once-restriksjoner er bedre — men krever fortsatt
                tillit til cloud-leverandøren.
              </p>
              <p>
                TSP&apos;s kjede-mekanisme betyr at hvis noen endrer en gammel envelope etter at senere envelopes er
                signert, så <em>brytes hash-kjeden matematisk</em>. Det kan verifiseres av hvem som helst, med
                kun offentlig tilgjengelig informasjon. Det er samme mekanisme som Bitcoin, uten
                energiforbruket.
              </p>
            </>
          )}
        </Prose>

        <SectionHeading>{isEn ? "What gets logged automatically?" : "Hva loggføres automatisk?"}</SectionHeading>
        <EvidenceBlock
          label={isEn ? "Every AI answer generates an envelope with these fields" : "Hvert AI-svar genererer en envelope med disse feltene"}
          lang="typescript"
          code={ENVELOPE_CODE}
        />

        <SectionHeading>{isEn ? "Why SHA-256 + RFC 8785/JCS?" : "Hvorfor SHA-256 + RFC 8785/JCS?"}</SectionHeading>
        <Prose>
          <p>
            {isEn ? (
              <>
                The hash is computed over a <strong>deterministic</strong> JSON serialisation based on
                RFC 8785/JCS (see <Link href="/spec#hashing" className="text-brand hover:underline">spec</Link>). That
                means the same envelope produces the same hash regardless of language, platform or implementation.
                A German auditor, a Norwegian compliance officer and a Finnish developer verify the same hash
                and get the same answer.
              </>
            ) : (
              <>
                Hashen regnes over en <strong>deterministisk</strong> JSON-serialisering basert på RFC 8785/JCS
                (se <Link href="/spec#hashing" className="text-brand hover:underline">spec</Link>). Det betyr at
                samme envelope produserer samme hash uansett språk, plattform eller implementering. En tysk
                auditor, en norsk compliance officer og en finsk utvikler verifiserer samme hash og får samme svar.
              </>
            )}
          </p>
        </Prose>

        <EvidenceBlock
          label={isEn ? "Verification pseudo-code" : "Verifiserings-pseudokode"}
          lang="typescript"
          code={VERIFY_CODE}
        />
      </TspSolutionBlock>

      <DeploymentExample>
        <p>
          {isEn ? (
            <>
              A regulated deployment can maintain a public{" "}
              <ExternalRef href="https://example.com/ledger">transparency log at /ledger</ExternalRef> where
              <strong> every AI-generated complaint, every explanatory answer, every benefit assessment </strong>
              is publicly accessible with signature, timestamp and source reference.
            </>
          ) : (
            <>
              En regulert deployment kan ha en offentlig{" "}
              <ExternalRef href="https://example.com/ledger">åpenhetslogg på /ledger</ExternalRef> der
              <strong> hver eneste AI-genererte klage, hvert eneste forklarende svar, hver eneste
              stønadsvurdering </strong> ligger tilgjengelig med signatur, timestamp og kildehenvisning.
            </>
          )}
        </p>
        <p>
          {isEn
            ? "This means a caseworker who suspects the system gave wrong advice to a user can:"
            : "Dette betyr at en saksbehandler som mistenker at systemet ga feil råd til en bruker kan:"}
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>{isEn ? "Find the original answer in the log" : "Finne det opprinnelige svaret i loggen"}</li>
          <li>{isEn ? "Verify it has not been altered (Ed25519 + SHA-256 chain)" : "Verifisere at det ikke er endret siden (Ed25519 + SHA-256-kjede)"}</li>
          <li>
            {isEn ? <>See which legal sources were cited (<code>declaration.citations[]</code>)</> : <>Se hvilke lovhjemler som ble sitert (<code>declaration.citations[]</code>)</>}
          </li>
          <li>{isEn ? "Check which model version, system-prompt hash and policy were in use" : "Sjekke hvilken modell-versjon, systemprompt-hash og policy som var i bruk"}</li>
        </ul>
        <p>
          {isEn
            ? "This is exactly the traceability article 12 describes — only implemented technically instead of as a policy sentence."
            : "Det er precis denne sporbarheten artikkel 12 beskriver — bare implementert teknisk i stedet for som en policy-setning."}
        </p>
      </DeploymentExample>

      <section className="space-y-3">
        <SectionHeading>
          {isEn ? <>What TSP Core <em>covers</em> in article 12</> : <>Hva TSP Core <em>dekker</em> av artikkel 12</>}
        </SectionHeading>
        <CoverageNote type="covered" title={isEn ? "Automatic logging of all events" : "Automatisk logging av alle hendelser"}>
          {isEn
            ? "Every AI answer, every decision, every escalation is written to the ledger. No manual intervention required."
            : "Hvert AI-svar, hver beslutning, hver eskalering skrives til ledger. Ingen manuell intervention trengs."}
        </CoverageNote>
        <CoverageNote type="covered" title={isEn ? "Integrity and immutability" : "Integritet og uforanderlighet"}>
          {isEn
            ? "The SHA-256 chain commits each event to the previous hash. An auditor can verify integrity in seconds."
            : "SHA-256-kjeden binder hver hendelse til forrige hash. En auditor kan verifisere integriteten på sekunder."}
        </CoverageNote>
        <CoverageNote type="covered" title={isEn ? "Identification of risk situations" : "Identifisering av risiko-situasjoner"}>
          {isEn ? (
            <>
              <code>alignment.uncertainty[]</code>, <code>alignment.flags[]</code> and{" "}
              <code>alignment.humanReviewRequired</code> are structured fields in every envelope. The Risk
              module aggregates at envelope level (never per user) and gives post-market monitoring structured input.
            </>
          ) : (
            <>
              <code>alignment.uncertainty[]</code>, <code>alignment.flags[]</code> og{" "}
              <code>alignment.humanReviewRequired</code> er strukturerte felter i hver envelope. Risk-modulen
              aggregerer på envelope-nivå (aldri på bruker) og gir post-market monitoring strukturert input.
            </>
          )}
        </CoverageNote>
        <CoverageNote type="covered" title={isEn ? "Logging of substantial modifications" : "Logging av substantial modifications"}>
          {isEn ? (
            <>
              When a model is swapped, when a pipeline changes, when a prompt template is updated, it is reflected
              in <code>process.model.version</code>, <code>process.pipeline[]</code> and{" "}
              <code>process.systemPrompt.hash</code>. A diff between envelopes shows the change exactly.
            </>
          ) : (
            <>
              Når en modell byttes, når en pipeline endres, når en prompt-template oppdateres, speiles det i{" "}
              <code>process.model.version</code>, <code>process.pipeline[]</code> og{" "}
              <code>process.systemPrompt.hash</code>. Diff mellom envelopes viser endringen eksakt.
            </>
          )}
        </CoverageNote>
        <CoverageNote type="partial" title={isEn ? "Retention requirements (minimum 6 months in most EU countries)" : "Retention-krav (minimum 6 måneder i de fleste EU-land)"}>
          {isEn
            ? "TSP doesn't impose retention duration — that is an operational choice for the organisation. But the ledger design is optimised for append-only with low maintenance cost over time."
            : "TSP legger ikke føringer på lagringsvarighet — det er et operativt valg for organisasjonen. Men ledger-design er optimert for append-only med lav vedlikeholdskost over tid."}
        </CoverageNote>
      </section>
    </ArticleLayout>
  );
}
