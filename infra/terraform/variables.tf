# -----------------------------------------------------------------------------
# Credentials (set via environment or terraform.tfvars — never commit)
# -----------------------------------------------------------------------------
variable "hcloud_token" {
  description = "Hetzner Cloud API token. Create at console.hetzner.cloud → Security → API Tokens (Read & Write)."
  type        = string
  sensitive   = true
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token with Zone:DNS:Edit and Zone:Zone Settings:Edit. Only required if manage_cloudflare_dns = true."
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for site_domain. Find in CF dashboard sidebar."
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Server configuration
# -----------------------------------------------------------------------------
variable "server_name" {
  description = "Hetzner server name. Used for labels and firewall."
  type        = string
  default     = "tsp-public-alpha"
}

variable "server_type" {
  description = "Hetzner server type. Recommended: ccx13 (€16/mo, 2 dedicated vCPU, 8GB) for public-alpha. ccx23 for backend pilots."
  type        = string
  default     = "ccx13"

  validation {
    condition     = contains(["cx22", "cx32", "cpx21", "cpx31", "ccx13", "ccx23", "ccx33", "cax21", "cax31"], var.server_type)
    error_message = "Use a valid Hetzner Cloud server type. Note CX/CPX/CAX are EU-only; CCX is global. See hetzner.com/cloud."
  }
}

variable "location" {
  description = "Hetzner datacenter: fsn1 (Falkenstein DE), nbg1 (Nürnberg DE), hel1 (Helsinki FI). Pick EU for TSP."
  type        = string
  default     = "fsn1"

  validation {
    condition     = contains(["fsn1", "nbg1", "hel1"], var.location)
    error_message = "TSP must stay on EU soil — use fsn1, nbg1, or hel1. US/Singapore regions break the EU narrative."
  }
}

variable "server_role" {
  description = "Label for the server role. Used in monitoring/cost-attribution."
  type        = string
  default     = "public-alpha"
}

# -----------------------------------------------------------------------------
# SSH access
# -----------------------------------------------------------------------------
variable "ssh_public_key" {
  description = "SSH public key contents (ed25519 recommended). Will be installed for both root and tsp user."
  type        = string

  validation {
    condition     = can(regex("^(ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp256) ", var.ssh_public_key))
    error_message = "ssh_public_key must start with ssh-ed25519, ssh-rsa, or ecdsa-sha2-nistp256."
  }
}

variable "ssh_allowed_ips" {
  description = "IP ranges allowed to SSH. DEFAULT IS OPEN — lock down to your IP for production. Example: [\"203.0.113.42/32\"]."
  type        = list(string)
  default     = ["0.0.0.0/0", "::/0"]
}

# -----------------------------------------------------------------------------
# DNS / domain
# -----------------------------------------------------------------------------
variable "site_domain" {
  description = "Public domain. Used in Caddyfile and in Cloudflare DNS records if managed here."
  type        = string
  default     = "truststandardprotocol.org"
}

variable "manage_cloudflare_dns" {
  description = "If true, Terraform manages Cloudflare DNS A/AAAA and zone SSL settings. Requires cloudflare_api_token + cloudflare_zone_id."
  type        = bool
  default     = false
}

# -----------------------------------------------------------------------------
# Private networking (for backend pilots later)
# -----------------------------------------------------------------------------
variable "attach_private_network" {
  description = "Attach to existing hcloud_network. Useful when adding Risk/Evidence/Oversight servers later."
  type        = bool
  default     = false
}

variable "private_network_id" {
  description = "Existing hcloud_network ID. Only used when attach_private_network = true."
  type        = string
  default     = ""
}
