import { PUBLIC_TSP_MANIFEST } from "@/lib/tsp/public-manifest";

export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      note:
        "Valid TSP v3 TrustManifest example. For production, generate and host your own org-root manifest; do not reuse this alpha demo key.",
      manifest: PUBLIC_TSP_MANIFEST,
    },
    {
      headers: {
        "cache-control": "public, max-age=300",
      },
    }
  );
}
