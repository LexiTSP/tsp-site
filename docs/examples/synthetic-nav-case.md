# Syntetisk case — NAV-lignende AI-flyt med 3 envelopes

> En reproduserbar Proof-tier demo: tre AI-svar i en saksbehandlings­flyt, alle wrappet med TSP, klare for stikkprøve-revisjon. Ingen ekte borger­data, ingen avhengighet til eksterne produkter — kun for demo og opplæring.
>
> Brukes til: dev-demoer, audit-walkthroughs, intern opplæring, ekstern verifisering. Hver envelope kan kopieres og kjøres gjennom `verifyLocal` på `https://truststandardprotocol.com/playground` eller via SDK.

---

## Scenario

«Astrid» (fiktiv) sender en henvendelse om foreldrepenger via en AI-styrt borger­tjeneste. Tre AI-utganger i flyten:

1. **Envelope #1 — Kategorisering.** AI klassifiserer henvendelsen som «foreldrepenger / søknad».
2. **Envelope #2 — Lov-grunnlag-svar.** AI gir et svar om hennes rettighet basert på folketrygdloven.
3. **Envelope #3 — Refusal med oversight-trigger.** AI nekter å gi spesifikt beløp og flagger til menneskelig vurdering.

Hver envelope kjedes til den forrige. Sammen utgjør de en hash-kjedet hendelseslogg som tilfredsstiller AI Act Art. 12.

---

## Envelope #1 — Kategorisering

```json
{
  "@context": "https://truststandardprotocol.com/contexts/tsp-3.0.jsonld",
  "version": "TSP/3.0",
  "envelopeId": "env-synth-001",
  "issuedAt": "2026-05-09T08:14:22.000Z",
  "content": {
    "category": "foreldrepenger.soknad",
    "confidence": 0.94,
    "subcategories": ["fars-kvote", "utbetaling.tidspunkt"]
  },
  "contentHash": "sha256:8f7c2a1b9d4e6f3a5b8c7e9d2f1a4b6c8e0d2f4a6b8c1e3d5f7a9b1c3d5e7f9a",
  "source": {
    "provided": false,
    "reason": "model-only",
    "note": "Klassifikasjon basert på modellens trening, ikke ekstern kilde"
  },
  "process": {
    "provided": true,
    "model": "gpt-4o-2024-08-06",
    "modelVersion": "gpt-4o-2024-08-06",
    "systemPrompt": {
      "provided": true,
      "value": "Du er en kategoriserings-AI for inngående henvendelser..."
    },
    "pipeline": ["language-detect", "categorize"]
  },
  "alignment": {
    "riskLevel": "low",
    "domain": "social-rights.intake",
    "policyVersion": "intake-v2.3.1",
    "flags": []
  },
  "ledger": {
    "id": "env-synth-001",
    "previousEnvelopeId": null,
    "chainHash": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
    "tsaTimestamp": "MIIBxAYJKoZIhvcNAQcCoIIBtTCCAbECAQMxCzAJ..."
  },
  "signatures": [
    {
      "keyId": "instance-key-2026-05",
      "algorithm": "ed25519",
      "value": "base64:zXk9P2vQ7..."
    }
  ],
  "manifestRef": "https://truststandardprotocol.com/.well-known/tsp-manifest.json"
}
```

**Hva en revisor ser:**
- `source.provided: false` med `reason: "model-only"` — eksplisitt erklæring om at ingen ekstern kilde ble brukt (charter §3).
- `riskLevel: low` — kategorisering er lav-risiko-operasjon.
- `previousEnvelopeId: null` — første i kjeden.

---

## Envelope #2 — Lov-grunnlag-svar

```json
{
  "@context": "https://truststandardprotocol.com/contexts/tsp-3.0.jsonld",
  "version": "TSP/3.0",
  "envelopeId": "env-synth-002",
  "issuedAt": "2026-05-09T08:14:38.000Z",
  "content": {
    "answer": "Som forelder har du rett til foreldrepenger fra dag én etter fødsel/adopsjon dersom du har vært yrkesaktiv i minst seks av de siste ti månedene før uttaket starter. Fars-kvoten er på 15 uker.",
    "language": "no"
  },
  "contentHash": "sha256:3a5b7c9e1d2f4a6b8c0e2d4f6a8b0c2e4d6f8a0b2c4e6d8f0a2b4c6d8e0f2a4b",
  "source": {
    "provided": true,
    "references": [
      {
        "type": "lov",
        "id": "folketrygdloven",
        "section": "§14-5",
        "url": "https://lovdata.no/lov/1997-02-28-19/§14-5",
        "retrievedAt": "2026-05-09T08:14:32.000Z"
      },
      {
        "type": "lov",
        "id": "folketrygdloven",
        "section": "§14-12",
        "url": "https://lovdata.no/lov/1997-02-28-19/§14-12",
        "retrievedAt": "2026-05-09T08:14:32.000Z"
      }
    ]
  },
  "process": {
    "provided": true,
    "model": "gpt-4o-2024-08-06",
    "modelVersion": "gpt-4o-2024-08-06",
    "systemPrompt": {
      "provided": false,
      "reason": "redacted-confidential",
      "note": "Systemprompt redigert pga. interne prompt-injection-forsvar"
    },
    "pipeline": ["retrieval", "answer", "safety-check"]
  },
  "alignment": {
    "riskLevel": "medium",
    "domain": "social-rights.advice",
    "policyVersion": "advice-v3.1.0",
    "flags": ["legal-content"]
  },
  "ledger": {
    "id": "env-synth-002",
    "previousEnvelopeId": "env-synth-001",
    "chainHash": "sha256:c1e3d5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3",
    "tsaTimestamp": "MIIBxAYJKoZIhvcNAQcCoIIBtTCCAbECAQMxCzAJ..."
  },
  "signatures": [
    {
      "keyId": "instance-key-2026-05",
      "algorithm": "ed25519",
      "value": "base64:Q7zXk9P2vQ..."
    }
  ],
  "manifestRef": "https://truststandardprotocol.com/.well-known/tsp-manifest.json"
}
```

**Hva en revisor ser:**
- `source.references` viser konkrete lov-paragrafer med URL og hentetidspunkt — Art. 13 transparens-krav er bundet til envelope-et.
- `process.systemPrompt.provided: false` med `reason: "redacted-confidential"` — fraværet er deklarert, ikke skjult (charter §3).
- `alignment.riskLevel: medium` med `flags: ["legal-content"]` — riktig klassifisering for juridisk innhold.
- `previousEnvelopeId: env-synth-001` — kjedet til kategoriserings-envelopet.

---

## Envelope #3 — Refusal med oversight-trigger

```json
{
  "@context": "https://truststandardprotocol.com/contexts/tsp-3.0.jsonld",
  "version": "TSP/3.0",
  "envelopeId": "env-synth-003",
  "issuedAt": "2026-05-09T08:15:04.000Z",
  "content": {
    "answer": "Jeg kan ikke gi deg en eksakt beløpsberegning fordi det krever tilgang til din inntektshistorikk og andre saksforhold som AI-en ikke har tilgang til. Henvendelsen er nå sendt til menneskelig saksbehandler som vil kontakte deg innen 5 virkedager.",
    "language": "no",
    "type": "refusal-with-handoff"
  },
  "contentHash": "sha256:7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b",
  "source": {
    "provided": false,
    "reason": "no-source-needed",
    "note": "Refusal — ingen kildehenvisning relevant"
  },
  "process": {
    "provided": true,
    "model": "gpt-4o-2024-08-06",
    "modelVersion": "gpt-4o-2024-08-06",
    "systemPrompt": {
      "provided": false,
      "reason": "redacted-confidential"
    },
    "pipeline": ["intent-detect", "policy-check", "refusal-generate"]
  },
  "alignment": {
    "riskLevel": "high",
    "domain": "social-rights.calculation",
    "policyVersion": "calculation-v1.4.2",
    "flags": ["financial-impact", "human-oversight-required"],
    "refusalReason": "out-of-scope-numeric-calculation",
    "oversightTriggered": true,
    "oversightQueueId": "queue-foreldrepenger-2026-05"
  },
  "ledger": {
    "id": "env-synth-003",
    "previousEnvelopeId": "env-synth-002",
    "chainHash": "sha256:f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1",
    "tsaTimestamp": "MIIBxAYJKoZIhvcNAQcCoIIBtTCCAbECAQMxCzAJ..."
  },
  "signatures": [
    {
      "keyId": "instance-key-2026-05",
      "algorithm": "ed25519",
      "value": "base64:vQ7zXk9P2..."
    }
  ],
  "manifestRef": "https://truststandardprotocol.com/.well-known/tsp-manifest.json"
}
```

**Hva en revisor ser:**
- `riskLevel: high` med `flags: ["financial-impact", "human-oversight-required"]` — riktig eskalering for beløpsberegning.
- `refusalReason: out-of-scope-numeric-calculation` — eksplisitt begrunnelse for nektelse.
- `oversightTriggered: true` med `oversightQueueId` — Art. 14 human oversight er aktivert og bundet til envelope.
- Tilhørende `ReviewEnvelope` (signert klient-side av reviewer) genereres når sak­behandler tar beslutningen — kjedes ikke i ledger-en, men refererer `contentHash` av envelope #3.

---

## Slik kjører du demoen

### A · Verifiser i playground (30 sekunder)

1. Gå til `https://truststandardprotocol.com/playground`
2. Klikk **«Importer envelope»**
3. Lim inn JSON for envelope #2 (eller alle tre)
4. Klikk **«Verifiser»**
5. Resultat: alle 10 checks grønne (forutsatt at LexiCos manifest er hosted)

### B · Tamper-test

1. Endre `content.answer` i envelope #2 — bytt ut «seks» med «tre» i opptjenings-vilkåret
2. Re-importer
3. Klikk **«Verifiser»**
4. Resultat: `contentHash mismatch` rødt — endringen detekteres mekanisk

### C · Audit-walkthrough (5 minutter)

For en revisor som skal vurdere om TSP gir sterk audit-evne:

1. Bekreft at envelope #1, #2 og #3 alle er signert av samme `keyId` («instance-key-2026-05»).
2. Bekreft kjede­integritet: `env-synth-002.previousEnvelopeId == env-synth-001.envelopeId`, og `env-synth-003.previousEnvelopeId == env-synth-002.envelopeId`.
3. Bekreft at `chainHash` i hver envelope er reproduserbar fra forrige envelope's ledger-felt + `ledgerDomain`.
4. Bekreft at `source.references` i envelope #2 kan klikkes og lov-paragrafene faktisk eksisterer.
5. Bekreft at `oversightTriggered: true` i envelope #3 er bundet til en `ReviewEnvelope` (når den genereres av sak­behandler).

Resultat: full sak­behandlings­logg er kryptografisk etterprøvbar uten å kontakte LexiCo eller leverandøren.

---

## Bruk som mal

Fyll inn dine egne verdier for:

- `envelopeId` — unike IDer
- `content` — faktisk svar
- `source.references` — konkrete kilder
- `alignment` — din risiko­klassifisering og policy-versjon
- `signatures` — generert med din privat-nøkkel
- `manifestRef` — din publiserte manifest-URL

Du har nå en TSP-konform envelope-struktur for ditt eget use case.

---

## Avgrensninger — ærlig

- Disse JSON-eksemplene har **placeholder-signaturer og chainHashes**. De vil ikke verifisere som de er — du må kjøre dem gjennom SDK-en for å få ekte signaturer mot din privat-nøkkel.
- `tsaTimestamp` er trunkert for lesbarhet — ekte RFC 3161-tokens er typisk 2–5 KB.
- Scenariet er **fiktivt**. Astrid finnes ikke. Lov-referansene er ekte (folketrygdloven §14-5 og §14-12 omhandler foreldrepenger).
- Dette eksemplet brukes **ikke** som produksjonsbevis (charter §6: ingen pre-launch-overflate hevder produksjons-status). Det er kun en demo for opplæring og audit-walkthrough.

---

*Sist oppdatert 2026-05-09. Hvis du genererer ekte envelopes via SDK og vil bidra med flere demo-cases for andre domener (helse, finans, utdanning), åpne en PR.*
