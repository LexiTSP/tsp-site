terraform {
  required_version = ">= 1.6"

  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.48"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.40"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# -----------------------------------------------------------------------------
# SSH key registration (project-scoped, not Hetzner-account-scoped)
# -----------------------------------------------------------------------------
resource "hcloud_ssh_key" "operator" {
  name       = "${var.server_name}-operator"
  public_key = var.ssh_public_key
  labels = {
    project = "tsp"
    managed = "terraform"
  }
}

# -----------------------------------------------------------------------------
# Firewall: SSH (locked to your IPs), 443 from Cloudflare only, ICMP open
# -----------------------------------------------------------------------------
locals {
  # Cloudflare published IP ranges. Refresh quarterly from https://www.cloudflare.com/ips/
  cloudflare_ipv4 = [
    "173.245.48.0/20",
    "103.21.244.0/22",
    "103.22.200.0/22",
    "103.31.4.0/22",
    "141.101.64.0/18",
    "108.162.192.0/18",
    "190.93.240.0/20",
    "188.114.96.0/20",
    "197.234.240.0/22",
    "198.41.128.0/17",
    "162.158.0.0/15",
    "104.16.0.0/13",
    "104.24.0.0/14",
    "172.64.0.0/13",
    "131.0.72.0/22",
  ]

  cloudflare_ipv6 = [
    "2400:cb00::/32",
    "2606:4700::/32",
    "2803:f800::/32",
    "2405:b500::/32",
    "2405:8100::/32",
    "2a06:98c0::/29",
    "2c0f:f248::/32",
  ]
}

resource "hcloud_firewall" "tsp" {
  name = "${var.server_name}-firewall"

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = var.ssh_allowed_ips
  }

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = concat(local.cloudflare_ipv4, local.cloudflare_ipv6)
  }

  rule {
    direction  = "in"
    protocol   = "icmp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  labels = {
    project = "tsp"
    managed = "terraform"
  }
}

# -----------------------------------------------------------------------------
# Server: CCX13 by default (dedicated 2 vCPU, 8GB RAM, 80GB NVMe)
# -----------------------------------------------------------------------------
resource "hcloud_server" "tsp" {
  name         = var.server_name
  server_type  = var.server_type
  image        = "ubuntu-24.04"
  location     = var.location
  ssh_keys     = [hcloud_ssh_key.operator.id]
  firewall_ids = [hcloud_firewall.tsp.id]

  user_data = templatefile("${path.module}/cloud-init.yaml", {
    deploy_user_pubkey = var.ssh_public_key
    site_domain        = var.site_domain
  })

  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }

  labels = {
    project = "tsp"
    role    = var.server_role
    managed = "terraform"
  }
}

# -----------------------------------------------------------------------------
# Hetzner-managed backups (built-in, +20% monthly).
# Charter §1: these are convenience, not the source of truth.
# Offsite backups to R2/B2 still mandatory — see scripts/tsp-offsite-backup.sh
# -----------------------------------------------------------------------------
resource "hcloud_server_network" "tsp" {
  count      = var.attach_private_network ? 1 : 0
  server_id  = hcloud_server.tsp.id
  network_id = var.private_network_id
}

# -----------------------------------------------------------------------------
# Optional Cloudflare DNS — set manage_cloudflare_dns = true to enable
# -----------------------------------------------------------------------------
resource "cloudflare_record" "apex_v4" {
  count   = var.manage_cloudflare_dns ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "@"
  content = hcloud_server.tsp.ipv4_address
  type    = "A"
  ttl     = 1 # auto-managed, required when proxied
  proxied = true
  comment = "TSP public-alpha origin, managed by Terraform"
}

resource "cloudflare_record" "apex_v6" {
  count   = var.manage_cloudflare_dns ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "@"
  content = hcloud_server.tsp.ipv6_address
  type    = "AAAA"
  ttl     = 1
  proxied = true
  comment = "TSP public-alpha origin, managed by Terraform"
}

# Cloudflare SSL/TLS hardening
resource "cloudflare_zone_settings_override" "tsp" {
  count   = var.manage_cloudflare_dns ? 1 : 0
  zone_id = var.cloudflare_zone_id

  settings {
    ssl                      = "strict"
    always_use_https         = "on"
    min_tls_version          = "1.2"
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    opportunistic_encryption = "on"
    security_level           = "medium"
    browser_check            = "on"

    security_header {
      enabled            = true
      preload            = true
      max_age            = 15552000
      include_subdomains = true
      nosniff            = true
    }
  }
}
