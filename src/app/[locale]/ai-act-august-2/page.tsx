import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Code2,
  Download,
  FileCheck2,
  Landmark,
  ReceiptText,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { CliffCountdown } from "@/components/CliffCountdown";

const CAMPAIGN = "ai_act_august_2_2026";

const ctaHref = (href: string, cta: string) =>
  `${href}?utm_campaign=${CAMPAIGN}&utm_source=campaign_page&utm_medium=${cta}`;

const facts = [
  { icon: CalendarClock, title: "fact1Title", body: "fact1Body" },
  { icon: FileCheck2, title: "fact2Title", body: "fact2Body" },
  { icon: Scale, title: "fact3Title", body: "fact3Body" },
] as const;

const proofItems = [
  "proof1",
  "proof2",
  "proof3",
  "proof4",
  "proof5",
] as const;

const articleRows = [
  { art: "row1Article", requires: "row1Requires", answer: "row1Tsp" },
  { art: "row2Article", requires: "row2Requires", answer: "row2Tsp" },
  { art: "row3Article", requires: "row3Requires", answer: "row3Tsp" },
  { art: "row4Article", requires: "row4Requires", answer: "row4Tsp" },
  { art: "row5Article", requires: "row5Requires", answer: "row5Tsp" },
  { art: "row6Article", requires: "row6Requires", answer: "row6Tsp" },
] as const;

const checklistItems = [
  "checklist1",
  "checklist2",
  "checklist3",
  "checklist4",
  "checklist5",
] as const;

const weeks = [
  { label: "week1Label", title: "week1Title", body: "week1Body" },
  { label: "week2Label", title: "week2Title", body: "week2Body" },
  { label: "week3Label", title: "week3Title", body: "week3Body" },
  { label: "week4Label", title: "week4Title", body: "week4Body" },
] as const;

const guardrails = ["guardrail1", "guardrail2", "guardrail3", "guardrail4"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "campaignAugust2" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

export default async function AiActAugust2Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("campaignAugust2");
  const homeT = await getTranslations("home");

  return (
    <>
      <section className="tsp-hero-surface border-b border-border">
        <div className="tsp-container py-12 md:py-16">
          <nav className="tsp-section-marker mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-ink no-underline">
              TSP
            </Link>
            <span className="opacity-40">·</span>
            <span className="text-ink">{t("breadcrumb")}</span>
          </nav>
          <div className="tsp-section-eyebrow mb-5">
            <span className="tsp-section-num tsp-section-num--accent">{t("eyebrowChip")}</span>
            <span className="tsp-section-label">{t("eyebrowLabel")}</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="mb-3 font-mono text-sm font-semibold uppercase tracking-[0.16em] text-accent-dark">
                {t("deadline")}
              </p>
              <h1 className="mb-5 max-w-4xl">{t("h1")}</h1>
              <p className="max-w-3xl text-lg leading-relaxed text-ink">
                {t("lead")}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={ctaHref("/playground", "run_demo")}
                  data-cta="run_demo"
                  className="tsp-btn-primary"
                >
                  {t("ctaDemo")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={ctaHref("/docs", "install_sdk")}
                  data-cta="install_sdk"
                  className="tsp-btn-secondary"
                >
                  {t("ctaSdk")}
                </Link>
                <Link
                  href={ctaHref("/kontakt", "request_pilot")}
                  data-cta="request_pilot"
                  className="tsp-btn-secondary"
                >
                  {t("ctaPilot")}
                </Link>
              </div>
            </div>
            <div className="border-l-2 border-accent bg-white/75 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                <AlertTriangle className="h-4 w-4 text-accent-dark" />
                {t("urgencyTitle")}
              </div>
              <p className="text-sm leading-relaxed text-muted">{t("urgencyBody")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="tsp-container grid gap-4 py-8 md:grid-cols-3">
          {facts.map((fact) => {
            const Icon = fact.icon;
            return (
              <div key={fact.title} className="tsp-card p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mb-2 text-base font-bold text-ink">{t(fact.title)}</h2>
                <p className="text-sm leading-relaxed text-muted">{t(fact.body)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-b border-border bg-paper">
        <div className="tsp-container grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <div className="tsp-section-eyebrow mb-4">
              <span className="tsp-section-num tsp-section-num--warn">01</span>
              <span className="tsp-section-label">{homeT("cliff.eyebrow")}</span>
            </div>
            <h2 className="mb-4 max-w-3xl">{homeT("cliff.h2")}</h2>
            <p className="mb-6 max-w-2xl text-muted leading-relaxed">{homeT("cliff.lead")}</p>
            <div className="grid gap-px border border-border-strong bg-border-strong sm:grid-cols-2">
              <EvidenceMetric
                value={homeT("cliff.penaltyTopNum")}
                label={homeT("cliff.penaltyTopLabel")}
              />
              <EvidenceMetric
                value={homeT("cliff.penaltyMainNum")}
                label={homeT("cliff.penaltyMainLabel")}
              />
            </div>
          </div>
          <div className="self-start border-l-2 border-warn bg-white p-5 shadow-sm">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-muted">
              {homeT("cliff.countdownLabel")}
            </div>
            <CliffCountdown
              labelDays={homeT("cliff.labelDays")}
              labelHours={homeT("cliff.labelHours")}
              labelMinutes={homeT("cliff.labelMinutes")}
              labelSeconds={homeT("cliff.labelSeconds")}
            />
            <div className="mt-6 border-t border-border pt-5">
              <div className="mb-2 flex items-center gap-2 font-bold text-ink">
                <AlertTriangle className="h-4 w-4 text-warn" />
                {homeT("cliff.calloutTitle")}
              </div>
              <p className="mb-3 text-sm leading-relaxed text-muted">{homeT("cliff.calloutBody")}</p>
              <p className="text-sm font-semibold text-ink">{homeT("cliff.calloutEmphasis")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tsp-container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div>
            <div className="tsp-section-eyebrow mb-4">
              <span className="tsp-section-num tsp-section-num--accent">02</span>
              <span className="tsp-section-label">{t("problemEyebrow")}</span>
            </div>
            <h2 className="mb-4 max-w-xl">{t("problemTitle")}</h2>
            <p className="text-muted leading-relaxed">{t("problemBody")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TrackCard
              icon={<Code2 className="h-5 w-5" />}
              eyebrow={t("commercialEyebrow")}
              title={t("commercialTitle")}
              body={t("commercialBody")}
              cta={t("commercialCta")}
              href={ctaHref("/playground", "run_demo")}
              ctaName="run_demo"
            />
            <TrackCard
              icon={<Landmark className="h-5 w-5" />}
              eyebrow={t("policyEyebrow")}
              title={t("policyTitle")}
              body={t("policyBody")}
              cta={t("policyCta")}
              href="#policy-assets"
              ctaName="download_policy_memo"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="tsp-container py-12 md:py-16">
          <div className="tsp-section-eyebrow mb-4">
            <span className="tsp-section-num tsp-section-num--accent">03</span>
            <span className="tsp-section-label">{homeT("articleMap.eyebrow")}</span>
          </div>
          <div className="mb-8 max-w-3xl">
            <h2 className="mb-4">{homeT("articleMap.h2")}</h2>
            <p className="text-muted leading-relaxed">{homeT("articleMap.lead")}</p>
          </div>
          <div className="border border-border-strong">
            <div className="hidden grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)] gap-px bg-border-strong text-xs font-bold uppercase tracking-[0.12em] text-muted md:grid">
              <div className="bg-surface p-4">{homeT("articleMap.colArticle")}</div>
              <div className="bg-surface p-4">{homeT("articleMap.colRequires")}</div>
              <div className="bg-surface p-4">{homeT("articleMap.colTspAnswer")}</div>
            </div>
            <div className="divide-y divide-border">
              {articleRows.map((row) => (
                <ArticleMapRow
                  key={row.art}
                  article={homeT(`articleMap.${row.art}`)}
                  requires={homeT(`articleMap.${row.requires}`)}
                  answer={homeT(`articleMap.${row.answer}`)}
                />
              ))}
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
            {homeT("articleMap.footer")}
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-paper">
        <div className="tsp-container grid gap-6 py-12 md:grid-cols-2 md:py-16">
          <div className="border-l-2 border-brand bg-white p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand">
              <ReceiptText className="h-4 w-4" />
              {homeT("trustFlip.eyebrow")}
            </div>
            <h2 className="mb-3 text-2xl">{homeT("trustFlip.h2")}</h2>
            <p className="text-sm leading-relaxed text-muted">{homeT("trustFlip.lead")}</p>
          </div>
          <div className="border-l-2 border-warn bg-white p-6">
            <div className="mb-3 text-sm font-semibold text-warn">{homeT("noArgument.eyebrow")}</div>
            <h2 className="mb-3 text-2xl">{homeT("noArgument.h2")}</h2>
            <p className="text-sm leading-relaxed text-muted">{homeT("noArgument.lead")}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-elevated">
        <div className="tsp-container grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="tsp-section-eyebrow mb-4">
              <span className="tsp-section-num tsp-section-num--accent">04</span>
              <span className="tsp-section-label">{t("proofEyebrow")}</span>
            </div>
            <h2 className="mb-5 max-w-3xl">{t("proofTitle")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {proofItems.map((item) => (
                <div key={item} className="flex gap-3 rounded-md border border-border bg-white p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-verify" />
                  <p className="text-sm leading-relaxed text-ink">{t(item)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="self-start border border-brand/25 bg-brand/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-brand">
              <ShieldCheck className="h-4 w-4" />
              {t("freeTitle")}
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted">{t("freeBody")}</p>
            <Link
              href={ctaHref("/priser", "install_sdk")}
              data-cta="install_sdk"
              className="text-sm font-semibold text-brand hover:underline"
            >
              {t("freeCta")} <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="tsp-container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="tsp-section-eyebrow mb-4">
              <span className="tsp-section-num tsp-section-num--verify">05</span>
              <span className="tsp-section-label">{t("checklistEyebrow")}</span>
            </div>
            <h2 className="mb-4 max-w-3xl">{t("checklistTitle")}</h2>
            <p className="mb-6 max-w-2xl text-muted leading-relaxed">{t("checklistLead")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {checklistItems.map((item, index) => (
                <div key={item} className="flex gap-3 border border-border bg-white p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-verify/10 font-mono text-xs font-bold text-verify">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink">{t(item)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="self-start border-l-2 border-brand bg-brand/[0.04] p-5">
            <div className="mb-3 text-sm font-bold text-brand">{t("procurementTitle")}</div>
            <p className="text-sm leading-relaxed text-muted">{t("procurementBody")}</p>
          </div>
        </div>
      </section>

      <section className="tsp-container py-12 md:py-16">
        <div className="tsp-section-eyebrow mb-4">
          <span className="tsp-section-num tsp-section-num--accent">06</span>
          <span className="tsp-section-label">{t("planEyebrow")}</span>
        </div>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-3 max-w-3xl">{t("planTitle")}</h2>
            <p className="max-w-2xl text-muted">{t("planLead")}</p>
          </div>
          <Link
            href={ctaHref("/kontakt", "request_pilot")}
            data-cta="request_pilot"
            className="tsp-btn-secondary shrink-0"
          >
            {t("planCta")}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {weeks.map((week) => (
            <div key={week.label} className="border-t-2 border-brand bg-white pt-4">
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-brand">
                {t(week.label)}
              </div>
              <h3 className="mb-2 text-base font-bold text-ink">{t(week.title)}</h3>
              <p className="text-sm leading-relaxed text-muted">{t(week.body)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="policy-assets" className="border-y border-border bg-white">
        <div className="tsp-container grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="tsp-section-eyebrow mb-4">
              <span className="tsp-section-num tsp-section-num--accent">07</span>
              <span className="tsp-section-label">{t("assetsEyebrow")}</span>
            </div>
            <h2 className="mb-4 max-w-3xl">{t("assetsTitle")}</h2>
            <p className="max-w-2xl text-muted leading-relaxed">{t("assetsLead")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/campaign/tsp-ai-act-august-2-policy-memo.docx"
                download
                data-cta="download_policy_memo"
                className="tsp-btn-primary"
              >
                <Download className="h-4 w-4" />
                {t("downloadMemo")}
              </a>
              <a
                href="/campaign/tsp-ai-act-august-2-policy-deck.pptx"
                download
                data-cta="download_policy_memo"
                className="tsp-btn-secondary"
              >
                <Download className="h-4 w-4" />
                {t("downloadDeck")}
              </a>
            </div>
          </div>
          <div className="border-l-2 border-warn bg-warn/[0.04] p-5">
            <div className="mb-3 text-sm font-bold text-ink">{t("guardrailTitle")}</div>
            <ul className="space-y-2">
              {guardrails.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="tsp-inverse border-t border-border-strong">
        <div className="tsp-container py-14 md:py-18">
          <div className="tsp-section-eyebrow mb-5">
            <span className="tsp-section-num tsp-section-num--accent">→</span>
            <span className="tsp-section-label">{t("finalEyebrow")}</span>
          </div>
          <h2 className="mb-4 max-w-3xl">{t("finalTitle")}</h2>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/75">{t("finalLead")}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={ctaHref("/playground", "run_demo")}
              data-cta="run_demo"
              className="tsp-btn-primary"
              style={{ background: "var(--color-accent)", borderColor: "var(--color-accent)", color: "#fff" }}
            >
              {t("finalDemo")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ctaHref("/kontakt", "request_pilot")}
              data-cta="request_pilot"
              className="tsp-btn-secondary"
              style={{ background: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}
            >
              {t("finalPilot")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function EvidenceMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white p-5">
      <div className="mb-2 font-mono text-3xl font-semibold leading-none text-ink">{value}</div>
      <p className="text-xs leading-relaxed text-muted">{label}</p>
    </div>
  );
}

function ArticleMapRow({
  article,
  requires,
  answer,
}: {
  article: string;
  requires: string;
  answer: string;
}) {
  return (
    <div className="grid gap-px bg-border-strong md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="bg-white p-4 font-mono text-sm font-bold text-brand">{article}</div>
      <div className="bg-white p-4 text-sm leading-relaxed text-muted">{requires}</div>
      <div className="bg-white p-4 text-sm leading-relaxed text-ink">{answer}</div>
    </div>
  );
}

function TrackCard({
  icon,
  eyebrow,
  title,
  body,
  cta,
  href,
  ctaName,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  ctaName: string;
}) {
  return (
    <div className="tsp-card p-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand">
        {icon}
        {eyebrow}
      </div>
      <h3 className="mb-3 text-xl font-bold text-ink">{title}</h3>
      <p className="mb-5 text-sm leading-relaxed text-muted">{body}</p>
      {href.startsWith("#") ? (
        <a href={href} data-cta={ctaName} className="text-sm font-semibold text-brand hover:underline">
          {cta} <ArrowRight className="inline h-3.5 w-3.5" />
        </a>
      ) : (
        <Link href={href} data-cta={ctaName} className="text-sm font-semibold text-brand hover:underline">
          {cta} <ArrowRight className="inline h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
