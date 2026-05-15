# TSP Infrastructure

Reproducible Hetzner Cloud + Cloudflare deployment for `truststandardprotocol.com` public-alpha and the commercial backend pilots.

Charter §1 (sovereign-by-default) and §9 (standalone first) apply: no managed-service lock-in, every step here can be reproduced by a third-party operator from this repo alone.

## Layout

```
infra/
├── README.md                       this file
└── terraform/
    ├── main.tf                     hcloud server + firewall + optional Cloudflare DNS
    ├── variables.tf
    ├── outputs.tf
    ├── cloud-init.yaml             first-boot config (Bun, Caddy, fail2ban, UFW)
    ├── terraform.tfvars.example    copy to terraform.tfvars and fill in
    ├── .gitignore                  excludes state and secrets
    └── README.md                   provisioning runbook
```

CI/CD lives in `.github/workflows/deploy.yml` at the repo root and uses `bun run check:release` as its release gate (claim-lint + interop fixtures + build/tests + production-start smoke).

## Three-step deploy from zero

1. **Provision** the server: `cd infra/terraform && terraform apply` (≈3 min)
2. **Bootstrap** TLS: Cloudflare Origin Certificate paste, see `terraform/README.md` §3
3. **Deploy** the site: `git push origin main` triggers the GitHub Actions workflow

End state: HTTPS site behind Cloudflare with mTLS-locked origin, automated nightly offsite backups to R2, signed manifest served with `Cache-Control: public, max-age=300, stale-while-revalidate=3600`.

## Cost

Approximately €30/mnd for site + manifest origin (CCX13 + backups + Cloudflare Free + R2). See `docs/ops/HETZNER_DEPLOYMENT.md` §11 for the full breakdown.

## When to re-run

- `terraform apply` only on infrastructure changes (server type, location, firewall rules)
- `git push origin main` for every code change — the GitHub Actions workflow handles it
- `terraform destroy` if you ever need to nuke the server (state, snapshots, IPs all go with it — make sure offsite backups are current first)
