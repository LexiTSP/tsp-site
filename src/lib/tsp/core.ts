/**
 * TSP core — re-exports from @lexitsp/sdk.
 *
 * Single source of truth lives in the SDK package. This file exists for
 * backward compatibility with code that imports from "@/lib/tsp/core".
 */

export {
  TSP_VERSION,
  wrap,
  verify,
  verifyChain,
  toJsonLd,
  computeConfidenceScore,
  classifyLevel,
  scoreSource,
  scoreProcess,
  scoreAlignment,
  WEIGHTS,
  SOURCE_TYPE_SCORES,
  sha256,
  canonicalJson,
} from "@lexitsp/sdk";

export type {
  Alignment,
  ChainVerificationResult,
  Citation,
  ConfidenceLevel,
  Domain,
  LedgerEntry,
  Process,
  Source,
  SourceType,
  TrustConfig,
  TrustEnvelope,
  TrustStats,
  VerificationResult,
  WrapOptions,
} from "@lexitsp/sdk";
