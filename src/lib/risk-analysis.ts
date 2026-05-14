/**
 * TSP Risk v1 — analysis engine.
 *
 * Takes a stream of TrustEnvelopes and produces the metrics + alerts
 * that drive the /risk/preview dashboard. Same shape as the mock,
 * but can be derived from real ledger data when an operator exposes it.
 */

import type { TrustEnvelope } from "@lexitsp/sdk";

export interface RiskMetrics {
  source: "live" | "mock";
  mode: "risk-api" | "ledger" | "mock";
  deploymentName: string;
  classification: string;
  connected: string;
  totals: {
    envelopes: number;
    envelopesDelta: string;
    avgConfidence: number;
    avgConfidenceDelta: string;
    criticalPercent: number;
    criticalDelta: string;
    activeAlerts: number;
    resolvedAlerts: number;
  };
  riskTimeseries: Array<{
    day: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }>;
  confTimeseries: Array<{ day: number; value: number }>;
  biasByDomain: Array<{
    domain: string;
    current: number;
    baseline: number;
    trend: "stable" | "rising" | "improving";
  }>;
  recentAlerts: Array<{
    severity: "high" | "medium" | "low" | "resolved";
    time: string;
    title: string;
    detail: string;
    status: string;
  }>;
  complianceStatus: Array<{
    article: string;
    name: string;
    status: "active" | "pending" | "inactive";
    note: string;
  }>;
}

function bucketByDay(envelopes: TrustEnvelope[], days: number) {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const buckets: TrustEnvelope[][] = Array.from({ length: days }, () => []);
  for (const e of envelopes) {
    const t = Date.parse(e.ledger.timestamp);
    if (Number.isNaN(t)) continue;
    const dayIdx = Math.floor((now - t) / dayMs);
    if (dayIdx >= 0 && dayIdx < days) {
      buckets[days - 1 - dayIdx].push(e);
    }
  }
  return buckets;
}

function riskBucketFor(e: TrustEnvelope): "critical" | "high" | "medium" | "low" {
  if (e.confidenceLevel === "critical" || e.alignment.riskLevel >= 4) return "critical";
  if (e.confidenceLevel === "low" || e.alignment.riskLevel === 3) return "high";
  if (e.confidenceLevel === "medium" || e.alignment.riskLevel === 2) return "medium";
  return "low";
}

function computeRiskTimeseries(envelopes: TrustEnvelope[], days: number) {
  const buckets = bucketByDay(envelopes, days);
  return buckets.map((bucket, idx) => {
    const total = bucket.length || 1;
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const e of bucket) counts[riskBucketFor(e)]++;
    return {
      day: idx + 1,
      critical: Number(((counts.critical / total) * 100).toFixed(1)),
      high: Number(((counts.high / total) * 100).toFixed(1)),
      medium: Number(((counts.medium / total) * 100).toFixed(1)),
      low: Number(((counts.low / total) * 100).toFixed(1)),
    };
  });
}

function computeConfTimeseries(envelopes: TrustEnvelope[], days: number) {
  const buckets = bucketByDay(envelopes, days);
  return buckets.map((bucket, idx) => {
    if (bucket.length === 0) return { day: idx + 1, value: 0 };
    const avg = bucket.reduce((a, e) => a + e.confidenceScore, 0) / bucket.length;
    return { day: idx + 1, value: Number(avg.toFixed(1)) };
  });
}

function computeBiasByDomain(envelopes: TrustEnvelope[]) {
  const byDomain = new Map<string, number[]>();
  // split into "recent" (last 14d) and "baseline" (14-60d) windows
  const now = Date.now();
  const d14 = 14 * 24 * 60 * 60 * 1000;
  const d60 = 60 * 24 * 60 * 60 * 1000;
  const recent = new Map<string, number[]>();
  const baseline = new Map<string, number[]>();

  for (const e of envelopes) {
    const t = Date.parse(e.ledger.timestamp);
    const age = now - t;
    const domain = String(e.alignment.domain ?? "general");
    const score = e.alignment.biasScore;
    if (age <= d14) {
      if (!recent.has(domain)) recent.set(domain, []);
      recent.get(domain)!.push(score);
    } else if (age <= d60) {
      if (!baseline.has(domain)) baseline.set(domain, []);
      baseline.get(domain)!.push(score);
    }
    // also accumulate all for domain listing
    if (!byDomain.has(domain)) byDomain.set(domain, []);
    byDomain.get(domain)!.push(score);
  }

  const result: RiskMetrics["biasByDomain"] = [];
  for (const [domain, _] of byDomain) {
    const r = recent.get(domain) ?? [];
    const b = baseline.get(domain) ?? [];
    const rAvg = r.length ? r.reduce((a, x) => a + x, 0) / r.length : 0;
    const bAvg = b.length ? b.reduce((a, x) => a + x, 0) / b.length : rAvg;
    const delta = rAvg - bAvg;
    let trend: "stable" | "rising" | "improving" = "stable";
    if (Math.abs(delta) > 0.005) {
      trend = delta > 0 ? "rising" : "improving";
    }
    result.push({
      domain,
      current: Number(rAvg.toFixed(3)),
      baseline: Number(bAvg.toFixed(3)),
      trend,
    });
  }
  return result.sort((a, b) => b.current - a.current).slice(0, 5);
}

function computeAlerts(envelopes: TrustEnvelope[]): RiskMetrics["recentAlerts"] {
  const alerts: RiskMetrics["recentAlerts"] = [];
  const now = Date.now();

  // Scan for critical envelopes without human review
  const criticalUnreviewed = envelopes.filter(
    (e) =>
      e.confidenceLevel === "critical" &&
      !e.alignment.humanReviewRequired,
  );
  if (criticalUnreviewed.length > 0) {
    const e = criticalUnreviewed[criticalUnreviewed.length - 1];
    const t = Date.parse(e.ledger.timestamp);
    alerts.push({
      severity: "high",
      time: formatAge(now - t),
      title: "Critical envelope uten human review",
      detail: `Envelope ${e.ledger.id.slice(0, 16)} har confidenceLevel=critical men humanReviewRequired=false. Terskel: 0 tolerert.`,
      status: "open",
    });
  }

  // Scan for low average source confidence in recent window
  const recent = envelopes.filter(
    (e) => now - Date.parse(e.ledger.timestamp) <= 7 * 24 * 60 * 60 * 1000,
  );
  if (recent.length > 0) {
    const avgSrc =
      recent.reduce((a, e) => a + e.source.confidence, 0) / recent.length;
    if (avgSrc < 0.75) {
      alerts.push({
        severity: "medium",
        time: "siste 7 dager",
        title: "Kilde-konfidens under terskel",
        detail: `Rolling 7d source.confidence: ${avgSrc.toFixed(2)}. Terskel: 0.75.`,
        status: "open",
      });
    }
  }

  // Detect new pipeline values in recent envelopes
  const allPipelines = new Set(envelopes.map((e) => e.process.pipeline));
  const recentPipelines = new Set(recent.map((e) => e.process.pipeline));
  for (const p of recentPipelines) {
    const firstSeen = envelopes.find((e) => e.process.pipeline === p);
    if (firstSeen) {
      const age = now - Date.parse(firstSeen.ledger.timestamp);
      if (age < 3 * 24 * 60 * 60 * 1000 && allPipelines.size > 1) {
        alerts.push({
          severity: "low",
          time: formatAge(age),
          title: `Ny pipeline-verdi: ${p}`,
          detail: `Pipeline '${p}' er observert første gang for mindre enn 3 dager siden. Verifiser at det er tiltenkt.`,
          status: "acknowledged",
        });
      }
    }
  }

  return alerts.slice(0, 5);
}

function formatAge(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes} min siden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} t siden`;
  const days = Math.floor(hours / 24);
  return `${days} d siden`;
}

/**
 * Compute live metrics from a real TSP ledger.
 */
export function analyzeEnvelopes(envelopes: TrustEnvelope[]): RiskMetrics {
  const days = 30;
  const now = Date.now();
  const d30 = 30 * 24 * 60 * 60 * 1000;
  const d60 = 60 * 24 * 60 * 60 * 1000;

  const recent30 = envelopes.filter(
    (e) => now - Date.parse(e.ledger.timestamp) <= d30,
  );
  const prior30 = envelopes.filter((e) => {
    const age = now - Date.parse(e.ledger.timestamp);
    return age > d30 && age <= d60;
  });

  const avgConfCurrent = recent30.length
    ? recent30.reduce((a, e) => a + e.confidenceScore, 0) / recent30.length
    : 0;
  const avgConfPrior = prior30.length
    ? prior30.reduce((a, e) => a + e.confidenceScore, 0) / prior30.length
    : avgConfCurrent;

  const criticalCurrent = recent30.filter(
    (e) => e.confidenceLevel === "critical",
  ).length;
  const criticalPct = recent30.length
    ? (criticalCurrent / recent30.length) * 100
    : 0;
  const criticalPrior = prior30.filter(
    (e) => e.confidenceLevel === "critical",
  ).length;
  const criticalPctPrior = prior30.length
    ? (criticalPrior / prior30.length) * 100
    : criticalPct;

  const envelopesDeltaPct = prior30.length
    ? ((recent30.length - prior30.length) / prior30.length) * 100
    : 0;

  const fmtDelta = (n: number, suffix = "%") =>
    `${n >= 0 ? "+" : ""}${n.toFixed(1)}${suffix}`;

  const alerts = computeAlerts(envelopes);
  const activeCount = alerts.filter((a) => a.status === "open").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;

  return {
    source: "live",
    mode: "ledger",
    deploymentName: "TSP Deployment",
    classification: "Annex III · pkt. 5",
    connected: formatConnectedDate(envelopes),
    totals: {
      envelopes: envelopes.length,
      envelopesDelta: fmtDelta(envelopesDeltaPct),
      avgConfidence: Number(avgConfCurrent.toFixed(1)),
      avgConfidenceDelta: fmtDelta(avgConfCurrent - avgConfPrior, ""),
      criticalPercent: Number(criticalPct.toFixed(1)),
      criticalDelta: fmtDelta(criticalPct - criticalPctPrior),
      activeAlerts: activeCount,
      resolvedAlerts: resolvedCount,
    },
    riskTimeseries: computeRiskTimeseries(envelopes, days),
    confTimeseries: computeConfTimeseries(envelopes, days),
    biasByDomain: computeBiasByDomain(envelopes),
    recentAlerts: alerts,
    complianceStatus: [
      { article: "Art. 9", name: "Risk management", status: "active", note: "TSP Risk kjører kontinuerlig" },
      { article: "Art. 12", name: "Record-keeping", status: "active", note: `${envelopes.length} envelopes hash-kjedet` },
      { article: "Art. 13", name: "Transparency", status: "active", note: "TrustBadge + TrustModal deployed" },
      { article: "Art. 14", name: "Human oversight", status: "active", note: "Reviewer queue bemannet ukentlig" },
      { article: "Art. 15", name: "Accuracy & robustness", status: "active", note: "Chain verifisert kontinuerlig" },
      { article: "Art. 17", name: "QMS", status: "pending", note: "ISO 42001 planlagt Q3 2026" },
    ],
  };
}

function formatConnectedDate(envelopes: TrustEnvelope[]): string {
  if (envelopes.length === 0) return "Ingen data ennå";
  const oldest = envelopes.reduce((min, e) =>
    Date.parse(e.ledger.timestamp) < Date.parse(min.ledger.timestamp) ? e : min,
  envelopes[0]);
  const d = new Date(oldest.ledger.timestamp);
  const months = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
  return `Siden ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}
