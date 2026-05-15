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
    const updateNow = () => setNow(Date.now());
    updateNow();
    const id = setInterval(updateNow, 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now === null ? 0 : Math.max(0, TARGET - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return (
    <div
      className="flex max-w-full flex-wrap items-baseline gap-x-2 gap-y-3 font-mono sm:gap-x-3"
      style={{ fontVariantNumeric: "tabular-nums" }}
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
        className={`block ${wide ? "min-w-[3ch]" : "min-w-[2ch]"} text-3xl font-medium leading-none text-ink md:text-4xl xl:text-[2.75rem]`}
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
    <span className="select-none text-2xl leading-none text-border-strong -translate-y-1 md:text-3xl xl:text-4xl">
      :
    </span>
  );
}
