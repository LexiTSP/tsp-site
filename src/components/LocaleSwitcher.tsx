"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * NO/EN-bryter. Beholder current pathname når brukeren bytter locale —
 * /risk på norsk → /en/risk på engelsk og omvendt.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: (typeof routing.locales)[number]) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      className="inline-flex items-center text-xs font-mono"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l, idx) => {
        const isActive = l === locale;
        return (
          <span key={l} className="inline-flex items-center">
            {idx > 0 && <span className="text-border-strong mx-1">·</span>}
            <button
              type="button"
              onClick={() => switchTo(l)}
              disabled={isPending || isActive}
              className={
                isActive
                  ? "text-ink font-medium uppercase tracking-wider"
                  : "text-muted hover:text-ink uppercase tracking-wider"
              }
              aria-pressed={isActive}
            >
              {l}
            </button>
          </span>
        );
      })}
    </div>
  );
}
