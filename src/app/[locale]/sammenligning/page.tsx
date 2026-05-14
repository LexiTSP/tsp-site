import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Check,
  X,
  Minus,
  ArrowRight,
  ShieldCheck,
  Scale,
  Lightbulb,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sammenligning" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

type Cell = "yes" | "no" | "partial" | string;

interface Row {
  feature: string;
  tsp: Cell;
  diy: Cell;
  governance: Cell;
  consultancy: Cell;
  note?: string;
}

// Row-tekstene flyttes til translations; cell-statusene (yes/no/partial)
// er strukturelle data som ikke skal oversettes.
type RowSpec = {
  featureKey: string;
  tsp: Cell;
  diy: Cell;
  governance: Cell;
  consultancy: Cell;
  noteKey?: string;
};

const ROW_SPECS: RowSpec[] = [
  { featureKey: "rowSign", tsp: "yes", diy: "no", governance: "partial", consultancy: "no", noteKey: "rowSignNote" },
  { featureKey: "rowChain", tsp: "yes", diy: "no", governance: "partial", consultancy: "no" },
  { featureKey: "rowArt12", tsp: "yes", diy: "no", governance: "partial", consultancy: "yes" },
  { featureKey: "rowArt14", tsp: "yes", diy: "partial", governance: "partial", consultancy: "no" },
  { featureKey: "rowVerify", tsp: "yes", diy: "partial", governance: "no", consultancy: "no" },
  { featureKey: "rowEu", tsp: "yes", diy: "partial", governance: "no", consultancy: "yes" },
  { featureKey: "rowSpec", tsp: "yes", diy: "yes", governance: "no", consultancy: "no" },
  { featureKey: "rowAssessment", tsp: "no", diy: "no", governance: "no", consultancy: "yes", noteKey: "rowAssessmentNote" },
];

export default async function SammenligningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sammenligning");

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
          <p className="text-ink text-lg leading-relaxed max-w-3xl">{t("lead")}</p>
        </div>
      </section>

      <div className="tsp-container py-12 max-w-6xl">

      {/* Table */}
      <div className="overflow-x-auto -mx-4 px-4 mb-12">
        <table className="w-full text-sm border-collapse min-w-[720px]">
          <thead>
            <tr>
              <th className="text-left py-3 px-3 font-semibold text-muted text-xs uppercase tracking-wider w-[35%]">
                {t("thFunction")}
              </th>
              <th className="py-3 px-3 font-semibold border-x-2 border-brand/30 bg-brand/5">
                <div className="text-brand">{t("thTsp")}</div>
                <div className="text-[10px] text-muted font-normal">{t("thTspSub")}</div>
              </th>
              <th className="py-3 px-3 font-semibold">
                <div className="text-ink">{t("thDiy")}</div>
                <div className="text-[10px] text-muted font-normal">{t("thDiySub")}</div>
              </th>
              <th className="py-3 px-3 font-semibold">
                <div className="text-ink">{t("thGov")}</div>
                <div className="text-[10px] text-muted font-normal">{t("thGovSub")}</div>
              </th>
              <th className="py-3 px-3 font-semibold">
                <div className="text-ink">{t("thCons")}</div>
                <div className="text-[10px] text-muted font-normal">{t("thConsSub")}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROW_SPECS.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-gray-50/40" : ""}>
                <td className="py-3 px-3 align-top">
                  <div className="font-medium text-ink">{t(row.featureKey)}</div>
                  {row.noteKey && (
                    <div className="text-xs text-muted mt-1 leading-relaxed">
                      {t(row.noteKey)}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-center align-top border-x-2 border-brand/30 bg-brand/5">
                  <CellMark v={row.tsp} highlight />
                </td>
                <td className="py-3 px-3 text-center align-top">
                  <CellMark v={row.diy} />
                </td>
                <td className="py-3 px-3 text-center align-top">
                  <CellMark v={row.governance} />
                </td>
                <td className="py-3 px-3 text-center align-top">
                  <CellMark v={row.consultancy} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mb-12 grid md:grid-cols-3 gap-4">
        <Take icon={<ShieldCheck className="w-5 h-5" />} title={t("takeChooseTsp")} body={t("takeChooseTspBody")} tone="brand" />
        <Take icon={<Lightbulb className="w-5 h-5" />} title={t("takeChooseDiy")} body={t("takeChooseDiyBody")} tone="amber" />
        <Take icon={<Scale className="w-5 h-5" />} title={t("takeChooseConsultant")} body={t("takeChooseConsultantBody")} tone="muted" />
      </section>

      </div>

      <section className="tsp-inverse border-y border-border-strong">
        <div className="tsp-container py-14 md:py-18 relative">
          <div className="tsp-section-eyebrow mb-5">
            <span className="tsp-section-num tsp-section-num--accent">REC</span>
            <span className="tsp-section-label">{t("recoEyebrow")}</span>
          </div>
          <h2 className="mb-5 max-w-3xl">{t("recoH2")}</h2>
          <p className="text-white/75 leading-relaxed mb-4 max-w-3xl text-lg">
            {t.rich("recoP1", { em: (c) => <em>{c}</em> })}
          </p>
          <p className="text-white/75 leading-relaxed max-w-3xl">{t("recoP2")}</p>
        </div>
      </section>

      <div className="tsp-container py-12 max-w-6xl">

      <div className="flex flex-wrap gap-3">
        <Link href="/kontakt" className="tsp-btn-primary">
          {t("ctaPrimary")} <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/spec" className="tsp-btn-secondary">{t("ctaSecondary1")}</Link>
        <Link href="/" className="tsp-btn-secondary">{t("ctaSecondary2")}</Link>
      </div>
    </div>
    </>
  );
}

function CellMark({ v, highlight }: { v: Cell; highlight?: boolean }) {
  if (v === "yes")
    return (
      <Check
        className={
          "w-5 h-5 mx-auto " + (highlight ? "text-brand" : "text-verify")
        }
      />
    );
  if (v === "no") return <X className="w-5 h-5 mx-auto text-gray-300" />;
  if (v === "partial")
    return <Minus className="w-5 h-5 mx-auto text-amber-500" />;
  return <span className="text-xs text-muted">{v}</span>;
}

function Take({
  icon,
  title,
  body,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: "brand" | "amber" | "muted";
}) {
  const styles = {
    brand: "border-brand/30 bg-brand/5",
    amber: "border-amber-200 bg-amber-50/50",
    muted: "border-gray-200 bg-gray-50",
  }[tone];
  const iconStyles = {
    brand: "bg-brand/10 text-brand",
    amber: "bg-amber-100 text-amber-700",
    muted: "bg-gray-200 text-gray-700",
  }[tone];

  return (
    <div className={`rounded-xl border-2 p-5 ${styles}`}>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconStyles}`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-base mb-1.5 text-ink">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
    </div>
  );
}
