import { describe, expect, test } from "bun:test";
import { HOME_PAGE_CHAPTERS } from "./home-page-map";

describe("home page chapter map", () => {
  test("defines stable anchors for the long homepage story", () => {
    const ids = HOME_PAGE_CHAPTERS.map((chapter) => chapter.id);

    expect(ids).toEqual(["proof", "stakes", "gives", "plan", "paths", "boundary"]);
    expect(new Set(ids).size).toBe(ids.length);

    for (const chapter of HOME_PAGE_CHAPTERS) {
      expect(chapter.href).toBe(`#${chapter.id}`);
      expect(chapter.en.length).toBeGreaterThan(2);
      expect(chapter.no.length).toBeGreaterThan(2);
      expect(chapter.en.length).toBeLessThanOrEqual(22);
      expect(chapter.no.length).toBeLessThanOrEqual(24);
    }
  });

  test("is wired into the localized homepage", async () => {
    const pageSource = await Bun.file(new URL("../app/[locale]/page.tsx", import.meta.url)).text();

    expect(pageSource).toContain("HomeChapterNav");
    for (const chapter of HOME_PAGE_CHAPTERS) {
      expect(pageSource).toContain(`id="${chapter.id}"`);
    }
  });

  test("renders an active chapter state for scroll orientation", async () => {
    const componentSource = await Bun.file(new URL("../components/HomeChapterNav.tsx", import.meta.url)).text();

    expect(componentSource).toContain("use client");
    expect(componentSource).toContain("IntersectionObserver");
    expect(componentSource).toContain('aria-current={activeChapter === chapter.id ? "location" : undefined}');
    expect(componentSource).toContain('data-active={activeChapter === chapter.id ? "true" : "false"}');
  });
});
