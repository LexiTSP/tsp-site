"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export type ReadinessCheckCopy = {
  title: string;
  lead: string;
  scorePrefix: string;
  high: string;
  medium: string;
  low: string;
  manualLabel: string;
  items: string[];
};

export function ReceiptReadinessCheck({ copy }: { copy: ReadinessCheckCopy }) {
  const [checked, setChecked] = useState(() => copy.items.map((_, index) => index === 0));
  const selectedCount = checked.filter(Boolean).length;
  const scoreText = useMemo(() => {
    const ratio = copy.items.length === 0 ? 0 : selectedCount / copy.items.length;

    if (ratio >= 0.67) return copy.low;
    if (ratio >= 0.34) return copy.medium;
    return copy.high;
  }, [copy.high, copy.items.length, copy.low, copy.medium, selectedCount]);

  return (
    <div className="border border-border-strong bg-white p-5 shadow-[0_18px_55px_rgba(17,24,39,0.08)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl text-ink">{copy.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{copy.lead}</p>
        </div>
        <div className="shrink-0 border border-warn/45 bg-warn/[0.07] px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-warn">
          {copy.manualLabel}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {copy.items.map((item, index) => (
          <label
            key={item}
            className="group grid cursor-pointer grid-cols-[auto_1fr] items-start gap-3 border border-border bg-paper p-3 text-left transition-colors hover:border-accent/45 hover:bg-accent/[0.06] has-[:checked]:border-verify/35 has-[:checked]:bg-verify/[0.07]"
          >
            <input
              checked={checked[index] ?? false}
              className="peer sr-only"
              type="checkbox"
              onChange={() =>
                setChecked((current) =>
                  current.map((value, currentIndex) => (currentIndex === index ? !value : value)),
                )
              }
            />
            <span className="mt-0.5 flex h-5 w-5 items-center justify-center border border-muted text-transparent peer-checked:border-verify peer-checked:bg-verify peer-checked:text-white">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-semibold leading-6 text-ink">{item}</span>
          </label>
        ))}
      </div>

      <div className="mt-4 border border-warn/45 bg-warn/[0.07] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-warn">{copy.scorePrefix}</div>
            <p className="mt-1 text-sm font-semibold leading-6 text-ink">{scoreText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
