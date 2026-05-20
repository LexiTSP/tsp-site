import { describe, expect, test } from "bun:test";

const homepageSource = () =>
  Bun.file(new URL("../app/[locale]/page.tsx", import.meta.url)).text();

const interactivePanelsSource = () =>
  Bun.file(new URL("../components/HomeInteractivePanels.tsx", import.meta.url)).text();

const globalsSource = () =>
  Bun.file(new URL("../app/globals.css", import.meta.url)).text();

describe("homepage redesign wiring", () => {
  test("uses the redesigned interactive homepage components", async () => {
    const pageSource = await homepageSource();

    expect(pageSource).toContain("HomeInteractivePanels");
    expect(pageSource).toContain("HeroProofConsole");
    expect(pageSource).toContain("InteractiveActionSteps");
    expect(pageSource).toContain("InteractiveProofPanels");
    expect(pageSource).toContain("ReceiptReadinessCheck");
    expect(pageSource).toContain("ScenarioSwitcher");
    expect(pageSource).not.toContain("HomeChapterNav");
  });

  test("keeps stable homepage anchors for direct links and section QA", async () => {
    const pageSource = await homepageSource();
    const ids = [
      "receipt-lab",
      "scenarios",
      "proof",
      "primitive",
      "stakes",
      "gives",
      "plan",
      "paths",
      "boundary",
    ];

    for (const id of ids) {
      expect(pageSource).toContain(`id=\"${id}\"`);
    }
  });

  test("includes css hooks required by the no-client-js interactive panels", async () => {
    const componentSource = await interactivePanelsSource();
    const cssSource = await globalsSource();

    expect(componentSource).toContain("tsp-receipt-state--tampered");
    expect(componentSource).toContain("tsp-scenario-tab-${index}");
    expect(componentSource).toContain("tsp-scenario-panel-${index}");
    expect(cssSource).toContain(".tsp-receipt-state--tampered:checked");
    expect(cssSource).toContain(".tsp-scenario-tab-0:checked");
  });
});
