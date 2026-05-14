import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowRight, FileCode, GitBranch, BookOpen, Package, Check, Code2 } from "lucide-react";
import { ChainVisualizer } from "@/components/ChainVisualizer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "spec" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function SpecPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("spec");
  const isEn = locale === "en";

  const ROWS_NO: Array<[string, string, string]> = [
    ["tsp", '"3.0"', "Spec-versjon (literal)"],
    ["content.type", "enum", '"text" | "document" | "structured"'],
    ["content.value", "string", "AI-utgangen, ren tekst eller serialisert dokument"],
    ["content.hash", "sha256", "SHA-256 hex av canonicalJson(value)"],
    ["declaration.primarySource", "object", "Strukturert kilde-erklæring: type, url, title, retrieved"],
    ["declaration.citations[]", "array", "Strukturerte sitater: url, paragraph, quote, retrieved"],
    ["process.model", "object", "name, version, provider, temperature, contextWindow"],
    ["process.systemPrompt", "union", "Enten { hash, text } eller { hash, redacted: true, reason }"],
    ["process.pipeline?", "array", "Valgfri liste over PipelineStep"],
    ["alignment.uncertainty[]", "array", "Strukturerte usikkerhets-flagg: { field, reason, severity }"],
    ["alignment.flags?", "array", "Kategoriske flagg: { code, detail? }"],
    ["alignment.policy", "object", "{ id, version } — påkrevd"],
    ["alignment.refusal?", "object", "{ reason } når modellen avslo å svare"],
    ["alignment.humanReviewRequired", "boolean", "Krever menneskelig review"],
    ["timestamp.claimed", "ISO-8601", "Tidspunkt fra TSA (eller dev-fallback)"],
    ["timestamp.tsaToken", "base64", "RFC 3161 TSA-token"],
    ["timestamp.tsaUrl", "string", "TSA som ga stempelet"],
    ["ledger.id", "UUIDv7", "Stabil unik ID"],
    ["ledger.prevHash", "sha256", "SHA-256 av forrige envelope (000... for første)"],
    ["ledger.hash", "sha256", "SHA-256 av canonicalJson(envelope − ledger.hash)"],
    ["signatures[]", "array", '{ role: "instance" | "human-reviewer", algorithm: "ed25519", keyRef, signature, certChain }'],
  ];

  const ROWS_EN: Array<[string, string, string]> = [
    ["tsp", '"3.0"', "Spec version (literal)"],
    ["content.type", "enum", '"text" | "document" | "structured"'],
    ["content.value", "string", "The AI output, plain text or serialised document"],
    ["content.hash", "sha256", "SHA-256 hex of canonicalJson(value)"],
    ["declaration.primarySource", "object", "Structured source declaration: type, url, title, retrieved"],
    ["declaration.citations[]", "array", "Structured citations: url, paragraph, quote, retrieved"],
    ["process.model", "object", "name, version, provider, temperature, contextWindow"],
    ["process.systemPrompt", "union", "Either { hash, text } or { hash, redacted: true, reason }"],
    ["process.pipeline?", "array", "Optional list of PipelineStep entries"],
    ["alignment.uncertainty[]", "array", "Structured uncertainty flags: { field, reason, severity }"],
    ["alignment.flags?", "array", "Categorical flags: { code, detail? }"],
    ["alignment.policy", "object", "{ id, version } — required"],
    ["alignment.refusal?", "object", "{ reason } when the model declined to answer"],
    ["alignment.humanReviewRequired", "boolean", "Requires human review"],
    ["timestamp.claimed", "ISO-8601", "Timestamp from TSA (or dev fallback)"],
    ["timestamp.tsaToken", "base64", "RFC 3161 TSA token"],
    ["timestamp.tsaUrl", "string", "TSA that issued the stamp"],
    ["ledger.id", "UUIDv7", "Stable unique ID"],
    ["ledger.prevHash", "sha256", "SHA-256 of previous envelope (000... for the first)"],
    ["ledger.hash", "sha256", "SHA-256 of canonicalJson(envelope − ledger.hash)"],
    ["signatures[]", "array", '{ role: "instance" | "human-reviewer", algorithm: "ed25519", keyRef, signature, certChain }'],
  ];

  const ROWS = isEn ? ROWS_EN : ROWS_NO;

  type ImplRow = { lang: string; status: string; href?: string };
  const IMPLS_NO: ImplRow[] = [
    { lang: "TypeScript", status: "Reference", href: "/docs#quick-start" },
    { lang: "JavaScript", status: "Inkludert i TS" },
    { lang: "Python", status: "Planned" },
    { lang: "Go", status: "Planned" },
    { lang: "Rust", status: "Planned" },
    { lang: "C#", status: "Planned" },
  ];
  const IMPLS_EN: ImplRow[] = [
    { lang: "TypeScript", status: "Reference", href: "/docs#quick-start" },
    { lang: "JavaScript", status: "Bundled with TS" },
    { lang: "Python", status: "Planned" },
    { lang: "Go", status: "Planned" },
    { lang: "Rust", status: "Planned" },
    { lang: "C#", status: "Planned" },
  ];
  const IMPLS = isEn ? IMPLS_EN : IMPLS_NO;

  const CHANGES_NO = [
    { version: "3.0.0-alpha.5", date: "2026-04-30", notes: "Alignment-schema bump + riskSink. 101 SDK-tester. Launch-ready bundle (alpha).", current: true },
    { version: "3.0.0-alpha.3", date: "2026-04-30", notes: "Phase 3: RFC 3161 TSA-binding + DANE/TLSA-lookup. 97 tester." },
    { version: "3.0.0-alpha.2", date: "2026-04-30", notes: "Phase 2: manifest-basert PKI med org-rot + instans-cert. tsp CLI. 64 tester." },
    { version: "3.0.0-alpha.1", date: "2026-04-29", notes: "Phase 1: schema + lokal sign/verify. Ed25519, RFC 8785, 10 navngitte verify-checks. 33 tester." },
    { version: "2.x", date: "2026-01 → 04", notes: "Pre-v3 confidence-score-modell. Erstattet av strukturert uncertainty[] og policy-versjonering i v3." },
  ];
  const CHANGES_EN = [
    { version: "3.0.0-alpha.5", date: "2026-04-30", notes: "Alignment-schema bump + riskSink. 101 SDK tests. Launch-ready bundle (alpha).", current: true },
    { version: "3.0.0-alpha.3", date: "2026-04-30", notes: "Phase 3: RFC 3161 TSA binding + DANE/TLSA lookup. 97 tests." },
    { version: "3.0.0-alpha.2", date: "2026-04-30", notes: "Phase 2: manifest-based PKI with org root + instance cert. tsp CLI. 64 tests." },
    { version: "3.0.0-alpha.1", date: "2026-04-29", notes: "Phase 1: schema + local sign/verify. Ed25519, RFC 8785, 10 named verify checks. 33 tests." },
    { version: "2.x", date: "2026-01 → 04", notes: "Pre-v3 confidence-score model. Replaced by structured uncertainty[] and policy versioning in v3." },
  ];
  const CHANGES = isEn ? CHANGES_EN : CHANGES_NO;

  return (
    <>
      {/* Hero strip */}
      <section className="tsp-hero-surface border-b border-border">
        <div className="tsp-container py-12 md:py-16">
          <nav className="tsp-section-marker mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-ink no-underline">TSP</Link>
            <span className="opacity-40">·</span>
            <span className="text-ink">{t("breadcrumb")}</span>
          </nav>

          <div className="tsp-section-eyebrow mb-5">
            <span className="tsp-section-num tsp-section-num--accent">{t("eyebrowChip")}</span>
            <span className="tsp-section-label">{t("eyebrowLabel")}</span>
          </div>

          <h1 className="mb-5 max-w-3xl">{t("h1")}</h1>
          <p className="text-ink text-lg mb-8 max-w-2xl leading-relaxed">{t("lead")}</p>

          <div className="flex flex-wrap gap-3">
            <Link href="/playground" className="tsp-btn-primary">
              <Code2 className="w-4 h-4" /> {t("ctaPlayground")}
            </Link>
            <Link href="/verify" className="tsp-btn-secondary">
              {t("ctaVerify")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/docs" className="tsp-btn-secondary">
              <BookOpen className="w-4 h-4" /> {t("ctaApi")}
            </Link>
          </div>
        </div>
      </section>

      <div className="tsp-container py-12">

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        <nav className="lg:sticky lg:top-20 lg:self-start space-y-1 text-sm">
          <NavItem href="#overview">{t("navOverview")}</NavItem>
          <NavItem href="#structure">{t("navStructure")}</NavItem>
          <NavItem href="#hashing">{t("navHashing")}</NavItem>
          <NavItem href="#chain">{t("navChain")}</NavItem>
          <NavItem href="#jsonld">{t("navJsonld")}</NavItem>
          <NavItem href="#implementations">{t("navImplementations")}</NavItem>
          <NavItem href="#extensions">{t("navExtensions")}</NavItem>
          <NavItem href="#pii">{t("navPii")}</NavItem>
          <NavItem href="#changelog">{t("navChangelog")}</NavItem>
          <NavItem href="#governance">{t("navGovernance")}</NavItem>
        </nav>

        <div className="space-y-14 max-w-3xl">
          <Section id="overview" title={isEn ? "Overview" : "Oversikt"}>
            {isEn ? (
              <p>
                A <strong>TrustEnvelope</strong> is a JSON object that wraps an AI response with three
                structured fields — <code className="tsp-code">declaration</code> (source declaration),{" "}
                <code className="tsp-code">process</code> (process log) and{" "}
                <code className="tsp-code">alignment</code> (alignment metadata) — plus a{" "}
                <code className="tsp-code">timestamp</code> (RFC 3161 TSA), a{" "}
                <code className="tsp-code">ledger</code> entry (id, prevHash, hash) and a{" "}
                <code className="tsp-code">signatures[]</code> list (Ed25519). The envelope is stored in an
                append-only log where each new entry is cryptographically linked to the previous via SHA-256.
              </p>
            ) : (
              <p>
                En <strong>TrustEnvelope</strong> er et JSON-objekt som pakker et AI-svar med tre strukturerte
                felter — <code className="tsp-code">declaration</code> (kilde-erklæring),{" "}
                <code className="tsp-code">process</code> (prosess-logg) og{" "}
                <code className="tsp-code">alignment</code> (alignment-metadata) — pluss en{" "}
                <code className="tsp-code">timestamp</code> (RFC 3161 TSA), en{" "}
                <code className="tsp-code">ledger</code>-entry (id, prevHash, hash) og en{" "}
                <code className="tsp-code">signatures[]</code>-liste (Ed25519). Envelope-en lagres i en
                append-only-logg der hver ny entry lenkes kryptografisk til forrige via SHA-256.
              </p>
            )}
            <div className="my-6 p-5 bg-verify/5 border border-verify/30 rounded-xl">
              <div className="tsp-eyebrow text-verify mb-2">{isEn ? "What TSP v3.0 guarantees" : "Hva TSP v3.0 garanterer"}</div>
              {isEn ? (
                <p className="text-sm text-ink/80 leading-relaxed mb-3">
                  v3.0 is a <strong>full cryptographic provenance stack</strong>: signature, timestamp,
                  cert chain and hash chain. Every link can be verified independently of the vendor.
                </p>
              ) : (
                <p className="text-sm text-ink/80 leading-relaxed mb-3">
                  v3.0 er en <strong>full kryptografisk proveniens-stakk</strong>: signatur, tidsstempel,
                  cert-kjede og hash-kjede. Hvert ledd kan verifiseres uavhengig av leverandør.
                </p>
              )}
              <ul className="text-sm space-y-1.5 text-ink/80 list-disc pl-5">
                {isEn ? (
                  <>
                    <li>
                      <strong>Author attestation:</strong> Ed25519 signature over RFC 8785 canonicalised envelope
                      (excl. <code className="tsp-code">signatures</code>, <code className="tsp-code">ledger.hash</code>,
                      <code className="tsp-code">timestamp.tsaToken</code>).
                    </li>
                    <li>
                      <strong>Time attestation:</strong> RFC 3161 TSA stamp over hash of (envelope − tsaToken),
                      with sequential multi-TSA fallback and fingerprint whitelist.
                    </li>
                    <li>
                      <strong>PKI:</strong> Manifest-based with org root + instance cert; signed manifest
                      retrieved via well-known URL or DNS DANE.
                    </li>
                    <li>
                      <strong>Hash chain:</strong> ledger.hash binds backwards; tampering with an old envelope
                      breaks every later hash.
                    </li>
                    <li>
                      <strong>Rollback detection:</strong> sequence state with signed-issuedAt catches replay
                      of older envelopes.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <strong>Forfatter-attestasjon:</strong> Ed25519-signatur over RFC 8785-kanonikalisert envelope
                      (eks. <code className="tsp-code">signatures</code>, <code className="tsp-code">ledger.hash</code>,
                      <code className="tsp-code">timestamp.tsaToken</code>).
                    </li>
                    <li>
                      <strong>Tids-attestasjon:</strong> RFC 3161 TSA-stempel over hash av (envelope − tsaToken),
                      med sequential multi-TSA fallback og fingerprint-whitelist.
                    </li>
                    <li>
                      <strong>PKI:</strong> Manifest-basert med org-rot + instans-cert, signert manifest
                      hentes via well-known URL eller DNS DANE.
                    </li>
                    <li>
                      <strong>Hash-kjede:</strong> ledger.hash-binding bakover; manipulasjon av en gammel
                      envelope brekker alle senere hasher.
                    </li>
                    <li>
                      <strong>Rollback-deteksjon:</strong> sekvens-state med signed-issuedAt fanger replay
                      av eldre envelopes.
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="my-6 p-5 bg-gradient-to-br from-brand/5 to-verify/5 border border-brand/20 rounded-xl">
              <div className="tsp-eyebrow text-brand mb-2">{isEn ? "Core invariant" : "Kjerne-invariant"}</div>
              {isEn ? (
                <p className="text-ink font-medium leading-relaxed">
                  Given an envelope E and its stored hash h,{" "}
                  <code className="tsp-code">SHA-256(canonicalJson(E \ ledger.hash))</code> shall equal{" "}
                  <code className="tsp-code">h</code>. Otherwise the envelope is invalid.
                </p>
              ) : (
                <p className="text-ink font-medium leading-relaxed">
                  Gitt en envelope E og dens lagrede hash h, skal{" "}
                  <code className="tsp-code">SHA-256(canonicalJson(E \ ledger.hash))</code> være lik{" "}
                  <code className="tsp-code">h</code>. Ellers er envelope-en ugyldig.
                </p>
              )}
            </div>
          </Section>

          <Section id="structure" title={isEn ? "Structure" : "Strukturen"}>
            {isEn ? (
              <p>
                All fields in the table below are <strong>normative</strong>. Fields marked{" "}
                <code className="tsp-code">?</code> are optional.
              </p>
            ) : (
              <p>
                Alle felter i tabellen under er <strong>normative</strong>. Felter merket{" "}
                <code className="tsp-code">?</code> er valgfrie.
              </p>
            )}

            <div className="mt-4 tsp-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="text-left p-3">{isEn ? "Field" : "Felt"}</th>
                    <th className="text-left p-3">{isEn ? "Type" : "Type"}</th>
                    <th className="text-left p-3">{isEn ? "Description" : "Beskrivelse"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs">
                  {ROWS.map(([f, ty, desc]) => (
                    <Row key={f} field={f} type={ty} desc={desc} />
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="hashing" title={isEn ? "Hashing — canonicalJson rule" : "Hashing — canonicalJson-regel"}>
            {isEn ? (
              <p>
                The hash is computed over a <strong>canonical</strong> serialisation of the envelope fields
                (excluding <code className="tsp-code">ledger.hash</code> itself). The canonicalisation is
                defined as follows:
              </p>
            ) : (
              <p>
                Hashen beregnes over en <strong>kanonisk</strong> serialisering av envelope-felter (unntatt
                <code className="tsp-code">ledger.hash</code> selv). Kanonikaliseringen er bestemt slik:
              </p>
            )}
            <ol className="list-decimal list-inside mt-3 space-y-1.5 text-sm text-ink/80">
              {isEn ? (
                <>
                  <li>Primitive values are serialised as <code className="tsp-code">JSON.stringify</code>.</li>
                  <li>Arrays are serialised recursively with <code className="tsp-code">canonicalJson</code>.</li>
                  <li>Objects: keys are sorted alphabetically before serialisation.</li>
                  <li>No whitespace, no trailing commas, no BOM.</li>
                  <li><code className="tsp-code">undefined</code> and functions are removed.</li>
                </>
              ) : (
                <>
                  <li>Primitive verdier serialiseres som <code className="tsp-code">JSON.stringify</code>.</li>
                  <li>Arrays serialiseres rekursivt med <code className="tsp-code">canonicalJson</code>.</li>
                  <li>Objekter: nøkler sorteres alfabetisk før serialisering.</li>
                  <li>Ingen whitespace, ingen trailing commas, ingen BOM.</li>
                  <li><code className="tsp-code">undefined</code> og funksjoner fjernes.</li>
                </>
              )}
            </ol>
            <CodeBlock
              lang="typescript"
              code={`export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + canonicalJson(obj[k])).join(",") + "}";
}`}
            />
            <p className="text-sm text-muted mt-3">
              {isEn
                ? "This rule is fully deterministic — same input, same hash — across languages and platforms."
                : "Denne regelen er fullstendig deterministisk — samme input, samme hash — på tvers av språk og plattformer."}
            </p>
          </Section>

          <Section id="chain" title={isEn ? "Chain mechanism" : "Kjedemekanisme"}>
            {isEn ? (
              <p>
                Every new envelope references the previous via{" "}
                <code className="tsp-code">ledger.prevHash</code>. This forms a hash chain that makes
                tampering visible:
              </p>
            ) : (
              <p>
                Hver nye envelope refererer til forrige via <code className="tsp-code">ledger.prevHash</code>.
                Dette lager en hash-kjede som gjør manipulasjon synlig:
              </p>
            )}
            <div className="my-6 p-6 border border-border rounded-xl bg-paper">
              <ChainVisualizer blocks={5} variant="light" />
            </div>
            <ul className="mt-4 space-y-2 text-sm text-ink/80">
              {isEn ? (
                <>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-verify shrink-0 mt-0.5" />
                    A valid chain: each <code className="tsp-code">prevHash</code> matches the previous envelope&apos;s <code className="tsp-code">hash</code>.
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-verify shrink-0 mt-0.5" />
                    Change one letter in an old answer and the hashes from that point on break.
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-verify shrink-0 mt-0.5" />
                    Verification is O(n) and trivially parallelisable.
                  </li>
                </>
              ) : (
                <>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-verify shrink-0 mt-0.5" />
                    En gyldig kjede: hver <code className="tsp-code">prevHash</code> matcher forrige envelope sin <code className="tsp-code">hash</code>.
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-verify shrink-0 mt-0.5" />
                    Endre én bokstav i et gammelt svar, og hashene fra det punktet brytes.
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-verify shrink-0 mt-0.5" />
                    Verifisering er O(n) og triviell parallelliserbar.
                  </li>
                </>
              )}
            </ul>
          </Section>

          <Section id="jsonld" title={isEn ? "JSON-LD context" : "JSON-LD kontekst"}>
            {isEn ? (
              <p>
                TSP can be serialised as JSON-LD by pointing <code className="tsp-code">@context</code> at
                the official context:
              </p>
            ) : (
              <p>
                TSP kan serialiseres som JSON-LD ved å peke <code className="tsp-code">@context</code> på
                den offisielle konteksten:
              </p>
            )}
            <CodeBlock
              lang="json"
              code={`{
  "@context": "https://truststandardprotocol.org/context/v3.jsonld",
  "@type": "TrustEnvelope",
  "tsp": "3.0",
  "content": { "type": "text", "value": "Du har rett på AAP fordi...", "hash": "a3f8...d91c" },
  "declaration": { "primarySource": { ... }, "citations": [ ... ] },
  "process": { "model": { ... }, "systemPrompt": { ... }, "pipeline": [ ... ] },
  "alignment": { "uncertainty": [], "policy": { "id": "default", "version": "1.0" }, ... },
  "timestamp": { "claimed": "...", "tsaToken": "...", "tsaUrl": "..." },
  "ledger": { "id": "...", "prevHash": "...", "hash": "..." },
  "signatures": [ { "role": "instance", "algorithm": "ed25519", ... } ]
}`}
            />
            <p className="text-sm text-muted mt-3">
              {isEn
                ? "The context maps every field to a stable IRI so envelopes can be indexed and queried with standard semantic-web tooling (SPARQL, RDF, Schema.org)."
                : "Konteksten mapper hvert felt til et stabilt IRI slik at envelope-er kan indekseres og queryes med standard semantic-web-verktøy (SPARQL, RDF, Schema.org)."}
            </p>
          </Section>

          <Section id="implementations" title={isEn ? "Implementations" : "Implementasjoner"}>
            <p>
              {isEn
                ? "TSP is designed to be trivial to implement in any language with SHA-256 support."
                : "TSP er designet for å være trivielt å implementere i et hvilket som helst språk med SHA-256-støtte."}
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {IMPLS.map((i) => (
                <Impl key={i.lang} lang={i.lang} status={i.status} href={i.href} isEn={isEn} />
              ))}
            </div>
            <div className="mt-6 tsp-card p-4 bg-paper">
              <div className="flex gap-3 items-start">
                <GitBranch className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <div className="text-sm text-muted">
                  {isEn
                    ? "Want to contribute an implementation? The fork is MIT — send us a link and it will be listed here."
                    : "Vil du bidra med en implementasjon? Forken er MIT — send oss en lenke, så listes den her."}
                </div>
              </div>
            </div>
          </Section>

          <Section id="extensions" title={isEn ? "Extensions (post-v3.0)" : "Utvidelser (post-v3.0)"}>
            {isEn ? (
              <p>
                The following extensions are not part of the v3.0 normative core, but are specified here for
                implementations that need stronger trust properties. Ed25519 signing, RFC 3161 TSA and
                manifest PKI are already part of the v3.0 core.
              </p>
            ) : (
              <p>
                Følgende utvidelser er ikke en del av v3.0 normativ kjerne, men spesifiseres her for
                implementasjoner som trenger sterkere trust-egenskaper. Ed25519-signering, RFC 3161-TSA
                og manifest-PKI er allerede del av v3.0-kjernen.
              </p>
            )}

            <h3 className="text-lg font-bold mt-5 mb-2">{isEn ? "TSP-Anchor · external time binding" : "TSP-Anchor · ekstern tids-binding"}</h3>
            {isEn ? (
              <p className="text-sm">
                Every Nth envelope (or once per day) the ledger owner anchors a merkle root of the
                since-last-anchor range to an independent time service — in addition to the per-envelope
                RFC 3161 TSA stamp already in the core. Two recommended mechanisms:
              </p>
            ) : (
              <p className="text-sm">
                Hver N-te envelope (eller hver dag) ankrer ledger-eieren en merkle root av siden-forrige-anker
                til en uavhengig tids-tjeneste — i tillegg til den per-envelope RFC 3161-TSA-stempelet
                som allerede ligger i kjernen. To anbefalte mekanismer:
              </p>
            )}
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
              {isEn ? (
                <>
                  <li>
                    <strong>OpenTimestamps</strong> — free, anchors against Bitcoin block headers via calendar
                    servers. Recommended for open ledgers.
                  </li>
                  <li>
                    <strong>Multi-TSA aggregated anchor</strong> — N envelopes hash to a merkle root, the root
                    is stamped by several TSAs in parallel. Reduces per-envelope TSA cost at volume.
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <strong>OpenTimestamps</strong> — gratis, anker mot Bitcoin block headers via calendar-
                    servere. Anbefalt for åpne ledgers.
                  </li>
                  <li>
                    <strong>Multi-TSA aggregert anker</strong> — N envelopes hashes til en merkle root,
                    root stemples av flere TSA-er parallelt. Reduserer per-envelope TSA-kost ved
                    volumdrift.
                  </li>
                </>
              )}
            </ul>
            {isEn ? (
              <p className="text-sm mt-2">
                Anchor proofs are stored in an <code className="tsp-code">anchors[]</code> table and
                referenced from envelopes via <code className="tsp-code">ledger.anchorId?</code>.
              </p>
            ) : (
              <p className="text-sm mt-2">
                Anker-bevisene lagres i en <code className="tsp-code">anchors[]</code>-tabell og refereres
                fra envelope-er via <code className="tsp-code">ledger.anchorId?</code>.
              </p>
            )}

            <h3 className="text-lg font-bold mt-5 mb-2">{isEn ? "TSP-Tombstone · revocation without breaking the chain" : "TSP-Tombstone · revokering uten å bryte kjeden"}</h3>
            {isEn ? (
              <p className="text-sm">
                A tombstone envelope is a special envelope where{" "}
                <code className="tsp-code">content.type</code> is{" "}
                <code className="tsp-code">"tombstone"</code> and{" "}
                <code className="tsp-code">content.value</code> is a structured revocation message{" "}
                (<code className="tsp-code">{`{ target: <ledger.id>, reason }`}</code>). It is used to mark a
                previous envelope as revoked without physically removing it from the chain — which would
                break hash integrity.
              </p>
            ) : (
              <p className="text-sm">
                En tombstone-envelope er en spesiell envelope hvor{" "}
                <code className="tsp-code">content.type</code> er{" "}
                <code className="tsp-code">"tombstone"</code> og{" "}
                <code className="tsp-code">content.value</code> er en strukturert revokerings-melding{" "}
                (<code className="tsp-code">{`{ target: <ledger.id>, reason }`}</code>). Den brukes for
                å markere en tidligere envelope som tilbakekalt uten å fysisk slette den fra kjeden —
                noe som ville brutt hash-integriteten.
              </p>
            )}
          </Section>

          <Section id="pii" title={isEn ? "PII and the right to erasure (GDPR Art. 17)" : "PII og rett til sletting (GDPR Art. 17)"}>
            {isEn ? (
              <p>
                Immutable hash chains create tension with GDPR Art. 17 (right to erasure). TSP resolves this
                with two specified patterns — implementations shall pick one when{" "}
                <code className="tsp-code">content</code> may contain personal data.
              </p>
            ) : (
              <p>
                Immutable hash-kjeder skaper en spenning med GDPR Art. 17 (rett til sletting). TSP løser
                dette med to spesifiserte mønstre — implementasjoner skal velge ett av dem når{" "}
                <code className="tsp-code">content</code> kan inneholde personopplysninger.
              </p>
            )}

            <h3 className="text-lg font-bold mt-5 mb-2">{isEn ? "Pattern A · Hash-only ledger" : "Mønster A · Hash-only ledger"}</h3>
            {isEn ? (
              <p className="text-sm">
                <code className="tsp-code">content</code> is replaced by{" "}
                <code className="tsp-code">contentHash</code> (SHA-256 of the plaintext). The plaintext
                response itself is stored in a separate encrypted blob store (e.g. S3 with SSE-KMS) which{" "}
                <em>is</em> erasable. The chain preserves proof that a particular answer existed without
                exposing its content.
              </p>
            ) : (
              <p className="text-sm">
                <code className="tsp-code">content</code> erstattes med{" "}
                <code className="tsp-code">contentHash</code> (SHA-256 av klartekst). Selve klartekst-svaret
                lagres i en separat krypterte blob-store (f.eks. S3 med SSE-KMS) som <em>er</em> slettbar.
                Kjeden bevarer beviset om at et bestemt svar fantes, uten å eksponere innholdet.
              </p>
            )}
            <CodeBlock
              lang="json"
              code={`{
  "tsp": "3.0",
  "content": {
    "type": "redacted",
    "hash": "a3f8...d91c",
    "ref": "kms://eu-north-1/bucket/object#v=42"
  },
  "declaration": { ... },
  "process": { ... },
  "alignment": { ... },
  "timestamp": { ... },
  "ledger": { ... },
  "signatures": [ ... ]
}`}
            />

            <h3 className="text-lg font-bold mt-5 mb-2">{isEn ? "Pattern B · Tombstone" : "Mønster B · Tombstone"}</h3>
            {isEn ? (
              <p className="text-sm">
                When a user demands erasure, a tombstone envelope is published (see Extensions). The
                implementation <em>may</em> additionally overwrite{" "}
                <code className="tsp-code">content</code> in the original envelope with a placeholder
                (<code className="tsp-code">"[REDACTED:GDPR-17]"</code>) — this breaks the hash for that one
                envelope, and verification returns{" "}
                <code className="tsp-code">{`{ valid: false, reason: "redacted" }`}</code> (distinct from{" "}
                <code className="tsp-code">"tampered"</code>). The chain remains verifiable from the
                tombstone onwards.
              </p>
            ) : (
              <p className="text-sm">
                Når en bruker krever sletting, publiseres en tombstone-envelope (se Utvidelser).
                Implementasjonen <em>kan</em> i tillegg overskrive{" "}
                <code className="tsp-code">content</code> i original envelope med en placeholder
                (<code className="tsp-code">"[REDACTED:GDPR-17]"</code>) — dette brekker hash-en for den
                ene envelope-en, og verifisering returnerer{" "}
                <code className="tsp-code">{`{ valid: false, reason: "redacted" }`}</code> (forskjellig fra{" "}
                <code className="tsp-code">"tampered"</code>). Kjeden fortsetter å være verifiserbar fra
                tombstone-en og fremover.
              </p>
            )}

            {isEn ? (
              <p className="text-sm mt-4">
                <strong>Recommendation:</strong> Pattern A for new deployments. Pattern B for retrofitting
                existing ledgers that were not designed with separation. Both patterns must be documented in
                the controller&apos;s DPIA.
              </p>
            ) : (
              <p className="text-sm mt-4">
                <strong>Anbefaling:</strong> Mønster A for nye deployments. Mønster B for retrofitting
                eksisterende ledgere som ikke ble designet med separasjon. Begge mønstre må dokumenteres i
                kontrollerens DPIA.
              </p>
            )}
          </Section>

          <Section id="changelog" title="Changelog">
            <div className="mt-4 space-y-4 border-l-2 border-border pl-5 relative">
              {CHANGES.map((c) => (
                <Change
                  key={c.version}
                  version={c.version}
                  date={c.date}
                  notes={c.notes}
                  current={c.current}
                  isEn={isEn}
                />
              ))}
            </div>
          </Section>

          <Section id="governance" title={isEn ? "Governance" : "Styring"}>
            {isEn ? (
              <p>
                TSP is maintained by LexiCo AS under the <strong>MIT licence</strong>. Changes to the spec
                follow a simple process:
              </p>
            ) : (
              <p>
                TSP vedlikeholdes av LexiCo AS under <strong>MIT-lisens</strong>. Endringer i spec-en følger
                en enkel prosess:
              </p>
            )}
            <ol className="list-decimal list-inside mt-3 space-y-1.5 text-sm text-ink/80">
              {isEn ? (
                <>
                  <li>Proposals are filed as a GitHub issue with the label <code className="tsp-code">spec-change</code>.</li>
                  <li>Breaking changes require a new major (v4.0.0) and at least 90 days&apos; notice.</li>
                  <li>Backwards-compatible extensions go in a minor (v3.x.0).</li>
                  <li>Bug fixes in normative text go in a patch (v3.0.x).</li>
                </>
              ) : (
                <>
                  <li>Forslag fremmes som GitHub issue med label <code className="tsp-code">spec-change</code>.</li>
                  <li>Brytende endringer krever ny major (v4.0.0) og minst 90 dagers varsel.</li>
                  <li>Bakoverkompatible utvidelser legges i minor (v3.x.0).</li>
                  <li>Feilrettinger i normativ tekst går i patch (v3.0.x).</li>
                </>
              )}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/docs" className="tsp-btn-primary">
                {isEn ? "API documentation" : "API-dokumentasjon"} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/verify" className="tsp-btn-verify">
                {isEn ? "Try verification" : "Prøv verifisering"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Section>
        </div>
      </div>
      </div>
    </>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="block px-3 py-1.5 rounded text-muted hover:text-brand hover:bg-brand/5">
      {children}
    </a>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 pb-2 border-b flex items-center gap-2">
        <FileCode className="w-6 h-6 text-brand" />
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
    <div className="my-4 rounded-xl overflow-hidden border border-ink/10">
      <div className="bg-ink/90 text-gray-400 text-xxxs font-mono uppercase tracking-widest px-4 py-1.5 border-b border-white/10">
        {lang}
      </div>
      <pre className="bg-ink text-gray-100 text-xs font-mono p-4 overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function Row({ field, type, desc }: { field: string; type: string; desc: string }) {
  return (
    <tr>
      <td className="p-3 font-mono text-brand">{field}</td>
      <td className="p-3 font-mono text-muted">{type}</td>
      <td className="p-3 text-ink/80">{desc}</td>
    </tr>
  );
}

function Impl({ lang, status, href, isEn }: { lang: string; status: string; href?: string; isEn: boolean }) {
  const ready = status === "Reference" || status === "Inkludert i TS" || status === "Bundled with TS";
  if (href) {
    return (
      <Link href={href} className="flex items-center justify-between tsp-card p-3 hover:border-brand/40">
        <div className="flex items-center gap-2">
          <Package className={`w-4 h-4 ${ready ? "text-verify" : "text-muted"}`} />
          <span className="font-semibold">{lang}</span>
        </div>
        <span className={`text-xs font-mono ${ready ? "text-verify" : "text-muted"}`}>{status}</span>
      </Link>
    );
  }
  return (
    <div className="flex items-center justify-between tsp-card p-3">
      <div className="flex items-center gap-2">
        <Package className={`w-4 h-4 ${ready ? "text-verify" : "text-muted"}`} />
        <span className="font-semibold">{lang}</span>
      </div>
      <span className={`text-xs font-mono ${ready ? "text-verify" : "text-muted"}`}>{status}</span>
    </div>
  );
}

function Change({ version, date, notes, current, isEn }: { version: string; date: string; notes: string; current?: boolean; isEn?: boolean }) {
  return (
    <div className="relative">
      <span
        className={`absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 ${
          current ? "bg-brand border-brand" : "bg-white border-border-strong"
        }`}
      />
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-mono font-bold text-brand">v{version}</span>
        <span className="text-xs text-muted">{date}</span>
        {current && <span className="tsp-pill border-verify/40 text-verify bg-verify/5">{isEn ? "current" : "current"}</span>}
      </div>
      <div className="text-sm text-ink/80 mt-1">{notes}</div>
    </div>
  );
}
