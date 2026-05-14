# Terraform Module: TSP on Hetzner

Reproducible provisioning for the public-alpha site and (later) the commercial backend pilots.

## What this provisions

- **Hetzner Cloud server** (CCX13 default, dedicated 2 vCPU / 8 GB / 80 GB NVMe in Falkenstein)
- **Hetzner Cloud Firewall** (SSH locked to your IPs, 443 from Cloudflare-only, ICMP open)
- **SSH key registration** in your Hetzner project
- **Optional Cloudflare DNS + SSL hardening** (A/AAAA proxied, HSTS preload, TLS 1.2 min, Full Strict)
- **First-boot config via cloud-init**: hardened SSH, UFW, fail2ban, unattended-upgrades, Caddy (with mTLS + manifest caching), Bun, sandboxed systemd unit, sysctl tuning

End state: an empty server ready to receive `git clone` and a Cloudflare Origin Cert.

## Prerequisites

- [Terraform ≥ 1.6](https://developer.hashicorp.com/terraform/install)
- A Hetzner Cloud account with a project created
- A Hetzner Cloud API token (Read & Write)
- An SSH ed25519 keypair you own
- (Optional) A Cloudflare account with the zone for `truststandardprotocol.org` added and nameservers pointed at CF
- (Optional) A Cloudflare API token with `Zone:DNS:Edit + Zone:Zone Settings:Edit`

## 1 · Initial provisioning (≈3 minutes)

```bash
cd infra/terraform

cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars: paste tokens, public SSH key, lock down ssh_allowed_ips

terraform init
terraform plan
terraform apply
```

Terraform prints the server IPv4 + a step-by-step next-steps block.

Verify cloud-init finished (takes ~2–3 min after `apply` returns):

```bash
ssh tsp@$(terraform output -raw server_ipv4) \
  'test -f /var/log/tsp-cloud-init-complete && echo READY || echo NOT-READY'
```

If `NOT-READY`, watch progress with: `ssh root@<ip> 'tail -f /var/log/cloud-init-output.log'`.

## 2 · Cloudflare DNS (skip if `manage_cloudflare_dns = true`)

In the Cloudflare dashboard for `truststandardprotocol.org`:

1. DNS → Add A record `@` → IPv4 from `terraform output server_ipv4` → **Proxied (orange cloud)**
2. DNS → Add AAAA record `@` → IPv6 from `terraform output server_ipv6` → **Proxied**
3. SSL/TLS → set to **Full (strict)**
4. SSL/TLS → Edge Certificates → enable **Always Use HTTPS**, **HSTS** (preload, includeSubdomains, max-age ≥ 6 months)
5. SSL/TLS → Edge Certificates → Min TLS Version: **1.2**

## 3 · Cloudflare Origin Certificate (mandatory)

The Caddyfile requires `/etc/ssl/cloudflare-origin.pem` and `/etc/ssl/cloudflare-origin-key.pem`. Generate the cert in Cloudflare and paste it to the server:

1. CF dashboard → SSL/TLS → **Origin Server** → **Create Certificate**
   - Hostnames: `truststandardprotocol.org`, `*.truststandardprotocol.org`
   - Validity: **15 years**
   - Type: **ECC** (P-256)
2. Copy the displayed certificate (PEM, including `-----BEGIN CERTIFICATE-----`) to a local file `origin.pem`
3. Copy the private key to `origin-key.pem`
4. Push both to the server and install with correct permissions:

```bash
SERVER_IP=$(terraform output -raw server_ipv4)
scp origin.pem origin-key.pem tsp@$SERVER_IP:/tmp/

ssh tsp@$SERVER_IP <<'EOF'
sudo install -m 644 -o root -g root /tmp/origin.pem     /etc/ssl/cloudflare-origin.pem
sudo install -m 600 -o root -g root /tmp/origin-key.pem /etc/ssl/cloudflare-origin-key.pem
sudo systemctl start caddy
sudo systemctl status caddy --no-pager
rm /tmp/origin.pem /tmp/origin-key.pem
EOF

# Wipe local copies — the cert is harmless but the key is sensitive
shred -u origin.pem origin-key.pem
```

5. Back in CF: SSL/TLS → Origin Server → enable **Authenticated Origin Pulls**. From now on, only Cloudflare can hit your origin on 443.

## 4 · Deploy the site

```bash
ssh tsp@$(terraform output -raw server_ipv4)
git clone https://github.com/lexitsp/tsp-site.git
cd tsp-site
bun install --frozen-lockfile
bun run check:release    # claim-lint + interop + build/tests + production-start smoke
bun run build
sudo systemctl start tsp-site
sudo systemctl status tsp-site --no-pager
```

Verify externally:

```bash
curl -fsS https://truststandardprotocol.org/.well-known/tsp-manifest.json \
  | jq -e '.tsp == "3.0" and .organization.domain == "truststandardprotocol.org" and (.rootSignatureOverManifest | type == "string")'
```

## 5 · Lock down SSH

Once everything works, edit `terraform.tfvars` and set `ssh_allowed_ips` to your office/home IP only, then `terraform apply` again. The change is non-destructive — Terraform updates the Hetzner Cloud Firewall in place.

```hcl
ssh_allowed_ips = ["203.0.113.42/32"]
```

## 6 · GitHub Actions auto-deploy

Add these secrets to the `tsp-site` GitHub repo (Settings → Secrets and variables → Actions):

| Secret | Value |
|---|---|
| `DEPLOY_HOST` | `terraform output -raw server_ipv4` |
| `DEPLOY_SSH_KEY` | Contents of `~/.ssh/id_ed25519` (private key matching the public key in `terraform.tfvars`) |
| `SITE_DOMAIN` | `truststandardprotocol.org` |

Then every `git push origin main` triggers the release-gate workflow: claim-lint + interop + build/tests + production-start smoke. Only after that passes does it SSH to the server, pull, rebuild, and restart the systemd unit. See `.github/workflows/deploy.yml`.

## 7 · Tear down

```bash
# Make sure offsite backups in R2/B2 are current first!
terraform destroy
```

This deletes the server, firewall, SSH key registration, and (if managed) DNS records. Hetzner-side snapshots tied to the server are deleted automatically.

## State management

The default backend is local (`terraform.tfstate` next to this README). For team use, migrate to a remote backend — Cloudflare R2 via the `s3` backend works well and keeps everything in the same providers:

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket                      = "tsp-terraform-state"
    key                         = "public-alpha/terraform.tfstate"
    region                      = "auto"
    endpoint                    = "https://<account-id>.r2.cloudflarestorage.com"
    access_key                  = "..."
    secret_key                  = "..."
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_metadata_api_check     = true
    use_path_style              = true
  }
}
```

## Footguns

- **`terraform destroy` is irreversible.** Verify offsite backups before running.
- **The Cloudflare IP ranges in `main.tf` need quarterly refresh** — Cloudflare publishes them at `https://www.cloudflare.com/ips/`. Diff and re-apply.
- **Don't commit `terraform.tfvars`.** The `.gitignore` already excludes it; verify before pushing.
- **`server_type` change is destructive** — Hetzner rebuilds the VM. Make sure offsite backups are current, then `terraform apply` and follow the cloud-init + cert paste steps again.
- **`location` change is destructive** — same. Use this as an opportunity to test the restore procedure.
- **Hetzner April-2026 prices apply** to all new and existing servers. Budget accordingly.
