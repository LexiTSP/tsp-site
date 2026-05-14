/**
 * Risk metrics resolver.
 *
 * Preferred live path: fetches aggregate buckets and signed alarms from the
 * commercial Risk server read APIs. Legacy ledger mode is still supported for
 * older demos. If neither is configured, the public preview uses mock metrics.
 */

import type { TrustEnvelope } from "@lexitsp/sdk";
import { analyzeEnvelopes, type RiskMetrics } from "./risk-analysis";
import { MOCK_METRICS } from "./risk-mock";

const TSP_RISK_URL = process.env.TSP_RISK_URL;
const TSP_RISK_TOKEN = process.env.TSP_RISK_TOKEN;
const TSP_RISK_MODEL_ID = process.env.TSP_RISK_MODEL_ID;
const TSP_LEDGER_URL = process.env.TSP_LEDGER_URL;

interface RiskSignalBucket {
  signal: string;
  modelId: string;
  day: string;
  data: Record<string, number>;
}

interface RiskEnvelopeSummary {
  ledgerId: string;
  alarm: {
    signal: string;
    modelId: string;
    triggeredAt: string;
    baseline: { window: string; mean: number; stddev: number };
    observed: { value: number; sampleCount: number };
    sigma: number;
  };
  drivers: {
    envelopeCount: number;
  };
}

export async function resolveRiskMetrics(): Promise<RiskMetrics> {
  try {
    if (TSP_RISK_URL && TSP_RISK_TOKEN) {
      return await resolveRiskApiMetrics(TSP_RISK_URL, TSP_RISK_TOKEN);
    }

    if (TSP_LEDGER_URL) {
      const res = await fetch(`${TSP_LEDGER_URL}/api/ledger`, {
        next: { revalidate: 30 },
        signal: AbortSignal.timeout(2000),
      });
      if (!res.ok) return MOCK_METRICS;
      const data = await res.json();
      const envelopes = data.envelopes as TrustEnvelope[] | undefined;
      if (!Array.isArray(envelopes) || envelopes.length === 0) return MOCK_METRICS;
      return analyzeEnvelopes(envelopes);
    }

    return MOCK_METRICS;
  } catch {
    return MOCK_METRICS;
  }
}

async function resolveRiskApiMetrics(baseUrl: string, token: string): Promise<RiskMetrics> {
  const now = new Date();
  const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    from: from.toISOString().slice(0, 10),
    to: now.toISOString().slice(0, 10),
  });
  if (TSP_RISK_MODEL_ID) params.set("modelId", TSP_RISK_MODEL_ID);

  const [signalsRes, alertsRes] = await Promise.all([
    riskFetch(baseUrl, `/signals?${params}`, token),
    riskFetch(
      baseUrl,
      `/alerts?since=${encodeURIComponent(from.toISOString())}&until=${encodeURIComponent(now.toISOString())}`,
      token,
    ),
  ]);

  if (!signalsRes.ok || !alertsRes.ok) return MOCK_METRICS;

  const signals = (await signalsRes.json()) as { buckets?: RiskSignalBucket[] };
  const alerts = (await alertsRes.json()) as { alerts?: RiskEnvelopeSummary[]; count?: number };
  const buckets = Array.isArray(signals.buckets) ? signals.buckets : [];
  const alertRows = Array.isArray(alerts.alerts) ? alerts.alerts : [];

  if (buckets.length === 0 && alertRows.length === 0) return MOCK_METRICS;

  return mapRiskApiMetrics(buckets, alertRows, baseUrl);
}

function riskFetch(baseUrl: string, path: string, token: string): Promise<Response> {
  const root = baseUrl.replace(/\/$/, "");
  const prefix = root.endsWith("/risk") ? "" : "/risk";
  return fetch(`${root}${prefix}${path}`, {
    headers: { authorization: `Bearer ${token}` },
    next: { revalidate: 30 },
    signal: AbortSignal.timeout(3000),
  });
}

function mapRiskApiMetrics(
  buckets: RiskSignalBucket[],
  alerts: RiskEnvelopeSummary[],
  baseUrl: string,
): RiskMetrics {
  const verifyByDay = bucketsBySignal(buckets, "verifyOutcomeDist");
  const flagsByDay = bucketsBySignal(buckets, "flagsDist");
  const refusalByDay = bucketsBySignal(buckets, "refusalRate");
  const redactionByDay = bucketsBySignal(buckets, "redactionRate");

  const days = lastDays(30);
  const riskTimeseries = days.map((day, index) => {
    const data = sumBuckets(verifyByDay.get(day));
    const total = sumValues(data) || 1;
    const verified = data.verified ?? 0;
    const critical = (data["crypto-failed"] ?? 0) + (data["trust-failed"] ?? 0);
    const high = (data["network-failed"] ?? 0) + (data.replay ?? 0);
    const low = (verified / total) * 100;
    const criticalPct = (critical / total) * 100;
    const highPct = (high / total) * 100;
    const medium = Math.max(0, 100 - low - criticalPct - highPct);
    return {
      day: index + 1,
      critical: pct(criticalPct),
      high: pct(highPct),
      medium: pct(medium),
      low: pct(low),
    };
  });

  const confTimeseries = days.map((day, index) => {
    const data = sumBuckets(verifyByDay.get(day));
    const total = sumValues(data);
    const verified = data.verified ?? 0;
    return {
      day: index + 1,
      value: total ? pct((verified / total) * 100) : 0,
    };
  });

  const totals = days.reduce(
    (acc, day) => {
      const data = sumBuckets(verifyByDay.get(day));
      acc.envelopes += sumValues(data);
      acc.verified += data.verified ?? 0;
      acc.critical += (data["crypto-failed"] ?? 0) + (data["trust-failed"] ?? 0);
      return acc;
    },
    { envelopes: 0, verified: 0, critical: 0 },
  );

  const operationalHealth = totals.envelopes
    ? pct((totals.verified / totals.envelopes) * 100)
    : pct(avg(confTimeseries.map((d) => d.value)));
  const criticalPercent = totals.envelopes ? pct((totals.critical / totals.envelopes) * 100) : 0;

  return {
    source: "live",
    mode: "risk-api",
    deploymentName: hostLabel(baseUrl),
    classification: "Annex III · Risk API",
    connected: `Risk server · ${hostLabel(baseUrl)}`,
    totals: {
      envelopes: totals.envelopes,
      envelopesDelta: "live",
      avgConfidence: operationalHealth,
      avgConfidenceDelta: "live",
      criticalPercent,
      criticalDelta: "live",
      activeAlerts: alerts.length,
      resolvedAlerts: 0,
    },
    riskTimeseries,
    confTimeseries,
    biasByDomain: signalDriftRows(flagsByDay, refusalByDay, redactionByDay),
    recentAlerts: alerts.slice(0, 5).map(alertRow),
    complianceStatus: [
      { article: "Art. 9", name: "Risk management", status: "active", note: "Risk API thresholds and signed alarms enabled" },
      { article: "Art. 12", name: "Record-keeping", status: "active", note: "Signal buckets and alarm envelopes persisted" },
      { article: "Art. 13", name: "Transparency", status: "active", note: "Public dashboard reads aggregate signals only" },
      { article: "Art. 14", name: "Human oversight", status: "pending", note: "Reviewer portal is the next pilot milestone" },
      { article: "Art. 15", name: "Accuracy & robustness", status: "active", note: "Crypto/trust verification failures tracked" },
      { article: "Art. 17", name: "QMS", status: "pending", note: "Operator runbooks still required" },
    ],
  };
}

function bucketsBySignal(buckets: RiskSignalBucket[], signal: string) {
  const byDay = new Map<string, RiskSignalBucket[]>();
  for (const bucket of buckets) {
    if (bucket.signal !== signal) continue;
    if (!byDay.has(bucket.day)) byDay.set(bucket.day, []);
    byDay.get(bucket.day)!.push(bucket);
  }
  return byDay;
}

function signalDriftRows(
  flagsByDay: Map<string, RiskSignalBucket[]>,
  refusalByDay: Map<string, RiskSignalBucket[]>,
  redactionByDay: Map<string, RiskSignalBucket[]>,
): RiskMetrics["biasByDomain"] {
  const rows = [
    ...topKeys(flagsByDay, 3),
    signalRatioRow("refused", refusalByDay, "refused"),
    signalRatioRow("redacted", redactionByDay, "redacted"),
  ].filter((row): row is RiskMetrics["biasByDomain"][number] => Boolean(row));

  return rows.length ? rows.slice(0, 5) : MOCK_METRICS.biasByDomain.slice(0, 3);
}

function topKeys(byDay: Map<string, RiskSignalBucket[]>, limit: number) {
  const recent = mergeWindow(byDay, 14);
  const baseline = mergeWindow(byDay, 30, 14);
  return Object.entries(recent)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([domain, current]) => driftRow(domain, current, baseline[domain] ?? current));
}

function signalRatioRow(
  domain: string,
  byDay: Map<string, RiskSignalBucket[]>,
  key: string,
): RiskMetrics["biasByDomain"][number] | undefined {
  const recent = mergeWindow(byDay, 14);
  const baseline = mergeWindow(byDay, 30, 14);
  const recentTotal = sumValues(recent);
  const baselineTotal = sumValues(baseline);
  if (!recentTotal && !baselineTotal) return undefined;
  return driftRow(
    domain,
    recentTotal ? (recent[key] ?? 0) / recentTotal : 0,
    baselineTotal ? (baseline[key] ?? 0) / baselineTotal : 0,
  );
}

function driftRow(domain: string, currentRaw: number, baselineRaw: number) {
  const current = normalizeDrift(currentRaw);
  const baseline = normalizeDrift(baselineRaw || currentRaw);
  const delta = current - baseline;
  return {
    domain,
    current,
    baseline,
    trend: Math.abs(delta) < 0.005 ? "stable" : delta > 0 ? "rising" : "improving",
  } as const;
}

function normalizeDrift(value: number) {
  if (value <= 1) return Number(value.toFixed(3));
  return Number(Math.min(0.08, value / 100).toFixed(3));
}

function mergeWindow(byDay: Map<string, RiskSignalBucket[]>, days: number, offset = 0) {
  const selected = lastDays(days + offset).slice(0, days);
  return selected.reduce<Record<string, number>>((acc, day) => {
    const data = sumBuckets(byDay.get(day));
    for (const [key, value] of Object.entries(data)) {
      acc[key] = (acc[key] ?? 0) + value;
    }
    return acc;
  }, {});
}

function alertRow(alert: RiskEnvelopeSummary): RiskMetrics["recentAlerts"][number] {
  const sigma = Math.abs(alert.alarm.sigma);
  const severity = sigma >= 3 ? "high" : sigma >= 2 ? "medium" : "low";
  return {
    severity,
    time: formatAge(Date.now() - Date.parse(alert.alarm.triggeredAt)),
    title: `${alert.alarm.signal} alarm`,
    detail: `${alert.alarm.observed.value.toFixed(3)} vs baseline ${alert.alarm.baseline.mean.toFixed(3)} (${alert.alarm.sigma.toFixed(1)} sigma), ${alert.drivers.envelopeCount} driver envelopes.`,
    status: "open",
  };
}

function lastDays(days: number) {
  const result: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    result.push(d.toISOString().slice(0, 10));
  }
  return result;
}

function sumBuckets(buckets: RiskSignalBucket[] | undefined) {
  return (buckets ?? []).reduce<Record<string, number>>((acc, bucket) => {
    for (const [key, value] of Object.entries(bucket.data)) {
      if (Number.isFinite(value)) acc[key] = (acc[key] ?? 0) + value;
    }
    return acc;
  }, {});
}

function sumValues(data: Record<string, number>) {
  return Object.values(data).reduce((sum, value) => sum + value, 0);
}

function avg(values: number[]) {
  const usable = values.filter((value) => value > 0);
  return usable.length ? usable.reduce((sum, value) => sum + value, 0) / usable.length : 0;
}

function pct(value: number) {
  return Number(value.toFixed(1));
}

function formatAge(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "nå";
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes} min siden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} t siden`;
  const days = Math.floor(hours / 24);
  return `${days} d siden`;
}

function hostLabel(baseUrl: string): string {
  try {
    return new URL(baseUrl).host;
  } catch {
    return "Risk server";
  }
}
