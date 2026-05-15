import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Building2,
  Code2,
  AlertCircle,
  LockKeyhole,
  UnlockKeyhole,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "priser" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

export default async function PriserPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("priser");

  return (
    <>
      <section className="tsp-hero-surface border-b border-border">
        <div className="tsp-container py-12 md:py-16">
          <nav className="tsp-section-marker mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-ink no-underline">TSP</Link>
            <span className="opacity-40">·</span>
            <span className="text-ink">{t("breadcrumb")}</span>
          </nav>
          <div className="tsp-section-eyebrow mb-5">
            <span className="tsp-section-num tsp-section-num--accent">{t("eyebrowChip")}</span>
            <span className="tsp-section-label">{t("eyebrowLabel")}</span>
          </div>
          <h1 className="mb-5 max-w-3xl">{t("h1")}</h1>
          <p className="text-ink text-lg leading-relaxed max-w-3xl">
            {t("leadBefore")}
            <code className="tsp-code">@lexitsp/sdk</code>
            {t("leadMid")}
            <code className="tsp-code">@lexitsp/trustbadge-react</code>
            {t("leadAfter")}
          </p>
        </div>
      </section>

      <div className="tsp-container py-12 max-w-6xl">
      <section className="mb-12 border border-border bg-paper">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b lg:border-b-0 lg:border-r border-border p-6 md:p-8">
            <div className="tsp-section-eyebrow mb-4">
              <span className="tsp-section-num tsp-section-num--verify">✓</span>
              <span className="tsp-section-label">{t("splitEyebrow")}</span>
            </div>
            <h2 className="text-2xl md:text-3xl mb-3">{t("splitTitle")}</h2>
            <p className="text-muted leading-relaxed">{t("splitLead")}</p>
          </div>
          <div className="grid sm:grid-cols-2">
            <SplitCard
              icon={<UnlockKeyhole className="w-5 h-5" />}
              tone="standard"
              title={t("splitStandardTitle")}
              body={t("splitStandardBody")}
            />
            <SplitCard
              icon={<LockKeyhole className="w-5 h-5" />}
              tone="tools"
              title={t("splitToolsTitle")}
              body={t("splitToolsBody")}
              border
            />
          </div>
        </div>
        <div className="border-t border-border px-6 md:px-8 py-4 text-sm text-ink font-medium">
          {t("splitRule")}
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-5 mb-16">
        <Tier
          name={t("tier1Name")}
          icon={<Code2 className="w-5 h-5" />}
          tagline={t("tier1Tagline")}
          price={t("tier1Price")}
          period={t("tier1Period")}
          highlight={false}
          ctaLabel={t("tier1Cta")}
          ctaHref="/docs"
          mostPopularLabel={t("mostPopular")}
          features={[
            { included: true, text: t("tier1F1") },
            { included: true, text: t("tier1F2") },
            { included: true, text: t("tier1F3") },
            { included: true, text: t("tier1F4") },
            { included: true, text: t("tier1F5") },
            { included: false, text: t("tier1F6") },
            { included: false, text: t("tier1F7") },
          ]}
        />
        <Tier
          name={t("tier2Name")}
          icon={<ShieldCheck className="w-5 h-5" />}
          tagline={t("tier2Tagline")}
          price={t("tier2Price")}
          period={t("tier2Period")}
          highlight={true}
          ctaLabel={t("tier2Cta")}
          ctaHref="/kontakt"
          mostPopularLabel={t("mostPopular")}
          features={[
            { included: true, text: t("tier2F1") },
            { included: true, text: t("tier2F2") },
            { included: true, text: t("tier2F3") },
            { included: true, text: t("tier2F4") },
            { included: true, text: t("tier2F5") },
            { included: true, text: t("tier2F6") },
            { included: false, text: t("tier2F7") },
          ]}
        />
        <Tier
          name={t("tier3Name")}
          icon={<Building2 className="w-5 h-5" />}
          tagline={t("tier3Tagline")}
          price={t("tier3Price")}
          period={t("tier3Period")}
          highlight={false}
          ctaLabel={t("tier3Cta")}
          ctaHref="/kontakt"
          mostPopularLabel={t("mostPopular")}
          features={[
            { included: true, text: t("tier3F1") },
            { included: true, text: t("tier3F2") },
            { included: true, text: t("tier3F3") },
            { included: true, text: t("tier3F4") },
            { included: true, text: t("tier3F5") },
            { included: true, text: t("tier3F6") },
            { included: true, text: t("tier3F7") },
          ]}
        />
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-3">{t("rolesTitle")}</h2>
        <p className="text-muted leading-relaxed mb-6 max-w-3xl">{t("rolesLead")}</p>
        <div className="grid md:grid-cols-3 gap-4">
          <RoleCard
            scenario={t("role1Scenario")}
            recommendation={t("role1Reco")}
            reason={t("role1Reason")}
            pickLabel={t("rolesPick")}
          />
          <RoleCard
            scenario={t("role2Scenario")}
            recommendation={t("role2Reco")}
            reason={t("role2Reason")}
            pickLabel={t("rolesPick")}
            highlight
          />
          <RoleCard
            scenario={t("role3Scenario")}
            recommendation={t("role3Reco")}
            reason={t("role3Reason")}
            pickLabel={t("rolesPick")}
          />
        </div>
      </section>

      <section className="border-l-2 border-accent bg-elevated p-6 md:p-8 mb-12">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-accent-dark shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl mb-2">{t("honestTitle")}</h2>
            <p className="text-ink leading-relaxed mb-3">{t("honestLead")}</p>
            <ul className="space-y-1.5 text-ink list-disc list-inside">
              <li>
                <strong>{t("honest1Strong")}</strong> {t("honest1")}
              </li>
              <li>
                <strong>{t("honest2Strong")}</strong> {t("honest2")}
              </li>
              <li>
                <strong>{t("honest3Strong")}</strong> {t("honest3")}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t("inclusionsTitle")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Inclusion title={t("incl1Title")} body={t("incl1Body")} />
          <Inclusion title={t("incl2Title")} body={t("incl2Body")} />
          <Inclusion title={t("incl3Title")} body={t("incl3Body")} />
          <Inclusion title={t("incl4Title")} body={t("incl4Body")} />
          <Inclusion title={t("incl5Title")} body={t("incl5Body")} />
          <Inclusion title={t("incl6Title")} body={t("incl6Body")} />
        </div>
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
              <h2 className="mb-3">{t("ctaH2")}</h2>
              <p className="text-white/75 leading-relaxed text-lg">{t("ctaLead")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/kontakt" className="tsp-btn-primary" style={{ background: "var(--color-accent)", borderColor: "var(--color-accent)", color: "#fff" }}>
                {t("ctaPrimary")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/" className="tsp-btn-secondary" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.25)" }}>
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SplitCard({
  icon,
  tone,
  title,
  body,
  border,
}: {
  icon: React.ReactNode;
  tone: "standard" | "tools";
  title: string;
  body: string;
  border?: boolean;
}) {
  return (
    <div className={"p-6 md:p-8 " + (border ? "border-t sm:border-t-0 sm:border-l border-border" : "")}>
      <div
        className={
          "w-10 h-10 rounded-lg flex items-center justify-center mb-4 " +
          (tone === "standard" ? "bg-verify/10 text-verify" : "bg-brand/10 text-brand")
        }
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function Tier({
  name,
  icon,
  tagline,
  price,
  period,
  highlight,
  ctaLabel,
  ctaHref,
  features,
  mostPopularLabel,
}: {
  name: string;
  icon: React.ReactNode;
  tagline: string;
  price: string;
  period: string;
  highlight: boolean;
  ctaLabel: string;
  ctaHref: string;
  features: Array<{ included: boolean; text: string }>;
  mostPopularLabel: string;
}) {
  return (
    <div
      className={
        "tsp-card p-6 flex flex-col " +
        (highlight ? "ring-2 ring-brand/40 border-brand/40 relative" : "")
      }
    >
      {highlight && (
        <div className="absolute -top-3 left-6 inline-block px-3 py-0.5 text-xs font-bold tracking-wide rounded-full bg-brand text-white">
          {mostPopularLabel}
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="font-bold text-lg leading-tight">{name}</div>
          <div className="text-xs text-muted">{tagline}</div>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-3xl font-bold tabular-nums">{price}</div>
        <div className="text-xs text-muted">{period}</div>
      </div>
      <ul className="space-y-2 text-sm flex-1 mb-5">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            {f.included ? (
              <Check className="w-4 h-4 shrink-0 mt-0.5 text-verify" />
            ) : (
              <X className="w-4 h-4 shrink-0 mt-0.5 text-gray-300" />
            )}
            <span className={f.included ? "text-gray-800" : "text-gray-400 line-through"}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={
          highlight
            ? "tsp-btn-primary w-full justify-center"
            : "tsp-btn-secondary w-full justify-center"
        }
      >
        {ctaLabel} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function RoleCard({
  scenario,
  recommendation,
  reason,
  highlight,
  pickLabel,
}: {
  scenario: string;
  recommendation: string;
  reason: string;
  highlight?: boolean;
  pickLabel: string;
}) {
  return (
    <div
      className={
        "border p-5 bg-surface flex flex-col " +
        (highlight ? "border-brand border-2" : "border-border")
      }
    >
      <p className="text-sm text-ink leading-relaxed mb-4 font-medium">{scenario}</p>
      <div className="border-t border-border pt-4 mt-auto">
        <div className="tsp-eyebrow text-brand mb-1">{pickLabel}</div>
        <div className="text-base font-semibold text-ink mb-2">{recommendation}</div>
        <p className="text-xs text-muted leading-relaxed">{reason}</p>
      </div>
    </div>
  );
}

function Inclusion({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-2 mb-1.5">
        <Check className="w-4 h-4 text-verify shrink-0 mt-0.5" />
        <div className="font-semibold text-sm">{title}</div>
      </div>
      <p className="text-xs text-muted leading-relaxed pl-6">{body}</p>
    </div>
  );
}
