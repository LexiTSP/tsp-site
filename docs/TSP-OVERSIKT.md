# TSP — Trust Standard Protocol

> Komplett dokumentasjon på norsk. Hva TSP er, hva det gjør, hvordan delene henger sammen, og hva som faktisk er bygget per 2026-05-05.

---

## 1. Hva TSP er — i én setning

**TSP er en åpen standard som wrapper hver AI-utgang i en signert, tamper-evident `TrustEnvelope` slik at kilde, prosess og alignment kan etterprøves uavhengig av leverandøren som genererte svaret.**

Det er ikke en modell. Det er ikke en eval-suite. Det er ikke en policy-motor.
Det er **en protokoll** — et kryptografisk format og en signaturkjede — pluss en SDK, en TrustBadge-komponent, og tre valgfrie plattform-moduler som henger på protokollen.

Posisjonell kategori: **«Etterprøvbar AI-proveniens.»**
Tidligere markedsføringsmetafor «HTTPS for AI» er forlatt — charter §6 (språk = arkitektur) krever at vokabularet matcher det formatet faktisk garanterer.

---

## 2. Problemet TSP løser

EU AI Act trer i kraft og krever at høyrisiko-AI-systemer kan vise:

- **Art. 12** — automatisk hendelseslogg som kan etterprøves
- **Art. 13** — transparens om hva systemet gjorde og hvorfor
- **Art. 14** — reell mulighet for mennesker til å gripe inn
- **Art. 15** — robusthet og nøyaktighet
- **Art. 17** — kvalitetsstyringssystem

I praksis betyr dette at hver AI-utgang som påvirker en borger må kunne **rekonstrueres etterpå**: hvilken modell, hvilken systemprompt, hvilke kilder, hvilken risikoklassifisering, hvem som godkjente det hvis det krevde mennesker.

Dagens stack løser ikke dette. Logger lever i SaaS-databasen til leverandøren. Kilder finnes ikke i svaret. Modell-versjon ligger i header som ikke er signert. «Audit trail» er en CSV-eksport som kan endres uten spor.

TSP løser det ved å gjøre **selve AI-svaret** til det som er signert og verifiserbart, uavhengig av infrastrukturen rundt.

---

## 3. Kjerneidé — TrustEnvelope

Hver AI-utgang wrappes i en `TrustEnvelope` som inneholder fire strukturerte felter:

| Felt        | Hva det er                                                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`    | **Kilde-erklæring**. Hvor kom faktagrunnlaget fra. Lovdata-paragrafer, vektor-DB-hits, intern KB. Eksplisitt «no-source» for opinion/refusal. |
| `process`   | **Prosess-logg**. Modell, modell-versjon, systemprompt (eller eksplisitt redaksjons-erklæring), pipeline-steg.                                |
| `alignment` | **Alignment-metadata**. Risikonivå, domene-tag, refusal-årsak, flags, policy-versjon.                                                         |
| `ledger`    | Hash-kjede-posisjon: `id`, `previousEnvelopeId`, `chainHash`, `tsaTimestamp`.                                                                 |

Pluss:

- `contentHash` — SHA-256 av canonical JSON av selve svar-innholdet
- `signatures[]` — Ed25519-signaturer fra utstederens instans-nøkkel og evt. delegerte nøkler
- `manifestRef` — peker til kundens TSP-manifest (organisasjonens PKI)

Alt canonicaliseres med **RFC 8785 (JCS)** før hashing/signering. Tidsstempling er **RFC 3161 TSA**. Domeneseparasjon: `sigDomain` og `ledgerDomain` brukes som prefiks før signering så samme nøkkel ikke kan misbrukes på tvers av lag.

Schema-prinsipp (charter): **eksplisitt-deklarasjon over taus optionality**. Hvert felt som *kan* være tomt MÅ ha en union-type som tvinger utstederen til å si hvorfor — `{ provided: false, reason: "no-source-needed" | "redacted" | ... }` — slik at fravær aldri kan forveksles med uforsiktighet.

---

## 4. Arkitektur — to soner

```
┌─────────────────────────────────────────────────────────┐
│                    STANDARD-SONE                         │
│         (MIT-lisens, sovereign-by-default)               │
├─────────────────────────────────────────────────────────┤
│  @lexitsp/sdk           — wrap/verify, manifest, CLI    │
│  @lexitsp/trustbadge-react — UI-komponent (badge+modal) │
│  Playground + verify    — lokal signering og verifikasjon │
└─────────────────────────────────────────────────────────┘
                           │
                  TrustEnvelope (signert)
                           │
┌─────────────────────────────────────────────────────────┐
│                   PLATTFORM-SONE                         │
│              (kommersiell lisens, valgfritt)             │
├─────────────────────────────────────────────────────────┤
│  Risk      — alarmer + envelope-aggregat (charter §10)  │
│  Evidence  — auditor-pakker (charter §11)               │
│  Oversight — human review-kø (charter §7)               │
└─────────────────────────────────────────────────────────┘
```

**Standard-sonen** er det som *må* fungere uten LexiCo. Du kan kjøre TSP fullt out-of-the-box på din egen infra med bare SDK + manifest + en signaturnøkkel. Ingen vendor lock-in på protokoll-nivå.

**Plattform-sonen** er det betalte convenience-laget: hosted eller on-prem verktøy som tar de operasjonelle smertene (alarmer, auditor-eksport og reviewer-kø). Kunden kan bygge egne verktøy mot den åpne standarden, men LexiCos ferdige moduler krever kommersiell lisens.

---

## 5. Sub-prosjektene — hva som faktisk er shipped

Status per 2026-05-13 (alpha-launch-ready bundle, totalt **223 grønne tester** på tvers — 101 SDK + 24 TrustBadge + 98 plattform-/control-plane-tester):

### I. Protokoll v3.0 — `@lexitsp/sdk@3.0.0-alpha.6` (101 tester)

**Phase 1** — schema + lokal sign/verify

- Ed25519 via WebCrypto, SHA-256 via WebCrypto, RFC 8785 canonicalization
- `wrap()` og `verifyLocal()` med 10 navngitte verify-checks
- Property tests via fast-check

**Phase 2** — manifest + PKI

- `tsp` CLI-binær: `manifest init`, `cert add`, `cert revoke`
- Org-root cert + instance-certs + delegerte certs (f.eks. `human-reviewer`)
- Manifest-fetch med 5-min cache

**Phase 3** — TSA + DANE

- RFC 3161 timestamp-binding på envelopes
- DANE/TLSA-lookup som alternativ til manifest-URL

**I+** — alignment-schema-bump + `riskSink` adapter for plattform-modulene

Eksport-stier: `@lexitsp/sdk/v3`, `@lexitsp/sdk/v3/admin`, `@lexitsp/sdk/node`, `@lexitsp/sdk/types`.

### II. `@lexitsp/trustbadge-react@0.2.2` (24 tester)

Drop-in React-komponent. Renderer envelope-status som farget badge (verified / warn / refusal / flagged / policy-blocked). Modal viser alle 6 punkter fra AI Act Art. 13(3)(b) på naturlig norsk. MIT-lisens.

### III.1 `@lexitsp/risk-server@0.1.0-alpha.1` (31 tester)

Hosted alarm-motor. Tar imot envelope-pointers (ikke innhold — charter §10), kjører deterministiske regler over alignment-metadata, sender HMAC-SHA256-signerte webhooks til Oversight når alarmer trigges. Bun + Hono + bun:sqlite.

### III.2 `@lexitsp/evidence-server@0.1.0-alpha.0` (38 tester)

Auditor-pakke-bygger. Slår opp envelope-pointers via Risk + henter innhold fra kundens egen API (charter §11 — vi lagrer aldri innhold permanent). Genererer ZIP med envelopes + verifikasjonsrapport for revisor.

### III.3 `@lexitsp/oversight-server@0.1.0-alpha.0` (25 tester)

### III.4 `@lexitsp/control-plane-server@0.1.0-alpha.0` (4 tester)

Hosted pilot control-plane for operator-managed customers, downstream service key provisioning, health checks and metering export. This is internal alpha tooling, not a self-serve SaaS surface.

Human-in-the-loop reviewer-kø. Tre triggere: Risk-alarmer (auto), kundens deterministiske regler (closed JSON DSL — ingen eval, ingen scripting), manuelle. Reviewer signerer client-side med WebCrypto `extractable=false`. Output er en `ReviewEnvelope` (`tsp-review-1.0`) som binder dommen til opprinnelig `contentHash`.

**Charter §7-håndhevelse** (3-lags forsvar):

1. Type-systemet: `ReviewItem` har ingen felter med navn `summary | analysis | interpretation | suggestion | recommendation | hint | prediction`.
2. `test/charter-7.test.ts`: grep over `src/` feiler hvis noen introduserer dem.
3. Runtime-assert: serialisert `ReviewItem` sjekkes for forbudte keys før sending.

### IV. Site (TSP-repoet) — Pass 1 + Pass 2 + Adoption-pass shipped

**Pass 1** (charter §6-vokabular, v3-bump, two-zone redesign): byttet alle hero-overflater fra v2.0/«HTTPS for AI»/«Proof of»-trippel til v3.0/«etterprøvbar AI-proveniens»/Kilde-erklæring + Prosess-logg + Alignment-metadata. Plex Sans + Plex Mono, government-aktig palett (`#1E3A5F` brand, off-white papir, mono accents).

**Pass 2** (charter §6-konsistens på alle dybde-sider, commit `fa5ffff` + `b650211`):

- `/docs` skrevet om til v3 SDK-API (wrap, verifyLocal, manifest, CLI, TSA/DANE)
- `/spec` jsonld + changelog + governance migrert til v3
- `/eu-ai-act/article-9, 12, 13, 14, 15` har v3-skjema og strukturert uncertainty-modell
- `/priser` Standard/Tools/Public Sector tiers med gratis standard + betalt verktøy-framing
- `/whitepaper` erstattet med ærlig under-rewrite-side
- `/sammenligning` peker til riktige mål
- IntegrationCallout (5 modul-sider) + ChainVisualizer charter §6-rene
- Orphan `/api/wrap*` routes slettet, gammel whitepaper-PDF slettet

**Adoption-pass** (non-technical reader-fokusert, commit `4393a4c`):

- Hero h1: «Vit hvor AI-svaret kommer fra. Og at det ikke er endret.» — plain-language ingress, teknisk paragraf etter
- Ny §2.5 «Hvem er dette for?» med tre audience-frames (compliance/jurist, utvikler/arkitekt, leder/produkt) i førstepersonssitat
- §7 reframet til konkrete handlinger med tidsestimat (5 min / 10 min / kontakt)
- ModuleLayout-taglines + første ModuleSection-intro på alle modul-sider: «I praksis:»-paragraf først, «Teknisk:»-paragraf etter — dual-audience uten kompromiss
- `/priser` ny seksjon «Hvilken plan passer for hvem?» med tre RoleCard-sitater
- **`/playground` full rebuild til ekte client-side `@lexitsp/sdk/v3`** — generateKeyPair + wrap + verifyLocal i nettleseren med skipTsa for dev-modus. 3-stegs guidet flyt med kilde-presets, plain-language resultat-panel, ekte tamper-knapp som re-kjører verifyLocal og viser hash-bruddet, fold-out raw JSON for utviklere.

**Build-status:** 55 statiske sider builder grønt. `bun run next build` passerer. TypeScript strict pass. Playground veier 7.24 kB og Verify veier 3.88 kB (SDK-bundlet — Next.js code-splitting håndterer det).

---

## 6. Hvordan delene henger sammen — flyt

### 6.1 Wrap-flyt (utsteder)

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
                        ↘ sendes som pointer til Risk
```

### 6.2 Verify-flyt (mottaker / revisor)

```
TrustEnvelope mottatt
    ↓
hent manifest (cache 5 min) eller DANE
    ↓
verifyLocal(envelope, manifest):
   1. canonical-rebuild → contentHash match
   2. signature-verify mot manifest-cert
   3. cert-chain mot org-root
   4. cert-not-revoked
   5. ledger-chain konsistent
   6. TSA-timestamp gyldig
   7. previousEnvelopeId eksisterer (hvis ikke første)
   8. alignment-schema-form
   9. source-erklæring well-formed
   10. process-erklæring well-formed
    ↓
VerifyResult { ok, checks[], failures[] }
```

### 6.3 Plattform-flyt (valgfritt)

```
SDK.wrap() → riskSink.publish(pointer)
                  ↓
              Risk-server lagrer pointer + alignment-metadata (IKKE innhold)
                  ↓
              regel-eval → alarm? → HMAC-webhook → Oversight
                                                       ↓
                                                   ReviewItem opprettes
                                                       ↓
                                                   Reviewer claim → decide
                                                       ↓
                                                   client-side sign → ReviewEnvelope
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

---

## 7. Charter — de bærende prinsippene

TSP-charteret er kontrakten alt arbeid måles mot. De viktigste paragrafene:

- **§6 Språk = arkitektur.** Vokabular i kode, docs og UI må matche det formatet faktisk garanterer. «Proof of X» er forbudt fordi det overselger. «Kilde-erklæring» er presist.
- **§7 Ingen AI-foreslått oversight.** Reviewer skal aldri se LLM-genererte sammendrag, forslag eller «tentative vurderinger». Vi automasjons-bias’er ikke mennesker som er der nettopp for å motvirke automasjons-bias.
- **§10 Envelope-aggregering, aldri brukere.** Risk-modulen aggregerer på envelope/alignment-nivå, aldri på bruker- eller person-nivå.
- **§11 Data-minimering.** Plattform-moduler lagrer aldri svar-innhold permanent. Pointers og hashes ja, content nei. Oversight pruner `envelope_json` ved decide.
- **Sovereign-first standard, hosted-default plattform.** Du kan alltid kjøre standarden uten oss. Plattformen er bekvemmelighet.
- **Verifiability beats data sovereignty for meta-hashes.** Meta-hash-strukturer (manifest-pekere, TSA-tokens) kan dele felles infra — sovereignty-kravet gjelder brukerdata, ikke verifiserbar metadata.
- **Eksplisitt-deklarasjons-unioner over taus optionality.** Schema tvinger utsteder til å si *hvorfor* et felt er fraværende.

---

## 8. Teknisk stack

| Lag              | Valg                                               | Hvorfor                                                     |
| ---------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| Krypto           | Ed25519, SHA-256, WebCrypto API                    | Standard, native i alle moderne runtimes, ingen native-deps |
| Canonicalization | RFC 8785 (JCS)                                     | Eneste deterministiske JSON-canonical-form med traksjon     |
| Timestamping     | RFC 3161 TSA                                       | EU-godkjente TSA-er finnes; PKI er moden                    |
| PKI              | Manifest med org-root + instance-certs             | Selvhostet, ingen CA-avhengighet, DANE som alternativ       |
| SDK runtime      | TypeScript, Bun + Node                             | Bun for hastighet i backends, Node for kompatibilitet       |
| Backend-pakker   | Bun + Hono + bun:sqlite                            | Single-binary deploy, embedded DB, kjapp                    |
| Site             | Next.js 15 + Tailwind, IBM Plex Sans/Mono          | Government-aktig, seriøs, dev-vennlig                       |
| Filter-DSL       | Closed JSON DSL (eq/exists/in/contains/and/or/not) | Ingen eval, ingen RCE-overflate                             |
| Webhook-auth     | HMAC-SHA256 timing-safe                            | Standard, enkel, fungerer overalt                           |
| Reviewer-keys    | WebCrypto `extractable=false`                      | Server kan aldri eksfiltrere reviewer-nøkler                |

Test-strategi: vitest for SDK + TrustBadge, **`bun test`** for alle backends (vitest-via-vite kan ikke resolve `bun:sqlite`).

---

## 9. Filsystem-layout

```
TSP/                             # bun-workspace root + nettsted
├── packages/
│   ├── lexitsp-sdk/             # @lexitsp/sdk@3.0.0-alpha.6
│   ├── trustbadge-react/        # @lexitsp/trustbadge-react@0.2.2
│   ├── risk-server/             # @lexitsp/risk-server@0.1.0-alpha.1
│   ├── evidence-server/         # @lexitsp/evidence-server@0.1.0-alpha.0
│   └── oversight-server/        # @lexitsp/oversight-server@0.1.0-alpha.0
├── src/app/                     # /, /core, /risk, /evidence, /oversight,
│                                # /spec, /eu-ai-act/*, /playground, ...
├── docs/TSP-OVERSIKT.md         # dette dokumentet
├── docs/charter.md              # TSP-native prinsipper
├── tsp.bat                      # Windows kontrollpanel (start/stop/build/test)
└── theme.config.ts              # palett, fonts, radii, layout
```

---

## 10. Lisensiering og distribusjon

| Komponent                           | Lisens                                 | Distribusjon               |
| ----------------------------------- | -------------------------------------- | -------------------------- |
| `@lexitsp/sdk`                      | MIT                                    | npm (publish-klar)         |
| `@lexitsp/trustbadge-react`         | MIT                                    | npm (publish-klar)         |
| Spec (TSP-protokollen)              | CC-BY 4.0                              | github.com/LexiTSP/*       |
| Risk / Evidence / Oversight servers | Kommersiell lisens                     | LexiCo-hostet eller on-prem |

Sovereign-first: standarden kan kjøres uten LexiCo. De ferdige plattformmodulene kan leveres hosted eller on-prem under kommersiell lisens.

---

## 11. Hva som gjenstår før full v1.0

**Eksterne blockere (ikke i vår kontroll):**
- **Pilot-bevis** — TSP trenger 3-5 eksterne pilotmiljøer før v1.0 kan hevde markedsklar adopsjon. Inntil da bruker docs og demoer syntetiske eller generiske deployment-eksempler.

**Scoped fremtidsarbeid (ikke v1.0-blockere — kommer i senere versjoner):**
- **Hardware-token v1.1** — HSM/PKCS#11-backed reviewer-nøkler som alternativ til WebCrypto `extractable=false`. Spec-arbeid, ikke launch-blockere.
- **Full v3 nettleser-playground** — lokal sign/tamper-demo er shipped med `@lexitsp/sdk/v3`, Ed25519 og `verifyLocal`. Paste-and-verify mot eksterne manifester/TSA er neste hull før beta.
- **TSA-trust-konfigurasjoner** — SDK shipper med `DEFAULT_TRUSTED_TSAS = []` (charter §6: vi hevder ikke tillit vi ikke har inspisert). Hver operatør konfigurerer egen trust-liste. Når v1.0-kunder ber om det, vil vi publisere referanse-fingerprints for vanlige eIDAS-godkjente TSA-er.

**Charter §6-status: ren.** Alle siden- og komponent-overflater skal beskrive TSP som en standalone protokoll, SDK, TrustBadge og valgfrie moduler. Ingen offentlig overflate skal avhenge av et shelvet eller eksternt produkt for å forklare verdien.

---

## 12. Hvor du finner mer

- **`docs/charter.md`** — det bærende TSP-charteret
- **`docs/WHAT-IS-TSP.md`** — kort introduksjon
- **`docs/QUICKSTART.md`** — rask teknisk start
- **`tsp.bat`** — start sitet lokalt (`http://localhost:3838` + LAN-URLer)
- **Sitet (`/spec`)** — full v3-skjemabeskrivelse på siden

---

*Sist oppdatert 2026-05-05. Skrevet for å være selvstendig — en ny utvikler eller AI skal kunne lese dette og forstå hele systemet uten å lese kildekoden først.*
