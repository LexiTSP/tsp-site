# Cloudflare Origin Key Rotation Runbook

TSP release and deploy work is blocked if any Cloudflare origin certificate
private key has been stored in the workspace, chat artifacts, public repos, or
archives. Deleting the file is not enough; the origin certificate must be
rotated in Cloudflare before the site is promoted.

## Immediate Containment

1. Delete plaintext key files from the workspace.
2. Run `bun run check:secrets` from the TSP root.
3. Scan the parent launch folder and any zip/archive artifacts before copying
   them into the public repo.
4. Do not push, publish packages, or deploy until the old origin certificate has
   been revoked and a new one is installed on the host.

## Rotation Steps

1. In Cloudflare, open the `truststandardprotocol.com` zone.
2. Go to SSL/TLS -> Origin Server.
3. Revoke the exposed origin certificate.
4. Create a new origin certificate for `truststandardprotocol.com` and
   `*.truststandardprotocol.com`.
5. Store the new private material outside Git and outside this workspace.
6. Install the new certificate and key on the Hetzner host used by Caddy.
7. Restart Caddy and verify the origin is healthy through Cloudflare.
8. Run the hosted smoke checks:

```bash
curl -fsS https://truststandardprotocol.com/.well-known/tsp-manifest.json
bun run pilot:hosted
```

## Release Evidence

Record the following in the release PR or deploy note:

- date and operator who revoked the exposed origin certificate;
- date and operator who installed the replacement certificate;
- `bun run check:secrets` output;
- hosted manifest smoke result;
- `/en/verify` sample, tamper, and reload result.
