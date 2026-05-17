"use client";

import { useEffect, useState } from "react";
import { HOME_PAGE_CHAPTERS } from "@/lib/home-page-map";

export function HomeChapterNav({ locale }: { locale: "en" | "no" }) {
  const [activeChapter, setActiveChapter] = useState<string>(HOME_PAGE_CHAPTERS[0].id);
  const label = locale === "en" ? "Page map" : "Sidekart";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveChapter(visible.target.id);
        }
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0.08, 0.2, 0.4] },
    );

    HOME_PAGE_CHAPTERS.forEach((chapter) => {
      const element = document.getElementById(chapter.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label={label} className="sticky top-[64px] z-30 border-y border-border bg-elevated/95 backdrop-blur">
      <div className="tsp-container flex items-center gap-3 overflow-x-auto py-3 [scrollbar-width:none]">
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted md:inline-flex">
          {label}
        </span>
        <div className="flex min-w-max items-center gap-2">
          {HOME_PAGE_CHAPTERS.map((chapter, index) => (
            <a
              key={chapter.id}
              href={chapter.href}
              onClick={() => setActiveChapter(chapter.id)}
              aria-current={activeChapter === chapter.id ? "location" : undefined}
              data-active={activeChapter === chapter.id ? "true" : "false"}
              className={`inline-flex items-center gap-2 border px-3 py-2 text-sm font-semibold no-underline transition ${
                activeChapter === chapter.id
                  ? "border-brand/40 bg-brand text-white shadow-sm"
                  : "border-border bg-paper text-muted hover:border-brand/40 hover:text-brand"
              }`}
            >
              <span className={activeChapter === chapter.id ? "font-mono text-[10px] text-white/70" : "font-mono text-[10px] text-muted"}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {chapter[locale]}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
