# TSP Reconciliation Profile

**Status:** Normativ. Del av `TSP/3.0`-spesifikasjonen.
**Versjon:** 1.0 · 2026-05-09
**Charter-anker:** §1 (brukeren først), §3 (eksplisitt deklarasjon), §10 (envelope-aggregat aldri brukere), §11 (data-minimering).
**Lov-anker:** EU AI Act Art. 12, 13, 14, 17, 86 · GDPR Art. 5(1)(c), 17, 22(3), 30.

> Denne profilen dokumenterer hvordan en TSP-envelope tilfredsstiller AI Act og GDPR samtidig — uten å bryte den ene for å oppfylle den andre. Den er normativ: implementasjoner som hevder TSP-konformans MÅ etterleve denne profilen for at envelopes skal være gyldige under `TSP/3.0`.
>
> Profilen skiller seg fra resten av spec-en ved at den er like mye en juridisk arkitektur som en teknisk en. Den er skrevet for at en DPO, en jurist og en kryptograf skal kunne lese samme dokument og være enige om at det henger sammen.

---

## 1 · Det tilsynelatende dilemmaet

GDPR Art. 17 (right to erasure) sier: den registrerte kan kreve at personopplysninger om hen slettes.
AI Act Art. 12 (logging) sier: høyrisiko-AI MÅ opprettholde automatisk hendelseslogg over hele systemets levetid.

På overflaten ser dette ut som en konflikt: hvis loggen inneholder personopplysninger, kan en bruker invokere Art. 17 og kreve sletting; hvis loggen slettes, brytes Art. 12.

I praksis — som dokumentert av EDPB og en rekke sektorlover (DORA, MiFID II, hvitvaskingsregelverket) — er det ingen reell konflikt. GDPR Art. 17(3)(b) angir eksplisitt at sletteretten **ikke gjelder** når behandlingen er nødvendig for å oppfylle en rettslig forpliktelse i unionsretten eller medlemsstatsretten. AI Act Art. 12 *er* en slik forpliktelse.

Men juridisk dekning beskytter ikke mot **operasjonelt misbruk**. En aktør i ond tro kan koordinere Art. 17-krav for å produsere et synlig sletting-mønster, eller hevde «vi misforsto» og slette logger som svar på falske GDPR-krav. Når tilsynet kommer, er bevisene borte uansett om aktøren straffes.

TSP løser dette **arkitektonisk**, ikke bare juridisk. Følgende tre seksjoner er hvordan.

---

## 2 · Erasure Compatibility (GDPR Art. 17 ↔ AI Act Art. 12)

### 2.1 Designprinsipp: envelope er prosess-metadata, ikke personopplysning

En TSP-envelope MÅ struktureres slik at den i seg selv ikke er en personopplysning i GDPR-forstand. Envelopen identifiserer en **hendelse** (en AI-utgang i et system, på et tidspunkt, mot en policy), ikke en **person**.

Konkret betyr dette:

- `source.references[]` MÅ peke til kunnskapskilder (lovparagrafer, dokument-IDer, vektor-DB-treff), ikke til den fysiske personen som spurte.
- `process.systemPrompt` MÅ være enten faktisk systemprompt eller eksplisitt redaksjons-erklæring — aldri det aktuelle bruker-input.
- `alignment.*` MÅ inneholde policy- og risiko-metadata, ikke bruker-attributter.
- `ledger.*` MÅ være rene krypto-felt (hashes, tidsstempler, ID-er).

Charter §10 (envelope-aggregat aldri brukere) håndhever dette på Risk-modul-nivå: skjema for aggregat-tabeller har ingen `userId`, `sessionId` eller `subjectIdentifier`-fremmednøkler.

**Implikasjon:** Når envelope-en ikke inneholder personopplysninger, har Art. 17 ingen krav på den. Sletteretten gjelder bruker-input og bruker-svar i applikasjons-laget — som lever utenfor envelope-strukturen.

### 2.2 Innhold lever i applikasjon, hash lever i envelope

Charter §11 håndhever dette: «innhold prunes ved decide-time». TSP-arkitekturen forutsetter at det rå AI-svaret og det rå bruker-input lever i kundens **primær-database**, ikke i envelope-en. Envelopen bærer:

- `contentHash` — SHA-256 av canonical JSON av selve svar-innholdet.
- Ikke selve svar-innholdet.

Når brukeren invokerer Art. 17 mot kundens primær-database, slettes svaret der. Envelopen står — den binder fortsatt at *noe som matchet `contentHash`* ble produsert under den prosessen, mot den policyen, på det tidspunktet. Brukerens spor er borte; systemets prosess-spor består.

Dette er den arkitektoniske kjernen: **envelope-en beviser hva systemet gjorde, uten å lagre hvem det gjorde det mot.**

### 2.3 Når personopplysninger likevel må inn i envelope-en — crypto-shredding

I sjeldne tilfeller (f.eks. medisinsk vedtak hvor diagnose-tekst er en del av kilde-erklæringen, eller skattevedtak hvor inntekts-tall er en del av prosess-loggen) kan envelope-en *måtte* inneholde personopplysninger for å være meningsfull som proveniens-bevis.

I disse tilfellene MÅ implementasjonen følge **crypto-shredding-mønsteret**:

1. **Per-subjekt-kryptering:** Personopplysningen krypteres med en symmetrisk nøkkel (AES-256-GCM eller ekvivalent), unik per registrerte person eller per sak.
2. **Hash over chiffertekst:** `contentHash` beregnes over chifferteksten, ikke plaintext. Hash-kjeden går over chiffertekstens hash; kjede-integriteten er uavhengig av plaintext-eksistens.
3. **Nøkkel-livssyklus dokumentert:** Operatøren MÅ dokumentere hvor nøklene lagres, hvem som kan destruere dem, og under hvilke betingelser destruksjon utføres. Dokumentasjonen er en del av kundens GDPR Art. 30-record.
4. **Destruksjon ved legitim Art. 17-forespørsel:** Når en GDPR Art. 17-forespørsel er legitim (brukeren har sletterett, og ingen Art. 17(3)-unntak gjelder), destrueres nøkkelen. Chifferteksten består i envelopen, men plaintext er kryptografisk uoppnåelig.

**Resultat:**
- GDPR Art. 17 oppfylt — personopplysningen er *de facto* slettet (ingen praktisk vei tilbake til plaintext).
- AI Act Art. 12 oppfylt — envelope-strukturen, prosess-metadata, signaturer og hash-kjede står uendret.
- Forsøk på å bryte kjeden er fortsatt detekterbart — du kan slette innhold, men du kan ikke slette at envelope-en eksisterte.

### 2.4 Schema-felt for crypto-shredded innhold

Når et felt er crypto-shredded, MÅ det erklære det eksplisitt (charter §3):

```typescript
type ShreddableField =
  | { provided: true; encryption: { algorithm: "AES-256-GCM"; keyId: string; ciphertext: string }; }
  | { provided: false; reason: "shredded"; shreddedAt: ISO8601; legalBasis: "gdpr-art-17" | "..." }
  | { provided: false; reason: "no-pii-needed" | "redacted-confidential" | "..." }
```

Når nøkkelen destrueres, oppdateres feltet til den andre varianten. Selve envelope-signaturen forblir **uendret** — chifferteksten er fortsatt der, hash-kjeden består. Det er kun *tilgjengeligheten* til plaintext som endres, og dette er deklarert eksplisitt.

### 2.5 Forsvar mot koordinert misbruk

Et bad-faith-scenario: en aktør koordinerer (eller off-books-betaler) flere brukere til å invokere Art. 17 i håp om å fjerne kompromitterende AI-logger.

Hvorfor dette feiler arkitektonisk under TSP:

1. **Envelope-kjeden består.** Plaintext er destruert; chiffertekst, signaturer og hash-kjede står. Aktøren kan ikke slette at hendelsene skjedde.
2. **Hver Art. 17-forespørsel MÅ dokumenteres** under GDPR Art. 30 (DPO-record). Forsvinner dokumentasjonen, er det et separat brudd som er like alvorlig.
3. **Mønsteret er forensisk synlig.** «Alle envelopes relatert til hendelse X fikk nøklene sine destruert i samme uke» er et røde flagg en revisor kan oppdage selv uten plaintext.
4. **Bad-faith-handlingen krenker AI Act Art. 12 direkte** — hvis sletting var feil under Art. 17(3)(b), kan ikke aktøren gjemme seg bak GDPR. Det er svindel forkledd som personvern.

Bunnlinje: angrepet funker mot CSV-logger og proprietær observability. Det funker **ikke** mot en hash-kjedet, kryptografisk separert envelope-arkitektur.

---

## 3 · Explainability Requirements (AI Act Art. 13/14/86 + GDPR Art. 22(3))

### 3.1 «Hvorfor» kan ikke stå blank

Lovverket krever **hvorfor-en** gjennom flere kanaler samtidig:

- **AI Act Art. 13** — transparens overfor deployer: hva systemet gjorde og på hvilket grunnlag.
- **AI Act Art. 14** — human oversight som forutsetter at oversight-personen forstår hvorfor outputen ble som den ble.
- **AI Act Art. 86** (right to explanation) — den fysiske personen som påvirkes har rett til meningsfull forklaring på AI-systemets rolle og de viktigste beslutningselementene.
- **GDPR Art. 22(3)** — ved automatiserte beslutninger har den registrerte rett til meningsfull informasjon om logikken bak.

Begge regimer krever altså at hvorfor-en eksisterer og er tilgjengelig. **Det betyr at hvorfor-feltene i envelope-en ikke er valgfrie.**

### 3.2 Hvilke envelope-felt utgjør «hvorfor-en»

TSP-envelopens tre erklærings­felt er hvorfor-en:

| Felt | Hva det forklarer | Lov-anker |
|---|---|---|
| `source` | På hvilket faktagrunnlag svaret hviler | AI Act Art. 13, 86 |
| `process` | Hvilken modell, versjon, prompt-status, pipeline | AI Act Art. 12, 13, GDPR Art. 22(3) |
| `alignment` | Hvilken risikoklassifisering og policy som ble anvendt | AI Act Art. 9, 13, 14 |

Disse feltene er **prosess-metadata**, ikke personopplysninger. De har ingen Art. 17-overflate — de identifiserer hva systemet gjorde, ikke hvem det gjorde det mot. Bad-faith-aktørens vei kollapser her: hen kan ikke be brukere om å Art. 17-slette feltene, fordi feltene ikke er brukerens persondata.

Sletter aktøren dem selv (uten lov-grunnlag), bryter aktøren samtidig:
- AI Act Art. 12 (logg-krav)
- AI Act Art. 13 (transparens-krav)
- AI Act Art. 86 (forklarings-rett)
- GDPR Art. 22(3) (informasjons-krav ved automatiserte beslutninger)

…og etterlater et synlig hash-kjede-brudd.

### 3.3 Forklaring under crypto-shredding

Når innhold er crypto-shreddet (seksjon 2.3), MÅ hvorfor-feltene bestå. Selve forklaringen er ikke personopplysning — det er prosess-metadata:

- *«Vedtaket var basert på folketrygdloven §14-5, modellen klassifiserte søknaden som gyldig, alignment-flagg `legal-content` ble satt»* — dette er ikke personopplysning. Det er prosess-erklæring.

Crypto-shredding fjerner *plaintext av personopplysningen* (f.eks. konkret diagnose-tekst). Forklarings-feltene består — fordi de uansett ikke skulle inneholde plaintext av personopplysninger.

Resultat: brukeren har rett til å vite hvorfor systemet handlet som det gjorde, selv etter at hens egne data er slettet. Det er det Art. 86 og Art. 22(3) krever.

---

## 4 · Schema-Enforced Non-Omission (Charter §3)

### 4.1 Stille fravær er ikke gyldig deklarasjon

Charter §3 håndheves på schema-nivå: hvert felt som *kan* være fraværende, MÅ erklære fraværet eksplisitt med begrunnelse. TypeScript-discriminated unions tvinger en av to grener — `null` og `undefined` aksepteres ikke.

```typescript
type SystemPromptField =
  | { provided: true; value: string }
  | { provided: false; reason: "redacted-confidential" | "model-internal" | "no-prompt-used" }
```

Konsekvens: en envelope med blank `process.systemPrompt` er **ikke en gyldig envelope under TSP/3.0**. Den feiler validering før den engang signeres.

### 4.2 Hva dette betyr for erasure og explainability

Forholdet til seksjon 2 og 3 blir nå tett:

- En aktør **kan ikke produsere en TSP-envelope som lyver ved utelatelse.** Schema-en avviser det.
- En aktør **kan ikke skjule fravær.** Hvert fravær må ha en begrunnelse som logges som en del av envelope-strukturen.
- En revisor **kan kreve at hver fravær-begrunnelse er konsistent med de andre feltene.** «`source: { provided: false, reason: "no-source-needed" }` på et juridisk vedtak» er et røde flagg som er auditbart.

Det er forskjellen mellom *«vi glemte å fylle ut hvorfor»* og *«vi erklærer eksplisitt at hvorfor er fraværende fordi X»*. Den andre er auditbar. Den første eksisterer ikke i TSP.

### 4.3 Konformans-krav

For at en implementasjon skal hevde TSP/3.0-konformans, MÅ den:

1. **Avvise envelopes** med stille fravær (`null`, `undefined`, manglende felt) i `source`, `process`, `alignment`.
2. **Validere fravær-begrunnelser** mot den lukkede listen av tillatte verdier per felt.
3. **Bevare fravær-begrunnelser gjennom crypto-shredding** — selv om plaintext destrueres, må begrunnelsen for hvorfor feltet er fraværende stå igjen.
4. **Eksponere validerings-feil i `verifyLocal`** — en envelope som feiler schema-validering MÅ rapporteres som `failures: ["schema-form-violation"]` av verifikatoren.

Disse kravene er testet i SDK-ens `test/charter-3.test.ts` og må reproduseres i hver konformant implementasjon (jf. `docs/PORTING-GUIDE.md`).

---

## 5 · Sammensatt forsvar — hvorfor angrep feiler

Tabellen oppsummerer hvordan de tre mekanismene (erasure compatibility, explainability requirements, schema-enforced non-omission) sammen håndhever AI Act + GDPR uten loophole:

| Angreps-vektor | Hvorfor det feiler under TSP/3.0 |
|---|---|
| Slett envelope-kjede via Art. 17-koordinering | Envelope er ikke personopplysning; Art. 17 har ingen krav. (§2.1, §2.2) |
| Slett kun innholdet via Art. 17 | Crypto-shredding lar plaintext forsvinne mens kjede består. (§2.3, §2.4) |
| Hevd «vi glemte hvorfor-feltene» | Schema avviser stille fravær. Envelope er ikke gyldig. (§4.1, §4.2) |
| Slett hvorfor-feltene som «GDPR-compliance» | Hvorfor-felt er prosess-metadata, ikke persondata. Art. 17 har ingen krav. AI Act Art. 12, 13, 86 + GDPR Art. 22(3) krever at de eksisterer. (§3.1, §3.2) |
| Koordinert nøkkel-destruksjon for å skjule mønster | Forensisk synlig; hver Art. 17-forespørsel må dokumenteres under GDPR Art. 30; bad-faith-mønster er auditbart. (§2.5) |
| «Vi misforsto loven» som forsvar | AI Act Art. 12 + GDPR Art. 17(3)(b) er etablert presedens; ond tro er objektivt vurderbar. (§1) |

Resultat: TSP/3.0 er strukturelt umulig å misbruke for å komme rundt enten AI Act eller GDPR. Det er ikke en juridisk påstand — det er en arkitektonisk egenskap.

---

## 6 · Implementasjons-krav

### 6.1 For SDK-implementasjoner

Hver TSP/3.0-konformant SDK MÅ:

1. **Implementere schema-validering** som avviser stille fravær (seksjon 4).
2. **Tilby crypto-shredding-API** for shreddable felter (seksjon 2.3) — det er valgfritt for issuer å *bruke* mekanismen, men SDK MÅ *støtte* den.
3. **Bevare hvorfor-felter** gjennom alle envelope-livssyklus-operasjoner (signering, verifisering, evidens-eksport).
4. **Rapportere reconciliation-status** i `verifyLocal`-output: `{ erasureCompatible: bool, explainabilityComplete: bool, schemaForm: bool }`.

Referanse-implementasjon: `packages/lexitsp-sdk/src/v3/reconciliation.ts` (kommer i `@lexitsp/sdk@3.1.0`).

### 6.2 For deployers (kunder som wrap-er)

Når kunden integrerer TSP i sin AI-applikasjon, MÅ kunden:

1. **Holde råinnhold utenfor envelope** med mindre crypto-shredding er aktivert (seksjon 2.2).
2. **Dokumentere nøkkel-livssyklus** i sin GDPR Art. 30-record hvis crypto-shredding er aktiv.
3. **Etablere intern policy** for når Art. 17-krav fører til crypto-shredding vs. avvisning under Art. 17(3)(b).
4. **Trene DPO og internkontroll** på reconciliation-modellen.

### 6.3 For revisorer

En revisor som verifiserer en TSP-implementasjon under denne profilen, kan kreve:

1. **Schema-validering bevis** — at envelopes som er produsert under perioden alle passerer charter §3-validering.
2. **Crypto-shredding logg** — hvis aktivert, dokumentasjon på alle nøkkel-destruksjoner i perioden.
3. **GDPR Art. 30-record alignment** — at hver Art. 17-respons (sletting eller avvisning) er dokumentert.
4. **Hash-kjede integritet** — at ingen envelope-kjede har brudd som ikke kan forklares av legitime crypto-shredding-hendelser.

---

## 7 · Forholdet til andre lover og standarder

### 7.1 Sektor-lover

Reconciliation-profilen er kompatibel med:

- **DORA** (digital operational resilience) — krav om revisjons-spor over år.
- **MiFID II** — krav om transaksjons-logger.
- **Hvitvaskingsregelverket** — kunde-due-diligence-spor.
- **Pasientjournalloven** — helseopplysningers oppbevaring.

I alle disse er det **sektor-loven som setter retensjons-perioden**, ikke TSP. TSP gir det tekniske formatet for å oppfylle retensjons-kravet uten å bryte GDPR.

### 7.2 Internasjonale standarder

- **ISO/IEC 42001** (AI management systems) — TSP er teknisk evidens-format under prosess-rammeverket.
- **ISO/IEC 27001** (information security management) — nøkkel-livssyklus-krav i seksjon 2.3 er kompatible med ISO 27001-kontroller.
- **NIST AI RMF** — TSP envelopes er evidens for «MEASURE»- og «MANAGE»-funksjoner.

### 7.3 Relasjon til prEN ISO/IEC 24970 og kommende harmoniserte standarder

TSP er **ikke** en kandidat til prEN ISO/IEC 24970 (system-level event logging). Den opererer på et annet lag — *per-output cryptographic binding* mens prEN 24970 er *system-level event logging*.

Dette er en **sterkere posisjon** enn å konkurrere: TSP kan være en normativ referanse *innenfor* eller *under* en harmonisert logging-standard, ikke i stedet for den. En organisasjon kan trenge begge — prEN 24970 for system-event-loggen, TSP for per-output proveniens.

---

## 8 · Versjon og endring

| Versjon | Dato | Endring |
|---|---|---|
| 1.0 | 2026-05-09 | Første normative versjon. Etablert som del av `TSP/3.0`-spec. |

Endringer i denne profilen følger samme RFC-prosess som resten av spec-en (`docs/SPEC-GOVERNANCE.md`). Major-endringer i reconciliation-modellen kan ikke gjøres uten matching SDK-implementasjon og oppdaterte test-vektorer.

---

## 9 · Charter-binding

Denne profilen er bindende under:

- **Charter §1** (brukeren først): bruker-data tilhører brukeren; envelope-strukturen tilhører hendelsen.
- **Charter §3** (eksplisitt deklarasjon): blank felter er ikke gyldige.
- **Charter §10** (envelope-aggregat aldri brukere): aggregat-tabeller har ingen bruker-fremmednøkler.
- **Charter §11** (data-minimering): innhold prunes ved decide-time; envelope er metadata, ikke datalager.

Hvis en implementasjon kan tilfredsstille teknisk konformans men bryter charter-bindingen i ånd (f.eks. ved å produsere envelopes som *teknisk* validerer men inneholder bruker-PII i strid med §11), er implementasjonen **ikke** konformant under denne profilen. Charter §6: språket må ikke overstige det praksisen faktisk er.

---

## 10 · For DPOer og jurister — kort sammendrag

Tre påstander, alle håndhevbare i kode:

1. **TSP-envelopes inneholder ikke personopplysninger** (med mindre crypto-shredding er eksplisitt aktivert med dokumentert nøkkel-livssyklus).
2. **Hvorfor-feltene (kilde, prosess, alignment) er prosess-metadata** — ikke under Art. 17-rekkevidde, og kreves under AI Act Art. 12/13/86 + GDPR Art. 22(3).
3. **Stille fravær er ikke en gyldig deklarasjon** — schema avviser blanke felter; hver fravær er begrunnet og auditbar.

Sammen utgjør disse en arkitektur som er **strukturelt umulig å misbruke for å komme rundt enten AI Act eller GDPR**. Det er ikke en juridisk påstand — det er en arkitektonisk egenskap.

---

*Sist oppdatert 2026-05-09. Denne profilen er normativ for `TSP/3.0`. Endringer følger RFC-prosessen i `docs/SPEC-GOVERNANCE.md`. Charter §6 binder også denne fila — hvis profilen hevder mer enn arkitekturen leverer, er profilen feil.*
