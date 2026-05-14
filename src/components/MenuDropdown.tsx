"use client";

import { Link } from "@/i18n/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MenuDropdown — en gjenbrukbar nav-dropdown for header.
 *
 * Åpnes på hover (desktop) og klikk (alle). Lukkes på click-outside eller Escape.
 * Hver dropdown støtter en hovedtittel, beskrivelse, og en liste med lenker.
 */

export interface MenuLink {
  href: string;
  label: string;
  desc?: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface Props {
  trigger: string;
  active?: boolean;
  groups: Array<{
    heading?: string;
    links: MenuLink[];
  }>;
  footer?: React.ReactNode;
}

export function MenuDropdown({ trigger, active, groups, footer }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1",
          active
            ? "bg-brand/10 text-brand"
            : "text-gray-700 hover:bg-gray-100",
        )}
      >
        {trigger}
        <ChevronDown
          className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full pt-2 z-50"
          style={{ minWidth: "320px" }}
        >
          <div className="tsp-card p-2 shadow-xl border-border bg-white animate-fade-in">
            {groups.map((group, gi) => (
              <div key={gi} className={gi > 0 ? "mt-2 pt-2 border-t border-border" : ""}>
                {group.heading && (
                  <div className="tsp-eyebrow text-muted px-3 py-1.5">{group.heading}</div>
                )}
                <div className="flex flex-col">
                  {group.links.map((l) => {
                    const Icon = l.icon;
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-brand/5 group transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {Icon && (
                          <div className="w-8 h-8 shrink-0 rounded-lg bg-brand/10 text-brand flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-ink group-hover:text-brand">
                              {l.label}
                            </span>
                            {l.badge && (
                              <span className="tsp-pill border-brand/30 bg-brand/5 text-brand text-xxxs">
                                {l.badge}
                              </span>
                            )}
                          </div>
                          {l.desc && (
                            <div className="text-xs text-muted mt-0.5 leading-relaxed">{l.desc}</div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            {footer && <div className="mt-2 pt-2 border-t border-border px-2 pb-1">{footer}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
