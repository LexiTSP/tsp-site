# Hva er TSP?

> **TSP er en åpen standard som wrapper hver AI-utgang i en signert TrustEnvelope slik at kilde, prosess og alignment kan etterprøves uavhengig av leverandøren som genererte den.**

Dette dokumentet er den **kanoniske 30-sekunders forklaringen**. Hver README, hver hero, hvert pitch-deck og hver e-post som forklarer TSP til en fremmed, peker hit. Charter §6 (språk = arkitektur) krever at alle overflater er enige om hva TSP er — denne fila er sannhets-kilden for det.

Lenger forklaringer: `docs/ABOUT.md`. Teknisk referanse: `docs/TSP-OVERSIKT.md`. Bærende prinsipper: `docs/charter.md`.

---

## 30 sekunder

Hver gang en AI gir et svar, signerer TSP det med kilde, modell og tidspunkt. Senere kan hvem som helst etterprøve svaret — uten å spørre leverandøren. Endrer noen ett tegn etter at det er signert, ser du det umiddelbart.

Standarden er åpen (MIT SDK, CC-BY 4.0 spec). Du kan kjøre TSP fullt ut på din egen infrastruktur. Hosted plattform-moduler (Risk, Evidence, Oversight) er valgfrie.

Posisjonell kategori: **etterprøvbar AI-proveniens for regulerte AI-systemer.**

## For AI-kjøpere (én setning)

TSP er en åpen standard som gjør hver AI-utgang etterprøvbar med en signert TrustEnvelope, slik at virksomheten selv kan verifisere hva systemet gjorde, på hvilket grunnlag, uavhengig av leverandøren. Se `docs/FOR-BUYERS.md` og `docs/CONTRACT-CLAUSE.md`.

---

## 60 sekunder

EU AI Act krever at høyrisiko AI-svar må kunne **rekonstrueres etterpå** — kilde, modell, prosess, oppsyn. Dagens stack klarer ikke det: logger lever i leverandørens database, kilder er fri tekst, modell-versjon er en usignert HTTP-header, og «audit trail» er en CSV som kan endres uten spor.

TSP løser dette ved å gjøre **selve AI-svaret** til det som signeres. Hvert svar wrappes i et `TrustEnvelope` med fire strukturerte felter:

- `source` — hvor faktagrunnlaget kom fra (lov-paragrafer, vektor-DB-hits, intern KB)
- `process` — modell, modell-versjon, systemprompt, pipeline-steg
- `alignment` — risikonivå, domene, policy-versjon
- `ledger` — hash-kjede til forrige envelope + RFC 3161 tidsstempling

Alt canonicaliseres (RFC 8785) og signeres (Ed25519). En revisor kan verifisere envelopet i nettleseren sin — ingen leverandør-tilgang, ingen LexiCo-konto.

---

## Hva TSP er — i én tabell

| TSP er… | TSP er ikke… |
|---|---|
| En åpen standard for AI-proveniens | En AI-modell |
| Et wire-format (`TSP/3.0`) | En eval-suite |
| En MIT-lisensiert TypeScript SDK (`@lexitsp/sdk`) | En policy-motor |
| En drop-in React-badge for sluttbruker (`@lexitsp/trustbadge-react`) | En SaaS-logger |
| En valgfri hosted plattform (Risk, Evidence, Oversight) | En AI-governance-suite med dashboard |

---

## Hvem bygger det

LexiCo AS — civic-tech-selskap i Tønsberg. Standarden er CC-BY 4.0, referanse-implementasjonen er MIT, og TSP er bevisst designet for å overleve LexiCo som forretningsenhet.

Charter §6 binder LexiCo til at marketing aldri overstiger det formatet faktisk garanterer. Hvis dette dokumentet hevder noe som ikke matcher kildekoden, er dokumentet feil — ikke koden.

---

## Hvor du går videre

- **Vil prøve på 30 sekunder:** `https://truststandardprotocol.com/playground`
- **Vil installere på 5 minutter:** `docs/QUICKSTART.md`
- **Er AI-kjøper (deployer):** `docs/FOR-BUYERS.md`
- **Er compliance/revisor:** `docs/FOR-AUDITORS.md`
- **Er leder/anskaffelse:** `docs/FOR-LEADERS.md`
- **Skal stille TSP-krav i anbud:** `docs/CONTRACT-CLAUSE.md`
- **Skal holde demo for kjøper-rom:** `docs/DEMO-SCRIPT.md`
- **Vil forstå hele systemet:** `docs/ABOUT.md`
- **Vil forstå markedet TSP plasserer seg i:** `docs/MARKET-ANALYSIS.md`
- **Vil se de bærende prinsippene:** `docs/charter.md`
- **Vil bli pilot:** `docs/PILOT-PROGRAM.md`
- **Vil implementere TSP i et annet språk:** `docs/PORTING-GUIDE.md`
- **Er DPO/jurist og lurer på AI Act ↔ GDPR-rekonsiliering:** `docs/spec/reconciliation.md`

---

*Sist oppdatert 2026-05-09. Hvis denne sida er lengre enn 60 sekunders lesing, er den blitt feil — kort den ned.*
