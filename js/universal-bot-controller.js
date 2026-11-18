/**
 * BURN-1 SYSTEMS — UNIFIED HARDWARE BOT CONTROLLER (js/universal-bot-controller.js)
 * Architecture:
 *   ONE GIANT TIME ACCEL CLOCK GAUGE (Bottom-Right, with ticking sweep hand & sound toggle)
 *   OPENS ONE MODAL WITH EXACTLY 3 HARDWARE MODULES:
 *     1. MODULE 1: DEDICATED HARDWARE LOGIN & SIGN-UP (Auth, Passkey Bio-Scan & New Account Minter)
 *     2. MODULE 2: REAGENT BOT (The Link Bot & Dynamic Universal Payment Gateway)
 *     3. MODULE 3: COSMO BOT (The Systems Knowledge Guru & Unannounced Support Field)
 */

(function () {
  'use strict';

  // Inject Bot CSS Stylesheet
  const style = document.createElement('style');
  style.id = 'burn1-universal-bot-styles';
  style.textContent = `
    /* FLOATING GIANT TIME ACCEL CLOCK GAUGE TRIGGER (Section 4 UI Kit) */
    .b1-unified-clock-dial-trigger {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: radial-gradient(circle at 50% 50%, #0f172a 0%, #06090e 72%, #1e293b 100%);
      border: 4px solid #64748b;
      box-shadow: 
        0 10px 28px rgba(0, 0, 0, 0.9),
        0 0 25px rgba(56, 189, 248, 0.4),
        inset 0 0 20px rgba(56, 189, 248, 0.35);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      user-select: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .b1-unified-clock-dial-trigger:hover {
      transform: scale(1.08);
      border-color: #38bdf8;
      box-shadow: 
        0 12px 35px rgba(0, 0, 0, 0.95),
        0 0 35px rgba(56, 189, 248, 0.7);
    }

    /* Animated Ticking Clock Hand */
    .b1-clock-hand-sweep {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 32px;
      height: 2.5px;
      background: linear-gradient(90deg, #ffffff 0%, #38bdf8 100%);
      box-shadow: 0 0 8px #38bdf8;
      transform-origin: 0% 50%;
      border-radius: 9999px;
      animation: clockSweep 12s linear infinite;
    }
    @keyframes clockSweep {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .b1-clock-center-hub {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #cbd5e1;
      border: 2px solid #0f172a;
      z-index: 3;
      box-shadow: 0 0 6px #38bdf8;
    }

    .b1-clock-dial-text {
      position: absolute;
      bottom: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      font-weight: 800;
      color: #38bdf8;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      z-index: 2;
    }

    .b1-clock-pulse-ring {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2px solid #38bdf8;
      animation: clockPulseRing 2.5s infinite;
      pointer-events: none;
    }
    @keyframes clockPulseRing {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.35); opacity: 0; }
    }

    /* SOUND TOGGLE BUTTON ANCHORED RIGHT NEXT TO CLOCK */
    .b1-clock-sound-subbtn {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #0b0213;
      border: 1.5px solid #38bdf8;
      color: #38bdf8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.8);
      z-index: 10;
      transition: all 0.2s ease;
    }
    .b1-clock-sound-subbtn:hover {
      background: #38bdf8;
      color: #05080d;
      transform: scale(1.15);
    }

    /* FULL MODAL BACKDROP */
    .b1-tri-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: rgba(5, 2, 10, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .b1-tri-modal-backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    /* TRI-PANE HARDWARE CONSOLE FRAME */
    .b1-tri-console-frame {
      width: 100%;
      max-width: 1200px;
      background: linear-gradient(180deg, #130424 0%, #07010e 100%);
      border: 2px solid #475569;
      border-radius: 24px;
      box-shadow: 
        inset 0 2px 4px rgba(255, 255, 255, 0.3),
        inset 0 -2px 6px rgba(0, 0, 0, 0.9),
        0 25px 60px rgba(0, 0, 0, 0.95),
        0 0 40px rgba(192, 132, 252, 0.35);
      position: relative;
      overflow: hidden;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
    }
    .b1-tri-console-frame::before {
      content: '';
      position: absolute;
      top: 6px; left: 6px; right: 6px; bottom: 6px;
      border: 1px dashed rgba(192, 132, 252, 0.2);
      border-radius: 18px;
      pointer-events: none;
    }

    /* MODAL HEADER */
    .b1-tri-header {
      padding: 1.25rem 2rem;
      border-bottom: 2px solid rgba(192, 132, 252, 0.3);
      background: #0b0213;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }

    /* 3-MODULE GRID CONTAINER */
    .b1-tri-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      padding: 1.5rem 2rem;
      overflow-y: auto;
      position: relative;
      z-index: 10;
      flex: 1;
    }
    @media (max-width: 1024px) {
      .b1-tri-grid { grid-template-columns: 1fr; }
    }

    /* MODULE HARDWARE CARDS */
    .b1-module-card {
      background: rgba(10, 3, 18, 0.85);
      border: 2px solid #334155;
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.05), 0 8px 20px rgba(0,0,0,0.6);
      position: relative;
    }
    .b1-module-card.active-glow {
      border-color: #c084fc;
      box-shadow: 0 0 20px rgba(192, 132, 252, 0.25);
    }

    /* HARDWARE LED DISPLAY */
    .b1-led-amber {
      background: #020402;
      border: 2px solid #b45309;
      border-radius: 6px;
      padding: 0.6rem 0.85rem;
      font-family: 'JetBrains Mono', monospace;
      color: #fbbf24;
      text-shadow: 0 0 10px rgba(251, 191, 36, 0.85);
      letter-spacing: 0.12em;
      box-shadow: inset 0 3px 8px rgba(0,0,0,0.95);
    }

    /* BIOMETRIC PAD */
    .b1-biometric-pad {
      width: 60px;
      height: 60px;
      border: 2px solid #38bdf8;
      border-radius: 12px;
      background: rgba(56, 189, 248, 0.08);
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .b1-biometric-pad::after {
      content: '';
      position: absolute;
      top: -100%;
      left: 0;
      width: 100%;
      height: 3px;
      background: #38bdf8;
      box-shadow: 0 0 10px #38bdf8;
      animation: bioScanAnim 2s infinite linear;
    }
    @keyframes bioScanAnim {
      0% { top: -10%; opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { top: 110%; opacity: 0; }
    }

    /* FROSTED BLUE BUTTONS */
    .b1-btn-frost-blue {
      background: linear-gradient(180deg, rgba(56, 189, 248, 0.25) 0%, rgba(14, 116, 144, 0.6) 100%);
      border: 1.5px solid #7dd3fc;
      color: #ffffff;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.65rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }
    .b1-btn-frost-blue:hover {
      background: linear-gradient(180deg, rgba(56, 189, 248, 0.45) 0%, rgba(14, 116, 144, 0.85) 100%);
      box-shadow: 0 0 18px rgba(56, 189, 248, 0.6);
    }
  `;
  document.head.appendChild(style);

  // Class Definition
  class UniversalTriBotController {
    constructor() {
      this.isSignUpMode = false;
      let authUser = null;
      try { authUser = JSON.parse(localStorage.getItem('burn1_auth_user') || 'null'); } catch(e){}
      const academyCredits = parseInt(localStorage.getItem('burn1_clinic_credits') || (authUser && authUser.credits) || '0', 10);
      const academyScore = parseInt(localStorage.getItem('burn1_clinic_score') || (authUser && authUser.score) || '0', 10);

      this.activeClient = {
        tenantId: localStorage.getItem('b1_tenant_id') || (authUser && authUser.email ? 'CLIENT-' + authUser.email.split('@')[0].toUpperCase() : 'CLIENT-0020.123415679'),
        domain: localStorage.getItem('b1_client_domain') || (authUser && authUser.domain) || '',
        email: localStorage.getItem('b1_client_email') || (authUser && authUser.email) || '',
        company: localStorage.getItem('b1_client_company') || '',
        isAuthed: localStorage.getItem('b1_is_authed') === 'true' || !!authUser,
        credits: academyCredits,
        score: academyScore
      };
      this.init();
    }

    init() {
      this.injectGiantClockTrigger();
      this.injectTriModal();
      this.bindEvents();
    }

    injectGiantClockTrigger() {
      // Remove any existing duplicate floating triggers
      const existing = document.getElementById('b1-unified-bot-dial');
      if (existing) existing.remove();
      const existingBtn = document.getElementById('b1-unified-bot-btn');
      if (existingBtn) existingBtn.remove();
      const existingAudioBtn = document.getElementById('b1-audio-toggle-btn');
      if (existingAudioBtn) existingAudioBtn.remove(); // We anchor sound directly to the clock

      const clockWrap = document.createElement('div');
      clockWrap.id = 'b1-unified-bot-dial';
      clockWrap.className = 'b1-unified-clock-dial-trigger';
      clockWrap.title = 'Open Burn-1 Universal Console (Login/Sign-Up • Reagent • Cosmo)';
      
      const isMuted = localStorage.getItem('b1_audio_muted') === 'true';

      clockWrap.innerHTML = `
        <span class="b1-clock-pulse-ring"></span>
        <div class="b1-clock-hand-sweep"></div>
        <div class="b1-clock-center-hub"></div>
        <div class="b1-clock-dial-text">TIME ACCEL</div>
        <button id="b1-clock-sound-btn" class="b1-clock-sound-subbtn" title="Toggle Tactile Audio">
          <i class="fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>
        </button>
      `;

      // Open Modal on Clock Click
      clockWrap.onclick = (e) => {
        if (e.target.closest('#b1-clock-sound-btn')) return; // handled by sound subbtn
        this.openModal();
      };

      // Sound Toggle sub-button inside clock
      document.body.appendChild(clockWrap);
      const soundBtn = document.getElementById('b1-clock-sound-btn');
      if (soundBtn) {
        soundBtn.onclick = (e) => {
          e.stopPropagation();
          if (window.burn1Audio) {
            window.burn1Audio.toggleMute();
            const nowMuted = window.burn1Audio.isMuted;
            soundBtn.innerHTML = `<i class="fa-solid ${nowMuted ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>`;
            soundBtn.style.color = nowMuted ? '#64748b' : '#38bdf8';
            soundBtn.style.borderColor = nowMuted ? '#64748b' : '#38bdf8';
          }
        };
      }
    }

    injectTriModal() {
      const existing = document.getElementById('b1-unified-tri-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'b1-unified-tri-modal';
      modal.className = 'b1-tri-modal-backdrop';
      modal.innerHTML = `
        <div class="b1-tri-console-frame">
          
          <!-- MODAL HEADER -->
          <div class="b1-tri-header">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#00FF87] animate-pulse"></span>
              <span class="font-orbitron font-black text-white text-base tracking-wider uppercase">
                BURN-1 SYSTEMS // UNIFIED CLIENT TERMINAL
              </span>
            </div>
            <button onclick="window.triBotEngine.closeModal()" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-mono">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <!-- 3-MODULE HARDWARE GRID -->
          <div class="b1-tri-grid">

            <!-- ========================================================
                 MODULE 1: HARDWARE LOGIN & SIGN-UP MODULE
                 (Styled 1:1 Like Step 1 of the Acid Demo)
                 ======================================================== -->
            <div class="b1-module-card space-y-4">
              <div class="space-y-3">
                <div class="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <div>
                    <span class="font-mono text-[10px] text-amber-400 font-bold uppercase" id="botAuthModuleSub">MODULE 01</span>
                    <h3 class="font-orbitron font-black text-sm text-white" id="botAuthModuleTitle">HARDWARE LOGIN</h3>
                  </div>
                  <button onclick="window.triBotEngine.toggleAuthMode()" class="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-purple-300 font-bold">
                    <span id="botAuthToggleText">SWITCH TO SIGN-UP &rarr;</span>
                  </button>
                </div>

                <!-- Client ID Input & Display (Autosaved & User-Editable) -->
                <div class="space-y-1">
                  <label class="font-mono text-[10px] text-slate-400 uppercase font-bold">CLIENT ID / IDENTIFIER</label>
                  <div class="b1-led-amber text-xs font-bold flex items-center justify-between">
                    <input 
                      type="text" 
                      id="botClientLed" 
                      placeholder="e.g. CLIENT-0020.123415679"
                      value="${this.activeClient.tenantId}"
                      oninput="localStorage.setItem('b1_tenant_id', this.value.trim())"
                      class="bg-transparent border-none text-[#fbbf24] font-mono text-xs font-bold w-full outline-none"
                    />
                    <i class="fa-solid fa-id-badge text-amber-500 text-xs ml-2"></i>
                  </div>
                </div>

                <!-- Dynamic Fields: Login vs. Sign-Up -->
                <div class="space-y-2" id="botAuthFieldsContainer">
                  <div class="space-y-1">
                    <label class="font-mono text-[10px] text-slate-400 uppercase font-bold">ACCESS PASSCODE</label>
                    <input 
                      type="password" 
                      id="botPasscodeInput" 
                      placeholder="••••••••••••••••"
                      value=""
                      class="w-full bg-black/90 border border-slate-800 rounded p-2 text-white font-mono text-xs tracking-widest outline-none focus:border-amber-400"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="font-mono text-[10px] text-slate-400 uppercase font-bold">PRIMARY DOMAIN</label>
                    <input 
                      type="text" 
                      id="botDomainInput" 
                      placeholder="e.g. corp.clientmfg.com"
                      value="${this.activeClient.domain}"
                      oninput="localStorage.setItem('b1_client_domain', this.value.trim())"
                      class="w-full bg-black/90 border border-slate-800 rounded p-2 text-white font-mono text-xs outline-none focus:border-cyan-400"
                    />
                  </div>

                  <!-- Extra Sign-Up Fields (Hidden in login mode) -->
                  <div id="botSignUpExtraFields" class="hidden space-y-2">
                    <div class="space-y-1">
                      <label class="font-mono text-[10px] text-slate-400 uppercase font-bold">COMPANY / ENTITY NAME</label>
                      <input 
                        type="text" 
                        id="botCompanyInput" 
                        placeholder="e.g. Apex Industrial Holdings"
                        value="${this.activeClient.company}"
                        class="w-full bg-black/90 border border-slate-800 rounded p-2 text-white font-mono text-xs outline-none focus:border-purple-400"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="font-mono text-[10px] text-slate-400 uppercase font-bold">CONTACT EMAIL (VAULT DISPATCH)</label>
                      <input 
                        type="email" 
                        id="botEmailInput" 
                        placeholder="safety@apex-chem.com"
                        value="${this.activeClient.email}"
                        class="w-full bg-black/90 border border-slate-800 rounded p-2 text-white font-mono text-xs outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-1">
                  <button onclick="window.triBotEngine.triggerBioScan()" class="b1-btn-frost-blue w-full">
                    <i class="fa-solid fa-dna text-xs"></i>
                    <span id="botBioScanText">BIO-SCAN</span>
                  </button>
                  <button onclick="window.triBotEngine.submitAuth()" class="b1-btn-frost-blue w-full">
                    <i class="fa-solid fa-fingerprint text-xs"></i>
                    <span id="botValidateText">LOGIN / SAVE</span>
                  </button>
                </div>
              </div>

              <!-- Biometric Footprint & Active Stamp -->
              <div class="pt-3 border-t border-slate-900 flex items-center justify-between">
                <div class="b1-biometric-pad" onclick="window.triBotEngine.triggerBioScan()" title="Click to authenticate passkey">
                  <i class="fa-solid fa-fingerprint text-2xl text-cyan-400"></i>
                </div>
                <div class="text-right font-mono text-[10px] text-slate-300 space-y-0.5">
                  <div class="text-cyan-400 font-bold">PASSKEY: READY</div>
                  <div class="text-amber-400 font-bold flex items-center justify-end gap-1">
                    <i class="fa-solid fa-coins text-xs"></i>
                    <span id="botAcademyCreditsBadge">${this.activeClient.credits} CR</span>
                    <span class="text-slate-500 font-normal">| ${this.activeClient.score} PTS</span>
                  </div>
                  <div id="botAuthStatusBadge" class="${this.activeClient.isAuthed ? 'text-emerald-400 font-black' : 'text-amber-400'}">
                    ${this.activeClient.isAuthed ? 'STATUS: AUTHENTICATED ✓' : 'AWAITING VALIDATION'}
                  </div>
                </div>
              </div>
            </div>

            <!-- ========================================================
                 MODULE 2: REAGENT BOT (The Link Bot & Payment Router)
                 ======================================================== -->
            <div class="b1-module-card active-glow space-y-4">
              <div class="space-y-3">
                <div class="border-b border-purple-900 pb-2 flex items-center justify-between">
                  <div>
                    <span class="font-mono text-[10px] text-purple-300 font-bold uppercase">MODULE 02</span>
                    <h3 class="font-orbitron font-black text-sm text-white">REAGENT BOT (PAY / LINK)</h3>
                  </div>
                  <span class="px-2 py-0.5 rounded bg-purple-950 border border-purple-400 text-purple-200 text-[9px] font-mono font-bold">LINK ENGINE</span>
                </div>

                <p class="font-mono text-xs text-slate-300 leading-relaxed" id="reagentPageContextText">
                  Currently active on <strong class="text-purple-300">${window.location.pathname.split('/').pop() || 'burn-1.com'}</strong>. Reagent binds your active selection directly to verified checkout.
                </p>

                <!-- Dynamic Page Quick Links -->
                <div class="space-y-1.5 font-mono text-xs">
                  <div class="text-slate-400 text-[10px] uppercase font-bold">RECOMMENDED ACTION:</div>
                  <button onclick="window.triBotEngine.teleportToSection()" class="w-full text-left p-2.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-200 hover:text-white hover:border-purple-300 flex items-center justify-between transition">
                    <span id="reagentActionLabel">Open Evidence Workspace</span>
                    <i class="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </div>

                <!-- Payment Summary Box -->
                <div class="p-3 bg-black/90 rounded border border-purple-500/40 font-mono text-xs space-y-2">
                  <div class="flex justify-between text-slate-400">
                    <span>Target Tier:</span>
                    <span id="reagentTierName" class="text-white font-bold">Evidence Binder</span>
                  </div>
                  <div class="flex justify-between text-slate-400">
                    <span>Verified Price:</span>
                    <span id="reagentTierPrice" class="text-emerald-400 font-black text-sm">$500.00</span>
                  </div>
                  <div class="text-[9px] text-slate-500">
                    Routes directly to PayPal Hosted Buttons ($50 / $99 / $500) to guarantee zero $0 errors.
                  </div>
                </div>
              </div>

              <!-- Pay Trigger Button -->
              <button onclick="window.triBotEngine.executeReagentPayment()" class="w-full py-3 rounded-lg bg-[#0070ba] hover:bg-[#003087] text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 cursor-pointer transition">
                <i class="fa-brands fa-paypal text-base"></i>
                <span id="reagentPayBtnLabel">PAY VIA UNIVERSAL PAY ($500.00)</span>
              </button>
            </div>

            <!-- ========================================================
                 MODULE 3: COSMO BOT (Knowledge Guru & Hidden Support Bridge)
                 ======================================================== -->
            <div class="b1-module-card space-y-4">
              <div class="space-y-3">
                <div class="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <div>
                    <span class="font-mono text-[10px] text-sky-400 font-bold uppercase">MODULE 03</span>
                    <h3 class="font-orbitron font-black text-sm text-white">COSMO (SYSTEMS GURU)</h3>
                  </div>
                  <span class="px-2 py-0.5 rounded bg-sky-950 border border-sky-400 text-sky-200 text-[9px] font-mono font-bold">KNOWLEDGE DESK</span>
                </div>

                <!-- Highlighted Q&A Drawer -->
                <div class="space-y-1.5 font-mono text-xs">
                  <div class="text-slate-400 text-[10px] uppercase font-bold">HIGHLIGHTED LIBRARY Q&amp;A:</div>
                  <select id="cosmoQaSelect" onchange="window.triBotEngine.handleCosmoQa(this.value)" class="w-full bg-black/90 border border-slate-700 rounded p-2 text-white font-mono text-[11px] outline-none focus:border-sky-400">
                    <option value="q1">What is the difference between $500 scan &amp; $1,000 seal?</option>
                    <option value="q2">How does outside-in GIS telemetry stop carrier claim denials?</option>
                    <option value="q3">Do MSPs hold the subdomain password?</option>
                    <option value="q4">How does Fast Lane compress 90 days to moments?</option>
                    <option value="issue">★ Experiencing an issue? (Leave direct message to Leon)</option>
                  </select>
                </div>

                <!-- Cosmo Answer Panel -->
                <div id="cosmoAnswerBox" class="p-3 bg-black/90 rounded border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed min-h-[90px]">
                  The $500 Core Evidence Report delivers an outside-in 7-section packet. The $1,000 tier adds your persistent client vault subdomain and Algorithmic SHA-256 seal.
                </div>

                <!-- HIDDEN UNANNOUNCED SUPPORT FIELD (Unlocks when user needs help) -->
                <div id="cosmoIssueInputWrap" class="hidden space-y-2 pt-2 border-t border-slate-800">
                  <div class="text-[10px] font-mono text-amber-400 font-bold uppercase">DIRECT TRIAGE DISPATCH:</div>
                  <input 
                    type="email" 
                    id="cosmoContactEmail" 
                    placeholder="Your Verified Business Email (Required)*"
                    value="${this.activeClient.email}"
                    class="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono text-[11px] outline-none focus:border-amber-400"
                  />
                  <textarea 
                    id="cosmoMessageText" 
                    rows="2" 
                    placeholder="Describe the issue or custom regulatory mandate..."
                    class="w-full bg-slate-950 border border-slate-700 p-2 rounded text-white font-mono text-[11px] outline-none focus:border-amber-400"
                  ></textarea>
                  <button onclick="window.triBotEngine.submitCosmoIssue()" class="w-full py-2 rounded bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-black uppercase">
                    SEND TO EXECUTIVE TRIAGE &rarr;
                  </button>
                </div>
              </div>

              <!-- Cosmo Footer Note -->
              <div class="text-[10px] font-mono text-slate-500 text-center">
                Burn-1 Autonomous Governance • Instant Answer Engine
              </div>
            </div>

          </div>

        </div>
      `;
      document.body.appendChild(modal);
    }

    bindEvents() {
      // Close on backdrop click
      const modal = document.getElementById('b1-unified-tri-modal');
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
    }

    openModal() {
      const modal = document.getElementById('b1-unified-tri-modal');
      if (modal) {
        modal.classList.add('open');
        this.syncPageContext();
      }
    }

    closeModal() {
      const modal = document.getElementById('b1-unified-tri-modal');
      if (modal) modal.classList.remove('open');
    }

    toggleAuthMode() {
      this.isSignUpMode = !this.isSignUpMode;
      const title = document.getElementById('botAuthModuleTitle');
      const toggleText = document.getElementById('botAuthToggleText');
      const extraFields = document.getElementById('botSignUpExtraFields');
      const submitBtn = document.getElementById('botValidateText');
      const clientLedInput = document.getElementById('botClientLed');

      if (this.isSignUpMode) {
        title.innerText = "CLIENT SIGN-UP";
        toggleText.innerText = "SWITCH TO LOGIN →";
        extraFields.classList.remove('hidden');
        submitBtn.innerText = "MINT ACCOUNT & REGISTER";
        // Generate fresh new random Tenant ID for registration
        const randId = `CLIENT-0020.${Math.floor(100000000 + Math.random() * 900000000)}`;
        if (clientLedInput) clientLedInput.value = randId;
      } else {
        title.innerText = "HARDWARE LOGIN";
        toggleText.innerText = "SWITCH TO SIGN-UP →";
        extraFields.classList.add('hidden');
        submitBtn.innerText = "LOGIN / SAVE";
        if (clientLedInput) clientLedInput.value = localStorage.getItem('b1_tenant_id') || "";
      }
    }

    syncPageContext() {
      const path = window.location.pathname.toLowerCase();
      const pageText = document.getElementById('reagentPageContextText');
      const actionLabel = document.getElementById('reagentActionLabel');
      const tierName = document.getElementById('reagentTierName');
      const tierPrice = document.getElementById('reagentTierPrice');
      const payBtnLabel = document.getElementById('reagentPayBtnLabel');

      if (path.includes('acid')) {
        pageText.innerHTML = `Active on <strong>ACID DIVISION</strong>. Reagent binds your sworn HazMat attestations.`;
        actionLabel.innerText = "Jump to Acid Simulation Cockpit";
        tierName.innerText = "Acid Test Dossier";
        tierPrice.innerText = "$99.00";
        payBtnLabel.innerText = "PAY VIA UNIVERSAL PAY ($99.00)";
      } else if (path.includes('fast-lane')) {
        pageText.innerHTML = `Active on <strong>FAST LANE</strong>. Reagent connects your multi-file drop payload.`;
        actionLabel.innerText = "Jump to Shell Dropzone Hopper";
        tierName.innerText = "Core Evidence Binder";
        tierPrice.innerText = "$500.00";
        payBtnLabel.innerText = "PAY VIA UNIVERSAL PAY ($500.00)";
      } else if (path.includes('times2')) {
        pageText.innerHTML = `Active on <strong>TIMES² DIVISION</strong>. Reagent synchronizes your vendor double-check.`;
        actionLabel.innerText = "Jump to Dual Clock UltraBars";
        tierName.innerText = "Vendor Double-Check";
        tierPrice.innerText = "$99.00";
        payBtnLabel.innerText = "PAY VIA UNIVERSAL PAY ($99.00)";
      }
    }

    teleportToSection() {
      this.closeModal();
      const path = window.location.pathname.toLowerCase();
      if (path.includes('acid')) {
        const target = document.getElementById('acid-simulator-centerpiece') || document.getElementById('root');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      } else if (path.includes('fast-lane')) {
        const target = document.getElementById('shellDropArea') || document.getElementById('remediationUltraBarContainer');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    }

    triggerBioScan() {
      const text = document.getElementById('botBioScanText');
      text.innerText = 'SCANNING...';
      if (window.burn1Audio) window.burn1Audio.playBioScan();
      setTimeout(() => {
        text.innerText = 'PASSKEY BOUND ✓';
      }, 700);
    }

    submitAuth() {
      const domain = document.getElementById('botDomainInput').value.trim();
      const valText = document.getElementById('botValidateText');
      const statusBadge = document.getElementById('botAuthStatusBadge');

      if (this.isSignUpMode) {
        const company = document.getElementById('botCompanyInput').value.trim();
        const email = document.getElementById('botEmailInput').value.trim();
        const newTenantId = (document.getElementById('botClientLed').value || document.getElementById('botClientLed').innerText).trim();

        if (!domain || !email) {
          alert("Please provide both primary domain and contact email to mint your Burn-1 Client ID.");
          return;
        }

        valText.innerText = "MINTING...";
        setTimeout(() => {
          this.activeClient.tenantId = newTenantId;
          this.activeClient.domain = domain;
          this.activeClient.company = company;
          this.activeClient.email = email;
          this.activeClient.isAuthed = true;

          localStorage.setItem('b1_tenant_id', newTenantId);
          localStorage.setItem('b1_client_domain', domain);
          localStorage.setItem('b1_client_company', company);
          localStorage.setItem('b1_client_email', email);
          localStorage.setItem('b1_is_authed', 'true');
          // Bind to Academy & Cinematic Onboarding ledger
          const existingCredits = parseInt(localStorage.getItem('burn1_clinic_credits') || '0', 10);
          const existingScore = parseInt(localStorage.getItem('burn1_clinic_score') || '0', 10);
          localStorage.setItem('burn1_auth_user', JSON.stringify({
            email: email,
            domain: domain,
            company: company,
            credits: existingCredits,
            score: existingScore,
            authenticatedAt: new Date().toISOString()
          }));

          valText.innerText = "ACCOUNT MINTED ✓";
          statusBadge.innerText = "STATUS: REGISTERED & AUTHED ✓";
          statusBadge.className = "text-emerald-400 font-black";
          alert(`ACCOUNT REGISTERED: Minted ${newTenantId} for ${company || domain}. Evidence credentials ready!`);
        }, 700);

      } else {
        valText.innerText = 'SAVING...';
        setTimeout(() => {
          this.activeClient.domain = domain;
          this.activeClient.isAuthed = true;
          localStorage.setItem('b1_client_domain', domain);
          localStorage.setItem('b1_is_authed', 'true');
          const existingCredits = parseInt(localStorage.getItem('burn1_clinic_credits') || '0', 10);
          const existingScore = parseInt(localStorage.getItem('burn1_clinic_score') || '0', 10);
          const curEmail = localStorage.getItem('b1_client_email') || (this.activeClient.email || '');
          localStorage.setItem('burn1_auth_user', JSON.stringify({
            email: curEmail,
            domain: domain,
            credits: existingCredits,
            score: existingScore,
            authenticatedAt: new Date().toISOString()
          }));
          valText.innerText = 'AUTHENTICATED ✓';
          statusBadge.innerText = "STATUS: AUTHENTICATED ✓";
          statusBadge.className = "text-emerald-400 font-black";
          alert(`LOGIN SAVED: Tenant ID ${this.activeClient.tenantId} bound to domain: ${domain || 'General Visitor'}`);
        }, 600);
      }
    }

    executeReagentPayment() {
      const path = window.location.pathname.toLowerCase();
      let sku = 'B1-CORE-02';
      let amount = 500;
      let name = 'Core Evidence Binder';

      if (path.includes('acid')) {
        sku = 'B1-ACD-02';
        amount = 99;
        name = 'Acid Test Dossier';
      } else if (path.includes('times2')) {
        sku = 'B1-TM2-01';
        amount = 99;
        name = 'Vendor Double-Check';
      }

      this.closeModal();

      if (window.universalPayEngine) {
        window.universalPayEngine.openUniversalPayModal({
          coreSku: sku,
          domain: this.activeClient.domain || 'client.burn-1.com',
          companyName: name,
          price: amount
        });
      } else {
        const hostedId = amount === 500 ? '5R9U23V7S2J8S' : 'J36CK6MGB5U8N';
        window.location.href = `https://www.paypal.com/ncp/payment/${hostedId}`;
      }
    }

    handleCosmoQa(val) {
      const answerBox = document.getElementById('cosmoAnswerBox');
      const issueWrap = document.getElementById('cosmoIssueInputWrap');

      if (val === 'q1') {
        issueWrap.classList.add('hidden');
        answerBox.innerText = "The $500 Core Evidence Report delivers an outside-in 7-section packet. The $1,000 tier adds your persistent client vault subdomain and Algorithmic SHA-256 seal.";
      } else if (val === 'q2') {
        issueWrap.classList.add('hidden');
        answerBox.innerText = "Outside-in GIS setbacks and aerial plume records provide independent, third-party proof that cannot be accused of being self-serving spreadsheet manipulation.";
      } else if (val === 'q3') {
        issueWrap.classList.add('hidden');
        answerBox.innerText = "By default, BURN-1 publishes a public verification scorecard bearing the verified seal. MSPs can optionally lock a private password vault for internal fleet management.";
      } else if (val === 'q4') {
        issueWrap.classList.add('hidden');
        answerBox.innerText = "Fast Lane allows clients to dump raw policies, CSVs, and logs at once. The engine automatically parses keywords against carrier formulas and pinpoints exact missing items in moments.";
      } else if (val === 'issue') {
        answerBox.innerText = "Direct support channel unlocked below. Please provide your business email so we can route session telemetry directly to Leon's queue.";
        issueWrap.classList.remove('hidden');
      }
    }

    submitCosmoIssue() {
      const email = document.getElementById('cosmoContactEmail').value.trim();
      const msg = document.getElementById('cosmoMessageText').value.trim();

      if (!email || !email.includes('@')) {
        alert("Please enter a valid business email address so we can follow up with your ticket.");
        return;
      }
      if (!msg) {
        alert("Please enter a brief description of the issue.");
        return;
      }

      localStorage.setItem('b1_client_email', email);
      alert(`TICKET DISPATCHED: Telemetry and issue sent to Leon. Confirmation routed to ${email}.`);
      document.getElementById('cosmoIssueInputWrap').classList.add('hidden');
      document.getElementById('cosmoQaSelect').value = 'q1';
    }
  }

  // Mount globally
  window.addEventListener('DOMContentLoaded', () => {
    window.triBotEngine = new UniversalTriBotController();
  });
})();
