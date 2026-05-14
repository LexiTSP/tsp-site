const COPY = {
  no: {
    title: "Personvern og data — TSP",
    h1: "Personvern og data.",
    lead:
      "TSP public alpha er bygget for dataminimering: standarden signerer og verifiserer artefakter, men trenger ikke en LexiCo-konto eller sentral innsamling for å fungere.",
    siteTitle: "Sitet",
    siteBody:
      "Det lokale nettstedet bruker ingen produkt-telemetri i denne workspacen. Hvis produksjonshosting senere legger til analytics, skal det dokumenteres her før launch.",
    toolsTitle: "Backend-alphaene",
    toolsBody:
      "Risk lagrer pointers, signal-buckets og signerte alarmer, ikke innhold. Evidence henter kundens envelopes ved behov for dossier og lagrer EvidenceEnvelope midlertidig. Oversight pruner envelope_json etter beslutning.",
    contactTitle: "Kontakt",
    contactBody:
      "For kommersiell pilot skal databehandleravtale, kundevilkår og eventuell hosting-beskrivelse avklares før ekstern signatur.",
  },
  en: {
    title: "Privacy and data — TSP",
    h1: "Privacy and data.",
    lead:
      "TSP public alpha is built for data minimisation: the standard signs and verifies artifacts, but does not need a LexiCo account or central collection to function.",
    siteTitle: "The site",
    siteBody:
      "The local site uses no product telemetry in this workspace. If production hosting later adds analytics, it must be documented here before launch.",
    toolsTitle: "Backend alphas",
    toolsBody:
      "Risk stores pointers, signal buckets and signed alerts, not content. Evidence fetches customer envelopes on demand for dossiers and stores EvidenceEnvelope output temporarily. Oversight prunes envelope_json after decision.",
    contactTitle: "Contact",
    contactBody:
      "For a commercial pilot, data processing terms, customer terms and any hosting description must be settled before external signature.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = locale === "en" ? COPY.en : COPY.no;
  return { title: copy.title, description: copy.lead };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = locale === "en" ? COPY.en : COPY.no;
  const sections = [
    [copy.siteTitle, copy.siteBody],
    [copy.toolsTitle, copy.toolsBody],
    [copy.contactTitle, copy.contactBody],
  ];
  return (
    <div className="tsp-container py-16">
      <div className="tsp-section-marker mb-3">§ Privacy</div>
      <h1 className="mb-4">{copy.h1}</h1>
      <p className="text-lg text-muted max-w-2xl mb-10">{copy.lead}</p>
      <div className="grid md:grid-cols-3 gap-4">
        {sections.map(([title, body]) => (
          <section key={title} className="border border-border bg-surface p-5">
            <h2 className="text-base mb-2">{title}</h2>
            <p className="text-sm text-muted leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
