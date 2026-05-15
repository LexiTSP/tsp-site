import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Code2,
  FileCode,
  Package,
  Server,
  ShieldCheck,
  Terminal,
  KeyRound,
  Network,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn
      ? "TSP API reference — @lexitsp/sdk v3.0.0-alpha.6"
      : "TSP API-referanse — @lexitsp/sdk v3.0.0-alpha.6",
    description: isEn
      ? "Practical guide to @lexitsp/sdk v3: wrap, verifyLocal, manifest PKI, RFC 3161 TSA and DANE binding."
      : "Praktisk guide til @lexitsp/sdk v3: wrap, verifyLocal, manifest-PKI, RFC 3161 TSA og DANE-binding.",
  };
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <div className="tsp-container py-12">
      <div className="tsp-eyebrow text-brand mb-2">
        {isEn ? "Documentation · v3.0.0-alpha.6" : "Dokumentasjon · v3.0.0-alpha.6"}
      </div>
      <h1 className="text-4xl font-bold mb-3">
        {isEn ? "TSP — API reference" : "TSP — API-referanse"}
      </h1>
      <p className="text-muted text-lg mb-3 max-w-2xl">
        {isEn ? (
          <>
            Practical guide to <code className="tsp-code">@lexitsp/sdk</code> v3 and how to write
            your first TrustEnvelope. The full normative schema table lives in the{" "}
            <Link href="/spec" className="text-brand">spec</Link>.
          </>
        ) : (
          <>
            Praktisk guide til <code className="tsp-code">@lexitsp/sdk</code> v3 og hvordan du
            skriver din første TrustEnvelope. Full normativ schema-tabell ligger i{" "}
            <Link href="/spec" className="text-brand">spec-en</Link>.
          </>
        )}
      </p>
      <p className="text-sm text-muted mb-12 max-w-2xl">
        {isEn ? (
          <>
            The SDK is <strong>MIT</strong>, sovereign by default. You can run TSP without LexiCo
            as long as you keep a signing key and a manifest available.
          </>
        ) : (
          <>
            SDK-en er <strong>MIT</strong>, sovereign-by-default. Du kan kjøre TSP uten LexiCo så lenge
            du holder en signaturnøkkel og et manifest tilgjengelig.
          </>
        )}
      </p>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        <nav className="lg:sticky lg:top-20 lg:self-start space-y-1 text-sm">
          <NavItem href="#installation" icon={<Package className="w-4 h-4" />}>
            {isEn ? "Installation" : "Installasjon"}
          </NavItem>
          <NavItem href="#quick-start" icon={<Code2 className="w-4 h-4" />}>
            {isEn ? "Quick start" : "Kom i gang"}
          </NavItem>
          <NavItem href="#envelope" icon={<FileCode className="w-4 h-4" />}>
            TrustEnvelope
          </NavItem>
          <NavItem href="#cli" icon={<Terminal className="w-4 h-4" />}>
            {isEn ? "tsp CLI" : "tsp CLI"}
          </NavItem>
          <NavItem href="#manifest" icon={<KeyRound className="w-4 h-4" />}>
            {isEn ? "Manifest & PKI" : "Manifest & PKI"}
          </NavItem>
          <NavItem href="#verify" icon={<ShieldCheck className="w-4 h-4" />}>
            {isEn ? "Verification" : "Verifisering"}
          </NavItem>
          <NavItem href="#tsa-dane" icon={<Network className="w-4 h-4" />}>
            {isEn ? "TSA & DANE" : "TSA & DANE"}
          </NavItem>
          <NavItem href="#platform" icon={<Server className="w-4 h-4" />}>
            {isEn ? "Platform modules" : "Plattform-moduler"}
          </NavItem>
        </nav>

        <div className="space-y-12 max-w-3xl">
          <Section id="installation" title={isEn ? "Installation" : "Installasjon"}>
            <p>
              {isEn ? (
                <>
                  Packages are published under the <code className="tsp-code">@lexitsp/*</code>{" "}
                  namespace. SDK and TrustBadge are <strong>MIT</strong>; the backend modules are
                  commercial tools for hosted or licensed on-prem deployments.
                </>
              ) : (
                <>
                  Pakkene er publisert under <code className="tsp-code">@lexitsp/*</code>-namespace. SDK
                  og TrustBadge er <strong>MIT</strong>; backend-modulene er kommersielle verktøy for
                  hosted eller lisensierte on-prem deploys.
                </>
              )}
            </p>
            <CodeBlock
              lang="bash"
              code={isEn
                ? `# Standard zone (MIT)
bun add @lexitsp/sdk                  # or: npm install @lexitsp/sdk
bun add @lexitsp/trustbadge-react     # optional React component

# Tools zone (commercial license — hosted or on-prem)
# @lexitsp/risk-server, @lexitsp/evidence-server, @lexitsp/oversight-server`
                : `# Standard-sone (MIT)
bun add @lexitsp/sdk                  # eller: npm install @lexitsp/sdk
bun add @lexitsp/trustbadge-react     # valgfri React-komponent

# Verktøy-sone (kommersiell lisens — hosted eller on-prem)
# @lexitsp/risk-server, @lexitsp/evidence-server, @lexitsp/oversight-server`}
            />
            <p>
              {isEn ? (
                <>
                  If you only need the protocol (without TypeScript), TrustEnvelopes can be produced
                  and verified as plain JSON from any language with Ed25519 and SHA-256 — see the{" "}
                  <Link href="/spec" className="text-brand">spec</Link>.
                </>
              ) : (
                <>
                  Trenger du bare protokollen (uten TypeScript), kan TrustEnvelopes produseres og
                  verifiseres som vanlig JSON fra hvilket som helst språk med Ed25519 og SHA-256 — se{" "}
                  <Link href="/spec" className="text-brand">spec-en</Link>.
                </>
              )}
            </p>
          </Section>

          <Section id="quick-start" title={isEn ? "Quick start" : "Kom i gang"}>
            <p>
              {isEn
                ? "Three steps: create a signing key, register it in a manifest, and wrap an answer. The SDK does the rest — RFC 8785 canonicalization, Ed25519, RFC 3161 timestamping and the hash chain are handled internally."
                : "Tre steg: lag en signaturnøkkel, registrer den i et manifest, og wrap et svar. SDK-en gjør resten — RFC 8785-canonicalization, Ed25519, RFC 3161-tidsstempling og hash-kjede håndteres internt."}
            </p>
            <CodeBlock
              lang="typescript"
              code={isEn
                ? `import { wrap, generateKeyPair, exportPublicKeyJwk } from "@lexitsp/sdk/v3";

// 1. Signing key (Ed25519, non-extractable in prod)
const keyPair = await generateKeyPair();
const publicJwk = await exportPublicKeyJwk(keyPair.publicKey);

// 2. Wrap an AI answer
const envelope = await wrap(
  { type: "text", value: "You are entitled to AAP because you satisfy §11-5." },
  {
    signer: {
      sign: async (data) => keyPair.sign(data),
      publicKey: publicJwk,
      keyRef: "https://your-org.no/.well-known/tsp/keys.json#i1",
      certChain: [/* base64 instance cert from manifest, see below */],
    },
    declaration: {
      primarySource: {
        provided: true,
        type: "legal-database",
        url: "https://lovdata.no/lov/folketrygdloven/§11-5",
        title: "Folketrygdloven § 11-5",
        retrieved: new Date().toISOString(),
      },
      citations: [],
    },
    process: {
      model: { name: "normistral", version: "11b-warm-3-2026q1", provider: "norwai-local",
               temperature: 0.0, contextWindow: 8192 },
      systemPrompt: { hash: "sha256:…", redacted: true, reason: "internal-policy" },
      pipeline: [{ name: "rag-retrieve", durationMs: 84 }, { name: "generate", durationMs: 412 }],
    },
    alignment: {
      uncertainty: [],
      flags: [],
      policy: { id: "default", version: "1.0" },
      humanReviewRequired: false,
    },
    prevHash: "0".repeat(64), // first envelope in the chain
    tsaUrls: ["https://freetsa.org/tsr"], // RFC 3161 TSA
  }
);

console.log(envelope.ledger.hash);  // sha256-hex over canonical envelope`
                : `import { wrap, generateKeyPair, exportPublicKeyJwk } from "@lexitsp/sdk/v3";

// 1. Signaturnøkkel (Ed25519, ikke-eksporterbar i prod)
const keyPair = await generateKeyPair();
const publicJwk = await exportPublicKeyJwk(keyPair.publicKey);

// 2. Wrap et AI-svar
const envelope = await wrap(
  { type: "text", value: "Du har rett på AAP fordi du oppfyller §11-5." },
  {
    signer: {
      sign: async (data) => keyPair.sign(data),
      publicKey: publicJwk,
      keyRef: "https://din-org.no/.well-known/tsp/keys.json#i1",
      certChain: [/* base64 instance-cert fra manifest, se under */],
    },
    declaration: {
      primarySource: {
        provided: true,
        type: "legal-database",
        url: "https://lovdata.no/lov/folketrygdloven/§11-5",
        title: "Folketrygdloven § 11-5",
        retrieved: new Date().toISOString(),
      },
      citations: [],
    },
    process: {
      model: { name: "normistral", version: "11b-warm-3-2026q1", provider: "norwai-local",
               temperature: 0.0, contextWindow: 8192 },
      systemPrompt: { hash: "sha256:…", redacted: true, reason: "internal-policy" },
      pipeline: [{ name: "rag-retrieve", durationMs: 84 }, { name: "generate", durationMs: 412 }],
    },
    alignment: {
      uncertainty: [],
      flags: [],
      policy: { id: "default", version: "1.0" },
      humanReviewRequired: false,
    },
    prevHash: "0".repeat(64), // første envelope i kjeden
    tsaUrls: ["https://freetsa.org/tsr"], // RFC 3161 TSA
  }
);

console.log(envelope.ledger.hash);  // sha256-hex over canonical envelope`}
            />
            <p className="text-sm text-muted mt-4">
              {isEn ? (
                <>
                  In dev (without <code className="tsp-code">tsaUrls</code>) a placeholder token is
                  used and a warning is logged. In production (
                  <code className="tsp-code">NODE_ENV=production</code>),{" "}
                  <code className="tsp-code">wrap()</code> throws if TSA config is missing.
                </>
              ) : (
                <>
                  I dev (uten <code className="tsp-code">tsaUrls</code>) brukes en placeholder-token og
                  det logges en advarsel. I produksjon (
                  <code className="tsp-code">NODE_ENV=production</code>) kaster{" "}
                  <code className="tsp-code">wrap()</code> hvis TSA-konfig mangler.
                </>
              )}
            </p>
          </Section>

          <Section id="envelope" title={isEn ? "TrustEnvelope — the structure" : "TrustEnvelope — strukturen"}>
            <p>
              {isEn ? (
                <>
                  A TrustEnvelope consists of six top-level fields. All <em>can-be-empty</em>{" "}
                  fields must be declared explicitly with union types — absence without
                  justification is forbidden: language is architecture, and silent optionality
                  hides assumptions.
                </>
              ) : (
                <>
                  En TrustEnvelope består av seks toppnivå-felter. Alle{" "}
                  <em>kan-være-tomme</em>-felter må deklareres eksplisitt med union-typer — fravær uten
                  begrunnelse er forbudt: språk er arkitektur, og taus optionality skjuler antakelser.
                </>
              )}
            </p>
            <div className="grid sm:grid-cols-2 gap-4 my-6">
              <EnvelopePart
                title="content"
                role="data"
                desc={isEn
                  ? "{ type, value, hash } — the AI output itself + SHA-256 of canonical JSON."
                  : "{ type, value, hash } — selve AI-utgangen + SHA-256 av canonical JSON."}
              />
              <EnvelopePart
                title="declaration"
                role={isEn ? "source declaration" : "kilde-erklæring"}
                desc="primarySource (provided | not-needed | redacted) + citations[]."
              />
              <EnvelopePart
                title="process"
                role={isEn ? "process log" : "prosess-logg"}
                desc={isEn
                  ? "model, systemPrompt (text | redacted), pipeline steps."
                  : "model, systemPrompt (text | redacted), pipeline-steg."}
              />
              <EnvelopePart
                title="alignment"
                role={isEn ? "alignment metadata" : "alignment-metadata"}
                desc="uncertainty[], flags[], policy, refusal?, humanReviewRequired."
              />
              <EnvelopePart
                title="timestamp"
                role={isEn ? "time attestation" : "tids-attestasjon"}
                desc="claimed (ISO-8601) + tsaToken (RFC 3161) + tsaUrl."
              />
              <EnvelopePart
                title="ledger + signatures"
                role={isEn ? "bindings" : "bindinger"}
                desc={isEn
                  ? "ledger.hash (chain), prevHash, id (UUIDv7) + Ed25519 signatures."
                  : "ledger.hash (kjede), prevHash, id (UUIDv7) + Ed25519-signaturer."}
              />
            </div>
            <p className="text-sm text-muted">
              {isEn ? (
                <>
                  Full normative schema table, the JCS canonicalization rule and PII/GDPR patterns
                  live in the <Link href="/spec" className="text-brand">spec</Link>.
                </>
              ) : (
                <>
                  Full normativ skjema-tabell, JCS-canonicalization-regelen og PII/GDPR-mønstre ligger i{" "}
                  <Link href="/spec" className="text-brand">spec-en</Link>.
                </>
              )}
            </p>
          </Section>

          <Section id="cli" title="tsp CLI">
            <p>
              {isEn ? (
                <>
                  The SDK exposes the <code className="tsp-code">tsp</code> binary for manifest and
                  cert handling. Phase 2 functionality.
                </>
              ) : (
                <>
                  SDK-en eksponerer <code className="tsp-code">tsp</code>-binæren for manifest- og
                  cert-håndtering. Phase 2-funksjonalitet.
                </>
              )}
            </p>
            <CodeBlock
              lang="bash"
              code={isEn
                ? `# Initialise org root + manifest
bunx tsp manifest init --org "your-org" --out ./manifest.json

# Add an instance cert (signing key for one service)
bunx tsp cert add --manifest ./manifest.json \\
  --role instance --label "chat-1" --pubkey ./chat-1.pub.jwk

# Revoke a cert (the revocation list is part of the manifest)
bunx tsp cert revoke --manifest ./manifest.json --keyRef "...#i1" --reason "rotation"`
                : `# Initialiser org-rot + manifest
bunx tsp manifest init --org "din-org" --out ./manifest.json

# Legg til en instans-cert (signering-nøkkel for én tjeneste)
bunx tsp cert add --manifest ./manifest.json \\
  --role instance --label "chat-1" --pubkey ./chat-1.pub.jwk

# Revoker en cert (revokerings-listen er en del av manifest)
bunx tsp cert revoke --manifest ./manifest.json --keyRef "...#i1" --reason "rotation"`}
            />
            <p className="text-sm text-muted mt-4">
              {isEn ? (
                <>
                  The manifest is published at{" "}
                  <code className="tsp-code">https://your-org.no/.well-known/tsp/manifest.json</code>{" "}
                  (5 min cache by default), or bound to a TLSA record via DANE — see below.
                </>
              ) : (
                <>
                  Manifest publiseres på{" "}
                  <code className="tsp-code">https://din-org.no/.well-known/tsp/manifest.json</code> (5
                  min cache by default), eller bindes til en TLSA-record via DANE — se under.
                </>
              )}
            </p>
          </Section>

          <Section id="manifest" title={isEn ? "Manifest & PKI" : "Manifest & PKI"}>
            <p>
              {isEn ? (
                <>
                  TSP uses a <strong>self-hosted PKI</strong> with no external CA dependency. A
                  signed manifest declares which keys are valid at a given point in time.
                </>
              ) : (
                <>
                  TSP bruker en <strong>self-hosted PKI</strong> uten ekstern CA-avhengighet. Et signert
                  manifest erklærer hvilke nøkler som er gyldige på et gitt tidspunkt.
                </>
              )}
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm">
              <li>
                <strong>{isEn ? "Org root:" : "Org-rot:"}</strong>{" "}
                {isEn ? "one Ed25519 key that signs the manifest itself." : "én Ed25519-nøkkel som signerer manifestet selv."}
              </li>
              <li>
                <strong>{isEn ? "Instance certs:" : "Instans-certs:"}</strong>{" "}
                {isEn
                  ? "per-service keys (one per chat server, agent, etc.). The org root signs a cert payload binding pubkey ↔ keyRef ↔ role."
                  : "per-tjeneste nøkler (én per chat-server, agent osv.). Org-roten signerer en cert-payload som binder pubkey ↔ keyRef ↔ rolle."}
              </li>
              <li>
                <strong>{isEn ? "Delegated certs:" : "Delegerte certs:"}</strong>{" "}
                {isEn ? (
                  <>
                    used for example by Oversight for{" "}
                    <code className="tsp-code">human-reviewer</code> keys. The reviewer generates
                    their own Ed25519 keypair locally (WebCrypto{" "}
                    <code className="tsp-code">extractable=false</code>), the public key is
                    registered in the manifest.
                  </>
                ) : (
                  <>
                    brukes f.eks. av Oversight til{" "}
                    <code className="tsp-code">human-reviewer</code>-nøkler. Reviewer genererer egen
                    Ed25519-keypair lokalt (WebCrypto <code className="tsp-code">extractable=false</code>),
                    public registreres i manifestet.
                  </>
                )}
              </li>
              <li>
                <strong>{isEn ? "Revocation:" : "Revokering:"}</strong>{" "}
                {isEn ? (
                  <>
                    the <code className="tsp-code">revoked[]</code> list in the manifest contains
                    cert fingerprints. <code className="tsp-code">verifyOnline</code> rejects
                    signatures from revoked certs.
                  </>
                ) : (
                  <>
                    <code className="tsp-code">revoked[]</code>-listen i
                    manifestet inneholder cert-fingerprints. <code className="tsp-code">verifyOnline</code>{" "}
                    avviser signaturer fra revokerte certs.
                  </>
                )}
              </li>
            </ul>
            <CodeBlock
              lang="typescript"
              code={isEn
                ? `import { fetchManifest, verifyManifestSignature, verifyInstanceCert } from "@lexitsp/sdk/v3";

const { manifest } = await fetchManifest("https://your-org.no");
const ok = await verifyManifestSignature(manifest);  // org-root checked
// per cert:
for (const cert of manifest.instances) {
  await verifyInstanceCert(cert, manifest.rootPublicKey);
}`
                : `import { fetchManifest, verifyManifestSignature, verifyInstanceCert } from "@lexitsp/sdk/v3";

const { manifest } = await fetchManifest("https://din-org.no");
const ok = await verifyManifestSignature(manifest);  // org-root sjekkes
// per cert:
for (const cert of manifest.instances) {
  await verifyInstanceCert(cert, manifest.rootPublicKey);
}`}
            />
          </Section>

          <Section id="verify" title={isEn ? "Verification — verifyLocal & verifyOnline" : "Verifisering — verifyLocal & verifyOnline"}>
            <p>
              {isEn ? (
                <>
                  <code className="tsp-code">verifyLocal()</code> runs ten named checks with no
                  network calls:
                </>
              ) : (
                <>
                  <code className="tsp-code">verifyLocal()</code> kjører ti navngitte sjekker uten
                  nettverkskall:
                </>
              )}
            </p>
            <CodeBlock
              lang="typescript"
              code={isEn
                ? `import { verifyLocal } from "@lexitsp/sdk/v3";

const result = await verifyLocal(envelope, {
  expectedPrevHash: "...",  // optional — for chain validation
  manifest,                  // if a local cache is available
});

if (result.valid) {
  console.log("OK:", result.checks);
  // { contentHashOk, signaturesOk, certChainOk, ledgerHashOk,
  //   prevHashOk, tsaTokenWellformed, declarationWellformed,
  //   processWellformed, alignmentWellformed, schemaConformant }
} else {
  console.error("FAIL:", result.failures);
}`
                : `import { verifyLocal } from "@lexitsp/sdk/v3";

const result = await verifyLocal(envelope, {
  expectedPrevHash: "...",  // valgfritt — for kjede-validering
  manifest,                  // hvis lokal cache er tilgjengelig
});

if (result.valid) {
  console.log("OK:", result.checks);
  // { contentHashOk, signaturesOk, certChainOk, ledgerHashOk,
  //   prevHashOk, tsaTokenWellformed, declarationWellformed,
  //   processWellformed, alignmentWellformed, schemaConformant }
} else {
  console.error("FAIL:", result.failures);
}`}
            />
            <p className="mt-4">
              {isEn ? (
                <>
                  <code className="tsp-code">verifyOnline()</code> adds four extra checks over the
                  network: fetch and verify the manifest, check cert revocation, validate the TSA
                  token, and verify sequence state for rollback detection.
                </>
              ) : (
                <>
                  <code className="tsp-code">verifyOnline()</code> tilfører fire ekstra sjekker over
                  nett: hent og verifiser manifest, sjekk cert-revokering, valider TSA-tokenet, og
                  verifiser sequence-state for rollback-deteksjon.
                </>
              )}
            </p>
          </Section>

          <Section id="tsa-dane" title={isEn ? "TSA & DANE" : "TSA & DANE"}>
            <p>
              {isEn ? (
                <>
                  <strong>RFC 3161 TSA</strong> — external timestamp services. The SDK supports
                  sequential multi-TSA fallback with a fingerprint whitelist. Recommended:
                </>
              ) : (
                <>
                  <strong>RFC 3161 TSA</strong> — eksterne tidsstempel-tjenester. SDK-en støtter
                  sequential multi-TSA fallback med fingerprint-whitelist. Anbefalte:
                </>
              )}
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>
                <code className="tsp-code">freetsa.org</code> —{" "}
                {isEn ? "free, usable in dev/alpha" : "gratis, brukbar i dev/alpha"}
              </li>
              <li>
                {isEn
                  ? "eIDAS-qualified TSAs (Buypass, Digg.se, etc.) for production with legal non-repudiation"
                  : "eIDAS-kvalifiserte TSA-er (Buypass, Digg.se, etc.) for produksjon med juridisk ikke-fornektelighet"}
              </li>
            </ul>
            <p className="mt-4">
              {isEn ? (
                <>
                  <strong>DANE/TLSA</strong> — alternative to a well-known URL for fetching the
                  manifest. Place a TLSA record at{" "}
                  <code className="tsp-code">_tsp.your-org.no</code> binding the org root
                  fingerprint to DNS (DNSSEC required).
                </>
              ) : (
                <>
                  <strong>DANE/TLSA</strong> — alternativ til well-known URL for å hente manifestet.
                  Plasser TLSA-record på <code className="tsp-code">_tsp.din-org.no</code> som binder
                  org-rotens fingerprint til DNS (DNSSEC påkrevd).
                </>
              )}
            </p>
            <CodeBlock
              lang="bash"
              code={isEn
                ? `# DNS TLSA record (simplified)
_tsp.your-org.no. IN TLSA 3 1 1 \\
  e7b203...0f4a    ; SHA-256 fingerprint of org-root pubkey`
                : `# DNS TLSA-record (forenklet)
_tsp.din-org.no. IN TLSA 3 1 1 \\
  e7b203...0f4a    ; SHA-256 fingerprint av org-root pubkey`}
            />
            <div className="mt-5 border-l-2 border-warn bg-warn/5 pl-4 py-3">
              <div className="font-semibold text-sm text-ink">
                {isEn ? "Production checklist" : "Produksjons-sjekkliste"}
              </div>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted">
                <li>{isEn ? "Pass explicit tsaUrls to wrap()." : "Send eksplisitte tsaUrls til wrap()."}</li>
                <li>{isEn ? "Pass trustedTsas to verifyOnline()." : "Send trustedTsas til verifyOnline()."}</li>
                <li>{isEn ? "Host the manifest on a stable URL." : "Host manifestet på en stabil URL."}</li>
                <li>{isEn ? "Do not use skipTsa in production." : "Ikke bruk skipTsa i produksjon."}</li>
              </ul>
            </div>
          </Section>

          <Section id="platform" title={isEn ? "Platform modules (optional)" : "Plattform-moduler (valgfrie)"}>
            <p>
              {isEn
                ? "Three hosted services that hook into the protocol. You can ignore them and just use the SDK if you don't need a central alarm queue, auditor export or reviewer flow."
                : "Tre hosted-tjenester som hekter på protokollen. Du kan ignorere dem og bare bruke SDK-en hvis du ikke trenger sentral alarm-kø, auditor-eksport eller reviewer-flyt."}
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              <PlatformCard
                href="/risk"
                title="Risk"
                pkg="@lexitsp/risk-server"
                desc={isEn
                  ? "Alarms + envelope aggregation. Never user-aggregation."
                  : "Alarmer + envelope-aggregat. Aldri user-aggregering."}
              />
              <PlatformCard
                href="/evidence"
                title="Evidence"
                pkg="@lexitsp/evidence-server"
                desc={isEn
                  ? "Auditor packages. Data minimisation by default."
                  : "Auditor-pakker. Data-minimering by default."}
              />
              <PlatformCard
                href="/oversight"
                title="Oversight"
                pkg="@lexitsp/oversight-server"
                desc={isEn ? "Human review. Client-side signing." : "Human review. Client-side signing."}
              />
            </div>
            <CodeBlock
              lang="typescript"
              code={isEn
                ? `// The SDK can dual-write to the Risk module as fire-and-forget:
const envelope = await wrap(input, {
  signer, declaration, process, alignment, prevHash, tsaUrls,
  riskSink: {
    url: "https://your-risk-host.example/risk/ingest",
    apiKey: process.env.LEXITSP_RISK_KEY!,
    onError: "warn",
  },
});`
                : `// SDK-en kan dual-write til Risk-modulen som fire-and-forget:
const envelope = await wrap(input, {
  signer, declaration, process, alignment, prevHash, tsaUrls,
  riskSink: {
    url: "https://your-risk-host.example/risk/ingest",
    apiKey: process.env.LEXITSP_RISK_KEY!,
    onError: "warn",
  },
});`}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/spec" className="tsp-btn-primary">
                {isEn ? "Read full spec" : "Les full spec"} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/" className="tsp-btn-secondary">
                {isEn ? "See live tamper demo" : "Se live tamper-demo"}
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-3 py-1.5 rounded text-muted hover:text-brand hover:bg-brand/5 no-underline"
    >
      {icon}
      {children}
    </a>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-medium mb-4 pb-2 border-b border-border">
        {title}
      </h2>
      <div className="prose prose-sm max-w-none text-ink leading-relaxed [&>p]:my-3 [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-xs [&_code:not(pre_code)]:bg-ink/5 [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:rounded">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  return (
    <div className="my-4 rounded overflow-hidden border border-border-strong">
      <div className="bg-ink/90 text-gray-400 text-xxxs font-mono uppercase tracking-widest px-4 py-1.5 border-b border-white/10">
        {lang}
      </div>
      <pre className="bg-ink text-gray-100 text-xs font-mono p-4 overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function EnvelopePart({
  title,
  role,
  desc,
}: {
  title: string;
  role: string;
  desc: string;
}) {
  return (
    <div className="border border-border p-4 bg-surface">
      <div className="flex items-center justify-between mb-1">
        <code className="font-mono text-sm font-semibold text-brand">{title}</code>
        <span className="text-xxs text-muted font-mono uppercase tracking-wider">{role}</span>
      </div>
      <p className="text-sm text-muted leading-snug">{desc}</p>
    </div>
  );
}

function PlatformCard({
  href,
  title,
  pkg,
  desc,
}: {
  href: string;
  title: string;
  pkg: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-border p-4 bg-surface hover:border-brand no-underline"
    >
      <div className="font-semibold text-ink mb-1">{title}</div>
      <div className="font-mono text-xxs text-muted mb-2">{pkg}</div>
      <div className="text-sm text-muted leading-snug">{desc}</div>
    </Link>
  );
}
