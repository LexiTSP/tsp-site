import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, Mail, Newspaper, ShieldCheck } from "lucide-react";

const CONTACT_EMAIL = "tsp@lexico.no";

const copy = {
  en: {
    title: "AI receipt standard updates - TSP",
    description:
      "Get lightweight email updates on AI Act transparency, TSP spec releases, verifier examples, and pilot openings.",
    breadcrumb: "Updates",
    eyebrow: "AI receipt standard updates",
    h1: "Follow the AI receipt standard as it hardens.",
    lead:
      "The AI Act delay is a signal: support tools, standards, and evidence formats need to exist. TSP updates track the narrow layer we are shipping for that gap: signed receipts, offline verification, and practical adoption paths.",
    mailCta: "Ask to join updates",
    verifyCta: "Try the verifier",
    docsCta: "Read implementation docs",
    note:
      "No subscription backend yet. This opens an email to tsp@lexico.no so we can add you manually until the mailing provider is chosen.",
    item1Title: "AI Act transparency pressure",
    item1Body:
      "Short notes on Article 50, staged high-risk dates, and what those deadlines mean for runtime evidence work.",
    item2Title: "TSP spec releases",
    item2Body:
      "Versioned protocol changes, verifier examples, manifest notes, and migration guidance for implementers.",
    item3Title: "Pilot openings",
    item3Body:
      "Early slots for teams that want to wrap one AI workflow, publish a manifest, and produce an inspectable evidence pack.",
    subject: "Join TSP AI receipt standard updates",
    body:
      "Hi TSP team,%0D%0A%0D%0APlease add me to lightweight updates on AI Act transparency, TSP spec releases, verifier examples, and pilot openings.%0D%0A%0D%0AName:%0D%0ACompany:%0D%0ARole:%0D%0AWhat I want to track:%0D%0A",
  },
  no: {
    title: "AI-kvitteringsstandard updates - TSP",
    description:
      "Faa korte e-postoppdateringer om AI Act-transparens, TSP-spec releases, verifier-eksempler og pilotapninger.",
    breadcrumb: "Updates",
    eyebrow: "AI-kvitteringsstandard updates",
    h1: "Folg AI-kvitteringsstandarden mens den hardnes.",
    lead:
      "AI Act-utsettelsen er et signal: stotteverktoy, standarder og evidence-formater maa finnes. TSP-updates folger det smale laget vi shipper for gapet: signerte kvitteringer, offline verifisering og praktiske adopsjonsveier.",
    mailCta: "Be om aa bli lagt til",
    verifyCta: "Prov verifieren",
    docsCta: "Les implementasjonsdocs",
    note:
      "Ingen abonnementsbackend enda. Dette apner en e-post til tsp@lexico.no, saa vi kan legge deg til manuelt til mailing-leverandor er valgt.",
    item1Title: "AI Act-transparenspress",
    item1Body:
      "Korte notater om artikkel 50, trinnvise high-risk-datoer og hva fristene betyr for runtime-evidence.",
    item2Title: "TSP-spec releases",
    item2Body:
      "Versjonerte protokollendringer, verifier-eksempler, manifestnotater og migreringsrad for implementorer.",
    item3Title: "Pilotapninger",
    item3Body:
      "Tidlige slots for team som vil wrappe en AI-workflow, publisere manifest og produsere en inspiserbar evidence-pakke.",
    subject: "Legg meg til TSP AI-kvitteringsstandard updates",
    body:
      "Hei TSP-team,%0D%0A%0D%0ALegg meg gjerne til lette updates om AI Act-transparens, TSP-spec releases, verifier-eksempler og pilotapninger.%0D%0A%0D%0ANavn:%0D%0ASelskap:%0D%0ARolle:%0D%0AHva jeg vil folge:%0D%0A",
  },
} as const;

function getCopy(locale: string) {
  return locale === "en" ? copy.en : copy.no;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getCopy(locale);
  return { title: t.title, description: t.description };
}

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getCopy(locale);
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${t.body}`;

  return (
    <>
      <section className="tsp-hero-surface border-b border-border">
        <div className="tsp-container py-12 md:py-16">
          <nav className="tsp-section-marker mb-6 flex items-center gap-2">
            <Link href="/" className="no-underline hover:text-ink">
              TSP
            </Link>
            <span className="opacity-40">·</span>
            <span className="text-ink">{t.breadcrumb}</span>
          </nav>
          <div className="tsp-section-eyebrow mb-5">
            <span className="tsp-section-num tsp-section-num--accent">
              <Newspaper className="h-4 w-4" />
            </span>
            <span className="tsp-section-label">{t.eyebrow}</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <h1 className="mb-5 max-w-4xl">{t.h1}</h1>
              <p className="max-w-3xl text-lg leading-relaxed text-ink">{t.lead}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={mailto} className="tsp-btn-primary">
                  <Mail className="h-4 w-4" />
                  {t.mailCta}
                </a>
                <Link href="/verify" className="tsp-btn-secondary">
                  {t.verifyCta}
                </Link>
                <Link href="/docs" className="tsp-btn-secondary">
                  {t.docsCta}
                </Link>
              </div>
            </div>
            <div className="border-l-2 border-accent bg-white/75 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                <ShieldCheck className="h-4 w-4 text-accent-dark" />
                Mailto only
              </div>
              <p className="text-sm leading-relaxed text-muted">{t.note}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tsp-container grid gap-4 py-12 md:grid-cols-3 md:py-16">
        {[
          [t.item1Title, t.item1Body],
          [t.item2Title, t.item2Body],
          [t.item3Title, t.item3Body],
        ].map(([title, body]) => (
          <div key={title} className="tsp-card p-5">
            <CheckCircle2 className="mb-4 h-5 w-5 text-verify" />
            <h2 className="mb-2 text-lg">{title}</h2>
            <p className="text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-border bg-paper">
        <div className="tsp-container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-bold text-ink">{CONTACT_EMAIL}</div>
            <p className="mt-1 max-w-xl text-sm text-muted">{t.note}</p>
          </div>
          <a href={mailto} className="tsp-btn-primary shrink-0">
            {t.mailCta} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}
