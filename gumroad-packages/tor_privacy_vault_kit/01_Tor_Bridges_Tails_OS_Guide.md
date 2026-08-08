# 01. TOR BRIDGES, TAILS OS & ONION ROUTING MASTER GUIDE

## 1. Tor Browser Security Level Configuration
* **Standard**: All Tor Browser and website features are enabled.
* **Safer**: Disables HTML5 video/audio playback media codecs, disables JavaScript on non-HTTPS sites, and forces strict math/font rendering.
* **Safest**: Disables JavaScript by default on all sites; disables certain fonts, icons, math symbols, and images.

## 2. Configuring Obfs4 Pluggable Bridges
When ISP or nation-state censorship blocks standard Tor relay connections:
1. Open Tor Browser -> `Settings` -> `Connection`.
2. Under `Bridges`, select `Use a built-in bridge` -> `obfs4` (or `meek-azure` / `snowflake`).
3. Alternatively, request bridges via email: Send `get bridges` to `bridges@torproject.org` from a Gmail or Riseup account.

## 3. Bootable Tails OS USB Installation Guide
Tails (The Amnesic Incognito Live System) runs entirely from RAM, leaving zero digital footprints on computer hard drives.

### Requirements:
- 1x USB Flash Drive (8GB minimum)
- Official Tails ISO image (`tails-amd64-*.img`)
- BalenaEtcher or `dd` utility

### Flash via Terminal (`dd`):
```bash
sudo dd if=tails-amd64-6.0.img of=/dev/sdX bs=16M status=progress conv=fsync
```

### Operational Best Practices:
- Always boot with Persistent Storage encrypted with 30+ character passphrase.
- Never unlock persistent storage on untrusted or compromised host hardware.
