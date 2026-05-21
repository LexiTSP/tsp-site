import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  ExternalLink,
  FileCheck2,
  FileText,
  LockKeyhole,
  Play,
  ReceiptText,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users,
} from "lucide-react";
import {
  HeroProofConsole,
  InteractiveActionSteps,
  InteractiveProofPanels,
  ReceiptReadinessCheck,
  ScenarioSwitcher,
} from "@/components/HomeInteractivePanels";

type LocaleCopy = {
  hero: {
    badge: string;
    h1Prefix: string;
    h1Accent: string;
    h1Receipt: string;
    lead: string;
    leadStrong: string;
    solution: string;
    primary: string;
    secondary: string;
    tertiary: string;
    campaign: string;
    question: string;
    tags: string[];
    strip: string[];
  };
  lab: {
    label: string;
    title: string;
    lead: string;
    contentLabel: string;
    original: string;
    tampered: string;
    reset: string;
    tamper: string;
    verifiedTitle: string;
    verifiedBody: string;
    tamperedTitle: string;
    tamperedBody: string;
    verifiedChecks: string[];
    tamperedChecks: string[];
    tryLine: string;
    verifiedBadge: string;
    tamperedBadge: string;
  };
  proof: {
    label: string;
    title: string;
    lead: string;
    rows: Array<[string, string]>;
    proofLoopLabel: string;
    portableReceiptLabel: string;
    statusLabels: { verified: string; warning: string; broken: string };
  };
  thesis: {
    label: string;
    title: string;
    lead: string;
    items: Array<{ title: string; body: string; icon: ReactNode }>;
  };
  stakes: {
    label: string;
    title: string;
    lead: string;
    items: Array<{ title: string; body: string }>;
  };
  readiness: {
    title: string;
    lead: string;
    scorePrefix: string;
    high: string;
    medium: string;
    low: string;
    manualLabel: string;
    items: string[];
  };
  gives: {
    label: string;
    title: string;
    lead: string;
    items: Array<{ title: string; body: string; icon: ReactNode }>;
  };
  plan: {
    label: string;
    title: string;
    lead: string;
    steps: Array<{ time: string; title: string; body: string; href: string; cta: string }>;
  };
  paths: {
    label: string;
    title: string;
    cards: Array<{ audience: string; problem: string; action: string; href: string }>;
  };
  scenarios: {
    label: string;
    title: string;
    lead: string;
    contrast: string;
    beforeLabel: string;
    withTspLabel: string;
    withTspTitle: string;
    items: Array<{ audience: string; before: string; question: string; withTsp: string }>;
  };
  boundary: {
    label: string;
    title: string;
    lead: string;
    standardTitle: string;
    standardItems: string[];
    toolsTitle: string;
    toolsItems: string[];
  };
  close: {
    title: string;
    lead: string;
    primary: string;
    secondary: string;
  };
};

const COPY: Record<"en" | "no", LocaleCopy> = {
  en: {
    hero: {
      badge: "The AI Act evidence gap is here",
      h1Prefix: "AI outputs still ship ",
      h1Accent: "without proof.",
      h1Receipt: "AI answers need receipts.",
      lead:
        "Europe is not waiting for better screenshots. Article 50 transparency obligations still apply from 2 August 2026, while the high-risk delay is a blunt market signal: support tools and standards are not ready enough.",
      leadStrong:
        "If an AI system cannot show a signed receipt for an answer that matters, buyers should ask why before they buy it.",
      solution:
        "TSP gives every important AI output a signed TrustEnvelope receipt: what was said, which source and process made it, when it happened, and whether anyone changed it later. Proof, not promises.",
      primary: "Verify demo envelope",
      secondary: "View GitHub",
      tertiary: "Read spec",
      campaign: "The 7 May 2026 AI Act deal moved some high-risk dates so implementation can line up with support tools and standards. Article 50 transparency still starts on 2 August 2026. Delay is not relief; it is the evidence gap becoming visible.",
      question: 'The useful question is shifting from "can we trust AI?" to "can we verify the output?"',
      tags: ["Verifiable AI outputs", "Cryptographic provenance", "Browser-checkable evidence"],
      strip: ["Open standard", "Signed AI receipts", "Tamper-evident", "Vendor-independent check", "MIT SDK"],
    },
    lab: {
      label: "Live receipt lab",
      title: "Edit the answer. Watch the receipt break.",
      lead: "This is the sales point in one motion: a normal AI answer is just text; a TSP answer carries proof that fails when the text changes.",
      contentLabel: "Signed output",
      original: "Patient triage summary: follow-up within 24 hours based on the submitted symptom notes.",
      tampered: "Patient triage summary: no follow-up required based on the submitted symptom notes.",
      reset: "Restore receipt",
      tamper: "Tamper output",
      verifiedTitle: "Receipt still verifies",
      verifiedBody: "The content hash, Ed25519 signature, and manifest reference still line up. A reviewer has something concrete to inspect.",
      tamperedTitle: "Tampering is visible",
      tamperedBody: "The words changed after signing. Hash and signature no longer match, so the artifact should not be trusted.",
      verifiedChecks: ["Hash match", "Signature valid", "Manifest intact"],
      tamperedChecks: ["Hash mismatch", "Signature invalid", "Tamper detected"],
      tryLine: "QOL: no wallet, login, dashboard, or vendor account required to understand the proof.",
      verifiedBadge: "VERIFIED",
      tamperedBadge: "TAMPERED",
    },
    proof: {
      label: "Proof",
      title: "One receipt answers the uncomfortable questions.",
      lead:
        "TSP is useful when an AI answer may need to be inspected later by a buyer, user, auditor, or regulator.",
      rows: [
        ["Where did this answer come from?", "Declared source, model, policy and timestamp."],
        ["Can someone prove it changed?", "One character changed after signing breaks verification."],
        ["Do we need to trust a dashboard?", "No. The envelope can be checked independently."],
      ],
      proofLoopLabel: "Proof loop",
      portableReceiptLabel: "Portable receipt",
      statusLabels: { verified: "Verified", warning: "Needs evidence", broken: "Tampered" },
    },
    thesis: {
      label: "Missing internet primitive",
      title: "AI systems should produce verifiable evidence by default.",
      lead:
        "Healthcare, legal, finance, public services and consumer AI cannot scale on screenshots, vendor dashboards, or trust promises. TSP is a portable receipt layer for the moment when the receiver asks: what can I verify?",
      items: [
        {
          icon: <ReceiptText className="h-5 w-5" />,
          title: "Not another dashboard",
          body: "The proof travels with the output, so buyers and users do not need access to your internal tooling.",
        },
        {
          icon: <LockKeyhole className="h-5 w-5" />,
          title: "A public verification habit",
          body: "If an AI answer matters, the receiver should be able to inspect a signed receipt before trusting it.",
        },
        {
          icon: <BadgeCheck className="h-5 w-5" />,
          title: "De-facto standard objective",
          body: "The ambition is simple: make signed AI receipts normal enough that missing receipts become a procurement question.",
        },
      ],
    },
    stakes: {
      label: "Why this matters",
      title: "Ignoring provenance turns every AI answer into a future dispute.",
      lead:
        "Most teams can show policies. Far fewer can prove the exact runtime output, source, process, timestamp, review status and tamper state that a customer, citizen or employee saw.",
      items: [
        {
          title: "You argue from screenshots",
          body:
            "Screenshots, exported logs and vendor dashboards are easy to question. A signed receipt gives reviewers an object they can inspect.",
        },
        {
          title: "Audit work becomes manual",
          body:
            "Without runtime evidence, teams rebuild the story after the fact: source, model, review status, timestamps and changes.",
        },
        {
          title: "Buyers ask harder questions",
          body:
            "If a customer asks for proof and the answer is 'trust our platform', procurement has a reason to slow down.",
        },
      ],
    },
    readiness: {
      title: "Run the 20-second receipt test",
      lead: "Tick only what another party can verify without trusting your internal dashboard.",
      scorePrefix: "Evidence gap",
      high: "Critical: you have policy language, but not a portable proof object.",
      medium: "Still exposed: some evidence exists, but audit and procurement will ask for more.",
      low: "Better: you are approaching the receipt layer buyers and auditors will expect.",
      manualLabel: "manual",
      items: [
        "Exact output can be independently verified later",
        "Source and process metadata travel with the answer",
        "Timestamp and content hash are bound to the artifact",
        "Tampering fails locally without a vendor dashboard",
        "Issuer manifest is public at /.well-known/tsp-manifest.json",
      ],
    },
    gives: {
      label: "What you get",
      title: "TSP is the receipt layer for AI work.",
      lead:
        "It does not claim to replace lawyers, auditors or governance. It creates the technical proof those people need to do their jobs faster.",
      items: [
        {
          icon: <ReceiptText className="h-5 w-5" />,
          title: "Signed TrustEnvelope",
          body: "Source, process, policy, timestamp, hashes and signatures travel with the output.",
        },
        {
          icon: <ShieldCheck className="h-5 w-5" />,
          title: "Independent verification",
          body: "Anyone with the public key can check whether the receipt still holds.",
        },
        {
          icon: <BadgeCheck className="h-5 w-5" />,
          title: "Human-readable badge",
          body: "TrustBadge lets non-technical users inspect the receipt instead of reading JSON.",
        },
        {
          icon: <FileCheck2 className="h-5 w-5" />,
          title: "Pilot evidence tools",
          body: "Risk, Evidence and Oversight are paid alpha tools for teams that want the operations layer handled.",
        },
      ],
    },
    plan: {
      label: "What to do first",
      title: "Start with one AI workflow. Not a giant transformation.",
      lead:
        "The useful first step is small enough for a developer to ship and concrete enough for compliance to inspect.",
      steps: [
        {
          time: "5 min",
          title: "Break the verifier",
          body: "Load a signed receipt, change one character, and see verification fail.",
          href: "/verify",
          cta: "Open validator",
        },
        {
          time: "30 min",
          title: "Wrap one output",
          body: "Use the SDK pattern around one AI response your product already creates.",
          href: "/docs",
          cta: "Read API docs",
        },
        {
          time: "Pilot",
          title: "Turn receipts into evidence",
          body: "If the workflow matters, add Risk, Oversight and Evidence as a focused paid pilot.",
          href: "/kontakt",
          cta: "Talk to us",
        },
      ],
    },
    paths: {
      label: "Choose your path",
      title: "Different teams need the same proof for different reasons.",
      cards: [
        {
          audience: "Compliance and legal",
          problem: "You need evidence that survives questions, not another policy PDF.",
          action: "Map TSP receipts to the EU AI Act evidence points.",
          href: "/eu-ai-act",
        },
        {
          audience: "Developers and security",
          problem: "You need a simple standard, not a black-box provenance vendor.",
          action: "Use the MIT SDK, CLI and verifier.",
          href: "/docs",
        },
        {
          audience: "Leaders and buyers",
          problem: "You need to reduce future audit and procurement friction.",
          action: "See the verification gap before buyers ask.",
          href: "/verification-gap",
        },
      ],
    },
    scenarios: {
      label: "Relatable proof gaps",
      title: "The painful questions usually arrive after the AI answer has already moved.",
      lead:
        "The old pattern is familiar: an answer exists, someone saved a screenshot, and weeks later a reviewer asks whether it was exact, edited, sourced, reviewed, or even the same answer.",
      contrast: "Before TSP: trust the system record. With TSP: check the receipt.",
      beforeLabel: "Before",
      withTspLabel: "With TSP",
      withTspTitle: "Check the receipt.",
      items: [
        {
          audience: "Customer support",
          before: "A support answer is pasted into a dispute thread.",
          question: "Was this the exact AI answer the customer saw, or a cleaned-up copy from the dashboard?",
          withTsp: "The signed receipt binds the output, source declaration, process metadata, content hash, and manifest reference so the reviewer can verify the artifact independently.",
        },
        {
          audience: "Healthcare triage",
          before: "A clinical-facing recommendation is forwarded between teams.",
          question: "Which source and process produced it, when did it happen, and was the text changed before review?",
          withTsp: "The TrustEnvelope travels with the answer, so provenance and tamper evidence are inspectable without needing access to the vendor system.",
        },
        {
          audience: "Procurement and audit",
          before: "A buyer asks for evidence after the pilot is already successful.",
          question: "Can you prove what the system returned last month, or only explain how the system is supposed to behave?",
          withTsp: "TSP turns one live output into a checkable receipt that supports auditability, incident reconstruction, and procurement trust.",
        },
      ],
    },
    boundary: {
      label: "Honest product boundary",
      title: "Free standard first. Paid convenience when the workflow is real.",
      lead:
        "The current product reality is alpha, but useful: the standard and reference packages are the adoption surface; commercial tools are for focused pilots.",
      standardTitle: "Ready as the standard layer",
      standardItems: [
        "Public spec and schema",
        "MIT SDK and CLI",
        "TrustBadge React component",
        "Live validator and public manifest flow",
      ],
      toolsTitle: "Sold only as pilot tools today",
      toolsItems: [
        "Risk Monitor backend alpha",
        "Evidence dossier engine alpha",
        "Oversight review queue alpha",
        "Implementation support for one workflow",
      ],
    },
    close: {
      title: "The question is no longer 'why prove it?'",
      lead:
        "The better question is: what happens when a buyer, auditor or user asks for proof and your AI system has no receipt?",
      primary: "Verify a receipt",
      secondary: "Request a pilot",
    },
  },
  no: {
    hero: {
      badge: "AI Act-bevisgapet er her",
      h1Prefix: "AI-output sendes fortsatt ",
      h1Accent: "uten bevis.",
      h1Receipt: "AI-svar trenger kvittering.",
      lead:
        "Europa venter ikke på bedre skjermbilder. Article 50-transparensplikter gjelder fortsatt fra 2. august 2026, mens utsettelsen for high-risk-regler er et tydelig markedssignal: støtteverktøy og standarder er ikke klare nok.",
      leadStrong:
        "Hvis et AI-system ikke kan vise en signert kvittering for et viktig svar, bør kjøpere spørre hvorfor før de kjøper det.",
      solution:
        "TSP gir viktige AI-svar en signert TrustEnvelope-kvittering: hva som ble sagt, hvilken kilde og prosess som laget det, når det skjedde, og om noen endret det etterpå. Bevis, ikke lovnader.",
      primary: "Verifiser demo-kvittering",
      secondary: "Se GitHub",
      tertiary: "Les spec",
      campaign: "AI Act-avtalen 7. mai 2026 flyttet noen high-risk datoer slik at implementering kan henge sammen med støtteverktøy og standarder. Article 50-transparens starter fortsatt 2. august 2026. Utsettelsen er ikke lettelse; den gjør bevisgapet synlig.",
      question: 'Det nyttige spørsmålet flytter seg fra "kan vi stole på AI?" til "kan vi verifisere outputen?"',
      tags: ["Verifiserbare AI-output", "Kryptografisk proveniens", "Browser-sjekkbart bevis"],
      strip: ["Åpen standard", "Signerte AI-kvitteringer", "Tamper-synlig", "Vendor-uavhengig sjekk", "MIT SDK"],
    },
    lab: {
      label: "Live kvitteringslab",
      title: "Endre svaret. Se kvitteringen ryke.",
      lead: "Dette er salgsargumentet i én bevegelse: et vanlig AI-svar er bare tekst; et TSP-svar har bevis som feiler når teksten endres.",
      contentLabel: "Signert output",
      original: "Pasient-triage: oppfølging innen 24 timer basert på innsendte symptomnotater.",
      tampered: "Pasient-triage: ingen oppfølging nødvendig basert på innsendte symptomnotater.",
      reset: "Gjenopprett kvittering",
      tamper: "Manipuler output",
      verifiedTitle: "Kvitteringen verifiserer",
      verifiedBody: "Innholdshash, Ed25519-signatur og manifest-referanse stemmer. En reviewer har et konkret objekt å inspisere.",
      tamperedTitle: "Manipulasjon er synlig",
      tamperedBody: "Ordene ble endret etter signering. Hash og signatur matcher ikke lenger, så artefaktet bør ikke stoles på.",
      verifiedChecks: ["Hash matcher", "Signatur valid", "Manifest intakt"],
      tamperedChecks: ["Hash-feil", "Signatur invalid", "Tamper oppdaget"],
      tryLine: "QOL: ingen wallet, login, dashboard eller leverandørkonto kreves for å forstå beviset.",
      verifiedBadge: "VERIFISERT",
      tamperedBadge: "MANIPULERT",
    },
    proof: {
      label: "Bevis",
      title: "En kvittering svarer på de ubehagelige spørsmålene.",
      lead:
        "TSP er nyttig når et AI-svar må kunne inspiseres senere av kjøper, bruker, revisor eller myndighet.",
      rows: [
        ["Hvor kom svaret fra?", "Deklarert kilde, modell, policy og tidspunkt."],
        ["Kan vi bevise at noe ble endret?", "Ett tegn endret etter signering bryter verifisering."],
        ["Må vi stole på et dashboard?", "Nei. Kvitteringen kan sjekkes uavhengig."],
      ],
      proofLoopLabel: "Bevisløkken",
      portableReceiptLabel: "Portabel kvittering",
      statusLabels: { verified: "Verifisert", warning: "Trenger bevis", broken: "Manipulert" },
    },
    thesis: {
      label: "Manglende internett-primitiv",
      title: "AI-systemer bør produsere verifiserbart bevis som standard.",
      lead:
        "Helse, juss, finans, offentlig sektor og forbruker-AI kan ikke skalere på skjermbilder, leverandørdashboard eller tillitslovnader. TSP er et portabelt kvitteringslag for øyeblikket der mottakeren spør: hva kan jeg verifisere?",
      items: [
        {
          icon: <ReceiptText className="h-5 w-5" />,
          title: "Ikke enda et dashboard",
          body: "Beviset følger outputen, så kjøpere og brukere trenger ikke tilgang til interne verktøy.",
        },
        {
          icon: <LockKeyhole className="h-5 w-5" />,
          title: "En offentlig verifiseringsvane",
          body: "Hvis et AI-svar betyr noe, bør mottakeren kunne inspisere en signert kvittering før de stoler på det.",
        },
        {
          icon: <BadgeCheck className="h-5 w-5" />,
          title: "Mål om de-facto standard",
          body: "Ambisjonen er enkel: gjør signerte AI-kvitteringer normale nok til at manglende kvittering blir et innkjøpsspørsmål.",
        },
      ],
    },
    stakes: {
      label: "Hvorfor du trenger det",
      title: "Uten proveniens blir hvert AI-svar en fremtidig diskusjon.",
      lead:
        "De fleste kan vise policy-dokumenter. Færre kan bevise eksakt runtime-output, kilde, prosess, tidspunkt, review-status og tamper-status som en kunde, innbygger eller ansatt faktisk så.",
      items: [
        {
          title: "Du ender med skjermbilder",
          body:
            "Skjermbilder, eksporterte logger og leverandør-dashboard er enkle å stille spørsmål ved. En signert kvittering er et objekt andre kan inspisere.",
        },
        {
          title: "Audit blir manuelt arbeid",
          body:
            "Uten runtime-bevis må team rekonstruere historien i etterkant: kilde, modell, review-status, tidspunkt og endringer.",
        },
        {
          title: "Kjøpere stiller hardere krav",
          body:
            "Hvis kunden ber om bevis og svaret er 'stol på plattformen vår', har innkjøp en grunn til å stoppe opp.",
        },
      ],
    },
    readiness: {
      title: "Kjør 20-sekunders kvitteringstest",
      lead: "Kryss bare av det en annen part kan verifisere uten å stole på ditt interne dashboard.",
      scorePrefix: "Bevisgap",
      high: "Kritisk: dere har policy-språk, men ikke et portabelt bevisobjekt.",
      medium: "Fortsatt utsatt: noe bevis finnes, men audit og innkjøp vil spørre etter mer.",
      low: "Bedre: dere nærmer dere kvitteringslaget kjøpere og auditører vil forvente.",
      manualLabel: "manuell",
      items: [
        "Eksakt output kan verifiseres uavhengig senere",
        "Kilde- og prosessmetadata følger svaret",
        "Tidspunkt og innholdshash er bundet til artefaktet",
        "Manipulasjon feiler lokalt uten leverandørdashboard",
        "Issuer-manifest er offentlig på /.well-known/tsp-manifest.json",
      ],
    },
    gives: {
      label: "Hva du får",
      title: "TSP er kvitteringslaget for AI-arbeid.",
      lead:
        "Det erstatter ikke jurister, revisorer eller governance. Det lager det tekniske beviset de trenger for å gjøre jobben raskere.",
      items: [
        {
          icon: <ReceiptText className="h-5 w-5" />,
          title: "Signert TrustEnvelope",
          body: "Kilde, prosess, policy, tid, hasher og signaturer følger svaret.",
        },
        {
          icon: <ShieldCheck className="h-5 w-5" />,
          title: "Uavhengig verifisering",
          body: "Alle med offentlig nøkkel kan sjekke om kvitteringen fortsatt holder.",
        },
        {
          icon: <BadgeCheck className="h-5 w-5" />,
          title: "Lesbar TrustBadge",
          body: "Ikke-tekniske brukere kan inspisere kvitteringen uten å lese JSON.",
        },
        {
          icon: <FileCheck2 className="h-5 w-5" />,
          title: "Pilotverktøy for bevis",
          body: "Risk, Evidence og Oversight er betalte alpha-verktøy for team som vil ha driftslaget håndtert.",
        },
      ],
    },
    plan: {
      label: "Hva du gjør først",
      title: "Start med én AI-flyt. Ikke en stor transformasjon.",
      lead:
        "Første nyttige steg er lite nok til at en utvikler kan shippe det, og konkret nok til at compliance kan inspisere det.",
      steps: [
        {
          time: "5 min",
          title: "Bryt verifieren",
          body: "Last en signert kvittering, endre ett tegn, og se verifisering feile.",
          href: "/verify",
          cta: "Åpne validator",
        },
        {
          time: "30 min",
          title: "Pakk inn ett output",
          body: "Bruk SDK-mønsteret rundt ett AI-svar produktet ditt allerede lager.",
          href: "/docs",
          cta: "Les API-docs",
        },
        {
          time: "Pilot",
          title: "Gjør kvitteringer til bevis",
          body: "Hvis flyten betyr noe, legg på Risk, Oversight og Evidence som en fokusert betalt pilot.",
          href: "/kontakt",
          cta: "Snakk med oss",
        },
      ],
    },
    paths: {
      label: "Velg inngang",
      title: "Ulike team trenger samme bevis av ulike grunner.",
      cards: [
        {
          audience: "Compliance og juridisk",
          problem: "Du trenger bevis som tåler spørsmål, ikke enda en policy-PDF.",
          action: "Map TSP-kvitteringer til EU AI Act-bevispunkter.",
          href: "/eu-ai-act",
        },
        {
          audience: "Utviklere og sikkerhet",
          problem: "Du trenger en enkel standard, ikke en svart boks for proveniens.",
          action: "Bruk MIT SDK, CLI og verifier.",
          href: "/docs",
        },
        {
          audience: "Ledere og innkjøp",
          problem: "Du vil redusere fremtidig audit- og innkjøpsfriksjon.",
          action: "Se verifikasjonsgapet før kjøpere spør.",
          href: "/verification-gap",
        },
      ],
    },
    scenarios: {
      label: "Gjenkjennelige bevisgap",
      title: "De vanskelige spørsmålene kommer ofte etter at AI-svaret allerede har flyttet seg.",
      lead:
        "Det gamle mønsteret er kjent: et svar finnes, noen lagrer et skjermbilde, og uker senere spør en reviewer om det var eksakt, endret, kildebundet, vurdert eller samme svar.",
      contrast: "Før TSP: stol på systemloggen. Med TSP: sjekk kvitteringen.",
      beforeLabel: "Før",
      withTspLabel: "Med TSP",
      withTspTitle: "Sjekk kvitteringen.",
      items: [
        {
          audience: "Kundesupport",
          before: "Et support-svar limes inn i en tvist.",
          question: "Var dette det eksakte AI-svaret kunden så, eller en ryddet kopi fra dashboardet?",
          withTsp: "Den signerte kvitteringen binder output, kildedeklarasjon, prosessmetadata, innholdshash og manifest-referanse slik at reviewer kan verifisere artefaktet uavhengig.",
        },
        {
          audience: "Helse-triage",
          before: "En klinisk anbefaling videresendes mellom team.",
          question: "Hvilken kilde og prosess produserte den, når skjedde det, og ble teksten endret før review?",
          withTsp: "TrustEnvelope følger svaret, så proveniens og manipulasjonsbevis kan inspiseres uten tilgang til leverandørsystemet.",
        },
        {
          audience: "Innkjøp og audit",
          before: "En kjøper ber om bevis etter at piloten allerede ser vellykket ut.",
          question: "Kan dere bevise hva systemet svarte forrige måned, eller bare forklare hvordan systemet skal oppføre seg?",
          withTsp: "TSP gjør ett live output til en sjekkbar kvittering som støtter auditability, hendelsesrekonstruksjon og innkjøpstillit.",
        },
      ],
    },
    boundary: {
      label: "Ærlig produktgrense",
      title: "Gratis standard først. Betalt convenience når flyten er reell.",
      lead:
        "Produktet er fortsatt alpha, men nyttig: standarden og referansepakkene er adopsjonsflaten; kommersielle verktøy er for fokuserte piloter.",
      standardTitle: "Klart som standardlag",
      standardItems: [
        "Offentlig spec og schema",
        "MIT SDK og CLI",
        "TrustBadge React-komponent",
        "Live validator og offentlig manifest-flyt",
      ],
      toolsTitle: "Selges kun som pilotverktøy nå",
      toolsItems: [
        "Risk Monitor backend alpha",
        "Evidence dossier engine alpha",
        "Oversight review queue alpha",
        "Implementeringshjelp for én flyt",
      ],
    },
    close: {
      title: "Spørsmålet er ikke lenger 'hvorfor bevise det?'",
      lead:
        "Det bedre spørsmålet er: hva skjer når en kjøper, auditor eller bruker ber om bevis og AI-systemet ditt ikke har kvittering?",
      primary: "Verifiser en kvittering",
      secondary: "Be om pilot",
    },
  },
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const localeKey = locale === "en" ? "en" : "no";
  const copy = COPY[localeKey];
  const proofPanels = [
    { title: copy.proof.rows[0][0], body: copy.proof.rows[0][1], state: "verified" as const },
    { title: copy.proof.rows[1][0], body: copy.proof.rows[1][1], state: "broken" as const },
    { title: copy.proof.rows[2][0], body: copy.proof.rows[2][1], state: "verified" as const },
  ];
  const heroPreview = localeKey === "en"
    ? {
        label: "Signed receipt preview",
        title: "The answer carries its proof object.",
        status: "Checkable",
        artifact: "TrustEnvelope",
        fields: [
          ["output_hash", "sha256:a3f8...d91c"],
          ["issuer", "LexiTSP manifest"],
          ["signature", "ed25519:valid"],
          ["tamper_state", "unchanged"],
        ] as Array<[string, string]>,
      }
    : {
        label: "Signert kvitteringspreview",
        title: "Svaret bærer med seg bevisobjektet.",
        status: "Sjekkbar",
        artifact: "TrustEnvelope",
        fields: [
          ["output_hash", "sha256:a3f8...d91c"],
          ["issuer", "LexiTSP manifest"],
          ["signature", "ed25519:valid"],
          ["tamper_state", "uendret"],
        ] as Array<[string, string]>,
      };

  return (
    <div className="bg-white text-ink">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-ink text-white">
        <ProofScene />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        <div className="relative z-10 border-b border-white/10 bg-ink/80 backdrop-blur">
          <div className="tsp-container hidden h-12 items-center gap-5 font-mono text-xs uppercase tracking-[0.16em] text-white/70 md:flex">
            {copy.hero.strip.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-5">
                {index > 0 && <span className="h-4 w-px bg-white/20" />}
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="tsp-container relative z-10 grid items-start gap-8 py-10 md:py-12 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
          <div className="max-w-[680px]">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 border border-danger/45 bg-danger/20 px-3.5 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white shadow-[0_16px_44px_rgba(185,28,28,0.16)] backdrop-blur">
              <AlertTriangle className="h-4 w-4" />
              {copy.hero.badge}
            </div>
            <h1 className="mb-5 text-[clamp(2.45rem,5.7vw,4.95rem)] font-semibold leading-[0.98] tracking-[0em] text-white">
              {copy.hero.h1Prefix}
              <span className="text-accent">{copy.hero.h1Accent}</span>
              <br />
              <span className="text-white/70">{copy.hero.h1Receipt}</span>
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/75 md:text-xl md:leading-8">
              {copy.hero.lead}
            </p>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-white md:text-lg md:leading-8">
              {copy.hero.leadStrong}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/verify"
                className="group inline-flex min-h-[3.5rem] w-full items-center justify-center gap-3 border border-accent bg-accent px-6 py-4 text-sm font-bold text-ink no-underline shadow-[0_22px_55px_rgba(242,184,75,0.26)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D97706] hover:bg-[#F59E0B] hover:text-ink hover:shadow-[0_24px_70px_rgba(242,184,75,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:w-auto md:text-base"
              >
                <Play className="h-4 w-4" />
                {copy.hero.primary}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="https://github.com/LexiTSP"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[3.5rem] w-full items-center justify-center gap-3 border border-white/25 bg-white/10 px-6 py-4 text-sm font-bold text-white no-underline shadow-[0_16px_44px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-ink hover:shadow-[0_24px_64px_rgba(255,255,255,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:w-auto md:text-base"
              >
                {copy.hero.secondary}
                <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link
                href="/spec"
                className="group hidden min-h-[3.5rem] items-center justify-center gap-3 border border-brand-light/45 bg-brand-light/10 px-6 py-4 text-sm font-bold text-white no-underline shadow-[0_16px_44px_rgba(30,78,122,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-light hover:bg-brand hover:text-white hover:shadow-[0_24px_64px_rgba(30,78,122,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:inline-flex md:text-base"
              >
                {copy.hero.tertiary}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="mt-6 max-w-xl border-l-4 border-accent bg-white/[0.07] px-4 py-3 text-sm font-semibold leading-6 text-white shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
              {copy.hero.question}
            </p>
          </div>
          <HeroEvidencePreview labels={heroPreview} rows={copy.proof.rows} solution={copy.hero.solution} />
        </div>
      </section>

      <div className="bg-ink py-3 text-white">
        <div className="tsp-container flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-white/70">
          {copy.hero.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-2">
              <span className="h-2 w-2 bg-accent" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <section id="receipt-lab" className="scroll-mt-28 border-b border-border bg-paper text-ink">
        <div className="tsp-container py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <HeroProofConsole copy={copy.lab} />
          </div>
        </div>
      </section>

      <section id="scenarios" className="scroll-mt-28 border-b border-border bg-white text-ink">
        <div className="tsp-container py-16 md:py-20">
          <SectionLabel icon={<AlertTriangle className="h-4 w-4" />} label={copy.scenarios.label} tone="warn" />
          <div className="mt-4">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.55fr)] lg:items-end">
              <div>
                <h2 className="max-w-4xl text-ink">{copy.scenarios.title}</h2>
                <p className="mt-5 max-w-3xl text-muted">{copy.scenarios.lead}</p>
              </div>
              <div className="border-l-4 border-ink bg-paper p-4 text-sm font-semibold leading-6 text-ink">
                {copy.scenarios.contrast}
              </div>
            </div>
            <div className="mt-8">
              <ScenarioSwitcher
                scenarios={copy.scenarios.items}
                beforeLabel={copy.scenarios.beforeLabel}
                withTspLabel={copy.scenarios.withTspLabel}
                withTspTitle={copy.scenarios.withTspTitle}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="scroll-mt-28 border-b border-border bg-paper text-ink">
        <div className="tsp-container py-14 md:py-20">
          <InteractiveProofPanels
            title={copy.proof.title}
            lead={`${copy.proof.lead} ${copy.hero.solution}`}
            panels={proofPanels}
            labels={{
              proofLoop: copy.proof.proofLoopLabel,
              portableReceipt: copy.proof.portableReceiptLabel,
              ...copy.proof.statusLabels,
            }}
          />
        </div>
      </section>

      <section id="primitive" className="scroll-mt-28 border-b border-border bg-white text-ink">
        <div className="tsp-container py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionLabel icon={<ShieldCheck className="h-4 w-4" />} label={copy.thesis.label} />
              <h2 className="mt-5 max-w-2xl text-ink">{copy.thesis.title}</h2>
              <p className="mt-5 max-w-2xl text-muted">{copy.thesis.lead}</p>
            </div>
            <div className="grid gap-4">
              {copy.thesis.items.map((item) => (
                <ThesisItem key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="stakes" className="scroll-mt-28 border-b border-border bg-white text-ink">
        <div className="tsp-container py-16 md:py-20">
          <SectionLabel icon={<ShieldAlert className="h-4 w-4" />} label={copy.stakes.label} tone="warn" />
          <div className="mt-4 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <h2 className="max-w-xl text-ink">{copy.stakes.title}</h2>
              <p className="mt-5 max-w-xl text-muted">{copy.stakes.lead}</p>
              <Link
                href="/ai-act-august-2"
                className="group mt-6 inline-flex items-start gap-3 border-l-4 border-accent bg-accent/10 px-4 py-3 text-sm font-semibold leading-6 text-ink no-underline transition-colors hover:bg-accent/20"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
                <span>{copy.hero.campaign}</span>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <ReceiptReadinessCheck copy={copy.readiness} />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.stakes.items.map((item) => (
              <ConsequenceItem key={item.title} title={item.title} body={item.body} />
            ))}
          </div>
        </div>
      </section>

      <section id="gives" className="scroll-mt-28 border-b border-border bg-paper text-ink">
        <div className="tsp-container py-16 md:py-20">
          <SectionLabel icon={<Sparkles className="h-4 w-4" />} label={copy.gives.label} />
          <div className="mt-4 max-w-2xl">
            <h2 className="text-ink">{copy.gives.title}</h2>
            <p className="mt-4 text-muted">{copy.gives.lead}</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {copy.gives.items.map((item) => (
              <ValueTile key={item.title} icon={item.icon} title={item.title} body={item.body} />
            ))}
          </div>
        </div>
      </section>

      <section id="plan" className="scroll-mt-28 border-b border-border bg-white text-ink">
        <div className="tsp-container py-16 md:py-20">
          <SectionLabel icon={<TimerReset className="h-4 w-4" />} label={copy.plan.label} />
          <div className="mt-4 max-w-3xl">
            <h2 className="text-ink">{copy.plan.title}</h2>
            <p className="mt-4 text-muted">{copy.plan.lead}</p>
          </div>
          <div className="mt-8">
            <InteractiveActionSteps steps={copy.plan.steps} />
          </div>
        </div>
      </section>

      <section id="paths" className="scroll-mt-28 border-b border-border bg-paper text-ink">
        <div className="tsp-container py-16 md:py-20">
          <SectionLabel icon={<Users className="h-4 w-4" />} label={copy.paths.label} />
          <h2 className="mt-4 max-w-2xl text-ink">{copy.paths.title}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.paths.cards.map((card) => (
              <AudiencePath key={card.audience} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-28 border-b border-white/10 bg-ink text-white">
        <div className="tsp-container py-16 md:py-20">
          <div className="border-y border-white/15 py-12">
          <SectionLabel icon={<Scale className="h-4 w-4" />} label={copy.boundary.label} inverse />
          <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="max-w-2xl text-white">{copy.boundary.title}</h2>
              <p className="mt-4 max-w-xl text-white/70">{copy.boundary.lead}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <BoundaryList title={copy.boundary.standardTitle} items={copy.boundary.standardItems} tone="standard" inverse />
              <BoundaryList title={copy.boundary.toolsTitle} items={copy.boundary.toolsItems} tone="pilot" inverse />
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="tsp-container py-16 md:py-20">
          <div className="grid gap-8 border-y border-white/15 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="max-w-3xl text-white">{copy.close.title}</h2>
              <p className="mt-4 max-w-2xl text-white/70">{copy.close.lead}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/verify" className="inline-flex items-center justify-center gap-2 border border-accent bg-accent px-6 py-4 text-base font-bold text-ink no-underline shadow-[0_18px_44px_rgba(242,184,75,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D97706] hover:bg-[#F59E0B] hover:text-ink">
                {copy.close.primary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/kontakt" className="inline-flex items-center justify-center border border-white/25 bg-white/[0.04] px-6 py-4 text-base font-bold text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 hover:text-accent">
                {copy.close.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProofScene() {
  const receipts = [
    ["content", "AI output signed"],
    ["source", "declared"],
    ["model", "versioned"],
    ["hash", "a3f8...d91c"],
    ["signature", "valid"],
    ["tamper", "detected"],
  ];

  return (
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(242,184,75,0.24),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(30,78,122,0.52),transparent_31%),radial-gradient(circle_at_50%_88%,rgba(4,120,87,0.18),transparent_32%),linear-gradient(135deg,#07111f_0%,#0d1c31_47%,#111827_100%)]" />
      <div className="absolute inset-0 opacity-[0.24] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute right-[-230px] top-24 hidden w-[600px] rotate-[-7deg] opacity-55 lg:block xl:right-[-120px]">
        <div className="border border-white/[0.14] bg-white/90 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.36)] backdrop-blur">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-muted">TrustEnvelope</div>
            <div className="inline-flex items-center gap-2 text-verify">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-mono text-sm">verified</span>
            </div>
          </div>
          <div className="space-y-2">
            {receipts.map(([key, value], index) => (
              <div key={key} className="grid grid-cols-[110px_1fr] gap-4 border border-border bg-paper/80 px-4 py-3 font-mono text-sm">
                <span className="text-muted">{key}</span>
                <span className={index === receipts.length - 1 ? "text-accent-dark" : "text-ink"}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroEvidencePreview({
  labels,
  rows,
  solution,
}: {
  labels: { label: string; title: string; status: string; artifact: string; fields: Array<[string, string]> };
  rows: Array<[string, string]>;
  solution: string;
}) {
  return (
    <div className="relative">
      <div className="border border-white/15 bg-white/[0.075] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-white/12 pb-5">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">{labels.label}</div>
            <h2 className="mt-3 text-2xl leading-tight text-white md:text-3xl">{labels.title}</h2>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 border border-verify/45 bg-verify/15 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            {labels.status}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_0.92fr]">
          <div className="border border-white/12 bg-ink/45 p-4">
            <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-white/55">
              <FileText className="h-4 w-4 text-accent" />
              {labels.artifact}
            </div>
            <div className="grid gap-2">
              {labels.fields.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[110px_1fr] gap-3 border border-white/10 bg-white/[0.045] px-3 py-2 font-mono text-xs">
                  <span className="text-white/45">{key}</span>
                  <span className={key === "tamper_state" ? "text-accent" : "text-white/82"}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {rows.map(([question, answer], index) => (
              <div key={question} className="border border-white/12 bg-white/[0.055] p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <h3 className="text-sm font-semibold leading-5 text-white">{question}</h3>
                    <p className="mt-1 text-xs leading-5 text-white/62">{answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 border-l-2 border-accent pl-3 text-sm leading-6 text-white/72">{solution}</p>
      </div>
    </div>
  );
}

function SectionLabel({
  icon,
  label,
  tone,
  inverse,
}: {
  icon: ReactNode;
  label: string;
  tone?: "verify" | "warn";
  inverse?: boolean;
}) {
  const color = inverse && tone === "warn"
    ? "border-danger/35 bg-danger/10 text-danger"
    : inverse
      ? "border-accent/25 bg-accent/10 text-accent"
      : tone === "verify"
      ? "border-verify/25 bg-verify/[0.06] text-verify"
      : tone === "warn"
      ? "border-warn/25 bg-warn/[0.06] text-warn"
        : "border-brand/20 bg-brand/[0.06] text-brand";

  return (
    <div className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] ${color}`}>
      {icon}
      {label}
    </div>
  );
}

function ThesisItem({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="grid gap-4 border border-border bg-white p-5 shadow-[0_14px_44px_rgba(17,24,39,0.06)] transition-transform duration-200 hover:-translate-y-0.5 sm:grid-cols-[auto_1fr]">
      <div className="flex h-11 w-11 items-center justify-center border border-accent/30 bg-accent/10 text-accent">
        {icon}
      </div>
      <div>
        <h3 className="mb-2 text-lg text-ink">{title}</h3>
        <p className="text-sm leading-6 text-muted">{body}</p>
      </div>
    </div>
  );
}

function ConsequenceItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="grid gap-4 border border-danger/25 bg-danger/[0.07] p-5 shadow-[0_14px_44px_rgba(185,28,28,0.05)] transition-transform duration-200 hover:-translate-y-0.5 sm:grid-cols-[auto_1fr]">
      <div className="flex h-10 w-10 items-center justify-center border border-danger/35 bg-danger/10 text-danger">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <h3 className="mb-2 text-lg text-ink">{title}</h3>
        <p className="text-sm leading-6 text-muted">{body}</p>
      </div>
    </div>
  );
}

function ValueTile({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="group relative overflow-hidden border border-border bg-white p-6 shadow-[0_14px_44px_rgba(17,24,39,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-accent/55 hover:bg-white hover:shadow-[0_24px_70px_rgba(17,24,39,0.13)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="mb-5 flex h-11 w-11 items-center justify-center border border-accent/30 bg-accent/10 text-accent transition-all duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-ink group-hover:shadow-[0_12px_28px_rgba(242,184,75,0.28)]">
        {icon}
      </div>
      <h3 className="mb-2 text-lg text-ink">{title}</h3>
      <p className="text-sm leading-6 text-muted">{body}</p>
      <div className="mt-5 inline-flex h-8 w-8 items-center justify-center border border-accent/35 bg-accent/10 text-accent-dark opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
}

function AudiencePath({
  audience,
  problem,
  action,
  href,
}: {
  audience: string;
  problem: string;
  action: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[18rem] flex-col overflow-hidden border border-border bg-white p-6 text-ink no-underline shadow-[0_14px_44px_rgba(17,24,39,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-brand/45 hover:shadow-[0_24px_70px_rgba(17,24,39,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-brand opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="mb-5 flex h-11 w-11 items-center justify-center border border-accent/30 bg-accent/10 text-accent transition-all duration-200 group-hover:border-brand group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_12px_28px_rgba(30,78,122,0.24)]">
        {audience.includes("Developer") || audience.includes("Utviklere") ? (
          <Code2 className="h-5 w-5" />
        ) : audience.includes("Compliance") ? (
          <ClipboardCheck className="h-5 w-5" />
        ) : (
          <BookOpenCheck className="h-5 w-5" />
        )}
      </div>
      <h3 className="mb-3 text-lg text-ink">{audience}</h3>
      <p className="mb-4 text-sm leading-6 text-muted">{problem}</p>
      <div className="mt-auto border-t border-border pt-4">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-accent-dark transition-colors duration-200 group-hover:text-brand">
          {action} <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function BoundaryList({
  title,
  items,
  tone,
  inverse,
}: {
  title: string;
  items: string[];
  tone: "standard" | "pilot";
  inverse?: boolean;
}) {
  const isStandard = tone === "standard";
  const boxClass = inverse
    ? isStandard
      ? "border-verify/35 bg-verify/[0.08]"
      : "border-warn/35 bg-warn/[0.08]"
    : isStandard
      ? "border-verify/35 bg-[linear-gradient(135deg,rgba(4,120,87,0.10),rgba(255,255,255,1))]"
      : "border-warn/35 bg-[linear-gradient(135deg,rgba(217,119,6,0.12),rgba(255,255,255,1))]";
  const iconClass = isStandard ? (inverse ? "text-emerald-200" : "text-verify") : (inverse ? "text-accent" : "text-warn");

  return (
    <div className={`border p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)] ${boxClass}`}>
      <div className={`mb-4 flex items-center gap-2 font-semibold ${inverse ? "text-white" : "text-ink"}`}>
        {isStandard ? <CheckCircle2 className={`h-5 w-5 ${iconClass}`} /> : <FileText className={`h-5 w-5 ${iconClass}`} />}
        {title}
      </div>
      <ul className={`space-y-3 text-sm ${inverse ? "text-white/68" : "text-muted"}`}>
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            {isStandard ? (
              <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`} />
            ) : (
              <FileText className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`} />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
