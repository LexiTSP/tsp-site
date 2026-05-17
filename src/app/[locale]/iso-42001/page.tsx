import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  XCircle,
} from "lucide-react";
import { V2BoundaryNote, V2CanonicalStrip, V2PageHero } from "@/components/V2ProofSurface";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "iso42001" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

interface ClauseRow {
  clause: string;
  name: string;
  tspCoverage: "covered" | "partial" | "organizational";
  tspNote: string;
}

const CLAUSES_NO: ClauseRow[] = [
  {
    clause: "4.1-4.4",
    name: "Context of the organization",
    tspCoverage: "organizational",
    tspNote: "Ren forretningsvurdering. TSP spiller ingen rolle her.",
  },
  {
    clause: "5.1-5.3",
    name: "Leadership & policy",
    tspCoverage: "organizational",
    tspNote: "AI-policy, ansvarsfordeling, ledelsens forpliktelse. Dokument-arbeid.",
  },
  {
    clause: "6.1",
    name: "AI risk assessment planning",
    tspCoverage: "partial",
    tspNote: "TSP Risk leverer dataene. Selve planen skrives av compliance-teamet.",
  },
  {
    clause: "6.1.2",
    name: "AI risk assessment",
    tspCoverage: "covered",
    tspNote: "TSP Risk modulen — bias-drift, risk-distribusjon, trend-analyse. Input til AI risk assessment.",
  },
  {
    clause: "6.1.3",
    name: "AI risk treatment",
    tspCoverage: "partial",
    tspNote: "Alerting + webhook-til-action fra Risk lukker loopen, men selve treatment-planer skrives av mennesker.",
  },
  {
    clause: "6.1.4",
    name: "AI impact assessment",
    tspCoverage: "partial",
    tspNote: "Envelope alignment.riskLevel + flags gir input. Full impact assessment krever stakeholder-konsultasjon.",
  },
  {
    clause: "6.2",
    name: "AI objectives",
    tspCoverage: "organizational",
    tspNote: "Strategiske mål — ikke teknisk.",
  },
  {
    clause: "7.1",
    name: "Resources",
    tspCoverage: "organizational",
    tspNote: "Budsjett, infrastruktur, personell. Ikke software.",
  },
  {
    clause: "7.2",
    name: "Competence",
    tspCoverage: "organizational",
    tspNote: "HR og opplæring. TSP bruker kompetente mennesker, men sertifiserer dem ikke.",
  },
  {
    clause: "7.3",
    name: "Awareness",
    tspCoverage: "organizational",
    tspNote: "Intern kommunikasjon. TSP kan gi rapporter til styret, men awareness er ledelsesansvar.",
  },
  {
    clause: "7.4",
    name: "Communication",
    tspCoverage: "partial",
    tspNote: "TSP Evidence genererer månedsrapporter som støtter intern og ekstern kommunikasjon.",
  },
  {
    clause: "7.5",
    name: "Documented information",
    tspCoverage: "covered",
    tspNote: "TSP Evidence leverer strukturerte dossiers med sporbarhet til ledger. Ryggraden.",
  },
  {
    clause: "8.1",
    name: "Operational planning & control",
    tspCoverage: "covered",
    tspNote: "TSP Core's envelope-struktur dokumenterer hver operasjonell beslutning. Pipeline-valg, modellvalg, risk-flagging.",
  },
  {
    clause: "8.2",
    name: "AI risk assessment (operational)",
    tspCoverage: "covered",
    tspNote: "Direkte dekket av TSP Risk som kjører kontinuerlig.",
  },
  {
    clause: "8.3",
    name: "AI risk treatment (operational)",
    tspCoverage: "partial",
    tspNote: "Alerting og automatiske workflows dekker hendelser. Strategiske treatment-vedtak er manuelle.",
  },
  {
    clause: "8.4",
    name: "AI system impact assessment",
    tspCoverage: "partial",
    tspNote: "Post-deployment-data finnes i ledger. Pre-deployment-assessment er organisatorisk.",
  },
  {
    clause: "9.1",
    name: "Monitoring, measurement, analysis, evaluation",
    tspCoverage: "covered",
    tspNote: "Kjerne-funksjonen til TSP Risk. Kontinuerlig monitoring med strukturerte metrikker.",
  },
  {
    clause: "9.2",
    name: "Internal audit",
    tspCoverage: "partial",
    tspNote: "TSP Evidence leverer grunnlaget for intern audit. Selve audit-prosessen er organisatorisk.",
  },
  {
    clause: "9.3",
    name: "Management review",
    tspCoverage: "organizational",
    tspNote: "Ledelsens gjennomgang av AIMS. TSP Evidence gir input; møtet er menneskelig.",
  },
  {
    clause: "10.1",
    name: "Continual improvement",
    tspCoverage: "partial",
    tspNote: "TSP Risk's alert-→-action-loop er direkte continual improvement. Strategisk forbedring er organisatorisk.",
  },
  {
    clause: "10.2",
    name: "Nonconformity & corrective action",
    tspCoverage: "partial",
    tspNote: "TSP Risk fanger nonconformity (biasdrift, integrity-brudd). Corrective action loggføres, men vedtas av mennesker.",
  },
];

const CLAUSES_EN: ClauseRow[] = [
  {
    clause: "4.1-4.4",
    name: "Context of the organisation",
    tspCoverage: "organizational",
    tspNote: "Pure business judgement. TSP plays no role here.",
  },
  {
    clause: "5.1-5.3",
    name: "Leadership & policy",
    tspCoverage: "organizational",
    tspNote: "AI policy, allocation of responsibility, management commitment. Document work.",
  },
  {
    clause: "6.1",
    name: "AI risk assessment planning",
    tspCoverage: "partial",
    tspNote: "TSP Risk supplies the data. The plan itself is written by the compliance team.",
  },
  {
    clause: "6.1.2",
    name: "AI risk assessment",
    tspCoverage: "covered",
    tspNote: "The TSP Risk module — bias drift, risk distribution, trend analysis. Input to AI risk assessment.",
  },
  {
    clause: "6.1.3",
    name: "AI risk treatment",
    tspCoverage: "partial",
    tspNote: "Alerting + webhook-to-action from Risk closes the loop, but the treatment plans themselves are written by people.",
  },
  {
    clause: "6.1.4",
    name: "AI impact assessment",
    tspCoverage: "partial",
    tspNote: "Envelope alignment.riskLevel + flags provide input. A full impact assessment requires stakeholder consultation.",
  },
  {
    clause: "6.2",
    name: "AI objectives",
    tspCoverage: "organizational",
    tspNote: "Strategic objectives — not technical.",
  },
  {
    clause: "7.1",
    name: "Resources",
    tspCoverage: "organizational",
    tspNote: "Budget, infrastructure, personnel. Not software.",
  },
  {
    clause: "7.2",
    name: "Competence",
    tspCoverage: "organizational",
    tspNote: "HR and training. TSP relies on competent people but does not certify them.",
  },
  {
    clause: "7.3",
    name: "Awareness",
    tspCoverage: "organizational",
    tspNote: "Internal communication. TSP can produce reports for the board, but awareness is a management responsibility.",
  },
  {
    clause: "7.4",
    name: "Communication",
    tspCoverage: "partial",
    tspNote: "TSP Evidence generates monthly reports that support internal and external communication.",
  },
  {
    clause: "7.5",
    name: "Documented information",
    tspCoverage: "covered",
    tspNote: "TSP Evidence delivers structured dossiers with traceability to the ledger. The backbone.",
  },
  {
    clause: "8.1",
    name: "Operational planning & control",
    tspCoverage: "covered",
    tspNote: "TSP Core's envelope structure documents every operational decision. Pipeline choice, model choice, risk flagging.",
  },
  {
    clause: "8.2",
    name: "AI risk assessment (operational)",
    tspCoverage: "covered",
    tspNote: "Directly covered by TSP Risk, which runs continuously.",
  },
  {
    clause: "8.3",
    name: "AI risk treatment (operational)",
    tspCoverage: "partial",
    tspNote: "Alerting and automated workflows cover incidents. Strategic treatment decisions are manual.",
  },
  {
    clause: "8.4",
    name: "AI system impact assessment",
    tspCoverage: "partial",
    tspNote: "Post-deployment data lives in the ledger. Pre-deployment assessment is organisational.",
  },
  {
    clause: "9.1",
    name: "Monitoring, measurement, analysis, evaluation",
    tspCoverage: "covered",
    tspNote: "The core function of TSP Risk. Continuous monitoring with structured metrics.",
  },
  {
    clause: "9.2",
    name: "Internal audit",
    tspCoverage: "partial",
    tspNote: "TSP Evidence supplies the basis for internal audit. The audit process itself is organisational.",
  },
  {
    clause: "9.3",
    name: "Management review",
    tspCoverage: "organizational",
    tspNote: "Management's review of the AIMS. TSP Evidence provides input; the meeting is human.",
  },
  {
    clause: "10.1",
    name: "Continual improvement",
    tspCoverage: "partial",
    tspNote: "TSP Risk's alert-→-action loop is continual improvement directly. Strategic improvement is organisational.",
  },
  {
    clause: "10.2",
    name: "Nonconformity & corrective action",
    tspCoverage: "partial",
    tspNote: "TSP Risk catches nonconformity (bias drift, integrity breaches). Corrective action is logged but decided by people.",
  },
];

export default async function Iso42001Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("iso42001");
  const isEn = locale === "en";
  const CLAUSES = isEn ? CLAUSES_EN : CLAUSES_NO;

  const covered = CLAUSES.filter((c) => c.tspCoverage === "covered").length;
  const partial = CLAUSES.filter((c) => c.tspCoverage === "partial").length;
  const org = CLAUSES.filter((c) => c.tspCoverage === "organizational").length;

  return (
    <>
      <V2PageHero
        eyebrow={isEn ? "ISO 42001 mapping · evidence support" : "ISO 42001-mapping · bevisstøtte"}
        title={isEn ? "A management system still needs management." : "Et styringssystem trenger fortsatt styring."}
        lead={
          isEn
            ? "TSP can supply signed runtime evidence for an AI management system. It does not certify the organisation, train staff, or replace the QMS process."
            : "TSP kan levere signert runtime-bevis til et AI management system. Det sertifiserer ikke organisasjonen, trener ikke ansatte og erstatter ikke QMS-prosessen."
        }
        primaryCta={{ href: "#clause-map", label: isEn ? "See clause map" : "Se klausulmapping" }}
        secondaryCta={{ href: "/evidence", label: isEn ? "Open Evidence" : "Åpne Evidence" }}
        proofItems={[
          { label: isEn ? "Role" : "Rolle", value: isEn ? "Evidence backbone" : "Bevisryggrad" },
          { label: isEn ? "Boundary" : "Grense", value: isEn ? "Not certification" : "Ikke sertifisering" },
          { label: isEn ? "Verifier" : "Verifikator", value: "verifyLocal() / verifyOnline()" },
        ]}
      />
      <V2CanonicalStrip locale={locale} />

      <div className="tsp-container py-12">
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="tsp-card p-5 border-verify/30 bg-verify/5">
          <div className="tsp-eyebrow text-verify mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t("statCoveredEyebrow")}
          </div>
          <div className="text-3xl font-bold text-ink">{covered}</div>
          <div className="text-sm text-muted mt-1">{t("statCoveredSub")}</div>
        </div>
        <div className="tsp-card p-5 border-brand/30 bg-brand/5">
          <div className="tsp-eyebrow text-brand mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            {t("statBackboneEyebrow")}
          </div>
          <div className="text-3xl font-bold text-ink">{partial}</div>
          <div className="text-sm text-muted mt-1">{t("statBackboneSub")}</div>
        </div>
        <div className="tsp-card p-5 border-warn/30 bg-warn/5">
          <div className="tsp-eyebrow text-warn mb-2 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            {t("statOrgEyebrow")}
          </div>
          <div className="text-3xl font-bold text-ink">{org}</div>
          <div className="text-sm text-muted mt-1">{t("statOrgSub")}</div>
        </div>
      </div>

      <div className="mb-10 p-6 border-l-2 border-accent bg-elevated">
        <div className="tsp-eyebrow tsp-accent-text mb-2">{t("strategyEyebrow")}</div>
        <p className="text-lg leading-snug mb-3">
          <strong>{t("strategyP1Strong")}</strong> {t("strategyP1")}
        </p>
      </div>

      <div className="mb-10">
        <V2BoundaryNote title={isEn ? "What ISO evidence means" : "Hva ISO-bevis betyr"}>
          {isEn
            ? "TSP can make technical records easier to verify: which AI output was produced, which sources and model metadata were declared, whether the chain is intact, and which reviewer decision followed. ISO 42001 certification remains an organisational assessment."
            : "TSP kan gjøre tekniske records enklere å verifisere: hvilket AI-svar ble produsert, hvilke kilder og modellmetadata ble deklarert, om kjeden er intakt, og hvilken reviewer-beslutning fulgte. ISO 42001-sertifisering er fortsatt en organisatorisk vurdering."}
        </V2BoundaryNote>
      </div>

      {/* Mapping table */}
      <section id="clause-map" className="mb-10 scroll-mt-20">
        <h2 className="text-2xl font-bold mb-5">{isEn ? "Clause-by-clause mapping" : "Klausul-for-klausul mapping"}</h2>
        <div className="tsp-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 tsp-eyebrow text-muted font-semibold w-24">{isEn ? "Clause" : "Klausul"}</th>
                  <th className="text-left p-3 tsp-eyebrow text-muted font-semibold">{isEn ? "Name" : "Navn"}</th>
                  <th className="text-left p-3 tsp-eyebrow text-muted font-semibold w-36">{isEn ? "TSP status" : "TSP-status"}</th>
                  <th className="text-left p-3 tsp-eyebrow text-muted font-semibold">{isEn ? "Note" : "Merknad"}</th>
                </tr>
              </thead>
              <tbody>
                {CLAUSES.map((c) => (
                  <tr key={c.clause} className="border-b hover:bg-brand/[0.02]">
                    <td className="p-3 font-mono text-xs text-ink font-semibold">{c.clause}</td>
                    <td className="p-3 font-semibold text-ink">{c.name}</td>
                    <td className="p-3">
                      <StatusPill status={c.tspCoverage} isEn={isEn} />
                    </td>
                    <td className="p-3 text-xs text-muted leading-relaxed">{c.tspNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Evidence path */}
      <section className="mb-10 rounded-2xl bg-paper border border-border p-6">
        <div className="tsp-eyebrow text-nav-red mb-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-nav-red" />
          {isEn ? "Evidence path" : "Bevisspor"}
        </div>
        <h2 className="text-xl font-bold mb-3">
          {isEn ? "Measure the evidence workload before adopting tooling" : "Mål bevisarbeidet før dere innfører verktøy"}
        </h2>
        <p className="text-sm text-ink/90 leading-relaxed mb-3">
          {isEn ? (
            <>
              A TSP Evidence pilot should produce one narrow, reviewable dossier from signed
              envelopes. <strong>The hypothesis to test:</strong> verifiable runtime evidence should reduce
              manual collation and make review gaps visible earlier.
            </>
          ) : (
            <>
              En TSP Evidence-pilot bør produsere én smal, reviderbar dossier fra ekte signerte
              envelopes. <strong>Hypotesen som testes:</strong> verifiserbart runtime-bevis bør redusere
              manuell samling og gjøre review-gaps synlige tidligere.
            </>
          )}
        </p>
        <p className="text-sm text-ink/90 leading-relaxed mb-3">
          {isEn
            ? "The useful numbers are time spent, missing fields, auditor comments, and whether the generated report actually reduces manual collation."
            : "De nyttige tallene er tidsbruk, manglende felter, kommentarer fra auditor, og om den genererte rapporten faktisk reduserer manuell samling."}
        </p>
        <Link href="/kontakt" className="text-sm font-semibold text-nav-red hover:underline inline-flex items-center gap-1">
          {isEn ? "Plan an Evidence pilot" : "Planlegg en Evidence-pilot"} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      </div>

      <section className="tsp-inverse border-t border-border-strong">
        <div className="tsp-container py-14 md:py-18 relative">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="tsp-section-eyebrow mb-4">
                <span className="tsp-section-num tsp-section-num--accent">→</span>
                <span className="tsp-section-label">{t("ctaEyebrow")}</span>
              </div>
              <h2 className="mb-3 max-w-2xl">{t("ctaH2")}</h2>
              <p className="text-white/75 leading-relaxed">{t("ctaLead")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/kontakt" className="tsp-btn-primary" style={{ background: "var(--color-accent)", borderColor: "var(--color-accent)", color: "#fff" }}>
                {t("ctaPrimary")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/evidence" className="tsp-btn-secondary" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}>
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StatusPill({ status, isEn }: { status: "covered" | "partial" | "organizational"; isEn: boolean }) {
  if (status === "covered") {
    return (
      <span className="tsp-pill border-verify/40 bg-verify/10 text-verify">
        <CheckCircle2 className="w-3 h-3" /> {isEn ? "Covered" : "Dekket"}
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="tsp-pill border-brand/40 bg-brand/10 text-brand">
        <Info className="w-3 h-3" /> {isEn ? "Partial / backbone" : "Delvis / ryggrad"}
      </span>
    );
  }
  return (
    <span className="tsp-pill border-warn/40 bg-warn/10 text-warn">
      <XCircle className="w-3 h-3" /> {isEn ? "Organisational" : "Organisatorisk"}
    </span>
  );
}
