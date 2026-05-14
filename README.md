# TSP — Trust Standard Protocol

> **Åpen spesifikasjon og referanseimplementasjon for kryptografisk etterprøvbar AI-proveniens.**
> Spor hvert AI-svar tilbake til kilden. Bevis at det er uendret.

Dette repoet er en **standalone TSP-workspace** for TSP (`truststandardprotocol.org`): nettstedet ligger i roten, og SDK, TrustBadge og plattform-modulene ligger i `./packages/`.

---

## Hva er TSP?

Hver gang en AI gir et svar, signerer TSP det med kilde, modell og tidspunkt. Senere kan en mottaker eller revisor verifisere signatur, hash og manifest uten å spørre leverandøren. Endrer noen ett tegn etter at det er signert, ser verifikatoren det umiddelbart.

Teknisk: en åpen standard som wrapper hver AI-utgang som en signert `TrustEnvelope` (Ed25519 + SHA-256 + RFC 3161 + RFC 8785-canonicalization). Sovereign-by-default, MIT-lisens. Hosted plattform-moduler (Risk, Evidence, Oversight) er valgfrie.

For full forståelse — start med **`docs/TSP-OVERSIKT.md`** (norsk single-source-of-truth).

---

## Repo-layout (workspace)

Denne mappen er en `bun`-workspace. Nettstedet ligger i roten, og pakkene som nettstedet bruker ligger i `packages/`:

```
TSP/                                    bun-workspace root + nettsted
├── packages/
│   ├── lexitsp-sdk/                    @lexitsp/sdk@3.0.0-alpha.4 (MIT)
│   ├── trustbadge-react/               @lexitsp/trustbadge-react@0.2.0 (MIT)
│   ├── risk-server/                    @lexitsp/risk-server@0.1.0-alpha.1 (commercial)
│   ├── evidence-server/                @lexitsp/evidence-server@0.1.0-alpha.0 (commercial)
│   ├── oversight-server/               @lexitsp/oversight-server@0.1.0-alpha.0 (commercial)
│   └── control-plane-server/           @lexitsp/control-plane-server@0.1.0-alpha.0 (hosted pilot alpha)
├── messages/                           i18n-translations (no.json + en.json)
├── src/i18n/                           next-intl routing/middleware/navigation
├── src/middleware.ts                   locale-detection + x-pathname injection
├── src/app/[locale]/                   Next.js 15 App Router (NO/EN)
    │   ├── page.tsx                    Hjemmeside (hero + audience-frames)
    │   ├── playground/                 Ekte client-side SDK-demo
    │   ├── docs/                       API-referanse for SDK v3
    │   ├── spec/                       Formell spesifikasjon v3.0
    │   ├── eu-ai-act/                  Artikkel-mapping (9, 12, 13, 14, 15, 17)
    │   ├── core/, risk/, evidence/, oversight/            Modul-sider
├── src/app/sitemap.ts                  Sitemap + hreflang
├── src/components/
    │   ├── EnvelopeArtifact.tsx        Hjemmeside tamper-demo
    │   ├── HeroSeal.tsx                Civic-stamp SVG
    │   ├── FingerprintBand.tsx         Krypto-primitiv-tekstur
    │   ├── ChainVisualizer.tsx         Animert SVG-kjede
    │   ├── ModuleLayout.tsx            Felles skall for modul-sidene
    │   ├── ArticleLayout.tsx           Felles skall for EU AI Act-artikler
    │   ├── LocaleSwitcher.tsx          NO · EN toggle i header
    │   └── TspHeader.tsx, TspFooter.tsx
├── docs/
    │   ├── TSP-OVERSIKT.md             Single-source-of-truth (norsk)
    │   ├── WHAT-IS-TSP.md              Kort forklaring
    │   ├── QUICKSTART.md               Rask teknisk start
    │   └── charter.md                  Prinsipper for ærlig protokollspråk
├── theme.config.ts                     Palett, fonts, radii (med oker-aksent)
├── tsp.bat                             Windows kontrollpanel (start/stop/build/test/i18n-probe)
└── README.md                           ← denne fila
```

---

## Quick start

### Forutsetninger

- [Bun](https://bun.sh/) ≥ 1.0 (anbefalt) eller Node ≥ 18
- Node-versjon brukes kun for kompatibilitet — vi utvikler på Bun

### Kjør sitet lokalt

```bash
# fra denne mappen
bun install                            # installerer hele workspace
bun run dev                            # http://localhost:3838
```

På Windows: dobbeltklikk **`tsp.bat`** for et kontrollpanel-meny (start prod/dev, stopp, build, install, typecheck, run alle tester, vis LAN-URL-er, **probe NO+EN i18n-ruter**).

### Bygg for produksjon

```bash
bun run build                          # next build → 55 sider inkl. manifest-endepunkter
bun run start                          # next start på port 3838
```

### Kjør tester (hele stakken)

```bash
# fra denne mappen (workspace-root)
bun run check                          # build + alle package-tester + server-typecheck
bun run test                           # alle package-tester
bun run check:claims                   # charter §6 claim-lint for public copy/docs
bun run check:interop                  # clean-room verifier mot TSP-Spec-1.0-Candidate fixtures
bun run smoke:packages                 # pack + clean temp install + CLI/SDK/TrustBadge smoke
bun run smoke:production-start         # starter next start og sjekker nøkkelruter
bun run check:manifest                 # validerer public alpha manifest + instance cert
bun run check:release                  # check + manifest/package/prod-start smoke før public publish

# Per pakke
bun run test:sdk                       # SDK: 101 tester (Vitest)
bun run test:trustbadge                # TrustBadge: 24 tester (Vitest/jsdom)
bun run test:risk                      # Risk: 31 tester (bun:test)
bun run test:evidence                  # Evidence: 38 tester (bun:test)
bun run test:oversight                 # Oversight: 25 tester (bun:test)
bun run test:control-plane             # Control Plane: 4 tester (bun:test)
```

Total: **223 grønne tester** over hele bundle-en (101 SDK + 24 TrustBadge + 98 plattform-/control-plane-tester).

---

## Internasjonalisering (NO / EN)

Sitet kjører bilingual via [`next-intl@4.11`](https://next-intl.dev). Norsk er default og uendret URL-pattern (`/risk`, `/spec`); engelsk får prefix (`/en/risk`, `/en/spec`).

**Status:** Hele kjøps-trakt er fullt oversatt — hjemmeside, modul-sider, /priser, /sammenligning, /kontakt, /whitepaper, /endringer, /eu-ai-act (hovedside + alle 6 artikkel-sub-sider), /iso-42001, /spec, /docs.

**SEO:** `sitemap.xml` emitterer 50 URL-er (25 ruter × NO/EN) med per-side `xhtml:link rel="alternate"`-hreflang for `no`, `en`, `x-default`. In-head hreflang er per-side via middleware-injisert pathname.

**Locale-toggling:** `LocaleSwitcher` i header bytter locale uten å miste current path.

**Slik legger du til en ny streng:**
1. Legg til norsk + engelsk i `messages/no.json` + `messages/en.json` under riktig namespace
2. Bruk `useTranslations('namespace')` i client components, eller `getTranslations({ locale, namespace })` i server components
3. For data-arrays (entries, clauses, etc.): definer `_NO` og `_EN` parallelt og velg via `locale === "en" ? X_EN : X_NO`

---

## Design-system

Government-utilitarian med editorial typografi og oker-aksent. Distinkt fra typiske SaaS-sider:

- **Brand:** `#1E3A5F` (mørk navy) — fargen til formelle norske myndigheter
- **Accent:** `#B5895A` (oker) — civic-stamp pop på heroes og section-eyebrows
- **Verify:** `#047857` (emerald) — for «signert &amp; verifisert»-status
- **Warn:** `#C2410C` / **Danger:** `#B91C1C` — for refusal og tamper-detection
- **Surface stack:** `#FFFFFF` (paper) → `#F7F6F3` (surface) → `#EFEDE6` (elevated)
- **Fonts:** IBM Plex Sans + IBM Plex Mono via `next/font/google`
- **Radii:** 2-4px (utilitarian, ikke avrundet)
- **Maks-bredde:** 1100 px med 32 px gutter
- **Section-eyebrows:** numerert chip + plain label (editorial-stil)

Alle design-tokens i `theme.config.ts`.

---

## Charter §6 — språk er arkitektur

Sitet er bundet av en enkel charter-regel: **det vi hevder må være det koden gjør**. Konkret:

- Ingen «HTTPS for AI» eller «Proof of X» — overselger og er ikke teknisk presist
- Betalte verktøy markert som **commercial** der de er det
- TSA-trust-listen i SDK-en er tom by default — vi hevder ikke tillit vi ikke har inspisert
- I18n følger samme prinsipp: når en side er kun delvis oversatt, viser vi en `TranslationBanner` (eller — som nå — oversetter helt før vi fjerner banneret)

Hvis du ser en formulering på sitet som overselger, åpne et issue eller send en PR.

---

## Hva sitet inneholder

| Side | For hvem |
|---|---|
| `/` | Alle — hero, audience-frames, modul-oversikt, neste steg |
| `/playground` | **Alle som vil prøve det** — ekte client-side SDK-signering |
| `/.well-known/tsp-manifest.json` | Signert alpha-demo manifest for lokal/public hosting-test |
| `/examples/manifest.json` | Kopierbart v3 manifest-format-eksempel |
| `/docs` | Utviklere — API-referanse for `@lexitsp/sdk/v3` |
| `/spec` | Implementatorer — normativ TSP v3.0-spesifikasjon |
| `/eu-ai-act` | Compliance — artikkel-for-artikkel-mapping (9, 12, 13, 14, 15, 17) |
| `/iso-42001` | Compliance — klausul-mapping mot ISO 42001 AIMS |
| `/core`, `/risk`, `/evidence`, `/oversight` | Modul-detaljer (i praksis + teknisk) |
| `/priser` | Innkjøpere — Standard / Plattform / Public Sector tiers |
| `/sammenligning` | Beslutningstakere — TSP vs DIY vs governance-platforms vs konsulent |
| `/whitepaper` | Compliance/innkjøp — runtime-compliance for EU AI Act (PDF) |
| `/endringer` | Alle — produkt-changelog + roadmap |
| `/kontakt` | Pilot-tilbud, spørsmål |

Alle sider finnes på norsk (default) og engelsk (`/en/...`).

---

## Hvor lese videre

| Hva | Hvor |
|---|---|
| Samlet forklaring av hva TSP er | [`docs/HVA-ER-TSP.md`](docs/HVA-ER-TSP.md) |
| Hele systemet på norsk | [`docs/TSP-OVERSIKT.md`](docs/TSP-OVERSIKT.md) |
| Charter (det bærende dokumentet) | [`docs/charter.md`](docs/charter.md) |
| Kort produktforklaring | [`docs/WHAT-IS-TSP.md`](docs/WHAT-IS-TSP.md) |
| Rask teknisk start | [`docs/QUICKSTART.md`](docs/QUICKSTART.md) |
| Produkt-/SKU-readiness | [`docs/PRODUCT_READINESS_AND_SKUS.md`](docs/PRODUCT_READINESS_AND_SKUS.md) |
| Public foundation launch | [`docs/PUBLIC_FOUNDATION_LAUNCH.md`](docs/PUBLIC_FOUNDATION_LAUNCH.md) |
| External proof sprint | [`docs/EXTERNAL_PROOF_SPRINT.md`](docs/EXTERNAL_PROOF_SPRINT.md) |
| First adopter kit | [`docs/FIRST_ADOPTER_KIT.md`](docs/FIRST_ADOPTER_KIT.md) |
| Operasjonelle runbooks | [`docs/ops/CONTROL_PLANE_RUNBOOK.md`](docs/ops/CONTROL_PLANE_RUNBOOK.md), [`docs/ops/RISK_RUNBOOK.md`](docs/ops/RISK_RUNBOOK.md), [`docs/ops/EVIDENCE_RUNBOOK.md`](docs/ops/EVIDENCE_RUNBOOK.md), [`docs/ops/OVERSIGHT_RUNBOOK.md`](docs/ops/OVERSIGHT_RUNBOOK.md) |
| Live spec på sitet | `/spec` (NO) eller `/en/spec` (EN) |

---

## Status

**Public-alpha hardening** per 2026-05-12.

- Alle 6 workspace-pakker shipped lokalt: SDK, TrustBadge, Risk, Evidence, Oversight og Control Plane
- Phase A-D design-løft komplett (editorial eyebrows, oker-aksent, civic HeroSeal, manifest-strip pop)
- Full i18n NO/EN over public-rutene — 55 sider builder grønt inkludert public manifest-endepunkter
- Sitemap.xml med per-URL hreflang-alternates (Googles offisielle metode)
- Per-side in-head hreflang via middleware-injisert pathname
- Root `bun run check` og `bun run check:release` finnes; 223 tester grønne, server TypeScript strict pass
- `/.well-known/tsp-manifest.json` og `/examples/manifest.json` finnes med en validert alpha-demo manifest. Bytt til produksjonsnøkler før ekstern round-trip.
- `fixtures/v3.0` inneholder `TSP-Spec-1.0-Candidate` test vectors, revision 1, validert av en clean-room verifier uten SDK-import.

Neste reelle v1.0-steg er Gate A: en navngitt ekstern organisasjon signerer en TrustEnvelope med egen nøkkel og egen DNS-hostet manifest uten LexiCo-skrevet integrasjonskode. `@lexitsp/sdk@3.0.0-alpha.4` er freeze candidate frem til den signaturen finnes.

Canonical public domain er `https://truststandardprotocol.org`. `truststandardprotocol.com` bør redirecte dit, og `tsp.lexico.no` kan beholdes som LexiCo-eid teknisk alias for manifest/redirect. Public GitHub-splitt er tre repoer: `lexitsp/tsp-site`, `lexitsp/sdk` og `lexitsp/trustbadge-react`; kommersielle backend-pakker holdes private/interne i alpha.

---

## Lisensiering

| Komponent | Lisens |
|---|---|
| Dette nettstedet (TSP-siden) | Intern LexiCo workspace |
| `@lexitsp/sdk`, `@lexitsp/trustbadge-react` | MIT |
| Spec (TSP-protokollen) | CC-BY 4.0 |
| Risk / Evidence / Oversight / Control Plane servers | Kommersiell lisens kreves |

Se [`COMMERCIAL_TERMS.md`](COMMERCIAL_TERMS.md) for arbeidsdelingen mellom gratis standard og betalte verktøy. Lisensen er kontraktuell: denne standalone-workspacen bruker ingen LexiCo-token, phone-home eller ekstern lisensserver.

## Bidrag og sikkerhet

Se [`CONTRIBUTING.md`](CONTRIBUTING.md) for utviklingsflyt og charter-regler. Rapporter sårbarheter privat etter [`SECURITY.md`](SECURITY.md); ikke åpne public issues for sikkerhetsfunn.

© 2026 LexiCo AS · Tønsberg
