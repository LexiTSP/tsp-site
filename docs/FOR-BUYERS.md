# TSP for AI-kjøpere

> For deg som **kjøper eller bruker** AI som påvirker borgere, kunder eller ansatte. Du bærer risikoen, ikke leverandøren — og det er du som blir spurt når tilsynet ringer.
>
> Dette dokumentet er for deg som vurderer hvordan TSP gir deg en bedre forhandlings­posisjon mot AI-leverandører, ikke hvordan du selv skal bygge AI-systemer.

---

## 1 · Det skjeve forholdet — kort

I dag er det skjevt: leverandøren har dataene, leverandøren har loggen, leverandøren har dashboardene. Du har en kontrakt, en SLA, og håpet om at de spiller ærlig.

Når tilsynet ringer:

- Du må be leverandøren om eksport.
- Du må stole på at eksporten er komplett.
- Du må stole på at modell-versjonen som er oppgitt faktisk var den som kjørte.
- Du må stole på at systempromptene som dokumenteres faktisk var de som ble brukt.

Hvis ett av disse leddene svikter, har du ikke en revisjon — du har et håp om at ting var som de skulle være. **Og bøtene treffer deg, ikke leverandøren.** AI Act art. 26 gir deg ansvar som «deployer», uavhengig av leverandørens forsikring.

TSP retter opp det skjeve forholdet ved å gjøre matematikken bærende. Du får bevis, ikke håp.

---

## 2 · TSP gir deg fire ting

### 2.1 Et evidens-format du kontrollerer

Hver AI-utgang som påvirker en borger/kunde/ansatt leveres som en signert `TrustEnvelope` med:

- **Kilde-erklæring** — hvor faktagrunnlaget kom fra (lov-paragrafer, vektor-DB, intern KB).
- **Prosess-logg** — modell, modell-versjon, systemprompt-status, pipeline-steg.
- **Alignment-metadata** — risikonivå, domene, policy-versjon, refusal-årsak hvis aktuelt.
- **Ledger** — hash-kjede til forrige envelope + RFC 3161 tidsstempel.

Alt signert med Ed25519. Du kan verifisere envelopet i nettleseren din — uten leverandør-tilgang.

### 2.2 Forhandlings­makt mot leverandører

Når du legger TSP-krav i anbudet (se `docs/CONTRACT-CLAUSE.md`):

- **Leverandøren må produsere TSP-kompatible utganger** — eller en funksjonelt ekvivalent åpen alternativ.
- **Du kan be om hvilket som helst svar** og verifisere det selv. Stikkprøve-rett er kontraktuell, ikke et håp.
- **Du kan bytte leverandør** uten å miste audit-historikk. Envelopes er åpne format.
- **Multi-vendor blir mulig.** Du kan kontrahere flere leverandører med samme audit-format.

### 2.3 Beredskap mot tilsyn og revisjon

Tilsynet/revisor ber om bevis:

- Du leverer en Evidence-pakke (ZIP med envelopes + verifikasjons-rapport).
- De kjører `verifyLocal` i sin egen nettleser.
- Du har dokumentert og verifisert audit trail uten å åpne leverandørens infrastruktur.

Tidsbruk på en typisk stikkprøve: minutter, ikke uker.

### 2.4 Audit trail som overlever leverandører

Leverandøren går konkurs, blir kjøpt opp, eller bytter strategi. I klassisk SaaS-stack mister du da ofte audit-historikken — den lå inne i deres database. Med TSP er envelopes åpne JSON-strukturer du selv lagrer. Audit-historikken er bygget for å overleve leverandører.

---

## 3 · Hva forskjellen ser ut for deg

| Situasjon | Uten TSP | Med TSP |
|---|---|---|
| Borger klager på AI-svar | Be leverandør om logg, vente, stole på eksport | Hent envelope fra eget arkiv, verifiser i nettleser, vis til borger |
| Tilsyn ber om stikkprøve | Koordinere med leverandør, eksport, analyse, levere PDF | Generer Evidence-pakke, send til tilsyn, de verifiserer selv |
| Bytte AI-leverandør | Migrasjon av audit-data; ofte ikke mulig | Beholde envelopes; ny leverandør signerer mot samme manifest |
| Intern revisjon | Stole på at applikasjons-loggen er komplett | Kjøre verifyLocal på 1000 envelopes, automatisk feil-detektering |
| AI Act-rapport til styret | «Vi har dokumentasjon» | «Vi har 100% verifiserbar dekning, her er bevis-pakken» |

---

## 4 · Hva som kreves av deg

For å adoptere TSP som kjøper, må du gjøre tre ting:

### 4.1 Stille det som krav i avtaler

Bruk klausulen i `docs/CONTRACT-CLAUSE.md`. Tilpass med jurister. Inkluder den i:

- Anbud for nye AI-løsninger.
- Reforhandlinger av eksisterende kontrakter.
- Standardavtaler for konsulenter som leverer AI-baserte tjenester.

Klausulen er språk-uavhengig — kjøper-makt fungerer i Norge, EU og globalt.

### 4.2 Etablere en mottak-side

Selv om leverandøren wrap-er envelopes, må du ha et sted å motta og lagre dem. Du trenger:

- **Lagring** for envelopes (typisk 1–4 KB hver). En S3-bucket eller eksisterende dokument­arkiv holder. Husk WORM-policy.
- **En manifest** som viser hvilke leverandører/instanser du anerkjenner som signerere. Selvhostet eller via LexiCo.
- **En verifikator** — kan være `verifyLocal` på truststandardprotocol.com, en intern kjøring av `@lexitsp/sdk`, eller en egen web-UI bygget på SDK-en.

Dette er små investeringer (typisk 1–3 dager utvikler-tid).

### 4.3 Trene revisjon og compliance

Internkontroll, internrevisjon og DPO trenger å forstå TSP-formatet. `docs/FOR-AUDITORS.md` er onboarding-materialet. En workshop på 2 timer er typisk nok.

---

## 5 · Risiko og avgrensninger — ærlig

Charter §6: vi underselger ikke risiko.

- **TSP er alpha.** TSP er alpha; vurder første pilot som en kontrollert validering, ikke som produksjons-SLA.
- **Leverandører implementerer ennå ikke TSP.** Du må enten kreve det i anbud (vil ta tid å spre), eller wrap-e på applikasjons-laget selv.
- **Wrap-på-applikasjons-laget er begrenset.** Hvis leverandøren ikke samarbeider, kan du wrap-e svaret du *mottar* — men du kan ikke verifisere at modell-versjonen leverandøren oppgir faktisk var den som kjørte. Det krever leverandør-attestation.
- **Hardware-tokens kommer i v1.1.** Bank/forsvar-segmenter med strenge HSM-krav må vente.

---

## 6 · Spørsmål kjøpere bør stille i AI-anbud

For å skille leverandører som tar AI-compliance på alvor fra de som ikke gjør det:

1. **«Kan dere levere hvert AI-svar som en kryptografisk signert envelope med kilde, modell, prosess og alignment?»** TSP-spec-en er ett konkret svar. Funksjonelt ekvivalent er et annet.
2. **«Kan vi verifisere et envelope uten tilgang til deres infrastruktur?»** Hvis nei → vendor lock-in, ikke ekte etterprøvbarhet.
3. **«Hvis vi avslutter avtalen, beholder vi audit-historikken i åpent format?»** Hvis nei → audit-data dør med kontrakten.
4. **«Hvilken modell-versjon var aktiv 3. mars 2026 kl. 14:23?»** Hvis svaret er «vi finner det ut» — ingen konkret binding mellom svar og modell-versjon.
5. **«Hvis modellen returnerer feil informasjon, kan dere bevise hvilken systemprompt som var aktiv?»** Hvis svaret er «kanskje, vi sjekker» — systemprompt-versjons­kontroll mangler.
6. **«Støtter dere TSP, eller dokumenter ekvivalent åpen format?»** Det er svaret som skiller seriøse leverandører.

---

## 7 · Vanlige innvendinger fra leverandører — og svar

**«TSP er overhead.»**
Hver envelope er 1–4 KB. På et system som svarer 1000 ganger om dagen er det 4 MB/dag. Mindre enn en sesjon-cookie. Overhead er ikke argumentet — det er prioritering.

**«Vi har vår egen logging.»**
Hvis loggingen er kryptografisk signert per svar med åpen verifikator → fint, det er TSP-ekvivalent. Hvis ikke → leverandørens logg er ikke uavhengig etterprøvbar.

**«Det finnes ingen standard ennå.»**
Det finnes nå. CC-BY 4.0 spec, MIT referanse-implementasjon, AI Act-mapping dokumentert. «Ingen standard» er ikke lenger sant.

**«Vi har ISO 42001-sertifisering.»**
Bra — det er prosess-sertifisering. TSP er teknisk evidens-format. De er komplementære, ikke alternativer. ISO 42001 sier «du har en prosess»; TSP sier «her er bevis på at prosessen ble fulgt på dette spesifikke svaret».

**«Det blir for dyrt.»**
Sammenlign med alternativ-kost: én alvorlig AI Act-bot er 35M EUR. Én tapt anskaffelse fordi audit-trail var utilstrekkelig kan være større. TSP-implementering er typisk 1–5 utvikler-uker, gratis MIT SDK.

---

## 8 · Strategisk verdi for kjøperen

Utover compliance, gir TSP-adopsjon strategisk verdi:

- **Bedre AI-anskaffelser.** Konkrete, målbare krav i anbud differensierer seriøse leverandører.
- **Bedre interne AI-prosjekter.** Selv egen-utviklede modeller bør produsere envelopes — for fremtidig audit-modenhet.
- **Bedre M&A due diligence.** Når dere kjøper et selskap med AI-implementasjoner, får dere verifiserbar historikk i stedet for håp.
- **Bedre forsikring.** Cyber- og ansvars­forsikring som inkluderer AI-risiko vil i økende grad belønne målbar audit-modenhet.
- **Bedre styre-rapportering.** «Vi har 100% verifiserbar dekning» er et bedre svar enn «vi har en prosess».

---

## 9 · Tre konkrete neste steg

For en virksomhet som vurderer TSP:

### 9.1 Internt — denne uka

- Be IT/AI-team om å se på `https://truststandardprotocol.com/playground` (30 sekunder).
- Gi compliance/internrevisjon `docs/FOR-AUDITORS.md` å lese (15 minutter).
- Få jurist til å se på `docs/CONTRACT-CLAUSE.md` (1 time).

### 9.2 I neste anskaffelse

- Inkluder TSP-klausulen i anbudet.
- Be om sample-envelope fra hver leverandør.
- Verifiser dem i playground. Velg leverandør delvis basert på modenhet.

### 9.3 I et eksisterende AI-system

- Velg én konkret responskjede (typisk klagebehandling, internkommunikasjon, eller saksforberedelse).
- Wrap envelopes på applikasjons-laget selv (1–3 dagers utvikler-tid).
- Generer en Evidence-pakke. Send til intern­revisjon. Be om tilbakemelding.

Hvis du vil bli pilot: `docs/PILOT-PROGRAM.md`.

---

## 10 · Hvor det blir konkret

- **Spec:** `https://truststandardprotocol.com/spec`
- **EU AI Act-mapping:** `https://truststandardprotocol.com/eu-ai-act/`
- **Demo-script for interne presentasjoner:** `docs/DEMO-SCRIPT.md`
- **Kontraktsklausul (jurist-klar, NO + EN):** `docs/CONTRACT-CLAUSE.md`
- **Audit-walkthrough:** `docs/FOR-AUDITORS.md`
- **Markedsanalyse:** `docs/MARKET-ANALYSIS.md`
- **Pilot-program:** `docs/PILOT-PROGRAM.md`
- **Kontakt:** julian@lexico.no

---

*Sist oppdatert 2026-05-09. TSP er bygget for kjøpere først — fordi det er kjøperne som bærer AI-risikoen, og det er kjøperne som har kontraktuell forhandlings­makt til å spre standarden. Charter §1: brukeren først.*
