# TSP for ledere og anskaffelse

> En tett oppsummering for deg som skal bestemme om organisasjonen skal adoptere TSP — eller stille det som krav i AI-anskaffelser. Ti minutters lesetid. Ingen markedsspråk.

---

## 1 · TL;DR

EU AI Act trer i kraft trinnvis fra **2. august 2026** for høyrisiko-AI. Loven krever at AI-svar som påvirker en borger må kunne **rekonstrueres etterpå** — kilde, modell, prosess, oppsyn. De fleste dagens stack-er kan ikke det.

**TSP gir deg en åpen, kryptografisk standard som gjør hver AI-utgang etterprøvbar — uten å låse deg til en leverandør.** Du kan stille det som krav i anbud, du kan bruke det internt, du kan bytte AI-leverandør senere uten å miste audit-historikken.

Pris-rammen:
- **Standard-laget** (SDK + UI-komponent + spec) er **MIT-lisensiert og gratis.**
- **Verktøy-laget** (Risk + Evidence + Oversight) er betalt convenience-software — hosted eller on-prem under kommersiell lisens.
- **Du kan alltid implementere standarden selv** mot åpne API-er. Ingen lock-in på audit-formatet.

Beslut­ningen er **reversibel**: hvis TSP ikke leverer som forventet, har du fortsatt envelopes du selv kan verifisere, og du har ikke mistet data.

---

## 2 · Hva problemet faktisk er

I dag er AI-tilliten *transitiv*: du stoler på applikasjonen → applikasjonen stoler på leverandøren → leverandøren stoler på sin egen logg. Tre ledd, tre potensielle bruddpunkter, ingen kryptografisk binding.

Når en revisor ber om bevis på at en konkret AI-beslutning var basert på riktig lov-grunnlag fra 3. mars 2026, må du i dag:

1. Be leverandøren om en eksport.
2. Stole på at eksporten er komplett og uendret.
3. Stole på at modell-versjonen som er oppgitt faktisk var den som kjørte.
4. Stole på at systempromptene som dokumenteres faktisk var de som ble brukt.

Hvis ett av disse leddene svikter, har du ikke en revisjon — du har et håp om at ting var som de skulle være.

TSP fjerner tilliten ved å gjøre matematikken bærende. Endringer detekteres mekanisk, ikke ved velvilje.

---

## 3 · Hva TSP gir deg konkret

| Behov | Med TSP |
|---|---|
| **Bevise hva AI-en gjorde** | Hvert svar wrappes i et signert envelope med kilde, modell, prosess, alignment. Endringer detekteres matematisk. |
| **Hendelseslogg (AI Act Art. 12)** | Hash-kjedede envelopes med RFC 3161-tidsstempling. Kan ikke trimmes uten at trimmingen vises. |
| **Sluttbruker-transparens (Art. 13)** | TrustBadge-komponent rendrer alle 6 punkter fra Art. 13(3)(b) bundet til konkret envelope. |
| **Reell human oversight (Art. 14)** | Reviewer-signaturer med klient-side nøkler. Ingen AI-foreslag som anker beslutningen. |
| **Stikkprøve fra revisor uten leverandør-tilgang** | Revisor henter envelope + manifest, kjører verifyLocal i nettleseren, ferdig. |
| **Bytte AI-leverandør uten å miste historikk** | Envelopes er åpen format. Ny leverandør kan signere mot samme manifest. |
| **Anskaffelses-krav som faktisk er målbart** | «Skal levere TSP-kompatible envelopes for hver utgang i regulert sak» er en kontraktuell, etterprøvbar klausul. |

---

## 4 · Anskaffelses-perspektivet

Hvis du er på kjøpersiden i en AI-anskaffelse i regulert sektor, gir TSP deg fire verktøy:

### 4.1 Kontraktuell klausul

«Leverandøren skal levere `TSP/3.0`-kompatible TrustEnvelopes for hver AI-utgang som inngår i tjenesten. Envelope-strukturen skal være verifiserbar mot leverandørens publiserte manifest uten leverandørens samarbeid.»

Dette er testbart i due diligence: be om en sample-envelope, kjør `verifyLocal` mot deres manifest, se om det går grønt. Tar 30 sekunder.

### 4.2 Tilbakelevering av audit-historikk

«Ved kontrakts­opphør skal leverandøren levere ut alle envelopes signert under kontrakten i åpent format, slik at tjeneste­mottaker kan etterprøve historikken uavhengig av leverandøren.»

Fordi envelopes er signerte og kjedede, er ikke tilbakeleveringen avhengig av leverandørens velvilje. Hvis leverandøren tilbakeholder et envelope, vises det som et brudd i kjeden.

### 4.3 Multi-vendor-strategi

Du kan kontrahere flere AI-leverandører og kreve TSP-utstedelse fra alle. Audit-historikken er ensartet på tvers, fordi formatet er åpent. Bytter du leverandør, byttes kun signatur-kilden — strukturen er den samme.

### 4.4 Sektor-koordinering

Hvis flere etater i en sektor (f.eks. NAV, Skatteetaten, kommuner) standardiserer på TSP, kan revisjon, AI-tilsyn og delte tjenester koordineres uten leverandør­bindinger. Det er det offentlige sektor-arkitekturen ofte ikke får til — TSP gir et teknisk grunnlag for det.

---

## 5 · Hva TSP koster

| Komponent | Pris | Hva det er |
|---|---|---|
| `@lexitsp/sdk` | Gratis (MIT) | TypeScript-bibliotek for wrap/verify |
| `@lexitsp/trustbadge-react` | Gratis (MIT) | Drop-in UI-komponent |
| TSP spesifikasjon | Gratis (CC-BY 4.0) | Standarden selv |
| Selvhostet manifest + PKI | Gratis | Du kjører `tsp manifest init`, hoster en JSON-fil |
| TSA (tidsstempling) | Eksterne kostnader | eIDAS-godkjente TSA-er finnes; pris varierer |
| **Risk** | Betalt lisens | Alarmer + envelope-aggregat. Hosted eller on-prem. |
| **Evidence** | Betalt lisens | Auditor-pakker og templates. Hosted eller on-prem. |
| **Oversight** | Betalt lisens | Human-review-kø. Hosted eller on-prem. |
| **Public Sector** | Egne vilkår | For norsk offentlig sektor; egen modell. |

**Gainsharing** betyr at LexiCos inntekt på plattform-laget er bundet til kundens etterlevelses­verdi — vi tjener på at TSP fungerer for deg, ikke på flat seat-pris. Detaljer på `https://truststandardprotocol.org/priser`.

Ingen plattform-modul er kritisk for kjernefunksjonen. Du kan bruke kun standard-laget og være ferdig.

---

## 6 · Hva som kreves av organisasjonen

For å adoptere TSP internt:

1. **En signaturnøkkel + manifest** — typisk en time å sette opp. CLI: `tsp manifest init`, hoster JSON-fila på en URL du kontrollerer.
2. **Integrasjon i AI-applikasjonen** — wrap hver AI-utgang før den vises. Typisk 1–3 dager for et middels system.
3. **Trust-konfigurasjon** — velg hvilke TSA-er du stoler på (eIDAS-listen er et naturlig utgangspunkt).
4. **Reviewer-flow hvis Oversight brukes** — definer hvilke envelopes som skal til menneskelig vurdering. Closed JSON DSL, ingen kode-skriving.

Det er ikke en flerukers integrasjon. Det er en arkitektur-beslutning + en uke implementasjon for et typisk system.

---

## 7 · Risiko og åpne spørsmål — ærlig

Charter §6 binder oss til ærlighet. Det du bør være obs på:

- **TSP er alpha.** Phase 1–3 er feature-komplett og testet, men TSP er fortsatt alpha. Vurder første pilot som kontrollert validering, ikke produksjons-SLA.
- **TSA-trust-listen er tom by default** (charter §5). Du må selv velge hvilke tidsstemplings­myndigheter du stoler på. Vi har ikke sertifisert noen ennå.
- **Hardware-token-støtte (HSM/PKCS#11) kommer i v1.1.** I dag er reviewer-nøkler i WebCrypto med `extractable=false` — strengere kan kreves i bank/forsvar.
- **Ingen breddeadopsjon ennå.** TSP er en åpen standard, men ingen tredjeparts-implementasjoner finnes per i dag. Du blir enten en av de første eller kan vente.
- **LexiCo er ett menneske + et selskap.** Hvis du trenger en SLA-tung leverandør med 50 ansatte, er ikke vi det. Standarden overlever oss (MIT + CC-BY 4.0), men den betalte verktøyleveransen er small-scale.

Hvis disse risikoene gjør TSP urealistisk for deg i dag — bruk standarden, ikke de betalte verktøyene. Standarden kan adopteres uten LexiCo som driftskritisk leverandør.

---

## 8 · Beslutnings-rammen

| Hvis ditt mål er… | Anbefalt grep |
|---|---|
| Stille TSP som krav i et anbud i regulert sektor | Bruk klausulene fra §4.1 og §4.2. |
| Pilotere TSP internt på ett AI-system | Start med standard-laget. SDK + manifest. 1 uke. |
| Bygge en multi-vendor AI-arkitektur | Stille TSP-utstedelse som leverandør-krav. Plattform-laget valgfritt. |
| Forberede en AI Act-konform implementasjon | Standard + Evidence-modul. Risk hvis du har tids­basert overvåkning. Oversight hvis du har Art. 14-flyter. |
| Bli pilotpartner | Se `docs/PILOT-PROGRAM.md`. |
| Bare forstå hva dette er | Lest dette dokumentet, gå til `https://truststandardprotocol.org/playground` og prøv. 30 sekunder. |

---

## 9 · Sammenligning mot alternativer

| Alternativ | Hva det gjør | Hvor det svikter mot TSP |
|---|---|---|
| **CSV-eksport fra leverandør** | Tabellarisk logg | Ikke kryptografisk bundet til svar; kan endres |
| **Vendor audit-trail (f.eks. OpenAI logs)** | Loggføring i leverandørens dashboard | Krever leverandør-tilgang; vendor lock-in; ikke åpen format |
| **Egen logging i applikasjonen** | App-side database | Ingen kryptografisk binding mellom logg og svar; ikke etterprøvbar uten å stole på din egen DB |
| **AI governance-suiter (Credo AI, Holistic AI etc.)** | Risk-management dashboard | Lever inne i ett vendor-cloud; ikke åpen standard; ofte ingen envelope-format |
| **Manuell dokumentasjon** | Confluence + skjønn | Ikke kryptografisk; ikke etterprøvbar; skalerer ikke |

TSP konkurrerer ikke direkte med disse — den ligger under dem. Du kan kjøre Credo AI *og* TSP. Men du kan ikke kjøre TSP-funksjonen uten en TSP-lik mekanisme; det er ikke en feature i en SaaS-suite.

---

## 10 · Neste steg for ledere

- **5 minutter:** `https://truststandardprotocol.org/` + playground.
- **30 minutter:** `docs/ABOUT.md` + dette dokumentet.
- **2 timer:** Charter (`docs/charter.md`) + EU AI Act-mapping (`/eu-ai-act/`).
- **Møte:** julian@lexico.no — beslutnings-samtale, ingen pitch.

Hvis du vil bli pilotpartner: `docs/PILOT-PROGRAM.md` har vilkårene.

---

*Sist oppdatert 2026-05-09. Charter §6: hvis noe i dette dokumentet ikke matcher koden eller virkeligheten, er dokumentet feil — ikke koden. Si fra.*
