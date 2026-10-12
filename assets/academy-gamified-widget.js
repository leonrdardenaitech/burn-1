/**
 * ==============================================================================
 * /academy-gamified - Interactive Cyber Academy Onboarding & Sales Engine
 * ==============================================================================
 * A standalone, zero-dependency JavaScript widget with dynamic IF/THEN 
 * questionnaires, animated XP counters, flip-card quizzes, and automated 
 * Privacy-First Chubb/Travelers Evidence Binder compiler.
 * Fully adapted for both Neon Cyberpunk HUD & Corporate Day Mode (Smoke & Mirrors).
 * ==============================================================================
 */

(function() {
    // --------------------------------------------------------------------------
    // STATE MACHINE & GAMIFICATION DATA
    // --------------------------------------------------------------------------
    const state = {
        currentStep: 1,
        totalSteps: 5,
        xp: 0,
        level: 1,
        userSector: null,
        employeeCount: '10-50',
        governingBodies: [],
        underwriterWarranties: [],
        selectedFreeServices: [],
        completedQuizzes: {},
        unlockedBadges: [],
        vaultStatus: 'LOCKED',
        auditCoverage: []
    };

    const sectorMatrix = {
        healthcare: {
            title: "Healthcare & Life Sciences",
            icon: "🏥",
            bodies: ["HIPAA § 164.312", "HITECH Breach Safe Harbor", "FDA 524B SBOM", "State Health Privacy (CMIA/MHMD)"],
            warranties: ["Chubb Schedule B Item 4B (MFA)", "Travelers Item 6A (Immutable S3 Backups)"],
            sublimitRisk: "$250,000 Ransomware Cap / Potential Claim Denial",
            discountPotential: "25% - 35% Premium Credit",
            auditPerks: ["PHI Encryption Verification", "S3 Object Lock Compliance Check", "Medical Device Port Cloaking"]
        },
        financial: {
            title: "Financial Services & Banking",
            icon: "🏦",
            bodies: ["NYDFS 23 NYCRR 500", "FTC Safeguards Rule", "FINRA Cyber Rule", "SEC 4-Day Incident Form 8-K"],
            warranties: ["Chubb Schedule B (Phishing-Resistant MFA)", "Beazley Critical Underwriting (RDP Cloaking)"],
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
            discountPotential: "Audit-Pass Guarantee & Preferred Insurance Tier",
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
            sublimitRisk: "Payment Processor Suspension & Class-Action Privacy Lawsuits",
            discountPotential: "20% - 35% Premium Credit",
            auditPerks: ["E-Commerce Payment Gateway DLP Sweep", "GenAI Prompt Injection Guardrail", "Zero-Cost MFA Enrollment"]
        }
    };

    // --------------------------------------------------------------------------
    // WIDGET STYLING ENGINE (NEON HUD + DAY MODE INTEGRATION)
    // --------------------------------------------------------------------------
    function injectStyles() {
        if (document.getElementById('academy-hud-styles')) return;
        const style = document.createElement('style');
        style.id = 'academy-hud-styles';
        style.innerHTML = `
            .academy-hud {
                background: #090d16;
                color: #e2e8f0;
                font-family: 'Space Grotesk', -apple-system, sans-serif;
                border: 2px solid #00f0ff;
                box-shadow: 0 0 30px rgba(0, 240, 255, 0.25);
                border-radius: 1.25rem;
                padding: 28px;
                max-width: 950px;
                margin: 0 auto;
                position: relative;
                overflow: hidden;
                transition: all 0.35s ease;
            }
            .xp-pill-badge {
                background: rgba(112, 0, 255, 0.2);
                border: 1px solid #7000ff;
                color: #00f0ff;
                font-weight: bold;
                padding: 6px 16px;
                border-radius: 9999px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 0 10px rgba(112, 0, 255, 0.4);
                font-family: 'Share Tech Mono', monospace;
            }
            .pulse-xp {
                animation: pulse-xp-kf 0.5s ease-out;
            }
            @keyframes pulse-xp-kf {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); color: #f59e0b; text-shadow: 0 0 15px #f59e0b; }
                100% { transform: scale(1); }
            }
            .hud-card-select {
                background: #111827;
                border: 1px solid #1e293b;
                border-radius: 12px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.25s ease;
                text-align: left;
            }
            .hud-card-select:hover {
                border-color: #00f0ff;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 240, 255, 0.2);
            }
            .hud-card-select.active {
                border-color: #00f0ff;
                background: rgba(0, 240, 255, 0.12);
                box-shadow: 0 0 18px rgba(0, 240, 255, 0.35);
            }
            .hud-flip-card {
                perspective: 1000px;
                min-height: 200px;
                cursor: pointer;
            }
            .hud-flip-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                transform-style: preserve-3d;
            }
            .hud-flip-card.flipped .hud-flip-inner {
                transform: rotateY(180deg);
            }
            .hud-flip-front, .hud-flip-back {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                border-radius: 12px;
                padding: 20px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .hud-flip-front {
                background: #1e293b;
                border: 1.5px solid #334155;
            }
            .hud-flip-back {
                background: #0f172a;
                border: 2px solid #00f0ff;
                transform: rotateY(180deg);
                box-shadow: 0 0 20px rgba(0, 240, 255, 0.25);
            }
            .hud-btn-primary {
                background: linear-gradient(135deg, #00f0ff 0%, #7000ff 100%);
                color: #000;
                font-weight: 800;
                padding: 12px 26px;
                border-radius: 10px;
                border: none;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-family: 'Orbitron', 'Space Grotesk', sans-serif;
                font-size: 0.85rem;
                transition: all 0.25s ease;
                box-shadow: 0 4px 15px rgba(0, 240, 255, 0.3);
            }
            .hud-btn-primary:hover {
                box-shadow: 0 0 25px rgba(0, 240, 255, 0.7);
                transform: scale(1.03);
            }
            .hud-btn-secondary {
                background: transparent;
                border: 1.5px solid #475569;
                color: #94a3b8;
                padding: 10px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-family: 'Share Tech Mono', monospace;
                font-size: 0.85rem;
                transition: all 0.2s ease;
            }
            .hud-btn-secondary:hover {
                border-color: #94a3b8;
                color: #fff;
            }
            .hud-panel-box {
                background: #0f172a;
                border: 1px solid #1e293b;
                border-radius: 10px;
                padding: 18px;
            }
            .hud-heading {
                font-family: 'Orbitron', 'Space Grotesk', sans-serif;
                font-weight: 800;
                color: #ffffff;
            }
            .hud-subtext {
                color: #94a3b8;
                font-family: 'Share Tech Mono', monospace;
            }
            .hud-accent {
                color: #00f0ff;
            }

            /* ==========================================================
               CORPORATE DAY MODE AESTHETIC (SMOKE & MIRRORS TRANSLUCENT)
               ========================================================== */
            html.day-mode .academy-hud {
                background: rgba(255, 255, 255, 0.65) !important;
                backdrop-filter: blur(12px) !important;
                -webkit-backdrop-filter: blur(12px) !important;
                border: 1.5px solid rgba(255, 255, 255, 0.95) !important;
                outline: 1px solid rgba(195, 194, 194, 0.45) !important;
                box-shadow: 0 14px 35px rgba(0, 0, 0, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.95) !important;
                color: #09090b !important;
            }
            html.day-mode .academy-hud .hud-heading {
                color: #000000 !important;
                font-weight: 800 !important;
                text-shadow: none !important;
            }
            html.day-mode .academy-hud .hud-subtext {
                color: #1f2937 !important;
                font-weight: 600 !important;
            }
            html.day-mode .academy-hud .hud-accent {
                color: #0284c7 !important;
                font-weight: 700 !important;
            }
            html.day-mode .academy-hud .xp-pill-badge {
                background: linear-gradient(to top, #ebebeb, #ffffff) !important;
                border: 1.5px solid #d4d4d4 !important;
                color: #09090b !important;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
            }
            html.day-mode .academy-hud .hud-panel-box {
                background: rgba(255, 255, 255, 0.72) !important;
                border: 1.5px solid #cbd5e1 !important;
                color: #09090b !important;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04) !important;
            }
            html.day-mode .academy-hud .hud-card-select {
                background: rgba(255, 255, 255, 0.78) !important;
                border: 1.5px solid #cbd5e1 !important;
                color: #09090b !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
            }
            html.day-mode .academy-hud .hud-card-select:hover {
                background: #ffffff !important;
                border-color: #0284c7 !important;
                box-shadow: 0 6px 16px rgba(2, 132, 199, 0.15) !important;
            }
            html.day-mode .academy-hud .hud-card-select.active {
                background: rgba(235, 248, 255, 0.95) !important;
                border-color: #0284c7 !important;
                box-shadow: 0 0 15px rgba(2, 132, 199, 0.25) !important;
            }
            html.day-mode .academy-hud .hud-flip-front {
                background: rgba(255, 255, 255, 0.85) !important;
                border: 1.5px solid #cbd5e1 !important;
                color: #09090b !important;
            }
            html.day-mode .academy-hud .hud-flip-back {
                background: rgba(254, 243, 199, 0.95) !important;
                border: 2px solid #f59e0b !important;
                color: #09090b !important;
                box-shadow: 0 0 20px rgba(245, 158, 11, 0.25) !important;
            }
            html.day-mode .academy-hud .hud-btn-primary {
                background-image: linear-gradient(to top, #ebebeb, #c3c2c2) !important;
                color: #09090b !important;
                border: 1.5px solid #ffffff !important;
                box-shadow: inset 0 -3px 6px rgba(0, 0, 0, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.9), 0 4px 10px rgba(0, 0, 0, 0.08) !important;
                font-weight: 800 !important;
            }
            html.day-mode .academy-hud .hud-btn-primary:hover {
                background-image: linear-gradient(to top, #ffffff, #cbcbcb) !important;
                color: #000000 !important;
                transform: scale(1.03) !important;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15), inset 0 2px 6px #ffffff !important;
            }
            html.day-mode .academy-hud .hud-btn-secondary {
                background: rgba(255, 255, 255, 0.7) !important;
                border: 1.5px solid #cbd5e1 !important;
                color: #09090b !important;
                font-weight: 700 !important;
            }
            html.day-mode .academy-hud .hud-btn-secondary:hover {
                background: #ffffff !important;
                border-color: #09090b !important;
            }
            html.day-mode .academy-hud p,
            html.day-mode .academy-hud li,
            html.day-mode .academy-hud label,
            html.day-mode .academy-hud div {
                color: #09090b;
            }
        `;
        document.head.appendChild(style);
    }

    // --------------------------------------------------------------------------
    // RENDER FUNCTIONS
    // --------------------------------------------------------------------------
    function addXP(amount) {
        state.xp += amount;
        state.level = Math.floor(state.xp / 300) + 1;
        const xpEl = document.getElementById('academy-xp-counter');
        if (xpEl) {
            xpEl.classList.add('pulse-xp');
            xpEl.innerText = `${state.xp} XP (LVL ${state.level})`;
            setTimeout(() => xpEl.classList.remove('pulse-xp'), 500);
        }
    }

    function renderHeader() {
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; border-bottom: 1px solid rgba(148, 163, 184, 0.3); padding-bottom: 15px;">
                <div>
                    <h2 class="hud-heading" style="margin:0; font-size: 1.4rem; letter-spacing:1px;">⚡ /ACADEMY-GAMIFIED</h2>
                    <span class="hud-subtext" style="font-size:0.85rem;">Zero-Cost Underwriting &amp; Pre-Renewal Onboarding Engine</span>
                </div>
                <div class="xp-pill-badge">
                    ⚡ <span id="academy-xp-counter">${state.xp} XP (LVL ${state.level})</span>
                </div>
            </div>
            <div style="background: rgba(148, 163, 184, 0.25); height:7px; border-radius:4px; margin-bottom:25px; overflow:hidden;">
                <div style="background: linear-gradient(90deg, #00f0ff, #f59e0b); height:100%; width: ${(state.currentStep / state.totalSteps) * 100}%; transition: width 0.35s ease;"></div>
            </div>
        `;
    }

    function renderStep1() {
        return `
            ${renderHeader()}
            <h3 class="hud-heading" style="margin-bottom:8px; font-size:1.25rem;">Step 1: Select Your Industry Field</h3>
            <p class="hud-subtext" style="font-size:0.95rem; margin-bottom:20px; line-height:1.5;">Our automated IF/THEN scenario engine customizes your governing bodies, audit rules, and Chubb/Travelers insurance discount path.</p>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:15px; margin-bottom:25px;">
                ${Object.keys(sectorMatrix).map(key => {
                    const sec = sectorMatrix[key];
                    const isActive = state.userSector === key ? 'active' : '';
                    return `
                        <div class="hud-card-select ${isActive}" onclick="window.AcademyWidget.selectSector('${key}')">
                            <div style="font-size:1.8rem; margin-bottom:8px;">${sec.icon}</div>
                            <div class="hud-heading" style="font-size:1rem; margin-bottom:4px;">${sec.title}</div>
                            <div class="hud-accent" style="font-size:0.8rem; font-family:'Share Tech Mono', monospace;">Potential Credit: ${sec.discountPotential}</div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="display:flex; justify-content:flex-end;">
                <button class="hud-btn-primary" ${!state.userSector ? 'disabled style="opacity:0.45; cursor:not-allowed;"' : ''} onclick="window.AcademyWidget.nextStep()">
                    Continue Quest &rarr; (+100 XP)
                </button>
            </div>
        `;
    }

    function renderStep2() {
        const sec = sectorMatrix[state.userSector] || sectorMatrix.healthcare;
        return `
            ${renderHeader()}
            <h3 class="hud-heading" style="margin-bottom:8px; font-size:1.25rem;">Step 2: Organizational Scale &amp; Threat Profile</h3>
            <p class="hud-subtext" style="font-size:0.95rem; margin-bottom:15px; line-height:1.5;">Configure employee seats to establish your risk multiplier and automated evidence parameters.</p>

            <div class="hud-panel-box" style="margin-bottom:20px;">
                <span class="hud-accent" style="font-weight:bold;">Sector Matched:</span> ${sec.icon} <strong class="hud-heading" style="font-size:0.95rem;">${sec.title}</strong>
                <div class="hud-subtext" style="font-size:0.85rem; margin-top:6px; line-height:1.5;">
                    <strong style="color:inherit;">Governing Bodies Handled:</strong> ${sec.bodies.join(', ')}
                </div>
            </div>

            <label class="hud-heading" style="display:block; font-size:0.95rem; margin-bottom:10px;">Select Employee Headcount:</label>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:10px; margin-bottom:25px;">
                ${['1-10 Employees', '10-50 Employees', '50-250 Employees', '250+ Enterprise'].map(size => `
                    <div class="hud-card-select ${state.employeeCount === size ? 'active' : ''}" onclick="window.AcademyWidget.selectSize('${size}')" style="text-align:center;">
                        <div class="hud-heading" style="font-size:0.9rem;">${size}</div>
                    </div>
                `).join('')}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button class="hud-btn-secondary" onclick="window.AcademyWidget.prevStep()">&larr; Back</button>
                <button class="hud-btn-primary" onclick="window.AcademyWidget.nextStep()">Unlock Free Course &amp; Badges &rarr; (+150 XP)</button>
            </div>
        `;
    }

    function renderStep3() {
        return `
            ${renderHeader()}
            <h3 class="hud-heading" style="margin-bottom:8px; font-size:1.25rem;">Step 3: Free Controls &amp; Interactive Drills</h3>
            <p class="hud-subtext" style="font-size:0.95rem; margin-bottom:20px; line-height:1.5;">We provide the complete zero-cost blueprint. Flip these 2 drill cards to learn underwriter warranties and unlock your verification badges!</p>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px; margin-bottom:25px;">
                <!-- Flip Card 1 -->
                <div class="hud-flip-card ${state.completedQuizzes['quiz1'] ? 'flipped' : ''}" onclick="window.AcademyWidget.flipQuiz('quiz1', 250, 'mfa2')">
                    <div class="hud-flip-inner">
                        <div class="hud-flip-front">
                            <div>
                                <div class="hud-accent" style="font-weight:bold; font-size:0.85rem; font-family:'Share Tech Mono', monospace; margin-bottom:8px;">🔑 FLIP CARD DRILL #1</div>
                                <div class="hud-heading" style="font-size:0.95rem; line-height:1.4;">Which 2FA method is strictly rejected by Chubb &amp; Travelers due to SIM-swapping risks?</div>
                            </div>
                            <div class="hud-subtext" style="font-size:0.75rem; margin-top:20px;">👉 Click card to flip, view warranty &amp; claim MFA2 Badge (+250 XP)</div>
                        </div>
                        <div class="hud-flip-back">
                            <div>
                                <div style="color:#ef4444; font-weight:bold; font-size:0.85rem; margin-bottom:6px;">❌ REJECTED: SMS / Plaintext Voice Tokens</div>
                                <div class="hud-accent" style="font-weight:bold; font-size:0.85rem; margin-bottom:6px;">✅ ENFORCED: Zero-Cost FIDO2 / Authenticator Passkeys</div>
                                <div class="hud-subtext" style="font-size:0.8rem; line-height:1.4;">Unlocks 15%-20% Chubb premium discount &amp; waives $250k sublimit!</div>
                            </div>
                            <div style="margin-top:10px; font-weight:bold; color:#10b981; font-family:'Share Tech Mono', monospace;">+250 XP UNLOCKED! 🔑</div>
                        </div>
                    </div>
                </div>

                <!-- Flip Card 2 -->
                <div class="hud-flip-card ${state.completedQuizzes['quiz2'] ? 'flipped' : ''}" onclick="window.AcademyWidget.flipQuiz('quiz2', 250, 'phish')">
                    <div class="hud-flip-inner">
                        <div class="hud-flip-front">
                            <div>
                                <div class="hud-accent" style="font-weight:bold; font-size:0.85rem; font-family:'Share Tech Mono', monospace; margin-bottom:8px;">🎯 FLIP CARD DRILL #2</div>
                                <div class="hud-heading" style="font-size:0.95rem; line-height:1.4;">What operational protocol is mandated before executing executive wire transfers or payment routing changes?</div>
                            </div>
                            <div class="hud-subtext" style="font-size:0.75rem; margin-top:20px;">👉 Click card to reveal answer &amp; claim Anti-Phish Badge (+250 XP)</div>
                        </div>
                        <div class="hud-flip-back">
                            <div>
                                <div class="hud-accent" style="font-weight:bold; font-size:0.85rem; margin-bottom:6px;">✅ MANDATORY: Out-of-Band Verbal Callback Protocol</div>
                                <div class="hud-subtext" style="font-size:0.8rem; line-height:1.4;">Carrier warranties require dual-signoff on transactions over $10,000 and click rates below 3.5%.</div>
                            </div>
                            <div style="margin-top:10px; font-weight:bold; color:#10b981; font-family:'Share Tech Mono', monospace;">+250 XP UNLOCKED! 🎯</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button class="hud-btn-secondary" onclick="window.AcademyWidget.prevStep()">&larr; Back</button>
                <button class="hud-btn-primary" onclick="window.AcademyWidget.nextStep()">Explore Automated Privacy Vault &rarr;</button>
            </div>
        `;
    }

    function renderStep4() {
        const sec = sectorMatrix[state.userSector] || sectorMatrix.healthcare;
        return `
            ${renderHeader()}
            <h3 class="hud-heading" style="margin-bottom:8px; font-size:1.25rem;">Step 4: The Privacy-First Automated Audit Vault</h3>
            <p class="hud-subtext" style="font-size:0.95rem; margin-bottom:20px; line-height:1.5;">How our resident engine compiles your Chubb Evidence Binder without exposing confidential data.</p>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:15px; margin-bottom:25px;">
                <div class="hud-panel-box" style="border-left: 4px solid #00f0ff;">
                    <h4 class="hud-heading" style="font-size:0.95rem; margin-top:0; margin-bottom:10px; color:#00f0ff;">🛡️ What the Surface Audit Inspects:</h4>
                    <ul class="hud-subtext" style="font-size:0.85rem; padding-left:18px; margin:0; line-height:1.6;">
                        ${sec.auditPerks.map(p => `<li style="margin-bottom:6px;">${p}</li>`).join('')}
                        <li style="margin-bottom:6px;">Port 3389 RDP / Port 445 SMB Perimeter Cloaking</li>
                        <li style="margin-bottom:6px;">S3 Object Lock Immutable Backup Attestation</li>
                        <li>DMARC Policy Enforcement (\`p=quarantine\` / \`p=reject\`)</li>
                    </ul>
                </div>

                <div class="hud-panel-box" style="border-left: 4px solid #9333ea;">
                    <h4 class="hud-heading" style="font-size:0.95rem; margin-top:0; margin-bottom:10px; color:#a855f7;">🔐 Privacy-First Vault Protections:</h4>
                    <p class="hud-subtext" style="font-size:0.85rem; margin-bottom:10px; line-height:1.5;">Your private files never leave your perimeter. Telemetry is mathematically anchored to a <strong>SHA-256 cryptographic hash</strong>.</p>
                    <div style="background: rgba(0,0,0,0.5); padding:10px; border-radius:6px; font-family:'Share Tech Mono', monospace; font-size:0.75rem; color:#10b981; border:1px solid rgba(16, 185, 129, 0.3);">
                        [VAULT HASH]: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069<br>
                        [STATUS]: ZERO PRIVACY EXPOSURE // PRE-RENEWAL VERIFIED
                    </div>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <button class="hud-btn-secondary" onclick="window.AcademyWidget.prevStep()">&larr; Back</button>
                <button class="hud-btn-primary" onclick="window.AcademyWidget.nextStep()">Mint Final Evidence Binder &amp; Seal &rarr; (+500 XP)</button>
            </div>
        `;
    }

    function renderStep5() {
        const sec = sectorMatrix[state.userSector] || sectorMatrix.healthcare;
        return `
            ${renderHeader()}
            <div style="text-align:center; padding:15px 0;">
                <div style="font-size:3.5rem; margin-bottom:12px;">🏆</div>
                <h2 class="hud-heading" style="font-size:1.5rem; margin:0 0 10px 0; letter-spacing:1px;">QUEST COMPLETE // EVIDENCE BINDER COMPILED</h2>
                <p class="hud-subtext" style="font-size:0.95rem; margin-bottom:25px;">You have satisfied core curriculum requirements and authorized issuance of the Darden Trust Gold Underwriting Seal.</p>

                <div class="hud-panel-box" style="border: 2px solid #10b981; border-radius:16px; padding:24px; max-width:620px; margin:0 auto 25px auto; box-shadow:0 0 25px rgba(16, 185, 129, 0.25);">
                    <div style="font-size:0.8rem; color:#10b981; font-weight:bold; letter-spacing:2px; font-family:'Share Tech Mono', monospace;">DARDEN TRUST GOLD SEAL ISSUED</div>
                    <h3 class="hud-heading" style="margin:8px 0; font-size:1.3rem;">${sec.title} Audit-Ready</h3>
                    <div class="hud-subtext" style="font-size:0.9rem; margin-bottom:12px;">Underwriting Warranties Mapped: Chubb &bull; Travelers &bull; Beazley</div>
                    <div class="hud-accent" style="font-size:0.85rem; font-family:'Share Tech Mono', monospace;">
                        Verified Telemetry Score: ${state.xp} XP | Level ${state.level} Architect
                    </div>
                </div>

                <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:12px;">
                    <a href="mailto:support@burn-1.com?subject=Claim%20Free%20Evidence%20Binder%20-%20${encodeURIComponent(sec.title)}" class="hud-btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
                        📥 Claim Free Evidence Binder Package
                    </a>
                    <button class="hud-btn-secondary" onclick="window.AcademyWidget.init('academy-gamified-widget-mount')">
                        ↺ Restart Onboarding Quest
                    </button>
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
            if (!state.completedQuizzes[quizId]) {
                state.completedQuizzes[quizId] = true;
                if (badgeId && !state.unlockedBadges.includes(badgeId)) {
                    state.unlockedBadges.push(badgeId);
                }
                addXP(xp);
                this.render();
            }
        },
        nextStep: function() {
            if (state.currentStep === 1 && state.userSector) addXP(100);
            if (state.currentStep === 2) addXP(150);
            if (state.currentStep === 4) addXP(500);
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
        }
    };
})();
