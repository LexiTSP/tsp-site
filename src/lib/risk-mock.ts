/**
 * TSP Risk — mock data fallback when no live ledger is configured.
 * Represents an idealized regulated-AI profile over 30 days.
 */

import type { RiskMetrics } from "./risk-analysis";

const RISK_TIMESERIES = Array.from({ length: 30 }, (_, i) => {
  const noise = Math.sin(i * 0.7) * 0.8 + Math.cos(i * 1.3) * 0.5;
  const critical = Math.max(0.2, 0.5 + noise * 0.3);
  const high = Math.max(1.5, 2.5 + noise * 1.2);
  const medium = Math.max(8, 10.5 + noise * 1.8);
  const low = 100 - critical - high - medium;
  return {
    day: i + 1,
    critical: Number(critical.toFixed(1)),
    high: Number(high.toFixed(1)),
    medium: Number(medium.toFixed(1)),
    low: Number(low.toFixed(1)),
  };
});

const CONF_TIMESERIES = Array.from({ length: 30 }, (_, i) => {
  const base = 87.3;
  const wobble = Math.sin(i * 0.4) * 1.2 + Math.cos(i * 0.8) * 0.8;
  return { day: i + 1, value: Number((base + wobble).toFixed(1)) };
});

export const MOCK_METRICS: RiskMetrics = {
  source: "mock",
  mode: "mock",
  deploymentName: "Demo TSP Deployment",
  classification: "Annex III · pkt. 5",
  connected: "Siden 12. mars 2026",
  totals: {
    envelopes: 124561,
    envelopesDelta: "+14.2%",
    avgConfidence: 87.3,
    avgConfidenceDelta: "+0.8",
    criticalPercent: 0.5,
    criticalDelta: "-0.2",
    activeAlerts: 2,
    resolvedAlerts: 14,
  },
  riskTimeseries: RISK_TIMESERIES,
  confTimeseries: CONF_TIMESERIES,
  biasByDomain: [
    { domain: "welfare", current: 0.042, baseline: 0.038, trend: "stable" },
    { domain: "legal", current: 0.031, baseline: 0.029, trend: "stable" },
    { domain: "medical", current: 0.058, baseline: 0.041, trend: "rising" },
    { domain: "tax", current: 0.027, baseline: 0.033, trend: "improving" },
    { domain: "general", current: 0.051, baseline: 0.049, trend: "stable" },
  ],
  recentAlerts: [
    {
      severity: "high",
      time: "12 min siden",
      title: "biasScore drift i medical-domene",
      detail: "Rolling 14d snitt: 0.058 vs baseline 0.041 (+41%). Trigger: >2σ.",
      status: "open",
    },
    {
      severity: "medium",
      time: "3 t siden",
      title: "Kilde-confidence trender nedover",
      detail: "source.confidence rolling 7d: 0.78 vs forrige uke 0.86. Under terskel 0.80.",
      status: "acknowledged",
    },
    {
      severity: "low",
      time: "8 t siden",
      title: "Ny pipeline-verdi registrert",
      detail: "'RAG + Legal + Welfare' dukket opp i process.pipeline — første gang.",
      status: "acknowledged",
    },
    {
      severity: "resolved",
      time: "i går 14:22",
      title: "Critical uten human review — isolert hendelse",
      detail: "1 envelope med confidenceLevel=critical uten flagg. Root cause: pipeline-bug, patchet.",
      status: "resolved",
    },
    {
      severity: "resolved",
      time: "i går 09:04",
      title: "Ugyldig domain-tag fanget",
      detail: "Welfare-envelope fikk domain=general. Klassifisering oppdatert.",
      status: "resolved",
    },
  ],
  complianceStatus: [
    { article: "Art. 9", name: "Risk management", status: "active", note: "TSP Risk kjører kontinuerlig" },
    { article: "Art. 12", name: "Record-keeping", status: "active", note: "Core genererer alle envelopes" },
    { article: "Art. 13", name: "Transparency", status: "active", note: "TrustBadge + TrustModal deployed" },
    { article: "Art. 14", name: "Human oversight", status: "active", note: "Reviewer queue bemannet ukentlig" },
    { article: "Art. 15", name: "Accuracy & robustness", status: "active", note: "Chain verifisert hver natt" },
    { article: "Art. 17", name: "QMS", status: "pending", note: "ISO 42001 planlagt Q3 2026" },
  ],
};
