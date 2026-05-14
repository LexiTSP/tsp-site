# TSP Spec Governance

> Hvordan TSP-spesifikasjonen styres, versjoneres og endres. Skrevet for at TSP skal kunne bli en åpen standard markedet kjenner igjen — ikke et vendor-format med åpen lisens.
>
> Charter §5 («åpen standard, åpen referanse») og §9 («versjon og endring») er de bærende paragrafene for denne fila. Hvis denne fila motsier charteret, er denne fila feil.

---

## 1 · Målsetning

TSP-spec-en (`TSP/3.0` og fremtidige versjoner) er **CC-BY 4.0** og frittstående fra `@lexitsp/sdk`. Spec-en eksisterer for at:

- Tredjeparts implementasjoner i andre språk skal være interoperable med referanse-implementasjonen.
- Endringer er deliberate, dokumenterte, og bakover-kompatible der det er mulig.
- Implementatorer kan pin-e mot en spec-versjon og vite at envelopes signert under den versjonen forblir verifiserbare.

Spec-glidning er den raskeste måten å miste etterprøvbarhet på. Governance-en er strengere enn kode-utvikling fordi spec er kontrakten.

---

## 2 · Versjonering

Spec-en følger **semver** med disse reglene:

| Endring | Versjon-bump | Eksempel |
|---|---|---|
| Bruddende schema-endring (eksisterende envelopes ikke lenger valide) | **Major** | `TSP/3.0` → `TSP/4.0` |
| Bakover-kompatibelt tillegg (nye optional felter, nye check-IDs) | **Minor** | `TSP/3.0` → `TSP/3.1` |
| Klargjørende språk, typo-fix, lenker | **Patch** | `TSP/3.0.0` → `TSP/3.0.1` |

**Wire-versjon vs SDK-versjon:** SDK-en versjoneres uavhengig. `@lexitsp/sdk@3.0.0` implementerer `TSP/3.0`-wire-versjonen, men SDK-bumps (3.0.1, 3.1.0) endrer ikke wire-versjonen med mindre spec faktisk endres. Wire-versjonen er det som signerer envelope-er; SDK-versjonen er bare implementasjonen.

**Frosne wire-versjoner:** En spec-versjon som er publisert er **frossen**. Vi endrer ikke `TSP/3.0` retroaktivt — feil i spec rettes ved å publisere `TSP/3.0.1` eller `TSP/3.1`. Dette er charter §9-bindingen.

**Migrasjons-fixtures:** Hver SDK-versjon shipper med fixtures fra hver tidligere stabile spec-versjon. CI verifierer at gamle envelopes fortsatt verifiseres etter SDK-bump.

---

## 3 · Hvordan endringer foreslås

### 3.1 RFC-prosess (åpen)

Forslag til spec-endringer (alle, fra trivielle til major) går gjennom en lett RFC-prosess:

1. **Issue** opprettes i `github.com/lexitsp/spec` med tag `rfc-proposal`.
2. **RFC-tekst** følger malen i `spec/rfcs/_template.md`:
   - Tittel + tracking-ID
   - Problemet som løses (konkret, ikke spekulativ)
   - Foreslått endring (schema-diff hvis aktuelt)
   - Bakover-kompatibilitet (hva brytes, for hvem)
   - Alternativer som ble vurdert
   - Charter-paragrafer som påvirkes
   - Referanse-implementasjon (proof-of-concept, kan være branch)
3. **Diskusjon** i issue-tråden i minst 14 dager før beslutning.
4. **Beslutning** av spec-vedlikeholdere (se §4). Tre utfall: `accepted`, `deferred`, `rejected` — alle med skriftlig begrunnelse.
5. **Implementasjon** i SDK + spec-dokument samtidig. Ikke merge spec-PR uten matching SDK-PR.

### 3.2 Hvem kan foreslå

Alle. RFC-prosessen er åpen for tredjeparter, akademia, andre implementatorer, kunder og LexiCo-vedlikeholdere — samme prosess for alle.

### 3.3 Når RFC ikke trengs

- Typo-fix og klargjørende språk i spec-dokumentet (patch).
- Lenkeoppdateringer.
- Tillegg av implementasjons-eksempler som ikke endrer schema.

Disse går som vanlige PR-er. Alt som endrer schema, validering eller verify-checks krever RFC.

---

## 4 · Vedlikeholdere

### 4.1 Nåværende sammensetning

Per 2026-05-09 er TSP-spec vedlikeholdt av **Julian Andersen Berge / LexiCo AS**. Dette er åpent erkjent: spec-en er ennå ikke styrt av en flerparts-organisasjon, og skal ikke fremstilles som det.

Charter §6: vi hevder ikke bredere governance enn vi har.

### 4.2 Utvidelse av vedlikeholder-kretsen

Når TSP får ekstern adopsjon (Steg 3 og 4 i `ADOPTION-ROADMAP.md`), vil vedlikeholder-kretsen utvides. Kriterier for ekstern vedlikeholder:

- Har bidratt minst én godkjent RFC eller en stor implementasjons-PR.
- Har offentlig tilknytning til en organisasjon som adopterer TSP.
- Aksepterer charter-bindingen.

Hver ny vedlikeholder kunngjøres i CHANGELOG og i `MAINTAINERS.md`.

### 4.3 Beslutnings-modell

**Konsensus med veto:** En RFC er akseptert hvis ingen vedlikeholder vetoer innen diskusjons-vinduet. Veto må begrunnes skriftlig og med referanse til charter-paragraf eller konkret bruddflate.

Ved uenighet om veto-gyldighet, eskalerer beslutningen til skriftlig avstemning blant vedlikeholdere — simpelt flertall, vedlikeholderen som foreslo RFC stemmer ikke.

---

## 5 · Forholdet til charter

Charteret (`docs/charter.md`) er **normativt** for spec. Hvis et foreslått spec-endring bryter en charter-paragraf, må enten:

- RFC-en avvises, eller
- Charter-paragrafen revideres først (se charter §12).

Vanlige bindinger:

- §3 (eksplisitt deklarasjon over taus optionality) — nye felter må være `{ provided: true | false, ... }`-unioner, ikke `optional: T | undefined`.
- §5 (åpen standard) — spec kan ikke kreve proprietære avhengigheter (lukket TSA, lukket CA, lukket canonicalizer).
- §6 (språk = arkitektur) — terminologi i spec må matche det formatet faktisk garanterer.
- §10 (envelope-aggregat aldri brukere) — felter som åpner for bruker-tracking på aggregat-nivå er forbudt.
- §11 (data-minimering) — spec kan ikke kreve permanent lagring av innhold.

---

## 6 · Spec-dokumentets struktur

`TSP/x.y` spesifiseres i tre artefakter:

| Artefakt | Lokasjon | Formål |
|---|---|---|
| **Normativ tekst** | `spec/TSP-3.0.md` | Bindende beskrivelse av schema, validering og verify-checks |
| **JSON-LD context** | `spec/contexts/tsp-3.0.jsonld` | Maskin-lesbar kontrakt; brukes i envelope `@context` |
| **Test-vektorer** | `spec/test-vectors/3.0/*.json` | Kanoniske eksempler implementasjoner verifiserer mot |

Alle tre artefakter må være i sync — en endring i normativ tekst uten oppdaterte test-vektorer er en spec-feil.

---

## 7 · Spec-deprecation

Når en major-versjon avvikles:

1. Minst **24 måneders forhåndsvarsel** før deprecation begynner.
2. Deprecation-status synlig i spec-dokumentet og i SDK CHANGELOG.
3. Migrasjons-guide publisert sammen med ny major-versjon.
4. SDK opprettholder verify-støtte for deprecated wire-versjoner i minst **5 år** etter deprecation — fordi envelopes signert under gammel versjon må fortsatt være etterprøvbare.

Charter §9: spec-glidning er den raskeste måten å miste etterprøvbarhet på. Deprecation-disiplinen er stram fordi det er der etterprøvbarhet brytes hvis vi er slurvete.

---

## 8 · Sikkerhets-rapportering

Sikkerhets­problemer i spec (ikke implementasjonen) — f.eks. en oppdaget angrepsflate i schema-design eller signing-domain — rapporteres til **security@lexico.no** med PGP-kryptering hvis sensitivt.

Public disclosure-policy:

- 90 dager embargo fra rapportering til offentlig bekjentgjørelse.
- Hvis fix krever wire-versjon-bump, koordineres timing med SDK-release.
- Charter §8 (eierskap til feil): public post-mortem ved bekreftede sikkerhets-feil.

---

## 9 · Lisens og opphav

- **Spec-dokument og test-vektorer:** CC-BY 4.0. Du kan kopiere, modifisere og distribuere så lenge opphavet krediteres.
- **JSON-LD context:** CC-BY 4.0.
- **Referanse-implementasjon (`@lexitsp/sdk`):** MIT.

CC-BY 4.0 er valgt over public domain (CC0) fordi attribusjonen sikrer sporbarhet til opphavet. Det er ikke et lisens-hindring for adopsjon — du kan implementere TSP kommersielt uten å spørre LexiCo.

---

## 10 · Hvor du foreslår en endring

- **Issue:** `https://github.com/lexitsp/spec/issues/new?template=rfc-proposal.md`
- **PR (kun for typo/klargjøring):** `https://github.com/lexitsp/spec/pulls`
- **Sikkerhet:** security@lexico.no (PGP-fingerprint i `SECURITY.md`)
- **Diskusjon før RFC:** julian@lexico.no eller åpen issue-tråd

---

## 11 · Hva som ikke er governance-spørsmål

For å unngå scope-creep i RFC-prosessen:

- **SDK-implementasjons-bugs** — `@lexitsp/sdk` issue-tracker, ikke spec-RFC.
- **TrustBadge UI-endringer** — `@lexitsp/trustbadge-react` issue-tracker.
- **Plattform-modul-features** (Risk, Evidence, Oversight) — egne issue-trackere; ikke spec.
- **Site-innhold** — TSP-site-repoet.

RFC-prosessen er for *spec*, ikke for ethvert TSP-relatert spørsmål.

---

*Sist oppdatert 2026-05-09. Charter §6: språket i denne fila må ikke overstige det praksisen faktisk er. Hvis vi ikke har eksterne vedlikeholdere ennå, sier vi det.*
