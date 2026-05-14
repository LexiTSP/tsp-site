# TSP-klausul for AI-anskaffelser

> Kontraktsklausul som stiller TSP-krav til AI-leverandører. Norsk og engelsk parallelt-versjon. Skrevet for å være jurist-justerbar — bring den til egen jurist for endelig formulering, men bruk denne som utgangspunkt så dere ikke starter fra blankt ark.
>
> Dette er TSP-adopsjonens hovedvåpen. Når en kjøper inkluderer denne klausulen i et anbud, trekker det leverandører inn i ekosystemet uten LexiCo-salgs­arbeid. Det er hvordan en åpen standard *faktisk* sprer seg.

---

## Hvordan denne klausulen brukes

**Hvor den hører hjemme:**

- Anbudsdokumenter for AI-relaterte tjenester
- SaaS-avtaler som inkluderer AI-funksjonalitet
- Konsulent-avtaler hvor leveransen inkluderer AI-baserte beslutninger
- Reforhandlinger av eksisterende AI-kontrakter
- Standard-vilkår for offentlige anskaffelser

**Hva den oppnår:**

- Leverandøren må produsere kryptografisk verifiserbare envelopes for hver AI-utgang i regulert sak.
- Kjøper får kontraktuell rett til stikkprøver uten leverandør-samarbeid.
- Audit-historikken overlever kontrakts-opphør.
- Funksjonelt ekvivalente alternative formater er tillatt — så lenge de er åpne og uavhengig verifiserbare.

**Hva den IKKE er:**

- Ikke en leverandør-favoriserings-klausul (LexiCo nevnes ikke).
- Ikke en lock-in til ett produkt (TSP-spec er CC-BY 4.0, alternativer er tillatt).
- Ikke ferdig juridisk tekst — bring den til jurist for tilpasning til konkret kontrakt-kontekst.

---

## Norsk versjon — full klausul

### § X · AI-proveniens og etterprøvbarhet (TSP)

**X.1 Anvendelse**

For alle AI-utganger som omfattes av denne avtalen, og som benyttes i beslutninger eller kommunikasjon som kan ha rettslige, økonomiske eller vesentlige faktiske konsekvenser for Kunden, Kundens brukere, tredjeparter eller andre berørte personer, skal Leverandøren levere hver utgang som en TSP-kompatibel TrustEnvelope, eller som funksjonelt ekvivalent åpen og uavhengig verifiserbar struktur etter X.4.

**X.2 Innhold i TrustEnvelope**

En TrustEnvelope skal som minimum inneholde:

a) **Kilde-erklæring (`source`)** — strukturert beskrivelse av hvilke datakilder, dokumenter, kunnskapsbase-treff eller modell-interne kilder som lå til grunn for utgangen. For utganger der ekstern kilde ikke benyttes, skal dette være eksplisitt deklarert med begrunnelse.

b) **Prosess-logg (`process`)** — modell-identitet, modell-versjon (med snapshot-identifikator der relevant), systemprompt-status (enten faktisk innhold eller eksplisitt redaksjons-erklæring med begrunnelse), og relevante pipeline-steg.

c) **Alignment-metadata (`alignment`)** — risikonivå, domene-tag, policy-versjon, eventuelle flags, og refusal-årsak hvor utgangen er en avvisning.

d) **Ledger-felt (`ledger`)** — entydig envelope-identifikator, peker til foregående envelope i kjeden (der kjede føres), kjede-hash, og tidsstempel utstedt av en uavhengig tidsstemplings­myndighet (RFC 3161 eller ekvivalent).

**X.3 Kryptografisk integritet**

Hele TrustEnvelope skal være kryptografisk signert med en algoritme og nøkkellengde som tilfredsstiller kravene i ETSI EN 319 411-2 eller tilsvarende standard. Signaturen skal være uavhengig verifiserbar uten tilgang til Leverandørens infrastruktur, basert på public-key-materiale Kunden har tilgang til via en av Leverandøren publisert signaturmanifest eller ekvivalent åpen mekanisme.

**X.4 Standardvalg**

Leverandøren skal enten:

a) implementere TSP Trust Standard Protocol som beskrevet i den til enhver tid gjeldende offentlige spesifikasjonen (CC-BY 4.0), tilgjengelig på `https://truststandardprotocol.org/spec`, eller

b) dokumentere en egen implementasjon som er funksjonelt ekvivalent, og som tillater verifikasjon med samme grad av åpenhet, uavhengighet og kryptografisk integritet som TSP-standarden, herunder:

  i. åpen, offentlig tilgjengelig spesifikasjon under CC-BY 4.0, MIT, Apache 2.0 eller tilsvarende permissiv lisens;
  
  ii. minst én referanse-implementasjon under tilsvarende åpen lisens;
  
  iii. publisert manifest- eller PKI-mekanisme som muliggjør verifikasjon uten tilgang til Leverandørens systemer;
  
  iv. dokumentert mapping til EU AI Act artikkel 12, 13, 14, 15 og 17 så langt det er relevant.

**X.5 Kundens rettigheter**

Kunden skal ha rett til:

a) å be om og motta komplette TrustEnvelopes for et representativt utvalg av utganger for formål som internkontroll, revisjon, tilsyn og hendelses­analyse, uten tilleggskostnad utover avtalt vederlag;

b) å gjennomføre kryptografisk verifikasjon av mottatte envelopes med verktøy etter eget valg, herunder tredjeparts-implementasjoner;

c) å bruke envelopes som bevis i tilsynsprosesser, internrevisjon og rettslige sammenhenger uten ytterligere samtykke fra Leverandøren;

d) å motta en komplett evidens-pakke for hele avtaleperioden ved kontrakts­opphør, i åpent format, slik at audit-historikken kan etterprøves uavhengig av Leverandøren.

**X.6 Lagrings- og oppbevaringsforpliktelser**

Leverandøren skal sikre at TrustEnvelopes signeres på utstedelses­tidspunktet og leveres til Kunden eller til et endepunkt Kunden anviser, uten unødig forsinkelse. Leverandøren skal ikke endre, slette eller fjerne envelopes etter utstedelse. Endringer i Leverandørens egen logging eller arkivering skal ikke påvirke envelopene Kunden har mottatt.

**X.7 Brudd og remedies**

Leverandørens manglende evne til å produsere kryptografisk verifiserbare envelopes for utganger som omfattes av X.1 skal anses som vesentlig mislighold. Kunden har rett til å:

a) kreve umiddelbar utbedring innen 30 kalenderdager;
b) holde tilbake betaling for berørte tjenester inntil utbedring;
c) heve kontrakten ved fortsatt mislighold etter utbedrings-frist;
d) kreve erstatning for dokumenterte kostnader knyttet til erstatnings­leveranse, herunder kost ved leverandør-bytte og gjenskaping av audit-historikk så langt det er mulig.

**X.8 Forholdet til personvern**

Kravene i denne klausulen skal ikke anses å pålegge behandling av personopplysninger ut over det som ellers er avtalt mellom partene. TrustEnvelopes skal struktureres slik at de muliggjør verifikasjon uten unødvendig eksponering av personopplysninger; sensitivt innhold kan refereres via hash der GDPR-prinsipper om dataminimering tilsier det.

---

## Engelsk versjon — full clause

### § X · AI Provenance and Verifiability (TSP)

**X.1 Scope**

For all AI outputs covered by this Agreement that are used in decisions or communications which may have legal, economic or substantial factual consequences for the Customer, the Customer's users, third parties or other affected individuals, the Provider shall deliver each output as a TSP-compatible TrustEnvelope, or as a functionally equivalent open and independently verifiable structure pursuant to Section X.4.

**X.2 TrustEnvelope Content**

A TrustEnvelope shall, as a minimum, contain:

a) **Source declaration (`source`)** — a structured description of the data sources, documents, knowledge-base hits or model-internal sources that informed the output. For outputs where no external source is used, this shall be explicitly declared with reason.

b) **Process log (`process`)** — model identity, model version (with snapshot identifier where relevant), system-prompt status (either actual content or explicit redaction declaration with reason), and relevant pipeline steps.

c) **Alignment metadata (`alignment`)** — risk level, domain tag, policy version, any flags, and refusal reason where the output is a refusal.

d) **Ledger field (`ledger`)** — unique envelope identifier, pointer to the preceding envelope in the chain (where chaining is maintained), chain hash, and a timestamp issued by an independent time-stamping authority (RFC 3161 or equivalent).

**X.3 Cryptographic Integrity**

The entire TrustEnvelope shall be cryptographically signed using an algorithm and key length that satisfies the requirements of ETSI EN 319 411-2 or equivalent standard. The signature shall be independently verifiable without access to the Provider's infrastructure, based on public key material to which the Customer has access via a signing manifest published by the Provider or an equivalent open mechanism.

**X.4 Standard Selection**

The Provider shall either:

a) implement the TSP Trust Standard Protocol as described in the public specification in force from time to time (CC-BY 4.0), available at `https://truststandardprotocol.org/spec`, or

b) document a proprietary implementation that is functionally equivalent and that permits verification with the same degree of openness, independence and cryptographic integrity as the TSP standard, including:

  i. open, publicly available specification under CC-BY 4.0, MIT, Apache 2.0 or an equivalent permissive license;
  
  ii. at least one reference implementation under a corresponding open license;
  
  iii. a published manifest or PKI mechanism enabling verification without access to the Provider's systems;
  
  iv. documented mapping to EU AI Act Articles 12, 13, 14, 15 and 17 where relevant.

**X.5 Customer Rights**

The Customer shall have the right to:

a) request and receive complete TrustEnvelopes for a representative sample of outputs for purposes of internal control, audit, supervision and incident analysis, at no additional cost beyond the agreed remuneration;

b) carry out cryptographic verification of received envelopes using tools of its own choosing, including third-party implementations;

c) use envelopes as evidence in supervisory proceedings, internal audits and legal contexts without further consent from the Provider;

d) receive a complete evidence package for the entire contract period upon contract termination, in an open format, so that the audit history can be verified independently of the Provider.

**X.6 Issuance and Retention Obligations**

The Provider shall ensure that TrustEnvelopes are signed at the point of issuance and delivered to the Customer or to an endpoint designated by the Customer, without undue delay. The Provider shall not alter, delete or remove envelopes after issuance. Changes to the Provider's own logging or archival systems shall not affect the envelopes the Customer has received.

**X.7 Breach and Remedies**

The Provider's inability to produce cryptographically verifiable envelopes for outputs covered by Section X.1 shall be considered a material breach. The Customer shall have the right to:

a) require immediate remediation within 30 calendar days;
b) withhold payment for affected services pending remediation;
c) terminate the contract upon continued breach after the remediation period;
d) claim damages for documented costs related to replacement supply, including the cost of provider switching and the reconstruction of audit history to the extent possible.

**X.8 Relationship to Data Protection**

The requirements in this clause shall not be deemed to mandate the processing of personal data beyond what is otherwise agreed between the parties. TrustEnvelopes shall be structured so as to permit verification without unnecessary exposure of personal data; sensitive content may be referenced via hash where GDPR data-minimization principles so require.

---

## Kort versjon (3-paragrafs minimum)

For mindre kontrakter eller når juridisk overhead må holdes nede:

### Norsk

«Leverandøren skal levere hver AI-utgang som omfattes av denne avtalen som en kryptografisk signert envelope inneholdende kilde-erklæring, prosess-logg, alignment-metadata og hash-kjedet tidsstempel, kompatibel med TSP-spesifikasjonen (`https://truststandardprotocol.org/spec`) eller funksjonelt ekvivalent åpen standard.

Kunden skal ha rett til å verifisere envelopes uten tilgang til Leverandørens infrastruktur, og til å motta komplette envelopes for et representativt utvalg utganger for revisjons- og tilsyns­formål.

Ved kontrakts­opphør skal Leverandøren levere ut alle envelopes signert under avtalen i åpent format, slik at audit-historikken kan etterprøves uavhengig av Leverandøren.»

### English

"The Provider shall deliver each AI output covered by this Agreement as a cryptographically signed envelope containing source declaration, process log, alignment metadata and a hash-chained timestamp, compatible with the TSP specification (`https://truststandardprotocol.org/spec`) or a functionally equivalent open standard.

The Customer shall have the right to verify envelopes without access to the Provider's infrastructure, and to receive complete envelopes for a representative sample of outputs for audit and supervision purposes.

Upon contract termination, the Provider shall deliver all envelopes signed under the Agreement in an open format, so that the audit history can be verified independently of the Provider."

---

## Tilleggs-modul · Plattform-krav (valgfri)

Hvis kjøperen også vil stille krav til styring/oversight på plattform-laget:

### Norsk — § X.9 Risk- og Oversight-funksjonalitet

«Der avtalen omfatter AI-utganger med risikonivå klassifisert som `medium` eller høyere etter TSP `alignment.riskLevel`, skal Leverandøren tilby:

a) alarm-funksjonalitet basert på envelope-aggregat (uten bruker-tracking, jf. dataminimerings­prinsipper);

b) human review-funksjonalitet hvor menneskelige beslutnings­takere ikke utsettes for AI-genererte sammendrag, anbefalinger eller forslag som kan introdusere automasjons-bias;

c) evidens-pakke-funksjonalitet for eksport av envelopes for definerte tidsperioder eller domener.

Disse funksjonene kan tilbys via Leverandørens egen plattform, via tredjeparts-leverandør (herunder LexiCo TSP Platform), eller selvhostet av Kunden.»

### English — § X.9 Risk and Oversight Functionality

"Where the Agreement covers AI outputs classified at risk level `medium` or higher according to TSP `alignment.riskLevel`, the Provider shall offer:

a) alert functionality based on envelope aggregates (without user tracking, in line with data-minimization principles);

b) human review functionality where human decision-makers are not exposed to AI-generated summaries, recommendations or suggestions that may introduce automation bias;

c) evidence package functionality for exporting envelopes for defined time periods or domains.

These functions may be provided via the Provider's own platform, via a third-party provider (including the LexiCo TSP Platform), or self-hosted by the Customer."

---

## Bruker-veiledning for jurister

**Hva som er kjernekravet:**

- §X.1 (anvendelse) + §X.2 (innhold) + §X.3 (kryptografisk integritet) er kjernen. Disse må stå.
- §X.4 (standardvalg) er hva som hindrer vendor lock-in til TSP. Den åpne alternativ-paragrafen er bevisst — ikke fjern den.
- §X.5 (kundens rettigheter) er det som gjør klausulen verdifull i tvist. Disse må også stå.

**Hva som kan tilpasses:**

- §X.6 (lagring) — kan justeres mot leverandørens normale arkivpraksis.
- §X.7 (brudd) — remedies kan tilpasses kontraktens øvrige misligholds-rammeverk.
- §X.8 (personvern) — kan utelates hvis avtalen ellers har full GDPR-paragraf.
- §X.9 (plattform-krav, tilleggsmodul) — bare hvis aktuelt for risiko-nivået.

**Vanlige innvendinger fra leverandører — og svar:**

- *«Vi har ikke implementert TSP.»* → §X.4(b) tillater funksjonelt ekvivalent åpen alternativ. Krever bare at leverandøren dokumenterer sin egen.
- *«Dette er for tungt.»* → §X.5(a) sier representativt utvalg, ikke alle. Se §X.6 for utstedelses-praksis.
- *«Vi kan ikke signere uten tilgang til kundens systemer.»* → Misforstått. Leverandøren signerer med *sin egen* nøkkel, kunden verifiserer med leverandørens *publiserte* manifest.

---

## Hvordan klausulen vinner over proprietære alternativer

Den kritiske egenskapen i §X.4: kravet er *funksjonelt ekvivalent åpen standard*, ikke *bare TSP*. Dette er bevisst. Det betyr:

- Leverandøren kan **ikke** komme tilbake med «vi har vårt eget proprietære evidens-format». Det vil ikke møte §X.4(b)(i) — åpen lisens.
- Leverandøren **kan** komme tilbake med en alternativ åpen standard (f.eks. C2PA-derivat eller fremtidig konkurrent). Det er bra — markedet får flere åpne alternativer.
- Resultatet: klausulen presser markedet mot åpenhet generelt, ikke mot TSP spesifikt. Charter §5.

---

## Når denne klausulen ikke passer

- **Lavrisiko-AI uten regulatorisk eksponering** — overhead kan ikke forsvares. Bruk minimum-versjonen eller dropp helt.
- **Internt utviklede systemer hvor du selv er leverandør** — du implementerer TSP direkte, klausul ikke nødvendig.
- **Kontrakter med stor maktasymmetri (kjøper er liten)** — hyperscaler-leverandører vil neppe akseptere. Forhandle minimum-versjon eller bruk klausulen som signal-forsvar (ikke kontraktuell, men dokumentert forventning).

---

## Kilder og referanser

- TSP Spesifikasjon: `https://truststandardprotocol.org/spec`
- AI Act Art. 12 (logging): https://artificialintelligenceact.eu/article/12/
- AI Act Art. 13 (transparens): https://artificialintelligenceact.eu/article/13/
- ETSI EN 319 411-2 (signaturkrav): standard for elektroniske signaturer
- RFC 3161 (tidsstempling): https://www.rfc-editor.org/rfc/rfc3161
- RFC 8785 (JSON canonicalization): https://www.rfc-editor.org/rfc/rfc8785

---

## Versjon og endring

| Versjon | Dato | Endring |
|---|---|---|
| 1.0 | 2026-05-09 | Første publiserte versjon. NO + EN parallell. |

Klausulen er CC-BY 4.0. Du kan kopiere, modifisere og bruke den fritt — også kommersielt, også uten tilbake­varsel — så lenge opphavet (TSP-prosjektet, LexiCo AS) krediteres i opprinnelses-noten dersom du publiserer modifikasjoner.

---

*Sist oppdatert 2026-05-09. Tilbakemeldinger fra jurister som har brukt klausulen i ekte anbud vil revidere dette dokumentet. Charter §6: hvis klausulen overstiger det TSP faktisk gjør, er klausulen feil.*
