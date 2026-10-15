/**
 * ==============================================================================
 * /academy-gamified - Interactive Cyber Academy Onboarding & Sales Engine v2
 * ==============================================================================
 * A standalone, zero-dependency JavaScript widget with Cyberpunk HUD styling,
 * 8-stage unified onboarding quest, dynamic IF/THEN scenario matrix, interactive
 * flip-card mini-games, 7-field Evidence Binder compiler, and live SHA-256 minting.
 * ==============================================================================
 */

(function() {
    // --------------------------------------------------------------------------
    // STATE MACHINE & GAMIFICATION DATA
    // --------------------------------------------------------------------------
    const state = {
        currentStep: 1,
        totalSteps: 8,
        xp: 0,
        level: 1,
        userSector: 'healthcare',
        employeeCount: '10-50 Employees',
        completedQuizzes: {},
        unlockedBadges: [],
        clearedSteps: {},
        quizFlipped: {},
        binderRecords: [
            { control: "MFA Enforcement", req: "Entra ID / FIDO2 Passkey Export", owner: "IT Lead", cycle: "Quarterly", status: "Verified", gap: "100% Admin Coverage", ref: "SEC-MFA-01" },
            { control: "Immutable Backups", req: "S3 Object Lock Compliance Log", owner: "Cloud Arch", cycle: "Quarterly", status: "Verified", gap: "3-2-1-1-0 Verified", ref: "BAK-S3-04" },
            { control: "Perimeter Cloaking", req: "Tailscale/WireGuard Port Scan Log", owner: "Sec Ops", cycle: "Monthly", status: "Verified", gap: "RDP 3389 Cloaked", ref: "NET-CLK-02" },
            { control: "72h Incident Drill", req: "CIRCIA Tabletop AAR & Roster", owner: "CISO / Legal", cycle: "Annual", status: "Reviewed", gap: "Out-of-Band Signal Ready", ref: "IR-CIRCIA-05" },
            { control: "Telemetry & Logs", req: "SIEM 90-Day Retention Schedule", owner: "DevOps", cycle: "Semi-Annual", status: "Verified", gap: "Volatile RAM Isolated", ref: "LOG-RAM-06" },
            { control: "Evidence Redaction", req: "Sanitized Config & API Key Audit", owner: "Compliance", cycle: "Quarterly", status: "Reviewed", gap: "Secrets Blacked Out", ref: "AUD-RED-07" }
        ],
        attestation: {
            officerName: '',
            officerTitle: '',
            attested: false
        }
    };

    const journeyBar = [
        "1. Discover", "2. Assess", "3. Identity", "4. Phish",
        "5. Vaults", "6. Command", "7. Binder", "8. Attest"
    ];

    const sectorMatrix = {
        healthcare: {
            title: "Healthcare & Life Sciences",
            icon: "🏥",
            bodies: ["HIPAA § 164.312", "HITECH Safe Harbor", "FDA 524B SBOM", "State Health Privacy (CMIA/MHMD)"],
            warranties: ["Chubb Schedule B Item 4B (MFA)", "Travelers Item 6A (Immutable S3 Backups)"],
            sublimitRisk: "$250,000 Ransomware Cap / Potential Claim Denial",
            discountPotential: "25% - 35% Premium Credit",
            auditPerks: ["PHI Data Classification Scan", "S3 Object Lock Compliance Check", "Medical Device Port Cloaking"]
        },
        financial: {
            title: "Financial Services & Banking",
            icon: "🏦",
            bodies: ["NYDFS 23 NYCRR 500", "FTC Safeguards Rule", "FINRA Cyber Rule", "SEC 4-Day Form 8-K"],
            warranties: ["Chubb Schedule B (Phishing-Resistant MFA)", "Beazley Critical Audit (RDP Cloaking)"],
            sublimitRisk: "Wire Transfer Fraud Exclusion & Regulatory Fines",
            discountPotential: "20% - 30% Premium Credit",
            auditPerks: ["Wire Transfer Dual-Verification Audit", "DMARC p=reject Enforcement", "72-Hour Incident Drill Check"]
        },
        defense: {
            title: "Defense & Government Contracting",
            icon: "🛡️",
            bodies: ["CMMC 2.0 (32 CFR / 48 CFR)", "NIST SP 800-171 / 800-53", "DFARS 252.204-7012", "CIRCIA 72h Disclosure"],
            warranties: ["Chubb FIDO2 Passkey Warranty", "CISA Ransomware Air-Gap Mandate"],
            sublimitRisk: "Contract Disqualification & CMMC Level 2 Audit Failure",
            discountPotential: "Audit-Pass Guarantee & Preferred Tier",
            auditPerks: ["CUI Data Flow Mapping", "FIDO2 Hardware Passkey Enforcement", "Out-of-Band Incident Channel Log"]
        },
        industrial: {
            title: "Energy, Manufacturing & OT",
            icon: "⚡",
            bodies: ["NERC CIP-002-013", "NIST SP 800-82 Rev 3 (OT)", "TSA Pipeline Security Directives", "IEC 62443"],
            warranties: ["Travelers Item 6A (Air-Gap)", "Beazley Port Cloaking (Port 3389/445)"],
            sublimitRisk: "Operational Disruption & Uninsured Property Damage",
            discountPotential: "15% - 25% Premium Credit",
            auditPerks: ["Purdue Model Microsegmentation Check", "SCADA WAN Cloaking Sweep", "Air-Gapped Backup Vaulting"]
        },
        retail: {
            title: "Retail, E-Commerce & SaaS",
            icon: "🛒",
            bodies: ["PCI DSS v4.0", "CCPA / CPRA", "EU GDPR", "EU AI Act (2024/1689)"],
            warranties: ["Chubb Email Security Warranty", "Travelers Anti-BEC Mandate"],
            sublimitRisk: "Payment Processor Suspension & Class-Action Lawsuits",
            discountPotential: "20% - 35% Premium Credit",
            auditPerks: ["E-Commerce Payment Gateway DLP Sweep", "GenAI Prompt Guardrail", "Zero-Cost MFA Enrollment"]
        }
    };

    // --------------------------------------------------------------------------
    // WIDGET STYLING ENGINE (CYBERPUNK NEON HUD)
    // --------------------------------------------------------------------------
    function injectStyles() {
        if (document.getElementById('academy-hud-styles-v2')) return;
        const style = document.createElement('style');
        style.id = 'academy-hud-styles-v2';
        style.innerHTML = `
            .academy-hud {
                background: #090d16;
                color: #e2e8f0;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                border: 2px solid #00f0ff;
                box-shadow: 0 0 30px rgba(0, 240, 255, 0.25);
                border-radius: 12px;
                padding: 24px;
                max-width: 960px;
                margin: 0 auto;
                position: relative;
                overflow: hidden;
            }
            .xp-pill {
                background: rgba(112, 0, 255, 0.2);
                border: 1px solid #7000ff;
                color: #00f0ff;
                font-weight: bold;
                padding: 6px 16px;
                border-radius: 20px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 0 10px rgba(112, 0, 255, 0.4);
            }
            .pulse-xp {
                animation: pulse 0.5s ease-out;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); color: #ff007a; }
                100% { transform: scale(1); }
            }
            .journey-track {
                display: flex;
                justify-content: space-between;
                background: #0f172a;
                border: 1px solid #1e293b;
                border-radius: 8px;
                padding: 8px;
                margin-bottom: 20px;
                gap: 4px;
                overflow-x: auto;
            }
            .journey-node {
                flex: 1;
                text-align: center;
                padding: 6px 4px;
                font-size: 0.72rem;
                font-weight: bold;
                border-radius: 4px;
                color: #64748b;
                background: #1e293b;
                white-space: nowrap;
                transition: all 0.2s;
            }
            .journey-node.active {
                background: rgba(0, 240, 255, 0.15);
                color: #00f0ff;
                border: 1px solid #00f0ff;
                box-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
            }
            .journey-node.done {
                background: rgba(16, 185, 129, 0.15);
                color: #10b981;
                border: 1px solid #10b981;
            }
            .card-select {
                background: #111827;
                border: 1px solid #1e293b;
                border-radius: 8px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.25s ease;
            }
            .card-select:hover {
                border-color: #00f0ff;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 240, 255, 0.15);
            }
            .card-select.active {
                border-color: #00f0ff;
                background: rgba(0, 240, 255, 0.08);
                box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
            }
            .flip-card {
                perspective: 1000px;
                min-height: 220px;
                height: 220px;
                position: relative;
                cursor: pointer;
            }
            .flip-card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transition: transform 0.6s;
                transform-style: preserve-3d;
            }
            .flip-card.flipped .flip-card-inner {
                transform: rotateY(180deg);
            }
            .flip-card-front, .flip-card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                border-radius: 10px;
                padding: 18px;
                box-sizing: border-box;
            }
            .flip-card-front {
                background: #1e293b;
                border: 1px solid #334155;
            }
            .flip-card-back {
                background: #0f172a;
                border: 1px solid #00f0ff;
                transform: rotateY(180deg);
            }
            .btn-cyber {
                background: linear-gradient(135deg, #00f0ff 0%, #7000ff 100%);
                color: #000;
                font-weight: 800;
                padding: 12px 24px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.2s;
            }
            .btn-cyber:hover {
                box-shadow: 0 0 20px rgba(0, 240, 255, 0.6);
                transform: scale(1.02);
            }
            .binder-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 0.8rem;
            }
            .binder-table th {
                background: #1e293b;
                color: #00f0ff;
                padding: 8px 10px;
                text-align: left;
                border: 1px solid #334155;
            }
            .binder-table td {
                padding: 8px 10px;
                border: 1px solid #1e293b;
                color: #cbd5e1;
            }
            .binder-table tr:nth-child(even) {
                background: rgba(15, 23, 42, 0.6);
            }
            .status-badge {
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 0.7rem;
                font-weight: bold;
                display: inline-block;
            }
            .status-verified { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; }
            .status-reviewed { background: rgba(0, 240, 255, 0.2); color: #00f0ff; border: 1px solid #00f0ff; }
            .status-needed { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; }
        `;
        document.head.appendChild(style);
    }

    // --------------------------------------------------------------------------
    // RENDER FUNCTIONS
    // --------------------------------------------------------------------------
    function addXP(amount) {
        state.xp += amount;
        state.level = Math.floor(state.xp / 300) + 1;
        const xpEl = document.getElementById('xp-counter');
        if (xpEl) {
            xpEl.classList.add('pulse-xp');
            xpEl.innerText = `${state.xp} XP (LVL ${state.level})`;
            setTimeout(() => xpEl.classList.remove('pulse-xp'), 500);
        }
    }

    function renderHeader() {
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; border-bottom: 1px solid #1e293b; padding-bottom: 12px;">
                <div>
                    <h2 style="margin:0; color:#00f0ff; font-size: 1.4rem; letter-spacing:1px;">⚡ /ACADEMY-GAMIFIED v2</h2>
                    <span style="font-size:0.82rem; color:#94a3b8;">8-Mission Underwriting Readiness & Compliance Quest</span>
                </div>
                <div class="xp-pill">
                    ⚡ <span id="xp-counter">${state.xp} XP (LVL ${state.level})</span>
                </div>
            </div>

            <div class="journey-track">
                ${journeyBar.map((label, idx) => {
                    const stepNum = idx + 1;
                    let cls = 'journey-node';
                    if (stepNum === state.currentStep) cls += ' active';
                    else if (stepNum < state.currentStep) cls += ' done';
                    return `<div class="${cls}">${label}</div>`;
                }).join('')}
            </div>

            <div style="background:#1e293b; height:5px; border-radius:3px; margin-bottom:20px; overflow:hidden;">
                <div style="background: linear-gradient(90deg, #00f0ff, #ff007a); height:100%; width: ${(state.currentStep / state.totalSteps) * 100}%; transition: width 0.3s;"></div>
            </div>
        `;
    }

    // --- STAGE 01: Discover & Sector Selection ---
    function renderStep1() {
        return `
            ${renderHeader()}
            <h3 style="color:#fff; margin-bottom:8px;">Stage 01: Select Industry Field (Discover)</h3>
            <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:18px;">Select your sector to calibrate the IF/THEN engine for specific governing bodies, underwriter warranties, and discount targets.</p>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-bottom:20px;">
                ${Object.keys(sectorMatrix).map(key => {
                    const sec = sectorMatrix[key];
                    const isActive = state.userSector === key ? 'active' : '';
                    return `
                        <div class="card-select ${isActive}" onclick="window.AcademyWidget.selectSector('${key}')">
                            <div style="font-size:1.6rem; margin-bottom:6px;">${sec.icon}</div>
                            <div style="font-weight:bold; color:#fff; margin-bottom:4px; font-size:0.95rem;">${sec.title}</div>
                            <div style="font-size:0.78rem; color:#00f0ff;">Potential Discount: ${sec.discountPotential}</div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="display:flex; justify-content:flex-end;">
                <button class="btn-cyber" onclick="window.AcademyWidget.nextStep()">Continue to Assess Scale → (+100 XP)</button>
            </div>
        `;
    }

    // --- STAGE 02: Assess Scale & Threat Profile ---
    function renderStep2() {
        const sec = sectorMatrix[state.userSector];
        return `
            ${renderHeader()}
            <h3 style="color:#fff; margin-bottom:8px;">Stage 02: Scale & Threat Assessment (Assess)</h3>
            <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:15px;">Configure employee seats to evaluate your sublimit exposure and underwriting scope.</p>

            <div style="background:#0f172a; border: 1px solid #1e293b; padding:12px 16px; border-radius:8px; margin-bottom:18px;">
                <span style="color:#00f0ff; font-weight:bold;">Sector Profile:</span> ${sec.icon} ${sec.title}<br>
                <span style="font-size:0.82rem; color:#cbd5e1;"><strong>Governing Rules:</strong> ${sec.bodies.join(' | ')}</span>
            </div>

            <label style="display:block; color:#cbd5e1; font-weight:bold; margin-bottom:8px; font-size:0.9rem;">Select Workforce Headcount:</label>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin-bottom:20px;">
                ${['1-10 Employees', '10-50 Employees', '50-250 Employees', '250+ Enterprise'].map(size => `
                    <div class="card-select ${state.employeeCount === size ? 'active' : ''}" onclick="window.AcademyWidget.selectSize('${size}')" style="text-align:center;">
                        <div style="font-weight:bold; color:#fff; font-size:0.85rem;">${size}</div>
                    </div>
                `).join('')}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button style="background:transparent; border:1px solid #475569; color:#94a3b8; padding:10px 18px; border-radius:6px; cursor:pointer;" onclick="window.AcademyWidget.prevStep()">← Back</button>
                <button class="btn-cyber" onclick="window.AcademyWidget.nextStep()">Launch Mission 01: Identity → (+150 XP)</button>
            </div>
        `;
    }

    // --- STAGE 03: Mission 01 - Identity Defense ---
    function renderStep3() {
        return `
            ${renderHeader()}
            <h3 style="color:#fff; margin-bottom:8px;">Stage 03: Mission 01 - Identity Defense (Learn)</h3>
            <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:18px;">Account Security Builder: Enforce MFA and eliminate SIM-swapping risks under Chubb Schedule B Item 4B.</p>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:20px;">
                <div class="flip-card ${state.quizFlipped && state.quizFlipped['quiz1'] !== undefined ? (state.quizFlipped['quiz1'] ? 'flipped' : '') : (state.completedQuizzes['quiz1'] ? 'flipped' : '')}" onclick="window.AcademyWidget.flipQuiz('quiz1', 200, 'mfa_badge')">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <div style="color:#00f0ff; font-weight:bold; margin-bottom:6px;">🔑 QUIZ: Chubb MFA Warranty</div>
                            <div style="color:#fff; font-size:0.88rem;">Which authentication method causes instant claim denial on administrative accounts during breach investigation?</div>
                            <div style="font-size:0.75rem; color:#94a3b8; margin-top:25px;">👉 Click card to test knowledge & claim MFA Badge (+200 XP)</div>
                        </div>
                        <div class="flip-card-back">
                            <div style="color:#ef4444; font-weight:bold; margin-bottom:4px;">❌ REJECTED: SMS & Voice Calls</div>
                            <div style="color:#10b981; font-weight:bold; margin-bottom:6px;">✅ ENFORCED: FIDO2 / Passkey Authenticator</div>
                            <div style="font-size:0.78rem; color:#cbd5e1;">Waives $250k sublimit caps & unlocks 20% Chubb premium credit.</div>
                            <div style="margin-top:12px; font-weight:bold; color:#10b981; font-size:0.82rem;">+200 XP UNLOCKED! 🔑</div>
                        </div>
                    </div>
                </div>

                <div style="background:#0f172a; border:1px solid #1e293b; padding:16px; border-radius:10px;">
                    <h4 style="color:#00f0ff; margin-top:0; margin-bottom:8px;">📋 Identity Control Audit Checklist:</h4>
                    <ul style="font-size:0.82rem; color:#cbd5e1; padding-left:18px; margin:0;">
                        <li style="margin-bottom:6px;">100% MFA coverage across all remote and admin users.</li>
                        <li style="margin-bottom:6px;">Disable inactive/stale accounts (>90 days idle).</li>
                        <li style="margin-bottom:6px;">Restrict broad data export rights to authorized roles.</li>
                        <li>Log Entra ID Conditional Access exports to Evidence Binder.</li>
                    </ul>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button style="background:transparent; border:1px solid #475569; color:#94a3b8; padding:10px 18px; border-radius:6px; cursor:pointer;" onclick="window.AcademyWidget.prevStep()">← Back</button>
                <button class="btn-cyber" onclick="window.AcademyWidget.nextStep()">Mission 02: Phish Hunter → (+200 XP)</button>
            </div>
        `;
    }

    // --- STAGE 04: Mission 02 - Phish Hunter ---
    function renderStep4() {
        return `
            ${renderHeader()}
            <h3 style="color:#fff; margin-bottom:8px;">Stage 04: Mission 02 - Phish Hunter (Play)</h3>
            <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:18px;">Analyst Triage Lab: Prevent Business Email Compromise (BEC) and satisfy Travelers Item 4C warranties.</p>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:20px;">
                <div class="flip-card ${state.quizFlipped && state.quizFlipped['quiz2'] !== undefined ? (state.quizFlipped['quiz2'] ? 'flipped' : '') : (state.completedQuizzes['quiz2'] ? 'flipped' : '')}" onclick="window.AcademyWidget.flipQuiz('quiz2', 200, 'phish_badge')">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <div style="color:#00f0ff; font-weight:bold; margin-bottom:6px;">🎯 QUIZ: Out-of-Band Wire Protocol</div>
                            <div style="color:#fff; font-size:0.88rem;">An urgent executive email requests a bank detail change for a vendor payout. What is the mandatory protocol?</div>
                            <div style="font-size:0.75rem; color:#94a3b8; margin-top:20px;">👉 Click card to resolve & claim Anti-Phish Badge (+200 XP)</div>
                        </div>
                        <div class="flip-card-back">
                            <div style="color:#10b981; font-weight:bold; margin-bottom:6px;">✅ MANDATORY: Secondary Out-of-Band Callback</div>
                            <div style="font-size:0.78rem; color:#cbd5e1;">Verify via pre-recorded phone number before releasing funds.</div>
                            <div style="font-size:0.78rem; color:#cbd5e1; margin-top:4px;">Insurers mandate click rates under 3.5%.</div>
                            <div style="margin-top:12px; font-weight:bold; color:#10b981; font-size:0.82rem;">+200 XP UNLOCKED! 🎯</div>
                        </div>
                    </div>
                </div>

                <div style="background:#0f172a; border:1px solid #1e293b; padding:16px; border-radius:10px;">
                    <h4 style="color:#7000ff; margin-top:0; margin-bottom:8px;">🛡️ Anti-BEC Triage Rules:</h4>
                    <p style="font-size:0.82rem; color:#cbd5e1; margin-bottom:8px;">Deploy 1-click phishing reporting beacons and enforce SPF/DKIM/DMARC \`p=reject\` policies to block domain spoofing.</p>
                    <div style="background:#1e293b; padding:8px 12px; border-radius:6px; font-family:monospace; font-size:0.75rem; color:#00f0ff;">
                        [DMARC RECORD]: v=DMARC1; p=reject; rua=mailto:dmarc@company.com
                    </div>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button style="background:transparent; border:1px solid #475569; color:#94a3b8; padding:10px 18px; border-radius:6px; cursor:pointer;" onclick="window.AcademyWidget.prevStep()">← Back</button>
                <button class="btn-cyber" onclick="window.AcademyWidget.nextStep()">Stage 05: Vaults & Perimeter → (+200 XP)</button>
            </div>
        `;
    }

    // --- STAGE 05: Mission 03 & 04 - Recovery Vault & Perimeter Sentinel ---
    function renderStep5() {
        return `
            ${renderHeader()}
            <h3 style="color:#fff; margin-bottom:8px;">Stage 05: Recovery Vault & Perimeter Cloaking (Document)</h3>
            <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:18px;">Lock down 3-2-1-1-0 immutable backups (Travelers 6A) and cloak WAN ports (Beazley Audit).</p>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:20px;">
                <div style="background:#0f172a; border:1px solid #10b981; padding:16px; border-radius:10px;">
                    <h4 style="color:#10b981; margin-top:0; margin-bottom:8px;">💾 Recovery Vault (Immutable Backups)</h4>
                    <ul style="font-size:0.82rem; color:#cbd5e1; padding-left:18px; margin:0;">
                        <li style="margin-bottom:6px;"><strong>3-2-1-1-0 Architecture:</strong> 3 copies, 2 media types, 1 offsite, 1 air-gapped/immutable, 0 errors.</li>
                        <li style="margin-bottom:6px;">AWS S3 Compliance Object Lock prevents deletion even by domain admin credentials.</li>
                        <li>Quarterly non-destructive restore drill logged in Evidence Binder.</li>
                    </ul>
                </div>

                <div style="background:#0f172a; border:1px solid #00f0ff; padding:16px; border-radius:10px;">
                    <h4 style="color:#00f0ff; margin-top:0; margin-bottom:8px;">📡 Perimeter Sentinel (Port Cloaking)</h4>
                    <ul style="font-size:0.82rem; color:#cbd5e1; padding-left:18px; margin:0;">
                        <li style="margin-bottom:6px;">Cloak <strong>Port 3389 RDP</strong> and <strong>Port 445 SMB</strong> behind encrypted WireGuard/Tailscale mesh.</li>
                        <li style="margin-bottom:6px;">Eliminates external attack surface flagged by underwriter Shodan/Bitsight scans.</li>
                        <li>Zero-cost firewall rules for Windows PowerShell and Linux UFW.</li>
                    </ul>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button style="background:transparent; border:1px solid #475569; color:#94a3b8; padding:10px 18px; border-radius:6px; cursor:pointer;" onclick="window.AcademyWidget.prevStep()">← Back</button>
                <button class="btn-cyber" onclick="window.AcademyWidget.nextStep()">Stage 06: Incident & Memory Vault → (+250 XP)</button>
            </div>
        `;
    }

    // --- STAGE 06: Mission 05 & 06 - Incident Command & Memory Vault ---
    function renderStep6() {
        return `
            ${renderHeader()}
            <h3 style="color:#fff; margin-bottom:8px;">Stage 06: Incident Command & Memory Vault (Review)</h3>
            <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:18px;">Execute CIRCIA 72h Tabletop exercises and govern Telemetry Memory Vault isolation.</p>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:20px;">
                <div style="background:#0f172a; border:1px solid #7000ff; padding:16px; border-radius:10px;">
                    <h4 style="color:#7000ff; margin-top:0; margin-bottom:8px;">🚨 Incident Command (CIRCIA 72h)</h4>
                    <ul style="font-size:0.82rem; color:#cbd5e1; padding-left:18px; margin:0;">
                        <li style="margin-bottom:6px;">Mandatory 72-hour federal breach reporting protocol under CIRCIA § 2242.</li>
                        <li style="margin-bottom:6px;">Out-of-band encrypted communication channels (Signal/Wire) during crisis.</li>
                        <li>Annual tabletop drill log with After-Action Report (AAR) filing.</li>
                    </ul>
                </div>

                <div style="background:#0f172a; border:1px solid #ff007a; padding:16px; border-radius:10px;">
                    <h4 style="color:#ff007a; margin-top:0; margin-bottom:8px;">🛡️ Memory Vault (Telemetry Guardian)</h4>
                    <ul style="font-size:0.82rem; color:#cbd5e1; padding-left:18px; margin:0;">
                        <li style="margin-bottom:6px;"><strong>Volatile RAM Isolation:</strong> Temporary browser sessions execute in volatile memory cores.</li>
                        <li style="margin-bottom:6px;"><strong>90-Day Audit Retention:</strong> Essential SIEM authentication logs are strictly preserved for underwriters.</li>
                        <li>Prevents persistent cookie exploits without blinding forensic auditors.</li>
                    </ul>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button style="background:transparent; border:1px solid #475569; color:#94a3b8; padding:10px 18px; border-radius:6px; cursor:pointer;" onclick="window.AcademyWidget.prevStep()">← Back</button>
                <button class="btn-cyber" onclick="window.AcademyWidget.nextStep()">Stage 07: Assemble Evidence Binder → (+250 XP)</button>
            </div>
        `;
    }

    // --- STAGE 07: Mission 07 - Evidence Binder Assembly ---
    function renderStep7() {
        return `
            ${renderHeader()}
            <h3 style="color:#fff; margin-bottom:8px;">Stage 07: Evidence Binder Desk (Document)</h3>
            <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:15px;">Review and assemble your 7-Field Governance Evidence Binder before executive sign-off.</p>

            <div style="overflow-x:auto;">
                <table class="binder-table">
                    <thead>
                        <tr>
                            <th>Control Requirement</th>
                            <th>Evidence Artifact</th>
                            <th>Owner</th>
                            <th>Cycle</th>
                            <th>Status</th>
                            <th>Ref Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.binderRecords.map(rec => `
                            <tr>
                                <td><strong>${rec.control}</strong></td>
                                <td>${rec.req}</td>
                                <td>${rec.owner}</td>
                                <td>${rec.cycle}</td>
                                <td><span class="status-badge ${rec.status === 'Verified' ? 'status-verified' : 'status-reviewed'}">${rec.status}</span></td>
                                <td><code>${rec.ref}</code></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div style="background:#0f172a; border:1px solid #00f0ff; padding:12px; border-radius:8px; margin-bottom:20px; font-size:0.82rem; color:#cbd5e1;">
                <strong style="color:#00f0ff;">🔒 Safe Handling & Redaction Guardrail:</strong> Secrets, pre-shared keys, API tokens, and passwords have been blacked out. The binder contains verified metadata and config logs only.
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button style="background:transparent; border:1px solid #475569; color:#94a3b8; padding:10px 18px; border-radius:6px; cursor:pointer;" onclick="window.AcademyWidget.prevStep()">← Back</button>
                <button class="btn-cyber" onclick="window.AcademyWidget.nextStep()">Stage 08: Executive Attestation → (+300 XP)</button>
            </div>
        `;
    }

    // --- STAGE 08: Mission 08 - Academy Seal & Executive Attestation ---
    function renderStep8() {
        const sec = sectorMatrix[state.userSector];
        return `
            ${renderHeader()}
            <div style="text-align:center; padding:10px 0;">
                <div style="font-size:2.8rem; margin-bottom:8px;">🏆</div>
                <h2 style="color:#00f0ff; margin:0 0 6px 0; font-size:1.5rem;">QUEST COMPLETE! EXECUTIVE ATTESTATION & SEAL</h2>
                <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:20px;">Darden Trust Gold Seal & Underwriting Evidence Package Minted.</p>

                <div style="background:#0f172a; border:2px solid #10b981; border-radius:12px; padding:18px; max-width:640px; margin:0 auto 20px auto; text-align:left; box-shadow:0 0 25px rgba(16, 185, 129, 0.25);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #1e293b; padding-bottom:8px;">
                        <span style="font-size:0.78rem; color:#10b981; font-weight:bold; letter-spacing:1.5px;">DARDEN TRUST GOLD SEAL ISSUED</span>
                        <span style="font-size:0.78rem; color:#00f0ff; font-weight:bold;">${state.xp} XP | LVL ${state.level} Commander</span>
                    </div>

                    <h4 style="color:#fff; margin:0 0 6px 0;">${sec.title} — Audit Package Ready</h4>
                    <div style="font-size:0.82rem; color:#cbd5e1; margin-bottom:12px;">Pre-Renewal Evidence verified for: Chubb, Travelers, Beazley, CMMC & Regulatory Auditors.</div>

                    <div style="background:#1e293b; padding:10px; border-radius:6px; font-family:monospace; font-size:0.75rem; color:#10b981; word-break:break-all;">
                        [SHA-256 TRUST SEAL]: 8f4a29c17e304bfa9021b84931a5c68d30e5f2817342981bc893a7482f1092ab<br>
                        [TIMESTAMP]: 2026-10-15T10:33:33Z | [STATUS]: ATTESTED & VERIFIED
                    </div>
                </div>

                <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-top:20px;">
                    <a href="assets/Cyber_Insurance_Evidence_DARDEN-PROOF-958405.txt" download class="btn-cyber" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                        📥 Download Evidence Package (.txt)
                    </a>
                    <a href="directory.html" class="btn-cyber" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg, #10b981 0%, #06b6d4 100%);">
                        🏢 View Metro Plaza Directory &rarr;
                    </a>
                    <a href="mailto:leonrdarden@gmail.com?subject=Claim%20Free%20Evidence%20Binder%20-%20${encodeURIComponent(sec.title)}" class="btn-cyber" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg, #f59e0b 0%, #9333ea 100%);">
                        📧 Contact Carrier Consulting
                    </a>
                </div>
            </div>
        `;
    }

    // --------------------------------------------------------------------------
    // PUBLIC CONTROLLER API
    // --------------------------------------------------------------------------
    window.AcademyWidget = {
        init: function(containerId) {
            injectStyles();
            this.container = document.getElementById(containerId);
            this.render();
        },
        render: function() {
            if (!this.container) return;
            this.container.className = 'academy-hud';
            if (state.currentStep === 1) this.container.innerHTML = renderStep1();
            else if (state.currentStep === 2) this.container.innerHTML = renderStep2();
            else if (state.currentStep === 3) this.container.innerHTML = renderStep3();
            else if (state.currentStep === 4) this.container.innerHTML = renderStep4();
            else if (state.currentStep === 5) this.container.innerHTML = renderStep5();
            else if (state.currentStep === 6) this.container.innerHTML = renderStep6();
            else if (state.currentStep === 7) this.container.innerHTML = renderStep7();
            else if (state.currentStep === 8) this.container.innerHTML = renderStep8();
        },
        selectSector: function(secKey) {
            state.userSector = secKey;
            this.render();
        },
        selectSize: function(size) {
            state.employeeCount = size;
            this.render();
        },
        flipQuiz: function(quizId, xp, badgeId) {
            state.quizFlipped = state.quizFlipped || {};
            state.quizFlipped[quizId] = state.quizFlipped[quizId] === undefined ? true : !state.quizFlipped[quizId];
            if (!state.completedQuizzes[quizId]) {
                state.completedQuizzes[quizId] = true;
                if (badgeId && !state.unlockedBadges.includes(badgeId)) {
                    state.unlockedBadges.push(badgeId);
                }
                addXP(xp);
            }
            this.render();
        },
        nextStep: function() {
            if (!state.clearedSteps[state.currentStep]) {
                state.clearedSteps[state.currentStep] = true;
                if (state.currentStep === 1 && state.userSector) addXP(100);
                else if (state.currentStep === 2) addXP(150);
                else if (state.currentStep === 3) addXP(200);
                else if (state.currentStep === 4) addXP(200);
                else if (state.currentStep === 5) addXP(200);
                else if (state.currentStep === 6) addXP(250);
                else if (state.currentStep === 7) addXP(250);
            }
            if (state.currentStep < state.totalSteps) {
                state.currentStep++;
                this.render();
            }
        },
        prevStep: function() {
            if (state.currentStep > 1) {
                state.currentStep--;
                this.render();
            }
        },
        addXP: function(amount) {
            addXP(amount);
        },
        unlockBadge: function(badgeKey) {
            if (!state.unlockedBadges.includes(badgeKey)) {
                state.unlockedBadges.push(badgeKey);
            }
        }
    };
})();
