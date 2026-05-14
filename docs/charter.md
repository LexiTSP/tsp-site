# TSP-charteret

**Versjon 1.0** · 2026-05-12 · LexiCo AS

> Et bærende dokument for Trust Standard Protocol, pakkene i dette workspace-et, nettstedet, og hosted-modulene rundt protokollen. Charteret gjelder TSP som et selvstendig produkt og en åpen standard.

---

## Formål

Charteret beskriver hvilke prinsipper TSP skal håndheve i kode, dokumentasjon, markedsføring og drift. Hvis en formulering på nettstedet eller i dokumentasjonen ikke er sann om koden, er formuleringen feil.

Charteret binder tre grupper:

1. **Vedlikeholderne** — alle som skriver kode, docs, nettsider eller salgsmateriale for TSP.
2. **Implementatorene** — utviklere og organisasjoner som bygger på TSP-spec eller `@lexitsp/sdk`.
3. **Driftsorganisasjonen** — LexiCo som eventuell hosted-leverandør av Risk, Evidence og Oversight.

---

## §1 · Brukeren først

Den fysiske personen eller organisasjonen som påvirkes av et AI-svar er den primære interessenten. TSP skal gjøre det lettere å etterprøve hva som ble sagt, av hvem, når, med hvilken kilde og under hvilken policy.

**Håndheving:** SDK-en skal være sovereign-by-default: ingen telemetri, ingen call-home, ingen skjult avhengighet til LexiCo. Hosted-moduler er bekvemmelighet, ikke krav.

---

## §2 · Etterprøvbarhet over tillit

Et AI-svar skal kunne verifiseres matematisk uten å spørre leverandøren som genererte det. Tamper-detection er en kryptografisk egenskap, ikke en påstand.

**Håndheving:** `TrustEnvelope` signeres med Ed25519, kan tidsstemples med RFC 3161, canonicaliseres med RFC 8785, og kan verifiseres lokalt via SDK-en.

---

## §3 · Schema er kontrakt

Et envelope uten eksplisitt schema-versjon er ikke et TSP-envelope. Implementasjoner som godtar ukjent eller ugyldig schema uten tydelig feil har ikke implementert protokollen riktig.

**Håndheving:** `@context` er obligatorisk, versjoner følger semver, og SDK-en avviser ukjente eller ufullstendige envelopes.

---

## §4 · Fravær må deklareres

Tomme felter er ikke et gyldig uttrykk for "ikke aktuelt". Når et felt mangler, skal fraværet deklareres med grunn.

**Håndheving:** Schema-unioner bruker eksplisitte former som `{ provided: true, value }` eller `{ provided: false, reason }` der fravær har betydning.

---

## §5 · Åpen standard, åpen referanse

TSP-spec er åpen. Referanse-SDK-en er MIT. Hosted-moduler kan tilbys kommersielt, men skal ikke gjøre protokollen proprietær.

**Håndheving:** `@lexitsp/sdk` og TrustBadge-pakken kan brukes uten hosted LexiCo-tjenester. TSA-trustlist er tom by default; operatøren velger eksplisitt hvilke tidsstemplingsmyndigheter den stoler på.

---

## §6 · Språk er arkitektur

Det TSP hevder offentlig må være det koden faktisk gjør. TSP er ikke "magisk compliance", ikke "sannhet for AI", og ikke en generell governance-plattform. Det er et signert provenienslag for AI-utganger.

**Håndheving:**

- Betalte verktøy merkes tydelig som kommersielle der de er det.
- Kommersiell lisens håndheves kontraktuelt, ikke med skjulte runtime-avhengigheter til LexiCo.
- Eksempeldata merkes som syntetiske når de er syntetiske.
- TSP beskrives som protokoll, SDK, TrustBadge og valgfrie moduler, ikke som en avhengighet til et annet produkt.
- `docs/TSP-OVERSIKT.md` er teknisk single-source-of-truth for dette workspace-et.

---

## §7 · Menneskelig oppsyn må forbli menneskelig

Et menneskelig review-steg er menneskets beslutning. TSP kan vise envelope-innhold, signaturstatus, kilde og policydata, men skal ikke gjøre mennesket til et gummistempel for AI-anbefalinger.

**Håndheving:** Oversight-modulen skal holde anbefalinger, prediksjoner og subjektive oppsummeringer ute av `ReviewItem`-payloads.

---

## §8 · Feil skal være sporbare

Når signatur, verifikasjon, manifest, review-ruting eller evidence-generering feiler, skal feilen være tydelig, loggbar og mulig å undersøke.

**Håndheving:** Feiltilstander skal returnere strukturerte feil, ikke stille fallback. Dokumentasjon skal forklare hva som er bevist, hva som ikke er bevist, og hva operatøren må konfigurere selv.

---

## §9 · Standalone først

Dette workspace-et skal kunne forstås, bygges, testes og distribueres som TSP uten å kjenne til eller avhenge av et annet produkt.

**Håndheving:** Repo-layout, README, docs, demos, route probes og package-dokumentasjon skal peke på TSPs egne konsepter og syntetiske eller generiske deployment-eksempler.
