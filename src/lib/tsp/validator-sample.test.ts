import { describe, expect, test } from "bun:test";

import {
  ADVANCED_VERIFY_DEFAULT_OPEN,
  canRunManualVerify,
  createValidatorSample,
  tamperValidatorEnvelope,
} from "./validator-sample";

describe("validator sample helpers", () => {
  test("creates a browser-style sample envelope that verifies locally", async () => {
    const sample = await createValidatorSample("en");

    expect(sample.envelope.tsp).toBe("3.0");
    expect(sample.publicKey.kty).toBe("OKP");
    expect(sample.result.valid).toBe(true);
    expect(sample.result.checks.schema.status).toBe("passed");
    expect(sample.result.checks.contentHash.status).toBe("passed");
    expect(sample.result.checks.ledgerHash.status).toBe("passed");
    expect(sample.result.checks.signatures[0]?.status).toBe("passed");
  });

  test("marks the sample invalid after content is tampered", async () => {
    const sample = await createValidatorSample("en");
    const tampered = await tamperValidatorEnvelope(
      sample.envelope,
      sample.publicKey,
      "en",
    );

    expect(tampered.envelope.content.value).not.toBe(sample.envelope.content.value);
    expect(tampered.result.valid).toBe(false);
    expect(
      [
        tampered.result.checks.contentHash.status,
        tampered.result.checks.signatures[0]?.status,
      ].includes("failed"),
    ).toBe(true);
  });

  test("keeps manual verification disabled for empty input", () => {
    expect(canRunManualVerify("", false)).toBe(false);
    expect(canRunManualVerify("   ", false)).toBe(false);
    expect(canRunManualVerify("{\"tsp\":\"3.0\"}", false)).toBe(true);
    expect(canRunManualVerify("{\"tsp\":\"3.0\"}", true)).toBe(false);
  });

  test("keeps advanced online verification controls hidden by default", () => {
    expect(ADVANCED_VERIFY_DEFAULT_OPEN).toBe(false);
  });
});
