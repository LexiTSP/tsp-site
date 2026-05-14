import { Link } from "@/i18n/navigation";
import { CheckCircle2, ArrowRight, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

/**
 * Building-blocks for modul-sider. Holder 5 moduler konsistente uten å duplisere markup.
 */

export function ModuleSection({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      {eyebrow && <div className="tsp-eyebrow text-muted mb-2">{eyebrow}</div>}
      <h2 className="text-2xl font-bold text-ink mb-3">{title}</h2>
      {intro && (
        <div className="text-muted leading-relaxed mb-5 [&_code]:font-mono [&_code]:text-xs [&_code]:bg-ink/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_strong]:text-ink">
          {intro}
        </div>
      )}
      {children}
    </section>
  );
}

export function FeatureGrid({ items }: { items: Array<{ title: string; desc: string; Icon?: React.ComponentType<{ className?: string }> }> }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((f) => {
        const Icon = f.Icon ?? CheckCircle2;
        return (
          <div key={f.title} className="tsp-card p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-verify/10 text-verify flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-ink mb-1">{f.title}</div>
                <div className="text-xs text-muted leading-relaxed">{f.desc}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CodeBlock({ label, lang, code }: { label?: string; lang?: string; code: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-ink/10">
      {label && (
        <div className="bg-ink/90 text-gray-400 text-xxxs font-mono uppercase tracking-widest px-4 py-2 border-b border-white/10 flex items-center justify-between">
          <span>{label}</span>
          {lang && <span className="text-gray-500">{lang}</span>}
        </div>
      )}
      <pre className="bg-ink text-gray-100 text-xs font-mono p-4 overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

export function CoverageList({
  title,
  articles,
}: {
  title: string;
  articles: Array<{ slug: string; ref: string; text: string; coverage: "primary" | "partial" | "support" }>;
}) {
  return (
    <div className="tsp-card p-5">
      <div className="tsp-eyebrow text-muted mb-3 flex items-center gap-1.5">
        <FileCheck className="w-3.5 h-3.5" />
        {title}
      </div>
      <div className="space-y-2">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/eu-ai-act/${a.slug}`}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-brand/5 group"
          >
            <span
              className={cn(
                "tsp-pill text-xxxs font-mono shrink-0",
                a.coverage === "primary"
                  ? "border-verify/30 bg-verify/10 text-verify"
                  : a.coverage === "partial"
                  ? "border-brand/30 bg-brand/10 text-brand"
                  : "border-border bg-gray-50 text-muted",
              )}
            >
              {a.ref}
            </span>
            <span className="text-sm text-ink/90 flex-1">{a.text}</span>
            <ArrowRight className="w-3 h-3 text-muted group-hover:text-brand shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LicenseBox({
  license,
  summary,
  details,
}: {
  license: "MIT" | "Commercial" | "MIT + Commercial";
  summary: string;
  details: string[];
}) {
  const isOpen = license === "MIT";
  const isHybrid = license === "MIT + Commercial";
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        isOpen ? "border-verify/30 bg-verify/5" : isHybrid ? "border-brand/30 bg-brand/5" : "border-warn/30 bg-warn/5",
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className={cn(
            "tsp-pill font-mono text-xxxs",
            isOpen ? "border-verify/40 bg-verify/10 text-verify" : isHybrid ? "border-brand/40 bg-brand/10 text-brand" : "border-warn/40 bg-warn/10 text-warn",
          )}
        >
          {license}
        </span>
        <span className="font-semibold text-ink text-sm">{summary}</span>
      </div>
      <ul className="text-xs text-muted leading-relaxed space-y-1 list-disc list-inside ml-1">
        {details.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
    </div>
  );
}

export function IntegrationCallout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("moduleLayout");
  return (
    <section className="border border-border bg-paper p-5">
      <div className="flex items-center gap-2 tsp-eyebrow text-warn mb-2">
        <div className="w-2 h-2 rounded-full bg-warn" />
        {t("integrationCallout")}
      </div>
      <div className="text-sm text-ink/90 leading-relaxed space-y-2 [&_code]:font-mono [&_code]:text-xs [&_code]:bg-ink/5 [&_code]:px-1 [&_code]:rounded">
        {children}
      </div>
    </section>
  );
}

export function ModuleCTA({
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
}: {
  primaryText: string;
  primaryHref: string;
  secondaryText: string;
  secondaryHref: string;
}) {
  return (
    <section className="rounded-2xl bg-ink text-white p-8 text-center">
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href={primaryHref} className="tsp-btn-verify">
          {primaryText} <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href={secondaryHref} className="tsp-btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
          {secondaryText}
        </Link>
      </div>
    </section>
  );
}
