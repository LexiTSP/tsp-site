import { PUBLIC_TSP_MANIFEST } from "@/lib/tsp/public-manifest";

export const dynamic = "force-static";

export function GET() {
  return Response.json(PUBLIC_TSP_MANIFEST, {
    headers: {
      "cache-control": "public, max-age=300",
      "x-tsp-manifest-status": "public-alpha-production-identity",
    },
  });
}
