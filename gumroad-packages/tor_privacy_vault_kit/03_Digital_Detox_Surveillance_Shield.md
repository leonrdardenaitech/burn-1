# 03. DIGITAL DETOX & SURVEILLANCE SHIELD PROTOCOL

## 1. Algorithmic Fatigue & Commercial Tracker Opt-Out
Commercial web trackers and ad networks build cross-site behavioral profiles.

### Defensive Countermeasures:
- **DNS-Level Filtering**: Deploy NextDNS or Pi-hole with StevenBlack & OISD blocklists.
- **Browser Hardening**: Install uBlock Origin in Medium Mode (`block 3rd-party scripts/frames`).
- **Canvas/Audio Fingerprint Mitigation**: Enable `privacy.resistFingerprinting` in Firefox `about:config`.

## 2. Encrypted Messaging Deployment (Signal & Session)

### Signal Messenger
- **Phone Number Privacy**: Set username and hide phone number under `Settings` -> `Privacy` -> `Phone Number`.
- **Disappearing Messages**: Set default timer to 1 day or 1 hour for all new chats.

### Session Messenger (Zero Metadata)
- **Onion Routing**: Messages are routed through decentralized Lokinet nodes.
- **Zero Phone Number Needed**: Session generates a 66-character hex Account ID with zero personal identifier requirements.
