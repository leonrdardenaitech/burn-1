/**
 * ==============================================================================
 * BURN-1 CYBER ACADEMY // 8-MISSION RENEWAL PREPARATION ENGINE v2
 * Silver Mirror Edition (Smoke & Mirrors) // Mobile Portrait & Desktop
 * ==============================================================================
 * Clean, legally defensible, zero-password renewal preparation training.
 * No discount promises. Progress stays 100% local on this device.
 * ==============================================================================
 */

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
            label: "Okta",
            real: "https://your-company.okta.com",
            fake: "https://your-company-okta-login.co",
            realHint: "Use the Okta address your company already gave you. This simulation never connects to Okta."
        },
        unsure: {
            label: "Not sure yet",
            real: "The portal you already bookmark",
            fake: "https://secure-login-update.co/mfa",
            realHint: "If you do not know the address, ask on a known phone number. Do not click a setup link to find out."
        }
    };

    const STAGES = [
        { id: 1, name: "Floor Pass", short: "Intake" },
        { id: 2, name: "Fish Hunter", short: "Phish" },
        { id: 3, name: "Recovery Vault", short: "Backups" },
        { id: 4, name: "Wire Freeze", short: "Payments" },
        { id: 5, name: "Hard Key", short: "Keys" },
        { id: 6, name: "Object Lock", short: "Retention" },
        { id: 7, name: "Binder Drop", short: "Sort" },
        { id: 8, name: "The Desk", short: "Seal" }
    ];

    const LOCK_OBJECTS = [
        { id: "invoices", name: "invoices-2026.csv", critical: true, blurb: "What you billed." },
        { id: "payroll", name: "payroll-register.xlsx", critical: true, blurb: "What you owe people." },
        { id: "bank", name: "vendor-bank-changes.csv", critical: true, blurb: "Where money is allowed to go." },
        { id: "banner", name: "spring-sale-banner.png", critical: false, blurb: "A picture. Replaceable." }
    ];

    const BINDER_SLOTS = [
        { id: "mfa", title: "MFA Enrollment", detail: "Who is actually enrolled, not who watched a video." },
        { id: "phish", title: "Phishing Handling", detail: "A report, a decision, a ticket — not a slogan." },
        { id: "restore", title: "Restore Test", detail: "Proof you brought data back, not that a job said success." },
        { id: "callback", title: "Payment Callback", detail: "Out-of-band check before a bank detail changes." },
        { id: "key", title: "Key Recovery", detail: "What happens when a hardware key is lost." },
        { id: "lock", title: "Immutable Copy", detail: "A note of the retention idea — not a live AWS setting." }
    ];

    const BINDER_ARTIFACTS = [
        { id: "video", title: "All-staff video completion sheet", detail: "Everyone pressed play. Nobody exported a setting.", slotId: "reject" },
        { id: "oldshot", title: "One admin MFA screenshot, 2022", detail: "A single person, four years ago.", slotId: "reject" },
        { id: "enroll", title: "Fictional IdP enrollment export", detail: "Sample rows: method, user, date. Not from a live tenant.", slotId: "mfa" },
        { id: "ticket", title: "Phish ticket FH-204", detail: "Reported, not clicked. Includes the lookalike domain.", slotId: "phish" },
        { id: "jobmail", title: "Backup job success email", detail: "The job ran. Nobody tried a restore.", slotId: "reject" },
        { id: "drill", title: "Restore drill notes (fictional)", detail: "Payroll file opened from the vault copy. Training note only.", slotId: "restore" },
        { id: "docket", title: "Callback docket from this session", detail: "BURN-1 training template, filled in the wire mission.", slotId: "callback" },
        { id: "slack", title: "Chat: “backups are fine”", detail: "A mood. Not a record.", slotId: "reject" },
        { id: "spare", title: "Spare-key procedure, draft", detail: "Second key in the office safe. Break-glass accounts stay offline.", slotId: "key" },
        { id: "simlock", title: "Object Lock simulation card", detail: "Retention choices from the widget. Does not configure AWS.", slotId: "lock" }
    ];

    function companySlug(name) {
        return (name || "yourco").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18) || "yourco";
    }

    function buildFish(intake) {
        const slug = companySlug(intake.company);
        const meta = INDUSTRY_META[intake.industry] || INDUSTRY_META.professional;
        const known = `${slug}.com`;

        return [
            {
                id: "mailbox",
                fromName: "IT Support",
                fromEmail: `helpdesk@${slug}-secure-mail.com`,
                subject: "Mailbox deletes in 2 hours",
                preview: `Hi ${intake.company} team — confirm your password so we can keep the mailbox. Link inside.`,
                complyLabel: "Open the link",
                lenses: {
                    sender: { tone: "hot", text: `Display name says IT. The domain is ${slug}-secure-mail.com, not ${known}.` },
                    link: { tone: "hot", text: "The button goes to a login page you have never used. Password fields on a surprise link are the trap." },
                    ask: { tone: "hot", text: "A two-hour deletion threat is pressure. Real IT can meet you in the admin portal you already know." }
                },
                best: "report",
                xp: { report: 80, hold: 40, comply: 0 },
                why: {
                    report: "Right call. Report it, then check the real admin portal on your own. Do not use the link as a shortcut.",
                    hold: "Holding is safer than clicking. Reporting is stronger — it warns the rest of the floor.",
                    comply: "That link wanted the password. Urgency was the costume. The mailbox was never the prize."
                }
            },
            {
                id: "invoice",
                fromName: `${meta.vendor} Billing`,
                fromEmail: `ap@${meta.vendor.toLowerCase().replace(/[^a-z]+/g, "")}-billing.co`,
                subject: "Updated invoice — pay today",
                preview: "Please pay the attached invoice to the new account. Our bank changed this morning. Do not call the old number.",
                complyLabel: "Pay the invoice",
                lenses: {
                    sender: { tone: "hot", text: `${meta.vendor} is a vendor you use. This domain adds “-billing.co”. That is not the same company.` },
                    link: { tone: "cool", text: "The attachment name looks normal. Attachments are not proof. The sender domain is the tell." },
                    ask: { tone: "hot", text: "A new bank account plus “do not call” is a payment diversion, not a billing update." }
                },
                best: "hold",
                xp: { report: 70, hold: 120, comply: 0 },
                why: {
                    hold: "Best judgment. Hold payment and call the vendor on the number already in your files — not the one in this email.",
                    report: "Reporting is good. Also freeze the payment. A ticket alone does not stop accounts payable.",
                    comply: "You would have paid a lookalike. The vendor name was real. The domain was not."
                }
            },
            {
                id: "exec",
                fromName: "Jordan Hale",
                fromEmail: `jordan.hale@${slug}.co`,
                subject: "On with counsel — need this quiet",
                preview: "I'm walking into a meeting. Buy four gift cards for a client and text me the codes. Don't loop in anyone else.",
                complyLabel: "Send the codes",
                lenses: {
                    sender: { tone: "hot", text: `Close. Your known domain is ${known}. This one is ${slug}.co — one different ending.` },
                    link: { tone: "ok", text: "No link. The ask itself is the payload." },
                    ask: { tone: "hot", text: "Secrecy, gift cards, and a meeting excuse. Executives do not need codes texted from the floor." }
                },
                best: "report",
                xp: { report: 110, hold: 70, comply: 0 },
                why: {
                    report: "The domain was one letter-group off and the ask was gift cards. Report it and tell the real Jordan on a known channel.",
                    hold: "Not sending codes was the important part. Reporting keeps the next person from sending them.",
                    comply: "Gift-card codes are cash. A busy-executive story is the oldest spearphish on the floor."
                }
            },
            {
                id: "hr",
                fromName: "People Team",
                fromEmail: `benefits@${known}`,
                subject: "Open enrollment closes Friday",
                preview: `Enrollment for ${intake.company} closes Friday. Review your options in the usual benefits portal. No passwords by email.`,
                complyLabel: "Open the usual portal",
                lenses: {
                    sender: { tone: "ok", text: `From benefits@${known} — the domain on your floor pass.` },
                    link: { tone: "ok", text: "The button is labeled with your known portal name, not a surprise login host." },
                    ask: { tone: "ok", text: "A deadline, but no password, no gift card, no new bank account. Ordinary HR." }
                },
                best: "comply",
                xp: { report: 10, hold: 40, comply: 100 },
                why: {
                    comply: "This one was real. Sound judgment includes letting ordinary work through after you check the domain.",
                    hold: "Caution is reasonable. You can still open it — the domain matched and the ask was normal.",
                    report: "Reporting a real benefits note creates noise. Check the domain before you escalate."
                }
            },
            {
                id: "codes",
                fromName: "Sam Ortiz",
                fromEmail: `sam.ortiz@${known}`,
                subject: "Auditor is on the line",
                preview: "Hey — the auditor needs our MFA backup codes in the next ten minutes. Text them to me so I can read them out.",
                complyLabel: "Text the codes",
                lenses: {
                    sender: { tone: "ok", text: `The domain matches ${known}. A real mailbox can still be wrong, or already compromised.` },
                    link: { tone: "cool", text: "No link. They want the codes in a text, where you cannot take them back." },
                    ask: { tone: "hot", text: "Backup codes bypass MFA. Nobody needs them read aloud to an auditor. That request is the incident." }
                },
                best: "report",
                xp: { report: 140, hold: 90, comply: 0 },
                why: {
                    report: "Highest-value catch. The domain was clean and the ask was poisonous. Escalate. Do not send codes. Ever.",
                    hold: "You kept the codes. Now report it — a coworker mailbox asking for backup codes is an incident, not a favor.",
                    comply: "Those codes are the spare keys to the building. A real auditor will never ask you to text them."
                }
            }
        ];
    }

    function systemsFor(intake) {
        const records = (INDUSTRY_META[intake.industry] || INDUSTRY_META.professional).records;
        return [
            { id: "payroll", name: "Payroll & Tax", critical: true, hint: "People get paid from this." },
            { id: "mail", name: "Email", critical: true, hint: "How customers reach you." },
            { id: "records", name: records, critical: true, hint: "You cannot operate blind." },
            { id: "payments", name: "Vendor Bank File", critical: true, hint: "This is what wire fraud targets." },
            { id: "site", name: "Public Website", critical: false, hint: "Visible. Rarely the first restore." },
            { id: "photos", name: "Marketing Photos", critical: false, hint: "Nice to have. Not rent." }
        ];
    }

    function wireKit(intake) {
        const slug = companySlug(intake.company);
        const vendor = (INDUSTRY_META[intake.industry] || INDUSTRY_META.professional).vendor;
        return {
            vendor,
            exec: "Avery Chen",
            realEmail: `avery.chen@${slug}.com`,
            fakeEmail: `avery.chen@${slug}-payments.co`,
            amount: "$48,600",
            last4: "4419",
            knownPhone: "(404) 555-0148",
            bankPhone: "(800) 555-0199",
            emailPhone: "(404) 555-0177"
        };
    }

    function seedRows(intake) {
        const crew = (INDUSTRY_META[intake.industry] || INDUSTRY_META.professional).crew;
        const headcount = HEADCOUNT_LABEL[intake.headcount] || "11–50 people";
        return [
            { id: "mfa", stage: 1, control: "Identity", request: `MFA on email, remote access, and admin portals for a ${headcount} team`, status: "missing", owner: "", reviewDate: "", next: "Use the free guide, then export enrollment from the real admin site.", trainingNote: "Simulated IdP choice only. No password, code, or secret is collected." },
            { id: "phish", stage: 2, control: "Phishing", request: `${crew} can inspect the domain and refuse a bad ask`, status: "missing", owner: "", reviewDate: "", next: "Finish Fish Hunter, then keep one real reported message as a sample.", trainingNote: "Judgment drills use fictional mail." },
            { id: "scope", stage: 3, control: "Backups", request: "Backup scope covers payroll, mail, records, and the vendor bank file", status: "missing", owner: "", reviewDate: "", next: "Name the systems that must survive a ransomware weekend.", trainingNote: "The vault is a drill, not a backup product." },
            { id: "restore", stage: 3, control: "Backups", request: "A restore test with a date, not only a success email", status: "missing", owner: "", reviewDate: "", next: "Schedule a real restore and write down what came back.", trainingNote: "Saying yes in the drill does not test production backups." },
            { id: "callback", stage: 4, control: "Payments", request: "Payment changes verified on a known number, by a second person", status: "missing", owner: "", reviewDate: "", next: "Fill the training docket, then adopt it on the next real vendor change.", trainingNote: "BURN-1 template. Not a carrier form." },
            { id: "key", stage: 5, control: "Phishing-Resistant MFA", request: "Security-key habit: trusted page, no shared codes, a spare plan", status: "missing", owner: "", reviewDate: "", next: "No physical key is required to finish the simulation.", trainingNote: "The terminal is simulated. Do not type real credentials into training." },
            { id: "lock", stage: 6, control: "Immutable Copies", request: "Retention idea for finance files, separate from ordinary delete rights", status: "missing", owner: "", reviewDate: "", next: "If you use object storage, export the real configuration. This widget will not.", trainingNote: "Write-denial in the sim is an illustration, not an AWS account." },
            { id: "classify", stage: 7, control: "Evidence Hygiene", request: "Training, supplied drafts, review, and independent verification stay distinct", status: "missing", owner: "", reviewDate: "", next: "Sort the fictional pile. Mark gaps instead of upgrading them.", trainingNote: "A matched training artifact is still not independently verified." }
        ];
    }

    function guideText(intake) {
        const idp = IDP_META[intake.idp] || IDP_META.microsoft;
        return `BURN-1 FREE GUIDE\nMicrosoft, Google, and Okta MFA Setup (Training Aid)\nCompany: ${intake.company}\nChosen Lane: ${idp.label}\n\nTHIS IS A BURN-1 TRAINING GUIDE.\nIt is not a vendor manual, not legal advice, and not an insurance form.\nMenus change. Confirm clicks in your own admin portal.\n\nKey Training Steps:\n1. Open your admin portal directly in your browser. Do not follow setup links from email or chat.\n2. Prefer authenticator apps with number matching or FIDO2 hardware keys over SMS text messages.\n3. Keep at least two emergency break-glass accounts stored offline and alerted upon sign-in.\n4. When you need an underwriter record, export user registration/methods logs.\n5. Write down the control owner, the review date, and any known coverage gaps.\n\nWhat This Guide Is NOT:\n- It does not enroll anyone.\n- It does not satisfy an insurance warranty by itself.\n- It does not promise a premium credit.\n- Read your policy wording with your broker.\n\nPrepared for training at ${intake.company}. Do not send passwords, MFA codes, or recovery keys to BURN-1.\n`;
    }

    function buildManifest(state) {
        const lines = [
            "BURN-1 Academy Training Manifest v1",
            "Hash covers this text only.",
            "Not proof of production security, insurance eligibility, compliance, or a premium credit.",
            `Company: ${state.intake?.company ?? ""}`,
            `Industry: ${state.intake?.industry ?? ""}`,
            `Headcount: ${state.intake?.headcount ?? ""}`,
            `IdP Lane (Simulated): ${state.intake?.idp ?? ""}`,
            `XP: ${totalXp(state)}`,
            `Fish: ${state.fish?.correct ?? 0}/${state.fish?.total ?? 0}`,
            `Vault Locked: ${(state.vault?.locked ?? []).join(",")}`,
            `Restore Drill Flagged: ${state.vault?.restoreTest ? "yes" : "no"}`,
            `Wire Held: ${state.wire?.held ? "yes" : "no"}`,
            `Callback: ${state.wire?.callbackLabel ?? ""}`,
            `Key Trusted Page: ${state.key?.typedUrl ? "yes" : "no"}`,
            `Key Refused Code Share: ${state.key?.refusedCode ? "yes" : "no"}`,
            `Lock Days: ${state.lock?.days ?? ""}`,
            `Lock Mode: ${state.lock?.mode ?? ""}`,
            `Lock Objects: ${(state.lock?.lockedIds ?? []).join(",")}`,
            `Binder: ${state.binder?.correct ?? 0}/${state.binder?.total ?? 0}`,
            ...state.rows.map(r => `${r.id}|${r.status}|owner=${r.owner}|date=${r.reviewDate}|next=${r.next.replace(/\n/g, ' ')}`),
            `Ack Training Limits: ${state.ackTraining ? "yes" : "no"}`,
            `Ack Human Review: ${state.ackHuman ? "yes" : "no"}`,
            "Self-marked verified rows were not confirmed by BURN-1."
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
    // SILVER MIRROR THEME CSS
    // --------------------------------------------------------------------------
    function injectStyles() {
        if (document.getElementById('academy-mirror-theme-v2')) return;
        const style = document.createElement('style');
        style.id = 'academy-mirror-theme-v2';
        style.innerHTML = `
            .academy-mirror-root {
                font-family: 'Space Grotesk', system-ui, sans-serif;
                color: #f1f5f9;
                background: linear-gradient(180deg, rgba(14, 10, 24, 0.94) 0%, rgba(6, 4, 12, 0.98) 100%);
                border: 1.5px solid rgba(255, 255, 255, 0.18);
                border-radius: 1.5rem;
                box-shadow: 0 0 35px rgba(245, 158, 11, 0.1), 0 0 60px rgba(147, 51, 234, 0.15), inset 0 0 25px rgba(255, 255, 255, 0.03);
                backdrop-filter: blur(16px);
                padding: 1.5rem;
                max-width: 1040px;
                margin: 0 auto;
                position: relative;
                overflow: hidden;
            }
            @media (min-width: 640px) {
                .academy-mirror-root { padding: 2rem; }
            }
            .mirror-pill {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
                border: 1px solid rgba(255, 255, 255, 0.22);
                border-radius: 9999px;
                padding: 4px 14px;
                font-family: 'Share Tech Mono', monospace;
                font-size: 0.75rem;
                color: #f59e0b;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 0 6px rgba(255, 255, 255, 0.1);
            }
            .mirror-btn {
                background: linear-gradient(135deg, #fdfdfd 0%, #e2e8f0 45%, #cbd5e1 70%, #94a3b8 100%);
                color: #020617;
                font-family: 'Orbitron', sans-serif;
                font-weight: 800;
                font-size: 0.8rem;
                padding: 10px 20px;
                border-radius: 0.75rem;
                border: 1px solid #ffffff;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.9);
            }
            .mirror-btn:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 6px 18px rgba(255, 255, 255, 0.35);
                filter: brightness(1.05);
            }
            .mirror-btn:disabled {
                opacity: 0.45;
                cursor: not-allowed;
                filter: grayscale(0.8);
            }
            .mirror-btn-amber {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: #000;
                border-color: #fcd34d;
                box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
            }
            .mirror-btn-purple {
                background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
                color: #fff;
                border-color: #c084fc;
                box-shadow: 0 4px 14px rgba(168, 85, 247, 0.4);
            }
            .mirror-btn-ghost {
                background: rgba(255, 255, 255, 0.04);
                color: #cbd5e1;
                border: 1px solid rgba(255, 255, 255, 0.18);
                box-shadow: none;
            }
            .mirror-btn-ghost:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border-color: rgba(255, 255, 255, 0.35);
            }
            .mirror-card {
                background: rgba(14, 10, 26, 0.75);
                border: 1px solid rgba(255, 255, 255, 0.14);
                border-radius: 1rem;
                padding: 1.25rem;
                transition: all 0.2s ease;
            }
            .mirror-card.active {
                border-color: #f59e0b;
                background: rgba(245, 158, 11, 0.08);
                box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
            }
            .stage-nav-pill {
                min-height: 42px;
                padding: 6px 14px;
                border-radius: 9999px;
                border: 1px solid rgba(255, 255, 255, 0.12);
                background: rgba(10, 8, 20, 0.7);
                color: #94a3b8;
                font-size: 0.78rem;
                font-family: 'Orbitron', sans-serif;
                white-space: nowrap;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .stage-nav-pill:hover:not(:disabled) {
                border-color: rgba(245, 158, 11, 0.5);
                color: #fff;
            }
            .stage-nav-pill.active {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: #000;
                border-color: #fef3c7;
                font-weight: 800;
                box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
            }
            .stage-nav-pill.done {
                border-color: #10b981;
                color: #34d399;
                background: rgba(16, 185, 129, 0.1);
            }
            .stage-nav-pill:disabled {
                opacity: 0.35;
                cursor: not-allowed;
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
            .bullseye-r3 { width: 50%; height: 50%; border: 2px solid #f59e0b; box-shadow: 0 0 15px rgba(245, 158, 11, 0.35); }
            .bullseye-cross-h { position: absolute; width: 100%; height: 1px; background: rgba(147, 51, 234, 0.4); }
            .bullseye-cross-v { position: absolute; height: 100%; width: 1px; background: rgba(147, 51, 234, 0.4); }
            @keyframes pulse-ring {
                0% { transform: scale(0.98); opacity: 0.8; }
                50% { transform: scale(1.02); opacity: 1; border-color: rgba(245, 158, 11, 0.6); }
                100% { transform: scale(0.98); opacity: 0.8; }
            }

            /* CHAT BUBBLES IN KEY STAGE */
            .chat-bubble {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 0.75rem;
                padding: 10px 14px;
                font-size: 0.82rem;
                line-height: 1.45;
                color: #e2e8f0;
            }
            .chat-bubble-sender {
                font-family: 'Share Tech Mono', monospace;
                font-size: 0.7rem;
                color: #a855f7;
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
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.12); padding-bottom:1rem; margin-bottom:1.25rem;">
                <div>
                    <span style="font-family:'Orbitron', sans-serif; font-size:0.75rem; letter-spacing:2px; color:#f59e0b; display:block;">BURN-1</span>
                    <h2 style="font-family:'Orbitron', sans-serif; font-size:1.35rem; margin:0; color:#fff; font-weight:800; letter-spacing:1px;">CYBER ACADEMY</h2>
                </div>
                <div style="text-align:right;">
                    <div class="mirror-pill">⚡ ${xp} XP</div>
                    <span style="font-size:0.68rem; color:#94a3b8; font-family:'Share Tech Mono', monospace; display:block; margin-top:2px;">ON-DEVICE TRAINING DRAFT</span>
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
                <button type="button" class="stage-nav-pill" style="color:#ef4444;" onclick="window.AcademyWidget.resetAll()">
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
                        <h1 style="font-family:'Orbitron', sans-serif; font-size:1.9rem; line-height:1.2; margin:8px 0; color:#fff; font-weight:900;">
                            Eight missions.<br>
                            <span style="color:#f59e0b;">Renewal week gets quieter.</span>
                        </h1>
                        <p style="font-size:0.92rem; color:#cbd5e1; max-width:620px; line-height:1.6; margin:0 0 1.25rem 0;">
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
                        <span style="font-family:'Orbitron', sans-serif; font-size:0.75rem; color:#f59e0b; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px;">WHAT YOU PRACTICE</span>
                        <p style="font-size:0.85rem; color:#cbd5e1; margin:0; line-height:1.5;">Judgment, not a multiple-choice badge. Hard calls score more than obvious fakes.</p>
                    </div>
                    <div class="mirror-card">
                        <span style="font-family:'Orbitron', sans-serif; font-size:0.75rem; color:#f59e0b; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px;">WHAT YOU LEAVE WITH</span>
                        <p style="font-size:0.85rem; color:#cbd5e1; margin:0; line-height:1.5;">A checklist separating training from supplied, reviewed, and verified evidence.</p>
                    </div>
                    <div class="mirror-card">
                        <span style="font-family:'Orbitron', sans-serif; font-size:0.75rem; color:#f59e0b; text-transform:uppercase; letter-spacing:1px; display:block; margin-bottom:4px;">WHAT THIS IS NOT</span>
                        <p style="font-size:0.85rem; color:#cbd5e1; margin:0; line-height:1.5;">Not a Chubb warranty, not a HIPAA safe harbor, not a discount schedule.</p>
                    </div>
                </div>

                <div class="mirror-card" style="background:rgba(255,255,255,0.02); font-size:0.82rem; color:#94a3b8; line-height:1.6;">
                    <strong style="color:#e2e8f0;">Legally Defensible Renewal Preparation:</strong>
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
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#fff;">One card. No passwords.</h3>
                <p style="font-size:0.85rem; color:#94a3b8; margin:0 0 1rem 0;">
                    Tell us the shape of the team. The later missions use it. This is a simulated sign-in lane — it never connects to Okta, Microsoft, or Google, and it never asks for a code.
                </p>
            </div>

            ${intake && !uiState.editingIntake ? `
                <div class="mirror-card" style="margin-bottom:1rem;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:1rem;">
                        <div><span style="font-size:0.75rem; color:#94a3b8;">Company:</span> <strong style="display:block; color:#fff;">${intake.company}</strong></div>
                        <div><span style="font-size:0.75rem; color:#94a3b8;">Industry:</span> <strong style="display:block; color:#f59e0b;">${(INDUSTRY_META[intake.industry] || {}).label}</strong></div>
                        <div><span style="font-size:0.75rem; color:#94a3b8;">Headcount:</span> <strong style="display:block; color:#fff;">${HEADCOUNT_LABEL[intake.headcount]}</strong></div>
                        <div><span style="font-size:0.75rem; color:#94a3b8;">Login Lane:</span> <strong style="display:block; color:#38bdf8;">${(IDP_META[intake.idp] || {}).label}</strong></div>
                    </div>
                    <p style="font-size:0.8rem; color:#94a3b8; line-height:1.5; padding:8px 12px; background:rgba(0,0,0,0.4); border-radius:8px; border:1px solid rgba(255,255,255,0.08); margin:0 0 1rem 0;">
                        Simulated authentication only. Account configuration happens in your real admin portal. BURN-1 does not store a password, an MFA code, or a recovery key.
                    </p>
                    ${intake.industryPath ? `<p style="font-size:0.82rem; color:#e2e8f0; margin-bottom:1rem;">${(INDUSTRY_META[intake.industry] || {}).note}</p>` : ''}
                    
                    <div style="border:1px solid rgba(245, 158, 11, 0.4); background:rgba(245, 158, 11, 0.05); padding:1rem; border-radius:0.75rem; margin-bottom:1rem;">
                        <h4 style="font-family:'Orbitron', sans-serif; font-size:0.85rem; color:#f59e0b; margin:0 0 6px 0;">FREE MFA SETUP GUIDE</h4>
                        <p style="font-size:0.8rem; color:#cbd5e1; margin:0 0 12px 0;">
                            A BURN-1 training aid for ${(IDP_META[intake.idp] || {}).label}. Not a vendor manual and not a carrier warranty worksheet. Menus change — confirm clicks on the real site.
                        </p>
                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.downloadGuide()">
                                📥 Download the Free Guide (.txt)
                            </button>
                            <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.editIntake()">
                                Edit Answers
                            </button>
                        </div>
                    </div>

                    <button type="button" class="mirror-btn" style="width:100%;" onclick="window.AcademyWidget.goStage(2)">
                        Enter Fish Hunter &rarr;
                    </button>
                </div>
            ` : `
                <form onsubmit="event.preventDefault(); window.AcademyWidget.saveIntakeForm(this);">
                    <div class="mirror-card" style="display:flex; flex-col; gap:14px; margin-bottom:1rem;">
                        <div>
                            <label style="display:block; font-size:0.8rem; font-weight:bold; margin-bottom:4px; color:#e2e8f0;">Company / Entity Name</label>
                            <input type="text" name="company" value="${intake?.company || 'Metro Plaza Works'}" required style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.9rem;" />
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; font-weight:bold; margin-bottom:6px; color:#e2e8f0;">Industry Lane</label>
                            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
                                ${Object.keys(INDUSTRY_META).map(k => `
                                    <label class="mirror-card" style="padding:10px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                                        <input type="radio" name="industry" value="${k}" ${(!intake && k === 'clinic') || (intake?.industry === k) ? 'checked' : ''} style="accent-color:#f59e0b;" />
                                        <span style="font-size:0.82rem; font-weight:bold;">${INDUSTRY_META[k].label}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; font-weight:bold; margin-bottom:6px; color:#e2e8f0;">Team Workforce Sizing</label>
                            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
                                ${Object.keys(HEADCOUNT_LABEL).map(k => `
                                    <label class="mirror-card" style="padding:10px; cursor:pointer; text-align:center;">
                                        <input type="radio" name="headcount" value="${k}" ${(!intake && k === '11-50') || (intake?.headcount === k) ? 'checked' : ''} style="accent-color:#f59e0b;" />
                                        <span style="font-size:0.78rem; font-weight:bold; display:block; margin-top:2px;">${HEADCOUNT_LABEL[k]}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; font-weight:bold; margin-bottom:6px; color:#e2e8f0;">Where do people sign in today? (Simulated Lane)</label>
                            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
                                ${Object.keys(IDP_META).map(k => `
                                    <label class="mirror-card" style="padding:10px; cursor:pointer;">
                                        <input type="radio" name="idp" value="${k}" ${(!intake && k === 'microsoft') || (intake?.idp === k) ? 'checked' : ''} style="accent-color:#f59e0b;" />
                                        <span style="font-size:0.82rem; font-weight:bold; display:block; margin-top:2px;">${IDP_META[k].label}</span>
                                        <span style="font-size:0.7rem; color:#94a3b8; display:block;">Simulated. Not a live tenant.</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.8rem; color:#cbd5e1; cursor:pointer;">
                            <input type="checkbox" name="industryPath" ${intake?.industryPath !== false ? 'checked' : ''} style="margin-top:2px; accent-color:#f59e0b;" />
                            <span>Add industry-specific statutory guidance to later missions. Optional. Still not legal advice.</span>
                        </label>

                        <button type="submit" class="mirror-btn mirror-btn-amber" style="width:100%; margin-top:6px;">
                            Cut the Floor Pass &rarr;
                        </button>
                    </div>
                </form>
            `}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 02: FISH HUNTER (BULLSEYE & LENSES)
    // --------------------------------------------------------------------------
    function renderStage2() {
        if (!state.intake) return renderStage1();
        const cases = buildFish(state.intake);
        const saved = state.fish;
        const playing = !saved?.done || uiState.replayFish;
        const current = cases[uiState.fishStep];

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 2 · Fish Hunter</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#fff;">Read the domain before the drama.</h3>
                <p style="font-size:0.85rem; color:#94a3b8; margin:0 0 1rem 0;">
                    Five messages. XP favors the hard call — a clean domain with a poisonous ask scores higher than spotting an obvious fake. Reporting everything is not wisdom.
                </p>
            </div>

            ${playing && current ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#94a3b8; margin-bottom:1rem;">
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
                        <span style="position:relative; z-index:10; font-family:'Share Tech Mono', monospace; font-size:0.82rem; color:#f59e0b; text-align:center; max-width:140px; word-break:break-all;">
                            ${current.fromEmail.split('@')[1] || current.fromEmail}
                        </span>
                    </div>

                    <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:0.75rem; padding:1rem; margin:1.25rem 0 1rem 0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <strong style="color:#fff; font-size:0.9rem;">${current.fromName}</strong>
                            <span style="font-family:'Share Tech Mono', monospace; font-size:0.75rem; color:#38bdf8;">${current.fromEmail}</span>
                        </div>
                        <div style="font-family:'Orbitron', sans-serif; font-size:0.95rem; color:#f59e0b; margin-bottom:6px;">${current.subject}</div>
                        <p style="font-size:0.85rem; color:#cbd5e1; margin:0; line-height:1.5;">${current.preview}</p>
                    </div>

                    <!-- FORENSIC INSPECTION LENSES -->
                    <div style="margin-bottom:1.25rem;">
                        <span style="font-size:0.75rem; font-family:'Share Tech Mono', monospace; color:#a855f7; display:block; margin-bottom:6px; text-transform:uppercase;">
                            Forensic Inspection Lenses (Tap to inspect before deciding)
                        </span>
                        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                            ${['sender', 'link', 'ask'].map(lens => {
                                const seen = (uiState.fishSeen[current.id] || []).includes(lens);
                                const data = current.lenses[lens];
                                return `
                                    <button type="button" class="mirror-btn mirror-btn-ghost" style="padding:8px 4px; font-size:0.72rem; ${seen ? 'border-color:#f59e0b; color:#f59e0b;' : ''}" onclick="window.AcademyWidget.toggleFishLens('${current.id}', '${lens}')">
                                        ${seen ? '✓ ' : ''}${lens.toUpperCase()} LENS
                                    </button>
                                `;
                            }).join('')}
                        </div>

                        ${(uiState.fishSeen[current.id] || []).map(lens => {
                            const data = current.lenses[lens];
                            const toneColor = data.tone === 'hot' ? '#ef4444' : data.tone === 'ok' ? '#10b981' : '#38bdf8';
                            return `
                                <div style="margin-top:6px; padding:8px 12px; background:rgba(0,0,0,0.6); border-left:3px solid ${toneColor}; font-size:0.78rem; line-height:1.45; color:#e2e8f0;">
                                    <strong style="color:${toneColor}; text-transform:uppercase;">${lens} clue:</strong> ${data.text}
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- DECISION ACTIONS -->
                    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:1rem;">
                        <button type="button" class="mirror-btn mirror-btn-ghost" style="${uiState.fishChoice === 'report' ? 'border-color:#10b981; background:rgba(16,185,129,0.15);' : ''}" onclick="window.AcademyWidget.chooseFishAction('report')">
                            🚨 Report
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" style="${uiState.fishChoice === 'hold' ? 'border-color:#f59e0b; background:rgba(245,158,11,0.15);' : ''}" onclick="window.AcademyWidget.chooseFishAction('hold')">
                            ⏸️ Hold
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" style="${uiState.fishChoice === 'comply' ? 'border-color:#38bdf8; background:rgba(56,189,248,0.15);' : ''}" onclick="window.AcademyWidget.chooseFishAction('comply')">
                            👉 ${current.complyLabel}
                        </button>
                    </div>

                    ${uiState.fishChoice ? `
                        <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); padding:10px 14px; border-radius:8px; font-size:0.82rem; margin-bottom:1rem; color:#f1f5f9;">
                            <strong>Why:</strong> ${current.why[uiState.fishChoice]}
                            <span style="color:#f59e0b; font-weight:bold; display:block; margin-top:4px;">Earns: +${current.xp[uiState.fishChoice]} XP</span>
                        </div>
                        <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%;" onclick="window.AcademyWidget.advanceFish()">
                            ${uiState.fishStep + 1 >= cases.length ? 'Log Round & Save XP &rarr;' : 'Next Message &rarr;'}
                        </button>
                    ` : ''}
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">ROUND LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#fff; margin:6px 0;">
                        ${saved.correct >= 4 ? 'Clean eyes on the floor.' : 'Round finished.'}
                    </h3>
                    <p style="font-size:0.85rem; color:#cbd5e1; margin:0 0 1rem 0;">
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
        const saved = state.vault;
        const playing = !saved?.done || uiState.replayVault;

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 3 · Recovery Vault</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#fff;">What still exists on Monday?</h3>
                <p style="font-size:0.85rem; color:#94a3b8; margin:0 0 1rem 0;">
                    Lock the systems that have to survive, then rank the first restores. A website that loads while payroll is gone is not a recovery.
                </p>
            </div>

            ${playing ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    ${uiState.vaultPhase === 'pick' ? `
                        <p style="font-size:0.82rem; color:#e2e8f0; margin-bottom:10px;">Tap everything that belongs in an immutable copy:</p>
                        <div style="display:grid; gap:8px; margin-bottom:1rem;">
                            ${systems.map(s => {
                                const on = uiState.vaultLocked.includes(s.id);
                                return `
                                    <button type="button" class="mirror-card" style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; cursor:pointer; ${on ? 'border-color:#f59e0b; background:rgba(245,158,11,0.12);' : ''}" onclick="window.AcademyWidget.toggleVaultSystem('${s.id}')">
                                        <div style="text-align:left;">
                                            <strong style="color:#fff; font-size:0.88rem; display:block;">${s.name}</strong>
                                            <span style="font-size:0.75rem; color:#94a3b8;">${s.hint}</span>
                                        </div>
                                        <span class="mirror-pill" style="font-size:0.68rem; ${on ? 'color:#000; background:#f59e0b;' : ''}">
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
                        <p style="font-size:0.82rem; color:#e2e8f0; margin-bottom:10px;">Pick the first three things you would bring back, in order of operational priority:</p>
                        <ol style="margin:0 0 1rem 0; padding-left:1.25rem; font-size:0.85rem; color:#cbd5e1;">
                            ${[0, 1, 2].map(slot => {
                                const sid = uiState.vaultOrder[slot];
                                const sys = systems.find(s => s.id === sid);
                                return `<li style="padding:4px 0;"><span style="color:#94a3b8;">Restore ${slot + 1}:</span> <strong style="color:#f59e0b;">${sys ? sys.name : '—'}</strong></li>`;
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
                                Run the Ransomware Strike &rarr;
                            </button>
                            <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.clearVaultOrder()">
                                Clear
                            </button>
                        </div>
                    ` : `
                        <div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:0.75rem; padding:1rem; margin-bottom:1rem;">
                            <span class="mirror-pill" style="color:#ef4444; border-color:#ef4444; margin-bottom:6px;">RANSOMWARE WEEKEND STRIKE</span>
                            <p style="font-size:0.85rem; color:#f1f5f9; line-height:1.5; margin:6px 0;">
                                ${systems.filter(s => uiState.vaultLocked.includes(s.id)).map(s => s.name).join(', ')} survived inside the immutable vault copy.<br>
                                ${systems.filter(s => !uiState.vaultLocked.includes(s.id)).length > 0 ? `<strong style="color:#ef4444;">Wiped outside the vault:</strong> ${systems.filter(s => !uiState.vaultLocked.includes(s.id)).map(s => s.name).join(', ')}` : 'Zero critical files lost!'}
                            </p>
                        </div>

                        <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.8rem; color:#cbd5e1; margin-bottom:1.25rem; cursor:pointer;">
                            <input type="checkbox" ${uiState.vaultRestore ? 'checked' : ''} onchange="window.AcademyWidget.toggleVaultRestore(this.checked)" style="margin-top:2px; accent-color:#f59e0b;" />
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
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#fff; margin:6px 0;">Recovery readiness recorded.</h3>
                    <p style="font-size:0.85rem; color:#cbd5e1; margin:0 0 1rem 0;">
                        ${saved.locked.length} systems vaulted. Priority 1: ${(systems.find(s => s.id === saved.order[0]) || {}).name || 'Payroll'}.
                        ${saved.restoreTest ? ' Real restore test logged on calendar.' : ' Remember: unverified backups do not count during renewal.'}
                    </p>
                    <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(4)">
                        Proceed to Wire Freeze &rarr;
                    </button>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 04: WIRE FREEZE (CALLBACK DOCKET)
    // --------------------------------------------------------------------------
    function renderStage4() {
        if (!state.intake) return renderStage1();
        const kit = wireKit(state.intake);
        const saved = state.wire;
        const playing = !saved?.done || uiState.replayWire;

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 4 · Wire Freeze</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#fff;">The new account is the whole attack.</h3>
                <p style="font-size:0.85rem; color:#94a3b8; margin:0 0 1rem 0;">
                    A payment change is not approved from inside the email that requested it. Call a number you already had. This docket is a BURN-1 training template — not a Travelers form.
                </p>
            </div>

            ${playing ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
                        <!-- LOOKALIKE INBOX MESSAGE -->
                        <div style="background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:0.75rem; padding:1rem;">
                            <span style="font-size:0.7rem; font-family:'Share Tech Mono', monospace; color:#f59e0b; text-transform:uppercase;">INCOMING VENDOR WIRE REQUEST</span>
                            <div style="margin-top:6px; font-weight:bold; color:#fff;">${kit.exec}, Finance Director</div>
                            <div style="font-family:'Share Tech Mono', monospace; font-size:0.78rem; color:#ef4444;">${kit.fakeEmail}</div>
                            <div style="font-family:'Orbitron', sans-serif; font-size:0.88rem; color:#f59e0b; margin:8px 0 4px 0;">Update ${kit.vendor} before the 3pm cutoff</div>
                            <p style="font-size:0.82rem; color:#cbd5e1; line-height:1.5; margin:0 0 8px 0;">
                                Please release ${kit.amount} to the replacement account ending ${kit.last4}. Our bank changed this morning. I am in executive board meetings — call me only at ${kit.emailPhone} and do not loop in anyone else.
                            </p>
                            <span style="font-size:0.72rem; color:#94a3b8; display:block;">Known official address on file: ${kit.realEmail}</span>
                        </div>

                        <!-- RESPONSE LANE -->
                        <div>
                            ${uiState.wirePhase === 'read' ? `
                                <p style="font-size:0.85rem; color:#e2e8f0; line-height:1.5; margin-bottom:1rem;">
                                    The vendor is real. The amount looks plausible. The phone number in the email is new.
                                </p>
                                <div style="display:flex; flex-direction:column; gap:8px;">
                                    <button type="button" class="mirror-btn mirror-btn-ghost" style="color:#ef4444; border-color:rgba(239,68,68,0.4);" onclick="window.AcademyWidget.setWirePhase('lost')">
                                        💸 Release the Payment Now
                                    </button>
                                    <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.setWirePhase('docket')">
                                        🛑 Hold Payment & Open Callback Docket &rarr;
                                    </button>
                                </div>
                            ` : uiState.wirePhase === 'lost' ? `
                                <div style="background:rgba(239,68,68,0.15); border:1px solid #ef4444; padding:1rem; border-radius:0.75rem; margin-bottom:1rem;">
                                    <h4 style="color:#ef4444; margin:0 0 4px 0; font-family:'Orbitron', sans-serif;">FUNDS DISPATCHED</h4>
                                    <p style="font-size:0.82rem; color:#f1f5f9; margin:0; line-height:1.5;">
                                        In this drill, ${kit.amount} left toward an unverified account. Real wire transfers do not rewind this cleanly — that is the lesson.
                                    </p>
                                </div>
                                <button type="button" class="mirror-btn" onclick="window.AcademyWidget.setWirePhase('read')">
                                    Rewind the Wire Drill
                                </button>
                            ` : `
                                <form onsubmit="event.preventDefault(); window.AcademyWidget.submitWireDocket(this);">
                                    <h4 style="font-family:'Orbitron', sans-serif; font-size:0.85rem; color:#f59e0b; margin:0 0 4px 0;">BURN-1 CALLBACK DOCKET</h4>
                                    <p style="font-size:0.75rem; color:#94a3b8; margin:0 0 10px 0;">Training template only. Not a carrier insurance form.</p>

                                    <div style="margin-bottom:10px;">
                                        <label style="display:block; font-size:0.78rem; font-weight:bold; margin-bottom:4px;">Who do you call to verify?</label>
                                        <div style="display:flex; flex-direction:column; gap:6px;">
                                            <label class="mirror-card" style="padding:8px 10px; cursor:pointer;">
                                                <input type="radio" name="callback" value="office" required style="accent-color:#f59e0b;" />
                                                <span style="font-size:0.78rem; margin-left:6px;">Avery's known office line: ${kit.knownPhone} (On File)</span>
                                            </label>
                                            <label class="mirror-card" style="padding:8px 10px; cursor:pointer;">
                                                <input type="radio" name="callback" value="bank" style="accent-color:#f59e0b;" />
                                                <span style="font-size:0.78rem; margin-left:6px;">Treasury callback already on file: ${kit.bankPhone}</span>
                                            </label>
                                            <label class="mirror-card" style="padding:8px 10px; cursor:pointer; border-color:rgba(239,68,68,0.3);">
                                                <input type="radio" name="callback" value="email" style="accent-color:#ef4444;" />
                                                <span style="font-size:0.78rem; margin-left:6px; color:#ef4444;">Number printed in the email: ${kit.emailPhone}</span>
                                            </label>
                                        </div>
                                    </div>

                                    ${uiState.wireMiss ? `
                                        <div style="background:rgba(239,68,68,0.2); border:1px solid #ef4444; padding:8px; border-radius:6px; font-size:0.78rem; color:#fecaca; margin-bottom:8px;">
                                            ❌ REJECTED: You called the number from the email! The attacker answered and confirmed their own fraud. You must call a number from the signed contract on file.
                                        </div>
                                    ` : ''}

                                    <div style="margin-bottom:10px;">
                                        <label style="display:block; font-size:0.78rem; font-weight:bold; margin-bottom:4px;">Second Approver Name</label>
                                        <input type="text" name="approver" placeholder="e.g. Authorized CFO / Controller" required style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:6px; padding:8px 12px; color:#fff; font-size:0.82rem;" />
                                    </div>

                                    <button type="submit" class="mirror-btn mirror-btn-amber" style="width:100%;">
                                        Sign & Download Callback Docket &rarr;
                                    </button>
                                </form>
                            `}
                        </div>
                    </div>
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">WIRE FREEZE LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#fff; margin:6px 0;">Wire fraud halted.</h3>
                    <p style="font-size:0.85rem; color:#cbd5e1; margin:0 0 1rem 0;">
                        Held payment and verified via ${saved.callbackLabel}. Signed by ${saved.approver}. Callback badge awarded!
                    </p>
                    <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(5)">
                        Proceed to Hard Key &rarr;
                    </button>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 05: HARD KEY (SPLIT VIEW & CHAT REFUSAL)
    // --------------------------------------------------------------------------
    function renderStage5() {
        if (!state.intake) return renderStage1();
        const idp = IDP_META[state.intake.idp] || IDP_META.microsoft;
        const saved = state.key;
        const playing = !saved?.done || uiState.replayKey;

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 5 · Hard Key</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#fff;">The key only helps on a page you opened.</h3>
                <p style="font-size:0.85rem; color:#94a3b8; margin:0 0 1rem 0;">
                    Phishing-resistant MFA fails when someone enrolls the key on a lookalike, or reads a code into chat. No physical key and no real credential is required to finish.
                </p>
            </div>

            ${playing ? `
                <div class="mirror-card" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px; margin-bottom:1.5rem;">
                    <!-- LEFT SCREEN: WORKSTATION TERMINAL -->
                    <div style="background:rgba(0,0,0,0.8); border:1px solid rgba(255,255,255,0.15); border-radius:0.75rem; padding:1rem; font-family:'Share Tech Mono', monospace;">
                        <span style="font-size:0.7rem; color:#38bdf8; text-transform:uppercase; display:block; margin-bottom:6px;">WORKSTATION TERMINAL // BROWSER BAR</span>
                        
                        ${uiState.keyPhase === 'choose' || uiState.keyPhase === 'fake' ? `
                            <div style="background:#090d16; border:1px solid #1e293b; padding:8px 12px; border-radius:6px; font-size:0.8rem; color:#94a3b8; margin-bottom:10px;">
                                ${uiState.keyPhase === 'fake' ? `<span style="color:#ef4444;">${idp.fake}</span>` : 'about:blank'}
                            </div>
                            <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.5;">${idp.realHint}</p>
                            ${uiState.keyPhase === 'fake' ? `
                                <div style="background:rgba(239,68,68,0.2); border:1px solid #ef4444; padding:8px; border-radius:6px; font-size:0.78rem; color:#fee2e2; margin-top:8px;">
                                    Wrong door! A key enrolled on a lookalike link belongs to the attacker. Close it.
                                </div>
                            ` : ''}
                        ` : uiState.keyPhase === 'insert' ? `
                            <div style="text-align:center; padding:1.5rem 0;">
                                <div style="font-size:2.5rem; margin-bottom:8px;">🔑</div>
                                <p style="font-size:0.82rem; color:#cbd5e1; margin-bottom:12px;">Seat the simulated security key. Nothing is plugged into this phone.</p>
                                <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.setKeyPhase('touch')">
                                    Seat Simulated Key
                                </button>
                            </div>
                        ` : `
                            <div style="text-align:center; padding:1.5rem 0;">
                                <div style="font-size:2.5rem; margin-bottom:8px; color:#10b981;">🛡️</div>
                                <p style="font-size:0.82rem; color:#10b981; font-weight:bold; margin-bottom:6px;">Key Presence Confirmed.</p>
                                <p style="font-size:0.78rem; color:#94a3b8; margin-bottom:12px;">The page you typed is waiting. Chat is not the page.</p>
                                ${uiState.keyPhase === 'touch' ? `
                                    <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.setKeyPhase('chat')">
                                        Touch the Key Disc &rarr;
                                    </button>
                                ` : ''}
                            </div>
                        `}
                    </div>

                    <!-- RIGHT SCREEN: FLOOR CHAT -->
                    <div style="background:rgba(18,14,30,0.85); border:1px solid rgba(255,255,255,0.12); border-radius:0.75rem; padding:1rem;">
                        <span style="font-size:0.7rem; font-family:'Share Tech Mono', monospace; color:#a855f7; text-transform:uppercase; display:block; margin-bottom:8px;">FLOOR CHAT MESSAGE</span>
                        
                        <div class="chat-bubble" style="margin-bottom:12px;">
                            <span class="chat-bubble-sender">IT Onboarding Specialist</span>
                            Need your key on file today. Use this setup link so I can finish it for you: <span style="color:#ef4444; word-break:break-all;">${idp.fake}</span>
                        </div>

                        ${uiState.keyPhase === 'choose' ? `
                            <div style="display:flex; flex-direction:column; gap:8px;">
                                <button type="button" class="mirror-btn mirror-btn-ghost" style="color:#ef4444;" onclick="window.AcademyWidget.setKeyPhase('fake')">
                                    Open their link
                                </button>
                                <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.setKeyPhase('insert')">
                                    I will type the portal myself &rarr;
                                </button>
                            </div>
                        ` : uiState.keyPhase === 'chat' ? `
                            <div class="chat-bubble" style="margin-bottom:12px; border-color:#a855f7;">
                                <span class="chat-bubble-sender">IT Onboarding Specialist</span>
                                Touch registered. Text me the 6-digit backup code and a photo of the key so I can store it in the vault.
                            </div>

                            ${uiState.keyBounced ? `
                                <div style="background:rgba(239,68,68,0.2); border:1px solid #ef4444; padding:8px; border-radius:6px; font-size:0.75rem; color:#fee2e2; margin-bottom:8px;">
                                    ⚠️ Never send codes or key photos! A real admin can see enrollment from their own console.
                                </div>
                            ` : ''}

                            <div style="display:flex; flex-direction:column; gap:8px;">
                                <button type="button" class="mirror-btn mirror-btn-ghost" style="color:#ef4444;" onclick="window.AcademyWidget.bounceKey()">
                                    Send the code in chat
                                </button>
                                <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.finishKey(false)">
                                    No. I finish it on the page I opened.
                                </button>
                                <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.finishKey(true)">
                                    No codes. Where is the spare key if I lose this one?
                                </button>
                            </div>
                        ` : `
                            <p style="font-size:0.8rem; color:#94a3b8;">The chat waits until the key is seated on the authentic page.</p>
                        `}
                    </div>
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">HARD KEY LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#fff; margin:6px 0;">
                        ${saved.askedSpare ? 'Key and spare accounted for.' : 'Key held.'}
                    </h3>
                    <p style="font-size:0.85rem; color:#cbd5e1; margin:0 0 1rem 0;">
                        You typed the portal yourself and refused to share codes in chat. Key Discipline badge unlocked!
                    </p>
                    <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(6)">
                        Proceed to Object Lock &rarr;
                    </button>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 06: OBJECT LOCK (RETENTION & REWRITE DENIAL)
    // --------------------------------------------------------------------------
    function renderStage6() {
        if (!state.intake) return renderStage1();
        const saved = state.lock;
        const playing = !saved?.done || uiState.replayLock;

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 6 · Object Lock</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#fff;">A delete right is not a lock.</h3>
                <p style="font-size:0.85rem; color:#94a3b8; margin:0 0 1rem 0;">
                    Pick what a rewrite is not allowed to touch, for how long. The denial you see is an illustration. This does not configure Amazon S3 or any other account.
                </p>
            </div>

            ${playing ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    <div style="display:grid; gap:8px; margin-bottom:1rem;">
                        ${LOCK_OBJECTS.map(obj => {
                            const on = uiState.lockLocked.includes(obj.id);
                            const dead = uiState.lockStruck && !on;
                            return `
                                <button type="button" class="mirror-card" style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; cursor:pointer; ${dead ? 'opacity:0.4; text-decoration:line-through;' : on ? 'border-color:#f59e0b;' : ''}" onclick="window.AcademyWidget.toggleLockObject('${obj.id}')">
                                    <div style="text-align:left;">
                                        <strong style="color:#fff; font-size:0.88rem; display:block;">${obj.name}</strong>
                                        <span style="font-size:0.75rem; color:#94a3b8;">${obj.blurb}</span>
                                    </div>
                                    <span class="mirror-pill" style="font-size:0.68rem; ${on ? 'background:#f59e0b; color:#000;' : ''}">
                                        ${uiState.lockStruck ? (on ? 'WRITE DENIED' : 'REWRITTEN') : (on ? 'LOCKED' : 'OPEN')}
                                    </span>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <div style="margin-bottom:1rem;">
                        <span style="font-size:0.78rem; font-weight:bold; color:#e2e8f0; display:block; margin-bottom:6px;">Retention Duration</span>
                        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
                            ${[7, 30, 90, 365].map(d => `
                                <button type="button" class="mirror-btn ${uiState.lockDays === d ? 'mirror-btn-amber' : 'mirror-btn-ghost'}" style="padding:8px 0;" onclick="window.AcademyWidget.setLockDays(${d})">
                                    ${d}d
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:1rem;">
                        <button type="button" class="mirror-card" style="text-align:left; cursor:pointer; ${uiState.lockMode === 'governance' ? 'border-color:#f59e0b; background:rgba(245,158,11,0.1);' : ''}" onclick="window.AcademyWidget.setLockMode('governance')">
                            <strong style="color:#fff; font-size:0.85rem; display:block;">Governance Mode</strong>
                            <span style="font-size:0.72rem; color:#94a3b8;">Privileged users may shorten lock. Easier to undo by mistake.</span>
                        </button>
                        <button type="button" class="mirror-card" style="text-align:left; cursor:pointer; ${uiState.lockMode === 'compliance' ? 'border-color:#f59e0b; background:rgba(245,158,11,0.1);' : ''}" onclick="window.AcademyWidget.setLockMode('compliance')">
                            <strong style="color:#fff; font-size:0.85rem; display:block;">Compliance Mode</strong>
                            <span style="font-size:0.72rem; color:#94a3b8;">Nobody shortens it until clock runs out, including admin.</span>
                        </button>
                    </div>

                    <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.8rem; color:#cbd5e1; margin-bottom:1rem; cursor:pointer;">
                        <input type="checkbox" ${uiState.lockUnderstood ? 'checked' : ''} onchange="window.AcademyWidget.setLockUnderstood(this.checked)" style="margin-top:2px; accent-color:#f59e0b;" />
                        <span>I understand this widget demonstrates a concept. It does not configure AWS S3, change cloud permissions, or prove a backup exists.</span>
                    </label>

                    ${!uiState.lockStruck ? `
                        <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%;" ${!uiState.lockUnderstood || uiState.lockLocked.length === 0 ? 'disabled' : ''} onclick="window.AcademyWidget.strikeLock()">
                            Simulate the Rewrite Denial &rarr;
                        </button>
                    ` : `
                        <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%;" onclick="window.AcademyWidget.saveLockRun()">
                            Log the Simulation &rarr;
                        </button>
                    `}
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">OBJECT LOCK LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#fff; margin:6px 0;">Retention principles recorded.</h3>
                    <p style="font-size:0.85rem; color:#cbd5e1; margin:0 0 1rem 0;">
                        ${saved.days} days · ${saved.mode} · ${saved.lockedIds.join(', ')}. Locksmith badge awarded!
                    </p>
                    <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(7)">
                        Proceed to Binder Drop &rarr;
                    </button>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 07: BINDER DROP (EVIDENCE SORTING)
    // --------------------------------------------------------------------------
    function renderStage7() {
        if (!state.intake) return renderStage1();
        const saved = state.binder;
        const playing = !saved?.done || uiState.replayBinder;
        const remaining = BINDER_ARTIFACTS.filter(item => !uiState.binderPlaced[item.id]);

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 7 · Binder Drop</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#fff;">A video is not a control.</h3>
                <p style="font-size:0.85rem; color:#94a3b8; margin:0 0 1rem 0;">
                    Match each fictional record to the request it actually answers — or throw it out. Training completion, a supplied draft, a review, and an independent check are not the same sentence.
                </p>
            </div>

            ${playing ? `
                <div class="mirror-card" style="margin-bottom:1.5rem;">
                    <p style="font-size:0.8rem; color:#94a3b8; margin-bottom:8px;">
                        Tap a record below, then tap the corresponding request slot or "Not Evidence" reject pile:
                    </p>

                    <!-- REMAINING ARTIFACTS PILE -->
                    <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:1rem;">
                        ${remaining.map(item => `
                            <button type="button" class="mirror-btn mirror-btn-ghost" style="padding:6px 12px; font-size:0.75rem; ${uiState.binderSelected === item.id ? 'border-color:#f59e0b; background:rgba(245,158,11,0.2);' : ''}" onclick="window.AcademyWidget.selectBinderItem('${item.id}')">
                                ${item.title}
                            </button>
                        `).join('')}
                        ${remaining.length === 0 ? '<span style="font-size:0.8rem; color:#10b981;">✓ All records sorted into slots!</span>' : ''}
                    </div>

                    <!-- SLOTS -->
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:8px; margin-bottom:1rem;">
                        ${BINDER_SLOTS.map(slot => {
                            const filled = BINDER_ARTIFACTS.filter(item => uiState.binderPlaced[item.id] === slot.id);
                            return `
                                <button type="button" class="mirror-card" style="text-align:left; cursor:pointer; padding:10px;" onclick="window.AcademyWidget.assignBinderSlot('${slot.id}')">
                                    <strong style="color:#fff; font-size:0.85rem; display:block;">${slot.title}</strong>
                                    <span style="font-size:0.72rem; color:#94a3b8; display:block; margin-bottom:4px;">${slot.detail}</span>
                                    ${filled.map(f => `<span style="display:inline-block; font-size:0.72rem; color:#f59e0b; background:rgba(245,158,11,0.1); padding:2px 6px; border-radius:4px; margin-top:2px;">${f.title}</span>`).join('')}
                                </button>
                            `;
                        }).join('')}
                        <button type="button" class="mirror-card" style="text-align:left; cursor:pointer; padding:10px; border-color:rgba(239,68,68,0.4);" onclick="window.AcademyWidget.assignBinderSlot('reject')">
                            <strong style="color:#ef4444; font-size:0.85rem; display:block;">🗑️ Not Evidence Pile</strong>
                            <span style="font-size:0.72rem; color:#94a3b8; display:block; margin-bottom:4px;">Training trivia, old screenshots, moods, job success emails.</span>
                            ${BINDER_ARTIFACTS.filter(item => uiState.binderPlaced[item.id] === 'reject').map(f => `<span style="display:inline-block; font-size:0.72rem; color:#ef4444; background:rgba(239,68,68,0.1); padding:2px 6px; border-radius:4px; margin-top:2px;">${f.title}</span>`).join('')}
                        </button>
                    </div>

                    <div style="display:flex; gap:10px;">
                        <button type="button" class="mirror-btn mirror-btn-amber" ${remaining.length > 0 ? 'disabled' : ''} onclick="window.AcademyWidget.logBinderSort()">
                            Log the Sort &rarr;
                        </button>
                        <button type="button" class="mirror-btn mirror-btn-ghost" onclick="window.AcademyWidget.clearBinderPiles()">
                            Clear Piles
                        </button>
                    </div>
                </div>
            ` : saved ? `
                <div class="mirror-card">
                    <span class="mirror-pill" style="margin-bottom:6px;">BINDER SORT LOGGED</span>
                    <h3 style="font-family:'Orbitron', sans-serif; font-size:1.2rem; color:#fff; margin:6px 0;">Piles separated.</h3>
                    <p style="font-size:0.85rem; color:#cbd5e1; margin:0 0 1rem 0;">
                        ${saved.correct} of ${saved.total} accurately classified. You did not promote a training video or casual Slack chat into audited evidence. Binder Clerk badge awarded!
                    </p>
                    <button type="button" class="mirror-btn mirror-btn-amber" onclick="window.AcademyWidget.goStage(8)">
                        Proceed to The Desk (Final Seal) &rarr;
                    </button>
                </div>
            ` : ''}
        `;
    }

    // --------------------------------------------------------------------------
    // STAGE 08: THE DESK (EVIDENCE MANIFEST & LOCAL SHA-256 SEAL)
    // --------------------------------------------------------------------------
    function renderStage8() {
        if (!state.intake) return renderStage1();
        const xp = totalXp(state);
        const earned = badges(state);
        const missions = state.intake && state.fish?.done && state.vault?.done && state.wire?.done && state.key?.done && state.lock?.done && state.binder?.done;
        const ownersNamed = state.rows.every(r => r.owner && r.owner.trim().length > 1);
        const canSeal = Boolean(missions && ownersNamed && state.ackTraining && state.ackHuman && !state.seal);
        const company = state.intake?.company || 'Your Company';

        return `
            ${renderHeader()}
            <div style="margin-bottom:1rem;">
                <span class="mirror-pill" style="margin-bottom:6px;">Stage 8 · The Desk</span>
                <h3 style="font-family:'Orbitron', sans-serif; font-size:1.3rem; margin:6px 0; color:#fff;">Training on one side. Evidence on the other.</h3>
                <p style="font-size:0.85rem; color:#94a3b8; margin:0 0 1rem 0;">
                    The checklist is the product. A seal records this manifest on this device after you confirm, out loud in the two boxes, what it is not.
                </p>
            </div>

            <div class="mirror-card" style="margin-bottom:1.5rem;">
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:1.25rem; text-align:center;">
                    <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:8px;">
                        <span style="font-size:0.7rem; color:#94a3b8; text-transform:uppercase;">TOTAL XP</span>
                        <strong style="display:block; font-family:'Orbitron', sans-serif; font-size:1.3rem; color:#f59e0b;">${xp}</strong>
                    </div>
                    <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:8px;">
                        <span style="font-size:0.7rem; color:#94a3b8; text-transform:uppercase;">MISSIONS</span>
                        <strong style="display:block; font-family:'Orbitron', sans-serif; font-size:1.1rem; color:#fff;">${missions ? '8 OF 8' : 'STILL OPEN'}</strong>
                    </div>
                    <div style="background:rgba(0,0,0,0.5); padding:10px; border-radius:8px;">
                        <span style="font-size:0.7rem; color:#94a3b8; text-transform:uppercase;">BADGES</span>
                        <strong style="display:block; font-family:'Orbitron', sans-serif; font-size:1.3rem; color:#a855f7;">${earned.length}</strong>
                    </div>
                </div>

                <!-- BADGES SHOWCASE -->
                ${earned.length ? `
                    <div style="margin-bottom:1.25rem;">
                        <span style="font-size:0.75rem; font-family:'Share Tech Mono', monospace; color:#f59e0b; display:block; margin-bottom:6px; text-transform:uppercase;">
                            EARNED CREDENTIAL BADGES
                        </span>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:6px;">
                            ${earned.map(b => `
                                <div style="padding:6px 10px; background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.3); border-radius:6px; font-size:0.75rem;">
                                    <strong style="color:#f59e0b;">${b.name}:</strong> <span style="color:#cbd5e1;">${b.detail}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- EVIDENCE MANIFEST TABLE -->
                <div style="margin-bottom:1.25rem;">
                    <span style="font-size:0.75rem; font-family:'Share Tech Mono', monospace; color:#38bdf8; display:block; margin-bottom:6px; text-transform:uppercase;">
                        OPERATIONAL EVIDENCE MANIFEST (ASSIGN OWNERS)
                    </span>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${state.rows.map(row => `
                            <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                    <strong style="color:#fff; font-size:0.82rem;">Stage ${row.stage} · ${row.control}</strong>
                                    <select style="background:#090d16; border:1px solid rgba(255,255,255,0.2); color:#f59e0b; font-size:0.75rem; border-radius:4px; padding:2px 6px;" onchange="window.AcademyWidget.updateRowStatus('${row.id}', this.value)">
                                        <option value="missing" ${row.status === 'missing' ? 'selected' : ''}>Missing</option>
                                        <option value="training" ${row.status === 'training' ? 'selected' : ''}>Training Done</option>
                                        <option value="supplied" ${row.status === 'supplied' ? 'selected' : ''}>Draft Supplied</option>
                                        <option value="reviewed" ${row.status === 'reviewed' ? 'selected' : ''}>Team Reviewed</option>
                                        <option value="verified" ${row.status === 'verified' ? 'selected' : ''}>Independently Verified</option>
                                    </select>
                                </div>
                                <p style="font-size:0.78rem; color:#cbd5e1; margin:0 0 6px 0;">${row.request}</p>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                                    <input type="text" placeholder="Owner (name, not shared inbox)" value="${row.owner}" style="background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; font-size:0.75rem; padding:4px 8px; border-radius:4px;" onchange="window.AcademyWidget.updateRowOwner('${row.id}', this.value)" />
                                    <input type="date" value="${row.reviewDate}" style="background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; font-size:0.75rem; padding:4px 8px; border-radius:4px;" onchange="window.AcademyWidget.updateRowDate('${row.id}', this.value)" />
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- LEGAL ACKNOWLEDGMENT CHECKBOXES -->
                <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:12px; margin-bottom:1.25rem;">
                    <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.78rem; color:#cbd5e1; margin-bottom:8px; cursor:pointer;">
                        <input type="checkbox" ${state.ackTraining ? 'checked' : ''} onchange="window.AcademyWidget.setAck('ackTraining', this.checked)" style="margin-top:2px; accent-color:#f59e0b;" />
                        <span>This seal is a BURN-1 training record. It is not an insurance determination, a compliance certification, or proof that a control works in production.</span>
                    </label>
                    <label style="display:flex; align-items:flex-start; gap:8px; font-size:0.78rem; color:#cbd5e1; cursor:pointer;">
                        <input type="checkbox" ${state.ackHuman ? 'checked' : ''} onchange="window.AcademyWidget.setAck('ackHuman', this.checked)" style="margin-top:2px; accent-color:#f59e0b;" />
                        <span>A human reviews this before anyone treats it as evidence for a carrier, an auditor, or the Metro Plaza Directory. The directory is not updated from this page.</span>
                    </label>
                </div>

                ${!ownersNamed ? `<p style="font-size:0.78rem; color:#f59e0b; margin-bottom:8px;">⚠️ Name an owner on every row above before sealing.</p>` : ''}

                <button type="button" class="mirror-btn mirror-btn-amber" style="width:100%; margin-bottom:1rem;" ${!canSeal ? 'disabled' : ''} onclick="window.AcademyWidget.commitManifestSeal()">
                    ${state.seal ? '✓ Training Seal Minted on this Device' : 'Seal this Training Record & Mint Hash'}
                </button>

                <!-- SEAL DISPLAY IF GENERATED -->
                ${state.seal ? `
                    <div style="background:rgba(245,158,11,0.08); border:1px solid #f59e0b; border-radius:8px; padding:1rem; margin-bottom:1.25rem;">
                        <span class="mirror-pill" style="margin-bottom:6px;">SHA-256 SEAL ISSUED FOR ${company}</span>
                        <div style="font-family:'Share Tech Mono', monospace; font-size:0.75rem; color:#f59e0b; word-break:break-all; margin:6px 0;">
                            [SHA-256 HASH]: ${state.seal.hash}
                        </div>
                        <span style="font-size:0.72rem; color:#94a3b8; display:block;">Sealed: ${state.seal.at} · Not Published to Directory</span>
                        <p style="font-size:0.78rem; color:#cbd5e1; line-height:1.45; margin:8px 0 0 0;">
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
                <div style="border-top:1px solid rgba(255,255,255,0.12); padding-top:1.25rem;">
                    <h4 style="font-family:'Orbitron', sans-serif; font-size:0.95rem; color:#fff; margin:0 0 6px 0;">Evidence Workspace & Surface Inspection</h4>
                    <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.5; margin:0 0 10px 0;">
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
                    <span style="font-size:0.72rem; color:#94a3b8; display:block;">
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

        // Stage 4 Actions
        setWirePhase: function(p) {
            uiState.wirePhase = p;
            this.render();
        },

        submitWireDocket: function(form) {
            const formData = new FormData(form);
            const cb = formData.get('callback');
            const approver = (formData.get('approver') || '').toString().trim();
            const kit = wireKit(state.intake);

            if (cb === 'email') {
                uiState.wireMiss = true;
                this.render();
                return;
            }

            uiState.wireMiss = false;
            const label = cb === 'office' ? `Known office ${kit.knownPhone}` : `Bank callback ${kit.bankPhone}`;
            const xp = approver.length > 1 ? 150 : 80;

            state.wire = {
                done: true,
                xp,
                held: true,
                usedEmailPhone: false,
                approver,
                callbackLabel: label
            };

            const docketDoc = `BURN-1 TRAINING DOCKET // OUT-OF-BAND PAYMENT CHANGE
RECORD ID: WIRE-${Math.floor(100000 + Math.random() * 900000)}
Company: ${state.intake.company}
Vendor: ${kit.vendor}
Amount: ${kit.amount}
Callback Line: ${label}
Authorized Signer: ${approver}
Date: ${new Date().toISOString()}

NOTICE: This is a BURN-1 training template. It is not an official carrier form.
Do not submit this docket as an underwriter certificate.
`;
            downloadFile(`BURN-1-wire-docket-${companySlug(state.intake.company)}.txt`, docketDoc);
            uiState.replayWire = false;
            persistState();
            this.render();
        },

        // Stage 5 Actions
        setKeyPhase: function(p) {
            uiState.keyPhase = p;
            this.render();
        },

        bounceKey: function() {
            uiState.keyBounced = true;
            this.render();
        },

        finishKey: function(askedSpare) {
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

        clearBinderPiles: function() {
            uiState.binderPlaced = {};
            uiState.binderSelected = null;
            this.render();
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
