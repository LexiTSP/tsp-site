"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-08-02T00:00:00Z").getTime();

interface Props {
  labelDays: string;
  labelHours: string;
  labelMinutes: string;
  labelSeconds: string;
}

export function CliffCountdown({ labelDays, labelHours, labelMinutes, labelSeconds }: Props) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now === null ? TARGET - Date.now() : Math.max(0, TARGET - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return (
    <div
      className="flex items-baseline gap-3 md:gap-5 font-mono"
      style={{ fontVariantNumeric: "tabular-nums" }}
      suppressHydrationWarning
    >
      <Unit num={days} label={labelDays} wide />
      <Sep />
      <Unit num={hours} label={labelHours} />
      <Sep />
      <Unit num={minutes} label={labelMinutes} />
      <Sep />
      <Unit num={seconds} label={labelSeconds} />
    </div>
  );
}

function Unit({ num, label, wide }: { num: number; label: string; wide?: boolean }) {
  return (
    <div className="flex flex-col items-start">
      <span
        className="text-3xl md:text-5xl font-medium text-ink leading-none tracking-tight"
        style={{ letterSpacing: "-0.03em" }}
      >
        {String(num).padStart(wide ? 3 : 2, "0")}
      </span>
      <span className="text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.16em] text-muted mt-2 font-medium">
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return (
    <span className="text-2xl md:text-4xl text-border-strong leading-none -translate-y-1 select-none">
      :
    </span>
  );
}
