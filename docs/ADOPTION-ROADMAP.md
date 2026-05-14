# TSP Adoption Roadmap — Foundation → Proof → Pull → Standard

> Sekvens, ikke kalender. Hvert steg øker troverdighet, friksjonsfrihet og ekstern avhengighet til TSP. Et steg er «ferdig» når det objektive kriteriet er oppfylt — ikke når en dato passerer.
>
> Dette er adopsjons-strategien i én fil. Den skal være kort nok til å lese på 10 minutter, og spesifikk nok til at hver tiltak har et målbart utfall.

---

## Hvorfor sekvens, ikke kalender

TSP er ikke en SaaS-launch. Det er en standard-spredning. Standarder vinner ved at hvert lag av troverdighet er bygget på det forrige — ikke ved at en kalender­dato passerer. Hopper du over et steg, kollapser stegene over.

Konkret: hvis ingen fremmede har klart wrap/verify-roundtrip mot LexiCos manifest, så kan du ikke pitche pilot. Hvis ingen pilot kjører, så kan du ikke pitche standardisering. Sekvensen er bærende.

---

## Steg 1 · Foundation — gjør TSP adopterbart

**Mål:** TSP er offentlig, installérbart, verifiserbart og forståelig uten LexiCo i rommet.

**Hva som må sitte:**

- npm-pakker public (`@lexitsp/sdk@alpha`, `@lexitsp/trustbadge-react@alpha`)
- GitHub-repos public med README, LICENSE, SECURITY.md, CHANGELOG
- Site live på stabil URL (`https://truststandardprotocol.org`)
- Manifest hosted på `https://truststandardprotocol.org/.well-known/tsp-manifest.json`
- CI på push (`bun run test` + `bun run next build`)
- Hver public surface (README, npm description, hero, charter) peker mot **én** kanonisk «hva er TSP?»-tekst — `docs/WHAT-IS-TSP.md`. Charter §6.

**Done når:**

- En fremmed utvikler kan finne TSP via npm/GitHub, lese hva det er, og installere SDK + TrustBadge uten privat instruks fra LexiCo.
- En fremmed maskin kan kjøre `verifyLocal(envelope, manifest)` mot et LexiCo-signert envelope, hente manifestet fra HTTP, og få grønt resultat — uten lokal konfig fra LexiCo.

**Fallgruver:**

- Tro at Foundation er «administrativt». Det er første standardiseringslag — hvis pakker, manifest og verify ikke er offentlig, er TSP fortsatt privat briljans.
- Bruke nye metaforer i marketing-overflater («HTTPS for AI», «Proof of X»). Charter §6 forbyr det.
- Optimalisere plattform-modulene (Risk/Evidence/Oversight) før standard-laget er offentlig. Standarden driver adopsjon, ikke plattformen.

**Status per 2026-05-09:** Lokalt ferdig, offentlig blokkert. Se `docs/LAUNCH-CHECKLIST.md` P0-listen.

---

## Steg 2 · Proof — bevis at TSP løser et reelt smerteproblem

**Mål:** Eksterne mennesker *opplever* — ikke bare leser — at TSP er bedre enn dagens audit-praksis.

**Hva som må sitte:**

- **Dev gulden sti:** «Hello, TrustEnvelope» — installer SDK, wrap et fiktivt AI-svar, tukle med payload, se `verifyLocal` feile matematisk. Dokumentert i `docs/QUICKSTART.md`. Tar 5 minutter.
- **Audit gulden sti:** Syntetisk 3-envelope NAV-lignende case (se `docs/examples/synthetic-nav-case.md`), Evidence-pakke generert, walk-through dokumentert i `docs/FOR-AUDITORS.md`.
- **Governance gulden sti:** Demonstrer charter §7 i Oversight (ingen AI-foreslag), §10 (envelope-aggregat aldri brukere), §11 (data-minimering ved decide-time). Repro-bare fra repo.
- **AI Act-mapping per artikkel** med konkret schema-felt-eksempel — se `/eu-ai-act/article-9, 12, 13, 14, 15, 17` på sitet.

**Done når:**

- Minst én ekstern utvikler har kjørt wrap/verify-roundtrip mot LexiCos manifest, helt selv, uten support i rommet.
- Minst én ekstern fagperson (compliance/jurist/revisor) har sett Evidence-pakke-demoen og kan gjengi med egne ord hvorfor TSP er sterkere enn CSV-eksport.
- Tre navngitte personer kan forklare TSP korrekt på 30 sekunder uten LexiCo til stede (én dev, én compliance, gjerne én fra regulert sektor).

**Fallgruver:**

- Overforklare i stedet for å la noen *oppleve* tamper-bruddet selv.
- Bruke et shelvet eller eksternt produkt som demo-case. Bruk syntetiske data til pilotene har egne, avklarte data.
- La demoene bli generiske «AI-dashboards». Hold fokus på per-svar-proveniens, verifiserbarhet, og AI Act-mapping.

---

## Steg 3 · Pull — få konkrete miljøer til å ville bruke TSP i liten skala

**Mål:** Aktører med akutt audit/dokumentasjons-smerte ber om å få TSP inn i sin stack.

**Strategisk skifte (2026-05-09):** Pull-fasen sikter primært på **AI-kjøpere (deployers)**, ikke leverandører. Dette er avgjørende — kjøpere bærer AI-risikoen (AI Act art. 26), har kontraktuell forhandlings­makt, og hver kjøper presser flere leverandører til å snakke TSP. Multiplikatoreffekt: én kunde lander, 3–5 leverandører blir TSP-kompatible som følge. Markedsanalysen i `docs/MARKET-ANALYSIS.md` argumenterer for dette i detalj.

**Hvor smerten er størst (prioritert):**

1. **Operatører av høyrisiko AI** i regulert sektor — offentlig sektor (NAV, Skatt, kommuner, helseregion), finans, helse, energi, kritisk infrastruktur
2. **Større arbeidsgivere** med interne AI-pilotløp som trenger oppgraderbar audit-sti
3. **Revisjon/due diligence/assurance-miljøer** som selger «AI Act readiness» og trenger konkrete evidens-formater
4. **AI-leverandører som selger inn i regulerte domener** — disse adopterer reaktivt, drevet av kundekrav fra Tier 1

**Hva tilbudet er:**

- **Kontraktsklausul som hovedvåpen** — `docs/CONTRACT-CLAUSE.md`. Kjøperen inkluderer den i neste anbud; leverandører tvinges å implementere TSP eller funksjonelt ekvivalent åpen standard.
- **Standard-laget først** — SDK + TrustBadge + selvhostet manifest. Gratis, MIT.
- **Plattform-laget når den operasjonelle smerten er kjent** — Evidence for én audit-simulering, Risk for én alarm-flow, Oversight for én review-kø. Gainsharing.
- **Ikke full plattform med en gang** — la dem starte lite og oppdage smerten.

**Hvordan det pakkes:**

- Pilot-program-template: `docs/PILOT-PROGRAM.md`. 6–12 ukers begrenset bruk på én konkret responskjede.
- Demo-script for kjøper-rom: `docs/DEMO-SCRIPT.md`. 15-min demo som lar rommet *føle* forskjellen mellom CSV og envelope.
- Kjøper-orientert positionering: `docs/FOR-BUYERS.md`. Forhandlings­makt mot leverandører.
- «TSP in practice»-tekster per segment — `QUICKSTART.md` (utvikler), `FOR-AUDITORS.md` (compliance), `FOR-LEADERS.md` (anskaffelse), `FOR-BUYERS.md` (kjøpere).

**Done når:**

- Minst én ekstern organisasjon bruker TSP i en avgrenset, men ekte prosess (PoC, internkontroll, eller pilot) med reelle data.
- De har generert minst én Evidence-pakke og/eller brukt Risk/Oversight i praksis.
- Minst én pilot publiserer avklarte, anonymiserte tall (alarm-rater, review-utfall, ISO 42001-kost).

**Fallgruver:**

- Selge plattformen før standarden har trekkraft. Hvis TSP først oppfattes som hosted SaaS, mister du standardkraften som ligger i MIT + CC-BY + sovereign-first.
- La avtaleverk og prising bli mer komplisert enn TSP. Standarden skal kjennes større enn forretningsmodellen.
- Tro at én case redder pull-fasen alene. Pull kommer av flere organisasjoner som kjenner samme audit-smerte.

---

## Steg 4 · Standard — gjør TSP større enn LexiCo

**Mål:** TSP fungerer som en felles referanse for AI-proveniens, og blir noe markedet kjenner igjen uten å først kjenne LexiCo.

**Hva som må sitte:**

- **Spec-governance dokumentert** — `docs/SPEC-GOVERNANCE.md`. Hvordan spec styres, semver, breaking changes, hvordan eksterne foreslår.
- **Porting-guide** — `docs/PORTING-GUIDE.md`. Invitasjon til referanse-implementasjoner i Rust/Python/Java/Go.
- **Tredjeparts artefakter** — minst én ekstern implementasjon, partner-demo, eller audit-simulering publisert utenfor LexiCo.
- **Språklig disiplin** — TSP omtales som «åpen spec, MIT-referanse, brukt av X/Y/Z», ikke som «standard» i juridisk forstand. Charter §6.

**Done når:**

- Mer enn én aktør bruker TSP-standard-sonen, og minst én du ikke selv har onboardet personlig.
- Minst én ekstern referanse-implementasjon eller tydelig referanse til TSP i andres verktøy/papers.
- Andre begynner å omtale TSP som «måten vi gjør AI-proveniens på her», uavhengig av om de bruker LexiCo-plattformen.

**Fallgruver:**

- Erklære TSP som «EU-standard» før det faktisk er det. Charter §6.
- Knytte standardiserings-arbeid til kommersiell SaaS-launch. Standarden bygges først gjennom bruk, så gjennom anerkjennelse, og eventuelt senere gjennom formalisering.
- Lukke spec-prosessen (proprietær governance) — det ville ødelegge alt som er bygget i de tre foregående stegene.

---

## Sekvens-prinsippet — «prove, don't pitch»

TSP er sterkest når den **demonstreres**, ikke forklares. Tre demo-former kjører gjennom hele sekvensen:

1. **Dev-demo** (Proof + Pull) — wrap, tamper, verify fail, badge render. Minutter, ikke timer.
2. **Audit-demo** (Proof + Pull) — hent ut Evidence-pakke, verifiser uten leverandør-tilgang. En syntetisk case-pakke holder for Proof; ekte case for Pull.
3. **Governance-demo** (Proof + Standard) — vis at oversight ikke får AI-foreslag (charter §7), at data minimeres (§11), at plattformen ikke lagrer innhold permanent (§11).

TSPs edge er ikke «features» — det er **kombinasjonen** av kryptografisk binding, suverenitetslogikk og charter-disiplin. Demoer viser kombinasjonen; pitch-er flater den ut.

---

## Hardt adopsjonsprinsipp — «alt som teller er ting andre får til uten deg»

Ikke tell ting du har bygget. Tell ting eksterne har gjort med det du har bygget:

- Antall fremmede maskiner som har verifisert et envelope.
- Antall fremmede utviklere som har kjørt wrap/verify-roundtrip.
- Antall organisasjoner som bruker TSP i en avgrenset PoC.
- Antall ikke-LexiCo-personer som kan forklare TSP korrekt på 30 sekunder.
- Antall referanse-implementasjoner i andre språk.

Hvis disse er null, er du fortsatt i Foundation — uavhengig av hvor mange tester som er grønne.

---

## Status per 2026-05-09

| Steg | Status | Hovedblokker |
|---|---|---|
| Foundation | I gang | Public npm + GitHub + DNS + manifest-hosting (P0 i `LAUNCH-CHECKLIST.md`) |
| Proof | Kan kickes off så snart Foundation er live | Trenger 1 ekstern dev + 1 ekstern compliance-person for først validering |
| Pull | Forberedt | Pilot-program-template klar (`PILOT-PROGRAM.md`); trenger første eksterne deployer |
| Standard | Forberedt | Spec-governance + porting-guide skrevet (`SPEC-GOVERNANCE.md`, `PORTING-GUIDE.md`); venter på Pull-bevis |

---

## Min lesning av rekkefølgen — kort

1. **Foundation:** gjør TSP offentlig, installérbart og uavhengig verifiserbart.
2. **Proof:** få eksterne mennesker til å oppleve hvorfor dette slår dagens audit trail.
3. **Pull:** få konkrete miljøer med regulert smerte til å ville bruke det i liten skala.
4. **Standard:** la åpenheten, interoperabiliteten og ekstern bruken gjøre TSP større enn LexiCo.

Det vanskeligste er gjort — arkitekturen kan bære reisen. Nå er det iscenesettelse av adopsjon, ikke oppfinnelse.

---

*Sist oppdatert 2026-05-09. Sekvensen revideres når et steg er done eller når en fallgruve treffes. Charter §6: hvis dokumentet hevder noe som ikke matcher virkeligheten, er dokumentet feil.*
