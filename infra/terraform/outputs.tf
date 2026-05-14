output "server_ipv4" {
  value       = hcloud_server.tsp.ipv4_address
  description = "IPv4 address. Paste into Cloudflare DNS if manage_cloudflare_dns = false."
}

output "server_ipv6" {
  value       = hcloud_server.tsp.ipv6_address
  description = "IPv6 address."
}

output "server_id" {
  value       = hcloud_server.tsp.id
  description = "Hetzner server ID, for hcloud CLI and backup automation."
}

output "ssh_command" {
  value       = "ssh tsp@${hcloud_server.tsp.ipv4_address}"
  description = "Connect as the non-root deploy user."
}

output "ssh_root_command" {
  value       = "ssh root@${hcloud_server.tsp.ipv4_address}"
  description = "Connect as root (only for emergency admin)."
}

output "next_steps" {
  value = <<-EOT
    
    ┌─────────────────────────────────────────────────────────────────────┐
    │  TSP server provisioned at ${hcloud_server.tsp.ipv4_address}
    │  Location: ${var.location}  ·  Type: ${var.server_type}
    └─────────────────────────────────────────────────────────────────────┘
    
    1. Wait ~3 minutes for cloud-init to finish, then verify:
    
         ssh tsp@${hcloud_server.tsp.ipv4_address} \
           'test -f /var/log/tsp-cloud-init-complete && echo READY || echo NOT-READY'
    
    2. In Cloudflare dashboard for ${var.site_domain}:
         SSL/TLS → Origin Server → Create Certificate
         Hostnames: ${var.site_domain}, *.${var.site_domain}
         Validity: 15 years
       
       Then copy the cert and private key to the server:
       
         scp origin.pem tsp@${hcloud_server.tsp.ipv4_address}:/tmp/
         scp origin-key.pem tsp@${hcloud_server.tsp.ipv4_address}:/tmp/
         ssh tsp@${hcloud_server.tsp.ipv4_address} 'sudo install -m 644 \
           /tmp/origin.pem /etc/ssl/cloudflare-origin.pem && sudo install -m 600 \
           /tmp/origin-key.pem /etc/ssl/cloudflare-origin-key.pem && \
           sudo systemctl restart caddy && rm /tmp/origin*.pem'
    
    3. Clone repo as tsp user and start the site:
    
         ssh tsp@${hcloud_server.tsp.ipv4_address}
         git clone https://github.com/lexitsp/tsp-site.git
         cd tsp-site
         bun install --frozen-lockfile
         bun run build
         sudo systemctl start tsp-site
    
    4. In Cloudflare: SSL/TLS → Origin Server → enable Authenticated Origin Pulls
       (origin will reject any non-Cloudflare traffic on 443).
    
    5. Configure offsite backups (copy scripts/tsp-offsite-backup.sh to server,
       set up rclone with R2 credentials, schedule via crontab).
    
    6. For GitHub Actions auto-deploy: add these secrets to the repo:
         DEPLOY_HOST       = ${hcloud_server.tsp.ipv4_address}
         DEPLOY_SSH_KEY    = (private key matching the public key registered above)
         SITE_DOMAIN       = ${var.site_domain}
    
  EOT
}
