# Hetzner Deployment Guide — TSP Public Alpha

> Hosting-strategi for `truststandardprotocol.com` og kommersielle backend-piloter (Risk/Evidence/Oversight/Control Plane). Skrevet for TSP-stakken: Bun + Hono + bun:sqlite + Next.js 15. Charter §1 (sovereign-by-default) og §5 (åpen referanse) tas på alvor — ingen managed-service lock-in.

---

## 1. Anbefalingen i én linje

**Cloudflare foran Hetzner CCX13 (Falkenstein eller Helsinki), DNS hos Cloudflare, alle backups offsite til Cloudflare R2.** Det er rammen som skalerer fra public-alpha til første pilot uten arkitekturbytte, og som overlever en eventuell Hetzner-suspensjon med restore-tid målt i timer, ikke uker.

---

## 2. Hvorfor Hetzner for TSP — og hvor det halter

### Det som passer

- **EU-soil narrative.** Falkenstein/Nürnberg/Helsinki. For en EU AI Act-positionert protokoll er det fortelleringsmessig pluss, ikke minus.
- **Pris/ytelse.** Selv etter april-2026-økningen er Hetzner ~3× billigere enn DigitalOcean på sammenlignbare specs. Hele TSP-stacken (site + manifest + tre kommersielle backend-moduler) holder seg trygt under 5000 NOK/mnd-rammen.
- **Full TLS-kontroll.** Du eier sertifikatet på origin. Det betyr noe når dere senere aktiverer DANE/TLSA på `truststandardprotocol.com` — managed-PaaS-er som Vercel og Cloudflare Pages tar den kontrollen fra deg.
- **Bun + Hono + bun:sqlite passer som hånd i hanske.** Én prosess, én disk, ingen managed-service-shopping. Det er nettopp arkitekturen Hetzner Cloud er bygd for.
- **Generøs traffic-allowance.** 20 TB/mnd inkludert på EU-plans dekker alpha- og pilot-skala uten å tenke på det.

### Det som halter

- **Konto-suspensjon-risiko er reell.** Dokumenterte tilfeller hvor hele kunder mistet alt over natten på automatisk flagging. Mitigering = offsite backups + DNS uavhengig av Hetzner. Det er ikke et stort grep, men det må gjøres *før* du trenger det.
- **Limited managed services.** Ingen RDS-aktig managed Postgres. For TSP-alpha er det fint (vi kjører bun:sqlite). For senere skalering må dere selv operere Postgres eller ta inn en separat managed-DB-leverandør.
- **Customer support.** Slow og kald. Hvis noe brenner kl. 03:00, er du alene. Sett opp egen monitoring (Uptime Kuma / BetterStack) og forvent å redde deg selv.
- **Procurement-optikk for offentlig sektor.** En norsk kommune-CFO som leser ROS-analyse kjenner ikke Hetzner. Ikke et nei, men en samtale. Når dere senere selger til kommune-piloter kan dere måtte hoste *deres* deployment et annet sted (eller tilby on-prem). Public-alpha-siten din trenger ikke løse dette nå.

---

## 3. Plan-valg

Hetzner deler skyserverne i fire familier (post-2026-omstrukturering):

| Familie | Hva | Når |
|---|---|---|
| **CX** (Gen3) | Shared vCPU, Intel/AMD, EU-only, billigst | Dev, staging, eksperimenter |
| **CPX** (Gen2) | Shared vCPU, AMD Genoa, global | Webapps med variabel last, lite prod |
| **CAX** | Shared vCPU, ARM Ampere Altra, EU-only | ARM-bygde workloads, lavt strømforbruk |
| **CCX** | **Dedicated vCPU, AMD EPYC, global** | **Prod, signaturtunge backender, manifest-origin** |

I tillegg finnes:
- **AX-line dedicated servers**: kun +3% prisøkning i 2026 — beste verdi per krone hvis dere trenger fast hardware. AX42 på €57.30/mnd gir mer ressurs enn det meste cloud-tilbudet.
- **Server Auction**: refurbished dedikerte, også kun +3% økning, kan finne ekstreme tilbud på 64+ GB RAM-bokser for €40-60/mnd.

### TSP-spesifikke valg

**Public-alpha site + manifest-origin (`truststandardprotocol.com`):**
> CCX13 i Falkenstein (FSN1) eller Helsinki (HEL1). 2 dedicated vCPU, 8 GB RAM, 80 GB NVMe. Ca. €15-17/mnd post-økning. Dedikert vCPU er overkill teknisk men gjør at signatur/canonicalize-throughput er forutsigbart — viktig når en revisor benchmarker mot deres egen kjøretid.

**Risk/Evidence/Oversight/Control Plane backend-piloter:**
> CCX23 eller separat AX41. Bun + bun:sqlite trenger predictable I/O, og du vil ikke ha noisy neighbours på signatur-kjeder. Hvis dere kjører flere moduler på samme boks: separer i systemd-units og bind hver til egen UID.

**Når dere når «første betalende pilot»-skala:**
> Bytt manifest-origin og backend til AX-line dedicated. Lavere kost per ressurs, +3% prisøkning vs. 30-50% på cloud, og full hardware-kontroll. Cloudflare foran fortsatt.

### Region-valg

- **FSN1 (Falkenstein, Tyskland)**: standardvalg. God peering, EU-soil narrative er sterkest fra Tyskland for norsk/EU-publikum.
- **HEL1 (Helsinki, Finland)**: like bra teknisk, marginalt lavere latency til Norge. Velg denne om dere vil ha en finsk-fortelling eller geografisk redundans mot tysk dataarbeid.
- **NBG1 (Nürnberg)**: backup-region. Hvis FSN1 er hoved, og dere senere vil ha multi-DC, er NBG1 trivielt å spinne opp i.

Ikke bruk US- eller Singapore-regioner for TSP-formål. EU-narrativet er en del av produktet.

---

## 4. Arkitektur: Cloudflare foran Hetzner

```
Bruker → Cloudflare (DNS + CDN + DDoS + TLS edge)
         ↓
         Authenticated Origin Pulls (mTLS)
         ↓
         Hetzner CCX13 (Caddy/nginx → Bun/Next.js)
         ↓
         bun:sqlite + lokal disk
         ↓ (snapshot)
         Cloudflare R2 / Backblaze B2 (offsite)
```

Cloudflare gjør tre ting Hetzner ikke gjør:

1. **CDN-cache for `/.well-known/tsp-manifest.json`.** Manifest endrer seg sjelden. Med `Cache-Control: public, max-age=300, stale-while-revalidate=3600` på origin svarer Cloudflare-edge med 0 ms kald-start selv om Hetzner-origin er nede. TSP-demoens uptime slutter å være Hetzner-uptime.
2. **DDoS-beskyttelse og rate-limiting** uten å koste noe.
3. **DNS-uavhengighet.** Hvis Hetzner suspenderer kontoen, beholder dere kontroll over DNS og kan peke til ny origin på minutter.

### Authenticated Origin Pulls (kritisk)

Hetzner-origin lytter kun på Cloudflares mTLS-sertifikat på port 443. Direkte hits på origin-IP avvises. Det gjør IP-leakage harmløst.

```bash
# på origin (Caddy/nginx config)
# kun aksepter klienter som presenterer Cloudflares Origin Pull CA
curl -o /etc/ssl/cloudflare-origin-pull-ca.pem \
  https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem

# nginx eksempel
ssl_client_certificate /etc/ssl/cloudflare-origin-pull-ca.pem;
ssl_verify_client on;
```

I Cloudflare-dashbordet: SSL/TLS → Origin Server → enable Authenticated Origin Pulls.

### TLS-mode

Sett til **Full (strict)** i Cloudflare. Bruk Cloudflare Origin Certificate på Hetzner-origin (15-års levetid, kun gyldig for Cloudflare-edge — perfekt for denne arkitekturen).

Når dere senere vurderer DANE/TLSA: da må dere bytte til public-trust-sertifikater (Let's Encrypt) på origin og publisere TLSA-record i DNSSEC-signert sone. DANE krever DNSSEC — Cloudflare støtter DNSSEC ut av boksen, men ikke alle registrarer signerer riktig. Verifiser hos `dnssec-debugger.verisignlabs.com` før dere annonserer DANE-støtte.

---

## 5. Bootstrap-sjekkliste

Antar Ubuntu 24.04 LTS på en CCX13 i FSN1.

### 5.1 Provisioning

```bash
# 1. Lag SSH-key lokalt hvis du ikke har en
ssh-keygen -t ed25519 -C "julian@lexico" -f ~/.ssh/hetzner_tsp

# 2. I Hetzner Console: Security → SSH Keys → paste public key
# 3. Add Server: CCX13, Ubuntu 24.04, Falkenstein, ssh-key valgt
# 4. Aktiver "Backups" (+20% månedlig) — billig forsikring, men IKKE eneste backup
```

### 5.2 Første 10 minutter på serveren

```bash
ssh -i ~/.ssh/hetzner_tsp root@<server-ip>

# Oppdater og lås ned
apt update && apt upgrade -y
apt install -y ufw fail2ban unattended-upgrades curl git build-essential

# Firewall: kun SSH, og 443 fra Cloudflare-IP-ranges (ikke åpent net)
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
# Cloudflare IP-ranges fra https://www.cloudflare.com/ips/ — automatiser via cron
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
  ufw allow from $ip to any port 443 proto tcp
done
for ip in $(curl -s https://www.cloudflare.com/ips-v6); do
  ufw allow from $ip to any port 443 proto tcp
done
ufw --force enable

# Non-root user for app
adduser --disabled-password --gecos "" tsp
mkdir -p /home/tsp/.ssh
cp ~/.ssh/authorized_keys /home/tsp/.ssh/
chown -R tsp:tsp /home/tsp/.ssh
chmod 700 /home/tsp/.ssh
chmod 600 /home/tsp/.ssh/authorized_keys

# Slå av password-login på SSH
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl restart ssh

# Automatiske security-oppdateringer
dpkg-reconfigure -plow unattended-upgrades
```

### 5.3 Installer Bun og Node (Node kun for kompatibilitet)

```bash
sudo -u tsp -i
curl -fsSL https://bun.sh/install | bash
# Bun i ~/.bun/bin — legg til PATH i ~/.bashrc

# Node 22 LTS — ikke nødvendig for TSP, men nyttig for fallback
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### 5.4 Deploy TSP-stacken

```bash
# Som tsp-user
cd /home/tsp
git clone https://github.com/lexitsp/tsp-site.git    # når public split er gjort
cd tsp-site
bun install
bun run build  # 55 sider builder grønt

# Test lokalt
bun run start  # port 3838
```

### 5.5 Reverse proxy + TLS (Caddy anbefales)

Caddy er enklere enn nginx for denne use-casen og håndterer mTLS-verifikasjon godt:

```bash
sudo apt install -y caddy
```

`/etc/caddy/Caddyfile`:

```caddy
truststandardprotocol.com {
  # Cloudflare Origin Certificate
  tls /etc/ssl/cloudflare-origin.pem /etc/ssl/cloudflare-origin-key.pem {
    client_auth {
      mode require_and_verify
      trust_pool file /etc/ssl/cloudflare-origin-pull-ca.pem
    }
  }

  # Cache-control for manifest
  @manifest path /.well-known/tsp-manifest.json /examples/manifest.json
  header @manifest Cache-Control "public, max-age=300, stale-while-revalidate=3600"

  reverse_proxy 127.0.0.1:3838
}
```

```bash
sudo systemctl enable --now caddy
```

### 5.6 Systemd-unit for TSP-siten

`/etc/systemd/system/tsp-site.service`:

```ini
[Unit]
Description=TSP Public Alpha Site
After=network.target

[Service]
Type=simple
User=tsp
WorkingDirectory=/home/tsp/tsp-site
Environment=NODE_ENV=production
Environment=PORT=3838
ExecStart=/home/tsp/.bun/bin/bun run start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now tsp-site
sudo journalctl -u tsp-site -f
```

### 5.7 Cloudflare-side

I Cloudflare-dashbordet:

1. Add site → `truststandardprotocol.com` → endre nameservers hos registrar.
2. DNS: A-record `@` → Hetzner-IP, **Proxied (orange cloud)**.
3. SSL/TLS → **Full (strict)**.
4. SSL/TLS → Edge Certificates → enable **Always Use HTTPS**, **HSTS** (max-age 6mnd, includeSubdomains, preload).
5. SSL/TLS → Origin Server → enable **Authenticated Origin Pulls**.
6. Security → Bots → enable **Bot Fight Mode** (gratis).
7. Caching → Cache Rules → cache `/.well-known/tsp-manifest.json` aggresivt, men respekter origin Cache-Control.

---

## 6. Backup-strategi (kritisk for konto-suspensjons-risiko)

**Regel: backups som lever kun på Hetzner finnes ikke for risiko-formål.**

Trelagsmodell:

### Lag 1: Hetzner Cloud Backups (built-in)
+20% månedlig på serverkost. Daglige snapshots, opptil 7. Bra mot egen-feil (oops, slettet katalog). Ikke bra mot konto-suspensjon — slettes med kontoen.

### Lag 2: Hetzner Snapshots (manuelle)
Gratis å lage, koster lagring. Ta før hver større endring. Også sårbar for konto-suspensjon, så kun til komfort.

### Lag 3: Offsite til Cloudflare R2 eller Backblaze B2 (obligatorisk)
Daglig push av kritiske data utenfor Hetzner-kontoen.

Hva må offsite:

- `bun:sqlite`-databaser (Risk/Evidence/Oversight)
- Manifest-filer og PKI-strukturen
- `messages/` (i18n) — strengtatt i git også, men dobbelt opp
- Caddyfile, systemd-units, og UFW-config (rask redeploy)
- **IKKE** signaturnøkler: de skal være offline på maskinvare som ikke er Hetzner uansett

Eksempel-script `/usr/local/bin/tsp-offsite-backup.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

DATE=$(date +%Y-%m-%d)
TMP=/tmp/tsp-backup-$DATE
mkdir -p $TMP

# Snapshot SQLite med .backup (atomic)
for db in /home/tsp/data/*.sqlite; do
  name=$(basename $db .sqlite)
  sqlite3 $db ".backup $TMP/$name.sqlite"
done

# Tar opp viktig config
tar czf $TMP/config.tar.gz \
  /etc/caddy/Caddyfile \
  /etc/systemd/system/tsp-*.service \
  /etc/ufw/user.rules \
  /home/tsp/tsp-site/.env.production 2>/dev/null || true

# Krypter med passphrase fra /root/.backup-key (chmod 600)
PASS=$(cat /root/.backup-key)
tar czf - -C $TMP . | \
  gpg --symmetric --batch --passphrase "$PASS" \
      --cipher-algo AES256 \
      -o /tmp/tsp-backup-$DATE.tar.gz.gpg

# Push til R2 via rclone (config gjort separat)
rclone copy /tmp/tsp-backup-$DATE.tar.gz.gpg r2:tsp-backups/

# Behold siste 30 dager
rclone delete --min-age 30d r2:tsp-backups/

# Rydd lokalt
rm -rf $TMP /tmp/tsp-backup-$DATE.tar.gz.gpg
```

Crontab:
```
0 3 * * * /usr/local/bin/tsp-offsite-backup.sh >> /var/log/tsp-backup.log 2>&1
```

**Test restore månedlig.** En backup du ikke har restorert er en hypotese, ikke en backup. Spinn opp en throwaway CPX22, pull siste backup fra R2, dekrypter, restorer SQLite, valider at envelopes verifiserer mot manifest. Logg datoen i `docs/ops/backup-restore-log.md`.

---

## 7. TSP-spesifikke hensyn

### 7.1 Manifest-endepunktets pålitelighet er protokollens pålitelighet

Hver ekstern verifier som kjører `verifyLocal()` fetcher `truststandardprotocol.com/.well-known/tsp-manifest.json`. Hvis det er nede, er TSP-demoen nede.

- Cloudflare-cache + stale-while-revalidate gir 0 ms svar selv ved origin-feil.
- Vurder å parallellpublisere på `tsp.lexico.no` (LexiCo-eid teknisk alias) med samme manifest og DNS-failover via Cloudflare Load Balancer.
- **Sjekk hver dag** at endepunktet svarer 200 og at signaturen verifiserer. BetterStack eller Uptime Kuma med HTTP-content-assertion.

### 7.2 DANE/TLSA-readiness

Hvis dere annonserer DANE-støtte i speccen senere, må Hetzner-origin servere et TLS-cert som matcher TLSA-record. Da kan dere ikke bruke Cloudflare Origin Certificate (kun gyldig for Cloudflare). Veien: Let's Encrypt på origin, Cloudflare i "Full (strict)"-mode, publiser TLSA-record som matcher origin-cert. Cloudflare-edgen vil fortsatt presentere eget cert til klient, så DANE-validering må gjøres mot origin direkte (dvs. utenom Cloudflare). Det er en design-beslutning som må tas eksplisitt — det betyr i praksis at DANE-verifiserende klienter bypasser Cloudflare.

For public-alpha: ikke aktiver DANE. Marker som spec-støttet men ikke deployment-aktivert. Charter §6 (språk matcher kode) krever at dette er tydelig.

### 7.3 Sovereign-by-default-konsistens

Charter §1: SDK skal ikke telemeter, ikke phone home. Det betyr også at *demo-deployment* skal ikke gjøre det. Sett opp:

- Cloudflare Web Analytics (cookieless, GDPR-fri) i stedet for Google Analytics
- Slå av alle Cloudflare-features som krever JavaScript-injection (Rocket Loader, Email Obfuscation)
- Ingen sentry/datadog/loggly i public site

### 7.4 Bun-specifikk drift

- `bun --smol` flag for å redusere minneforbruk på små bokser
- Bun crash dump → systemd loggin er fine; sett `Restart=on-failure` med rimelig RestartSec
- bun:sqlite WAL-mode: `PRAGMA journal_mode=WAL` for å unngå låsing under signatur-burst
- Periodisk `PRAGMA wal_checkpoint(FULL)` — viktig for å holde WAL-fil under kontroll. Hver natt før backup.

---

## 8. Når flytte / skalere

Bytt arkitektur når én av disse trigges:

| Trigger | Neste steg |
|---|---|
| Første betalende pilot signert | Bytt til AX-line dedicated, separat boks per kunde-pilot |
| Norsk offentlig sektor i pilot-stadiet | Vurder NORSK-eid hosting (Basefarm, IT-Bedriften, Powertech) for *deres* deployment — behold Hetzner for `truststandardprotocol.com` |
| >100 req/s sustained mot manifest | Behold arkitektur, men eksporter manifest til R2 + Cloudflare-rute direkte fra R2 (slutt å hit Hetzner-origin) |
| Multi-tenant control-plane skal være public-SaaS | Da må dere ha managed Postgres et sted (Neon, Supabase, eller Hetzner Managed Database når det modnes) |
| Datatilsynet eller revisor kommenterer hosting-valg | Da har dere et reelt datapunkt og kan ta beslutningen informert |

---

## 9. Quick reference

### Påloggings-cheatsheet
```bash
ssh -i ~/.ssh/hetzner_tsp tsp@<server-ip>
sudo systemctl status tsp-site
sudo journalctl -u tsp-site -f
sudo systemctl status caddy
sudo journalctl -u caddy -f --since "10 min ago"
```

### Deploy-flyt (manuell)
```bash
ssh tsp@<server-ip>
cd ~/tsp-site
git pull
bun install
bun run build
sudo systemctl restart tsp-site
```

### Health-check
```bash
curl -fsS https://truststandardprotocol.com/.well-known/tsp-manifest.json \
  | jq -e '.tsp == "3.0" and .organization.domain == "truststandardprotocol.com" and (.rootSignatureOverManifest | type == "string")'
curl -fsS https://truststandardprotocol.com/api/health  # når implementert
```

### Backup-verifikasjon
```bash
rclone ls r2:tsp-backups/ | tail -5
# Sist månedlig restore-test: <YYYY-MM-DD>  ← oppdater i docs/ops/backup-restore-log.md
```

### IP-whitelist-refresh (Cloudflare endrer ranges av og til)
```bash
# Kjør hvert kvartal — Cloudflare oppdaterer IP-ranges sjelden, men gjør det
sudo /usr/local/bin/refresh-cf-ips.sh
```

---

## 10. Footguns spesifikke for Hetzner

- **Konto-suspensjon uten varsel.** Verifiser virksomheten din i Hetzner-kontoen så tidlig som mulig (last opp LexiCo AS-registrering). Verifiserte business-accounts har vesentlig lavere suspensjons-rate.
- **Abuse-rapporter.** Hetzner videresender alt automatisk. Hold en aktiv abuse@truststandardprotocol.com og svar innen 24 timer på alt. Ikke-respons = automatisk suspensjon.
- **Backup på samme konto er ikke backup.** Repeterer for syvende gang. R2 eller B2 utenfor Hetzner.
- **Cloud Backup-feature sletter ved server-cancel.** Hvis dere oppgraderer/migrerer en server, EXPORT først til snapshot, så cancel.
- **Storage Box ≠ encrypted-at-rest av default.** Krypter klientside før upload (eksempel-scriptet over gjør det med gpg).
- **Object Storage er nytt på Hetzner og mindre modent enn R2/B2.** Bruk det kun til ikke-kritisk lagring inntil videre.

---

## 11. Kostnadsestimat (post-april-2026)

| Komponent | Plan | Kost/mnd |
|---|---|---|
| TSP public site + manifest-origin | CCX13 Falkenstein | ~€16 |
| Backend-piloter (Risk/Evidence/Oversight, samlet) | CCX23 Falkenstein | ~€32 |
| Hetzner Cloud Backups (begge servere) | +20% | ~€10 |
| Cloudflare Free plan | — | €0 |
| Cloudflare R2 (10 GB backups, 100 GB egress) | — | ~€1 |
| Cloudflare-domener (truststandardprotocol.com + optional .org redirect) | — | ~€10/år |
| **Sum (cloud + backup-egress)** | | **~€60/mnd** |

Til sammenligning: tilsvarende setup på Vercel Pro + Supabase + Cloudflare R2 ville være €60-100/mnd kun for én av tjenestene. Hetzner-rammen lar dere holde charterets «under 5000 NOK/mnd»-disiplin selv etter at backend-piloter er live.

---

## 12. Eskalering hvis Hetzner-kontoen suspenderes

Skritt-for-skritt redeploy (sikt på <2 timer fra suspensjon til oppe igjen):

1. **DNS allerede hos Cloudflare** → fortsatt under kontroll. Bra.
2. Spinn opp en CCX13 hos **Scaleway** (Paris, €18/mnd) eller **OVHcloud** (Roubaix, €15/mnd) som backup-leverandør. Begge er EU-soil.
3. SSH inn, kjør bootstrap-sjekklisten (5.1-5.6). Med automatisering i Ansible/Terraform: 20 minutter.
4. `rclone copy r2:tsp-backups/<siste-dato>.tar.gz.gpg .`, dekrypter, restorer.
5. Cloudflare DNS A-record peker mot ny IP. TTL er 300 — propagerer på minutter.
6. Send mail til Hetzner support angående suspensjon-detaljer. Vurder å holde sekundær leverandør permanent etter dette.
7. Post-mortem i `docs/ops/incidents/`. Vurder om dual-host-arkitektur skal være standard fremover.

Test denne prosedyren én gang før dere trenger den, ellers er den fantasi.

---

*Sist oppdatert: 2026-05-13. Sjekk Hetzner pricing-page før plan-bytte — pricing-økninger trigger med 30-dagers varsel.*
