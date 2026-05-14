import { Link } from "@/i18n/navigation";
import {
  Activity,
  AlertTriangle,
  Bell,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Scale,
  Info,
  Eye,
  FileCheck,
  Zap,
  Clock,
  Filter,
} from "lucide-react";
import { resolveRiskMetrics } from "@/lib/risk-resolver";
import type { RiskMetrics } from "@/lib/risk-analysis";

// Always render at request time — this page can bind to live ledger data
export const dynamic = "force-dynamic";

export const metadata = {
  title: "TSP Risk — live preview · TSP",
  description:
    "Hvordan TSP Risk-dashboardet ser ut i produksjon. Basert på en syntetisk envelope-strøm.",
};

/* ═══════════════════════════════════════════════════════════════
   DATA — resolved live from a TSP ledger, or mock fallback
   ═══════════════════════════════════════════════════════════════ */



/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default async function RiskPreviewPage() {
  const metrics = await resolveRiskMetrics();
  const isLive = metrics.source === "live";
  const isRiskApi = metrics.mode === "risk-api";
  return (
    <div>
      {/* Hero strip */}
      <section className="border-b bg-gradient-to-br from-ink to-gray-900 text-white">
        <div className="tsp-container py-10">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">TSP</Link>
            <span className="opacity-50">/</span>
            <Link href="/risk" className="hover:text-white">Risk</Link>
            <span className="opacity-50">/</span>
            <span className="text-white">Preview</span>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {isLive ? (
                  <div className="tsp-pill border-verify/40 bg-verify/10 text-verify">
                    <span className="tsp-live-dot" />
                    Live · {isRiskApi ? "Risk API" : "Kobling til TSP ledger"}
                  </div>
                ) : (
                  <div className="tsp-pill border-brand-light/30 bg-brand-light/10 text-brand-light">
                    <span className="tsp-live-dot" />
                    Live Preview · Mock Data
                  </div>
                )}
                <div className="tsp-pill border-white/20 bg-white/5 text-gray-300">
                  TSP Risk v1.2.0
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
                Slik ser dashboardet ditt ut i produksjon.
              </h1>
              <p className="text-gray-300 max-w-2xl leading-relaxed">
                {isLive
                  ? isRiskApi
                    ? "Dette er TSP Risk koblet til live /signals og /alerts fra Risk-serveren. Aggregater driver grafene, mens alarmstrømmen kommer fra signerte RiskEnvelope-hendelser."
                    : "Dette er TSP Risk koblet til en live TSP-ledger i sanntid. Hver metrikk nedenfor er beregnet fra faktiske envelopes signert av SDK-en. Hvis ledgeren kobles av, faller siden elegant tilbake til mock-profilen."
                  : "Dette er en mock-visning basert på en syntetisk 30-dagers envelope-strøm. Samme datastrukturer, samme metrikker, samme alert-regler som du ville fått i din egen deployment. Sett TSP_RISK_URL + TSP_RISK_TOKEN, eller TSP_LEDGER_URL, for live data."}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 p-1.5 shrink-0">
              <Filter className="w-4 h-4 text-gray-400 ml-2" />
              <span className="text-xs text-gray-400">Deployment:</span>
              <span className="text-sm font-semibold text-white pr-2">{metrics.deploymentName}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="tsp-container py-8">
        {/* Deployment meta strip */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-verify animate-pulse" />
            <span className="font-semibold text-ink">Live</span> · {metrics.connected}
          </span>
          <span>·</span>
          <span>
            <span className="font-semibold text-ink">EU AI Act:</span> {metrics.classification}
          </span>
          <span>·</span>
          <span>
            <span className="font-semibold text-ink">Modul:</span> TSP Risk
          </span>
        </div>

        {/* Stat cards */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Activity className="w-4 h-4" />}
            label="Envelopes (30 dg)"
            value={metrics.totals.envelopes.toLocaleString("no")}
            delta={metrics.totals.envelopesDelta}
            deltaDir="up"
            deltaGood
          />
          <StatCard
            icon={<CheckCircle2 className="w-4 h-4" />}
            label={isRiskApi ? "Verifiseringshelse" : "Gj.snitt konfidens"}
            value={`${metrics.totals.avgConfidence}%`}
            delta={metrics.totals.avgConfidenceDelta}
            deltaDir="up"
            deltaGood
          />
          <StatCard
            icon={<AlertTriangle className="w-4 h-4" />}
            label="Kritiske envelopes"
            value={`${metrics.totals.criticalPercent}%`}
            delta={metrics.totals.criticalDelta}
            deltaDir="down"
            deltaGood
          />
          <StatCard
            icon={<Bell className="w-4 h-4" />}
            label="Aktive alerts"
            value={metrics.totals.activeAlerts.toString()}
            sub={`${metrics.totals.resolvedAlerts} løst siste 30 dg`}
          />
        </section>

        {/* Charts row */}
        <section className="grid lg:grid-cols-2 gap-4 mb-8">
          {/* Risk distribution stacked bar chart */}
          <div className="tsp-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="tsp-eyebrow text-muted mb-1 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-brand" />
                  Risk-distribusjon · 30 dager
                </div>
                <h2 className="text-lg font-bold">Envelopes per risikonivå</h2>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xxxs font-mono">
                <LegendDot color="bg-verify" label="low" />
                <LegendDot color="bg-brand" label="medium" />
                <LegendDot color="bg-warn" label="high" />
                <LegendDot color="bg-danger" label="critical" />
              </div>
            </div>
            <RiskStackedChart series={metrics.riskTimeseries} />
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted flex justify-between">
              <span>Envelopes som overgår terskel → trigger alerting</span>
              <Link href="/eu-ai-act/article-9" className="text-brand hover:underline inline-flex items-center gap-1">
                Art. 9-mapping <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Confidence trend line chart */}
          <div className="tsp-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="tsp-eyebrow text-muted mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-verify" />
                  {isRiskApi ? "Verifiseringshelse" : "Konfidens-trend"} · 30 dager
                </div>
                <h2 className="text-lg font-bold">
                  {isRiskApi ? "Andel verified envelopes" : "Daglig gjennomsnitt"}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold tabular-nums text-verify">
                  {metrics.totals.avgConfidence}%
                </div>
                <div className="text-xxxs text-muted">30 dg rolling</div>
              </div>
            </div>
            <ConfidenceLineChart series={metrics.confTimeseries} />
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted flex justify-between">
              <span>
                {isRiskApi
                  ? "Crypto-, trust- og nettverksfeil trigger alerting"
                  : "Under 75 % terskel: alert til compliance officer"}
              </span>
              <Link href="/eu-ai-act/article-15" className="text-brand hover:underline inline-flex items-center gap-1">
                Art. 15-mapping <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Bias drift + Activity feed */}
        <section className="grid lg:grid-cols-[1fr_1.2fr] gap-4 mb-8">
          {/* Bias by domain */}
          <div className="tsp-card p-5">
            <div className="mb-4">
              <div className="tsp-eyebrow text-muted mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-warn" />
                {isRiskApi ? "Signal-drift per nøkkel" : "Bias-drift per domene"}
              </div>
              <h2 className="text-lg font-bold">
                {isRiskApi ? "Nåverdi vs. baseline" : "Nåverdi vs. 60-dg baseline"}
              </h2>
            </div>
            <div className="space-y-3">
              {metrics.biasByDomain.map((d) => (
                <BiasBar key={d.domain} data={d} />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border text-xs text-muted">
              {isRiskApi ? (
                <>Toppradene viser flagg-, refusal- og redaction-drift fra Risk API-buckets.</>
              ) : (
                <>
                  <span className="font-semibold text-ink">Medical</span> har økt 41 % vs baseline.
                  Alert aktiv.
                </>
              )}
            </div>
          </div>

          {/* Alerts feed */}
          <div className="tsp-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="tsp-eyebrow text-muted mb-1 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-brand" />
                  Alert-strøm · nylig
                </div>
                <h2 className="text-lg font-bold">Automatisk deteksjon og respons</h2>
              </div>
              <span className="tsp-pill border-brand/30 bg-brand/5 text-brand text-xxxs">
                {metrics.recentAlerts.length} siste
              </span>
            </div>
            <div className="space-y-2">
              {metrics.recentAlerts.map((a, i) => (
                <AlertRow key={i} alert={a} />
              ))}
            </div>
          </div>
        </section>

        {/* Module-to-article coverage */}
        <section className="tsp-card p-5 mb-8">
          <div className="mb-4">
            <div className="tsp-eyebrow text-muted mb-1 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-verify" />
              Compliance-snapshot
            </div>
            <h2 className="text-lg font-bold">EU AI Act-dekning i nåværende deployment</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics.complianceStatus.map((row) => (
              <ComplianceRow key={row.article} {...row} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-brand/10 to-verify/10 border border-brand/20 p-8 md:p-10 text-center">
          <Zap className="w-10 h-10 mx-auto mb-4 text-brand" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Samme dashboard — mot din egen ledger.
          </h2>
          <p className="text-muted max-w-2xl mx-auto mb-6 leading-relaxed">
            TSP Risk kobler seg til din eksisterende ledger eller Risk-server og bygger hele
            dette laget over det. Ingen datamigrering. Ingen omskriving. Begrenset ekstra infrastruktur.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/risk" className="tsp-btn-primary">
              Tilbake til Risk-modulen <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/eu-ai-act/article-9" className="tsp-btn-secondary">
              Les Art. 9-detaljer
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBCOMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function StatCard({
  icon,
  label,
  value,
  delta,
  deltaDir,
  deltaGood,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta?: string;
  deltaDir?: "up" | "down";
  deltaGood?: boolean;
  sub?: string;
}) {
  const deltaColor = deltaGood ? "text-verify" : "text-danger";
  const DeltaIcon = deltaDir === "up" ? TrendingUp : TrendingDown;
  return (
    <div className="tsp-card p-5">
      <div className="flex items-center gap-2 tsp-eyebrow text-muted mb-3">
        <span className="text-brand">{icon}</span>
        {label}
      </div>
      <div className="text-3xl font-bold text-ink tabular-nums leading-none">{value}</div>
      {delta && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${deltaColor}`}>
          <DeltaIcon className="w-3 h-3" />
          <span className="tabular-nums">{delta}</span>
          <span className="text-muted font-normal">vs. forrige 30 dg</span>
        </div>
      )}
      {sub && !delta && <div className="mt-2 text-xs text-muted">{sub}</div>}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-muted">
      <span className={`w-2 h-2 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

/* ───── SVG Charts ───── */

function RiskStackedChart({ series }: { series: RiskMetrics["riskTimeseries"] }) {
  const width = 600;
  const height = 180;
  const barGap = 2;
  const barCount = series.length;
  const barWidth = (width - (barCount - 1) * barGap) / barCount;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((y) => (
        <line
          key={y}
          x1={0}
          y1={height - (y / 100) * height}
          x2={width}
          y2={height - (y / 100) * height}
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border"
          strokeDasharray="3 3"
        />
      ))}
      {series.map((d, i) => {
        const x = i * (barWidth + barGap);
        let cumulative = 0;
        const layers = [
          { val: d.low, color: "#10B981" },       // verify
          { val: d.medium, color: "#6366F1" },    // brand
          { val: d.high, color: "#F59E0B" },      // warn
          { val: d.critical, color: "#EF4444" },  // danger
        ];
        return (
          <g key={i}>
            {layers.map((layer, li) => {
              const h = (layer.val / 100) * height;
              const y = height - h - cumulative;
              cumulative += h;
              return (
                <rect
                  key={li}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  fill={layer.color}
                  opacity={0.85}
                />
              );
            })}
          </g>
        );
      })}
      {/* X-axis labels */}
      <text x={0} y={height - 2} fontSize="8" fill="#94A3B8" fontFamily="monospace">
        dag 1
      </text>
      <text x={width - 30} y={height - 2} fontSize="8" fill="#94A3B8" fontFamily="monospace">
        i dag
      </text>
    </svg>
  );
}

function ConfidenceLineChart({ series }: { series: RiskMetrics["confTimeseries"] }) {
  const width = 600;
  const height = 180;
  const values = series.map((d) => d.value).filter(Number.isFinite);
  const minValue = values.length ? Math.min(...values) : 80;
  const maxValue = values.length ? Math.max(...values) : 95;
  const min = Math.min(80, Math.floor(minValue / 5) * 5);
  const max = Math.max(95, Math.ceil(maxValue / 5) * 5);
  const range = max - min;
  const step = width / (series.length - 1);

  const points = series.map(
    (d, i) => `${i * step},${height - ((d.value - min) / range) * height}`
  );
  const pathD = `M ${points.join(" L ")}`;
  const areaD = `M 0,${height} L ${points.join(" L ")} L ${width},${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* Grid */}
      {[80, 85, 90, 95].map((v) => {
        const y = height - ((v - min) / range) * height;
        return (
          <g key={v}>
            <line
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border"
              strokeDasharray="3 3"
            />
            <text x={4} y={y - 3} fontSize="8" fill="#94A3B8" fontFamily="monospace">
              {v}%
            </text>
          </g>
        );
      })}
      {/* 75% threshold line (out of range but illustrative) */}
      <line
        x1={0}
        y1={height}
        x2={width}
        y2={height}
        stroke="#EF4444"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.5"
      />
      {/* Area */}
      <path d={areaD} fill="#10B981" fillOpacity="0.12" />
      {/* Line */}
      <path d={pathD} fill="none" stroke="#10B981" strokeWidth="2" strokeLinejoin="round" />
      {/* Points */}
      {series.map((d, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={height - ((d.value - min) / range) * height}
          r={2}
          fill="#10B981"
        />
      ))}
    </svg>
  );
}

function BiasBar({
  data,
}: {
  data: { domain: string; current: number; baseline: number; trend: string };
}) {
  const maxScale = 0.08;
  const currentPct = (data.current / maxScale) * 100;
  const baselinePct = (data.baseline / maxScale) * 100;
  const delta = data.current - data.baseline;
  const deltaPct = ((delta / data.baseline) * 100).toFixed(0);

  const trendColor =
    data.trend === "rising"
      ? "text-danger"
      : data.trend === "improving"
      ? "text-verify"
      : "text-muted";

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1 text-xs">
        <span className="font-semibold capitalize text-ink">{data.domain}</span>
        <span className="flex items-center gap-2 font-mono tabular-nums">
          <span className="text-ink">{data.current.toFixed(3)}</span>
          <span className={trendColor}>
            {delta >= 0 ? "+" : ""}
            {deltaPct}%
          </span>
        </span>
      </div>
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute top-0 bottom-0 left-0 bg-brand/30"
          style={{ width: `${baselinePct}%` }}
        />
        <div
          className={`absolute top-0 bottom-0 left-0 rounded-full ${
            data.trend === "rising" ? "bg-danger" : data.trend === "improving" ? "bg-verify" : "bg-brand"
          }`}
          style={{ width: `${currentPct}%` }}
        />
      </div>
    </div>
  );
}

function AlertRow({
  alert,
}: {
  alert: {
    severity: "high" | "medium" | "low" | "resolved";
    time: string;
    title: string;
    detail: string;
    status: string;
  };
}) {
  const severityConfig = {
    high: {
      Icon: AlertTriangle,
      color: "text-danger",
      bg: "bg-danger/5",
      border: "border-danger/20",
      label: "HIGH",
    },
    medium: {
      Icon: AlertTriangle,
      color: "text-warn",
      bg: "bg-warn/5",
      border: "border-warn/20",
      label: "MED",
    },
    low: {
      Icon: Info,
      color: "text-brand",
      bg: "bg-brand/5",
      border: "border-brand/20",
      label: "LOW",
    },
    resolved: {
      Icon: CheckCircle2,
      color: "text-verify",
      bg: "bg-verify/5",
      border: "border-verify/20",
      label: "LØST",
    },
  }[alert.severity];
  const Icon = severityConfig.Icon;

  return (
    <div className={`rounded-lg border ${severityConfig.border} ${severityConfig.bg} p-3`}>
      <div className="flex items-start gap-2.5">
        <div className={`shrink-0 mt-0.5 ${severityConfig.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className={`tsp-pill text-xxxs font-mono ${severityConfig.border} ${severityConfig.color}`}>
              {severityConfig.label}
            </span>
            <span className="font-semibold text-sm text-ink">{alert.title}</span>
            <span className="text-xxxs text-muted flex items-center gap-1 ml-auto">
              <Clock className="w-2.5 h-2.5" />
              {alert.time}
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">{alert.detail}</p>
        </div>
      </div>
    </div>
  );
}

function ComplianceRow({
  article,
  name,
  status,
  note,
}: {
  article: string;
  name: string;
  status: "active" | "pending" | "inactive";
  note: string;
}) {
  const statusConfig = {
    active: { Icon: CheckCircle2, color: "text-verify", bg: "bg-verify/5", border: "border-verify/30" },
    pending: { Icon: Clock, color: "text-warn", bg: "bg-warn/5", border: "border-warn/30" },
    inactive: { Icon: Info, color: "text-muted", bg: "bg-gray-50", border: "border-border" },
  }[status];
  const Icon = statusConfig.Icon;
  return (
    <div className={`rounded-lg border ${statusConfig.border} ${statusConfig.bg} p-3 flex items-start gap-2.5`}>
      <div className={`shrink-0 mt-0.5 ${statusConfig.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs font-mono font-semibold text-ink">{article}</span>
          <span className="text-xs font-semibold text-ink">{name}</span>
        </div>
        <p className="text-xxs text-muted leading-relaxed">{note}</p>
      </div>
    </div>
  );
}
