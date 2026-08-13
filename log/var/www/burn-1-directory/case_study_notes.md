# CASE STUDY NOTES: BURN-1 DIRECTORY & DIGITAL KIOSK NETWORK
**Deployment Target Path**: `/var/www/burn-1-directory`  
**System Architecture**: Burn-1 Systems Enterprise Directory & Subdomain Digital Business Card Network  
**Date**: August 13, 2026  
**Status**: LIVE & DEPLOYED (`main` branch)

---

## 1. Executive Summary
The **Burn-1 Directory Platform** bridges physical commercial real estate (plazas, storefronts, kiosks) with high-efficiency digital micro-sites and interactive business cards. Deployed directly to `/var/www/burn-1-directory` and integrated into the primary portal, this deployment provides local Atlanta Metro merchants (Decatur, Lithonia, Stonecrest) with zero-friction mobile accessibility and QR coupon redemption.

---

## 2. Core System Components

### A. Physical Plaza Directory Hub (`burn1-business-directory-v4.html`)
- **Visual Design**: Reflective silver chrome casing with matted grey satin holders and neon blue ambient accents.
- **Merchant Roster**: Grounded commercial directory featuring active local businesses:
  - *Tadda's Fitness Center* (Decatur, GA)
  - *Gladiator Martial Arts* (Decatur, GA)
  - *The Cigar Bar* (Lithonia, GA)
  - *Auto Motion Wheel Repairs* (Lithonia, GA)
  - *A&C Event Space* (Decatur, GA)
  - *Force Xtreme Cheer* (Decatur, GA)
  - *Steel Mill Wellness Center* (Decatur, GA)
  - *Progressive Dental Group* (Lithonia, GA)
- **Interactive Features**: Dynamic category filtering, embedded digital lobby video stream, inline QR coupon code popups, and click-to-call modal integration.

### B. Subdomain Digital Card Router (`burn1-digital-card.html`)
- **Routing Engine**: Dual-mode URL resolution handling both production subdomains (`[merchant-slug].burn-1.com`) and local query parameter testing (`burn1-digital-card.html?biz=[merchant-slug]`).
- **Glassmorphism UI**: High-contrast dark acrylic card with status pulse indicators, active telephone action protocol (`tel:`), and Google Maps direct navigation API routing.
- **Fallback Circuit**: Interactive list view enabling visitors to select any verified merchant if accessed without a specific subdomain.

---

## 3. Server & Directory Structure (`/var/www/burn-1-directory`)

```
/var/www/burn-1-directory/
├── index.html                           # Main Burn-1 Portal Hub
├── store.html                           # Digital Product & Kiosk Storefront
├── burn1-business-directory-v4.html     # Physical Plaza Directory Hub V4
├── burn1-digital-card.html              # Subdomain Business Card Engine
├── helpline/                            # 24/7 Crisis Hotline Directory
├── friedbrains-world/                   # Privacy & Telemetry Telemetry Suite
└── log/
    └── var/
        └── www/
            └── burn-1-directory/
                └── case_study_notes.md  # Case Study & Architectural Logs
```

---

## 4. Deployment Verification & Git Logs
- **Git Repository**: `https://github.com/leonrdardenaitech/burn-1.git`
- **Commit Details**:
  - `70adb97`: Added `burn1-business-directory-v4.html` and `burn1-digital-card.html` to `burn-1.com` directory network.
  - Linked homepage section `#site-directory` to point to V4 Business Directory and Digital Card router.
- **Status**: Verified clean working tree, remote branch `origin/main` synchronized.

---

*Case Study Log Maintained by Burn-1 Systems OpSec & Directory Team.*
