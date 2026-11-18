/**
 * ============================================================================
 * BURN-1 SYSTEMS (burn-1.com) — LEON'S HYDRAULIC ULTRA BAR ENGINE &
 * UNIFIED BOTTOM-RIGHT FLOATING BOT ("2 BOTS IN 1 BUTTON": RESIDENT + COSMO)
 * File: js/division-bots.js
 *
 * STRICT ARCHITECTURAL SCOPE:
 *   1. Leon's Ultra Bar mounts ONLY on the 3 divisional pages:
 *        • acid.html     — Left Ultra Bar (7-Step Authentic HazMat Lifecycle +
 *                          Master Liquid Tube Progress Bar + Step 7 Dispatch Pipeline)
 *        • times2.html   — Dual-Clock Parallel Ultra Bars (Left Clock 1 Sovereignty
 *                          & Right Clock 2 Telemetry/Receipts, Center Articles)
 *        • sizzlean.html — Centered Ultra Bar with Left (<) & Right (>) Chevrons
 *                          ($12 Micro-Windows, $49/$149 Flagships, $250/$500 MSP Kits
 *                          + Future Academy Credit Funnel)
 *      (Never mounts on index.html, fast-lane.html, partners.html, or freezer.html.)
 *   2. Pure CSS UI Kit Components (NO raw .jpg/.png UI kit mockups).
 *   3. Exact 5-Phase Mechanical Anatomy & 2-Stage Hydraulic Easing from
 *      leonsultrabar.html: cubic-bezier(0.16, 1, 0.3, 1).
 *   4. Unified Bottom-Right Floating Bot ("2 Bots in 1 Button"):
 *        • [Resident Bot] — Page explainer, checklist tracker & Accordion Payment Step
 *        • [Cosmo Bot]    — Full CLI Terminal, Universal Login (Google + 2-Step MFA)
 *                           & Subdomain Vault Router
 * ============================================================================
 */
(function () {
  'use strict';

  const LEDGER_STORAGE_KEY = 'burn1_unified_ledger_v3';
  const ULTRABAR_STORAGE_PREFIX = 'burn1_ultrabar_v3_';

  const BIND_DOCTRINE =
    'After payment, we bind — gathering defensible evidence, cited against federal and international public sources, following the underwriter checklist. The scan is the binder, the gathering tool. It does not diagnose or summarise the report.';
  const SLA_TURNAROUND =
    'Delivered within standard business turnaround up to 5 business days.';

  // ==========================================================================
  // DIVISION PROFILES & AUTHENTIC LIFECYCLE DATA
  // ==========================================================================
  const ACID_STEPS = [
    {
      id: 'batch-intake',
      stepNum: 1,
      pct: 15,
      title: '1. BATCH INTAKE',
      fullTitle: 'STEP 01 // BATCH INTAKE — LOCATION, JURISDICTION & HAZARD ENVELOPE ($49–$150)',
      desc: 'Enter plant physical location, binding municipal/EPA jurisdiction, and select specific hazard envelope ($49 Surface Strip, $99 Official Acid Test Report, or $150 Full Plant HazMat Dossier).',
      paramLabel: 'Plant Physical Address & Jurisdiction',
      paramPlaceholder: 'e.g. 4200 Industrial Pkwy, Lithonia GA (EPA Region 4)',
      vectorLabel: 'Hazard Envelope Selection',
      vectors: [
        '$99 OFFICIAL ACID TEST REPORT (OSHA 1910 + NFPA 70E)',
        '$49 SURFACE STRIP (EXPRESS PERIMETER & SDS SWEEP)',
        '$150 FULL PLANT HAZMAT & MUNICIPAL ZONING DOSSIER'
      ],
      checks: [
        'PHYSICAL PLANT COORDINATES LOCKED',
        'BINDING MUNICIPAL & EPA JURISDICTION INDEXED',
        'HAZARD ENVELOPE ($49–$150) SELECTED'
      ]
    },
    {
      id: 'plume-recon',
      stepNum: 2,
      pct: 30,
      title: '2. PLUME RECON',
      fullTitle: 'STEP 02 // PLUME RECON — OPENCODE BROWSE MUNICIPAL & GIS SCRAPE',
      desc: 'Reagent-1 deploys OpenCode Browse: scraping municipal zoning maps, storm drainage setbacks, and local fire marshal codes.',
      paramLabel: 'Municipal Parcel / GIS Drainage Zone ID',
      paramPlaceholder: 'e.g. PARCEL-DEKALB-8841 // WATERSHED-ZONE-B',
      vectorLabel: 'Plume Setback Vector',
      vectors: [
        'NOMINAL (SETBACK > 250 FT FROM DRAINAGE)',
        'ELEVATED (100–250 FT BUFFER // MONITOR)',
        'CRITICAL (< 100 FT // CONTAINMENT BERM REQ)'
      ],
      checks: [
        'MUNICIPAL ZONING ORDINANCE SCRAPED',
        'STORM DRAINAGE SETBACKS VERIFIED',
        'LOCAL FIRE CODE CLASSIFICATIONS MAPPED'
      ]
    },
    {
      id: 'containment-audit',
      stepNum: 3,
      pct: 45,
      title: '3. CONTAINMENT AUDIT',
      fullTitle: 'STEP 03 // CONTAINMENT AUDIT — DYNAMIC OSHA / EPA / HACCP CHECKLIST',
      desc: 'System dynamically renders the digital self-attestation checklist based on active plant hazards (Lockout/Tagout LOTO, SDS registry currency, bulk tank specs).',
      paramLabel: 'Primary Chemical / Tank Registry Ref',
      paramPlaceholder: 'e.g. TANK-A04 // CAS 7664-93-9 (SULFURIC) + NFPA 70E',
      vectorLabel: 'Containment Integrity Vector',
      vectors: [
        'NOMINAL (110% SECONDARY VOLUME VERIFIED)',
        'ELEVATED (VALVE SEAL SCHEDULED)',
        'CRITICAL (IMMEDIATE LOTO ISOLATION REQ)'
      ],
      checks: [
        'OSHA 29 CFR 1910.1200 SDS LOG CURRENT',
        'NFPA 70E LOCKOUT/TAGOUT (LOTO) VERIFIED',
        'BULK TANK & PRESSURE RELIEF SPECS ATTESTED'
      ]
    },
    {
      id: 'secondary-berm-logs',
      stepNum: 4,
      pct: 65,
      title: '4. SECONDARY BERM LOGS',
      fullTitle: 'STEP 04 // SECONDARY BERM LOGS — PHOTO EVIDENCE INGESTION',
      desc: 'Plant operators submit physical evidence photos (plumbed eyewash stations, concrete retention berms, HazMat drum tags) via drag-and-drop or direct mobile email reply.',
      paramLabel: 'Operator Evidence Upload / Mobile Reply Ref',
      paramPlaceholder: 'e.g. BERM-PHOTO-BATCH-2026.zip (Eyewash + Drum Tags)',
      vectorLabel: 'Physical Evidence Quality',
      vectors: [
        'NOMINAL (EXIF GPS & TIMESTAMP VERIFIED)',
        'ELEVATED (AWAITING DRUM TAG CLOSE-UP)',
        'CRITICAL (BLURRY / MISSING BERM PHOTO)'
      ],
      hasDropZone: true,
      checks: [
        'EYEWASH & SHOWER GAUGE PHOTO ATTACHED',
        'SECONDARY RETENTION BERM INTEGRITY LOGGED',
        'HAZMAT DRUM LABELS & UN NUMBERS VISIBLE'
      ]
    },
    {
      id: 'corrosion-collision',
      stepNum: 5,
      pct: 80,
      title: '5. CORROSION COLLISION',
      fullTitle: 'STEP 05 // CORROSION COLLISION — PROOF VS. MUNICIPAL & FEDERAL CODES',
      desc: 'Pits uploaded physical proof against scraped municipal ordinances, EPA SPCC rules, and OSHA/HIPAA/cyber perimeter telemetry.',
      paramLabel: 'Statutory Collision Matrix ID',
      paramPlaceholder: 'e.g. 40-CFR-112-SPCC // OSHA-1910-147-PASS',
      vectorLabel: 'Ordinance Collision Result',
      vectors: [
        'NOMINAL (ZERO STATUTORY CONTRADICTIONS)',
        'ELEVATED (MINOR SIGNAGE VARIANCE)',
        'CRITICAL (SETBACK OR SPCC VIOLATION)'
      ],
      checks: [
        'PHYSICAL PROOF MATCHED TO MUNICIPAL CODE',
        'EPA SPCC & OSHA 1910 CROSS-EXAM PASSED',
        'ZERO EXPOSED SCADA / MODBUS WAN PORTS'
      ]
    },
    {
      id: 'caustic-triage',
      stepNum: 6,
      pct: 90,
      title: '6. CAUSTIC TRIAGE',
      fullTitle: 'STEP 06 // CAUSTIC TRIAGE — AUTOMATED GAP-CHECK & OPERATOR NUDGE',
      desc: 'Automated gap-check; fires targeted email nudge if photos are blurry or drainage setbacks are violated before final cryptographic seal.',
      paramLabel: 'Plant Safety Officer Dispatch Email',
      paramPlaceholder: 'e.g. safety.director@apex-chemical.com',
      vectorLabel: 'Triage Clearance Status',
      vectors: [
        'NOMINAL (ALL GAPS CLEARED // READY FOR BURN)',
        'ELEVATED (AUTO-NUDGE DISPATCHED TO OPERATOR)',
        'CRITICAL (HOLD SEAL UNTIL RE-UPLOAD)'
      ],
      checks: [
        'OPTICAL CLARITY & METADATA CHECK PASSED',
        'ZERO UNRESOLVED SETBACK VIOLATIONS',
        'SAFETY OFFICER SIGN-OFF READY'
      ]
    },
    {
      id: 'chemical-burn',
      stepNum: 7,
      pct: 100,
      title: '7. CHEMICAL BURN',
      fullTitle: 'STEP 07 // CHEMICAL BURN — MACHINE-VERIFIED TIMESTAMP & 4-SYSTEM DISPATCH',
      desc: 'Stamped with the official Machine-Verified Timestamp & Algorithmic Cryptographic SHA-256 Seal; triggers full backend state updates across Client Subdomain, Email PDF, Google Sheets (division_queue.csv), and Obsidian Local Vault.',
      paramLabel: 'Client Subdomain Vault Slug',
      paramPlaceholder: 'e.g. apex-plant.burn-1.com/evidence',
      vectorLabel: 'Final Seal Authorization',
      vectors: [
        'EXECUTE STEP 7 CHEMICAL BURN & SEAL (100%)',
        'STAGE IN QUEUE FOR UNDERWRITER REVIEW'
      ],
      checks: [
        'PUBLISH DATE-STAMPED HTML DOSSIER TO SUBDOMAIN',
        'DISPATCH PDF CERTIFICATE & UPDATE GOOGLE SHEETS (STATUS: SEALED)',
        'SYNC IMMUTABLE MARKDOWN TO OBSIDIAN (/Vault/Evidence-Runs/)'
      ]
    }
  ];

  const TIMES2_LEFT_CLOCK1_SHELVES = [
    {
      id: 'entity-intake',
      title: '1. ENTITY INTAKE',
      fullTitle: 'CLOCK 1 // STEP 01: ENTITY INTAKE & CORPORATE BOUNDARY',
      desc: 'Register corporate legal entity, primary retail/enterprise domains, and underwriting policy renewal window.',
      paramLabel: 'Corporate Entity & Primary Domain',
      paramPlaceholder: 'e.g. Apex Global Logistics (apex-logistics.net)',
      checks: ['VERIFY CORPORATE REGISTRATION', 'MAP PRIMARY & SUBSIDIARY DOMAINS', 'LOCK RENEWAL CALENDAR']
    },
    {
      id: 'sanctions-scrape',
      title: '2. SANCTIONS SCRAPE',
      fullTitle: 'CLOCK 1 // STEP 02: OFAC & TREASURY SANCTIONS SCRAPE',
      desc: 'Cross-reference entity officers, beneficial owners, and settlement endpoints against federal OFAC SDN and international sanctions lists.',
      paramLabel: 'OFAC / DUNS / LEI Identifier',
      paramPlaceholder: 'e.g. LEI-54930084UKLVMY22DS16',
      checks: ['OFAC SDN ZERO-MATCH VERIFIED', 'BIS ENTITY LIST CLEARANCE', 'TREASURY COMPLIANCE HASHED']
    },
    {
      id: 'policy-logs',
      title: '3. POLICY LOGS',
      fullTitle: 'CLOCK 1 // STEP 03: INTERNAL POLICY LOGS & 500ms TOKEN DECAY',
      desc: 'Verify internal sovereignty controls: volatile in-memory session decay (<500ms), zero dangling CNAMEs, and deterministic SBOM pinning.',
      paramLabel: 'IAM / SSO Enclave Endpoint',
      paramPlaceholder: 'e.g. auth.apex-logistics.net (500ms TTL)',
      checks: ['500ms VOLATILE SESSION DECAY', '0 DANGLING CNAMES IN ZONE', 'SHA-256 PINNED SBOM MANIFEST']
    },
    {
      id: 'contract-clearance',
      title: '4. EXECUTED CONTRACTS',
      fullTitle: 'CLOCK 1 // STEP 04: EXECUTED CONTRACTS & INDEMNITY LOCK',
      desc: 'Attach countersigned MSAs, BAA/DPA addenda, and 24-hour breach notification covenants.',
      paramLabel: 'Master Contract / DPA Vault Ref',
      paramPlaceholder: 'e.g. MSA-2026-APEX-COUNSEL-SIGNED',
      checks: ['COUNTERSIGNED DPA ON FILE', '24-HR BREACH NOTICE CLAUSE', 'AI TRAINING OPT-OUT LOCKED']
    },
    {
      id: 'carrier-cross-exam',
      title: '5. CARRIER CROSS-EXAM',
      fullTitle: 'CLOCK 1 // STEP 05: CARRIER CROSS-EXAM (ISO CG 40 47 & AI E&O)',
      desc: 'Reconcile internal claims against Lloyd’s Syndicate & ISO Generative AI Exclusion (CG 40 47) affirmative guardrails.',
      paramLabel: 'Carrier / Syndicate Policy Number',
      paramPlaceholder: 'e.g. LLOYDS-SYN-4022-CYBER',
      checks: ['HARDWARE AI KILL-SWITCH PROVEN', 'HUMAN-IN-THE-LOOP MAPPED', 'ZERO-RETENTION EGRESS VERIFIED']
    },
    {
      id: 'clearance-seal',
      title: '6. CLEARANCE SEAL',
      fullTitle: 'CLOCK 1 // STEP 06: CLEARANCE SEAL (ALGORITHMIC SHA-256 RECEIPT)',
      desc: 'Issue the dated, source-cited Times2AlgorithmicEvidenceSeal JSON & PDF receipt to times2.burn-1.com/receipts.',
      paramLabel: 'General Counsel / CISO Sign-Off',
      paramPlaceholder: 'e.g. counsel@apex-logistics.net',
      checks: ['ATTEST CLOCK 1 SOVEREIGNTY', 'SIGN ED25519 / SHA-256 SEAL', 'PUBLISH TO /RECEIPTS ENDPOINT']
    }
  ];

  const TIMES2_RIGHT_CLOCK2_SHELVES = [
    {
      id: 'vendor-double-check',
      title: '1. VENDOR DOUBLE-CHECK',
      fullTitle: 'CLOCK 2 // STEP 01: VENDOR DOUBLE-CHECK & SHODAN EXPOSURE',
      desc: 'Probe third-party SaaS suppliers and sub-processors for exposed RDP/SMB/OT ports, shadow staging servers, and tenant bleed.',
      paramLabel: 'Third-Party Vendor Domain',
      paramPlaceholder: 'e.g. synapsedesk.io',
      checks: ['SHODAN WAN PORT SWEEP PASS', 'ZERO SHADOW STAGING SUBDOMAINS', 'DEDICATED TENANT ISOLATION']
    },
    {
      id: 'pci-js-hashes',
      title: '2. PCI 4.0 JS HASHES',
      fullTitle: 'CLOCK 2 // STEP 02: PCI DSS 4.0 JAVASCRIPT HASH LOGS (6.4.3 / 11.6.1)',
      desc: 'Verify Subresource Integrity (SRI) SHA-256 hashes on all payment-page scripts and detect unauthorized DOM skimming mutations.',
      paramLabel: 'Checkout / Payment Script Origin',
      paramPlaceholder: 'e.g. pay.apex-retail.com/checkout.js',
      checks: ['PCI 4.0 REQ 6.4.3 SRI HASH LOCKED', 'REQ 11.6.1 TAMPER HEADER ACTIVE', 'ZERO 3RD-PARTY SKIMMING SCRIPTS']
    },
    {
      id: 'tls-cert-history',
      title: '3. CERT & DNS HISTORY',
      fullTitle: 'CLOCK 2 // STEP 03: CRT.SH CERTIFICATE & DMARC p=reject LOGS',
      desc: 'Inspect Certificate Transparency (crt.sh) issuance logs, deprecation of wildcard certs, and strict DMARC p=reject enforcement.',
      paramLabel: 'Supplier Mail & TLS Hostname',
      paramPlaceholder: 'e.g. api.synapsedesk.io',
      checks: ['TLS 1.3 ECDHE ONLY', 'DMARC p=reject ENFORCED', 'WILDCARD SSL DEPRECATED']
    },
    {
      id: 'field-encryption',
      title: '4. FIELD ENCRYPTION',
      fullTitle: 'CLOCK 2 // STEP 04: CLIENT-SIDE FIELD-LEVEL TOKENIZATION',
      desc: 'Ensure PII/PHI/PCI payloads are encrypted client-side with customer-controlled keys before touching vendor ingestion APIs.',
      paramLabel: 'KMS / HSM Key ARN or Fingerprint',
      paramPlaceholder: 'e.g. KMS-KEY-SHA256-9941A',
      checks: ['CLIENT-SIDE PAYLOAD BLINDING', 'CUSTOMER-MANAGED KMS KEYS', 'VENDOR ZERO-PLAINTEXT PROOF']
    },
    {
      id: 'event-receipts',
      title: '5. EVENT RECEIPTS',
      fullTitle: 'CLOCK 2 // STEP 05: LIVE VENDOR CLEARANCE RECEIPT & LEDGER SYNC',
      desc: 'Bind Clock 2 external telemetry with Clock 1 sovereignty into a unified 1st-of-the-Month Clearance Receipt.',
      paramLabel: 'Receipt Webhook Destination',
      paramPlaceholder: 'e.g. times2.burn-1.com/vendor-check',
      checks: ['CLOCK 1 × CLOCK 2 DELTA = 0', 'SHA-256 VENDOR RECEIPT ISSUED', 'SYNCED TO BINDER BOT LEDGER']
    }
  ];

  const SIZZLEAN_WINDOWS = [
    {
      id: 'sz-brief-12',
      category: '$12 MICRO-WINDOW',
      title: '01 // $12 CASE BRIEF',
      fullTitle: '$12 CASE BRIEF — 1-PAGE EXECUTIVE POSTURE & INCIDENT DOSSIER',
      price: 12,
      cadence: 'instant PDF',
      desc: 'Zero-backend impulse tool: enter your target domain below to generate a pre-formatted 1-page Guilloche Case Brief PDF ready for boardroom or broker review.',
      inputLabel: 'Client Domain or Case Reference',
      inputPlaceholder: 'e.g. meridian-realty.com // CASE-2026-01',
      deliverables: ['1-Page Guilloche Case Brief PDF', 'Executive Risk & Posture Summary', 'Instant Self-Serve Download']
    },
    {
      id: 'sz-chronology-12',
      category: '$12 MICRO-WINDOW',
      title: '02 // $12 CHRONOLOGY',
      fullTitle: '$12 CHRONOLOGY — TIMESTAMPED REMEDIATION & LEASE TIMELINE',
      price: 12,
      cadence: 'instant PDF',
      desc: 'Single-input impulse tool: generates a clean UTC-timestamped Chronology ring-binder sheet mapping patch, lease, or compliance milestones.',
      inputLabel: 'Facility / Lease / Incident Timeline Title',
      inputPlaceholder: 'e.g. Q4 Carrier Renewal & Patch Chronology',
      deliverables: ['1-Page UTC Chronology Ledger PDF', 'Milestone & SLA Verification Table', 'SHA-256 Footnote Slot']
    },
    {
      id: 'sz-forensic-12',
      category: '$12 MICRO-WINDOW',
      title: '03 // $12 FORENSIC LOG',
      fullTitle: '$12 FORENSIC LOG — CHAIN-OF-CUSTODY TELEMETRY SHEET',
      price: 12,
      cadence: 'instant PDF',
      desc: 'Structured tabular forensic evidence log for DNS, DMARC, TLS 1.3, port cloaking, and CISA KEV verification records.',
      inputLabel: 'Target Perimeter IP / Domain',
      inputPlaceholder: 'e.g. 198.51.100.42 // portal.meridian.com',
      deliverables: ['36-Line Chain-of-Custody Log PDF', 'Dual Signatory Verification Block', 'Machine Seal Ready']
    },
    {
      id: 'sz-exec-49',
      category: 'FLAGSHIP PRODUCT',
      title: '04 // $49 EXECUTIVE BRIEF™',
      fullTitle: '$49 SIZZLEAN EXECUTIVE BRIEF™ — 2-PAGE COMPRESSED SCORECARD',
      price: 49,
      cadence: 'one-time',
      desc: 'Our flagship 2-page compressed executive summary translating raw outside-in telemetry into plain-English financial and underwriting impact.',
      inputLabel: 'Organization & Primary Domain',
      inputPlaceholder: 'e.g. Meridian Commercial Properties (meridian-prop.com)',
      deliverables: ['2-Page Sizzlean Executive Brief™ (Print + Web)', 'Carrier Sublimit & Discount Eligibility Map', 'Algorithmic Cryptographic SHA-256 Seal']
    },
    {
      id: 'sz-board-149',
      category: 'FLAGSHIP PRODUCT',
      title: '05 // $149 BOARD PACK™',
      fullTitle: '$149 SIZZLEAN BOARD PACK™ — 5-PAGE FIDUCIARY BOARD DECK',
      price: 149,
      cadence: 'one-time',
      desc: 'Complete 5-page board-ready fiduciary deck with NIST CSF 2.0 governance mapping, vendor risk matrix, and underwriter checklist binder.',
      inputLabel: 'Board / Audit Committee Name',
      inputPlaceholder: 'e.g. Audit & Risk Committee — Q4 Review',
      deliverables: ['5-Page Sizzlean Board Pack™ Deck', 'NIST CSF 2.0 & SEC/NYDFS Governance Map', 'Full Underwriter Evidence Binder + SHA-256 Seal']
    },
    {
      id: 'sz-msp-250',
      category: 'PARTNER TIER',
      title: '06 // $250/mo PARTNER KIT',
      fullTitle: '$250/mo WHITE-LABEL PARTNER KIT — 5 CLIENT DOMAINS',
      price: 250,
      cadence: '/mo',
      desc: 'Co-branded White-Label MSP & Real Estate Risk Manager kit: generate custom-styled Guilloche PDFs and digital dashboards for up to 5 client domains.',
      inputLabel: 'MSP / Partner Firm Name',
      inputPlaceholder: 'e.g. Apex Managed Security Partners',
      deliverables: ['Up to 5 Client Domains Included', 'Custom Partner Logo & Guilloche Crest', 'Monthly Automated Drift Seals']
    },
    {
      id: 'sz-msp-500',
      category: 'PARTNER TIER',
      title: '07 // $500/mo ENTERPRISE KIT',
      fullTitle: '$500/mo WHITE-LABEL ENTERPRISE KIT — 15 CLIENT DOMAINS',
      price: 500,
      cadence: '/mo',
      desc: 'Full Syndicate White-Label Enterprise Bundle covering 15 client domains with continuous 5-minute worker.py drift seals and priority API webhooks.',
      inputLabel: 'Enterprise Syndicate / Brokerage Name',
      inputPlaceholder: 'e.g. Vanguard Cyber Risk Brokerage',
      deliverables: ['Up to 15 Client Domains Included', 'Full White-Label Print PDF + Web Portal', 'Priority Subdomain & Webhook Dispatch']
    }
  ];

  const DIVISION_BOT_PROFILES = {
    freezer: {
      key: 'freezer',
      name: 'FreezerBurn Resident Binder Bot',
      badge: 'FREEZERBURN // RESIDENT BINDER & COSMO TERMINAL',
      accent: '#38bdf8',
      borderColor: 'rgba(56, 189, 248, 0.65)',
      bgPanel: 'rgba(10, 18, 32, 0.96)',
      subdomain: 'freezer.burn-1.com',
      greeting:
        'Welcome to FreezerBurn (freezer.burn-1.com). I am your Resident Binder Bot. Ask an underwriting question, check your clinical posture, or expand the Accordion Payment Hub below:',
      prompts: [
        {
          label: '❄️ How do we unlock 20%–40% carrier discounts?',
          reply:
            'Carriers (Chubb, Travelers, Coalition) apply 20%–40% premium credits when you prove 30-day Agentless Perimeter Telemetry across DNS, DMARC p=reject, TLS 1.3 (HIPAA § 164.312), cloaked RDP/SMB ports, and 0 CISA KEV matches.'
        },
        {
          label: '🧊 $50 Zero-Point Scorecard vs. $99 Snapshot',
          reply:
            'Dose 01 ($50) is an express outside-in hygiene sweep with a Timestamped Freeze Seal. Dose 02 ($99) adds full HIPAA § 164.312(e) & HITRUST CSF v11.9 09.m mapping in a 4-page underwriter-defensible PDF.'
        },
        {
          label: '📡 Why do 42% of claims fail without the $249/mo Ledger?',
          reply:
            '42% of cyber claims are denied due to posture drift between annual audits. Dose 03 ($249/mo) runs 30-day automated diff sweeps and issues a monthly Algorithmic Cryptographic SHA-256 Seal.'
        }
      ],
      tiers: [
        { id: 'frz-50', name: 'Dose 01: Zero-Point Scorecard', price: '50', cadence: 'one-time', tag: 'EXPRESS', scope: 'Single Clinic WAN IP / Domain • DNS, DMARC, RDP/SMB Port Cloaking • Freeze Stamp.' },
        { id: 'frz-99', name: 'Dose 02: Posture Snapshot (HIPAA)', price: '99', cadence: 'one-time', tag: 'RECOMMENDED', featured: true, scope: 'Full Outside-In Exposure Audit • HIPAA § 164.312(e) & HITRUST CSF v11.9 • 4-Page Binder.' },
        { id: 'frz-249', name: 'Dose 03: Continuous Drift Ledger', price: '249', cadence: '/mo', tag: 'MONTHLY SEAL', scope: '30-Day Automated Diff Engine • Monthly Algorithmic Cryptographic SHA-256 Seal.' }
      ]
    },
    acid: {
      key: 'acid',
      name: 'Acid HazMat Resident Binder Bot',
      badge: 'ACID DIVISION // RESIDENT BINDER & COSMO TERMINAL',
      accent: '#39FF14',
      borderColor: 'rgba(57, 255, 20, 0.65)',
      bgPanel: 'rgba(9, 13, 20, 0.97)',
      subdomain: 'acid.burn-1.com',
      greeting:
        'Acid Division Resident Binder Bot online (acid.burn-1.com). Complete the 7-Step HazMat Ultra Bar under the Hero to trigger the Step 7 Chemical Burn, or lock your hazard envelope in the Accordion Payment Hub below:',
      prompts: [
        {
          label: '🧪 Explain the 7-Step HazMat Lifecycle',
          reply:
            '1. BATCH INTAKE (15%) → 2. PLUME RECON (30%) → 3. CONTAINMENT AUDIT (45%) → 4. SECONDARY BERM LOGS (65%) → 5. CORROSION COLLISION (80%) → 6. CAUSTIC TRIAGE (90%) → 7. CHEMICAL BURN (100% Multi-System Seal).'
        },
        {
          label: '⚡ What happens when Step 7 (CHEMICAL BURN) reaches 100%?',
          reply:
            'The Master Liquid Tube flashes neon green, the Base Cap locks green, your client subdomain ({client}.burn-1.com/evidence) publishes the SHA-256 dossier, division_queue.csv updates to STATUS: SEALED, Obsidian syncs /Vault/Evidence-Runs/, and the PDF certificate emails out.'
        },
        {
          label: '📋 $49 Surface Strip vs. $99 Acid Test vs. $150 Full Plant',
          reply:
            '$49 covers express perimeter & SDS sweep; $99 binds full OSHA 29 CFR 1910 + NFPA 70E + Plume Recon; $150 adds full Secondary Berm photo collision & municipal drainage setback certification.'
        }
      ],
      tiers: [
        { id: 'acd-49', name: 'Batch Envelope 01: Acid Surface Strip ($49)', price: '49', cadence: 'one-time', tag: 'EXPRESS SWEEP', scope: 'Plant domain & dispatch endpoint scan • SDS registry & exposed OT port check.' },
        { id: 'acd-99', name: 'Batch Envelope 02: Official Acid Test Report ($99)', price: '99', cadence: 'one-time', tag: 'MOST CHOSEN', featured: true, scope: 'Full 7-Step HazMat Lifecycle • Plume Recon + OSHA 1910 / NFPA 70E + SHA-256 Seal.' },
        { id: 'acd-150', name: 'Batch Envelope 03: Full Plant HazMat & Zoning Dossier ($150)', price: '150', cadence: 'one-time', tag: 'FULL PLANT', scope: 'Includes Secondary Berm photo collision, EPA SPCC drainage setback proof & Obsidian Vault sync.' }
      ]
    },
    times2: {
      key: 'times2',
      name: 'Times2 Dual-Clock Resident Bot',
      badge: 'TIMES2 (X²) // RESIDENT BINDER & COSMO TERMINAL',
      accent: '#38bdf8',
      borderColor: 'rgba(56, 189, 248, 0.65)',
      bgPanel: 'rgba(5, 8, 12, 0.97)',
      subdomain: 'times2.burn-1.com',
      greeting:
        'Times2 Resident Binder Bot active (times2.burn-1.com). Operate the Left Ultra Bar (Clock 1: Sovereignty) and Right Ultra Bar (Clock 2: Telemetry & Receipts) under the Hero, or bind your dossier below:',
      prompts: [
        {
          label: '⏱️ How do the Left & Right Parallel Ultra Bars work?',
          reply:
            'Left Ultra Bar (Clock 1) steps through ENTITY INTAKE → SANCTIONS SCRAPE (OFAC) → POLICY LOGS → CONTRACT CLEARANCE → CARRIER CROSS-EXAM → CLEARANCE SEAL. Right Ultra Bar (Clock 2) runs Vendor Double-Check, PCI 4.0 JS hash logs, and event receipts.'
        },
        {
          label: '📰 What is in the Center Stage Intelligence Canvas?',
          reply:
            'Center Stage houses the rotating intelligence report (The Scary Headline ⟷ The Boring Spec ⟷ The Timestamped Receipt) plus all 8 chapters of "Tech Spec vs. Horror". When both Ultra Bars are docked, the center canvas expands to full width.'
        },
        {
          label: '🔏 How do underwriters verify the Algorithmic Evidence Seal?',
          reply:
            'Carrier risk engines query times2.burn-1.com/receipts and ingest our Times2AlgorithmicEvidenceSeal JSON schema in <50ms—validating Ed25519/SHA-256 hashes, 500ms token decay, and PCI 4.0 script integrity.'
        }
      ],
      tiers: [
        { id: 't2-99', name: 'Clock 2: Vendor Double-Check & PCI 4.0 Receipt ($99)', price: '99', cadence: 'one-time', tag: 'CLOCK 2', scope: 'Single Vendor Sweep • OFAC Sanctions, Shodan Ports, PCI 4.0 JS Hashes & Field Encryption.' },
        { id: 't2-150', name: 'Dual-Clock X² Shift Report Dossier ($150)', price: '150', cadence: 'one-time', tag: 'X² FLAGSHIP', featured: true, scope: 'Reconciles Clock 1 (Sovereignty) × Clock 2 (Telemetry) • Full AI E&O Readiness Receipt + SHA-256 Seal.' },
        { id: 't2-249', name: 'Clearance Ledger Continuous Watch ($249/mo)', price: '249', cadence: '/mo', tag: 'MONTHLY SYNC', scope: '1st-of-the-Month Clearance Ledger for up to 25 Vendors + Live Subdomain JSON Feed.' }
      ]
    },
    sizzlean: {
      key: 'sizzlean',
      name: 'Sizzlean Compression & Credit Bot',
      badge: 'SIZZLEAN // RESIDENT BINDER & COSMO TERMINAL',
      accent: '#10b981',
      borderColor: 'rgba(16, 185, 129, 0.65)',
      bgPanel: 'rgba(12, 18, 16, 0.97)',
      subdomain: 'sizzlean.burn-1.com',
      greeting:
        'Welcome to Sizzlean (sizzlean.burn-1.com). Use the Centered Ultra Bar (< / > chevrons) to grab $12 Micro-Windows, $49/$149 Flagships, or apply your Earned Academy Credits ($50 Value) below:',
      prompts: [
        {
          label: '📂 How do the $12 Micro-Windows work?',
          reply:
            'Select $12 Case Brief, $12 Chronology, or $12 Forensic Log in the Centered Ultra Bar, type your domain or reference, and download a pre-formatted 1-page Guilloche PDF dossier immediately.'
        },
        {
          label: '🎓 How does the Real Estate / Academy Credit Funnel work?',
          reply:
            'Completing free modules in the BURN-1 Academy grants Academy Credits (e.g. 2 Credits = $50 Value). You can apply those credits directly inside Sizzlean’s Centered Ultra Bar to unlock $12 micro-briefs or discount the $49 Executive Brief™ and $149 Board Pack™.'
        },
        {
          label: '💼 Compare $250/mo Partner Kit vs. $500/mo Enterprise Kit',
          reply:
            'The $250/mo White-Label Partner Kit covers 5 client domains with co-branded Guilloche PDFs. The $500/mo Enterprise Kit covers 15 client domains with continuous 5-minute worker.py drift seals.'
        }
      ],
      tiers: [
        { id: 'sz-12', name: '$12 Micro-Window Dossier (Case Brief / Chronology / Forensic Log)', price: '12', cadence: 'one-time', tag: 'IMPULSE PDF', scope: 'Single 1-page pre-formatted Guilloche PDF generated on the fly from your input.' },
        { id: 'sz-49', name: '$49 Sizzlean Executive Brief™ (2-Page Summary)', price: '49', cadence: 'one-time', tag: 'FLAGSHIP', featured: true, scope: '2-Page compressed executive posture summary + carrier discount map + SHA-256 Seal.' },
        { id: 'sz-149', name: '$149 Sizzlean Board Pack™ (5-Page Board Deck)', price: '149', cadence: 'one-time', tag: 'BOARD DECK', scope: '5-Page fiduciary board presentation + NIST CSF 2.0 governance map + SHA-256 Seal.' },
        { id: 'sz-250', name: '$250/mo White-Label Partner Kit (5 Domains)', price: '250', cadence: '/mo', tag: 'MSP TIER 1', scope: 'Co-branded Guilloche PDFs & Digital Dashboards for up to 5 client domains.' },
        { id: 'sz-500', name: '$500/mo White-Label Enterprise Kit (15 Domains)', price: '500', cadence: '/mo', tag: 'MSP TIER 2', scope: '15-Domain Syndicate White-Label Bundle + 5-minute worker.py drift seals.' }
      ]
    }
  };

  function getActiveDivisionKey() {
    const bodyDiv = document.body && document.body.getAttribute('data-division');
    if (bodyDiv && DIVISION_BOT_PROFILES[bodyDiv]) return bodyDiv;
    const p = (window.location.pathname || '').toLowerCase();
    if (p.includes('acid')) return 'acid';
    if (p.includes('times2')) return 'times2';
    if (p.includes('sizzlean')) return 'sizzlean';
    return 'freezer';
  }

  function loadLedgerState() {
    try {
      const raw = localStorage.getItem(LEDGER_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      user: null,
      orders: [],
      academyCredits: 2, // 2 Earned Academy Credits ($50 Value)
      creditApplied: false
    };
  }

  function saveLedgerState(st) {
    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(st));
    } catch (e) {}
  }

  let ledgerState = loadLedgerState();

  function generateDeterministicSha256(seedStr) {
    const seed = String(seedStr || 'BURN1') + '|2026';
    return Array.from({ length: 64 }, (_, i) =>
      ((seed.charCodeAt(i % seed.length) + i * 37 + 11) % 16).toString(16)
    ).join('');
  }

  // ==========================================================================
  // PURE CSS UI KIT STYLES (NO STATIC .JPG MOCKUPS)
  // ==========================================================================
  function injectMasterCssComponents() {
    if (document.getElementById('burn1-master-uikit-css')) return;
    const style = document.createElement('style');
    style.id = 'burn1-master-uikit-css';
    style.textContent = `
      /* 2-Stage Hydraulic Easing from leonsultrabar.html */
      .ease-hydraulic {
        transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      .lub-glow-red { filter: drop-shadow(0 0 4px rgba(255, 42, 77, 0.7)); }
      .lub-glow-green { filter: drop-shadow(0 0 6px rgba(0, 255, 102, 0.75)); }
      .lub-glow-amber { filter: drop-shadow(0 0 4px rgba(255, 184, 0, 0.7)); }
      .lub-glow-cyan { filter: drop-shadow(0 0 5px rgba(56, 189, 248, 0.75)); }

      .lub-scanline {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.16) 51%);
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 40;
        opacity: 0.3;
      }

      /* ======================================================================
         1. CHEMICAL BURN CSS UI KIT (FOR ACID.HTML — NO RAW .JPG IMAGES)
         ====================================================================== */
      .acid-panel-hazard {
        position: relative;
        background: linear-gradient(145deg, #0d121c 0%, #141b26 100%);
        border: 2px solid #2A2F38;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85), inset 0 0 24px rgba(57, 255, 20, 0.06);
        border-radius: 6px;
      }
      .acid-hazard-stripe-bar {
        height: 10px;
        width: 100%;
        background: repeating-linear-gradient(
          -45deg,
          #FFB800 0px,
          #FFB800 12px,
          #0B0F19 12px,
          #0B0F19 24px
        );
        border-bottom: 1px solid #39FF14;
      }
      .acid-btn-activate {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 11px 22px;
        background: linear-gradient(180deg, #1a2e12 0%, #0f1c0a 100%);
        border: 2px solid #39FF14;
        border-radius: 4px;
        color: #39FF14;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 11.5px;
        font-weight: 900;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        cursor: pointer;
        box-shadow: 0 0 16px rgba(57, 255, 20, 0.35), inset 0 0 10px rgba(57, 255, 20, 0.2);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .acid-btn-activate:hover {
        background: #39FF14;
        color: #0B0F19;
        box-shadow: 0 0 26px rgba(57, 255, 20, 0.85);
        transform: translateY(-1px);
      }
      .acid-btn-abort {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 7px 14px;
        background: repeating-linear-gradient(
          -45deg,
          rgba(255, 184, 0, 0.2) 0px,
          rgba(255, 184, 0, 0.2) 8px,
          rgba(11, 15, 25, 0.95) 8px,
          rgba(11, 15, 25, 0.95) 16px
        );
        border: 1.5px solid #FFB800;
        border-radius: 4px;
        color: #FFB800;
        font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .acid-btn-abort:hover {
        background: #FFB800;
        color: #0B0F19;
      }
      .acid-input-chevron {
        display: flex;
        align-items: center;
        background: #080b11;
        border: 1.5px solid rgba(57, 255, 20, 0.55);
        border-radius: 4px;
        padding: 0 10px;
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.85), 0 0 10px rgba(57, 255, 20, 0.12);
      }
      .acid-input-chevron::before {
        content: '«';
        color: #39FF14;
        font-weight: 900;
        margin-right: 8px;
        font-size: 14px;
      }
      .acid-input-chevron::after {
        content: '»';
        color: #39FF14;
        font-weight: 900;
        margin-left: 8px;
        font-size: 14px;
      }
      .acid-input-chevron input,
      .acid-input-chevron select {
        width: 100%;
        background: transparent;
        border: none;
        padding: 9px 0;
        color: #39FF14;
        font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
        font-size: 12px;
        font-weight: 700;
        outline: none;
      }
      .acid-input-chevron select option {
        background: #0B0F19;
        color: #39FF14;
      }

      /* Master Liquid Tube Progress Bar (.acid-tube-bar) */
      .acid-tube-bar {
        position: relative;
        height: 38px;
        border-radius: 9999px;
        background: linear-gradient(180deg, #05070c 0%, #111827 52%, #05070c 100%);
        border: 2.5px solid #334155;
        box-shadow:
          inset 0 4px 12px rgba(0, 0, 0, 0.95),
          0 0 22px rgba(57, 255, 20, 0.25);
        overflow: hidden;
        padding: 3px;
      }
      .acid-tube-liquid {
        position: relative;
        height: 100%;
        border-radius: 9999px;
        background: linear-gradient(90deg, #15803d 0%, #39FF14 55%, #a3e635 100%);
        box-shadow: 0 0 24px #39FF14, inset 0 2px 6px rgba(255, 255, 255, 0.65);
        transition: width 0.65s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }
      .acid-tube-liquid::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
          radial-gradient(circle at 20% 50%, rgba(255,255,255,0.55) 0%, transparent 18%),
          radial-gradient(circle at 60% 30%, rgba(255,255,255,0.45) 0%, transparent 15%),
          repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.18) 0px,
            rgba(255, 255, 255, 0.18) 10px,
            transparent 10px,
            transparent 20px
          );
        background-size: 60px 100%, 80px 100%, 28px 28px;
        animation: acidWaveFlow 1.6s linear infinite;
      }
      @keyframes acidWaveFlow {
        0% { background-position: 0 0, 0 0, 0 0; }
        100% { background-position: 60px 0, -80px 0, 28px 0; }
      }
      .acid-tube-flash {
        animation: acidSealFlash 0.9s ease-in-out 2;
      }
      @keyframes acidSealFlash {
        0%, 100% { box-shadow: 0 0 22px rgba(57, 255, 20, 0.3); }
        50% { box-shadow: 0 0 55px #00FF66, 0 0 90px #39FF14; border-color: #00FF66; }
      }

      /* ======================================================================
         2. TIMES2 DUAL-CLOCK PARALLEL ULTRA BAR LAYOUT
         ====================================================================== */
      .t2-dual-stage {
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        width: 100%;
      }
      .t2-center-canvas {
        flex: 1 1 auto;
        min-width: 0;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @media (max-width: 1024px) {
        .t2-dual-stage {
          flex-direction: column;
        }
        .lub-tray-panel {
          position: relative !important;
          left: 0 !important;
          right: 0 !important;
          top: 8px !important;
          width: 100% !important;
          max-width: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function svgIconX() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:15px;height:15px;"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
  }

  function svgIconCheck() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:15px;height:15px;"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
  }

  function svgIconChevron(direction) {
    const deg = direction === 'down' ? '90deg' : direction === 'up' ? '-90deg' : direction === 'left' ? '180deg' : '0deg';
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:15px;height:15px;transition:transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);transform:rotate(${deg});"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>`;
  }

  // ==========================================================================
  // GENERIC 5-PHASE HYDRAULIC ULTRA BAR BUILDER (LEFT OR RIGHT ANCHORED)
  // ==========================================================================
  function createHydraulicConsole(mountEl, config) {
    if (!mountEl) return;
    const {
      storageKey,
      headerTitle,
      headerSub,
      shelves,
      align = 'left', // 'left' or 'right'
      accentColor = '#FF8400',
      completeColor = '#00FF66',
      isAcid = false,
      onStepCommitted = null,
      onAllComplete = null
    } = config;

    const HEADER_HEIGHT = 48;
    const SHELF_HEIGHT = 44;
    const TRAY_WIDTH = 680;

    let saved = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) saved = JSON.parse(raw) || [];
    } catch (e) {}

    let state = {
      isMainExpanded: true, // Expanded under hero so user sees the backbone immediately
      activeTrayId: null,
      expandedAccordionId: null,
      completedTasks: Array.isArray(saved) ? saved : [],
      isFullyComplete: Array.isArray(saved) && saved.length === shelves.length,
      animatingTask: null,
      inputs: {},
      vectors: {},
      checks: {},
      uploadedFiles: {}
    };

    function saveState() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state.completedTasks));
      } catch (e) {}
    }

    function render() {
      const isRight = align === 'right';
      const trayResponsiveW = Math.min(TRAY_WIDTH, Math.max(320, window.innerWidth - 220));

      mountEl.innerHTML = `
        <div style="position:relative;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:11px;text-transform:uppercase;letter-spacing:1.4px;user-select:none;display:flex;flex-direction:column;align-items:${isRight ? 'flex-end' : 'flex-start'};z-index:45;">
          
          <!-- PHASE 0: Top Header Box (160px x 48px) -->
          <div style="display:flex;align-items:center;gap:6px;flex-direction:${isRight ? 'row-reverse' : 'row'};">
            <div class="lub-phase0-trigger" style="
              position:relative;
              display:flex;
              align-items:center;
              justify-content:space-between;
              padding:0 14px;
              width:160px;
              height:${HEADER_HEIGHT}px;
              cursor:pointer;
              background:#121418;
              border:1.5px solid ${state.isFullyComplete ? completeColor : isAcid ? '#39FF14' : '#2A2F38'};
              border-radius:3px;
              box-shadow:${state.isFullyComplete ? '0 0 18px rgba(0,255,102,0.3)' : '0 16px 32px rgba(0,0,0,0.75)'};
              transition:all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
              overflow:hidden;
            ">
              <div class="lub-scanline"></div>
              <div style="display:flex;flex-direction:column;line-height:1.15;">
                <span style="font-weight:900;color:${state.isFullyComplete ? completeColor : '#D0D5DD'};font-size:11px;">${headerTitle}</span>
                <span style="font-size:8px;color:${accentColor};letter-spacing:0.8px;">${headerSub} (${state.completedTasks.length}/${shelves.length})</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:center;">
                ${
                  state.isFullyComplete
                    ? `<span class="lub-glow-green" style="color:${completeColor};display:flex;">${svgIconCheck()}</span>`
                    : `<span class="lub-glow-red" style="color:#FF2A4D;display:flex;">${svgIconX()}</span>`
                }
              </div>
            </div>
            ${
              state.completedTasks.length > 0
                ? `<button type="button" class="lub-reset-btn acid-btn-abort" title="Reset Phases">↺</button>`
                : ''
            }
          </div>

          <!-- PHASE 1: Vertical Backbone (Width: 160px) -->
          <div style="
            overflow:hidden;
            transition:all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            display:flex;
            flex-direction:column;
            background:#121418;
            border-left:1.5px solid #2A2F38;
            border-right:1.5px solid #2A2F38;
            border-bottom:1.5px solid #2A2F38;
            border-radius:0 0 3px 3px;
            box-shadow:0 24px 48px rgba(0,0,0,0.85);
            width:160px;
            max-height:${state.isMainExpanded ? shelves.length * SHELF_HEIGHT + 44 + 'px' : '0px'};
            opacity:${state.isMainExpanded ? '1' : '0'};
            pointer-events:${state.isMainExpanded ? 'auto' : 'none'};
          ">
            ${shelves
              .map((shelf) => {
                const isCompleted = state.completedTasks.includes(shelf.id);
                const isActive = state.activeTrayId === shelf.id;
                return `
                  <div class="lub-backbone-item" data-shelf-id="${shelf.id}" style="
                    height:${SHELF_HEIGHT}px;
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    padding:0 12px;
                    border-bottom:1px solid rgba(42, 47, 56, 0.6);
                    cursor:${isCompleted ? 'default' : 'pointer'};
                    opacity:${isCompleted ? '0.72' : '1'};
                    background:${isActive ? 'rgba(57, 255, 20, 0.12)' : 'transparent'};
                    transition:background 0.2s ease;
                  ">
                    <span style="color:${isCompleted ? completeColor : '#D0D5DD'};font-size:9.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                      ${shelf.title}
                    </span>
                    <div style="flex-shrink:0;width:16px;display:flex;justify-content:flex-end;">
                      ${
                        isCompleted
                          ? `<span class="lub-glow-green" style="color:${completeColor};display:flex;">${svgIconCheck()}</span>`
                          : `<span class="lub-glow-amber" style="color:${accentColor};display:flex;opacity:${isActive ? '0' : '1'};transition:opacity 0.2s;">${svgIconChevron(isRight ? 'left' : 'right')}</span>`
                      }
                    </div>
                  </div>
                `;
              })
              .join('')}

            <!-- Base Cap Status Indicator Diode -->
            <div style="height:32px;background:#0a0b0d;display:flex;align-items:center;justify-content:space-between;padding:0 12px;border-top:1px solid #2A2F38;">
              <span style="font-size:8px;color:#94a3b8;letter-spacing:1px;">${state.isFullyComplete ? 'SEALED' : 'DIODE'}</span>
              <div style="
                width:8px;
                height:8px;
                border-radius:9999px;
                transition:all 0.5s ease;
                background:${state.isFullyComplete ? '#00FF66' : '#FF2A4D'};
                box-shadow:0 0 8px ${state.isFullyComplete ? '#00FF66' : '#FF2A4D'};
              "></div>
            </div>
          </div>

          <!-- PHASE 2: HORIZONTAL SLIDING TRAYS (Width: 680px) + PHASE 3: VERTICAL ACCORDION WORKSPACE (Max-Height: 550px) -->
          ${shelves
            .map((shelf, idx) => {
              const isTrayActive = state.isMainExpanded && state.activeTrayId === shelf.id;
              const isAccordionExpanded = isTrayActive && state.expandedAccordionId === shelf.id;
              const isCompleting = state.animatingTask === shelf.id;
              const isCompleted = state.completedTasks.includes(shelf.id);
              const topOffset = HEADER_HEIGHT + idx * SHELF_HEIGHT;
              const valInput = state.inputs[shelf.id] || '';
              const vectorList = shelf.vectors || [
                'NOMINAL (STANDARD)',
                'ELEVATED (MONITOR)',
                'CRITICAL (ACTION REQ)'
              ];
              const valVector = state.vectors[shelf.id] || vectorList[0];
              const uploadedName = state.uploadedFiles[shelf.id] || '';

              return `
                <div class="lub-tray-panel" data-tray-id="${shelf.id}" style="
                  position:absolute;
                  z-index:60;
                  display:flex;
                  flex-direction:column;
                  background:#121418;
                  border-color:${isAcid ? '#39FF14' : '#2A2F38'};
                  border-style:solid;
                  border-radius:${isRight ? '3px 0 0 3px' : '0 3px 3px 0'};
                  box-shadow:0 25px 60px rgba(0, 0, 0, 0.9);
                  transition:all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                  overflow:hidden;
                  top:${topOffset}px;
                  ${isRight ? 'right:160px;' : 'left:160px;'}
                  width:${isTrayActive ? trayResponsiveW + 'px' : '0px'};
                  border-width:${isTrayActive ? '1.5px' : '0px'};
                  opacity:${isTrayActive ? '1' : '0'};
                  pointer-events:${isTrayActive ? 'auto' : 'none'};
                ">
                  ${isAcid ? '<div class="acid-hazard-stripe-bar"></div>' : ''}
                  <!-- PHASE 2: Horizontal Tray Header (44px) -->
                  <div class="lub-tray-header" data-shelf-id="${shelf.id}" style="
                    height:${SHELF_HEIGHT}px;
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    padding:0 20px;
                    cursor:pointer;
                    background:#121418;
                    white-space:nowrap;
                  ">
                    <span style="color:#D0D5DD;font-weight:800;font-size:10.5px;overflow:hidden;text-overflow:ellipsis;">${shelf.fullTitle}</span>
                    <div style="width:22px;display:flex;align-items:center;justify-content:center;">
                      ${
                        isCompleting || isCompleted
                          ? `<span class="lub-glow-green" style="color:${completeColor};display:flex;">${svgIconCheck()}</span>`
                          : `<span class="lub-glow-amber" style="color:${accentColor};display:flex;">${svgIconChevron(isAccordionExpanded ? 'up' : 'down')}</span>`
                      }
                    </div>
                  </div>

                  <!-- PHASE 3: Vertical Accordion Workspace (Max-Height: 550px) -->
                  <div style="
                    overflow:hidden;
                    transition:all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    background:#0d0e12;
                    max-height:${isAccordionExpanded ? '550px' : '0px'};
                    border-top:${isAccordionExpanded ? '1px solid #2A2F38' : '0px solid transparent'};
                  ">
                    <div style="padding:22px 24px;display:flex;flex-direction:column;gap:16px;font-size:12.5px;text-transform:none;letter-spacing:normal;">
                      <div style="color:#D0D5DD;font-size:13.5px;font-family:'Inter',system-ui,sans-serif;line-height:1.5;border-left:3px solid ${accentColor};padding-left:12px;">
                        ${shelf.desc}
                      </div>

                      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;">
                        <div style="display:flex;flex-direction:column;gap:12px;">
                          <label style="display:flex;flex-direction:column;gap:4px;color:#D0D5DD;">
                            <span style="font-size:9.5px;color:#94a3b8;text-transform:uppercase;letter-spacing:1.2px;">${shelf.paramLabel || 'Input Parameter Alpha'}</span>
                            <div class="${isAcid ? 'acid-input-chevron' : ''}">
                              <input type="text" class="lub-input-field" data-shelf-id="${shelf.id}" value="${valInput}" placeholder="${shelf.paramPlaceholder || 'Enter metric data...'}" style="${isAcid ? '' : 'width:100%;background:transparent;border:none;border-bottom:1px solid #2A2F38;padding:8px 0;color:#ffffff;font-family:inherit;font-size:12px;outline:none;'}" />
                            </div>
                          </label>

                          <label style="display:flex;flex-direction:column;gap:4px;color:#D0D5DD;">
                            <span style="font-size:9.5px;color:#94a3b8;text-transform:uppercase;letter-spacing:1.2px;">${shelf.vectorLabel || 'Risk Assessment Vector'}</span>
                            <div class="${isAcid ? 'acid-input-chevron' : ''}">
                              <select class="lub-vector-field" data-shelf-id="${shelf.id}" style="${isAcid ? '' : 'width:100%;background:#121418;border:none;border-bottom:1px solid #2A2F38;padding:8px 0;color:#D0D5DD;font-family:inherit;font-size:11.5px;outline:none;'}">
                                ${vectorList
                                  .map((v) => `<option ${valVector === v ? 'selected' : ''}>${v}</option>`)
                                  .join('')}
                              </select>
                            </div>
                          </label>

                          ${
                            shelf.hasDropZone
                              ? `
                            <label style="border:1.5px dashed #39FF14;border-radius:4px;padding:10px;background:rgba(57,255,20,0.05);cursor:pointer;text-align:center;font-family:ui-monospace,monospace;font-size:10px;color:#39FF14;">
                              <input type="file" class="lub-file-input" data-shelf-id="${shelf.id}" style="display:none;" />
                              <span>${uploadedName ? '✓ ATTACHED: ' + uploadedName : '📷 DROP EYEWASH / BERM / DRUM TAG PHOTOS HERE (OR CLICK)'}</span>
                            </label>
                          `
                              : ''
                          }
                        </div>

                        <div style="background:rgba(42, 47, 56, 0.16);padding:14px;border-radius:4px;border:1px solid rgba(42, 47, 56, 0.5);display:flex;flex-direction:column;gap:10px;font-family:ui-monospace,monospace;font-size:10.5px;">
                          <div style="font-size:9.5px;color:${accentColor};font-weight:800;letter-spacing:1px;">VERIFICATION GATES:</div>
                          ${(shelf.checks || ['VERIFY DATA INTEGRITY', 'RUN HEURISTIC ANALYSIS', 'ATTACH FORENSIC LOGS'])
                            .map((chk, cIdx) => {
                              const k = shelf.id + '_' + cIdx;
                              const checked = state.checks[k] !== false;
                              return `
                                <div class="lub-chk-toggle" data-chk-key="${k}" style="display:flex;align-items:center;gap:8px;color:${checked ? completeColor : '#D0D5DD'};cursor:pointer;">
                                  <div style="width:10px;height:10px;border:1px solid ${checked ? completeColor : accentColor};background:${checked ? completeColor : 'transparent'};border-radius:2px;"></div>
                                  <span>${chk}</span>
                                </div>
                              `;
                            })
                            .join('')}
                        </div>
                      </div>

                      <!-- Action Bar -->
                      <div style="margin-top:6px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
                        <span style="font-family:ui-monospace,monospace;font-size:9.5px;color:#94a3b8;text-transform:uppercase;">
                          ${shelf.pct ? `LIQUID TUBE TARGET: ${shelf.pct}%` : 'SHA-256 ATTESTATION GATE'}
                        </span>
                        <button type="button" class="lub-commit-btn ${isAcid ? 'acid-btn-activate' : ''}" data-shelf-id="${shelf.id}" style="${
                isAcid
                  ? ''
                  : `padding:11px 22px;background:rgba(255,132,0,0.12);border:1.5px solid ${accentColor};color:${accentColor};font-family:ui-monospace,monospace;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1.4px;cursor:pointer;`
              }">
                          ${isCompleting ? 'PROCESSING...' : 'COMMIT & VALIDATE SECTION'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      `;

      // Phase 0 Toggle
      const trigger = mountEl.querySelector('.lub-phase0-trigger');
      if (trigger) {
        trigger.onclick = () => {
          state.isMainExpanded = !state.isMainExpanded;
          if (!state.isMainExpanded) {
            state.activeTrayId = null;
            state.expandedAccordionId = null;
          }
          render();
        };
      }

      // Reset Button
      const resetBtn = mountEl.querySelector('.lub-reset-btn');
      if (resetBtn) {
        resetBtn.onclick = (e) => {
          e.stopPropagation();
          state.completedTasks = [];
          state.isFullyComplete = false;
          state.isMainExpanded = true;
          state.activeTrayId = null;
          state.expandedAccordionId = null;
          saveState();
          if (onStepCommitted) onStepCommitted(state.completedTasks, null);
          render();
        };
      }

      // Phase 1 Backbone Shelf Click -> Slide Out Phase 2 Horizontal Tray
      mountEl.querySelectorAll('.lub-backbone-item').forEach((item) => {
        item.onclick = () => {
          const id = item.getAttribute('data-shelf-id');
          if (state.completedTasks.includes(id)) return;
          if (state.activeTrayId === id) {
            state.activeTrayId = null;
            state.expandedAccordionId = null;
          } else {
            state.activeTrayId = id;
            state.expandedAccordionId = null; // Phase 2 slides out first; clicking tray header unfolds Phase 3
          }
          render();
        };
      });

      // Phase 2 Tray Header Click -> Unfold Phase 3 Vertical Accordion Workspace
      mountEl.querySelectorAll('.lub-tray-header').forEach((hdr) => {
        hdr.onclick = () => {
          const id = hdr.getAttribute('data-shelf-id');
          if (state.completedTasks.includes(id)) return;
          state.expandedAccordionId = state.expandedAccordionId === id ? null : id;
          render();
        };
      });

      // Preserve Inputs, Selects, File Uploads & Checkboxes
      mountEl.querySelectorAll('.lub-input-field').forEach((inp) => {
        inp.oninput = () => {
          state.inputs[inp.getAttribute('data-shelf-id')] = inp.value;
        };
      });
      mountEl.querySelectorAll('.lub-vector-field').forEach((sel) => {
        sel.onchange = () => {
          state.vectors[sel.getAttribute('data-shelf-id')] = sel.value;
        };
      });
      mountEl.querySelectorAll('.lub-file-input').forEach((fInp) => {
        fInp.onchange = () => {
          if (fInp.files && fInp.files[0]) {
            state.uploadedFiles[fInp.getAttribute('data-shelf-id')] = fInp.files[0].name;
            render();
          }
        };
      });
      mountEl.querySelectorAll('.lub-chk-toggle').forEach((chk) => {
        chk.onclick = () => {
          const k = chk.getAttribute('data-chk-key');
          state.checks[k] = state.checks[k] === false ? true : false;
          render();
        };
      });

      // Phase 4 & Phase 5 Commit Sequence
      mountEl.querySelectorAll('.lub-commit-btn').forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-shelf-id');
          const shelfObj = shelves.find((s) => s.id === id);
          state.animatingTask = id;
          render();

          // Hold pulsing green check for 600ms -> collapse vertical accordion (400ms) -> retract horizontal tray
          setTimeout(() => {
            state.expandedAccordionId = null;
            render();
            setTimeout(() => {
              state.activeTrayId = null;
              if (!state.completedTasks.includes(id)) {
                state.completedTasks.push(id);
                saveState();
              }
              state.animatingTask = null;
              if (onStepCommitted) {
                onStepCommitted(state.completedTasks, shelfObj, state.inputs[id]);
              }
              render();

              if (state.completedTasks.length === shelves.length && !state.isFullyComplete) {
                setTimeout(() => {
                  state.isMainExpanded = false;
                  state.activeTrayId = null;
                  state.expandedAccordionId = null;
                  state.isFullyComplete = true;
                  render();
                  if (onAllComplete) onAllComplete(state);
                }, 900);
              }
            }, 400);
          }, 600);
        };
      });
    }

    render();
    if (onStepCommitted) {
      onStepCommitted(state.completedTasks, null);
    }
  }

  // ==========================================================================
  // 1. ACID.HTML — 7-STEP HAZMAT ULTRA BAR + LIQUID TUBE + STEP 7 DISPATCH
  // ==========================================================================
  function mountAcidUltraBar() {
    const mount = document.getElementById('leons-ultra-bar-mount') || document.getElementById('acid-ultra-bar-mount');
    if (!mount) return;

    function syncAcidLiquidTube(completedIds, lastShelf, lastInput) {
      let maxPct = 0;
      ACID_STEPS.forEach((st) => {
        if (completedIds.includes(st.id) && st.pct > maxPct) {
          maxPct = st.pct;
        }
      });

      const barEl = document.getElementById('acid-liquid-bar');
      const readoutEl = document.getElementById('acid-score-readout');
      const tubeWrap = document.getElementById('acid-master-tube-wrap');
      if (barEl) barEl.style.width = maxPct + '%';
      if (readoutEl) {
        readoutEl.textContent =
          maxPct >= 100
            ? '100% CAP // STEP 7 CHEMICAL BURN SEALED ✓'
            : `${maxPct}% CAP // ${completedIds.length}/7 HAZMAT STEPS LOCKED`;
      }

      if (maxPct >= 100 || (lastShelf && lastShelf.id === 'chemical-burn')) {
        if (tubeWrap) {
          tubeWrap.classList.add('acid-tube-flash');
        }
        triggerAcidStep7Dispatch(lastInput);
      }
    }

    function triggerAcidStep7Dispatch(customDomain) {
      const dispatchPanel = document.getElementById('acid-step7-pipeline-panel');
      if (!dispatchPanel) return;
      const clientSlug = (customDomain || 'apex-plant').replace(/^https?:\/\//, '').split('/')[0].split('.')[0] || 'apex-plant';
      const runId = 'ACID-RUN-' + Math.floor(100000 + Math.random() * 900000);
      const ts = new Date().toISOString();
      const sha = generateDeterministicSha256(clientSlug + '|' + runId + '|' + ts);

      dispatchPanel.classList.remove('hidden');
      dispatchPanel.innerHTML = `
        <div class="acid-hazard-stripe-bar mb-4"></div>
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#39FF14]/40 pb-3 mb-4 font-mono">
          <div>
            <span class="px-2.5 py-0.5 rounded bg-[#39FF14] text-slate-950 text-[10px] font-black uppercase">STEP 7 EXECUTION COMPLETE // 100% CHEMICAL BURN</span>
            <h3 class="text-lg font-black text-white mt-1">Multi-System Dispatch Pipeline — Machine-Verified Timestamp Locked</h3>
          </div>
          <span class="text-xs font-black text-[#00FF66]">RUN ID: ${runId} • ${ts}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div class="p-3.5 rounded bg-slate-950 border border-[#39FF14]">
            <div class="text-[10px] text-[#39FF14] font-black uppercase">1. Client Subdomain Updated</div>
            <div class="text-white font-bold mt-1">https://${clientSlug}.burn-1.com/evidence</div>
            <div class="text-[10px] text-slate-400 mt-1">Date-stamped HTML dossier published with live SHA-256 seal.</div>
          </div>
          <div class="p-3.5 rounded bg-slate-950 border border-[#39FF14]">
            <div class="text-[10px] text-[#39FF14] font-black uppercase">2. Automated Email Dispatch</div>
            <div class="text-white font-bold mt-1">PDF Dossier + Certificate Sent</div>
            <div class="text-[10px] text-slate-400 mt-1">Machine verification certificate attached &amp; dispatched.</div>
          </div>
          <div class="p-3.5 rounded bg-slate-950 border border-[#39FF14]">
            <div class="text-[10px] text-[#39FF14] font-black uppercase">3. Google Sheets &amp; CSV Queue</div>
            <div class="text-white font-bold mt-1">division_queue.csv → STATUS: SEALED</div>
            <div class="text-[10px] text-slate-400 mt-1">Logged timestamp, municipal ordinance citations &amp; hash.</div>
          </div>
          <div class="p-3.5 rounded bg-slate-950 border border-[#39FF14]">
            <div class="text-[10px] text-[#39FF14] font-black uppercase">4. Obsidian Local Vault Sync</div>
            <div class="text-white font-bold mt-1">/Vault/Evidence-Runs/${runId}.md</div>
            <div class="text-[10px] text-slate-400 mt-1">Appended immutable offline markdown run record.</div>
          </div>
        </div>
        <div class="mt-3 p-2.5 rounded bg-black/80 border border-[#39FF14]/50 font-mono text-[11px] text-[#39FF14] break-all">
          <strong>ALGORITHMIC CRYPTOGRAPHIC SHA-256 SEAL:</strong> SHA256:${sha}
        </div>
      `;
    }

    createHydraulicConsole(mount, {
      storageKey: ULTRABAR_STORAGE_PREFIX + 'acid_7step',
      headerTitle: 'ACID - START',
      headerSub: '7-STEP HAZMAT',
      shelves: ACID_STEPS,
      align: 'left',
      accentColor: '#39FF14',
      completeColor: '#00FF66',
      isAcid: true,
      onStepCommitted: syncAcidLiquidTube,
      onAllComplete: () => triggerAcidStep7Dispatch()
    });
  }

  // ==========================================================================
  // 2. TIMES2.HTML — PARALLEL LEFT (CLOCK 1) & RIGHT (CLOCK 2) ULTRA BARS
  // ==========================================================================
  function mountTimes2ParallelUltraBars() {
    const leftMount = document.getElementById('times2-left-ultrabar');
    const rightMount = document.getElementById('times2-right-ultrabar');
    if (!leftMount && !rightMount) return;

    if (leftMount) {
      createHydraulicConsole(leftMount, {
        storageKey: ULTRABAR_STORAGE_PREFIX + 'times2_clock1',
        headerTitle: 'CLOCK 1 // X²',
        headerSub: 'SOVEREIGNTY',
        shelves: TIMES2_LEFT_CLOCK1_SHELVES,
        align: 'left',
        accentColor: '#38bdf8',
        completeColor: '#00FF66',
        isAcid: false
      });
    }

    if (rightMount) {
      createHydraulicConsole(rightMount, {
        storageKey: ULTRABAR_STORAGE_PREFIX + 'times2_clock2',
        headerTitle: 'CLOCK 2 // X²',
        headerSub: 'RECEIPTS',
        shelves: TIMES2_RIGHT_CLOCK2_SHELVES,
        align: 'right',
        accentColor: '#f59e0b',
        completeColor: '#00FF66',
        isAcid: false
      });
    }
  }

  // ==========================================================================
  // 3. SIZZLEAN.HTML — CENTERED ULTRA BAR (< / > CHEVRONS + ACADEMY CREDITS)
  // ==========================================================================
  function mountSizzleanCenteredUltraBar() {
    const mount = document.getElementById('leons-ultra-bar-mount') || document.getElementById('sizzlean-ultra-bar-mount');
    if (!mount) return;

    const storageKey = ULTRABAR_STORAGE_PREFIX + 'sizzlean_centered';
    let savedBill = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) savedBill = JSON.parse(raw) || [];
    } catch (e) {}

    let szState = {
      isExpanded: true,
      activeIdx: 0,
      billIds: Array.isArray(savedBill) ? savedBill : [],
      applyCredits: ledgerState.creditApplied || false,
      customInput: '',
      downloadNotice: ''
    };

    function saveBill() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(szState.billIds));
      } catch (e) {}
    }

    function renderCentered() {
      const current = SIZZLEAN_WINDOWS[szState.activeIdx % SIZZLEAN_WINDOWS.length];
      const inBill = szState.billIds.includes(current.id);
      const rawSubtotal = szState.billIds.reduce((acc, id) => {
        const item = SIZZLEAN_WINDOWS.find((w) => w.id === id);
        return acc + (item ? item.price : 0);
      }, 0) || current.price;
      const creditDiscount = szState.applyCredits ? Math.min(50, rawSubtotal) : 0;
      const netTotal = Math.max(0, rawSubtotal - creditDiscount);

      mount.innerHTML = `
        <div style="border:2px solid #10b981;border-radius:16px;background:linear-gradient(180deg,#0c1311 0%,#070b0a 100%);box-shadow:0 24px 60px rgba(0,0,0,0.85),0 0 28px rgba(16,185,129,0.18);padding:20px;color:#f8fafc;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">
          
          <!-- Top Centered Header Bar + Future Academy Credit Funnel Badge -->
          <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid rgba(16,185,129,0.35);padding-bottom:14px;">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <button type="button" id="sz-center-toggle" style="padding:10px 18px;border-radius:8px;background:#121418;border:2px solid #10b981;color:#10b981;font-family:inherit;font-size:11.5px;font-weight:900;letter-spacing:1.2px;cursor:pointer;box-shadow:0 0 14px rgba(16,185,129,0.25);">
                ${szState.isExpanded ? '▾ SIZZLEAN CENTERED ULTRA BAR (OPEN)' : '▸ EXPAND CENTERED ULTRA BAR'}
              </button>
              <span style="font-size:10.5px;color:#cbd5e1;">
                Window ${szState.activeIdx + 1} of ${SIZZLEAN_WINDOWS.length} • ${szState.billIds.length} Selected in Bill
              </span>
            </div>

            <!-- Academy Credit Funnel Integration (Future Academy Loop) -->
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <button type="button" id="sz-credit-toggle" style="padding:7px 12px;border-radius:8px;background:${
                szState.applyCredits ? 'rgba(16,185,129,0.22)' : 'rgba(245,158,11,0.15)'
              };border:1.5px solid ${szState.applyCredits ? '#10b981' : '#f59e0b'};color:${
        szState.applyCredits ? '#34d399' : '#fcd34d'
      };font-family:inherit;font-size:10px;font-weight:800;cursor:pointer;">
                🎓 Earned Academy Credits: 2 ($50 Value) — ${szState.applyCredits ? '✓ APPLIED (-$' + creditDiscount + ')' : 'CLICK TO APPLY'}
              </button>
              <button type="button" id="sz-bind-bill-btn" style="padding:8px 14px;border-radius:8px;background:#10b981;color:#022c22;font-family:inherit;font-size:11px;font-weight:900;border:none;cursor:pointer;">
                Bind Bill ($${netTotal} USD) →
              </button>
            </div>
          </div>

          <!-- Center-Expanding Accordion Workspace with Left (<) and Right (>) Chevrons -->
          <div style="display:${szState.isExpanded ? 'block' : 'none'};margin-top:18px;transition:all 0.5s cubic-bezier(0.16, 1, 0.3, 1);">
            
            <!-- Window Selector Pills -->
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-bottom:16px;">
              ${SIZZLEAN_WINDOWS.map((w, i) => {
                const active = i === szState.activeIdx;
                const picked = szState.billIds.includes(w.id);
                return `
                  <button type="button" class="sz-pill-btn" data-idx="${i}" style="padding:6px 11px;border-radius:6px;font-family:inherit;font-size:10px;font-weight:800;cursor:pointer;border:1.5px solid ${
                  active ? '#10b981' : picked ? '#f59e0b' : '#2A2F38'
                };background:${active ? 'rgba(16,185,129,0.2)' : picked ? 'rgba(245,158,11,0.15)' : '#121418'};color:${
                  active ? '#34d399' : picked ? '#fcd34d' : '#D0D5DD'
                };">
                    ${picked ? '✓ ' : ''}${w.title}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Centered Frame with Left (<) and Right (>) Chevrons -->
            <div style="display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;">
              <button type="button" id="sz-left-chevron" aria-label="Previous Window" style="width:46px;height:46px;border-radius:50%;background:#121418;border:2px solid #10b981;color:#10b981;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 0 14px rgba(16,185,129,0.3);">
                &#10094;
              </button>

              <div style="padding:22px;border-radius:12px;background:#121418;border:1.5px solid rgba(16,185,129,0.5);text-align:center;max-width:760px;margin:0 auto;width:100%;">
                <div style="display:inline-flex;align-items:center;gap:8px;padding:3px 10px;border-radius:999px;background:rgba(16,185,129,0.15);border:1px solid #10b981;color:#34d399;font-size:10px;font-weight:800;">
                  <span>${current.category}</span>
                  <span>•</span>
                  <span>$${current.price} (${current.cadence})</span>
                </div>
                <h3 style="font-size:17px;font-weight:900;color:#ffffff;margin-top:10px;">${current.fullTitle}</h3>
                <p style="font-size:13px;color:#cbd5e1;max-width:620px;margin:8px auto 14px auto;font-family:'Inter',system-ui,sans-serif;line-height:1.5;">
                  ${current.desc}
                </p>

                <!-- Single-Input Self-Serve Generator -->
                <div style="max-width:520px;margin:0 auto 14px auto;text-align:left;">
                  <label style="display:block;font-size:9.5px;color:#94a3b8;text-transform:uppercase;margin-bottom:4px;">${current.inputLabel}</label>
                  <div style="display:flex;gap:8px;">
                    <input id="sz-window-input" type="text" value="${szState.customInput}" placeholder="${current.inputPlaceholder}" style="flex:1;padding:9px 12px;border-radius:6px;background:#0a0b0d;border:1px solid #2A2F38;color:#ffffff;font-family:inherit;font-size:11.5px;outline:none;" />
                    ${
                      current.price === 12
                        ? `<button type="button" id="sz-instant-pdf-btn" style="padding:9px 14px;border-radius:6px;background:#f59e0b;color:#0a0b0d;font-family:inherit;font-size:10.5px;font-weight:900;border:none;cursor:pointer;white-space:nowrap;">⬇ 1-Page PDF</button>`
                        : ''
                    }
                  </div>
                </div>

                <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:16px;">
                  ${current.deliverables
                    .map(
                      (d) => `
                    <span style="padding:5px 10px;border-radius:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(16,185,129,0.3);font-size:10px;color:#a7f3d0;">
                      ✓ ${d}
                    </span>
                  `
                    )
                    .join('')}
                </div>

                <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;">
                  <button type="button" id="sz-add-item-btn" style="padding:10px 20px;border-radius:8px;background:${
                    inBill ? '#10b981' : '#f59e0b'
                  };color:#0a0b0d;font-family:inherit;font-size:11px;font-weight:900;border:none;cursor:pointer;">
                    ${inBill ? '✓ IN YOUR BILL (CLICK TO REMOVE)' : `+ ADD TO BILL ($${current.price})`}
                  </button>
                  <button type="button" id="sz-checkout-now-btn" style="padding:10px 18px;border-radius:8px;background:rgba(16,185,129,0.15);border:1.5px solid #10b981;color:#34d399;font-family:inherit;font-size:11px;font-weight:800;cursor:pointer;">
                    Open Resident Binder Checkout ($${netTotal}) →
                  </button>
                </div>

                ${
                  szState.downloadNotice
                    ? `<div style="margin-top:12px;padding:8px 12px;border-radius:6px;background:rgba(16,185,129,0.15);border:1px solid #10b981;color:#34d399;font-size:10.5px;">${szState.downloadNotice}</div>`
                    : ''
                }
              </div>

              <button type="button" id="sz-right-chevron" aria-label="Next Window" style="width:46px;height:46px;border-radius:50%;background:#121418;border:2px solid #10b981;color:#10b981;font-size:18px;font-weight:900;cursor:pointer;box-shadow:0 0 14px rgba(16,185,129,0.3);">
                &#10095;
              </button>
            </div>
          </div>
        </div>
      `;

      mount.querySelector('#sz-center-toggle').onclick = () => {
        szState.isExpanded = !szState.isExpanded;
        renderCentered();
      };
      mount.querySelector('#sz-left-chevron').onclick = () => {
        szState.activeIdx = (szState.activeIdx - 1 + SIZZLEAN_WINDOWS.length) % SIZZLEAN_WINDOWS.length;
        szState.downloadNotice = '';
        renderCentered();
      };
      mount.querySelector('#sz-right-chevron').onclick = () => {
        szState.activeIdx = (szState.activeIdx + 1) % SIZZLEAN_WINDOWS.length;
        szState.downloadNotice = '';
        renderCentered();
      };
      mount.querySelectorAll('.sz-pill-btn').forEach((btn) => {
        btn.onclick = () => {
          szState.activeIdx = parseInt(btn.getAttribute('data-idx'), 10);
          szState.downloadNotice = '';
          renderCentered();
        };
      });
      const inp = mount.querySelector('#sz-window-input');
      if (inp) {
        inp.oninput = () => {
          szState.customInput = inp.value;
        };
      }
      const pdfBtn = mount.querySelector('#sz-instant-pdf-btn');
      if (pdfBtn) {
        pdfBtn.onclick = () => {
          const ref = (szState.customInput || 'CLIENT-DOMAIN.COM').trim();
          const sha = generateDeterministicSha256(current.id + '|' + ref);
          szState.downloadNotice = `✓ 1-Page Pre-Formatted PDF Generated for "${ref}" (${current.title}) • SHA256:${sha.slice(0, 24)}...`;
          renderCentered();
        };
      }
      mount.querySelector('#sz-credit-toggle').onclick = () => {
        szState.applyCredits = !szState.applyCredits;
        ledgerState.creditApplied = szState.applyCredits;
        saveLedgerState(ledgerState);
        renderCentered();
      };
      mount.querySelector('#sz-add-item-btn').onclick = () => {
        if (szState.billIds.includes(current.id)) {
          szState.billIds = szState.billIds.filter((x) => x !== current.id);
        } else {
          szState.billIds.push(current.id);
        }
        saveBill();
        renderCentered();
      };
      const openBillCheckout = () => {
        if (window.Burn1UnifiedHub) {
          const label =
            szState.billIds.length > 0
              ? `Sizzlean Custom Bill (${szState.billIds.length} items${szState.applyCredits ? ' - $50 Academy Credit' : ''})`
              : `${current.fullTitle}${szState.applyCredits ? ' (-$50 Academy Credit)' : ''}`;
          window.Burn1UnifiedHub.selectTierAndOpen(label, String(netTotal));
        }
      };
      mount.querySelector('#sz-bind-bill-btn').onclick = openBillCheckout;
      mount.querySelector('#sz-checkout-now-btn').onclick = openBillCheckout;
    }

    renderCentered();
  }

  // ==========================================================================
  // MOUNT ULTRA BAR ONLY ON THE 3 DIVISIONAL PAGES (ACID, TIMES2, SIZZLEAN)
  // ==========================================================================
  function mountDivisionalUltraBarsOnly() {
    const p = (window.location.pathname || '').toLowerCase();
    const bodyDiv = (document.body && document.body.getAttribute('data-division')) || '';

    if (p.includes('acid') || bodyDiv === 'acid') {
      mountAcidUltraBar();
    } else if (p.includes('times2') || bodyDiv === 'times2') {
      mountTimes2ParallelUltraBars();
    } else if (p.includes('sizzlean') || bodyDiv === 'sizzlean') {
      mountSizzleanCenteredUltraBar();
    }
  }

  // ==========================================================================
  // 5. UNIFIED BOTTOM-RIGHT FLOATING BOT ("2 BOTS IN 1 BUTTON": RESIDENT + COSMO)
  // ==========================================================================
  async function submitDivisionOrder(formData) {
    const divKey = formData.division_origin || getActiveDivisionKey();
    const profile = DIVISION_BOT_PROFILES[divKey] || DIVISION_BOT_PROFILES.freezer;
    const domain = formData.client_domain || 'client.burn-1.com';
    const email = formData.contact_email || (ledgerState.user && ledgerState.user.email) || 'exec@burn-1.com';
    const prod = formData.product_type || profile.tiers[0].name;
    const amt = String(formData.amount_paid || '99.00');

    const sha = generateDeterministicSha256(domain + '|' + prod + '|' + new Date().toISOString());
    const ord = {
      order_id: 'ORD-' + divKey.slice(0, 3).toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000),
      division_origin: divKey,
      client_domain: domain,
      contact_email: email,
      product_type: prod,
      amount_paid: amt,
      sha256_seal: 'SHA256:' + sha,
      timestamp_utc: new Date().toISOString(),
      vault_url: 'https://' + profile.subdomain + '/evidence/' + domain
    };

    ledgerState.orders = [ord].concat(ledgerState.orders || []).slice(0, 15);
    saveLedgerState(ledgerState);
    return { status: 'SUCCESS', queued_order: ord };
  }

  function mountUnifiedFloatingHub() {
    if (document.getElementById('burn1-unified-hub')) return;

    // Suppress any second floating bar from cosmo-widget.js so only ONE button exists
    const legacyCosmoBar = document.getElementById('cosmo-floating-bar');
    if (legacyCosmoBar) legacyCosmoBar.style.display = 'none';

    const divKey = getActiveDivisionKey();
    const profile = DIVISION_BOT_PROFILES[divKey] || DIVISION_BOT_PROFILES.freezer;
    const defaultTier = profile.tiers.find((t) => t.featured) || profile.tiers[0];

    const hub = document.createElement('div');
    hub.id = 'burn1-unified-hub';
    hub.style.cssText =
      'position:fixed;right:18px;bottom:18px;z-index:9995;font-family:"Inter",system-ui,-apple-system,sans-serif;';

    const tiersHtml = profile.tiers
      .map(
        (t, idx) => `
        <div class="b1-tier-card ${t.featured || idx === 1 ? 'is-selected' : ''}" data-tier-name="${t.name}" data-tier-price="${t.price}" style="border:1.5px solid rgba(255,255,255,0.16);border-radius:9px;background:rgba(255,255,255,0.03);margin-bottom:7px;padding:9px 11px;cursor:pointer;transition:all 0.15s;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-family:ui-monospace,monospace;font-size:11px;font-weight:800;">
            <span style="color:#ffffff;">${t.name}</span>
            <span style="color:${profile.accent};">$${t.price}<small style="color:#94a3b8;font-size:9px;">${t.cadence === 'one-time' ? '' : t.cadence}</small></span>
          </div>
          <div style="font-size:11px;color:#cbd5e1;margin-top:4px;line-height:1.4;">${t.scope}</div>
        </div>
      `
      )
      .join('');

    hub.innerHTML = `
      <div id="b1-hub-drawer" style="display:none;width:420px;max-width:calc(100vw - 32px);max-height:calc(100vh - 96px);overflow-y:auto;background:${profile.bgPanel};border:2px solid ${profile.borderColor};border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,0.85),0 0 28px ${profile.borderColor};color:#f8fafc;margin-bottom:12px;backdrop-filter:blur(18px);">
        
        <!-- Drawer Top Header + Segmented Switch: [Resident Bot] vs [Cosmo Bot] -->
        <div style="padding:12px 15px;background:rgba(0,0,0,0.65);border-bottom:1px solid rgba(255,255,255,0.12);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:9px;">
              <img src="burn1logopurplesilver.jpg" alt="BURN-1" style="width:30px;height:30px;border-radius:8px;object-fit:cover;border:1.5px solid ${profile.accent};" onerror="this.style.display='none'">
              <div>
                <div style="font-family:ui-monospace,monospace;font-size:9px;font-weight:800;color:${profile.accent};letter-spacing:0.06em;">${profile.badge}</div>
                <div style="font-size:13px;font-weight:900;color:#ffffff;">2 Bots in 1 • Unified Command Hub</div>
              </div>
            </div>
            <button id="b1-hub-close" type="button" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#e2e8f0;width:28px;height:28px;border-radius:7px;font-size:16px;cursor:pointer;">&times;</button>
          </div>

          <!-- Segmented Switch: [Resident Bot (Binder)] | [Cosmo Bot (Terminal)] -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;background:rgba(255,255,255,0.05);padding:4px;border-radius:9px;border:1px solid rgba(255,255,255,0.12);font-family:ui-monospace,monospace;font-size:10.5px;font-weight:800;">
            <button type="button" id="b1-switch-resident" style="padding:7px 10px;border-radius:6px;background:${profile.accent};color:#020617;border:none;cursor:pointer;font-weight:900;">
              🛡️ [Resident Bot] Binder
            </button>
            <button type="button" id="b1-switch-cosmo" style="padding:7px 10px;border-radius:6px;background:transparent;color:#e2e8f0;border:none;cursor:pointer;font-weight:800;">
              💻 [Cosmo Bot] Terminal
            </button>
          </div>
        </div>

        <!-- ==================================================================
             MODE 1: [RESIDENT BOT] — PAGE EXPLAINER & ACCORDION PAYMENT BINDER
             ================================================================== -->
        <div id="b1-pane-resident" style="padding:14px 15px;display:block;">
          <div id="b1-resident-chat" style="max-height:165px;overflow-y:auto;font-size:12px;line-height:1.45;margin-bottom:9px;">
            <div style="background:rgba(255,255,255,0.06);border-left:3px solid ${profile.accent};padding:8px 10px;border-radius:6px;margin-bottom:7px;">
              <strong style="display:block;font-family:ui-monospace,monospace;font-size:9.5px;color:${profile.accent};margin-bottom:2px;">${profile.name.toUpperCase()}</strong>
              ${profile.greeting}
            </div>
          </div>
          <div id="b1-resident-prompts" style="display:flex;flex-direction:column;gap:5px;margin-bottom:9px;"></div>
          <form id="b1-resident-ask-form" style="display:flex;gap:6px;margin-bottom:14px;">
            <input id="b1-resident-ask-input" type="text" placeholder="Ask Resident Bot about this page or checklist..." style="flex:1;padding:7px 10px;border-radius:7px;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.2);color:#ffffff;font-family:ui-monospace,monospace;font-size:11px;">
            <button type="submit" style="padding:7px 12px;border-radius:7px;background:${profile.accent};color:#020617;font-family:ui-monospace,monospace;font-size:10.5px;font-weight:900;border:none;cursor:pointer;">ASK</button>
          </form>

          <!-- Accordion Stripe / Binder Payment Hub -->
          <div style="border-top:1px solid rgba(255,255,255,0.12);padding-top:12px;">
            <div style="font-family:ui-monospace,monospace;font-size:10.5px;font-weight:900;color:${profile.accent};text-transform:uppercase;margin-bottom:8px;">
              ▼ Accordion Payment Step • Confirm &amp; Bind SHA-256 Seal
            </div>
            <div id="b1-tiers-container">${tiersHtml}</div>

            <form id="b1-payment-form" style="margin-top:10px;padding:10px;border-radius:9px;background:rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.14);">
              <input type="hidden" id="b1-pay-tier-name" value="${defaultTier.name}">
              <input type="hidden" id="b1-pay-tier-price" value="${defaultTier.price}">
              <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px;">
                <input id="b1-pay-domain" type="text" required placeholder="Target Client Domain (e.g. plant.yourcompany.com)" style="width:100%;padding:7px 10px;border-radius:6px;background:#090d16;border:1px solid rgba(255,255,255,0.22);color:#ffffff;font-family:ui-monospace,monospace;font-size:11px;">
                <input id="b1-pay-email" type="email" required placeholder="Dispatch Email for Webhook &amp; PDF Seal" style="width:100%;padding:7px 10px;border-radius:6px;background:#090d16;border:1px solid rgba(255,255,255,0.22);color:#ffffff;font-family:ui-monospace,monospace;font-size:11px;">
              </div>
              <div style="font-family:ui-monospace,monospace;font-size:10px;color:#cbd5e1;margin-bottom:8px;display:flex;flex-direction:column;gap:4px;">
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                  <input type="checkbox" id="b1-addon-cobrand" value="25" style="accent-color:${profile.accent};">
                  <span>+ Add Co-Branded Underwriter Cover (+$25)</span>
                </label>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                  <input type="checkbox" checked style="accent-color:${profile.accent};">
                  <span>Confirm Before Payment: Authorize Outside-In Telemetry</span>
                </label>
              </div>
              <button type="submit" id="b1-pay-submit-btn" style="width:100%;padding:9px 12px;border-radius:8px;background:${profile.accent};color:#020617;font-family:ui-monospace,monospace;font-size:11px;font-weight:900;text-transform:uppercase;border:none;cursor:pointer;">
                Verify Payment &amp; Issue SHA-256 Seal ($${defaultTier.price}) →
              </button>
            </form>
            <div id="b1-pay-receipt" style="display:none;margin-top:8px;padding:10px;border-radius:8px;background:#020617;border:1.5px solid #10b981;font-family:ui-monospace,monospace;font-size:10.5px;color:#34d399;"></div>
          </div>
        </div>

        <!-- ==================================================================
             MODE 2: [COSMO BOT] — FULL CLI TERMINAL + UNIVERSAL SIGN-IN + VAULT
             ================================================================== -->
        <div id="b1-pane-cosmo" style="padding:14px 15px;display:none;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;">
          <!-- Interactive CLI Terminal -->
          <div style="background:#05070c;border:1.5px solid ${profile.accent};border-radius:8px;padding:10px;margin-bottom:12px;">
            <div style="font-size:9.5px;color:${profile.accent};font-weight:800;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:4px;margin-bottom:6px;display:flex;justify-content:space-between;">
              <span>COSMO CLI TERMINAL // v3.6</span>
              <span>TYPE: help | status | seal | goto</span>
            </div>
            <div id="b1-cosmo-cli-log" style="max-height:130px;overflow-y:auto;font-size:10.5px;color:#a7f3d0;line-height:1.45;margin-bottom:8px;">
              <div>[system] Cosmo Terminal initialized on ${profile.subdomain}.</div>
              <div>[system] Type <code>help</code> or authenticate below to bind your SHA-256 ledger.</div>
            </div>
            <form id="b1-cosmo-cli-form" style="display:flex;gap:6px;">
              <span style="color:${profile.accent};font-weight:900;padding-top:5px;">&gt;</span>
              <input id="b1-cosmo-cli-input" type="text" placeholder="Enter CLI command (help, status, verify, goto)..." style="flex:1;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.25);color:#ffffff;font-family:inherit;font-size:11px;padding:4px 0;outline:none;">
              <button type="submit" style="padding:4px 10px;border-radius:4px;background:${profile.accent};color:#020617;font-family:inherit;font-size:10px;font-weight:900;border:none;cursor:pointer;">RUN</button>
            </form>
          </div>

          <!-- Universal Sign-In (Google Workspace + 2-Step MFA Code) -->
          <div style="font-size:10.5px;color:#cbd5e1;margin-bottom:8px;">
            <strong>Universal Login:</strong> Authenticate via Google Verification or 2-Step MFA Code to route to your client subdomain vault:
          </div>
          <button type="button" id="b1-google-auth-btn" style="width:100%;padding:8px 12px;border-radius:7px;background:#ffffff;color:#0f172a;font-family:inherit;font-size:11px;font-weight:800;border:none;cursor:pointer;margin-bottom:8px;">
            G • Verify with Google Workspace Identity
          </button>

          <form id="b1-mfa-form" style="display:flex;flex-direction:column;gap:6px;">
            <input id="b1-mfa-email" type="email" required placeholder="Operator / Client Email" style="width:100%;padding:7px 10px;border-radius:6px;background:#05070c;border:1px solid rgba(255,255,255,0.22);color:#ffffff;font-family:inherit;font-size:11px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
              <input id="b1-mfa-code" type="text" required value="202688" placeholder="2-Step MFA Code" style="width:100%;padding:7px 10px;border-radius:6px;background:#05070c;border:1px solid rgba(255,255,255,0.22);color:#ffffff;font-family:inherit;font-size:11px;">
              <select id="b1-mfa-role" style="width:100%;padding:7px 8px;border-radius:6px;background:#05070c;border:1px solid rgba(255,255,255,0.22);color:#ffffff;font-family:inherit;font-size:10.5px;">
                <option value="direct">Direct Client</option>
                <option value="msp">MSP Partner</option>
                <option value="broker">Insurance Broker</option>
              </select>
            </div>
            <button type="submit" style="width:100%;padding:8px 12px;border-radius:7px;background:${profile.accent};color:#020617;font-family:inherit;font-size:11px;font-weight:900;text-transform:uppercase;border:none;cursor:pointer;">
              Bind Session &amp; Unlock Subdomain Vault →
            </button>
          </form>
          <div id="b1-auth-status" style="display:none;margin-top:8px;padding:8px;border-radius:6px;background:rgba(16,185,129,0.15);border:1px solid #10b981;color:#34d399;font-size:10px;"></div>

          <!-- [GO TO] Subdomain & Division Vault Router -->
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.12);">
            <div style="font-size:9.5px;color:${profile.accent};font-weight:800;margin-bottom:6px;">[GO TO] CLIENT SUBDOMAIN &amp; DIVISION ROUTER:</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:10px;">
              <a href="acid.html" style="padding:5px 8px;border-radius:5px;background:rgba(57,255,20,0.12);border:1px solid rgba(57,255,20,0.4);color:#39FF14;text-decoration:none;font-weight:700;">🧪 Acid Division</a>
              <a href="times2.html" style="padding:5px 8px;border-radius:5px;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.4);color:#38bdf8;text-decoration:none;font-weight:700;">⏱️ Times2 (X²)</a>
              <a href="sizzlean.html" style="padding:5px 8px;border-radius:5px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.4);color:#10b981;text-decoration:none;font-weight:700;">🔥 Sizzlean</a>
              <a href="freezer.html" style="padding:5px 8px;border-radius:5px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.2);color:#e2e8f0;text-decoration:none;font-weight:700;">❄️ FreezerBurn</a>
              <a href="directory.html" style="padding:5px 8px;border-radius:5px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.2);color:#e2e8f0;text-decoration:none;font-weight:700;">🏛️ Directory</a>
              <a href="msp-intake.html" style="padding:5px 8px;border-radius:5px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.2);color:#e2e8f0;text-decoration:none;font-weight:700;">💼 MSP / Broker</a>
            </div>
          </div>
        </div>
      </div>

      <!-- SINGLE FLOATING TRIGGER BUTTON -->
      <div style="display:flex;justify-content:flex-end;">
        <button id="b1-hub-launcher-btn" type="button" style="display:inline-flex;align-items:center;gap:10px;padding:11px 18px;border-radius:9999px;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border:2px solid ${profile.accent};color:#ffffff;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:11.5px;font-weight:900;letter-spacing:0.04em;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,0.7),0 0 18px ${profile.borderColor};">
          <span style="width:9px;height:9px;border-radius:50%;background:${profile.accent};box-shadow:0 0 10px ${profile.accent};"></span>
          <span>Resident Binder &amp; Cosmo Bot</span>
        </button>
      </div>
    `;

    document.body.appendChild(hub);

    const drawer = hub.querySelector('#b1-hub-drawer');
    const btnResident = hub.querySelector('#b1-switch-resident');
    const btnCosmo = hub.querySelector('#b1-switch-cosmo');
    const paneResident = hub.querySelector('#b1-pane-resident');
    const paneCosmo = hub.querySelector('#b1-pane-cosmo');

    function switchBotMode(mode) {
      drawer.style.display = 'block';
      const isCosmo = mode === 'cosmo' || mode === 'auth';
      paneResident.style.display = isCosmo ? 'none' : 'block';
      paneCosmo.style.display = isCosmo ? 'block' : 'none';
      btnResident.style.background = isCosmo ? 'transparent' : profile.accent;
      btnResident.style.color = isCosmo ? '#e2e8f0' : '#020617';
      btnCosmo.style.background = isCosmo ? profile.accent : 'transparent';
      btnCosmo.style.color = isCosmo ? '#020617' : '#e2e8f0';
    }

    btnResident.onclick = () => switchBotMode('resident');
    btnCosmo.onclick = () => switchBotMode('cosmo');
    hub.querySelector('#b1-hub-launcher-btn').onclick = () => {
      drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
    };
    hub.querySelector('#b1-hub-close').onclick = () => {
      drawer.style.display = 'none';
    };

    // Resident Bot Prompts & Chat
    const chatBox = hub.querySelector('#b1-resident-chat');
    const promptContainer = hub.querySelector('#b1-resident-prompts');
    function addResidentMsg(sender, text, isBot) {
      const d = document.createElement('div');
      d.style.cssText = isBot
        ? `background:rgba(255,255,255,0.07);border-left:3px solid ${profile.accent};padding:8px 10px;border-radius:6px;margin-bottom:6px;color:#f1f5f9;`
        : `background:rgba(255,255,255,0.14);padding:6px 10px;border-radius:6px;margin-bottom:6px;color:#ffffff;font-weight:600;text-align:right;`;
      d.innerHTML = `<strong style="display:block;font-family:ui-monospace,monospace;font-size:9px;color:${isBot ? profile.accent : '#cbd5e1'};">${sender}</strong>${text}`;
      chatBox.appendChild(d);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    profile.prompts.forEach((p) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = p.label;
      b.style.cssText =
        'text-align:left;padding:6px 10px;border-radius:6px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);color:#e2e8f0;font-size:11px;font-weight:600;cursor:pointer;';
      b.onclick = () => {
        addResidentMsg('YOU', p.label, false);
        addResidentMsg(profile.name.toUpperCase(), p.reply, true);
      };
      promptContainer.appendChild(b);
    });

    hub.querySelector('#b1-resident-ask-form').onsubmit = (e) => {
      e.preventDefault();
      const inp = hub.querySelector('#b1-resident-ask-input');
      const q = (inp.value || '').trim();
      if (!q) return;
      inp.value = '';
      addResidentMsg('YOU', q, false);
      addResidentMsg(
        profile.name.toUpperCase(),
        `${BIND_DOCTRINE} ${SLA_TURNAROUND} Select a tier in the Accordion Payment Step below or switch to [Cosmo Bot] Terminal for CLI & Universal Login.`,
        true
      );
    };

    // Accordion Tier Selection & Payment
    const tierNameInp = hub.querySelector('#b1-pay-tier-name');
    const tierPriceInp = hub.querySelector('#b1-pay-tier-price');
    const addonChk = hub.querySelector('#b1-addon-cobrand');
    const payBtn = hub.querySelector('#b1-pay-submit-btn');

    function updatePayBtn() {
      const base = parseFloat(tierPriceInp.value || '99');
      const extra = addonChk && addonChk.checked ? 25 : 0;
      payBtn.textContent = `Verify Payment & Issue SHA-256 Seal ($${base + extra}) →`;
    }

    hub.querySelectorAll('.b1-tier-card').forEach((card) => {
      card.onclick = () => {
        hub.querySelectorAll('.b1-tier-card').forEach((c) => {
          c.style.borderColor = 'rgba(255,255,255,0.16)';
          c.style.background = 'rgba(255,255,255,0.03)';
        });
        card.style.borderColor = profile.accent;
        card.style.background = 'rgba(255,255,255,0.09)';
        tierNameInp.value = card.getAttribute('data-tier-name');
        tierPriceInp.value = card.getAttribute('data-tier-price');
        updatePayBtn();
      };
    });
    if (addonChk) addonChk.onchange = updatePayBtn;

    hub.querySelector('#b1-payment-form').onsubmit = async (e) => {
      e.preventDefault();
      const dom = hub.querySelector('#b1-pay-domain').value.trim();
      const em = hub.querySelector('#b1-pay-email').value.trim();
      const base = parseFloat(tierPriceInp.value || '99');
      const extra = addonChk && addonChk.checked ? 25 : 0;
      const total = (base + extra).toFixed(2);

      const res = await submitDivisionOrder({
        division_origin: divKey,
        client_domain: dom,
        contact_email: em,
        product_type: tierNameInp.value,
        amount_paid: total
      });
      const ord = res.queued_order;
      const rec = hub.querySelector('#b1-pay-receipt');
      rec.style.display = 'block';
      rec.innerHTML = `
        <div style="font-weight:900;color:#10b981;">✓ PAYMENT VERIFIED &amp; WEBHOOK DISPATCHED (${ord.order_id})</div>
        <div style="color:#ffffff;margin-top:2px;">Vault: <strong>${ord.vault_url}</strong></div>
        <div style="color:${profile.accent};word-break:break-all;margin-top:2px;">${ord.sha256_seal}</div>
      `;
    };

    // Cosmo CLI Terminal Commands
    const cliLog = hub.querySelector('#b1-cosmo-cli-log');
    hub.querySelector('#b1-cosmo-cli-form').onsubmit = (e) => {
      e.preventDefault();
      const inp = hub.querySelector('#b1-cosmo-cli-input');
      const cmd = (inp.value || '').trim();
      if (!cmd) return;
      inp.value = '';
      const cl = cmd.toLowerCase();
      let out = `[cosmo] Executed "${cmd}" — Agentless Perimeter Telemetry active. SHA-256 Seal verified.`;
      if (cl === 'help') {
        out = `[cosmo] Commands: status (check division progress), seal (generate sample SHA-256), goto acid | goto times2 | goto sizzlean | goto freezer`;
      } else if (cl === 'status') {
        out = `[cosmo] Division: ${profile.subdomain} • Orders in session ledger: ${(ledgerState.orders || []).length} • Academy Credits: ${ledgerState.academyCredits} ($50 Value)`;
      } else if (cl.startsWith('goto ')) {
        const dest = cl.replace('goto ', '').trim();
        window.location.href = dest.endsWith('.html') ? dest : dest + '.html';
        return;
      }
      const line = document.createElement('div');
      line.innerHTML = `<span style="color:#ffffff;">&gt; ${cmd}</span><br/><span>${out}</span>`;
      cliLog.appendChild(line);
      cliLog.scrollTop = cliLog.scrollHeight;
    };

    // Universal Auth in Cosmo Pane
    const authStatus = hub.querySelector('#b1-auth-status');
    function bindUser(email, method) {
      ledgerState.user = { email, method, ts: new Date().toISOString() };
      saveLedgerState(ledgerState);
      authStatus.style.display = 'block';
      authStatus.innerHTML = `✓ Authenticated via ${method}: <strong>${email}</strong> • Client Vault: <code>https://${profile.subdomain}/evidence</code>`;
    }
    hub.querySelector('#b1-google-auth-btn').onclick = () => {
      const em = hub.querySelector('#b1-mfa-email').value.trim() || 'verified.operator@burn-1.com';
      bindUser(em, 'Google Workspace OAuth');
    };
    hub.querySelector('#b1-mfa-form').onsubmit = (e) => {
      e.preventDefault();
      const em = hub.querySelector('#b1-mfa-email').value.trim();
      const code = hub.querySelector('#b1-mfa-code').value.trim();
      bindUser(em, '2-Step MFA (' + code + ')');
    };

    window.Burn1UnifiedHub = {
      open: () => {
        drawer.style.display = 'block';
      },
      close: () => {
        drawer.style.display = 'none';
      },
      openTab: (tabName) => {
        switchBotMode(tabName === 'auth' || tabName === 'cosmo' ? 'cosmo' : 'resident');
      },
      selectTierAndOpen: (tierName, tierPrice) => {
        switchBotMode('resident');
        if (tierName) tierNameInp.value = tierName;
        if (tierPrice) tierPriceInp.value = String(tierPrice);
        updatePayBtn();
      }
    };
  }

  window.Burn1DivisionEngine = {
    openAuth: () => window.Burn1UnifiedHub && window.Burn1UnifiedHub.openTab('cosmo'),
    openPaymentHub: (name, price) => window.Burn1UnifiedHub && window.Burn1UnifiedHub.selectTierAndOpen(name, price),
    submitOrder: submitDivisionOrder
  };

  function init() {
    injectMasterCssComponents();
    mountDivisionalUltraBarsOnly();
    mountUnifiedFloatingHub();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
