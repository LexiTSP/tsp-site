# Om TSP — Trust Standard Protocol

> Et selvstendig om-dokument. Dekker hva TSP er, hvorfor det finnes, hvem det er for, hvordan det fungerer, hvem som bygger det, og hvor det er på vei. Skrevet for å kunne leses uten å først kjenne LexiCo, EU AI Act, eller PKI-litteratur — men uten å forenkle vekk det som faktisk er bærende.
>
> For den tekniske referansen som vedlikeholdes per release: se `docs/TSP-OVERSIKT.md`. For de bærende prinsippene: `docs/charter.md`. Dette dokumentet er innfartsporten — det fortolker, kontekstualiserer og holder ærligheten på plass.

---

## 1 · Hva TSP er

**TSP — Trust Standard Protocol — er en åpen standard som gjør hver enkelt AI-utgang etterprøvbar uavhengig av leverandøren som genererte den.**

Konkret: hver gang et AI-system produserer et svar, wrapper TSP svaret i en kryptografisk signert datastruktur kalt en **`TrustEnvelope`**. Envelope-en inneholder ikke bare svaret, men også en eksplisitt erklæring om *hvor faktagrunnlaget kom fra* (kilde), *hvilken modell og prosess som ble brukt* (prosess), og *hvilken risikoklassifisering og policy-versjon som ble anvendt* (alignment). Hele strukturen signeres med Ed25519, tidsstemples med en RFC 3161-godkjent tidsstemplings­myndighet, kjedes til forrige envelope via en hash-lenke, og kan etterprøves av hvem som helst — i nettleseren, uten å spørre LexiCo eller leverandøren.

TSP er **ikke**:

- Ikke en AI-modell. TSP genererer ingenting; det wrapper det modellen produserer.
- Ikke en eval-suite. TSP måler ikke kvalitet; det dokumenterer proveniens.
- Ikke en policy-motor. TSP håndhever ikke regler; det gjør det mulig å verifisere at reglene ble fulgt.
- Ikke en SaaS-logger. TSP er en åpen protokoll; loggen er det signerte formatet, ikke en database.

TSP **er**:

- Et **wire-format** (`TSP/3.0`) — en kanonikalisert JSON-struktur med klar schema-kontrakt.
- En **referanse-implementasjon** (`@lexitsp/sdk`, MIT) — TypeScript-bibliotek for å lage og verifisere envelopes.
- En **UI-komponent** (`@lexitsp/trustbadge-react`, MIT) — drop-in React-badge som viser envelope-status til sluttbruker.
- En **valgfri verktøy-sone** (Risk + Evidence + Oversight) — betalte tjenester for organisasjoner som ikke vil bygge alarmer, auditor-eksport og oversight-køer selv.

Posisjonell kategori: **«etterprøvbar AI-proveniens»**. Tidligere markedsføringsmetafor «HTTPS for AI» er forlatt. Charteret §6 (språk = arkitektur) krever at vokabularet ikke overstiger det formatet faktisk garanterer — TSP er ikke en transport-protokoll, så den ikke skal omtales som en.

---

## 2 · Hvorfor TSP eksisterer

### 2.1 Det regulatoriske presset

EU AI Act trer i kraft trinnvis fra **2026-08-02** for høyrisiko-AI-systemer. Loven krever blant annet:

- **Art. 9** — risikostyringssystem som dekker hele livssyklusen.
- **Art. 12** — automatisk hendelseslogg som er etterprøvbar over hele systemets levetid.
- **Art. 13** — transparens overfor sluttbruker om hva systemet gjorde og hvorfor.
- **Art. 14** — reell mulighet for mennesker til å gripe inn (human oversight).
- **Art. 15** — robusthet, nøyaktighet og cybersikkerhet.
- **Art. 17** — kvalitetsstyringssystem for leverandøren.

Loven sier *hva* som må bevises, ikke *hvordan*. Markedet løser dette i dag med:

- Logg-CSV-er fra SaaS-leverandørenes egen database (kan endres uten spor).
- Modell-versjonsnummer i HTTP-header (ikke signert, ikke kjedet).
- «Audit trail»-skjermbilder (ingen kryptografisk binding mellom logg og svar).
- Manuelle prosesser som dokumenterer hvilken systemprompt som *kanskje* ble brukt.

Ingen av disse er etterprøvbare i den forstand at en uavhengig revisor kan rekonstruere hva som faktisk skjedde uten å stole på leverandøren. Det betyr at organisasjoner som *vil* etterleve loven, fortsatt er eksponert hvis loggen blir korrumpert, hvis leverandøren bytter modell stille, eller hvis kilde-grunnlaget viser seg å være hallusinert.

### 2.2 Den underliggende svikten

Tilliten i AI-stack-en er i dag **transitiv**: brukeren stoler på applikasjonen, applikasjonen stoler på leverandøren, leverandøren stoler på sin egen logg-pipeline. Hvert ledd er et potensielt brudd­punkt, og brudd er usynlige fordi det ikke finnes en kryptografisk binding fra svar til kilde.

TSP løser dette ved å snu rekkefølgen: **selve svaret blir det som signeres**. Loggen er ikke ved siden av svaret; loggen *er* svaret, kanonikalisert og signert. Når svaret er signert, er kilde- og prosess-deklarasjonene en del av signaturen. Endrer noen ett tegn — i svaret, i kilde-listen, i modell-versjonen — slår verifikasjonen feil. Matematisk, ikke politisk.

### 2.3 Markedsdynamikken

Posisjonelt løser TSP tre samtidige problemer:

- **For AI-leverandører:** En måte å eksportere compliance-byrden uten å eksportere kundedata. Du gir kunden en envelope, kunden eier verifikasjonen.
- **For AI-kunder (regulert sektor):** En kontraktuell mekanisme som gir dem rett til å verifisere uten leverandørens samarbeid — og dermed reell forhandlingsposisjon.
- **For revisorer/regulatorer:** En struktur som gjør stikkprøver mulige uten at de må ha tilgang til leverandørens infrastruktur.

Dette skiller TSP fra «AI governance»-produkter som lever inne i én leverandørs sky. TSP er bevisst designet for å overleve LexiCo som selskap — referanse-implementasjonen er MIT, spec-en er CC-BY 4.0, og standarden kan adopteres av en konkurrent dagen etter at LexiCo skulle slutte å eksistere.

---

## 3 · Hvem TSP er for

TSP har tre primære brukergrupper, og dokumentasjonen, sitet og SDK-en er bevisst skrevet for å treffe alle tre uten å vanne ut noen.

### 3.1 Compliance- og juristrollen

«Jeg må kunne vise en revisor at hvert svar borgeren fikk var basert på riktig lovgrunnlag, og at vi kan rekonstruere hva som skjedde da klagen kom inn tre måneder senere.»

For denne rollen leverer TSP: signert kilde-erklæring per svar, hash-kjedet hendelseslogg, RFC 3161-tidsstempling, og en `verifyLocal()`-funksjon som kjører i revisorens egen nettleser. Dette dekker AI Act Art. 12 og Art. 13 i form som matcher det loven faktisk krever — etterprøvbar, ikke bare arkivert.

### 3.2 Utvikler- og arkitektrollen

«Jeg integrerer en LLM mot brukerflaten, og må kunne vise produkteier at vi har en oppgrad­erbar audit-sti uten å låse oss til én vendor.»

For denne rollen leverer TSP: TypeScript SDK med `wrap()`/`verifyLocal()`, en `tsp` CLI for manifest- og PKI-håndtering, drop-in React-badge med 24 tester, og en sovereign-by-default arkitektur som ikke krever LexiCo i prod-stacken. Standarden er åpen — du kan implementere den selv på et annet språk og fortsatt være interoperabel.

### 3.3 Leder- og produktrollen

«Jeg trenger å vite hva dette kommer til å koste, hva det forplikter oss til, og hva det gir oss som ikke en CSV-eksport gir.»

For denne rollen leverer TSP: en tydelig prismodell (gratis standard / betalte verktøy / public-sector avtale), kommersiell lisens på convenience-laget, og en sovereign-fallback som gjør at kunden aldri sitter fast hvis LexiCo forsvinner. Beslutningen er reversibel.

### 3.4 Sekundære grupper

- **Regulatorer** (Datatilsynet, EU AI Office, sektor-tilsyn) — TSP gir et stikkprøve-format som ikke krever inspek­sjons­tilgang til leverandøren.
- **Akkvisisjons-DD** — TSP gjør AI-implementasjoner i et oppkjøpsobjekt verifiserbare uten å måtte stole på selger­ens dokumentasjon.
- **Forskere/akademia** — CC-BY 4.0-spec-en gjør at TSP kan brukes som referanse-arkitektur i forskning på AI-ansvarlighet.

---

## 4 · Hvordan TSP fungerer — arkitekturen

### 4.1 To soner

TSP er bevisst delt i to lag, som begge kan kjøres uavhengig:

```
┌──────────────────────────────────────────────────────────────┐
│  STANDARD-SONE  ·  MIT  ·  sovereign-by-default              │
│  ─────────────────────────────────────────────────           │
│  @lexitsp/sdk                  wrap, verifyLocal, manifest, CLI
│  @lexitsp/trustbadge-react     UI-komponent for sluttbruker
│  Playground + verify           lokal signering, tamper-demo og verifikasjon
└──────────────────────────────────────────────────────────────┘
                       │
                  TrustEnvelope (signert)
                       │
┌──────────────────────────────────────────────────────────────┐
│  VERKTØY-SONE  ·  kommersiell lisens  ·  valgfritt           │
│  ─────────────────────────────────────────────────           │
│  Risk          alarmer + envelope-aggregat (charter §10)
│  Evidence      auditor-pakker (charter §11, ingen permanent storage)
│  Oversight     human-review-kø (charter §7, ingen AI-foreslag)
└──────────────────────────────────────────────────────────────┘
```

**Standard-sonen** er det som *må* fungere uten LexiCo. Du kan kjøre TSP fullt ut på din egen infrastruktur med bare SDK + manifest + en signaturnøkkel. Ingen vendor lock-in på protokoll-nivå.

**Verktøy-sonen** er forretningsmodellen: betalte hosted eller on-prem verktøy som tar de operasjonelle smertene du ellers ville bygget selv. Hver av dem snakker mot åpne API-er, så om du vil bygge egne alternativer senere, er ikke dataene fanget.

### 4.2 Anatomien til en TrustEnvelope

Hvert envelope har fire strukturerte felter pluss krypto­materiale:

| Felt | Hva det er |
|---|---|
| `source` | **Kilde-erklæring**. Lovdata-paragrafer, vektor-DB-hits, intern KB. Eksplisitt `{ provided: false, reason: "no-source-needed" }` for opinion eller refusal — fravær er aldri stille. |
| `process` | **Prosess-logg**. Modell-ID, modell-versjon, systemprompt (eller eksplisitt redaksjons-erklæring), pipeline-steg, parametere som påvirker outputen. |
| `alignment` | **Alignment-metadata**. Risikonivå, domene-tag, refusal-årsak, flags, policy-versjon. |
| `ledger` | Posisjon i hash-kjeden: `id`, `previousEnvelopeId`, `chainHash`, `tsaTimestamp`. |

Pluss:

- `contentHash` — SHA-256 av RFC 8785-canonicalized JSON av selve svar-innholdet.
- `signatures[]` — Ed25519-signaturer fra utstederens instans-nøkkel + eventuelle delegerte nøkler.
- `manifestRef` — peker til organisasjonens TSP-manifest (PKI-rot).

Alt canonicaliseres med **RFC 8785 (JCS)** før hashing/signering. Dette er den deterministiske JSON-formen som gjør at to implementasjoner produserer identiske bytes for samme objekt — uten det kan ikke verifikasjon krysse implementasjoner.

Domeneseparasjon: `sigDomain` og `ledgerDomain` brukes som prefiks før signering, slik at samme nøkkel ikke kan misbrukes på tvers av lag (signering vs. ledger-binding).

### 4.3 Schema-prinsippet: eksplisitt deklarasjon

Det viktigste designvalget i TSP-schema-en er **forbudet mot taus optionality**. Hvis et felt kan være tomt, må det erklære *hvorfor* det er tomt:

```ts
type SourceField =
  | { provided: true; references: SourceReference[] }
  | { provided: false; reason: "no-source-needed" | "redacted-confidential" | "model-only" }
```

Dette er ikke estetikk. Det er charter §3: en revisor kan ikke skille slurv fra design hvis fravær er stille. En logg hvor `systemPrompt` er `null` betyr ingenting; en logg hvor `systemPrompt: { provided: false, reason: "redacted-confidential" }` er en deklarasjon med ansvar.

### 4.4 Wrap-flyten

```
AI-svar genereres
    ↓
SDK.wrap({ content, source, process, alignment })
    ↓
canonicalize (JCS) → SHA-256 → contentHash
    ↓
sign(sigDomain || contentHash, instanceKey) → signatures[]
    ↓
chain: previousEnvelopeId + chainHash
    ↓
TSA timestamp (RFC 3161)
    ↓
TrustEnvelope returneres → vises i UI via TrustBadge
                        ↘ sendes som pointer til Risk (valgfritt)
```

### 4.5 Verify-flyten

```
TrustEnvelope mottatt
    ↓
hent manifest (cache 5 min) eller DANE-lookup
    ↓
verifyLocal(envelope, manifest) kjører 10 sjekker:
   1.  canonical-rebuild → contentHash match
   2.  signature-verify mot manifest-cert
   3.  cert-chain mot org-root
   4.  cert-not-revoked
   5.  ledger-chain konsistent
   6.  TSA-timestamp gyldig (mot operatør-konfigurert trustlist)
   7.  previousEnvelopeId eksisterer (hvis ikke første)
   8.  alignment-schema-form
   9.  source-erklæring well-formed
   10. process-erklæring well-formed
    ↓
VerifyResult { ok, checks[], failures[] }
```

Verifiseringen kjører klient-side. Ingen LexiCo-avhengighet. Ingen leverandør­avhengighet. Hvis manifestet er tilgjengelig (HTTP eller DANE), kan en hvilken som helst nettleser etterprøve et envelope.

### 4.6 Plattform-flyten (valgfritt)

```
SDK.wrap() → riskSink.publish(pointer)
                  ↓
              Risk-server lagrer pointer + alignment-metadata
              (IKKE innhold — charter §11)
                  ↓
              regel-eval (closed JSON DSL) → alarm? → HMAC-webhook → Oversight
                                                              ↓
                                                          ReviewItem opprettes
                                                              ↓
                                                          Reviewer claim → decide
                                                              ↓
                                                          client-side sign (WebCrypto extractable=false)
                                                              ↓
                                                          ReviewEnvelope (tsp-review-1.0)
                                                              ↓
                                                          pruner ReviewItem.envelope_json (charter §11)

Auditor ber om pakke → Evidence-server
                          ↓
                      Risk: gi meg pointers for periode/domene
                          ↓
                      Kunde-API: gi meg innhold for disse pointer-IDene
                          ↓
                      ZIP med envelopes + verify-rapport
```

Tre detaljer som er bærende:

- **Risk lagrer aldri innhold permanent.** Bare pointers og alignment-metadata. Innhold ligger fortsatt hos kunden.
- **Oversight-reviewere får aldri se AI-foreslåtte sammendrag eller anbefalinger** (charter §7, håndhevet i tre lag — type-system, CI-grep, runtime-assert).
- **Evidence pakker etter forespørsel** ved å slå opp pointers hos Risk og innhold hos kunden. LexiCo holder aldri fullt envelope-innhold permanent.

---

## 5 · Hvem som bygger TSP

**LexiCo AS** — norsk civic-tech-selskap basert i Tønsberg, grunnlagt og drevet av Julian Andersen Berge (CTO/grunnlegger). LexiCo bygger to ting i parallell:
\n- **TSP** — den åpne standarden for signert, etterprøvbar AI-output. Standarden er selvstendig og nyttig for alle som bygger AI inn i regulert sektor.

Forholdet er bevisst: TSP-spec-en er CC-BY 4.0 og referanse-implementasjonen er MIT, slik at TSP overlever LexiCo som forretningsenhet. Verktøyene (Risk/Evidence/Oversight) er LexiCos kommersielle fundament. Kunden kan alltid implementere standarden selv; LexiCos ferdige verktøy krever betalt lisens.

Charter §8 («eierskap til feil») binder LexiCo til public post-mortems ved sikkerhets- eller tillitsbrudd, til en versjons-yanking-prosedyre dokumentert i SDK CHANGELOG, og til å unngå «users-must-verify»-klausuler i lisensen som ville flyttet ansvar til kunden.

---

## 6 · Hvor TSP står i dag

Status per 2026-05-13 (alpha-launch-ready bundle, **223 grønne tester** totalt — 101 SDK + 24 TrustBadge + 98 plattform-/control-plane-tester):

### Sub-prosjekter shipped

| Sub-prosjekt | Versjon | Tester | Status |
|---|---|---|---|
| `@lexitsp/sdk` (Protokoll v3) | 3.0.0-alpha.5 | 101 | Phase 1+2+3 + I-pluss komplett |
| `@lexitsp/trustbadge-react` | 0.2.1 | 24 | MIT, publish-klar |
| `@lexitsp/risk-server` | 0.1.0-alpha.1 | 31 | Kommersiell lisens |
| `@lexitsp/evidence-server` | 0.1.0-alpha.0 | 30 | Kommersiell lisens |
| `@lexitsp/oversight-server` | 0.1.0-alpha.0 | 23 | Kommersiell lisens, charter §7 i 3 lag |
| Site (truststandardprotocol.org) | — | build grønn | 55 statiske sider, charter §6 ren |

### Nettsiden

Sitet (Next.js 15 + Tailwind + IBM Plex Sans/Mono, government-aktig palett `#1E3A5F`) er fullt internasjonalisert (norsk + engelsk via `next-intl 4.11`, sitemap med hreflang). Det inneholder:

- En **playground** med ekte client-side `@lexitsp/sdk/v3` — `generateKeyPair` + `wrap` + `verifyLocal` i nettleseren, med en tamper-knapp som re-kjører verifyLocal og viser hash-bruddet matematisk.
- Full **API-referanse** for SDK v3 (`/docs`).
- Formell **spesifikasjon** med JSON-LD context, changelog og governance (`/spec`).
- **EU AI Act-mapping** (artikkel 9, 12, 13, 14, 15, 17) som binder hvert lov-krav til en konkret schema-mekanisme i TSP.
- **Modul-sider** med dual-audience-skriving («I praksis:» først, «Teknisk:» etter).

### Hva som gjenstår før v1.0

**Eksterne blockere (ikke i vår kontroll):**

- Første eksterne pilot — første publiserte real-world-tall for installasjonstid, artifact-kvalitet og auditor-friksjon.

**Scoped fremtidsarbeid (kommer i senere versjoner):**

- Hardware-token v1.1 — HSM/PKCS#11-backed reviewer-nøkler som alternativ til WebCrypto `extractable=false`.
- Full v3 nettleser-playground — shipped som lokal sign/tamper-demo med `verifyLocal`; full paste-and-verify mot eksterne manifester gjenstår.
- TSA-trust-konfigurasjoner — SDK shipper med `DEFAULT_TRUSTED_TSAS = []` (charter §6: vi hevder ikke tillit vi ikke har inspisert). Når v1.0-kunder ber om det, vil vi publisere referanse-fingerprints for vanlige eIDAS-godkjente TSA-er.

---

## 7 · Charteret — det normative grunnlaget

**TSP-charteret** er bindende for kode, dokumentasjon og kommunikasjon i hele workspace-et. Charteret er ikke en intensjonserklæring; hver paragraf peker mot kompilert, testbar adferd. Et brudd er en kode-feil, ikke en stilistisk preferanse.

Tolv paragrafer, oppsummert:

1. **§1 Brukeren først** — fysiske personen hvis sak håndteres er primær interessent. Sovereign-by-default.
2. **§2 Etterprøvbarhet over tillit** — matematisk verifikasjon, ikke organisatorisk velvilje.
3. **§3 Eksplisitt deklarasjon over taus optionality** — schema-unioner tvinger fravær til å begrunnes.
4. **§4 Schema er kontrakt** — `@context` obligatorisk, semver, migrasjonstester.
5. **§5 Åpen standard, åpen referanse** — CC-BY 4.0 spec, MIT SDK, tom default TSA-trustlist.
6. **§6 Språk er arkitektur** — marketing kan ikke overstige det koden gjør. «HTTPS for AI» og «Proof of X» er forbudt.
7. **§7 AI foreslår ikke oppsyn** — reviewer møter materialet uten LLM-genererte sammendrag eller anbefalinger.
8. **§8 Eierskap til feil** — LexiCo eier rotårsaks-analysen, ikke brukeren.
9. **§9 Versjon og endring** — semver, frosne wire-versjoner, migrasjons-fixtures.
10. **§10 Envelope-aggregering, aldri brukere** — Risk aggregerer over signerte envelopes, ikke over personer.
11. **§11 Data-minimering** — innhold prunes ved decide-time, ikke «vi husker å slette senere».
12. **§12 Charter-endringer** — major-bumps krever skriftlig begrunnelse, migrasjonsanalyse og audit-log.

Hver paragraf har en konkret håndhevelses­mekanisme — type-system, CI-test, runtime-assert, eller schema-validering — dokumentert i charterets Vedlegg A.

---

## 8 · Teknisk stack — bevisste valg

| Lag | Valg | Hvorfor |
|---|---|---|
| Krypto | Ed25519, SHA-256, WebCrypto API | Standard, native i alle moderne runtimes, ingen native-dependencies |
| Canonicalization | RFC 8785 (JCS) | Eneste deterministiske JSON-canonical-form med markedstraksjon |
| Tidsstempling | RFC 3161 TSA | EU-godkjente TSA-er finnes; PKI er moden |
| PKI | Manifest med org-root + instance-certs | Selvhostet, ingen CA-avhengighet; DANE som alternativ |
| SDK runtime | TypeScript, Bun + Node | Bun for hastighet i backends, Node for bredde-kompatibilitet |
| Backend-pakker | Bun + Hono + bun:sqlite | Single-binary deploy, embedded DB, lav drifts­overflate |
| Site | Next.js 15 + Tailwind, IBM Plex Sans/Mono, next-intl 4.11 | Government-aktig estetikk, dev-vennlig, fullt i18n NO/EN |
| Filter-DSL | Closed JSON DSL (eq/exists/in/contains/and/or/not) | Ingen `eval`, ingen RCE-overflate; alarm-regler er deklarative |
| Webhook-auth | HMAC-SHA256 med timing-safe sammenligning | Standard, enkel, fungerer overalt |
| Reviewer-keys | WebCrypto `extractable=false` | Server kan aldri eksfiltrere reviewer-nøkler |

Test-strategi: `vitest` for SDK + TrustBadge, `bun test` for backends (vitest-via-vite kan ikke resolve `bun:sqlite`).

---

## 9 · Lisensiering og distribusjon

| Komponent | Lisens | Distribusjon |
|---|---|---|
| `@lexitsp/sdk` | MIT | npm (publish-klar) |
| `@lexitsp/trustbadge-react` | MIT | npm (publish-klar) |
| TSP spesifikasjon | CC-BY 4.0 | github.com/Lexi-Co/* + `/spec` på sitet |
| Risk / Evidence / Oversight | Kommersiell lisens; kildekode tilgjengelig for lisensierte kunder | LexiCo-hostet eller on-prem |

Sovereign-first: standarden kan implementeres uten LexiCo. Ferdige LexiCo-verktøy kan leveres hosted eller on-prem under kommersiell lisens.

---

## 10 · Hvor du finner mer

- `docs/TSP-OVERSIKT.md` — teknisk single-source, oppdateres per release.
- `docs/charter.md` — de bærende prinsippene.
- `docs/WHAT-IS-TSP.md` — kort forklaring for nye lesere.
- `docs/QUICKSTART.md` — rask teknisk start.
- `docs/LAUNCH-CHECKLIST.md` — pre-launch-status og remaining items.
- `tsp.bat` — Windows-kontrollpanel (start sitet på `http://localhost:3838`, kjør tester, bygg).
- Sitet selv (`/spec`, `/docs`, `/playground`) — kjør den selv og se hvordan envelopene oppfører seg.

---

## 10.5 · GDPR ↔ AI Act-rekonsiliering

Et naturlig spørsmål: hva skjer når GDPR Art. 17 (right to erasure) møter AI Act Art. 12 (logge­krav over hele systemets levetid)? Tilsynelatende et catch-22 — sletting vs. bevaring.

TSP løser dette arkitektonisk, ikke bare juridisk. Tre mekanismer som virker sammen:

1. **Envelope er prosess-metadata, ikke personopplysning.** Råinnhold lever i kundens primær-database; envelope bærer `contentHash`, ikke selve innholdet. Art. 17 har strukturelt ingen krav på envelope-en.
2. **Crypto-shredding for unntak.** I sjeldne tilfeller hvor personopplysninger må inn i envelope, krypteres innhold med per-subjekt-nøkkel og hash-kjeden går over chiffertekst. Nøkkel-destruksjon ved legitim Art. 17-krav gjør plaintext uoppnåelig — kjeden består.
3. **Hvorfor-feltene (kilde/prosess/alignment) kan ikke slettes.** De er prosess-metadata som AI Act Art. 13/14/86 + GDPR Art. 22(3) krever skal eksistere. Charter §3 avviser stille fravær på schema-nivå.

Resultat: TSP er strukturelt umulig å misbruke for å komme rundt enten AI Act eller GDPR. En aktør som koordinerer Art. 17-krav for å slette kompromitterende AI-logger, etterlater synlig kjede-mønster og bryter samtidig AI Act Art. 12/13/86 — ikke en compliance-handling, men svindel forkledd som personvern.

Full normativ profil: `docs/spec/reconciliation.md`.

---

## 11 · Et siste ord om ærlighet

TSP er bygget av ett menneske som skriver kode, et charter som måler kommunikasjonen mot koden, og en bevisst beslutning om at *standarden er viktigere enn selskapet*. Hvis dette dokumentet hevder noe som ikke matcher kildekoden, er dokumentet feil — ikke koden. Charter §6 sier det klart: språket er arkitektur, og overflater som overstiger arkitekturen er en charter-overtredelse.

Per 2026-05-13 er statusen denne: protokollen er feature-komplett gjennom Phase 3, de kommersielle verktøymodulene og hosted pilot control-plane har 98 grønne tester sammenlagt, og sitet er charter §6-rent på alle ruter × NO/EN. Ingen overflate hevder «i produksjon» der det ikke er sant.

Det er ikke ferdig. Det er *ærlig om hva som er ferdig*. Det er forskjellen TSP er bygget for å gjøre.

---

*Sist oppdatert 2026-05-09. Skrevet for å være selvstendig — en leser uten forhåndskunnskap om LexiCo, EU AI Act eller PKI skal kunne lese dette og forstå hva TSP er, hvorfor det finnes, og hvor det er på vei, uten å først lese kildekoden.*
