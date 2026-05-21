import { AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, FileText, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ProofPanel = {
  title: string;
  body: string;
  state: "verified" | "warning" | "broken";
};

type StepPanel = {
  time: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

type ScenarioPanel = {
  audience: string;
  before: string;
  question: string;
  withTsp: string;
};

export { ReceiptReadinessCheck } from "./ReceiptReadinessCheck";

type HeroProofConsoleCopy = {
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

const STATE_STYLE = {
  verified: {
    icon: ShieldCheck,
    border: "border-verify/45",
    bg: "bg-verify/[0.07]",
    text: "text-verify",
    rail: "bg-verify",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-warn/45",
    bg: "bg-warn/[0.07]",
    text: "text-warn",
    rail: "bg-warn",
  },
  broken: {
    icon: LockKeyhole,
    border: "border-danger/45",
    bg: "bg-danger/[0.07]",
    text: "text-danger",
    rail: "bg-danger",
  },
} as const;

export function HeroProofConsole({ copy }: { copy: HeroProofConsoleCopy }) {
  return (
    <div className="tsp-receipt-lab">
      <input className="tsp-receipt-state tsp-receipt-state--verified sr-only" id="tsp-receipt-verified" name="tsp-receipt-state" type="radio" defaultChecked />
      <input className="tsp-receipt-state tsp-receipt-state--tampered sr-only" id="tsp-receipt-tampered" name="tsp-receipt-state" type="radio" />

      <div className="tsp-receipt-shell border border-ink/15 bg-white/90 p-4 shadow-[0_24px_80px_rgba(17,24,39,0.14)] backdrop-blur md:p-5">
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent-dark">{copy.label}</div>
            <h2 className="mt-2 text-2xl leading-tight text-ink">{copy.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{copy.lead}</p>
          </div>
          <div className="tsp-verified-only shrink-0 border border-verify/45 bg-verify/[0.07] px-2.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-verify">
            {copy.verifiedBadge}
          </div>
          <div className="tsp-tampered-only shrink-0 border border-danger/45 bg-danger/[0.07] px-2.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-danger">
            {copy.tamperedBadge}
          </div>
        </div>

        <div>
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-muted">{copy.contentLabel}</span>
          <div className="min-h-[8.5rem] w-full border border-border bg-paper p-3 font-mono text-sm leading-6 text-ink">
            <p className="tsp-verified-only">{copy.original}</p>
            <p className="tsp-tampered-only">{copy.tampered}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <label
            htmlFor="tsp-receipt-tampered"
            className="tsp-receipt-choice tsp-receipt-choice--tamper inline-flex cursor-pointer items-center gap-2 border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/[0.16]"
          >
            <AlertTriangle className="h-4 w-4" />
            {copy.tamper}
          </label>
          <label
            htmlFor="tsp-receipt-verified"
            className="tsp-receipt-choice tsp-receipt-choice--restore inline-flex cursor-pointer items-center gap-2 border border-ink/20 bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent hover:bg-accent/10"
          >
            <ShieldCheck className="h-4 w-4" />
            {copy.reset}
          </label>
        </div>

        <div className="tsp-verified-only mt-4 border border-verify/45 bg-verify/[0.07] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-verify" />
            <div>
              <h3 className="text-base font-semibold text-verify">{copy.verifiedTitle}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{copy.verifiedBody}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {copy.verifiedChecks.map((check) => (
              <div key={check} className="border border-white/60 bg-white px-3 py-2 font-mono text-xs text-ink">
                {check}
              </div>
            ))}
          </div>
        </div>

        <div className="tsp-tampered-only mt-4 border border-danger/45 bg-danger/[0.07] p-4">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
            <div>
              <h3 className="text-base font-semibold text-danger">{copy.tamperedTitle}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{copy.tamperedBody}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {copy.tamperedChecks.map((check) => (
              <div key={check} className="border border-white/60 bg-white px-3 py-2 font-mono text-xs text-ink">
                {check}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-xs font-semibold leading-5 text-muted">{copy.tryLine}</p>
      </div>
    </div>
  );
}

export function InteractiveProofPanels({
  title,
  lead,
  panels,
  labels,
}: {
  title: string;
  lead: string;
  panels: ProofPanel[];
  labels: { proofLoop: string; portableReceipt: string; verified: string; warning: string; broken: string };
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
      <div>
        <div className="inline-flex items-center gap-2 border border-accent/35 bg-accent/[0.12] px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-accent-dark">
          <FileText className="h-4 w-4" />
          {labels.proofLoop}
        </div>
        <h2 className="mt-5 max-w-xl text-ink">{title}</h2>
        <p className="mt-4 max-w-xl text-muted">{lead}</p>
        <div className="mt-6 border-l-4 border-ink bg-white p-5 shadow-[0_18px_60px_rgba(17,24,39,0.08)]">
          <div className="mb-4 inline-flex items-center gap-2 border border-verify/45 bg-verify/[0.07] px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-verify">
            <ShieldCheck className="h-4 w-4" />
            {labels.portableReceipt}
          </div>
          <div className="font-mono text-sm leading-7 text-ink">
            <div>{`{`}</div>
            <div className="pl-4">"issuer": "lexitsp-public-alpha-i1",</div>
            <div className="pl-4">"manifest": "/.well-known/tsp-manifest.json",</div>
            <div className="pl-4">"verification": "local-first"</div>
            <div>{`}`}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {panels.map((panel, index) => {
          const style = STATE_STYLE[panel.state];
          const Icon = style.icon;
          const stateLabel = labels[panel.state];
          return (
            <details
              key={panel.title}
              open={index === 0}
              className={cn(
                "group w-full overflow-hidden border bg-white text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(17,24,39,0.10)] open:shadow-[0_20px_55px_rgba(17,24,39,0.11)]",
                style.border,
              )}
            >
              <summary className="grid cursor-pointer list-none grid-cols-[4px_1fr_auto] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">
                <div className={cn("transition-colors", style.rail)} />
                <div className="flex items-center gap-3 p-5">
                  <span className={cn("flex h-10 w-10 items-center justify-center border", style.border, style.bg, style.text)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className={cn("mb-1 block font-mono text-xs font-semibold uppercase tracking-[0.12em]", style.text)}>{stateLabel}</span>
                    <span className="block text-lg font-semibold text-ink">{panel.title}</span>
                  </span>
                </div>
                <ChevronDown className="m-5 h-5 w-5 text-muted transition-transform duration-300 group-open:rotate-180 group-open:text-ink" />
              </summary>
              <div className="grid grid-cols-[4px_1fr_auto] border-t border-border">
                <div className={cn("transition-colors", style.rail)} />
                <div className="px-5 py-4">
                  <p className="text-sm leading-6 text-muted">{panel.body}</p>
                </div>
                <div />
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

export function InteractiveActionSteps({ steps }: { steps: StepPanel[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <Link
          key={step.title}
          href={step.href}
          className="group flex min-h-[17rem] flex-col border border-border bg-paper p-5 text-ink no-underline shadow-[0_14px_44px_rgba(17,24,39,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-accent/60 hover:bg-white hover:shadow-[0_24px_70px_rgba(17,24,39,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-3xl font-semibold leading-none text-accent-dark">0{index + 1}</div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-muted">{step.time}</div>
            </div>
            <span className="flex h-10 w-10 items-center justify-center border border-accent/30 bg-accent/10 text-accent-dark transition-all duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
          <h3 className="mb-3 text-xl leading-tight text-ink">{step.title}</h3>
          <p className="text-sm leading-6 text-muted">{step.body}</p>
          <div className="mt-auto pt-6">
            <span className="inline-flex items-center gap-2 border-t border-border pt-3 text-sm font-semibold text-accent-dark transition-colors duration-200 group-hover:text-warn">
              {step.cta}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ScenarioSwitcher({
  scenarios,
  beforeLabel,
  withTspLabel,
  withTspTitle,
}: {
  scenarios: ScenarioPanel[];
  beforeLabel: string;
  withTspLabel: string;
  withTspTitle: string;
}) {
  const renderedScenarios = scenarios.slice(0, 4);

  return (
    <div className="tsp-scenario-switcher">
      {renderedScenarios.map((item, index) => (
        <input
          key={item.audience}
          className={`tsp-scenario-tab tsp-scenario-tab-${index} sr-only`}
          id={`tsp-scenario-${index}`}
          name="tsp-scenario"
          type="radio"
          defaultChecked={index === 0}
        />
      ))}

      <div className="tsp-scenario-grid grid gap-4">
        <div className="grid gap-2 md:grid-cols-3">
          {renderedScenarios.map((item, index) => (
            <label
              key={item.audience}
              htmlFor={`tsp-scenario-${index}`}
              className={`tsp-scenario-label tsp-scenario-label-${index} grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 border border-border bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent/[0.06]`}
            >
              <span className="flex h-10 w-10 items-center justify-center border border-border bg-paper font-mono text-sm font-semibold text-muted">
                0{index + 1}
              </span>
              <span className="font-semibold text-ink">{item.audience}</span>
            </label>
          ))}
        </div>

        <div className="overflow-hidden border border-border-strong bg-white shadow-[0_24px_80px_rgba(17,24,39,0.09)]">
          {renderedScenarios.map((scenario, index) => (
            <div key={scenario.audience} className={`tsp-scenario-panel tsp-scenario-panel-${index}`}>
              <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-1">
                  <div className="bg-white p-5 md:p-6">
                    <div className="mb-4 inline-flex items-center gap-2 border border-danger/30 bg-danger/10 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-danger">
                      <AlertTriangle className="h-4 w-4" />
                      {beforeLabel}
                    </div>
                    <h3 className="max-w-xl text-2xl leading-tight text-ink md:text-3xl">{scenario.before}</h3>
                  </div>
                  <div className="bg-danger/[0.055] p-5 md:p-6">
                    <p className="border-l-4 border-danger/50 bg-white/70 p-4 text-sm leading-6 text-muted">
                      {scenario.question}
                    </p>
                  </div>
                </div>
                <div className="bg-verify/[0.055] p-5 md:p-6">
                  <div className="mb-4 inline-flex items-center gap-2 border border-verify/30 bg-verify/10 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-verify">
                    <CheckCircle2 className="h-4 w-4" />
                    {withTspLabel}
                  </div>
                  <div className="grid gap-5 md:grid-cols-[0.65fr_1fr] md:items-start">
                    <h3 className="text-2xl leading-tight text-ink md:text-3xl">{withTspTitle}</h3>
                    <p className="border-l-4 border-verify bg-white p-4 text-sm leading-6 text-muted shadow-[0_14px_42px_rgba(17,24,39,0.06)]">
                      {scenario.withTsp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
