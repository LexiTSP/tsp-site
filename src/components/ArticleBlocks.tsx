import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, Info, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Building-blocks brukt på tvers av EU AI Act-artikkel-sider.
 * Holder innholdet konsistent uten å duplisere markup.
 */

export function RequirementBlock({
  title,
  quote,
  articleRef,
}: {
  title: string;
  quote: string;
  articleRef: string;
}) {
  return (
    <section className="not-prose">
      <div className="tsp-eyebrow text-muted mb-3">
        Lovkrav
      </div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="relative rounded-xl border-2 border-brand/20 bg-gradient-to-br from-brand/5 to-transparent p-5">
        <div className="absolute -top-3 left-4 tsp-pill border-brand/40 bg-white text-brand font-mono">
          {articleRef}
        </div>
        <blockquote className="text-ink/90 leading-relaxed italic mt-2">
          "{quote}"
        </blockquote>
      </div>
    </section>
  );
}

export function TspSolutionBlock({
  module,
  moduleHref,
  summary,
  children,
}: {
  module: string;
  moduleHref: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <section className="not-prose">
      <div className="tsp-eyebrow text-verify mb-3">
        TSP løser dette med
      </div>
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-verify/10 text-verify flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <Link
            href={moduleHref}
            className="text-2xl font-bold hover:text-brand inline-flex items-center gap-2 group"
          >
            TSP {module}
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-muted mt-1 leading-relaxed">{summary}</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function EvidenceBlock({
  label,
  field,
  code,
  lang = "typescript",
}: {
  label: string;
  field?: string;
  code: string;
  lang?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-ink/10">
      <div className="bg-ink/90 text-gray-400 text-xxxs font-mono uppercase tracking-widest px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <span>{label}</span>
        {field && (
          <span className="text-brand-light">
            <code>{field}</code>
          </span>
        )}
        <span className="text-gray-500">{lang}</span>
      </div>
      <pre className="bg-ink text-gray-100 text-xs font-mono p-4 overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

export function DeploymentExample({ children }: { children: React.ReactNode }) {
  return (
    <section className="not-prose rounded-xl border border-border bg-paper p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-nav-red/10 text-nav-red flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <div className="tsp-eyebrow text-nav-red">
            I praksis · TSP deployment
          </div>
          <div className="font-semibold text-ink mt-0.5">Hvordan en regulert deployment bruker dette</div>
        </div>
      </div>
      <div className="text-sm leading-relaxed text-ink/90 space-y-3">{children}</div>
    </section>
  );
}

export function CoverageNote({
  type,
  title,
  children,
}: {
  type: "covered" | "partial" | "not-covered";
  title: string;
  children: React.ReactNode;
}) {
  const config = {
    covered: { Icon: CheckCircle2, tone: "verify", label: "Dekket" },
    partial: { Icon: Info, tone: "brand", label: "Delvis" },
    "not-covered": { Icon: AlertTriangle, tone: "warn", label: "Ikke dekket — organisatorisk" },
  }[type];
  const Icon = config.Icon;
  const toneClass = {
    verify: "border-verify/30 bg-verify/5 text-verify",
    brand: "border-brand/30 bg-brand/5 text-brand",
    warn: "border-warn/30 bg-warn/5 text-warn",
  }[config.tone];
  return (
    <div className={cn("rounded-lg border p-4", toneClass)}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-ink">{title}</span>
            <span className="text-xxxs font-mono uppercase tracking-wider opacity-70">{config.label}</span>
          </div>
          <div className="text-sm text-ink/80 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ArticleIntro({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg text-muted leading-relaxed">{children}</p>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl font-bold text-ink mt-2 mb-3 pb-2 border-b border-border">
      {children}
    </h3>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-sm max-w-none text-ink leading-relaxed space-y-3 [&_code]:font-mono [&_code]:text-xs [&_code]:bg-ink/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_strong]:font-semibold [&_strong]:text-ink">
      {children}
    </div>
  );
}

export function ExternalRef({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand hover:underline inline-flex items-center gap-1"
    >
      {children} <ExternalLink className="w-3 h-3" />
    </a>
  );
}
