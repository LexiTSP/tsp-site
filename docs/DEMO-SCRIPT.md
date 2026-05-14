# TSP Demo Script — Føl forskjellen mellom CSV og TrustEnvelope

> Steg-for-steg-manus for en 15-minutters demo i et kjøper-rom (compliance, ledelse, anskaffelse, intern­revisjon). Målet er ikke å forklare TSP — det er å la rommet *oppleve* hvorfor en signert envelope er fundamentalt annerledes enn en CSV-logg.
>
> Charter §6: demoen overstiger ikke det formatet faktisk gjør. «Tamper-detection» betyr matematisk integritet, ikke at TSP forhindrer hallusinasjoner.

---

## Når du holder denne demoen

Riktige rom:

- Compliance-team som vurderer AI Act-beredskap
- Anskaffelse / innkjøp som skal stille krav i anbud
- Internrevisjon som skal kunne gjennomføre stikkprøver
- Ledelse / styre som trenger 15-minutters bevis-ramme før beslutning
- AI-leverandører som vurderer å implementere TSP

Feil rom:

- Tekniske dyp-dykk på krypto (bruk `docs/QUICKSTART.md` i stedet)
- Forskere/akademia (bruk spec direkte)
- Generell AI-pitch (bruk `docs/WHAT-IS-TSP.md`)

---

## Forberedelser (5 min før møtet)

1. **Åpne playground** på `https://truststandardprotocol.com/playground` (eller localhost:3838).
2. **Pre-load** den syntetiske NAV-casen fra `docs/examples/synthetic-nav-case.md` (envelope #2 — lov-grunnlag-svar). Lim JSON-en inn på forhånd.
3. **Ha klar** en eksempel-CSV som mock «vanlig audit-logg». Et regneark holder. Eksempel:

```csv
timestamp,request_id,user,response,model,prompt_id
2026-05-09T08:14:38,r-123,astrid,Som forelder har du rett...,gpt-4o,sp-foreldrepenger-v3
```

4. **Last ned** Evidence-pakke-eksempelet (ZIP) hvis tilgjengelig — eller forklar konseptet hvis ikke.

---

## Demo-script (15 minutter)

### Del 1 · Sett scenen (2 min)

> «Vi tar utgangspunkt i en konkret situasjon. Forestill dere at NAV-kontoret har gitt et AI-svar til Astrid om foreldrepenger 9. mai 2026. Tre måneder senere kommer hun tilbake — hun mener svaret var feil, og hun klager. Internrevisjon kommer på stikkprøve. Hvordan beviser dere hva AI-en faktisk sa, og på hvilket grunnlag?»

Vis CSV-en:

> «Dette er en typisk AI-logg. Ser den fin ut? Den er det. Men la meg vise hva den *ikke* gir dere.»

### Del 2 · Vis hva som mangler i CSV-verdenen (3 min)

Pek på CSV-en og still rommet disse spørsmålene:

> «1. Kan vi bevise at `response`-kolonnen ikke er endret etter loggen ble skrevet?»

Pause. La rommet svare.

> «Nei. Det er en database-rad. DBA kan endre den, en migrasjon kan ødelegge den, en eksport kan trimme felter.»

> «2. Hvilken systemprompt versjon ble brukt? Det står `sp-foreldrepenger-v3`, men hvor ligger v3? Hvor er v2? Hvilken `gpt-4o`-snapshot var aktiv?»

> «3. Hvilke kilder ble brukt? Står ikke i CSV. RAG-treff? Vektor-DB? Lov-paragrafer? Vi vet ikke.»

> «4. Hvis Astrid klager om 6 måneder og leverandøren har migrert databasen i mellomtiden — kan dere fortsatt rekonstruere?»

Punktet er klart: CSV-en er en *påstand*, ikke et *bevis*.

### Del 3 · Slå på TSP (5 min)

Bytte til playground-en. Vis envelope #2 fra synthetic-nav-case.md.

> «Samme svar — men nå wrappet i en TrustEnvelope.»

Pek på feltene:

> «`source.references` — to lov-paragrafer fra Lovdata, med URL og hentetidspunkt. Ikke fri tekst, ikke etter-rekonstruksjon. Bundet kryptografisk til svaret.»

> «`process.model` — gpt-4o-2024-08-06. Konkret modell-snapshot. `systemPrompt.provided: false` med begrunnelse `redacted-confidential` — fraværet er deklarert, ikke skjult.»

> «`alignment.riskLevel: medium`, `flags: [legal-content]` — riktig risiko­klassifisering for juridisk innhold.»

> «`ledger.previousEnvelopeId` — kjedet til forrige envelope i saken. Hash-kjede.»

> «`signatures` — Ed25519-signatur fra NAV-instansens nøkkel. Verifiserbar uten leverandør-tilgang.»

Klikk **Verifiser**. Vis at alle 10 checks går grønt.

> «Det vi nettopp gjorde: i nettleseren deres, akkurat nå — hentet manifest, sjekket cert-chain, verifisert signatur, rebygde contentHash, validerte tidsstempel. Ingen tilgang til NAVs systemer. Ingen tilgang til OpenAI. Bare matematikk.»

### Del 4 · Tamper-bruddet (3 min)

> «Nå skal vi se hva som skjer hvis noen prøver å endre svaret etter signering.»

Endre `content.answer`-feltet i envelope-en. Bytt ut «seks» med «tre» i opptjenings-vilkåret. Gjør det synlig:

```diff
- "answer": "Du har rett til foreldrepenger... seks av de siste ti månedene..."
+ "answer": "Du har rett til foreldrepenger... tre av de siste ti månedene..."
```

> «Lite tegn-endring. Ville sannsynligvis ikke blitt fanget i en CSV-revisjon. Vi prøver verifyLocal igjen.»

Klikk **Verifiser**. Den feiler med rødt.

> «Se på `failures`-listen. `contentHash mismatch`. Ikke en regel som ble brutt — en SHA-256-hash som ikke matcher. Mekanisk, matematisk, umulig å skjule.»

Vis det i feilmeldings-detaljen:

```
expected: sha256:3a5b7c9e1d2f4a6b...
actual:   sha256:9c1e3d5f7a9b1c3d...
```

> «Endrer dere ett tegn — i svaret, i kilde-listen, i modell-versjonen — fanges det her. Uten å spørre noen. Uten å stole på noen.»

### Del 5 · Evidence-pakken (2 min)

> «Siste poeng. Si tilsynet kommer til dere og ber om stikkprøve på 50 vilkårlige AI-svar fra Q1 2026. Hvordan svarer dere i dag?»

Pause. La rommet svare. Vanlig svar: «Vi ber leverandøren om eksport, vi venter, vi sjekker.»

> «Med TSP genererer dere en Evidence-pakke. ZIP med 50 envelopes + en verifikasjons-rapport. Send til tilsyn. De kjører `verifyLocal` i sin egen nettleser — i din ende av møtet er dere ferdige.»

Vis evidence-pakken (eller beskriv strukturen):
- 50 envelope-filer
- En `verification-report.json` som dokumenterer at alle 50 verifiserte grønt da pakken ble laget
- Manifest-snapshot bundet i pakken

> «Stikkprøve-revisjon på 30 minutter, ikke 30 dager. Tilsynet eier verifikasjonen. Dere eier evidens-formatet.»

---

## Avslutning (avhengig av rommet)

### For compliance / internrevisjon

> «Hva dette gir dere er en revisjons-modus som er strukturelt sterkere enn alt dere har i dag. Tilsynet eller revisor verifiserer i sin egen nettleser, dere mister ikke audit-historikk hvis dere bytter leverandør, og bøter-reduserende dokumentasjon er kryptografisk bundet til hver beslutning.»

> «Neste steg: les `docs/FOR-AUDITORS.md`. La en jurist se på `docs/CONTRACT-CLAUSE.md` for hvordan dere stiller TSP-krav i neste anbud.»

### For anskaffelse

> «I neste AI-anbud kan dere skrive: 'Leverandøren skal levere TSP-kompatible TrustEnvelopes.' Det er én klausul som filtrerer ut leverandører som ikke kan dokumentere etterprøvbarhet — uten at dere må vite alt om krypto.»

> «Klausul-skissen ligger i `docs/CONTRACT-CLAUSE.md`.»

### For ledelse / styre

> «AI-risikoen flytter seg ikke til leverandøren bare fordi dere kjøper SaaS. AI Act art. 26 gir dere ansvar som deployer. TSP er måten dere reduserer den risikoen til noe målbart, ikke håpbart.»

> «Pris-rammen er enkel: standard-laget er gratis MIT, og verktøy-laget er betalt convenience-software. Dere kan bygge selv mot standarden, eller lisensiere Risk/Evidence/Oversight når fart og support betyr noe.»

### For AI-leverandører

> «Hvis dere implementerer TSP, blir dere forhåndskvalifisert for anbud i regulert sektor uten å forklare audit-arkitekturen forfra. Det er en differensierings­vei.»

> «`docs/PORTING-GUIDE.md` har conformance-nivåer og test-vektorer. Spec er CC-BY 4.0, referanse-SDK er MIT.»

---

## Vanlige spørsmål under demoen — og svar

**«Hva hvis modellen hallusinerer?»**
TSP signerer hallusinasjonen. Det beviser hva modellen faktisk sa, basert på hvilke kilder. Hallusinasjons-deteksjon er en separat funksjon (eval-suiter). Men hvis hallusinasjonen oppdages i ettertid, kan dere bevise *hva* som ble sagt og *hvorfor* — det er der TSP er sterkest.

**«Kan ikke leverandøren bare lyve i `process.model`-feltet?»**
Jo, hvis de er bevisst uærlige. TSP fanger ikke vendor-attestation-svik; det krever signature fra modell-leverandøren selv (kommer i fremtidig versjon). Men: TSP fanger *endringer etter signering*, og det er hovedsmerten i dag. Vendor-svik er sjeldnere enn vendor-glemsel og leverandør-database-glitch.

**«Hva med modeller som kjører lokalt (Llama, Mistral self-hosted)?»**
Samme. Modellen er bare en `process.model`-streng i envelope-en. Lokale modeller wrap-er like godt — kanskje bedre, fordi dere har full kontroll over signaturnøkkelen.

**«Hvorfor ikke bruke vendor-loggen direkte?»**
Den ligger i deres database. Endringer er stille. Eksport-format er proprietært. Dere har ingen forhandlings­makt om de bytter format eller stenger ned.

**«Bryter dette personvern?»**
Charter §10/§11: Risk-modulen aggregerer på envelope-nivå, aldri brukere. Innhold prunes ved decide-time. TSP er kompatibelt med GDPR fordi det er meta-hashes, ikke bruker-tracking.

**«Er dette norsk-spesifikt?»**
Nei. EU AI Act er EU-bredt; TSP-spec er språk-uavhengig. Navnene på lov-paragrafer i kilde-erklæringer er hva enn lokasjonen krever.

**«Hva med dataresidens?»**
Standard-laget er sovereign-by-default. Betalte verktøy (Risk/Evidence/Oversight) kan leveres hosted i EU eller on-prem under kommersiell lisens.

---

## Hvis demoen feiler

Vanlige problemer og raske fix:

- **Manifest henter ikke:** sjekk at site/playground har internett-tilgang. Hvis offline-demo: bruk `trustedKeys`-mode.
- **Verifyresultat er gult:** typisk cert nær utløp eller TSA-warning. Forklar at det er informativt; demoen fortsetter.
- **Tamper-test viser ikke endring:** sjekk at du redigerte det riktige feltet, og at re-verify ble klikket. Refresh playground hvis nødvendig.
- **Rommet er distrahert av krypto-detaljer:** styr tilbake til kjøper-perspektivet. Ikke gå dypt i Ed25519. «Det er signatur-matematikk; det fungerer.»

---

## Etter demoen — oppfølging

Send i e-post innen 24 timer:

- Lenker til `WHAT-IS-TSP.md`, `FOR-BUYERS.md`, `CONTRACT-CLAUSE.md`
- Dato-forslag for oppfølgings-møte
- Spørsmål: «Hvilken responskjede ville være første pilot-kandidat?»

Hvis pilot-kandidat identifiseres, gå til `docs/PILOT-PROGRAM.md`.

---

## Variant: 5-minutters lyn-demo

Hvis du har 5 minutter (anskaffelse-møte, lobby, korte vinduer):

1. (1 min) «AI-svar ligger i leverandørens database. Tilsynet kommer. Hvor sterkt er beviset deres?»
2. (1 min) Åpne playground, vis envelope. «Kilde, modell, prosess, alignment — kryptografisk signert.»
3. (1 min) Tamper-test. Vis hash-bruddet.
4. (1 min) «Evidence-pakke til tilsyn. Stikkprøve i nettleseren. Ferdig.»
5. (1 min) «Klausul-skissen som stiller dette som krav i anbud: `docs/CONTRACT-CLAUSE.md`. La oss snakke i neste uke?»

---

## Variant: Asynkron demo (video / e-post)

Hvis du ikke kan være i rommet:

1. Send playground-URL med pre-loaded envelope: `https://truststandardprotocol.com/playground?demo=synth-nav-002`
2. Loom-video (5 min) som følger script-en over.
3. Lenker: `WHAT-IS-TSP.md`, `FOR-BUYERS.md`, `CONTRACT-CLAUSE.md`.
4. Spørsmål i e-posten: «Hvilken responskjede i deres organisasjon ville første pilot-kandidat være?»

---

*Sist oppdatert 2026-05-09. Demoen er testet i interne run-throughs. Justeres når første eksterne demo gir feedback. Charter §6: ingen ramme i demoen overstiger det TSP faktisk gjør.*
