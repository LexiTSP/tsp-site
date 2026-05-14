# Hva er TSP?

> En samlet, menneskelig forklaring av hva Trust Standard Protocol er, hva det gjør, hvorfor det finnes, hvilke deler repoet inneholder, og hva som er klart per 2026-05-13.

---

## Kortversjonen

**TSP, Trust Standard Protocol, er en åpen standard for etterprøvbar AI-proveniens.**

Når et AI-system lager et svar, pakker TSP svaret inn i en kryptografisk signert `TrustEnvelope`. Den envelope-en binder sammen:

- hva AI-en svarte,
- hvilke kilder svaret bygger på,
- hvilken modell og prosess som ble brukt,
- hvilken policy, risiko- og alignment-vurdering som gjaldt,
- tidspunkt, signatur og hash-kjede.

Poenget er enkelt: **en mottaker, kunde eller revisor skal kunne kontrollere AI-svaret senere uten å stole blindt på leverandørens database, skjermbilder eller eksporterte logger.**

Hvis noen endrer ett tegn i svaret eller metadataene etter signering, vil verifikasjonen feile.

---

## Hva TSP ikke er

TSP er lett å misforstå hvis man plasserer det i feil kategori. Det er derfor viktig å si hva det ikke er:

- TSP er ikke en AI-modell.
- TSP er ikke en chatbot.
- TSP er ikke en eval-suite.
- TSP er ikke en policy-motor.
- TSP er ikke bare et dashboard.
- TSP er ikke en SaaS-logg som krever at LexiCo alltid er mellomledd.

TSP er en **protokoll og referanseimplementasjon** for å gjøre AI-output etterprøvbar.

Den kan brukes av mange typer AI-systemer, uavhengig av modellleverandør, så lenge systemet kan pakke outputen i TSP-formatet.

---

## Problemet TSP løser

Regulerte AI-systemer må kunne svare på spørsmål som:

- Hvilken modell laget dette svaret?
- Hvilken systemprompt eller prosess ble brukt?
- Hvilke kilder bygget svaret på?
- Var svaret endret etter at det ble generert?
- Hvem godkjente det hvis menneskelig vurdering var påkrevd?
- Kan en revisor kontrollere dette uten tilgang til leverandørens interne systemer?

I dag ligger mye av dette i svake former:

- logger i en leverandørs database,
- CSV-eksporter,
- usignerte HTTP-headere,
- manuelle notater,
- skjermbilder,
- "audit trail"-visninger som kunden egentlig bare må stole på.

TSP flytter beviset nærme selve AI-svaret. Det som skal etterprøves, blir signert, hashet og strukturert på output-nivå.

---

## Kjerneideen: TrustEnvelope

En `TrustEnvelope` er TSPs viktigste datastruktur.

Den er en signert pakke rundt en AI-output. Pakken inneholder blant annet:

| Del | Forklaring |
|---|---|
| `source` | Hvor faktagrunnlaget kom fra, for eksempel lovparagrafer, dokumenttreff, intern kunnskapsbase eller eksplisitt "ingen kilde nødvendig". |
| `process` | Modell, modellversjon, systemprompt eller prosesserklæring, pipeline-steg og annen prosessmetadata. |
| `alignment` | Risiko, domene, policy-versjon, refusal-årsak, flagg og klassifiseringer. |
| `ledger` | Hash-kjede, envelope-ID, forrige envelope og tidsstempel. |
| `contentHash` | SHA-256-hash av det kanoniske innholdet. |
| `signatures` | Ed25519-signaturer fra organisasjonens eller instansens nøkler. |
| `manifestRef` | Peker til organisasjonens TSP-manifest, slik at nøkler og sertifikater kan verifiseres. |

For at verifikasjon skal fungere likt på tvers av implementasjoner, canonicaliseres JSON med RFC 8785 for hashing og signering. TSP bruker Ed25519-signaturer, SHA-256-hasher og støtte for RFC 3161-tidsstempling.

---

## Hvordan flyten fungerer

### 1. AI-systemet lager et svar

Et vanlig AI-system produserer et svar til en bruker, saksbehandler, intern ansatt eller annen mottaker.

### 2. TSP wrapper svaret

SDK-en kaller `wrap()` og lager en `TrustEnvelope` med innhold, kilde, prosess, alignment og ledger-data.

### 3. Envelope-en signeres

Innholdet canonicaliseres, hashes og signeres. Dette binder svaret og metadataene sammen kryptografisk.

### 4. Mottaker kan verifisere

Senere kan en mottaker eller revisor bruke `verifyLocal()` eller online manifest-oppslag til å kontrollere:

- at signaturen er gyldig,
- at innholdet ikke er endret,
- at sertifikatkjeden er gyldig,
- at nøkkelen ikke er revokert,
- at ledger-kjeden henger sammen,
- at source, process og alignment er korrekt strukturert.

### 5. Valgfrie verktøy kan kobles på

Hvis organisasjonen trenger mer enn standarden alene, kan Risk, Evidence og Oversight bruke envelope-streamen til alarmer, revisjonspakker og menneskelig oppsyn.

---

## De to sonene i TSP

TSP er bygget med en tydelig deling mellom gratis standard og betalte verktøy.

### Standard-sonen

Dette er den åpne delen som skal kunne leve uten LexiCo:

- TSP-spesifikasjonen.
- `@lexitsp/sdk`.
- CLI for manifest, nøkler og verifikasjon.
- `@lexitsp/trustbadge-react`.
- Playground, docs, eksempler og lokal verifikasjon.

Denne sonen er standardiseringsflaten. Den skal være enkel å ta i bruk, inspisere, forke og kreve i anskaffelser.

### Verktøy-sonen

Dette er convenience-laget som LexiCo kan ta betalt for:

- **Risk**: tar imot envelope-pointers, aggregerer signaler og lager signerte alarmer.
- **Evidence**: bygger revisjons- og compliance-pakker fra verifiserte runtime-artefakter.
- **Oversight**: kø for menneskelig vurdering, claim/release/decide-flyt og signerte reviewer-beslutninger.
- **Control Plane**: intern/hosted pilot-alpha for drift, nøkkelrotasjon, helsesjekker og metering.

Kunden kan bygge egne verktøy mot standarden. LexiCos ferdige verktøy er kommersielle.

---

## Hva repoet inneholder

Dette repoet er en standalone TSP-workspace. Det betyr at nettstedet og pakkene ligger samlet her.

Viktige deler:

- `src/app/[locale]/` inneholder Next.js-nettstedet på norsk og engelsk.
- `messages/` inneholder i18n-tekster.
- `packages/lexitsp-sdk/` inneholder TypeScript SDK-en.
- `packages/trustbadge-react/` inneholder React-komponenten.
- `packages/risk-server/` inneholder Risk-backend alpha.
- `packages/evidence-server/` inneholder Evidence-backend alpha.
- `packages/oversight-server/` inneholder Oversight-backend alpha.
- `packages/control-plane-server/` inneholder hosted pilot control-plane alpha.
- `docs/` inneholder forklaring, quickstart, charter, readiness-audit, launch-dokumentasjon og runbooks.
- `fixtures/` inneholder interoperabilitets- og testvektorer.
- `scripts/` inneholder release-, smoke-, manifest- og claim-sjekker.
- `tsp.bat` er et Windows-kontrollpanel for lokal drift.

---

## Hvem TSP er for

### For utviklere

TSP gir en konkret SDK og et wire-format for å signere, verifisere og vise AI-output med proveniens. Utvikleren får `wrap()`, `verifyLocal()`, manifestflyt, CLI og TrustBadge i stedet for å finne opp et eget audit-format.

### For compliance, jurister og revisorer

TSP gir etterprøvbare artefakter som kan kontrolleres uten å stole på leverandørens interne systemer. Dette er spesielt relevant for EU AI Act, ISO 42001, offentlig sektor og andre regulerte miljøer.

### For ledere og innkjopere

TSP gir en måte å stille krav til AI-leverandører: AI-output skal kunne leveres med verifiserbar kilde-, prosess- og risikodeklarasjon. Det gjør compliance mindre avhengig av muntlige garantier og mer avhengig av kontrollerbare bevis.

### For AI-leverandører

TSP gir en måte å eksportere tillit uten å eksportere hele infrastrukturen. Leverandøren kan gi kunden en signert envelope i stedet for bare en intern loggvisning.

---

## Hva som faktisk er klart nå

Status per 2026-05-13: TSP er en sterk public-alpha bundle, men ikke et ferdig selvbetjent SaaS-produkt.

Klart eller nær alpha-klart:

- SDK-en har bred testdekning og er den sterkeste komponenten.
- TrustBadge finnes som React-komponent med tester.
- Nettstedet bygger lokalt som Next.js-site med norsk og engelsk innhold.
- Public alpha manifest-ruter finnes lokalt.
- Risk, Evidence og Oversight er reelle backend-alphaer.
- Det finnes runbooks for de kommersielle backend-modulene.
- Rotkommandoen `bun run check` bygger sitet, kjører package-tester og typechecker serverpakkene.

Det som fortsatt ikke bør overselges:

- Risk er ikke et ferdig SaaS-dashboard.
- Evidence er ikke en ferdig "one button PDF to auditor"-opplevelse.
- Oversight har alpha-portal, men ikke en polert reviewer-suite.
- Full self-serve SaaS er fortsatt planlagt, ikke ferdig shipped; alpha-fokuset er hosted pilot og operatørstyrt control plane.
- Ekstern release krever fortsatt public GitHub/npm/domain/manifest-hosting og launch-herding.

Den mest realistiske kommersielle pakken nå er en smal **TSP Tools Pilot**: ett kundeløp, ett AI-workflow, Risk ingest, Oversight review og Evidence dossier.

---

## Hvorfor dette er viktig

AI-regulering handler ofte om dokumentasjon, men dokumentasjon alene er svak hvis den kan skrives om etterpå. TSP prøver å gjøre dokumentasjonen teknisk bundet til outputen.

Det endrer ansvarsbildet:

- Kunden trenger ikke bare stole på leverandøren.
- Leverandøren kan vise hva systemet faktisk gjorde.
- Revisoren kan teste artefakter direkte.
- Sluttbrukeren kan få et synlig bevis på at et svar er signert og uendret.

TSP lover ikke at AI-en alltid har rett. Det lover ikke at kildene alltid er gode. Det lover ikke at policyen alltid var klok.

Det TSP lover, når det er riktig implementert, er at det blir mulig å etterprøve hva systemet på et gitt tidspunkt erklærte at det gjorde.

Det er en mindre, men mye mer presis og nyttig garanti.

---

## Hvordan man kommer i gang

For å kjøre prosjektet lokalt:

```bash
bun install
bun run dev
```

Sitet kjører normalt på:

```text
http://localhost:3838
```

For å bygge:

```bash
bun run build
```

For å kjøre bred lokal sjekk:

```bash
bun run check
```

For release-orientert kontroll:

```bash
bun run check:release
```

---

## Les videre

- `README.md` for repo-layout, kommandoer og status.
- `docs/WHAT-IS-TSP.md` for 30-sekunders forklaringen.
- `docs/TSP-OVERSIKT.md` for full norsk teknisk oversikt.
- `docs/ABOUT.md` for en lengre kontekstuell forklaring.
- `docs/PRODUCT_READINESS_AND_SKUS.md` for hva som er klart, hva som er alpha, og hva som ikke skal overselges.
- `docs/QUICKSTART.md` for teknisk start.
- `docs/charter.md` for prinsippene bak språket og arkitekturen.
- `COMMERCIAL_TERMS.md` for skillet mellom gratis standard og kommersielle verktøy.
