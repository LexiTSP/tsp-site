# TSP for revisorer og compliance

> Et dokument for deg som skal vurdere om en AI-implementasjon faktisk etterlever EU AI Act, ikke bare hevder å gjøre det. Skrevet for revisorer, internkontroll, jurister, compliance-funksjoner og DPO-er.
>
> Premiss: dagens AI-stack er strukturelt vanskelig å revidere. TSP gjør den revisjonsbar — uten at du må stole på leverandøren.

---

## 1 · Det stille problemet med dagens AI-logger

Når du i dag skal etterprøve en AI-beslutning, har du typisk fire kilder:

1. **Leverandørens API-logg** (CSV eller dashboard) — viser hvilke prompts som ble sendt, ikke hva modellen hadde tilgang til, ikke hvilken systemprompt-versjon, ikke hvilke RAG-treff.
2. **Applikasjonens egen logg** — viser hva applikasjonen sa til brukeren, men ikke hvordan svaret ble dannet.
3. **Modell-versjon i HTTP-header** — ikke signert, kan endres etter at svaret er gitt, og «GPT-4o» er ikke en reproduserbar tilstand.
4. **Manuell dokumentasjon** — systempromptene som *kanskje* ble brukt, lagret i en Confluence-side som ikke er kryptografisk bundet til loggen.

Ingen av disse kildene er **etterprøvbare** i den forstand at en uavhengig tredjepart kan rekonstruere hva som faktisk skjedde uten å stole på leverandøren. De er **arkiverte**, ikke verifiserbare.

Forskjellen er at en arkivert logg kan endres uten spor. En verifiserbar logg ikke kan det.

---

## 2 · Hvorfor TSP slår CSV-eksport — punkt for punkt

| Egenskap | CSV/database-logg | TSP TrustEnvelope |
|---|---|---|
| **Endringer i ettertid detekteres?** | Nei. Kreves at du stoler på databasens audit-trail. | Ja. SHA-256 contentHash + Ed25519-signatur. Endring av ett tegn → verifyLocal fail. |
| **Kan revideres uten leverandørens samarbeid?** | Nei. Du må be om eksport, og du må stole på at eksporten er komplett. | Ja. Hver envelope verifiseres lokalt i nettleseren mot et public manifest. |
| **Binder kilde til svar?** | Nei. Kildehenvisninger er fri tekst, ofte etter-rekonstruert. | Ja. `source`-felt er en del av den signerte strukturen. |
| **Binder modell-versjon til svar?** | Vanligvis ikke. Modell-ID i en header som ikke er signert. | Ja. `process.model` + `process.modelVersion` i signaturen. |
| **Tidsstempling?** | Server-timestamp som leverandøren kontrollerer. | RFC 3161 TSA — uavhengig tidsstemplings­myndighet, eIDAS-godkjent. |
| **Hendelseskjede (Art. 12)?** | Sortert tabell. Ingen kryptografisk binding mellom rader. | Hash-kjede via `previousEnvelopeId` + `chainHash`. Manglende ledd detekteres. |
| **Stikkprøve fra revisor?** | Krever leverandør-tilgang. | Send envelope + manifest-URL → revisor verifiserer i nettleseren. |
| **Vendor lock-in på audit-formatet?** | Ja. Eksporten er leverandørens format. | Nei. CC-BY 4.0 spec, MIT SDK, åpen JSON-struktur. |
| **Subjektivt redaktørskjønn skjuler tomme felter?** | Ja. `null` betyr «vet ikke om det var brukt». | Nei. Charter §3 — fravær må erklæres med begrunnelse. |

Hovedforskjellen i én setning: **en CSV-eksport krever at du stoler på leverandøren. Et TrustEnvelope krever at du stoler på matematikken.**

---

## 3 · Audit-narrativet — slik gjennomføres en revisjon

### 3.1 Stikkprøve på enkelt-svar

Scenario: Du skal verifisere at et konkret AI-svar gitt til en borger 3. mars 2026 var basert på riktig lovgrunnlag og ikke har blitt endret i ettertid.

1. Be applikasjonseier om `envelope_id` for det aktuelle svaret.
2. Hent envelope-en (JSON, typisk 2–4 KB) — fra applikasjonens egen lagring eller via Evidence-modulen.
3. Åpne `https://truststandardprotocol.com/playground` (eller en hvilken som helst implementasjon av `verifyLocal`).
4. Importer envelope-en. Verktøyet henter manifestet automatisk fra `manifestRef`.
5. Se på `verifyLocal`-resultatet:
   - Alle 10 checks grønne → svaret er uendret siden signering.
   - `source`-feltet viser eksplisitt hvilke lov-paragrafer som ble brukt.
   - `process.model` viser modell og versjon.
   - `process.systemPrompt` er enten den faktiske systemprompten eller en eksplisitt redaksjons-erklæring («redacted-confidential» med begrunnelse).
   - `alignment.riskLevel` viser hvilken risikoklassifisering som ble brukt.
   - `ledger.tsaTimestamp` viser uavhengig tidsstempling.

Hele revisjonen gjør du i nettleseren. Ingen leverandør­dialog. Ingen kontrakt­tilgang. Ingen ventetid.

### 3.2 Hendelseslogg (AI Act Art. 12)

Scenario: Du skal etterprøve at organisasjonens AI-system har en **komplett, etterprøvbar hendelseslogg** for en gitt periode.

1. Be Evidence-modulen om en pakke for periode + domene.
2. Du får en ZIP med alle envelopes i perioden + en verifikasjons-rapport.
3. Hver envelope har `previousEnvelopeId` som peker til forrige envelope. Hash-kjeden valideres ende-til-ende.
4. **Hvis et envelope mangler i kjeden** — `verifyLocal` flagger det som «broken chain». Du kan ikke skjule slettede svar uten å bryte kjeden.
5. **Hvis et envelope er endret** — contentHash matcher ikke. Endring detekteres på enkelt-envelope-nivå.

Resultat: hendelseslogg er ikke en CSV som kan trimmes; det er en kryptografisk kjede som ikke kan klippes uten at klippet vises.

### 3.3 Transparens (AI Act Art. 13)

Art. 13(3)(b) krever at sluttbruker informeres om bl.a. systemets kapabilitet, begrensninger, og besluttende rolle. TSP `TrustBadge`-komponenten rendrer alle 6 punktene fra Art. 13(3)(b) direkte i en modal — på naturlig norsk, bundet til det konkrete envelope-et brukeren ser.

Bevis: åpne hvilken som helst applikasjon med TrustBadge integrert, klikk badge → modal viser de 6 punktene. Innholdet er hentet fra `alignment.policyVersion` og `process.model` — ikke generert av en LLM, ikke fri tekst, ikke versjonsløst.

### 3.4 Human oversight (AI Act Art. 14)

Hvis organisasjonen bruker Oversight-modulen, signerer hver menneskelige reviewer sin beslutning klient-side med en WebCrypto-nøkkel som har `extractable=false`. Resultatet er et `ReviewEnvelope` (`tsp-review-1.0`) som binder dommen til opprinnelig `contentHash`.

**Det reviewer faktisk så** er bevarbart: charter §7 forbyr AI-genererte sammendrag, anbefalinger eller hint i review-køen. TypeScript-typesystem fjerner feltene, en CI-grep-test feiler hvis de introduseres, og runtime-assert avviser dem. Tre-lags forsvar mot automasjons-bias.

For revisor: du kan kreve `ReviewEnvelope` for et hvert oversight-steg og verifisere at reviewer faktisk så materialet uten foreslag. Det betyr at «human oversight» ikke er en gummi-stempel-prosess som loggføres som om den var reell.

---

## 3.5 · GDPR-spørsmålet (for DPOer)

Det første DPOer alltid spør: «Hva med GDPR Art. 17 når envelope-en er signert og kjedet?»

Kortsvar: TSP-envelope-en inneholder som regel **ikke** personopplysninger — den er prosess-metadata (kilde-erklæring, modell-versjon, alignment, hash-kjede), ikke bruker-data. Det betyr at Art. 17 strukturelt ikke har krav på envelope-en.

I sjeldne tilfeller hvor personopplysninger *må* inn i envelope-en, brukes **crypto-shredding**: innhold krypteres med per-subjekt-nøkkel, hash-kjeden går over chiffertekst, nøkkelen destrueres ved legitim Art. 17-forespørsel. Plaintext er *de facto* slettet, kjeden består.

Sammen med charter §3 (schema avviser stille fravær) og AI Act Art. 86/GDPR Art. 22(3) (hvorfor-feltene MÅ eksistere — de kan ikke slettes som GDPR-respons) gjør dette TSP arkitektonisk umulig å misbruke for å komme rundt enten AI Act eller GDPR.

Full normativ profil: **`docs/spec/reconciliation.md`**. Tre seksjoner — Erasure Compatibility, Explainability Requirements, Schema-Enforced Non-Omission. Lov-anker: AI Act Art. 12/13/14/17/86 + GDPR Art. 5(1)(c)/17/22(3)/30. Charter-anker: §1/§3/§10/§11.

---

## 4 · Hva TSP IKKE gjør — for ærlighetens skyld

Charter §6 binder oss til å ikke overselge. Tydelig:

- **TSP verifiserer ikke at innholdet er sant.** En LLM kan signere en hallusinasjon. TSP beviser kilde og uendretthet, ikke korrekthet.
- **TSP verifiserer ikke at modell-leverandøren er ærlig om modell-versjon.** Hvis leverandøren oppgir feil `model: "gpt-4o"` mens de faktisk kjørte en annen modell, fanger TSP ikke det. Det krever vendor-attestation utenfor TSPs kontroll.
- **TSP er ikke en GDPR-compliance-løsning.** Det er en proveniens-protokoll. GDPR-mekanismer (rettighet til sletting, dataminimering) må implementeres i applikasjons-laget. Charter §11 bygger inn data-minimering i plattform-modulene, men TSP-spec-en selv er ikke GDPR-policy.
- **TSP forhindrer ikke prompt injection.** Hvis bruker injisierer et prompt som får modellen til å si noe galt, signeres det gale svaret. TSP gjør hendelsen *etterprøvbar*, ikke *forhindret*.
- **TSP løser ikke modell-evaluering.** Hvis du vil vite om en modell er bias-fri eller hallusinerer, trenger du eval-suiter. TSP er proveniens, ikke kvalitet.

Det TSP gir deg er **etterprøvbar binding** mellom svar, kilde, prosess, og tid. Det er en nødvendig betingelse for revisjon, ikke en tilstrekkelig betingelse for kvalitet.

---

## 5 · Konkret revisjons-pakke

For en revisjon av en TSP-basert AI-implementasjon, be om:

1. **Org-manifest URL** — for å hente public keys og cert-chain.
2. **TSA-trust-konfigurasjon** — hvilke tidsstemplings­myndigheter organisasjonen har valgt å stole på.
3. **Evidence-pakke for periode** — ZIP med envelopes + verifikasjons-rapport for stikkprøve-perioden.
4. **Oversight-decisions** — `ReviewEnvelope`-er for stikkprøve-saker som ble menneskelig vurdert.
5. **Risk-alarmer for periode** — aggregert statistikk på envelope-nivå (charter §10: aldri på bruker-nivå).
6. **Charter-versjon** — hvilken charter-versjon implementasjonen retter seg mot.
7. **Schema-versjon** — hvilken `TSP/x.y` wire-versjon envelopes er signert under.

Med disse kan du gjennomføre en full stikkprøve-revisjon i nettleseren din, uten leverandør-tilgang.

---

## 6 · Mapping mot EU AI Act

| Lov-krav | TSP-mekanisme | Schema-felt |
|---|---|---|
| Art. 9 (risikostyring) | `alignment.riskLevel` per envelope, aggregert via Risk-modul | `alignment.riskLevel`, `alignment.policyVersion` |
| Art. 12 (hendelseslogg) | Hash-kjedet envelope-stream med RFC 3161 tidsstempling | `ledger.previousEnvelopeId`, `ledger.chainHash`, `ledger.tsaTimestamp` |
| Art. 13 (transparens) | TrustBadge modal med 6 punkter, bundet til envelope | `process.model`, `alignment.policyVersion`, `source.references` |
| Art. 14 (human oversight) | Oversight-modulens `ReviewEnvelope`, klient-signert | `tsp-review-1.0` envelope, `extractable=false` reviewer-key |
| Art. 15 (robusthet) | `verifyLocal` 10 checks; tamper-detection er matematisk | `contentHash`, `signatures[]`, `cert-not-revoked` |
| Art. 17 (kvalitetsstyring) | Charter + audit-pakke + Evidence-eksport | Hele envelope-strukturen + manifest-PKI |

Full mapping på sitet: `https://truststandardprotocol.com/eu-ai-act/article-9` (og 12, 13, 14, 15, 17).

---

## 7 · Når du sitter fast i en revisjon

- **Hvis verifyLocal feiler:** sjekk hvilken av de 10 checks som feilet. Hver check har en navngitt feilårsak.
- **Hvis manifest ikke kan hentes:** organisasjonen har enten ikke publisert det offentlig (kan være forsettlig — sovereign self-host), eller det er en konfig-feil. Be om en lokal kopi av manifestet.
- **Hvis cert er utløpt:** envelope er fortsatt verifiserbart hvis tidsstemplet er innenfor cert-gyldighet. Det er hele poenget med TSA.
- **Hvis schema-versjon er ukjent:** `verifyLocal` avviser ukjente versjoner (charter §4). Be om SDK-versjon som matcher envelope-versjonen.

---

## 8 · Kontakt

Spørsmål om revisjon av en konkret TSP-implementasjon — eller om TSP i seg selv som revisjonsobjekt:

- E-post: julian@lexico.no
- Spec: `https://truststandardprotocol.com/spec`
- EU AI Act-mapping: `https://truststandardprotocol.com/eu-ai-act/`
- Charter: `docs/charter.md`

Charter §8 binder LexiCo til public post-mortems ved tillitsbrudd og til versjons-yanking-prosedyre dokumentert i SDK CHANGELOG. Du har rett til å vite når noe gikk galt.

---

*Sist oppdatert 2026-05-09. Et levende dokument — gi tilbakemelding hvis revisjons-flyten ikke matcher det du faktisk trenger i felt.*
