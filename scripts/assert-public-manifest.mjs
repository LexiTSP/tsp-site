#!/usr/bin/env bun
import { PUBLIC_TSP_MANIFEST } from "../src/lib/tsp/public-manifest.ts";
import {
  verifyManifestSignature,
  verifyInstanceCert,
} from "../packages/lexitsp-sdk/src/v3/manifest-verify.ts";

if (!(await verifyManifestSignature(PUBLIC_TSP_MANIFEST))) {
  throw new Error("PUBLIC_TSP_MANIFEST root signature is invalid");
}

for (const cert of PUBLIC_TSP_MANIFEST.instances) {
  if (!(await verifyInstanceCert(cert, PUBLIC_TSP_MANIFEST.rootKey))) {
    throw new Error(`PUBLIC_TSP_MANIFEST instance cert is invalid: ${cert.id}`);
  }
}

console.log("public manifest ok");
