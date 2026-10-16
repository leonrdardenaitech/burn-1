// BURN-1 Gamified Onboarding Widget v2 — DAY MODE SILVER GLASS & DARK PURPLE
// Legally defensible renewal prep framing, zero-password simulation, 100% on-device localStorage.

(function() {
    'use strict';

    // --------------------------------------------------------------------------
    // CONTENT CONSTANTS & SCENARIO ENGINE
    // --------------------------------------------------------------------------
    const INDUSTRY_META = {
        clinic: {
            label: "Clinic / Healthcare",
            vendor: "MedSupply North",
            records: "Patient records",
            crew: "front desk",
            note: "If you are a covered entity or business associate, the HIPAA Security Rule expects access controls, audit controls, and integrity protections (45 CFR § 164.312). This mission does not decide that, and it does not create safe harbor."
        },
        professional: {
            label: "Professional Services",
            vendor: "Northline Counsel",
            records: "Client files",
            crew: "associates",
            note: "Client confidentiality fails in boring ways: a shared login, a mailbox rule, a wire to a new account. The missions rehearse those moments."
        },
        trades: {
            label: "Trades / Field Ops",
            vendor: "RidgeLine Materials",
            records: "Job files",
            crew: "crew leads",
            note: "Shared truck logins and texted passwords are how field teams get phished. MFA has to work for people who are not at a desk."
        },
        hospitality: {
            label: "Hospitality",
            vendor: "Harborline Foods",
            records: "Reservation & guest records",
            crew: "shift leads",
            note: "Shared POS and manager passwords change every season. A callback habit matters more than a poster in the office."
        },
        retail: {
            label: "Retail",
            vendor: "Parcel & Co.",
            records: "Customer & order records",
            crew: "store leads",
            note: "Seasonal staff and vendor portals are the usual holes. Train the habit before the holiday rush, not during a claim."
        }
    };

    const HEADCOUNT_LABEL = {
        "1-10": "1–10 people",
        "11-50": "11–50 people",
        "51-200": "51–200 people",
        "201+": "201+ people"
    };

    const IDP_META = {
        microsoft: {
            label: "Microsoft 365 / Entra",
            real: "https://entra.microsoft.com",
            fake: "https://entra-secure-login.co/setup",
            realHint: "Type the Microsoft address you already use, or open a bookmark. Do not follow a link from chat."
        },
        google: {
            label: "Google Workspace",
            real: "https://admin.google.com",
            fake: "https://accounts-google-secure.co/admin",
            realHint: "Type admin.google.com yourself. A lookalike with an extra word is not Google."
        },
        okta: {
            label: "Okta / Standalone IdP",
            real: "https://yourorg.okta.com",
            fake: "https://yourorg-okta-verify.net",
            realHint: "Your tenant sub-domain lives under okta.com. Anything with hyphenated domains is attacker infrastructure."
        }
    };

    const STAGES = [
        { id: 1, name: "Floor pass", tag: "PROFILE", short: "Simulated lane & setup guide" },
        { id: 2, name: "Fish Hunter", tag: "DETECTION", short: "Lenses, backup-code lures, real mail" },
        { id: 3, name: "Recovery vault", tag: "RESILIENCE", short: "Monday survivors & restore drills" },
        { id: 4, name: "Wire freeze", tag: "FINANCE", short: "Hold vs send callback habit" },
        { id: 5, name: "Hard key", tag: "IDENTITY", short: "Real portal vs chat token lure" },
        { id: 6, name: "Object lock", tag: "IMMUTABILITY", short: "Retention, compliance & test denial" },
        { id: 7, name: "Binder drop", tag: "EVIDENCE", short: "Sort true records from training artifacts" },
        { id: 8, name: "The desk", tag: "SEAL", short: "Manifest owners & SHA-256 seal" }
    ];

    function systemsFor(intake) {
        const records = intake?.industry && INDUSTRY_META[intake.industry]
            ? INDUSTRY_META[intake.industry].records
            : "Primary customer files";
        return [
            { id: "payroll", name: "Payroll & direct deposits", critical: true, hint: "Staff expect paid on Friday." },
            { id: "mail", name: "Mailboxes & tenant root", critical: true, hint: "Invoices, resets, and daily operations run here." },
            { id: "records", name: records, critical: true, hint: "Industry operational data and historical records." },
            { id: "payments", name: "Billing & payment ledger", critical: true, hint: "Cash flow stops cold without it." },
            { id: "site", name: "Marketing splash website", critical: false, hint: "Can wait if core operations are down." },
            { id: "photos", name: "Social & photo archive", critical: false, hint: "Nice to have, not needed Monday morning." }
        ];
    }

    function buildFish(intake) {
        const vendor = intake?.industry && INDUSTRY_META[intake.industry]
            ? INDUSTRY_META[intake.industry].vendor
            : "Apex Supplies";
        const idp = intake?.idp && IDP_META[intake.idp]
            ? IDP_META[intake.idp].label
            : "Identity Provider";

        return [
            {
                id: "case-backup-codes",
                fromName: `${idp} Tenant Security`,
                fromEmail: "security-noreply@auth-perimeter.net",
                subject: "Urgent: Generate offline recovery passcodes",
                preview: "We detected new sign-ins. Reply with your generated 8-digit backup codes or input them here.",
                lenses: {
                    sender: { text: "Lookalike domain: auth-perimeter.net is not your genuine identity provider.", tone: "hot" },
                    link: { text: "Points to an unverified auth form off-tenant.", tone: "hot" },
                    ask: { text: "Asks for backup passcodes — real IdP never asks staff to send backup codes.", tone: "hot" }
                },
                best: "report",
                why: {
                    report: "Clean catch. Backup codes are the master keys attackers crave when MFA is enforced.",
                    hold: "Holding keeps credentials safe, but tenant security must be alerted to revoke the campaign.",
                    pass: "Fatal error: entering backup codes grants the attacker persistent session access."
                },
                xp: { report: 180, hold: 100, pass: 0 }
            },
            {
                id: "case-vendor-invoice",
                fromName: `${vendor} Accounts Receivable`,
                fromEmail: "billing@apex-supp1ies.com",
                subject: "Updated wiring coordinates: Invoice #9842 overdue",
                preview: "Due to a banking consolidation, our wire instructions changed. Use attached PDF routing only.",
                lenses: {
                    sender: { text: "Character substitution: apex-supp1ies.com uses the number 1 instead of letter L.", tone: "hot" },
                    link: { text: "Hosted on third-party file locker with active password protection.", tone: "hot" },
                    ask: { text: "Payment coordinate redirection requested without prior out-of-band notice.", tone: "hot" }
                },
                best: "hold",
                why: {
                    report: "Good, but the urgent operational rule is HOLD THE PAYMENT and place a voice callback on a known number.",
                    hold: "Spot on! Freeze payment immediately and verify using the voice number stored in the original contract.",
                    pass: "Disaster: transferring to unverified attacker routing will incur irrecoverable loss."
                },
                xp: { report: 120, hold: 160, pass: 0 }
            },
            {
                id: "case-hr-w2",
                fromName: "Internal HR Benefits",
                fromEmail: "hr-payroll@company-internal.com",
                subject: "2026 Annual Open Enrollment Forms",
                preview: "Please review the standard open enrollment benefits package on the internal company intranet.",
                lenses: {
                    sender: { text: "Matches internal SPF/DKIM authenticated company mailbox.", tone: "ok" },
                    link: { text: "Resolves directly to the internal intranet document library.", tone: "ok" },
                    ask: { text: "Requests routine annual staff benefits review.", tone: "ok" }
                },
                best: "pass",
                why: {
                    report: "Reporting legitimate internal HR emails clogs the SOC triage queue with false alarms.",
                    hold: "Holding standard employee communications slows legitimate company workflow.",
                    pass: "Correct. Not every email is an attack — recognizing genuine communication prevents business friction."
                },
                xp: { report: 30, hold: 50, pass: 140 }
            },
            {
                id: "case-shipping-qr",
                fromName: "Express Logistics",
                fromEmail: "notifications@parcel-delivery-hub.org",
                subject: "Undelivered package: Scan QR barcode to reschedule",
                preview: "Carrier could not access your facility. Scan the dynamic QR code on your mobile phone to verify address.",
                lenses: {
                    sender: { text: "Third-party generic delivery notification service.", tone: "warn" },
                    link: { text: "QR code payload routes through a dynamic redirector masking destination URL.", tone: "hot" },
                    ask: { text: "Requires mobile QR scanning, bypassing desktop browser security filters.", tone: "hot" }
                },
                best: "report",
                why: {
                    report: "Excellent. Quishing (QR phishing) shifts employees to unmanaged mobile phones without URL inspection.",
                    hold: "Holding prevents immediate interaction, but IT must know QR lures are reaching inboxes.",
                    pass: "Risk: scanning malicious QR codes takes users to phishing harvesting pages on mobile."
                },
                xp: { report: 150, hold: 80, pass: 0 }
            },
            {
                id: "case-shared-doc",
                fromName: "Executive Leadership Office",
                fromEmail: "exec-office@secure-sharepoint-view.info",
                subject: "Confidential: Q4 Bonus Compensation Schedule",
                preview: "A confidential spreadsheet was shared with you. Sign in with organizational credentials to view.",
                lenses: {
                    sender: { text: "Unauthenticated lookalike: secure-sharepoint-view.info is not microsoft.com.", tone: "hot" },
                    link: { text: "Reverse-proxy authentication phishing page designed to steal session cookies.", tone: "hot" },
                    ask: { text: "Demands immediate IdP credentials under emotional compensation hook.", tone: "hot" }
                },
                best: "report",
                why: {
                    report: "Bullseye! Executive compensation lures prey on curiosity to capture AitM session tokens.",
                    hold: "Safe from immediate compromise, but phishing report protects team members.",
                    pass: "Critical compromise: AiTM reverse proxies steal both passwords and session cookies."
                },
                xp: { report: 170, hold: 90, pass: 0 }
            }
        ];
    }

    const BINDER_SLOTS = [
        { id: "slot-mfa", title: "MFA Enrollment Export", detail: "Proof all admin and user accounts have phishing-resistant MFA active." },
        { id: "slot-backup", title: "Air-Gapped Backup Report", detail: "Attestation of immutable backup runs and quarterly restore validation." },
        { id: "slot-wire", title: "Wire Verification Protocol", detail: "Signed dual-custody verification callback policy with documented numbers." },
        { id: "slot-key", title: "Physical Hardware Key Docket", detail: "Inventory showing FIDO2 hardware keys assigned to privileged admins." },
        { id: "slot-lock", title: "Object Lock Retention Proof", detail: "Cloud storage configuration showing immutable WORM compliance lock active." },
        { id: "slot-none", title: "Not Evidence (Discard Pile)", detail: "Marketing collateral, informal chats, or unverified claims that underwriters reject." }
    ];

    const BINDER_ARTIFACTS = [
        { id: "art-1", title: "IdP MFA Telemetry CSV", slotId: "slot-mfa", desc: "Exported tenant user list showing 100% Authenticator app enrollment." },
        { id: "art-2", title: "Vendor Promotional Video", slotId: "slot-none", desc: "A 4-minute YouTube sales video explaining zero trust principles." },
        { id: "art-3", title: "Immutable S3 Bucket JSON", slotId: "slot-lock", desc: "Cloud API configuration verifying 90-day WORM Compliance Object Lock." },
        { id: "art-4", title: "Slack Chat 'Backups Look Good'", slotId: "slot-none", desc: "A brief comment in #general saying backups seemed fine last week." },
        { id: "art-5", title: "Signed Dual-Control Wire Form", slotId: "slot-wire", desc: "Formal banking protocol requiring secondary phone check before transfers." },
        { id: "art-6", title: "Quarterly Restore Drill Log", slotId: "slot-backup", desc: "Signed document proving test restore of databases was completed in 4 hours." },
        { id: "art-7", title: "Insurance Discount Promo Email", slotId: "slot-none", desc: "A newsletter claiming you can get 30% off cyber insurance." },
        { id: "art-8", title: "FIDO2 Key Serial Register", slotId: "slot-key", desc: "Hardware token inventory tracking physical YubiKeys issued to root admins." },
        { id: "art-9", title: "Cybersecurity Awareness Poster", slotId: "slot-none", desc: "A breakroom graphic saying 'Don\\'t click suspicious links'." },
        { id: "art-10", title: "Independent Penetration Test", slotId: "slot-mfa", desc: "Third-party assessment validating no open remote administrative ingress without MFA." }
    ];

    const LOCK_OBJECTS = [
        { id: "invoices", label: "Signed Customer Invoices (PDF)", critical: true, size: "14.2 GB" },
        { id: "payroll", label: "Direct Deposit Schedules (CSV)", critical: true, size: "1.8 GB" },
        { id: "bank", label: "Monthly Bank & Merchant Statements", critical: true, size: "4.5 GB" },
        { id: "logs", label: "Web Server & Firewall Access Logs", critical: false, size: "48.1 GB" },
        { id: "photos", label: "Marketing Images & Social Assets", critical: false, size: "120.0 GB" }
    ];

    function companySlug(name) {
        return (name || "company")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    function guideText(intake) {
        const idp = IDP_META[intake?.idp] || IDP_META.microsoft;
        const ind = INDUSTRY_META[intake?.industry] || INDUSTRY_META.professional;

        return [
            "================================================================================",
            `BURN-1 FREE OPERATIONAL MFA SETUP GUIDE // ${intake?.company || "YOUR COMPANY"}`,
            `Platform Lane: ${idp.label}`,
            `Industry Focus: ${ind.label}`,
            "================================================================================",
            "",
            "CORE OPERATIONAL MANDATE:",
            "Commercial underwriters and regulatory frameworks require multi-factor authentication",
            "enforced on 100% of remote ingress, email accounts, and administrative dashboards.",
            "",
            "STEP-BY-STEP REMEDIATION PROTOCOL (ZERO SOFTWARE COST):",
            "1. Enter genuine administration portal directly:",
            `   ${idp.real}`,
            `   (${idp.realHint})`,
            "",
            "2. Mandate Phishing-Resistant Authenticator:",
            "   - Enforce Authenticator App (Push Notification with Number Matching) or FIDO2 Passkeys.",
            "   - Completely deactivate telephony SMS fallback (SMS tokens are vulnerable to SIM swapping).",
            "",
            "3. Export Attestation Telemetry:",
            "   - Navigate to IdP User Directory -> Export Users & Authentication Methods.",
            "   - Archive CSV showing 100% MFA enrollment for evidence submission at renewal.",
            "",
            "LEGAL & UNDERWRITING NOTICE:",
            "This document is a free educational training aid provided by BURN-1 Systems.",
            "It does not constitute insurance underwriting approval, carrier certification, or legal counsel.",
            "Carriers (Chubb, Travelers, Beazley) determine policy terms and pricing independently.",
            "================================================================================"
        ].join("\n");
    }

    function seedRows(intake) {
        return [
            {
                id: "row-1",
                stage: 1,
                control: "MFA on Ingress & Email",
                request: "Proof that 100% of remote logins and email accounts require phishing-resistant MFA.",
                status: "missing",
                owner: "",
                reviewDate: "",
                next: "Export user authentication methods CSV from identity provider console.",
                trainingNote: "Floor pass complete on this device."
            },
            {
                id: "row-2",
                stage: 2,
                control: "Phishing Triage & Lures",
                request: "Evidence of regular staff phishing simulation and active triage reporting channel.",
                status: "missing",
                owner: "",
                reviewDate: "",
                next: "Set up dedicated phishing report mailbox and test triage escalation.",
                trainingNote: "Fish Hunter scored and logged."
            },
            {
                id: "row-3",
                stage: 3,
                control: "Immutable Backup Architecture",
                request: "Verification of air-gapped or Object Lock backups tested via restoration drill.",
                status: "missing",
                owner: "",
                reviewDate: "",
                next: "Schedule calendar date with IT lead for mock database restore drill.",
                trainingNote: "Recovery vault priority ranked."
            },
            {
                id: "row-4",
                stage: 4,
                control: "Dual-Control Wire Protocol",
                request: "Documented policy requiring voice callback on known number before banking modifications.",
                status: "missing",
                owner: "",
                reviewDate: "",
                next: "Print callback docket for AP team and mandate phone verifications.",
                trainingNote: "Wire freeze drill executed."
            },
            {
                id: "row-5",
                stage: 5,
                control: "Hardware Key Privileged Access",
                request: "Attestation that cloud administrative root accounts use physical FIDO2 tokens.",
                status: "missing",
                owner: "",
                reviewDate: "",
                next: "Register physical hardware key as sole MFA on administrator tenant.",
                trainingNote: "Hard key discipline tested."
            },
            {
                id: "row-6",
                stage: 6,
                control: "Object Lock Compliance Retention",
                request: "WORM retention enforced preventing deletion of critical business records during attack.",
                status: "missing",
                owner: "",
                reviewDate: "",
                next: "Enable Object Lock in Compliance Mode on cloud archive repositories.",
                trainingNote: "Object lock rewrite denial simulated."
            },
            {
                id: "row-7",
                stage: 7,
                control: "Evidence Binder Assembly",
                request: "Consolidated dossier containing verifiable technical receipts, excluding marketing.",
                status: "missing",
                owner: "",
                reviewDate: "",
                next: "Compile all verified exports into single renewal folder for broker.",
                trainingNote: "Binder drop records sorted."
            },
            {
                id: "row-8",
                stage: 8,
                control: "Executive & Operational Manifest",
                request: "Signed verification attesting that all 7 baseline hygiene controls are documented.",
                status: "missing",
                owner: "",
                reviewDate: "",
                next: "Present signed manifest to insurance broker 60 days before renewal.",
                trainingNote: "Cryptographic SHA-256 seal issued."
            }
        ];
    }

    function buildManifest(state) {
        const company = state.intake?.company || "Company";
        const lines = [
            `BURN-1 ACADEMY OPERATIONAL EVIDENCE MANIFEST`,
            `Entity: ${company}`,
            `Generated: ${new Date().toISOString()}`,
            `Platform: BURN-1 Systems (burn-1.com/academy)`,
            `Status: Client-Side Verified Training Docket`,
            `--------------------------------------------------------------------------------`,
            ...state.rows.map(r => `[CONTROL ${r.stage}] ${r.control} | Status: ${r.status.toUpperCase()} | Owner: ${r.owner || "UNASSIGNED"} | Date: ${r.reviewDate || "NOT SET"}`),
            `--------------------------------------------------------------------------------`,
            `DISCLAIMER: This manifest represents on-device self-attestation recorded during`,
            `BURN-1 training missions. It is not an underwriter policy warranty or formal audit certification.`
        ];
        return lines.join("\n");
    }

    function readinessText(state) {
        const xp = totalXp(state);
        const rows = state.rows.map(r =>
            `${r.stage}. ${r.control} — ${r.request}\n   Status: ${r.status}\n   Owner: ${r.owner || "—"}\n   Review Date: ${r.reviewDate || "—"}\n   Next: ${r.next}\n   Note: ${r.trainingNote}`
        ).join("\n\n");

        return `BURN-1 ACADEMY READINESS BRIEF\n${state.intake?.company ?? "Company"}\nTraining XP: ${xp}\nSeal: ${state.seal ? state.seal.hash : "not sealed"}\n${state.seal ? `Sealed At: ${state.seal.at}\n` : ""}\nThis brief separates training from evidence.\nIt is not an insurance application, a compliance certification, or a discount worksheet.\nCarriers and regulators decide on their own forms. A SHA-256 hash shows whether this text changed. It does not prove controls exist in production.\n\n${rows}\n\nBadges: ${badges(state).map(b => b.name).join(", ") || "none yet"}\n`;
    }

    function totalXp(state) {
        return (state.fish?.xp || 0) +
               (state.vault?.xp || 0) +
               (state.wire?.xp || 0) +
               (state.key?.xp || 0) +
               (state.lock?.xp || 0) +
               (state.binder?.xp || 0);
    }

    function badges(state) {
        const list = [];
        if (state.fish?.inspectedAll) list.push({ id: "eye", name: "Domain Eye", detail: "You looked before you acted, every time." });
        if (state.vault) {
            const need = ["payroll", "mail", "records", "payments"];
            if (need.every(id => state.vault.locked.includes(id)) && state.vault.restoreTest) {
                list.push({ id: "vault", name: "Vault Warden", detail: "Critical systems in, and a restore on the calendar." });
            }
        }
        if (state.wire?.held && !state.wire.usedEmailPhone && state.wire.approver.trim()) {
            list.push({ id: "wire", name: "Callback", detail: "You refused the number that only existed in the email." });
        }
        if (state.key?.typedUrl && state.key.refusedCode) {
            list.push({ id: "key", name: "Key Discipline", detail: "Trusted page. Codes stayed on the glass." });
        }
        if (state.lock) {
            const crit = LOCK_OBJECTS.filter(o => o.critical).every(o => state.lock.lockedIds.includes(o.id));
            if (crit && state.lock.days >= 30) {
                list.push({ id: "lock", name: "Locksmith", detail: "Finance files held. The banner was optional." });
            }
        }
        if (state.binder && state.binder.correct === state.binder.total) {
            list.push({ id: "binder", name: "Binder Clerk", detail: "You did not promote a video into evidence." });
        }
        if (state.seal) {
            list.push({ id: "seal", name: "Plain Speech", detail: "Sealed as training, with the limits written down." });
        }
        return list;
    }

    function downloadFile(filename, text) {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async function computeSha256(str) {
        const buf = new TextEncoder().encode(str);
        const digest = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // --------------------------------------------------------------------------
    // STATE ENGINE & PERSISTENCE (LOCAL DEVICE ONLY)
    // --------------------------------------------------------------------------
    const STORAGE_KEY = 'burn1_academy_device_draft_v2';

    let state = {
        started: false,
        stage: 1,
        intake: null,
        guideSaved: false,
        fish: null,
        vault: null,
        wire: null,
        key: null,
        lock: null,
        binder: null,
        rows: [],
        ackTraining: false,
        ackHuman: false,
        seal: null,
        sealNote: ''
    };

    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
            }
        } catch (e) {
            console.warn("Could not load academy draft", e);
        }
    }

    function persistState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn("Could not persist academy draft", e);
        }
    }

    // Sub-stage UI ephemeral memory
    let uiState = {
        fishStep: 0,
        fishSeen: {},
        fishLog: [],
        fishChoice: null,
        vaultLocked: [],
        vaultOrder: [],
        vaultPhase: 'pick',
        vaultRestore: false,
        vaultStruck: false,
        wirePhase: 'read',
        wireCallback: null,
        wireApprover: '',
        wireMiss: false,
        keyPhase: 'choose',
        keyBounced: false,
        lockLocked: ['invoices', 'payroll', 'bank'],
        lockDays: 90,
        lockMode: 'compliance',
        lockUnderstood: false,
        lockStruck: false,
        binderSelected: null,
        binderPlaced: {},
        binderChecked: false
    };

    // --------------------------------------------------------------------------
    // DAY MODE SILVER GLASS THEME CSS (LIGHT COOL GREY BUTTONS & DARK PURPLE LETTERS)
    // --------------------------------------------------------------------------
    function injectStyles() {
        if (document.getElementById('academy-mirror-theme-v2')) return;
        const style = document.createElement('style');
        style.id = 'academy-mirror-theme-v2';
        style.innerHTML = `
            .academy-mirror-root {
                font-family: 'Space Grotesk', system-ui, sans-serif;
                color: #09090b !important;
                background: rgba(255, 255, 255, 0.22) !important;
                backdrop-filter: blur(12px) !important;
                -webkit-backdrop-filter: blur(12px) !important;
                border: 1.5px solid rgba(255, 255, 255, 0.85) !important;
                outline: 1px solid rgba(195, 194, 194, 0.35) !important;
                border-radius: 1.5rem !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(255, 255, 255, 0.9) !important;
                padding: 1.5rem;
                max-width: 1040px;
                margin: 0 auto;
                position: relative;
                overflow: hidden;
            }
            @media (min-width: 640px) {
                .academy-mirror-root { padding: 2rem; }
            }

            .academy-mirror-root h1,
            .academy-mirror-root h2,
            .academy-mirror-root h3,
            .academy-mirror-root h4 {
                color: #09090b !important;
                font-weight: 800 !important;
                text-shadow: none !important;
            }

            .academy-mirror-root p,
            .academy-mirror-root label,
            .academy-mirror-root li {
                color: #1e293b !important;
                font-weight: 600 !important;
                text-shadow: none !important;
            }

            .academy-mirror-root strong,
            .academy-mirror-root b {
                color: #000000 !important;
                font-weight: 800 !important;
            }

            /* LIGHT COOL GREY BUTTONS WITH DARK PURPLE LETTERS */
            .academy-mirror-root .mirror-btn {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 55%, #cbd5e1 100%) !important;
                background-image: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 55%, #cbd5e1 100%) !important;
                color: #4a0e4e !important;
                font-family: 'Orbitron', sans-serif !important;
                font-weight: 800 !important;
                font-size: 0.82rem !important;
                padding: 10px 22px !important;
                border-radius: 0.75rem !important;
                border: 1.5px solid #ffffff !important;
                cursor: pointer !important;
                text-transform: uppercase !important;
                letter-spacing: 0.6px !important;
                transition: all 0.25s ease !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 8px !important;
                box-shadow: 0 4px 12px rgba(74, 14, 78, 0.12), inset 0 1px 2px #ffffff !important;
                transform: none !important;
                text-decoration: none !important;
            }
            .academy-mirror-root .mirror-btn:hover:not(:disabled) {
                background: linear-gradient(135deg, #ffffff 0%, #ede9fe 55%, #ddd6fe 100%) !important;
                background-image: linear-gradient(135deg, #ffffff 0%, #ede9fe 55%, #ddd6fe 100%) !important;
                color: #3b0764 !important;
                border-color: #c084fc !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 18px rgba(124, 58, 237, 0.25), inset 0 1px 2px #ffffff !important;
                filter: none !important;
            }
            .academy-mirror-root .mirror-btn:disabled {
                opacity: 0.45 !important;
                cursor: not-allowed !important;
                filter: grayscale(0.8) !important;
                transform: none !important;
            }

            .academy-mirror-root .mirror-btn-amber {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%) !important;
                background-image: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%) !important;
                color: #3b0764 !important;
                border: 1.5px solid #ffffff !important;
                box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35), inset 0 1px 2px #ffffff !important;
            }
            .academy-mirror-root .mirror-btn-amber:hover:not(:disabled) {
                background: linear-gradient(135deg, #ffffff 0%, #fef3c7 50%, #fde68a 100%) !important;
                background-image: linear-gradient(135deg, #ffffff 0%, #fef3c7 50%, #fde68a 100%) !important;
                color: #2e1065 !important;
                box-shadow: 0 6px 18px rgba(245, 158, 11, 0.45), inset 0 1px 2px #ffffff !important;
            }

            .academy-mirror-root .mirror-btn-ghost {
                background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%) !important;
                background-image: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%) !important;
                color: #4a0e4e !important;
                border: 1.5px solid #cbd5e1 !important;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;
            }
            .academy-mirror-root .mirror-btn-ghost:hover:not(:disabled) {
                background: #ede9fe !important;
                background-image: none !important;
                color: #2e1065 !important;
                border-color: #a855f7 !important;
            }

            /* MIRROR CARDS */
            .academy-mirror-root .mirror-card {
                background: rgba(255, 255, 255, 0.55) !important;
                backdrop-filter: blur(6px) !important;
                -webkit-backdrop-filter: blur(6px) !important;
                border: 1.5px solid rgba(255, 255, 255, 0.9) !important;
                border-radius: 1rem !important;
                padding: 1.25rem !important;
                box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04), inset 0 1px 3px rgba(255, 255, 255, 0.9) !important;
                color: #09090b !important;
                transition: all 0.25s ease !important;
            }
            .academy-mirror-root .mirror-card.active {
                border-color: #8b5cf6 !important;
                background: rgba(245, 243, 255, 0.8) !important;
                box-shadow: 0 0 16px rgba(139, 92, 246, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.9) !important;
            }

            /* STAGE NAV PILLS */
            .academy-mirror-root .stage-nav-pill {
                min-height: 42px !important;
                padding: 6px 14px !important;
                border-radius: 9999px !important;
                border: 1.5px solid #cbd5e1 !important;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
                color: #475569 !important;
                font-size: 0.78rem !important;
                font-family: 'Orbitron', sans-serif !important;
                white-space: nowrap !important;
                cursor: pointer !important;
                transition: all 0.2s !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important;
                transform: none !important;
            }
            .academy-mirror-root .stage-nav-pill:hover:not(:disabled) {
                border-color: #7c3aed !important;
                color: #3b0764 !important;
                background: #f5f3ff !important;
            }
            .academy-mirror-root .stage-nav-pill.active {
                background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%) !important;
                color: #3b0764 !important;
                border-color: #7c3aed !important;
                font-weight: 800 !important;
                box-shadow: 0 2px 10px rgba(124, 58, 237, 0.25) !important;
            }
            .academy-mirror-root .stage-nav-pill.done {
                border-color: #10b981 !important;
                color: #047857 !important;
                background: #ecfdf5 !important;
                font-weight: 700 !important;
            }
            .academy-mirror-root .stage-nav-pill:disabled {
                opacity: 0.4 !important;
                cursor: not-allowed !important;
            }

            /* PILLS & BADGES */
            .academy-mirror-root .mirror-pill {
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
                border: 1.5px solid #f59e0b !important;
                border-radius: 9999px !important;
                padding: 4px 14px !important;
                font-family: 'Share Tech Mono', monospace !important;
                font-size: 0.75rem !important;
                color: #78350f !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
                font-weight: 800 !important;
                box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2) !important;
            }

            /* INPUTS & SELECTS */
            .academy-mirror-root input[type="text"],
            .academy-mirror-root input[type="date"],
            .academy-mirror-root select,
            .academy-mirror-root textarea {
                background: #ffffff !important;
                border: 1.5px solid #cbd5e1 !important;
                color: #09090b !important;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05) !important;
                border-radius: 6px !important;
            }
            .academy-mirror-root input:focus,
            .academy-mirror-root select:focus {
                border-color: #7c3aed !important;
                outline: none !important;
                box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15) !important;
            }

            /* BULLSEYE GRAPHIC FOR FISH HUNTER */
            .bullseye-container {
                position: relative;
                width: 190px;
                height: 190px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .bullseye-ring {
                position: absolute;
                border-radius: 50%;
                border: 1px solid rgba(147, 51, 234, 0.4);
            }
            .bullseye-r1 { width: 100%; height: 100%; animation: pulse-ring 4s ease-out infinite; }
            .bullseye-r2 { width: 75%; height: 75%; border-color: rgba(147, 51, 234, 0.65); }
            .bullseye-r3 { width: 50%; height: 50%; border: 2px solid #d97706; box-shadow: 0 0 15px rgba(245, 158, 11, 0.35); }
            .bullseye-cross-h { position: absolute; width: 100%; height: 1px; background: rgba(147, 51, 234, 0.4); }
            .bullseye-cross-v { position: absolute; height: 100%; width: 1px; background: rgba(147, 51, 234, 0.4); }
            @keyframes pulse-ring {
                0% { transform: scale(0.98); opacity: 0.8; }
                50% { transform: scale(1.02); opacity: 1; border-color: rgba(147, 51, 234, 0.6); }
                100% { transform: scale(0.98); opacity: 0.8; }
            }

            /* CHAT BUBBLES IN KEY STAGE */
            .chat-bubble {
                background: #ffffff !important;
                border: 1.5px solid #cbd5e1 !important;
                border-radius: 0.75rem !important;
                padding: 10px 14px !important;
                font-size: 0.82rem !important;
                line-height: 1.45 !important;
                color: #1e293b !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
            }
            .chat-bubble-sender {
                font-family: 'Share Tech Mono', monospace;
                font-size: 0.7rem;
                color: #7c3aed !important;
                font-weight: 700;
                text-transform: uppercase;
                margin-bottom: 4px;
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    // --------------------------------------------------------------------------
    // RENDER HELPERS
    // --------------------------------------------------------------------------
    function isMissionOpen(stageId) {
        if (!state.intake && stageId > 1) return false;
        if (stageId === 1) return true;
        if (stageId === 2) return Boolean(state.intake);
        if (stageId === 3) return Boolean(state.fish?.done);
        if (stageId === 4) return Boolean(state.vault?.done);
        if (stageId === 5) return Boolean(state.wire?.done);
        if (stageId === 6) return Boolean(state.key?.done);
        if (stageId === 7) return Boolean(state.lock?.done);
        if (stageId === 8) return Boolean(state.binder?.done);
        return false;
    }

    function isStageClear(stageId) {
        if (stageId === 1) return Boolean(state.intake);
        if (stageId === 2) return Boolean(state.fish?.done);
        if (stageId === 3) return Boolean(state.vault?.done);
        if (stageId === 4) return Boolean(state.wire?.done);
        if (stageId === 5) return Boolean(state.key?.done);
        if (stageId === 6) return Boolean(state.lock?.done);
        if (stageId === 7) return Boolean(state.binder?.done);
        return Boolean(state.seal);
    }

    // --------------------------------------------------------------------------
    // TOP NAVIGATION & HEADER
    // --------------------------------------------------------------------------
    function renderHeader() {
        const xp = totalXp(state);
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #cbd5e1; padding-bottom:1rem; margin-bottom:1.25rem;">
                <div>
                    <span style="font-family:'Orbitron', sans-serif; font-size:0.75rem; letter-spacing:2px; color:#b45309; font-weight:800; display:block;">BURN-1</span>
                    <h2 style="font-family:'Orbitron', sans-serif; font-size:1.35rem; margin:0; color:#09090b; font-weight:900; letter-spacing:1px;">CYBER ACADEMY</h2>
                </div>
                <div style="text-align:right;">
                    <div class="mirror-pill">⚡ ${xp} XP</div>
                    <span style="font-size:0.68rem; color:#475569; font-family:'Share Tech Mono', monospace; font-weight:700; display:block; margin-top:2px;">ON-DEVICE TRAINING DRAFT</span>
                </div>
            </div>

            <nav style="display:flex; gap:6px; overflow-x:auto; padding-bottom:10px; margin-bottom:1.25rem; -webkit-overflow-scrolling:touch;">
                ${STAGES.map(s => {
                    const open = isMissionOpen(s.id);
                    const active = state.stage === s.id;
                    const clear = isStageClear(s.id);
                    let cls = 'stage-nav-pill';
                    if (active) cls += ' active';
                    else if (clear) cls += ' done';
                    return `
                        <button type="button" class="${cls}" ${!open ? 'disabled' : ''} onclick="window.AcademyWidget.goStage(${s.id})">
                            <span>0${s.id}</span>
                            <span>${s.name}</span>
                            ${clear ? '<span style="font-size:0.65rem; opacity:0.8;">✓</span>' : ''}
                        </button>
                    `;
                }).join('')}
                <button type="button" class="stage-nav-pill" style="color:#b91c1c !important; font-weight:800;" onclick="window.AcademyWidget.resetAll()">
                    Reset
                </button>
            </nav>
        `;
    }

    // --------------------------------------------------------------------------
    // BRIEFING INTRO (WHEN NOT STARTED)
    // --------------------------------------------------------------------------
    function renderBriefing() {
        return `
            <div style="padding:10px 0;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem;">
                    <div>
                        <span class="mirror-pill" style="margin-bottom:8px;">FREE ON THIS PHONE · NO PASSWORDS</span>
                        <h1 style="font-family:'Orbitron', sans-serif; font-size:1.9rem; line-height:1.2; margin:8px 0; color:#09090b; font-weight:900;">
                            Eight missions.<br>
                            <span style="color:#b45309;">Renewal week gets quieter.</span>
                        </h1>
                        <p style="font-size:0.92rem; color:#1e293b; max-width:620px; line-height:1.6; margin:0 0 1.25rem 0;">
                            Phish, backups, wires, keys, and a draft binder your broker can actually read.
                            No passwords. No premium discount promises. The games teach the habit. The desk keeps the gaps honest.
                        </p>
                        <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.start()">
                            Enter the floor &rarr;
                        </button>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:12px; margin-bottom:1.5rem;">
                    <div class="mirror-card">
                        <span style="font-family:'Orbitron', sans-serif; font-size:0.75rem; color:#b45309; font-weight:800; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px;">WHAT YOU PRACTICE</span>
                        <p style="font-size:0.85rem; color:#1e293b; margin:0; line-height:1.5;">Judgment, not a multiple-choice badge. Hard calls score more than obvious fakes.</p>
                    </div>
                    <div class="mirror-card">
                        <span style="font-family:'Orbitron', sans-serif; font-size:0.75rem; color:#b45309; font-weight:800; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px;">WHAT YOU LEAVE WITH</span>
                        <p style="font-size:0.85rem; color:#1e293b; margin:0; line-height:1.5;">A checklist separating training from supplied, reviewed, and verified evidence.</p>
                    </div>
                    <div class="mirror-card">
                        <span style="font-family:'Orbitron', sans-serif; font-size:0.75rem; color:#b45309; font-weight:800; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px;">WHAT THIS IS NOT</span>
                        <p style="font-size:0.85rem; color:#1e293b; margin:0; line-height:1.5;">Not a Chubb warranty, not a HIPAA safe harbor, not a discount schedule.</p>
                    </div>
                </div>

                <div class="mirror-card" style="background:rgba(255,255,255,0.7); border:1.5px solid #cbd5e1; font-size:0.82rem; color:#475569; line-height:1.6;">
                    <strong style="color:#09090b;">Legally Defensible Renewal Preparation:</strong>
                    Underwriters often ask whether MFA is on, backups were restored on purpose, and payment changes were verified out of band. Policies state requirements in their own words. BURN-1 Academy prepares the conversation. Carriers decide claims and pricing. A SHA-256 seal, when you earn it, only proves this training manifest was not edited afterward.
                </div>
            </div>
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 01: FLOOR PASS (INTAKE & FREE GUIDE)
    // --------------------------------------------------------------------------
    function renderStage1() {
        const intake = state.intake;
        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 1 · Floor Pass</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#09090b;">One card. No passwords.</h3>
                <p style="font-size:0.85rem; color:#475569; margin:0 0 1rem 0;">
                    Tell us the shape of the team. The later missions use it. This is a simulated sign-in lane — it never connects to Okta, Microsoft, or Google, and it never asks for a code.
                </p>
            </div>

            ${intake && !uiState.editingIntake ? `
                <div class="mirror-card" style="margin-bottom:1rem;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:1rem;">
                        <div><span style="font-size:0.75rem; color:#475569; font-weight:700;">Company:</span> <strong style="display:block; color:#09090b;">${intake.company}</strong></div>
                        <div><span style="font-size:0.75rem; color:#475569; font-weight:700;">Industry:</span> <strong style="display:block; color:#b45309;">${(INDUSTRY_META[intake.industry] || {}).label}</strong></div>
                        <div><span style="font-size:0.75rem; color:#475569; font-weight:700;">Headcount:</span> <strong style="display:block; color:#09090b;">${HEADCOUNT_LABEL[intake.headcount]}</strong></div>
                        <div><span style="font-size:0.75rem; color:#475569; font-weight:700;">Login Lane:</span> <strong style="display:block; color:#0284c7;">${(IDP_META[intake.idp] || {}).label}</strong></div>
                    </div>
                    <p style="font-size:0.8rem; color:#334155; line-height:1.5; padding:8px 12px; background:rgba(255,255,255,0.7); border-radius:8px; border:1.5px solid #cbd5e1; margin:0 0 1rem 0;">
                        Simulated authentication only. Account configuration happens in your real admin portal. BURN-1 does not store a password, an MFA code, or a recovery key.
                    </p>
                    ${intake.industryPath ? `<p style="font-size:0.82rem; color:#1e293b; margin-bottom:1rem;">${(INDUSTRY_META[intake.industry] || {}).note}</p>` : ''}
                    
                    <div style="border:1.5px solid #f59e0b; background:rgba(254, 243, 199, 0.6); padding:1rem; border-radius:0.75rem; margin-bottom:1rem;">
                        <h4 style="font-family:'Orbitron', sans-serif; font-size:0.85rem; color:#78350f; font-weight:800; margin:0 0 6px 0;">FREE MFA SETUP GUIDE</h4>
                        <p style="font-size:0.8rem; color:#1e293b; margin:0 0 12px 0;">
                            A BURN-1 training aid for ${(IDP_META[intake.idp] || {}).label}. Not a vendor manual and not a carrier warranty worksheet. Menus change — confirm clicks on the real site.
                        </p>
                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.downloadGuide()">
                                📥 Download Free Guide (.txt)
                            </button>
                            <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.editIntake()">
                                Edit Answers
                            </button>
                        </div>
                    </div>

                    <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%;" onclick="window.AcademyWidget.goStage(2)">
                        Advance to Stage 2: Fish Hunter &rarr;
                    </button>
                </div>
            ` : `
                <form class="mirror-card" onsubmit="event.preventDefault(); window.AcademyWidget.saveIntakeForm(this);">
                    <div style="margin-bottom:1rem;">
                        <label style="display:block; font-size:0.8rem; color:#1e293b; font-weight:700; margin-bottom:4px;">Business / Entity Legal Name</label>
                        <input type="text" name="company" value="${intake?.company || ''}" required placeholder="e.g. Northline Associates" style="width:100%; padding:10px; font-size:0.85rem;" />
                    </div>

                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:1rem;">
                        <div>
                            <label style="display:block; font-size:0.8rem; color:#1e293b; font-weight:700; margin-bottom:4px;">Industry Sector</label>
                            <select name="industry" style="width:100%; padding:10px; font-size:0.85rem;">
                                ${Object.keys(INDUSTRY_META).map(k => `<option value="${k}" ${intake?.industry === k ? 'selected' : ''}>${INDUSTRY_META[k].label}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label style="display:block; font-size:0.8rem; color:#1e293b; font-weight:700; margin-bottom:4px;">Staff Headcount</label>
                            <select name="headcount" style="width:100%; padding:10px; font-size:0.85rem;">
                                ${Object.keys(HEADCOUNT_LABEL).map(k => `<option value="${k}" ${intake?.headcount === k ? 'selected' : ''}>${HEADCOUNT_LABEL[k]}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div style="margin-bottom:1.25rem;">
                        <label style="display:block; font-size:0.8rem; color:#1e293b; font-weight:700; margin-bottom:4px;">Primary Identity Provider (Simulated Lane)</label>
                        <select name="idp" style="width:100%; padding:10px; font-size:0.85rem;">
                            ${Object.keys(IDP_META).map(k => `<option value="${k}" ${intake?.idp === k ? 'selected' : ''}>${IDP_META[k].label}</option>`).join('')}
                        </select>
                    </div>

                    <label style="display:flex; align-items:center; gap:8px; font-size:0.8rem; color:#334155; margin-bottom:1.25rem; cursor:pointer;">
                        <input type="checkbox" name="industryPath" ${intake?.industryPath ? 'checked' : ''} style="accent-color:#7c3aed;" />
                        <span>Include industry-specific statutory guidance and regulatory notes</span>
                    </label>

                    <button type="submit" class="mirror-btn mirror-btn-amber" style="width:100%;">
                        Issue Floor Pass &amp; Continue &rarr;
                    </button>
                </form>
            `}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 02: FISH HUNTER (LENSES & TARGET BULLSEYE)
    // --------------------------------------------------------------------------
    function renderStage2() {
        if (!state.intake) return renderStage1();
        const cases = buildFish(state.intake);
        const current = cases[uiState.fishStep];
        const playing = !state.fish || uiState.replayFish;
        const saved = state.fish;

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 2 · Fish Hunter</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#09090b;">Read the domain before the drama.</h3>
                <p style="font-size:0.85rem; color:#475569; margin:0 0 1rem 0;">
                    Five messages. XP favors the hard call — a clean domain with a poisonous ask scores higher than spotting an obvious fake. Reporting everything is not wisdom.
                </p>
            </div>

            ${playing && current ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#475569; font-weight:700; margin-bottom:1rem;">
                        <span>MESSAGE ${uiState.fishStep + 1} OF ${cases.length}</span>
                        <span>${(uiState.fishSeen[current.id] || []).length > 0 ? '🔍 Lenses Open' : 'Envelope Closed'}</span>
                    </div>

                    <!-- BULLSEYE TARGET GRAPHIC -->
                    <div class="bullseye-container">
                        <div class="bullseye-ring bullseye-r1"></div>
                        <div class="bullseye-ring bullseye-r2"></div>
                        <div class="bullseye-ring bullseye-r3"></div>
                        <div class="bullseye-cross-h"></div>
                        <div class="bullseye-cross-v"></div>
                        <span style="position:relative; z-index:10; font-family:'Share Tech Mono', monospace; font-size:0.82rem; color:#78350f; font-weight:800; text-align:center; max-width:140px; word-break:break-all;">
                            ${current.fromEmail.split('@')[1] || current.fromEmail}
                        </span>
                    </div>

                    <div style="background:rgba(255,255,255,0.75); border:1.5px solid #cbd5e1; border-radius:0.75rem; padding:1rem; margin:1.25rem 0 1rem 0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <strong style="color:#09090b; font-size:0.9rem;">${current.fromName}</strong>
                            <span style="font-family:'Share Tech Mono', monospace; font-size:0.75rem; color:#0284c7; font-weight:700;">${current.fromEmail}</span>
                        </div>
                        <div style="font-family:'Orbitron', sans-serif; font-size:0.95rem; color:#b45309; font-weight:800; margin-bottom:6px;">${current.subject}</div>
                        <p style="font-size:0.85rem; color:#1e293b; margin:0; line-height:1.5;">${current.preview}</p>
                    </div>

                    <!-- FORENSIC INSPECTION LENSES -->
                    <div style="margin-bottom:1.25rem;">
                        <span style="font-size:0.75rem; font-family:'Share Tech Mono', monospace; color:#6b21a8; font-weight:800; display:block; margin-bottom:6px; text-transform:uppercase;">
                            Forensic Inspection Lenses (Tap to inspect before deciding)
                        </span>
                        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                            ${['sender', 'link', 'ask'].map(lens => {
                                const seen = (uiState.fishSeen[current.id] || []).includes(lens);
                                const data = current.lenses[lens];
                                return `
                                    <button type="button" class="mirror-btn mirror-btn-ghost" style="padding:8px 4px; font-size:0.72rem; ${seen ? 'border-color:#7c3aed !important; color:#3b0764 !important; background:#ede9fe !important;' : ''}" onclick="window.AcademyWidget.toggleFishLens('${current.id}', '${lens}')">
                                        ${seen ? '✓ ' : ''}${lens.toUpperCase()} LENS
                                    </button>
                                `;
                            }).join('')}
                        </div>

                        ${(uiState.fishSeen[current.id] || []).map(lens => {
                            const data = current.lenses[lens];
                            const toneColor = data.tone === 'hot' ? '#dc2626' : data.tone === 'ok' ? '#059669' : '#0284c7';
                            const bgColor = data.tone === 'hot' ? '#fef2f2' : data.tone === 'ok' ? '#f0fdf4' : '#f0f9ff';
                            return `
                                <div style="margin-top:6px; padding:8px 12px; background:${bgColor}; border:1.5px solid ${toneColor}; border-left:4px solid ${toneColor}; border-radius:6px; font-size:0.78rem; line-height:1.45; color:#1e293b;">
                                    <strong style="color:${toneColor}; text-transform:uppercase;">${lens} clue:</strong> ${data.text}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- DECISION ACTIONS -->
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:1rem;">
                        <button type="button" class="mirror-btn mirror-btn-ghost" style="${uiState.fishChoice === 'report' ? 'border-color:#10b981 !important; background:#ecfdf5 !important; color:#047857 !important;' : ''}" onclick="window.AcademyWidget.chooseFishAction('report')">
                            🚨 Report
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" style="${uiState.fishChoice === 'hold' ? 'border-color:#f59e0b !important; background:#fef3c7 !important; color:#78350f !important;' : ''}" onclick="window.AcademyWidget.chooseFishAction('hold')">
                            ⏸️ Hold
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" style="${uiState.fishChoice === 'pass' ? 'border-color:#0284c7 !important; background:#f0f9ff !important; color:#0369a1 !important;' : ''}" onclick="window.AcademyWidget.chooseFishAction('pass')">
                            ✅ Let Pass
                        </button>
                    </div>

                    ${uiState.fishChoice ? `
                        <div style="background:#fef3c7; border:1.5px solid #f59e0b; padding:10px 14px; border-radius:8px; font-size:0.82rem; margin-bottom:1rem; color:#1e293b;">
                            <strong style="color:#78350f;">Why:</strong> ${current.why[uiState.fishChoice]}
                            <span style="color:#b45309; font-weight:800; display:block; margin-top:4px;">Earns: +${current.xp[uiState.fishChoice]} XP</span>
                        </div>
                        <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%;" onclick="window.AcademyWidget.advanceFish()">
                            ${uiState.fishStep + 1 >= cases.length ? 'Log Round & Save XP &rarr;' : 'Next Message &rarr;'}
                        </button>
                    ` : ''}
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">ROUND LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#09090b; margin:6px 0;">
                        ${saved.correct >= 4 ? 'Clean eyes on the floor.' : 'Round finished.'}
                    </h3>
                    <p style="font-size:0.85rem; color:#1e293b; margin:0 0 1rem 0;">
                        ${saved.correct} of ${saved.total} best calls.
                        ${saved.inspectedAll ? ' You opened a lens on every message — Domain Eye badge unlocked!' : ' You skipped inspection on at least one. The lenses are the job.'}
                    </p>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(3)">
                            Open Recovery Vault &rarr;
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.replayFishRound()">
                            Replay Round
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 03: RECOVERY VAULT (SYSTEM SELECTION & STRIKE)
    // --------------------------------------------------------------------------
    function renderStage3() {
        if (!state.intake) return renderStage1();
        const systems = systemsFor(state.intake);
        const playing = !state.vault || uiState.replayVault;
        const saved = state.vault;

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 3 · Recovery Vault</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#09090b;">What still exists on Monday?</h3>
                <p style="font-size:0.85rem; color:#475569; margin:0 0 1rem 0;">
                    Lock the systems that have to survive, then rank the first restores. A website that loads while payroll is gone is not a recovery.
                </p>
            </div>

            ${playing ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    ${uiState.vaultPhase === 'pick' ? `
                        <p style="font-size:0.82rem; color:#1e293b; font-weight:700; margin-bottom:10px;">Tap everything that belongs in an immutable copy:</p>
                        <div style="display:grid; gap:8px; margin-bottom:1rem;">
                            ${systems.map(s => {
                                const on = uiState.vaultLocked.includes(s.id);
                                return `
                                    <button type="button" class="mirror-card" style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; cursor:pointer; ${on ? 'border-color:#f59e0b !important; background:#fef3c7 !important;' : ''}" onclick="window.AcademyWidget.toggleVaultSystem('${s.id}')">
                                        <div style="text-align:left;">
                                            <strong style="color:#09090b; font-size:0.88rem; display:block;">${s.name}</strong>
                                            <span style="font-size:0.75rem; color:#475569;">${s.hint}</span>
                                        </div>
                                        <span class="mirror-pill" style="font-size:0.68rem; ${on ? 'color:#78350f; background:#fde68a;' : ''}">
                                            ${on ? 'IN VAULT' : s.critical ? 'CRITICAL' : 'LATER'}
                                        </span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                        <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%;" onclick="window.AcademyWidget.setVaultPhase('rank')">
                            Rank the First Restores &rarr;
                        </button>
                    ` : uiState.vaultPhase === 'rank' ? `
                        <p style="font-size:0.82rem; color:#1e293b; font-weight:700; margin-bottom:10px;">Pick the first three things you would bring back, in order of operational priority:</p>
                        <ol style="margin:0 0 1rem 0; padding-left:1.25rem; font-size:0.85rem; color:#1e293b;">
                            ${[0, 1, 2].map(slot => {
                                const sid = uiState.vaultOrder[slot];
                                const sys = systems.find(s => s.id === sid);
                                return `<li style="padding:4px 0;"><span style="color:#475569;">Restore ${slot + 1}:</span> <strong style="color:#b45309;">${sys ? sys.name : '—'}</strong></li>`;
                            }).join('')}
                        </ol>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px; margin-bottom:1rem;">
                            ${systems.map(s => `
                                <button type="button" class="mirror-btn mirror-btn-ghost" ${uiState.vaultOrder.includes(s.id) || uiState.vaultOrder.length >= 3 ? 'disabled' : ''} onclick="window.AcademyWidget.addVaultOrder('${s.id}')">
                                    ${s.name}
                                </button>
                            `).join('')}
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button type="button" class="mirror-btn mirror-btn-amber" ${uiState.vaultOrder.length < 1 ? 'disabled' : ''} onclick="window.AcademyWidget.runVaultStrike()">
                                Run Ransomware Strike &rarr;
                            </button>
                            <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.clearVaultOrder()">
                                Clear
                            </button>
                        </div>
                    ` : `
                        <div style="background:#fef2f2; border:1.5px solid #ef4444; border-radius:0.75rem; padding:1rem; margin-bottom:1rem;">
                            <span class="mirror-pill" style="color:#991b1b; border-color:#ef4444; background:#fee2e2; margin-bottom:6px;">RANSOMWARE WEEKEND STRIKE</span>
                            <p style="font-size:0.85rem; color:#1e293b; line-height:1.5; margin:6px 0;">
                                ${systems.filter(s => uiState.vaultLocked.includes(s.id)).map(s => s.name).join(', ')} survived inside the immutable vault copy.<br>
                                ${systems.filter(s => !uiState.vaultLocked.includes(s.id)).length > 0 ? `<strong style="color:#dc2626;">Wiped outside the vault:</strong> ${systems.filter(s => !uiState.vaultLocked.includes(s.id)).map(s => s.name).join(', ')}` : 'Zero critical files lost!'}
                            </p>
                        </div>

                        <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.8rem; color:#1e293b; margin-bottom:1.25rem; cursor:pointer;">
                            <input type="checkbox" ${uiState.vaultRestore ? 'checked' : ''} onchange="window.AcademyWidget.toggleVaultRestore(this.checked)" style="margin-top:2px; accent-color:#7c3aed;" />
                            <span>We have an actual restore drill scheduled on the calendar with a person's name attached (not just a backup success email).</span>
                        </label>

                        <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%;" onclick="window.AcademyWidget.saveVaultRun()">
                            Log the Vault Mission &rarr;
                        </button>
                    `}
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">VAULT LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#09090b; margin:6px 0;">Recovery readiness recorded.</h3>
                    <p style="font-size:0.85rem; color:#1e293b; margin:0 0 1rem 0;">
                        ${saved.locked.length} systems vaulted. Priority 1: ${(systems.find(s => s.id === saved.order[0]) || {}).name || 'Payroll'}.
                        ${saved.restoreTest ? ' Calendar restore drill committed.' : ' No restore test on calendar yet.'}
                    </p>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(4)">
                            Advance to Stage 4: Wire Freeze &rarr;
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.replayVaultStage()">
                            Replay Vault
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 04: WIRE FREEZE (HOLD VS SEND & OUT-OF-BAND PROTOCOL)
    // --------------------------------------------------------------------------
    function renderStage4() {
        if (!state.intake) return renderStage1();
        const vendor = INDUSTRY_META[state.intake.industry]?.vendor || "Northline Materials";
        const playing = !state.wire || uiState.replayWire;
        const saved = state.wire;

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 4 · Wire Freeze</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#09090b;">Hold the payment or watch it go.</h3>
                <p style="font-size:0.85rem; color:#475569; margin:0 0 1rem 0;">
                    A wire request lands with "new bank details" under a real vendor's name. You have two minutes before the run. Travelers and Chubb deny these claims without an out-of-band verification record.
                </p>
            </div>

            ${playing ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    <!-- INCOMING EMAIL STIMULUS -->
                    <div style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:0.75rem; padding:1rem; margin-bottom:1.25rem; box-shadow:0 2px 6px rgba(0,0,0,0.04);">
                        <div style="font-size:0.75rem; color:#475569; margin-bottom:4px; font-weight:700;">INCOMING WIRE REDIRECTION NOTICE</div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <strong style="color:#09090b; font-size:0.85rem;">${vendor} Billing Dept</strong>
                            <span style="font-family:'Share Tech Mono', monospace; font-size:0.75rem; color:#dc2626; font-weight:700;">URGENT // SAME-DAY</span>
                        </div>
                        <p style="font-size:0.82rem; color:#1e293b; line-height:1.45; margin:0 0 8px 0;">
                            "Please route today's $48,250 settlement to our secondary treasury escrow: First Atlantic Trust, Routing 021000089, Acct 882104921. For immediate confirmation call our wire coordinator directly at (404) 555-0199."
                        </p>
                        <span style="font-size:0.72rem; color:#b45309; font-weight:700;">⚠️ Note: The phone number (404) 555-0199 appears ONLY in this email.</span>
                    </div>

                    ${uiState.wirePhase === 'read' ? `
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                            <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.holdWirePayment()">
                                🛑 HOLD THE WIRE (Start Callback)
                            </button>
                            <button type="button" class="mirror-btn mirror-btn-ghost" style="border-color:#ef4444 !important; color:#dc2626 !important;" onclick="window.AcademyWidget.sendWirePayment()">
                                💸 Send Payment on Email Info
                            </button>
                        </div>
                    ` : uiState.wirePhase === 'hold' ? `
                        <!-- BURN-1 TRAINING CALLBACK DOCKET -->
                        <div style="border:1.5px solid #7c3aed; background:rgba(245, 243, 255, 0.85); border-radius:0.75rem; padding:1rem; margin-bottom:1rem;">
                            <span class="mirror-pill" style="margin-bottom:6px;">BURN-1 TRAINING CALLBACK DOCKET</span>
                            <h4 style="font-family:'Orbitron', sans-serif; font-size:0.88rem; color:#3b0764; font-weight:800; margin:4px 0 8px 0;">Out-of-Band Dual-Control Check</h4>
                            <p style="font-size:0.78rem; color:#1e293b; margin:0 0 10px 0;">
                                Commercial underwriters require calling a number from the original contract or master services agreement — NEVER the number in the wire change email.
                            </p>

                            <div style="margin-bottom:10px;">
                                <label style="display:block; font-size:0.75rem; color:#1e293b; font-weight:700; margin-bottom:4px;">Which number did you call?</label>
                                <div style="display:flex; flex-direction:column; gap:6px;">
                                    <label style="font-size:0.78rem; color:#1e293b; display:flex; align-items:center; gap:6px; cursor:pointer;">
                                        <input type="radio" name="wirePhone" onchange="window.AcademyWidget.setWirePhoneChoice('email')" style="accent-color:#7c3aed;" />
                                        <span>(404) 555-0199 (From the incoming wire request email)</span>
                                    </label>
                                    <label style="font-size:0.78rem; color:#1e293b; display:flex; align-items:center; gap:6px; cursor:pointer;">
                                        <input type="radio" name="wirePhone" onchange="window.AcademyWidget.setWirePhoneChoice('contract')" style="accent-color:#7c3aed;" />
                                        <span>(404) 555-7800 (Stored in original vendor master agreement)</span>
                                    </label>
                                </div>
                            </div>

                            <div style="margin-bottom:10px;">
                                <label style="display:block; font-size:0.75rem; color:#1e293b; font-weight:700; margin-bottom:4px;">Second Approver Name (Dual Authorization)</label>
                                <input type="text" placeholder="e.g. Sarah Jenkins (CFO / Controller)" value="${uiState.wireApprover}" style="width:100%; padding:6px 10px; font-size:0.8rem;" oninput="window.AcademyWidget.setWireApprover(this.value)" />
                            </div>

                            <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%;" onclick="window.AcademyWidget.completeWireHold()">
                                Complete &amp; Log Callback Docket &rarr;
                            </button>
                        </div>
                    ` : `
                        <div style="background:#fef2f2; border:1.5px solid #ef4444; border-radius:0.75rem; padding:1rem; margin-bottom:1rem;">
                            <h4 style="font-family:'Orbitron', sans-serif; font-size:0.95rem; color:#dc2626; font-weight:800; margin:0 0 6px 0;">WIRE COMPROMISE SIMULATED</h4>
                            <p style="font-size:0.82rem; color:#1e293b; line-height:1.45; margin:0 0 10px 0;">
                                ${uiState.wireMiss ? 'You called the number printed inside the fraudulent email. The attacker answered, confirmed the fraudulent routing, and the $48,250 wire left the bank.' : 'The payment was dispatched without out-of-band verification. Because the vendor\'s compromised inbox requested the change, funds were transferred directly to attacker mules.'}
                            </p>
                            <span style="font-size:0.75rem; color:#b45309; font-weight:700; display:block;">
                                Underwriters routinely deny social engineering claims under the Verification Failure clause when staff call numbers inside the email.
                            </span>
                        </div>
                        <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.resetWireDrill()">
                            Retry Wire Defense Drill
                        </button>
                    `}
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">WIRE DRILL LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#09090b; margin:6px 0;">Out-of-band callback protocol verified.</h3>
                    <p style="font-size:0.85rem; color:#1e293b; margin:0 0 1rem 0;">
                        Wire held. Voice confirmation performed via contract master directory. Second approver: <strong>${saved.approver || 'Controller'}</strong>.
                    </p>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(5)">
                            Advance to Stage 5: Hard Key &rarr;
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.replayWireStage()">
                            Replay Wire Drill
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 05: HARD KEY (SPLIT-VIEW PORTAL & PASSKEY DISCIPLINE)
    // --------------------------------------------------------------------------
    function renderStage5() {
        if (!state.intake) return renderStage1();
        const idp = IDP_META[state.intake.idp] || IDP_META.microsoft;
        const playing = !state.key || uiState.replayKey;
        const saved = state.key;

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 5 · Hard Key</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#09090b;">Type the real portal. Refuse chat codes.</h3>
                <p style="font-size:0.85rem; color:#475569; margin:0 0 1rem 0;">
                    Attacker in the middle (AitM) proxies bypass SMS and simple push tokens. A physical FIDO2 key binds directly to the domain. This mission rehearses authentic portal verification.
                </p>
            </div>

            ${playing ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    ${uiState.keyPhase === 'choose' ? `
                        <p style="font-size:0.82rem; color:#1e293b; font-weight:700; margin-bottom:10px;">Select which address you type into the browser bar to register your hardware key:</p>
                        <div style="display:grid; gap:8px; margin-bottom:1rem;">
                            <button type="button" class="mirror-card" style="text-align:left; cursor:pointer; padding:12px; background:#f0fdf4 !important; border:1.5px solid #22c55e !important;" onclick="window.AcademyWidget.chooseKeyUrl('real')">
                                <span style="font-family:'Share Tech Mono', monospace; color:#15803d; font-size:0.9rem; font-weight:800; display:block;">${idp.real}</span>
                                <span style="font-size:0.75rem; color:#166534;">Genuine administrative domain. Registered via bookmark or clean typing.</span>
                            </button>
                            <button type="button" class="mirror-card" style="text-align:left; cursor:pointer; padding:12px; background:#fef2f2 !important; border:1.5px solid #ef4444 !important;" onclick="window.AcademyWidget.chooseKeyUrl('fake')">
                                <span style="font-family:'Share Tech Mono', monospace; color:#b91c1c; font-size:0.9rem; font-weight:800; display:block;">${idp.fake}</span>
                                <span style="font-size:0.75rem; color:#991b1b;">Link received in an urgent IT Slack/Teams chat message saying "Renew Passkey Now".</span>
                            </button>
                        </div>
                    ` : uiState.keyPhase === 'bounced' ? `
                        <div style="background:#fef2f2; border:1.5px solid #ef4444; border-radius:0.75rem; padding:1rem; margin-bottom:1rem;">
                            <h4 style="font-family:'Orbitron', sans-serif; font-size:0.95rem; color:#dc2626; font-weight:800; margin:0 0 6px 0;">LOOKALIKE PHISHING REDIRECT</h4>
                            <p style="font-size:0.82rem; color:#1e293b; line-height:1.45; margin:0 0 10px 0;">
                                You clicked the chat link. The domain <code>${idp.fake}</code> is an adversary-in-the-middle proxy. If you enter credentials or a code here, your session is intercepted.
                            </p>
                        </div>
                        <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.resetKeyPhase()">
                            Try Again: Choose Clean Portal
                        </button>
                    ` : `
                        <!-- SIMULATED FIDO2 HARDWARE KEY INTERFACE -->
                        <div style="background:rgba(255,255,255,0.7); border:1.5px solid #cbd5e1; border-radius:0.75rem; padding:1rem; margin-bottom:1.25rem;">
                            <span class="mirror-pill" style="margin-bottom:8px;">SIMULATED FIDO2 ENROLLMENT LANE</span>
                            <div style="font-size:0.8rem; color:#0284c7; font-family:'Share Tech Mono', monospace; font-weight:700; margin-bottom:10px;">
                                DOMAIN BOUND: ${idp.real}
                            </div>

                            <div style="display:flex; align-items:center; gap:12px; margin-bottom:1rem; padding:12px; background:#f8fafc; border-radius:8px; border:1.5px solid #cbd5e1;">
                                <div style="width:40px; height:40px; border-radius:50%; background:radial-gradient(circle, #fde68a 0%, #d97706 100%); border:2px solid #b45309; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(245,158,11,0.4);">
                                    <span style="font-size:1.1rem;">🔑</span>
                                </div>
                                <div>
                                    <strong style="color:#09090b; font-size:0.85rem; display:block;">Physical Hardware Key Detected</strong>
                                    <span style="font-size:0.75rem; color:#475569;">FIDO2 / WebAuthn cryptographic token seated in USB port. Touch brass contact to sign.</span>
                                </div>
                            </div>

                            <!-- CHAT LURE INTRUSION -->
                            <div class="chat-bubble" style="margin-bottom:1rem;">
                                <span class="chat-bubble-sender">💬 IT Support (Teams / Slack direct message):</span>
                                "Hey, we see your key enrollment. Paste the 6-digit confirmation code generated on screen so we can approve it in tenant backend."
                            </div>

                            <div style="display:flex; flex-direction:column; gap:8px;">
                                <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.refuseChatCode(true)">
                                    🛑 REFUSE: Hardware keys never generate chat codes. (Touch Physical Key)
                                </button>
                                <button type="button" class="mirror-btn mirror-btn-ghost" style="border-color:#ef4444 !important; color:#dc2626 !important;" onclick="window.AcademyWidget.refuseChatCode(false)">
                                    Paste token into chat
                                </button>
                            </div>
                        </div>
                    `}
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">HARD KEY LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#09090b; margin:6px 0;">Phishing-resistant passkey bound.</h3>
                    <p style="font-size:0.85rem; color:#1e293b; margin:0 0 1rem 0;">
                        Genuine portal verified. Chat token lure refused. Physical touch confirmed.
                        ${saved.askedSpare ? ' Spare backup key stored in company safe.' : ''}
                    </p>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(6)">
                            Advance to Stage 6: Object Lock &rarr;
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.replayKeyStage()">
                            Replay Key Mission
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 06: OBJECT LOCK (RETENTION, COMPLIANCE & REWRITE DENIAL)
    // --------------------------------------------------------------------------
    function renderStage6() {
        if (!state.intake) return renderStage1();
        const playing = !state.lock || uiState.replayLock;
        const saved = state.lock;

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 6 · Object Lock</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#09090b;">Retention &amp; simulated rewrite denial.</h3>
                <p style="font-size:0.85rem; color:#475569; margin:0 0 1rem 0;">
                    Underwriters ask for immutable backups (WORM: Write Once, Read Many). Even root credentials cannot overwrite compliance-locked records during the retention window.
                </p>
            </div>

            ${playing ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    <p style="font-size:0.82rem; color:#1e293b; font-weight:700; margin-bottom:10px;">Select which file repositories are protected with Object Lock:</p>
                    <div style="display:grid; gap:8px; margin-bottom:1rem;">
                        ${LOCK_OBJECTS.map(obj => {
                            const on = uiState.lockLocked.includes(obj.id);
                            return `
                                <button type="button" class="mirror-card" style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; cursor:pointer; ${on ? 'border-color:#7c3aed !important; background:rgba(245,243,255,0.85) !important;' : ''}" onclick="window.AcademyWidget.toggleLockObject('${obj.id}')">
                                    <div style="text-align:left;">
                                        <strong style="color:#09090b; font-size:0.85rem; display:block;">${obj.label}</strong>
                                        <span style="font-size:0.75rem; color:#475569;">Volume: ${obj.size}</span>
                                    </div>
                                    <span class="mirror-pill" style="font-size:0.68rem; ${on ? 'color:#3b0764; background:#ddd6fe; border-color:#7c3aed;' : ''}">
                                        ${on ? 'LOCKED' : 'UNLOCKED'}
                                    </span>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:1rem;">
                        <div>
                            <label style="display:block; font-size:0.75rem; color:#1e293b; font-weight:700; margin-bottom:4px;">Retention Period</label>
                            <select style="width:100%; padding:8px; font-size:0.8rem;" onchange="window.AcademyWidget.setLockDays(Number(this.value))">
                                <option value="30" ${uiState.lockDays === 30 ? 'selected' : ''}>30 Days (Baseline)</option>
                                <option value="90" ${uiState.lockDays === 90 ? 'selected' : ''}>90 Days (Underwriting Recommended)</option>
                                <option value="365" ${uiState.lockDays === 365 ? 'selected' : ''}>365 Days (Statutory Compliance)</option>
                            </select>
                        </div>
                        <div>
                            <label style="display:block; font-size:0.75rem; color:#1e293b; font-weight:700; margin-bottom:4px;">Retention Mode</label>
                            <select style="width:100%; padding:8px; font-size:0.8rem;" onchange="window.AcademyWidget.setLockMode(this.value)">
                                <option value="compliance" ${uiState.lockMode === 'compliance' ? 'selected' : ''}>Compliance (Root Cannot Delete)</option>
                                <option value="governance" ${uiState.lockMode === 'governance' ? 'selected' : ''}>Governance (Privileged Override)</option>
                            </select>
                        </div>
                    </div>

                    <!-- REWRITE DENIAL STRIKE TEST -->
                    <div style="border:1.5px solid #cbd5e1; background:rgba(255,255,255,0.7); border-radius:0.75rem; padding:1rem; margin-bottom:1rem;">
                        <span class="mirror-pill" style="margin-bottom:6px;">SIMULATE ADVERSARY REWRITE ATTACK</span>
                        <p style="font-size:0.78rem; color:#1e293b; margin:0 0 10px 0;">
                            Test whether ransomware or compromised root administrator credentials can delete the immutable repository.
                        </p>
                        <button type="button" class="mirror-btn mirror-btn-ghost" style="width:100%; border-color:#dc2626 !important; color:#dc2626 !important;" onclick="window.AcademyWidget.strikeLock()">
                            Simulate Attacker: <code>s3:DeleteObject --force</code>
                        </button>
                        ${uiState.lockStruck ? `
                            <div style="margin-top:8px; padding:10px; background:#f0fdf4; border:1.5px solid #16a34a; border-radius:6px; font-size:0.78rem; color:#166534; line-height:1.45;">
                                <strong>✓ HTTP 403 AccessDenied (ObjectLockConfigurationActive):</strong><br>
                                The cloud storage subsystem denied overwrite and deletion. Files remain intact through the retention window.
                            </div>
                        ` : ''}
                    </div>

                    <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.78rem; color:#334155; margin-bottom:1.25rem; cursor:pointer;">
                        <input type="checkbox" ${uiState.lockUnderstood ? 'checked' : ''} onchange="window.AcademyWidget.setLockUnderstood(this.checked)" style="margin-top:2px; accent-color:#7c3aed;" />
                        <span>I understand this is a training simulation and does NOT configure AWS/GCP/Azure buckets directly. Actual configuration must be verified in the cloud management console.</span>
                    </label>

                    <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%;" ${!uiState.lockUnderstood ? 'disabled' : ''} onclick="window.AcademyWidget.saveLockRun()">
                        Log Object Lock Mission &rarr;
                    </button>
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">LOCK LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#09090b; margin:6px 0;">Immutability policy documented.</h3>
                    <p style="font-size:0.85rem; color:#1e293b; margin:0 0 1rem 0;">
                        ${saved.lockedIds.length} repositories locked in ${saved.mode.toUpperCase()} mode for ${saved.days} days. Rewrite denial verified.
                    </p>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(7)">
                            Advance to Stage 7: Binder Drop &rarr;
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.replayLockStage()">
                            Replay Lock
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 07: BINDER DROP (ARTIFACT SORTING VS JUNK REJECTION)
    // --------------------------------------------------------------------------
    function renderStage7() {
        if (!state.intake) return renderStage1();
        const playing = !state.binder || uiState.replayBinder;
        const saved = state.binder;
        const placedCount = Object.keys(uiState.binderPlaced).length;
        const remaining = BINDER_ARTIFACTS.filter(a => !uiState.binderPlaced[a.id]);

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 7 · Binder Drop</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#09090b;">A training video is not evidence.</h3>
                <p style="font-size:0.85rem; color:#475569; margin:0 0 1rem 0;">
                    Match each fictional record to the request it actually answers — or throw it out. Training completion, a supplied draft, a review, and an independent check are not the same sentence.
                </p>
            </div>

            ${playing ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    <p style="font-size:0.8rem; color:#475569; font-weight:700; margin-bottom:8px;">
                        Tap a record below, then tap the corresponding request slot or "Not Evidence" reject pile:
                    </p>

                    <!-- REMAINING ARTIFACTS PILE -->
                    <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:1rem;">
                        ${remaining.map(item => `
                            <button type="button" class="mirror-btn mirror-btn-ghost" style="padding:6px 12px; font-size:0.75rem; ${uiState.binderSelected === item.id ? 'border-color:#7c3aed !important; background:#ede9fe !important; color:#3b0764 !important;' : ''}" onclick="window.AcademyWidget.selectBinderItem('${item.id}')">
                                ${item.title}
                            </button>
                        `).join('')}
                        ${remaining.length === 0 ? '<span style="font-size:0.8rem; color:#059669; font-weight:800;">✓ All records sorted into slots!</span>' : ''}
                    </div>

                    <!-- SLOTS -->
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:8px; margin-bottom:1rem;">
                        ${BINDER_SLOTS.map(slot => {
                            const filled = BINDER_ARTIFACTS.filter(item => uiState.binderPlaced[item.id] === slot.id);
                            return `
                                <button type="button" class="mirror-card" style="text-align:left; cursor:pointer; padding:10px;" onclick="window.AcademyWidget.assignBinderSlot('${slot.id}')">
                                    <strong style="color:#09090b; font-size:0.85rem; display:block;">${slot.title}</strong>
                                    <span style="font-size:0.72rem; color:#475569; display:block; margin-bottom:4px;">${slot.detail}</span>
                                    ${filled.map(f => `<span style="display:inline-block; font-size:0.72rem; color:#78350f; background:#fef3c7; border:1px solid #f59e0b; padding:2px 6px; border-radius:4px; margin-top:2px;">${f.title}</span>`).join('')}
                                </button>
                            `;
                        }).join('')}
                    </div>

                    ${placedCount >= BINDER_ARTIFACTS.length ? `
                        <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%;" onclick="window.AcademyWidget.logBinderSort()">
                            Review Binder Accuracy &rarr;
                        </button>
                    ` : `
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:0.75rem; color:#475569; font-weight:700;">Sorted: ${placedCount} of ${BINDER_ARTIFACTS.length} records</span>
                            <button type="button" class="mirror-btn mirror-btn-ghost" style="padding:4px 10px; font-size:0.72rem;" onclick="window.AcademyWidget.resetBinderPlacements()">
                                Reset Placements
                            </button>
                        </div>
                    `}
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">BINDER SORT LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#09090b; margin:6px 0;">Evidence classification complete.</h3>
                    <p style="font-size:0.85rem; color:#1e293b; margin:0 0 1rem 0;">
                        ${saved.correct} of ${saved.total} records classified accurately into broker-ready slots or discarded as non-evidence.
                    </p>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(8)">
                            Advance to Stage 8: The Desk &rarr;
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.replayBinderStage()">
                            Replay Binder Drop
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 08: THE DESK (EVIDENCE MANIFEST, OWNERS & SHA-256 SEAL)
    // --------------------------------------------------------------------------
    function renderStage8() {
        if (!state.intake) return renderStage1();
        const company = state.intake.company || "Company";
        const xp = totalXp(state);
        const earned = badges(state);
        const missions = [state.fish, state.vault, state.wire, state.key, state.lock, state.binder].every(Boolean);
        const ownersNamed = state.rows.every(r => (r.owner || "").trim().length > 0);
        const canSeal = missions && state.ackTraining && state.ackHuman && ownersNamed;

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 8 · The Desk</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#09090b;">Owners, dates, and plain speech.</h3>
                <p style="font-size:0.85rem; color:#475569; margin:0 0 1rem 0;">
                    Assign a human owner to each baseline operational control. The SHA-256 seal proves this training manifest was not edited after issuance. It does not certify that the controls exist in production.
                </p>
            </div>

            <div class="mirror-card" style="margin-bottom:1.5rem;">
                <!-- STATS STRIP -->
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:1.25rem; text-align:center;">
                    <div style="background:rgba(255,255,255,0.7); border:1.5px solid #cbd5e1; padding:10px; border-radius:8px;">
                        <span style="font-size:0.7rem; color:#475569; font-weight:700; text-transform:uppercase;">TOTAL XP</span>
                        <strong style="display:block; font-family:'Orbitron', sans-serif; font-size:1.3rem; color:#b45309;">${xp}</strong>
                    </div>
                    <div style="background:rgba(255,255,255,0.7); border:1.5px solid #cbd5e1; padding:10px; border-radius:8px;">
                        <span style="font-size:0.7rem; color:#475569; font-weight:700; text-transform:uppercase;">MISSIONS</span>
                        <strong style="display:block; font-family:'Orbitron', sans-serif; font-size:1.1rem; color:#09090b;">${missions ? '8 OF 8' : 'STILL OPEN'}</strong>
                    </div>
                    <div style="background:rgba(255,255,255,0.7); border:1.5px solid #cbd5e1; padding:10px; border-radius:8px;">
                        <span style="font-size:0.7rem; color:#475569; font-weight:700; text-transform:uppercase;">BADGES</span>
                        <strong style="display:block; font-family:'Orbitron', sans-serif; font-size:1.3rem; color:#6b21a8;">${earned.length}</strong>
                    </div>
                </div>

                <!-- BADGES SHOWCASE -->
                ${earned.length ? `
                    <div style="margin-bottom:1.25rem;">
                        <span style="font-size:0.75rem; font-family:'Share Tech Mono', monospace; color:#b45309; font-weight:800; display:block; margin-bottom:6px; text-transform:uppercase;">
                            EARNED CREDENTIAL BADGES
                        </span>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:6px;">
                            ${earned.map(b => `
                                <div style="padding:6px 10px; background:#fef3c7; border:1.5px solid #f59e0b; border-radius:6px; font-size:0.75rem;">
                                    <strong style="color:#78350f;">${b.name}:</strong> <span style="color:#1e293b;">${b.detail}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- EVIDENCE MANIFEST TABLE -->
                <div style="margin-bottom:1.25rem;">
                    <span style="font-size:0.75rem; font-family:'Share Tech Mono', monospace; color:#0284c7; font-weight:800; display:block; margin-bottom:6px; text-transform:uppercase;">
                        OPERATIONAL EVIDENCE MANIFEST (ASSIGN OWNERS)
                    </span>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${state.rows.map(row => `
                            <div style="background:rgba(255,255,255,0.75); border:1.5px solid #cbd5e1; border-radius:8px; padding:10px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                    <strong style="color:#09090b; font-size:0.82rem;">Stage ${row.stage} · ${row.control}</strong>
                                    <select style="background:#ffffff; border:1.5px solid #cbd5e1; color:#3b0764; font-weight:700; font-size:0.75rem; border-radius:4px; padding:2px 6px;" onchange="window.AcademyWidget.updateRowStatus('${row.id}', this.value)">
                                        <option value="missing" ${row.status === 'missing' ? 'selected' : ''}>Missing</option>
                                        <option value="training" ${row.status === 'training' ? 'selected' : ''}>Training Done</option>
                                        <option value="supplied" ${row.status === 'supplied' ? 'selected' : ''}>Draft Supplied</option>
                                        <option value="reviewed" ${row.status === 'reviewed' ? 'selected' : ''}>Team Reviewed</option>
                                        <option value="verified" ${row.status === 'verified' ? 'selected' : ''}>Independently Verified</option>
                                    </select>
                                </div>
                                <p style="font-size:0.78rem; color:#1e293b; margin:0 0 6px 0;">${row.request}</p>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                                    <input type="text" placeholder="Owner (name, not shared inbox)" value="${row.owner}" style="background:#ffffff; border:1.5px solid #cbd5e1; color:#09090b; font-size:0.75rem; padding:4px 8px; border-radius:4px;" onchange="window.AcademyWidget.updateRowOwner('${row.id}', this.value)" />
                                    <input type="date" value="${row.reviewDate}" style="background:#ffffff; border:1.5px solid #cbd5e1; color:#09090b; font-size:0.75rem; padding:4px 8px; border-radius:4px;" onchange="window.AcademyWidget.updateRowDate('${row.id}', this.value)" />
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- LEGAL ACKNOWLEDGMENT CHECKBOXES -->
                <div style="background:rgba(255,255,255,0.7); border:1.5px solid #cbd5e1; border-radius:8px; padding:12px; margin-bottom:1.25rem;">
                    <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.78rem; color:#1e293b; margin-bottom:8px; cursor:pointer;">
                        <input type="checkbox" ${state.ackTraining ? 'checked' : ''} onchange="window.AcademyWidget.setAck('ackTraining', this.checked)" style="margin-top:2px; accent-color:#7c3aed;" />
                        <span>This seal is a BURN-1 training record. It is not an insurance determination, a compliance certification, or proof that a control works in production.</span>
                    </label>
                    <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.78rem; color:#1e293b; cursor:pointer;">
                        <input type="checkbox" ${state.ackHuman ? 'checked' : ''} onchange="window.AcademyWidget.setAck('ackHuman', this.checked)" style="margin-top:2px; accent-color:#7c3aed;" />
                        <span>A human reviews this before anyone treats it as evidence for a carrier, an auditor, or the Metro Plaza Directory. The directory is not updated from this page.</span>
                    </label>
                </div>

                ${!ownersNamed ? `<p style="font-size:0.78rem; color:#b45309; font-weight:800; margin-bottom:8px;">⚠️ Name an owner on every row above before sealing.</p>` : ''}

                <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%; margin-bottom:1rem;" ${!canSeal ? 'disabled' : ''} onclick="window.AcademyWidget.commitManifestSeal()">
                    ${state.seal ? '✓ BURN-1 Academy Seal Minted on this Device' : 'Seal this Training Record & Mint Hash'}
                </button>

                <!-- SEAL DISPLAY IF GENERATED -->
                ${state.seal ? `
                    <div style="background:#fef3c7; border:2px solid #f59e0b; border-radius:8px; padding:1rem; margin-bottom:1.25rem;">
                        <span class="mirror-pill" style="margin-bottom:6px;">BURN-1 ACADEMY SEAL ISSUED FOR ${company}</span>
                        <div style="font-family:'Share Tech Mono', monospace; font-size:0.75rem; color:#78350f; font-weight:800; word-break:break-all; margin:6px 0;">
                            [SHA-256 HASH]: ${state.seal.hash}
                        </div>
                        <span style="font-size:0.72rem; color:#475569; font-weight:700; display:block;">Sealed: ${state.seal.at} · Client-Side Verified</span>
                        <p style="font-size:0.78rem; color:#1e293b; line-height:1.45; margin:8px 0 0 0;">
                            Re-verify by hashing the manifest with any SHA-256 tool. A match proves this record was not edited. It does not prove the security controls exist in production.
                        </p>
                    </div>
                ` : ''}

                <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:1.5rem;">
                    <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.downloadReadinessBrief()">
                        📥 Download Readiness Brief (.txt)
                    </button>
                    <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.print()">
                        🖨️ Print Brief
                    </button>
                </div>

                <!-- EVIDENCE WORKSPACE & SURFACE AUDIT ASK-BUTTONS -->
                <div style="border-top:1.5px solid #cbd5e1; padding-top:1.25rem;">
                    <h4 style="font-family:'Orbitron', sans-serif; font-size:0.95rem; color:#09090b; font-weight:800; margin:0 0 6px 0;">Evidence Workspace & Surface Inspection</h4>
                    <p style="font-size:0.8rem; color:#1e293b; line-height:1.5; margin:0 0 10px 0;">
                        The missions stay free. This device already holds the draft. A workspace is the paid layer: shared owners, review history, and a brief you can hand a broker at renewal. It still is not a warranty, and it does not set your premium.
                    </p>
                    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
                        <a href="mailto:leonrdarden@gmail.com?subject=Evidence%20Workspace%20%E2%80%94%20Academy%20Draft&body=${encodeURIComponent('Company: ' + company + '\n\nWe ran BURN-1 Academy on this device. I want to talk about the Evidence Workspace — shared review, renewal history, and a broker-ready export.\n\nI understand a training seal is not an insurance determination or a premium credit.\n')}" class="mirror-btn mirror-btn-amber" style="text-decoration:none;">
                            📧 Ask About the Workspace
                        </a>
                        <a href="mailto:leonrdarden@gmail.com?subject=Surface%20Audit%20Question&body=${encodeURIComponent('Company: ' + company + '\n\nQuestion about the paid surface audit. I understand it is a human look at the public perimeter, not an automatic carrier binder and not a discount.\n')}" class="mirror-btn mirror-btn-ghost" style="text-decoration:none;">
                            🔍 Ask About a Surface Audit
                        </a>
                    </div>
                    <span style="font-size:0.72rem; color:#475569; display:block;">
                        The public store lists a paid surface audit as a human look at the public perimeter. It does not promise a discount. Underwriters ask about MFA, tested backups, and out-of-band payment checks in their own words — read your policy with your broker.
                    </span>
                </div>
            </div>
        `;
    }

    // --------------------------------------------------------------------------
    // MAIN CONTROLLER & PUBLIC API
    // --------------------------------------------------------------------------
    window.AcademyWidget = {
        init: function(containerId) {
            injectStyles();
            this.container = document.getElementById(containerId);
            loadState();
            if (state.rows.length === 0 && state.intake) {
                state.rows = seedRows(state.intake);
            }
            this.render();
        },

        render: function() {
            if (!this.container) return;
            this.container.className = 'academy-mirror-root';

            if (!state.started) {
                this.container.innerHTML = renderBriefing();
                return;
            }

            if (state.stage === 1) this.container.innerHTML = renderStage1();
            else if (state.stage === 2) this.container.innerHTML = renderStage2();
            else if (state.stage === 3) this.container.innerHTML = renderStage3();
            else if (state.stage === 4) this.container.innerHTML = renderStage4();
            else if (state.stage === 5) this.container.innerHTML = renderStage5();
            else if (state.stage === 6) this.container.innerHTML = renderStage6();
            else if (state.stage === 7) this.container.innerHTML = renderStage7();
            else if (state.stage === 8) this.container.innerHTML = renderStage8();
        },

        start: function() {
            state.started = true;
            persistState();
            this.render();
        },

        goStage: function(stageId) {
            if (isMissionOpen(stageId)) {
                state.stage = stageId;
                persistState();
                this.render();
            }
        },

        resetAll: function() {
            if (confirm("Reset all Academy progress on this device?")) {
                localStorage.removeItem(STORAGE_KEY);
                state = {
                    started: false,
                    stage: 1,
                    intake: null,
                    guideSaved: false,
                    fish: null,
                    vault: null,
                    wire: null,
                    key: null,
                    lock: null,
                    binder: null,
                    rows: [],
                    ackTraining: false,
                    ackHuman: false,
                    seal: null,
                    sealNote: ''
                };
                uiState = {
                    fishStep: 0,
                    fishSeen: {},
                    fishLog: [],
                    fishChoice: null,
                    vaultLocked: [],
                    vaultOrder: [],
                    vaultPhase: 'pick',
                    vaultRestore: false,
                    vaultStruck: false,
                    wirePhase: 'read',
                    wireCallback: null,
                    wireApprover: '',
                    wireMiss: false,
                    keyPhase: 'choose',
                    keyBounced: false,
                    lockLocked: ['invoices', 'payroll', 'bank'],
                    lockDays: 90,
                    lockMode: 'compliance',
                    lockUnderstood: false,
                    lockStruck: false,
                    binderSelected: null,
                    binderPlaced: {},
                    binderChecked: false
                };
                this.render();
            }
        },

        // Stage 1 Actions
        saveIntakeForm: function(form) {
            const formData = new FormData(form);
            const company = (formData.get('company') || 'Your Company').toString().trim();
            const industry = formData.get('industry').toString();
            const headcount = formData.get('headcount').toString();
            const idp = formData.get('idp').toString();
            const industryPath = formData.get('industryPath') === 'on';

            state.intake = { company, industry, headcount, idp, industryPath };
            state.rows = seedRows(state.intake);
            uiState.editingIntake = false;
            persistState();
            this.render();
        },

        editIntake: function() {
            uiState.editingIntake = true;
            this.render();
        },

        downloadGuide: function() {
            if (!state.intake) return;
            downloadFile(`BURN-1-MFA-guide-${companySlug(state.intake.company)}.txt`, guideText(state.intake));
            state.guideSaved = true;
            persistState();
        },

        // Stage 2 Actions
        toggleFishLens: function(caseId, lens) {
            uiState.fishSeen[caseId] = uiState.fishSeen[caseId] || [];
            if (!uiState.fishSeen[caseId].includes(lens)) {
                uiState.fishSeen[caseId].push(lens);
            }
            this.render();
        },

        chooseFishAction: function(action) {
            uiState.fishChoice = action;
            this.render();
        },

        advanceFish: function() {
            const cases = buildFish(state.intake);
            const current = cases[uiState.fishStep];
            if (!current || !uiState.fishChoice) return;

            uiState.fishLog.push({ action: uiState.fishChoice, best: current.best === uiState.fishChoice });

            if (uiState.fishStep + 1 >= cases.length) {
                // Finish round
                const xp = uiState.fishLog.reduce((sum, entry, idx) => sum + cases[idx].xp[entry.action], 0);
                const correct = uiState.fishLog.filter(e => e.best).length;
                const inspectedAll = cases.every(item => (uiState.fishSeen[item.id] || []).length > 0);
                state.fish = { done: true, xp, inspectedAll, correct, total: cases.length };
                uiState.replayFish = false;
                persistState();
            } else {
                uiState.fishStep++;
                uiState.fishChoice = null;
            }
            this.render();
        },

        replayFishRound: function() {
            uiState.replayFish = true;
            uiState.fishStep = 0;
            uiState.fishLog = [];
            uiState.fishChoice = null;
            uiState.fishSeen = {};
            this.render();
        },

        // Stage 3 Actions
        toggleVaultSystem: function(id) {
            if (uiState.vaultLocked.includes(id)) {
                uiState.vaultLocked = uiState.vaultLocked.filter(x => x !== id);
            } else {
                uiState.vaultLocked.push(id);
            }
            this.render();
        },

        setVaultPhase: function(p) {
            uiState.vaultPhase = p;
            this.render();
        },

        addVaultOrder: function(id) {
            if (!uiState.vaultOrder.includes(id) && uiState.vaultOrder.length < 3) {
                uiState.vaultOrder.push(id);
                this.render();
            }
        },

        clearVaultOrder: function() {
            uiState.vaultOrder = [];
            this.render();
        },

        runVaultStrike: function() {
            uiState.vaultPhase = 'after';
            this.render();
        },

        toggleVaultRestore: function(checked) {
            uiState.vaultRestore = checked;
            this.render();
        },

        saveVaultRun: function() {
            const critical = ["payroll", "mail", "records", "payments"];
            let xp = 20;
            for (const id of critical) if (uiState.vaultLocked.includes(id)) xp += 35;
            if (uiState.vaultOrder[0] && uiState.vaultOrder[0] !== "site" && uiState.vaultOrder[0] !== "photos") xp += 40;
            if (uiState.vaultRestore) xp += 45;

            state.vault = {
                done: true,
                xp,
                locked: uiState.vaultLocked,
                order: uiState.vaultOrder,
                restoreTest: uiState.vaultRestore
            };
            uiState.replayVault = false;
            persistState();
            this.render();
        },

        replayVaultStage: function() {
            uiState.replayVault = true;
            uiState.vaultPhase = 'pick';
            uiState.vaultLocked = [];
            uiState.vaultOrder = [];
            uiState.vaultRestore = false;
            this.render();
        },

        // Stage 4 Actions
        holdWirePayment: function() {
            uiState.wirePhase = 'hold';
            this.render();
        },

        sendWirePayment: function() {
            uiState.wirePhase = 'sent';
            uiState.wireMiss = false;
            this.render();
        },

        setWirePhoneChoice: function(choice) {
            uiState.wireCallback = choice;
        },

        setWireApprover: function(name) {
            uiState.wireApprover = name;
        },

        completeWireHold: function() {
            if (uiState.wireCallback === 'email') {
                uiState.wirePhase = 'sent';
                uiState.wireMiss = true;
                this.render();
                return;
            }

            const approver = uiState.wireApprover.trim() || "Controller";
            state.wire = {
                done: true,
                xp: 150,
                held: true,
                usedEmailPhone: false,
                approver
            };
            uiState.replayWire = false;
            persistState();
            this.render();
        },

        resetWireDrill: function() {
            uiState.wirePhase = 'read';
            uiState.wireCallback = null;
            uiState.wireApprover = '';
            uiState.wireMiss = false;
            this.render();
        },

        replayWireStage: function() {
            uiState.replayWire = true;
            this.resetWireDrill();
        },

        // Stage 5 Actions
        chooseKeyUrl: function(type) {
            if (type === 'fake') {
                uiState.keyPhase = 'bounced';
            } else {
                uiState.keyPhase = 'enrolled';
            }
            this.render();
        },

        resetKeyPhase: function() {
            uiState.keyPhase = 'choose';
            this.render();
        },

        refuseChatCode: function(refused) {
            if (!refused) {
                alert("Security Violation: You pasted the verification code into chat. The simulated attacker hijacked your session.");
                uiState.keyPhase = 'choose';
                this.render();
                return;
            }

            const askedSpare = confirm("Would you also like to register a spare backup security key in the office fireproof safe?");
            const xp = askedSpare ? 160 : 120;
            state.key = {
                done: true,
                xp,
                typedUrl: true,
                refusedCode: true,
                askedSpare
            };
            uiState.replayKey = false;
            persistState();
            this.render();
        },

        replayKeyStage: function() {
            uiState.replayKey = true;
            uiState.keyPhase = 'choose';
            this.render();
        },

        // Stage 6 Actions
        toggleLockObject: function(id) {
            if (uiState.lockLocked.includes(id)) {
                uiState.lockLocked = uiState.lockLocked.filter(x => x !== id);
            } else {
                uiState.lockLocked.push(id);
            }
            this.render();
        },

        setLockDays: function(d) {
            uiState.lockDays = d;
            this.render();
        },

        setLockMode: function(m) {
            uiState.lockMode = m;
            this.render();
        },

        setLockUnderstood: function(u) {
            uiState.lockUnderstood = u;
            this.render();
        },

        strikeLock: function() {
            uiState.lockStruck = true;
            this.render();
        },

        saveLockRun: function() {
            let xp = 15;
            for (const obj of LOCK_OBJECTS) if (obj.critical && uiState.lockLocked.includes(obj.id)) xp += 40;
            if (uiState.lockDays >= 30) xp += 25;
            if (uiState.lockDays >= 90) xp += 15;
            if (uiState.lockMode === 'compliance') xp += 20;

            state.lock = {
                done: true,
                xp,
                lockedIds: uiState.lockLocked,
                days: uiState.lockDays,
                mode: uiState.lockMode
            };
            uiState.replayLock = false;
            persistState();
            this.render();
        },

        replayLockStage: function() {
            uiState.replayLock = true;
            uiState.lockStruck = false;
            uiState.lockUnderstood = false;
            this.render();
        },

        // Stage 7 Actions
        selectBinderItem: function(id) {
            uiState.binderSelected = id;
            this.render();
        },

        assignBinderSlot: function(slotId) {
            if (!uiState.binderSelected) return;
            uiState.binderPlaced[uiState.binderSelected] = slotId;
            uiState.binderSelected = null;
            this.render();
        },

        resetBinderPlacements: function() {
            uiState.binderPlaced = {};
            uiState.binderSelected = null;
            this.render();
        },

        replayBinderStage: function() {
            uiState.replayBinder = true;
            this.resetBinderPlacements();
        },

        logBinderSort: function() {
            const correct = BINDER_ARTIFACTS.filter(item => uiState.binderPlaced[item.id] === item.slotId).length;
            state.binder = {
                done: true,
                xp: correct * 20,
                correct,
                total: BINDER_ARTIFACTS.length
            };
            uiState.replayBinder = false;
            persistState();
            this.render();
        },

        // Stage 8 Actions
        updateRowStatus: function(rowId, status) {
            const row = state.rows.find(r => r.id === rowId);
            if (row) {
                row.status = status;
                persistState();
            }
        },

        updateRowOwner: function(rowId, owner) {
            const row = state.rows.find(r => r.id === rowId);
            if (row) {
                row.owner = owner;
                persistState();
            }
        },

        updateRowDate: function(rowId, date) {
            const row = state.rows.find(r => r.id === rowId);
            if (row) {
                row.reviewDate = date;
                persistState();
            }
        },

        setAck: function(field, val) {
            state[field] = val;
            persistState();
            this.render();
        },

        commitManifestSeal: async function() {
            const manifest = buildManifest(state);
            const hash = await computeSha256(manifest);
            state.seal = {
                hash,
                manifest,
                at: new Date().toISOString()
            };
            persistState();
            this.render();
        },

        downloadReadinessBrief: function() {
            if (!state.intake) return;
            const company = state.intake.company || 'Company';
            downloadFile(`BURN-1-readiness-${companySlug(company)}.txt`, readinessText(state));
        }
    };

    // Auto-mount if container exists
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                if (document.getElementById('academy-gamified-widget-mount')) {
                    window.AcademyWidget.init('academy-gamified-widget-mount');
                }
            });
        } else {
            if (document.getElementById('academy-gamified-widget-mount')) {
                window.AcademyWidget.init('academy-gamified-widget-mount');
            }
        }
    }
})();
