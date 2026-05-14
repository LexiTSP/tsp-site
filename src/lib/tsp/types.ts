/**
 * TSP types — re-exports from @lexitsp/sdk.
 *
 * Single source of truth lives in the SDK. This file exists for
 * backward compatibility with code that imports from "@/lib/tsp/types".
 */

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
} from "@lexitsp/sdk";
