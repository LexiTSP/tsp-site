# TSP Quickstart — Første envelope på 5 minutter

> Mål: Du skal ha et signert, verifiserbart `TrustEnvelope` på skjermen før du har rukket å tenke compliance. Ingen LexiCo-konto. Ingen API-nøkkel. Ingen registrering.
>
> Tre veier inn — velg den som matcher hvor du står:
> - **Veien uten installasjon** (30 sekunder) — playground-en på sitet
> - **Veien med kode** (5 minutter) — `@lexitsp/sdk` i et tomt prosjekt
> - **Veien for revisorer** (3 minutter) — verifiser et ferdig envelope uten å skrive kode

---

## Vei 1 · Playground (0 installasjon)

1. Gå til `https://truststandardprotocol.org/playground` (eller `localhost:3838/playground` lokalt).
2. Klikk **«Generer nøkkelpar»** — Ed25519-nøkkelpar lages i nettleseren din via WebCrypto. Privat­nøkkelen forlater aldri maskina.
3. Klikk **«Wrap test-svar»** — et eksempel-svar med kilde-erklæring og prosess-logg pakkes i et envelope. Du ser `contentHash`, signaturer og hele JSON-strukturen.
4. Klikk **«Verifiser»** — alle 10 verify-checks kjøres lokalt. Grønn = ok.
5. Klikk **«Tamper»** — endrer ett tegn i innholdet. Re-kjører verifyLocal. Du ser `contentHash`-bruddet *matematisk* — ikke en regel som ble brutt, en hash som ikke matcher.

Det er hele løkken. Ingen del av den krever LexiCo.

---

## Vei 2 · Kode (5 minutter)

### Forutsetninger

- Node ≥ 20 eller Bun ≥ 1.0
- Et tomt prosjekt: `mkdir tsp-test && cd tsp-test && npm init -y`

### Steg 1 — Installer

```bash
npm install @lexitsp/sdk@alpha
```

(Når SDK er publisert. Inntil da: `bun link` mot `Backup/packages/lexitsp-sdk`.)

### Steg 2 — Lag nøkkelpar og første envelope

Lag `wrap.mjs`:

```js
import { generateKeyPair, wrap } from '@lexitsp/sdk/v3';

const keypair = await generateKeyPair();

const envelope = await wrap({
  content: { answer: "Ja, du har rett til foreldrepenger fra dag én." },
  source: {
    provided: true,
    references: [
      { type: 'lov', id: 'folketrygdloven', section: '§14-5', url: 'https://lovdata.no/...' }
    ]
  },
  process: {
    provided: true,
    model: 'gpt-4o-2024-08-06',
    systemPrompt: { provided: false, reason: 'redacted-confidential' },
    pipeline: ['retrieval', 'answer', 'safety-check']
  },
  alignment: {
    riskLevel: 'medium',
    domain: 'social-rights',
    flags: []
  },
  signer: keypair.privateKey,
  manifestRef: 'https://truststandardprotocol.org/.well-known/tsp-manifest.json',
  skipTsa: true  // dev-modus; produksjon: bruk ekte TSA
});

console.log(JSON.stringify(envelope, null, 2));
```

Kjør: `node wrap.mjs`. Du har nå et signert envelope.

### Steg 3 — Verifiser

Lag `verify.mjs`:

```js
import { verifyLocal } from '@lexitsp/sdk/v3';
import envelope from './envelope.json' assert { type: 'json' };

// I dev-modus: send public key direkte. I prod: SDK henter manifest automatisk.
const result = await verifyLocal(envelope, {
  trustedKeys: [keypair.publicKey],
  skipTsa: true
});

console.log('Ok:', result.ok);
console.log('Checks:', result.checks);
if (!result.ok) console.log('Failures:', result.failures);
```

Kjør. Forventet output: `Ok: true`, alle 10 checks grønne.

### Steg 4 — Tamper-test

I `verify.mjs`, før verifyLocal:

```js
envelope.content.answer = "Nei, du har ikke rett til foreldrepenger.";
```

Kjør på nytt. Forventet: `Ok: false`, `failures: ['contentHash mismatch']`. Det er hele poenget — endring detekteres uten å spørre noen.

### Steg 5 — Vis det i UI (valgfritt)

```bash
npm install @lexitsp/trustbadge-react@alpha
```

```tsx
import { TrustBadge } from '@lexitsp/trustbadge-react';

<TrustBadge envelope={envelope} verifyResult={result} />
```

Badge rendrer status (verified / warn / refusal / flagged / policy-blocked). Klikk åpner en modal med alle 6 punkter fra AI Act Art. 13(3)(b).

---

## Vei 3 · Verifiser uten å skrive kode

Hvis noen har sendt deg et `TrustEnvelope` (typisk som `.json`) og du bare vil vite om det er ekte:

1. Gå til `https://truststandardprotocol.org/playground`.
2. Klikk **«Importer envelope»**, lim inn JSON-en.
3. Klikk **«Verifiser»** — sitet henter manifestet fra `manifestRef` og kjører de 10 checks i nettleseren din.
4. Resultat:
   - **Grønn** — innholdet er uendret, signaturen er gyldig, tidsstemplet er konsistent.
   - **Gul** — strukturelt ok, men én eller flere advarsler (f.eks. cert nær utløp).
   - **Rød** — innholdet er endret, signaturen er ugyldig, eller cert er trukket tilbake. Klikk for å se hvilken sjekk som feilet.

Ingen LexiCo-konto. Ingen leverandør­samarbeid. Ingen tillit-på-forskudd.

---

## Vanlige spørsmål første gang

**Hvor lagres den private nøkkelen?**
I playground: i WebCrypto med `extractable: false` — den kan ikke eksfiltreres, ikke engang av kode i samme nettleser. I kode: hvor du enn legger den. SDK-en eksponerer ikke nøkkel-management; det er ditt ansvar.

**Hva er `manifestRef`?**
URL-en til organisasjonens TSP-manifest — en signert JSON som binder org-navn til public keys. I dev kan du droppe det ved å sende `trustedKeys` direkte til `verifyLocal`. I prod genererer du manifestet med `tsp manifest init` (CLI) og hoster det selv.

**Hva betyr `skipTsa: true`?**
Dev-modus uten RFC 3161-tidsstempling. I prod skal du peke mot en eIDAS-godkjent TSA. SDK shipper med tom `DEFAULT_TRUSTED_TSAS = []` (charter §5: vi hevder ikke tillit vi ikke har inspisert) — du konfigurerer din egen trust-liste.

**Hvor mye kan jeg sende?**
Envelope-strukturen er JSON og typisk 1–4 KB per svar. `contentHash` er av selve svar-innholdet, så svar-størrelse er ubegrenset (du hashes bare det).

**Trenger jeg LexiCos plattform (Risk/Evidence/Oversight)?**
Nei. Standard-sonen (SDK + TrustBadge + manifest) er sovereign-by-default. Verktøy-modulene er valgfrie og kommersielle — bekvemmelighet, ikke avhengighet.

---

## Når du sitter fast

- **Spec-detaljer:** `https://truststandardprotocol.org/spec` — full v3-skjemabeskrivelse med JSON-LD.
- **API-referanse:** `https://truststandardprotocol.org/docs` — alle eksporterte funksjoner.
- **EU AI Act-mapping:** `https://truststandardprotocol.org/eu-ai-act/article-13` (eller 9/12/14/15) — hvilke schema-felter som dekker hvilke lov-krav.
- **Issues:** `https://github.com/lexitsp/sdk/issues` (når repo er public).
- **E-post:** julian@lexico.no.

---

## Hva neste

Når du har gjort vei 1 eller vei 2:

1. Les `docs/ABOUT.md` for å forstå *hvorfor* TSP er strukturert som det er.
2. Hvis du jobber med en regulert use case: `docs/FOR-AUDITORS.md` viser audit-narrativet.
3. Hvis du vurderer dette for organisasjonen: `docs/FOR-LEADERS.md` har innkjøps-kortet.
4. Hvis du vil bli pilot: `docs/PILOT-PROGRAM.md`.

---

*Hvis denne quickstarten tok mer enn 5 minutter (vei 2) eller 30 sekunder (vei 1), er det en bug. Si fra.*
