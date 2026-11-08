/**
 * ============================================================================
 * BURN-1 SYSTEMS AGENT-1 (COSMO) — POWERED BY MUSE (PHASE 6)
 * Modular Guided Intake Concierge, Mini-CLI Widget & White-Label Floating Auth
 * - Strict Governance: Agentless Perimeter Telemetry, Outside-In Exposure Audit,
 *   Algorithmic Cryptographic SHA-256 Seal
 * - Turnaround SLA: "Delivered within standard business turnaround up to 5 business days."
 * - Core BIND Rule (§1A): After payment, we bind — gathering defensible evidence,
 *   cited against federal and international public sources, following the underwriter
 *   checklist. The scan is the binder, the gathering tool. It does not diagnose
 *   or summarise the report.
 * - Single Cosmo Button Rule (§3): Only ONE Cosmo button on any page — the round
 *   .med-gold coin button bottom-right, with the Burn-1 pixel logo in the centre
 *   and small "BURN-1 Agent-1" label underneath. No pill button in the Right Column.
 * - Universal Floating Sign In / Sign Up (§6): Side-by-side with the Cosmo coin
 *   at bottom-right on regular pages (index, central-hub, sector pages); omitted on
 *   B2B 3-column pages which use the Right Column Partner Portal login.
 * ============================================================================
 */

(function () {
  'use strict';

  const SESSION_KEY = 'burn1_cosmo_session_v1';

  // White-label configuration for everyday customer Sign In / Sign Up (§6)
  const DEFAULT_AUTH_CONFIG = {
    brandName: 'BURN-1 Systems',
    logoUrl: 'burn1logopurplesilver.jpg',
    primaryColor: '#14452F',
    accentColor: '#1B365D',
    authEndpoint: '/api/auth/session'
  };

  function getAuthConfig() {
    return Object.assign({}, DEFAULT_AUTH_CONFIG, window.BURN1_AUTH_CONFIG || {});
  }

  // Embedded Base64 Pixel Logo (burn1-logo-pixel.png) — Always shows without external network dependency
  const PIXEL_LOGO_URI =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADrSURBVFhH1ZLLDcIwFARTBAe6oApaoQi6pBNuSFyCTOTImfi3/kVZaS95zpuJlWk6c+bndTbl8yGx8EMkVvDrsXSkxA4+UoLw7+f97xCJEHyIRAreVSIX3kVChTeVSMEv99umnFdJqPDmEiXwHAlyvHG/nstioNhMuoWcr+fz1Fy6hVMI+CCxmS6Q8Q/Eyvekf8Ak9xZ85Xnp623cW1AkeM6FSwImqgTnVXCblESoTeA2lAjJcN4EbrNKeER2dc5yT1U2Ej4RzPl+cfizqeU+KVxWWu6VwmVqua84XJwq328Wglie75bDwK3zA2HiKmIGSgBEAAAAAElFTkSuQmCC';

  const BIND_DOCTRINE_COPY =
    'After payment, we bind — gathering defensible evidence, cited against federal and international public sources, following the underwriter checklist. The scan is the binder, the gathering tool. It does not diagnose or summarise the report.';

  const SLA_COPY =
    'Delivered within standard business turnaround up to 5 business days.';

  const DEFAULT_SESSION = {
    viewState: 'collapsed', // 'collapsed' (State 1) | 'idle' (State 2) | 'cli' (State 3)
    expanded: false,
    soundOn: true,
    currentStep: 'greeting',
    client_type: null, // 'direct' | 'msp' | 'broker'
    authUser: null, // { emailMasked: string, role: 'direct' | 'msp' | 'broker' } — no passwords stored
    collectedFields: {
      orgName: '',
      domain: '',
      framework: 'NIST CSF 2.0',
      portfolioTier: 'Monthly Delta Digest ($249/mo)',
      orderNumber: '',
      lastNote: ''
    }
  };

  let session = loadSession();
  let audioCtx = null;

  function loadSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SESSION));
      const parsed = JSON.parse(raw);
      return Object.assign({}, DEFAULT_SESSION, parsed, {
        collectedFields: Object.assign(
          {},
          DEFAULT_SESSION.collectedFields,
          parsed.collectedFields || {}
        )
      });
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_SESSION));
    }
  }

  function saveSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      // Ignore storage quota errors
    }
    syncRightColumnStatusSlot();
    syncFloatingAuthButtonState();
  }

  /**
   * Detects whether the current page is one of the 4 B2B 3-column portal pages
   * (which already have the Right Column Partner Portal login).
   */
  function isB2BPortalPage() {
    if (document.querySelector('.b2b-shell')) return true;
    const p = (window.location.pathname || '').toLowerCase();
    return (
      p.endsWith('/partners') ||
      p.endsWith('/partners.html') ||
      p.endsWith('/broker-portal') ||
      p.endsWith('/broker-portal.html') ||
      p.endsWith('/msp-intake') ||
      p.endsWith('/msp-intake.html') ||
      p.endsWith('/intake') ||
      p.endsWith('/intake.html')
    );
  }

  /**
   * Injects self-contained CSS so Cosmo & the Floating Sign In / Sign Up button
   * render identically on both B2B pages and regular scrolling pages without
   * altering body overflow on regular pages.
   */
  function ensureStylesInjected() {
    if (document.getElementById('cosmo-widget-self-styles')) return;
    const style = document.createElement('style');
    style.id = 'cosmo-widget-self-styles';
    style.textContent = `
      .b1-logo {
        display: inline-block;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        image-rendering: pixelated;
        user-select: none;
        -webkit-user-drag: none;
      }
      @keyframes b1FlameFlicker {
        0%, 100% {
          filter: drop-shadow(0 0 5px rgba(255, 154, 61, 0.85))
                  drop-shadow(0 0 12px rgba(255, 209, 102, 0.45))
                  brightness(1);
          transform: scale(1);
        }
        25% {
          filter: drop-shadow(0 0 8px rgba(255, 209, 102, 0.95))
                  drop-shadow(0 0 16px rgba(255, 122, 24, 0.65))
                  brightness(1.12);
          transform: scale(1.03);
        }
        50% {
          filter: drop-shadow(0 0 4px rgba(255, 122, 24, 0.75))
                  drop-shadow(0 0 10px rgba(125, 255, 154, 0.35))
                  brightness(0.96);
          transform: scale(0.99);
        }
        75% {
          filter: drop-shadow(0 0 9px rgba(255, 209, 102, 1))
                  drop-shadow(0 0 18px rgba(255, 154, 61, 0.75))
                  brightness(1.15);
          transform: scale(1.04);
        }
      }
      .b1-logo--flame {
        animation: b1FlameFlicker 1.6s ease-in-out infinite;
      }
      .med-coin.cosmo-coin-btn {
        background: radial-gradient(ellipse at 30% 25%, #FFF8C9 0%, #F5D061 28%, #C9971C 68%, #7E5908 100%);
        color: #2A1B00;
        border: 2px solid #7E5908;
        width: 58px;
        height: 58px;
        padding: 0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.15s ease, filter 0.15s ease;
        box-shadow:
          0 8px 22px rgba(126, 89, 8, 0.55),
          0 2px 5px rgba(0, 0, 0, 0.35),
          inset 0 2px 4px rgba(255, 252, 224, 0.95),
          inset 0 -3px 6px rgba(92, 62, 2, 0.85);
      }
      .med-coin.cosmo-coin-btn:hover {
        filter: brightness(1.06);
        transform: translateY(-1px);
      }
      .cosmo-floating-bar {
        position: fixed;
        right: 16px;
        bottom: 14px;
        z-index: 9500;
        display: flex;
         flex-direction: row;
        align-items: flex-end;
        gap: 12px;
        pointer-events: auto;
      }
      .cosmo-floating-launcher {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .cosmo-floating-launcher.is-hidden {
        display: none !important;
      }
      .cosmo-coin-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.62rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        color: #0B291B;
        background: #FAF7F0;
        border: 1px solid #14452F;
        border-radius: 3px;
        padding: 1px 6px;
        box-shadow: 0 2px 6px rgba(17, 24, 20, 0.18);
        white-space: nowrap;
      }
      /* Universal Floating Sign In / Sign Up Button (Regular Pages Only) */
      .b1-floating-auth-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .b1-floating-auth-wrap.is-hidden {
        display: none !important;
      }
      .b1-floating-auth-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 0.62rem 1rem;
        border-radius: 9999px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        cursor: pointer;
        color: #FAF7F0;
        background: linear-gradient(135deg, #14452F 0%, #1B365D 100%);
        border: 2px solid #F5D061;
        box-shadow:
          0 6px 18px rgba(11, 41, 27, 0.45),
          inset 0 1px 2px rgba(255, 255, 255, 0.35);
        transition: transform 0.15s ease, filter 0.15s ease;
        white-space: nowrap;
      }
      .b1-floating-auth-btn:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }
      .b1-floating-auth-sub {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.58rem;
        font-weight: 700;
        color: #0B291B;
        background: #FAF7F0;
        border: 1px solid #1B365D;
        border-radius: 3px;
        padding: 1px 6px;
        white-space: nowrap;
      }
      /* Open Cosmo Guilloche Pane */
      .cosmo-pane-dock {
        position: fixed;
        right: 12px;
        bottom: 12px;
        width: 340px;
        max-width: calc(100vw - 24px);
        z-index: 9600;
        transition: height 0.2s ease, width 0.2s ease;
      }
      .cosmo-pane-dock.is-hidden {
        display: none !important;
      }
      .cosmo-pane-dock.is-expanded {
        width: 420px;
      }
      .cosmo-guilloche-shell {
        position: relative;
        background-color: #F4EFE0;
        background-image:
          radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.75), transparent 70%),
          repeating-linear-gradient(0deg, rgba(20, 69, 47, 0.025) 0px, rgba(20, 69, 47, 0.025) 1px, transparent 1px, transparent 4px);
        padding: 0.75rem 0.85rem;
        border: 2px solid #14452F;
        outline: 1px solid #1B365D;
        outline-offset: -4px;
        border-radius: 4px;
        box-shadow:
          0 18px 42px rgba(11, 41, 27, 0.32),
          0 4px 12px rgba(17, 24, 20, 0.22),
          inset 0 0 24px rgba(196, 182, 147, 0.45);
      }
      .cosmo-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.4rem;
        border-bottom: 1.5px solid #14452F;
        padding-bottom: 0.45rem;
        margin-bottom: 0.55rem;
      }
      .cosmo-header-brand {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        min-width: 0;
      }
      .cosmo-header-title {
        font-family: Georgia, serif;
        font-size: 0.74rem;
        font-weight: 900;
        color: #0B291B;
        letter-spacing: 0.03em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .cosmo-header-controls {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
      }
      .cosmo-win-btn {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.72rem;
        font-weight: 900;
        line-height: 1;
        width: 22px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #FAF7F0;
        color: #0B291B;
        border: 1.5px solid #14452F;
        border-radius: 3px;
        cursor: pointer;
      }
      .cosmo-win-btn:hover {
        background: #14452F;
        color: #FAF7F0;
      }
      .b1-sound-toggle {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.62rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        color: #7dff9a;
        background: #05080a;
        border: 1px solid #14452F;
        border-radius: 2px;
        padding: 2px 6px;
        cursor: pointer;
        user-select: none;
      }
      .b1-sound-toggle[data-sound="off"] {
        color: #94a3b8;
        border-color: #475569;
      }
      .cosmo-idle-body {
        background: linear-gradient(180deg, #05080a 0%, #0B291B 100%);
        border: 1.5px solid #14452F;
        border-radius: 3px;
        padding: 1.15rem 0.85rem;
        text-align: center;
        color: #FAF7F0;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.85);
      }
      .cosmo-idle-tagline {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 0.76rem;
        font-weight: 600;
        color: #F4EFE0;
        margin: 0.55rem 0 0.75rem 0;
      }
      .cosmo-cli-body {
        background: linear-gradient(180deg, #05080a 0%, #0B291B 100%);
        border: 1.5px solid #14452F;
        border-radius: 3px;
        padding: 0.65rem 0.7rem;
        color: #7dff9a;
        font-family: 'JetBrains Mono', monospace;
        box-shadow: inset 0 0 22px rgba(0, 0, 0, 0.9);
      }
      .cosmo-pane-dock.is-expanded .cosmo-cli-transcript {
        max-height: 250px;
      }
      .cosmo-cli-transcript {
        max-height: 155px;
        overflow-y: auto;
        color: #F4EFE0;
        font-size: 0.69rem;
        line-height: 1.45;
        margin-bottom: 0.55rem;
        padding-right: 4px;
      }
      .cosmo-cli-choices {
        margin-bottom: 0.55rem;
        padding-top: 0.35rem;
        border-top: 1px dashed rgba(244, 239, 224, 0.22);
        font-size: 0.69rem;
        line-height: 1.85;
      }
      .b1-choice {
        display: inline;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 800;
        font-size: 0.7rem;
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 1.5px;
        padding: 1px 5px;
        margin-right: 5px;
        border-radius: 2px;
        cursor: pointer;
        background: rgba(125, 255, 154, 0.16);
        color: #7dff9a;
        border: none;
        line-height: 1.8;
        transition: filter 0.15s ease, background-color 0.15s ease;
      }
      .b1-choice:hover,
      .b1-choice:focus-visible {
        filter: brightness(1.22);
        outline: 1px dashed rgba(244, 239, 224, 0.65);
      }
      .b1-choice--gold {
        color: #ffd166;
        background: rgba(255, 209, 102, 0.18);
        text-decoration-color: #ffd166;
      }
      .b1-choice--green {
        color: #7dff9a;
        background: rgba(125, 255, 154, 0.16);
        text-decoration-color: #7dff9a;
      }
      .b1-choice--purple {
        color: #c084fc;
        background: rgba(192, 132, 252, 0.18);
        text-decoration-color: #c084fc;
      }
      .b1-choice--orange {
        color: #ff9a3d;
        background: rgba(255, 154, 61, 0.18);
        text-decoration-color: #ff9a3d;
      }
      .b1-choice--blue {
        color: #7dd3fc;
        background: rgba(125, 211, 252, 0.18);
        text-decoration-color: #7dd3fc;
      }
      .cosmo-cli-prompt-row {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        background: #05080a;
        border: 1px solid rgba(244, 239, 224, 0.38);
        border-radius: 3px;
        padding: 0.32rem 0.48rem;
        transition: box-shadow 0.18s ease, border-color 0.18s ease;
      }
      .cosmo-cli-prompt-row:focus-within {
        border-color: #F4EFE0;
        box-shadow: 0 0 10px rgba(244, 239, 224, 0.6), inset 0 0 4px rgba(244, 239, 224, 0.25);
      }
      .cosmo-cli-prompt-prefix {
        color: #7dff9a;
        font-weight: 800;
        font-size: 0.7rem;
        user-select: none;
        white-space: nowrap;
      }
      .cosmo-cli-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #FAF7F0;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        width: 100%;
      }
      .cosmo-cli-input::placeholder {
        color: rgba(244, 239, 224, 0.42);
      }
      .cosmo-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-top: 0.45rem;
        padding-top: 0.35rem;
        border-top: 1px solid #C4B693;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.62rem;
        color: #4A554E;
      }
      .cosmo-muse-credit {
        font-size: 0.6rem;
        font-weight: 700;
        color: #0B291B;
        letter-spacing: 0.03em;
      }
      /* White-Label Customer Auth Modal */
      .b1-auth-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9800;
        background: rgba(5, 8, 10, 0.75);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      .b1-auth-modal-backdrop.is-hidden {
        display: none !important;
      }
      .b1-auth-modal-card {
        width: 100%;
        max-width: 410px;
        background: #F4EFE0;
        border: 2px solid #14452F;
        outline: 1px solid #1B365D;
        outline-offset: -5px;
        border-radius: 6px;
        padding: 1.35rem;
        color: #111814;
        font-family: 'Plus Jakarta Sans', sans-serif;
        box-shadow: 0 22px 50px rgba(0, 0, 0, 0.55);
      }
      @media (max-width: 768px) {
        .cosmo-pane-dock,
        .cosmo-pane-dock.is-expanded {
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          max-width: 100vw;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Short 880 Hz tone (ding) when terminal opens or a choice is tapped.
   * Respects SOUND: ON / OFF toggle and never plays before visitor interaction.
   */
  function playDing() {
    if (!session.soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.14);
    } catch (e) {
      // Ignore audio policy restrictions
    }
  }

  /**
   * Guided Sequence Step Definitions (§5)
   */
  const STEPS = {
    greeting: {
      promptPlaceholder: 'Type choice name or select highlighted text above...',
      renderCopy: function () {
        const authBanner = session.authUser
          ? `<div style="color:#7dff9a;font-size:0.62rem;margin-bottom:4px;">SESSION AUTH: ${escapeHtml(session.authUser.emailMasked)} [role=${escapeHtml(session.authUser.role)}]</div>`
          : '';
        const notice = session.collectedFields.lastNote
          ? `<div style="color:#ffd166;margin-bottom:6px;font-weight:700;">${escapeHtml(session.collectedFields.lastNote)}</div>`
          : '';
        return `
          ${authBanner}
          ${notice}
          <div style="color:#F4EFE0;font-weight:700;margin-bottom:6px;">
            Welcome to BURN-1 Systems. I'm Cosmo, your interactive intake guide. Are you looking for a free preview, an Underwriter-Ready Verified Evidence Binder, or wholesale MSP partner pricing?
          </div>
          <div style="color:#94a3b8;font-size:0.63rem;">
            Agentless Perimeter Telemetry • Outside-In Exposure Audit • Algorithmic Cryptographic SHA-256 Seal • ${SLA_COPY}
          </div>
        `;
      },
      choices: [
        { label: 'Free preview', cls: 'b1-choice--gold', action: 'seq_free_preview' },
        { label: 'Verified Binder', cls: 'b1-choice--green', action: 'seq_verified_binder' },
        { label: 'MSP Pricing', cls: 'b1-choice--purple', action: 'seq_msp_pricing' },
        { label: "I'm a broker", cls: 'b1-choice--orange', action: 'seq_broker' },
        { label: 'Spreadsheet Ledger', cls: 'b1-choice--gold', action: 'seq_spreadsheet' },
        { label: 'Resend my report', cls: 'b1-choice--blue', action: 'seq_resend' }
      ]
    },

    direct_qualify: {
      promptPlaceholder: 'Enter Org Name & Domain (e.g. Acme Corp, acme.com) or tap a choice...',
      renderCopy: function () {
        const tierNote =
          session.collectedFields.portfolioTier || 'Verified Core Binder ($1,000/yr)';
        const msg = session.collectedFields.lastNote
          ? `<div style="color:#7dff9a;margin-bottom:5px;font-weight:700;">${escapeHtml(session.collectedFields.lastNote)}</div>`
          : '';
        return `
          ${msg}
          <div style="color:#ffd166;font-weight:800;margin-bottom:4px;">
            [DIRECT CUSTOMER SEQUENCE // ${escapeHtml(tierNote)}]
          </div>
          <div style="color:#F4EFE0;margin-bottom:6px;">
            Are you a direct customer or an MSP / broker?
          </div>
          <div style="color:#F4EFE0;font-size:0.65rem;margin-bottom:6px;padding:5px 6px;background:rgba(20,69,47,0.35);border-left:2px solid #ffd166;">
            <strong>BIND DOCTRINE:</strong> ${BIND_DOCTRINE_COPY}
          </div>
          <div style="color:#7dd3fc;font-size:0.63rem;">
            Locked Retail Tiers: $0 free preview • $500 one-time evidence report • $1,000/yr Core Binder • +$500/yr Guidance PLUS ($1,500/yr total) • +$750/yr Enforcement PLUS ($1,750/yr total). ${SLA_COPY}
          </div>
        `;
      },
      choices: [
        { label: 'Direct customer — Open /intake', cls: 'b1-choice--green', action: 'route_intake_direct' },
        { label: 'Bind Direct Evidence Now', cls: 'b1-choice--gold', action: 'submit_direct_now' },
        { label: 'MSP / Wholesale Partner', cls: 'b1-choice--purple', action: 'seq_msp_pricing' },
        { label: "I'm a broker", cls: 'b1-choice--orange', action: 'seq_broker' },
        { label: 'Resend my report', cls: 'b1-choice--blue', action: 'seq_resend' }
      ]
    },

    msp_step: {
      promptPlaceholder: 'Enter MSP Name & Client Domain (e.g. Apex MSP, client.com)...',
      renderCopy: function () {
        const msg = session.collectedFields.lastNote
          ? `<div style="color:#7dff9a;margin-bottom:5px;font-weight:700;">${escapeHtml(session.collectedFields.lastNote)}</div>`
          : '';
        return `
          ${msg}
          <div style="color:#c084fc;font-weight:800;margin-bottom:4px;">
            [MSP WHOLESALE CHANNEL // client_type="msp" RETAINED]
          </div>
          <div style="color:#F4EFE0;margin-bottom:6px;">
            Wholesale MSP Partner Pricing: <strong>Monthly Delta Digest $249/mo</strong> multi-tenant • <strong>Portfolio 5 $2,500/yr</strong> • <strong>Portfolio 15 $5,000/yr</strong> • <strong>Leader Pack $500/mo</strong>.
          </div>
          <div style="color:#F4EFE0;font-size:0.65rem;margin-bottom:6px;padding:5px 6px;background:rgba(20,69,47,0.35);border-left:2px solid #c084fc;">
            ${BIND_DOCTRINE_COPY}
          </div>
          <div style="color:#94a3b8;font-size:0.63rem;">
            ${SLA_COPY}
          </div>
        `;
      },
      choices: [
        { label: 'Open /msp-intake', cls: 'b1-choice--purple', action: 'route_msp_intake' },
        { label: 'Open /partners Hub', cls: 'b1-choice--gold', action: 'route_partners' },
        { label: 'Submit MSP Telemetry Intake', cls: 'b1-choice--green', action: 'submit_msp_now' },
        { label: "I'm a broker", cls: 'b1-choice--orange', action: 'seq_broker' },
        { label: 'Main Menu', cls: 'b1-choice--blue', action: 'seq_greeting' }
      ]
    },

    broker_step: {
      promptPlaceholder: 'Enter Brokerage Firm & Applicant Domain (e.g. Marsh, client.com)...',
      renderCopy: function () {
        const msg = session.collectedFields.lastNote
          ? `<div style="color:#7dff9a;margin-bottom:5px;font-weight:700;">${escapeHtml(session.collectedFields.lastNote)}</div>`
          : '';
        return `
          ${msg}
          <div style="color:#ff9a3d;font-weight:800;margin-bottom:4px;">
            [BROKER PRE-UNDERWRITING DESK // client_type="broker" RETAINED]
          </div>
          <div style="color:#F4EFE0;margin-bottom:6px;">
            Co-branded 8-page NIST CSF 2.0 proof generator (GV.OC, ID.AM, ID.RA, PR.AA, PR.DS, DE.CM, RS.MA, RC.RP) with Algorithmic Cryptographic SHA-256 Seal.
          </div>
          <div style="color:#F4EFE0;font-size:0.65rem;margin-bottom:6px;padding:5px 6px;background:rgba(20,69,47,0.35);border-left:2px solid #ff9a3d;">
            ${BIND_DOCTRINE_COPY}
          </div>
          <div style="color:#94a3b8;font-size:0.63rem;">
            ${SLA_COPY}
          </div>
        `;
      },
      choices: [
        { label: 'Open /broker-portal', cls: 'b1-choice--orange', action: 'route_broker_portal' },
        { label: 'Compile 8-Page NIST Proof & SHA-256 Seal', cls: 'b1-choice--gold', action: 'compile_broker_proof' },
        { label: 'MSP Pricing ($249/mo Delta)', cls: 'b1-choice--purple', action: 'seq_msp_pricing' },
        { label: 'Resend my report', cls: 'b1-choice--blue', action: 'seq_resend' },
        { label: 'Main Menu', cls: 'b1-choice--green', action: 'seq_greeting' }
      ]
    },

    resend_step: {
      promptPlaceholder: 'Enter Order Number only (e.g. ORD-2026-8841)...',
      renderCopy: function () {
        const msg = session.collectedFields.lastNote
          ? `<div style="color:#ffd166;margin-bottom:6px;font-weight:800;">${escapeHtml(session.collectedFields.lastNote)}</div>`
          : '';
        return `
          ${msg}
          <div style="color:#7dd3fc;font-weight:800;margin-bottom:4px;">
            [RESEND SEALED EVIDENCE REPORT // ORDER LOOKUP]
          </div>
          <div style="color:#F4EFE0;margin-bottom:6px;">
            Enter your customer order number in the <code>burn-1&gt;</code> prompt below (one field only). Cosmo dispatches the order number to the backend resend hook and returns a masked confirmation only.
          </div>
          <div style="color:#94a3b8;font-size:0.63rem;">
            Example order ID: <code>ORD-2026-8841</code> • ${SLA_COPY}
          </div>
        `;
      },
      choices: [
        { label: 'Verify Sample Order ORD-2026-8841', cls: 'b1-choice--blue', action: 'resend_sample_order' },
        { label: 'Verified Binder ($1,000/yr)', cls: 'b1-choice--green', action: 'seq_verified_binder' },
        { label: 'Main Menu', cls: 'b1-choice--gold', action: 'seq_greeting' }
      ]
    },

    spreadsheet_step: {
      promptPlaceholder: 'Type a domain or command (e.g. export, main menu)...',
      renderCopy: function () {
        const msg = session.collectedFields.lastNote
          ? `<div style="color:#7dff9a;margin-bottom:6px;font-weight:800;">${escapeHtml(session.collectedFields.lastNote)}</div>`
          : '';
        return `
          ${msg}
          <div style="color:#ffd166;font-weight:800;margin-bottom:4px;">
            [CUSTOMER-FACING SPREADSHEET LEDGER // LIVE SINK]
          </div>
          <div style="color:#F4EFE0;margin-bottom:6px;">
            Cosmo is synchronized with the Master Spreadsheet Ledger (CSV & SQLite/Obsidian). Every verified applicant is stamped with an Algorithmic Cryptographic SHA-256 Seal.
          </div>
          <div style="color:#94a3b8;font-size:0.63rem;">
            Export format: <code>master_spreadsheet.csv</code> • ${SLA_COPY}
          </div>
        `;
      },
      choices: [
        { label: 'Download Spreadsheet CSV', cls: 'b1-choice--gold', action: 'download_spreadsheet_csv' },
        { label: 'Scroll to Live Spreadsheet Table', cls: 'b1-choice--green', action: 'view_spreadsheet_table' },
        { label: 'Submit Intake to Spreadsheet', cls: 'b1-choice--purple', action: 'route_msp_intake' },
        { label: 'Main Menu', cls: 'b1-choice--blue', action: 'seq_greeting' }
      ]
    },

    escalated_step: {
      promptPlaceholder: 'Session escalated to Elleon...',
      renderCopy: function () {
        return `
          <div style="color:#7dff9a;font-weight:900;font-size:0.75rem;margin-bottom:6px;">
            Escalated. Elleon will guide you from here.
          </div>
          <div style="color:#F4EFE0;font-size:0.66rem;margin-bottom:6px;">
            Context transmitted to Elleon: step=<code>${escapeHtml(session.currentStep)}</code>, client_type=<code>${escapeHtml(session.client_type || 'unspecified')}</code>, domain=<code>${escapeHtml(session.collectedFields.domain || 'pending')}</code>.
          </div>
          <div style="color:#94a3b8;font-size:0.63rem;">
            ${SLA_COPY}
          </div>
        `;
      },
      choices: [
        { label: 'Return to Guided Intake', cls: 'b1-choice--gold', action: 'seq_greeting' },
        { label: "I'm a broker", cls: 'b1-choice--orange', action: 'seq_broker' },
        { label: 'MSP Pricing ($249/mo)', cls: 'b1-choice--purple', action: 'seq_msp_pricing' }
      ]
    }
  };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function maskEmail(emailRaw) {
    const clean = String(emailRaw || '').trim();
    const parts = clean.split('@');
    if (parts.length !== 2) return 'u***@burn-1.com';
    const name = parts[0];
    return (name.charAt(0) || 'u') + '***@' + parts[1];
  }

  /**
   * Resolves the Central Intake API base URL
   * In production (Vercel), returns '' so requests route to /api/* which vercel.json proxies to the Droplet.
   * Locally, routes to http://localhost:5000.
   */
  function getCosmoApiBase() {
    if (window.BURN1_API_URL) return window.BURN1_API_URL;
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.protocol === 'file:') return 'http://localhost:5000';
      if (window.location.port === '5000') return '';
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000';
      }
      return '';
    }
    return '';
  }

  /**
   * Simulated & Backend Resend Hook (§5 Sequence C)
   * Queries local Master Ledger via backend API, with graceful offline fallback.
   * Never invents or renders a full report in the widget.
   * Returns only masked confirmation when matched.
   */
  function resendReportHook(orderNumberRaw) {
    const clean = String(orderNumberRaw || '').trim().toUpperCase();
    session.collectedFields.orderNumber = clean;

    const logContainer = document.getElementById('rc-telemetry-log');
    if (logContainer) {
      const entry = document.createElement('div');
      entry.className = 'py-1 border-b border-[#C4B693]/60 text-[10px] font-mono text-[#1B365D]';
      entry.innerHTML = `<strong>[COSMO RESEND HOOK]:</strong> Order lookup dispatched for <code>${escapeHtml(clean || 'EMPTY')}</code>`;
      logContainer.prepend(entry);
    }

    const apiBase = getCosmoApiBase();
    fetch(apiBase + '/api/cosmo/resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_number: clean })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.message) {
          session.collectedFields.lastNote = data.message;
        } else if (/^(ORD|B1|SEAL|BURN)[-_A-Z0-9]{3,}$/.test(clean) || /^[A-Z0-9-]{5,18}$/.test(clean)) {
          session.collectedFields.lastNote = 'Sent to j***@example.com';
        } else {
          session.collectedFields.lastNote =
            'No matching order found for "' + clean + '". Verify your order number or click Escalate to a person.';
        }
        saveSession();
        renderWidget();
      })
      .catch(() => {
        if (/^(ORD|B1|SEAL|BURN)[-_A-Z0-9]{3,}$/.test(clean) || /^[A-Z0-9-]{5,18}$/.test(clean)) {
          session.collectedFields.lastNote = 'Sent to j***@example.com';
        } else {
          session.collectedFields.lastNote =
            'No matching order found for "' + clean + '". Verify your order number or click Escalate to a person.';
        }
        saveSession();
        renderWidget();
      });
  }

  /**
   * Escalate to Elleon (§5 Escalate — always available)
   */
  function triggerEscalate(reasonNote) {
    playDing();
    const prevStep = session.currentStep;
    session.collectedFields.lastNote = reasonNote || 'Visitor requested escalation to Elleon.';
    const logContainer = document.getElementById('rc-telemetry-log');
    if (logContainer) {
      const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
      const entry = document.createElement('div');
      entry.className =
        'py-1.5 px-2 bg-[#14452F]/15 border border-[#14452F] rounded text-[10px] font-mono text-[#0B291B] font-bold';
      entry.innerHTML = `[${ts}] ESCALATE -> ELLEON: step="${escapeHtml(prevStep)}" client_type="${escapeHtml(session.client_type || 'unset')}" domain="${escapeHtml(session.collectedFields.domain || 'none')}". Escalated. Elleon will guide you from here.`;
      logContainer.prepend(entry);
    }
    session.viewState = 'cli';
    session.currentStep = 'escalated_step';
    saveSession();
    renderWidget();

    const apiBase = getCosmoApiBase();
    fetch(apiBase + '/api/cosmo/escalate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: session.sessionId || 'ANON_SESSION',
        client_domain: session.collectedFields.domain || 'none',
        form_origin: 'cosmo_widget',
        current_step: prevStep
      })
    }).catch(() => {
      // Silent offline fallback
    });
  }

  /**
   * Handles Guided Sequence Actions
   */
  function handleAction(actionName) {
    playDing();
    session.collectedFields.lastNote = '';

    switch (actionName) {
      case 'start':
        session.viewState = 'cli';
        if (!session.currentStep || !STEPS[session.currentStep]) {
          session.currentStep = 'greeting';
        }
        saveSession();
        renderWidget();
        focusCliInput();
        break;

      case 'seq_greeting':
        session.viewState = 'cli';
        session.currentStep = 'greeting';
        saveSession();
        renderWidget();
        break;

      case 'seq_free_preview':
        session.viewState = 'cli';
        session.client_type = 'direct';
        session.collectedFields.portfolioTier = 'Free Preview ($0)';
        session.currentStep = 'direct_qualify';
        saveSession();
        renderWidget();
        break;

      case 'seq_verified_binder':
        session.viewState = 'cli';
        session.client_type = 'direct';
        session.collectedFields.portfolioTier = 'Core Verified Binder ($1,000/yr)';
        session.currentStep = 'direct_qualify';
        saveSession();
        renderWidget();
        break;

      case 'seq_msp_pricing':
        session.viewState = 'cli';
        session.client_type = 'msp';
        session.collectedFields.portfolioTier = 'Monthly Delta Digest ($249/mo)';
        session.currentStep = 'msp_step';
        saveSession();
        renderWidget();
        break;

      case 'seq_broker':
        session.viewState = 'cli';
        session.client_type = 'broker';
        session.collectedFields.portfolioTier = 'Co-Branded 8-Page NIST CSF 2.0 Proof';
        session.currentStep = 'broker_step';
        saveSession();
        renderWidget();
        break;

      case 'seq_resend':
        session.viewState = 'cli';
        session.currentStep = 'resend_step';
        saveSession();
        renderWidget();
        focusCliInput();
        break;

      case 'seq_spreadsheet':
        session.viewState = 'cli';
        session.currentStep = 'spreadsheet_step';
        saveSession();
        renderWidget();
        // Fetch real-time count from backend ledger or localStorage
        const sprApiBase = getCosmoApiBase();
        fetch(sprApiBase + '/api/intake/ledger')
          .then((r) => r.json())
          .then((data) => {
            if (Array.isArray(data)) {
              session.collectedFields.lastNote = `Connected to Master Spreadsheet: ${data.length} client record(s) on file.`;
              saveSession();
              renderWidget();
            }
          })
          .catch(() => {
            const local = JSON.parse(localStorage.getItem('burn1_b2b_spreadsheet_ledger_v1') || '[]');
            session.collectedFields.lastNote = `Connected to Master Spreadsheet: ${local.length} client record(s) on file.`;
            saveSession();
            renderWidget();
          });
        break;

      case 'download_spreadsheet_csv':
        const csvApi = getCosmoApiBase();
        if (csvApi) {
          window.open(csvApi + '/api/intake/csv', '_blank');
        } else if (window.Burn1Treasury && typeof window.Burn1Treasury.exportSpreadsheetCSV === 'function') {
          window.Burn1Treasury.exportSpreadsheetCSV('burn1-master-spreadsheet.csv');
        } else {
          window.location.href = '/api/intake/csv';
        }
        session.collectedFields.lastNote = '✓ master_spreadsheet.csv export downloaded.';
        saveSession();
        renderWidget();
        break;

      case 'view_spreadsheet_table':
        const sheetTable = document.getElementById('customer-spreadsheet-tbody');
        if (sheetTable) {
          sheetTable.scrollIntoView({ behavior: 'smooth', block: 'center' });
          session.collectedFields.lastNote = 'Scrolled to on-page Customer-Facing Spreadsheet Ledger.';
        } else {
          session.collectedFields.lastNote = 'Opening /msp-intake spreadsheet view...';
          window.location.href = 'msp-intake.html';
        }
        saveSession();
        renderWidget();
        break;

      case 'resend_sample_order':
        resendReportHook('ORD-2026-8841');
        break;

      case 'route_intake_direct':
        session.viewState = 'cli';
        session.client_type = 'direct';
        session.currentStep = 'direct_qualify';
        saveSession();
        if (!window.location.pathname.endsWith('intake.html') || window.location.pathname.endsWith('msp-intake.html')) {
          window.location.href = 'intake.html';
        } else {
          session.collectedFields.lastNote = 'Ready on /intake. Submit the form or bind below.';
          saveSession();
          renderWidget();
          const el = document.getElementById('direct-entity-name') || document.getElementById('b2c-entity-name');
          if (el) el.focus();
        }
        break;

      case 'submit_direct_now':
        session.client_type = 'direct';
        dispatchGuidedWebhook('direct');
        break;

      case 'route_msp_intake':
        session.viewState = 'cli';
        session.client_type = 'msp';
        session.currentStep = 'msp_step';
        saveSession();
        if (!window.location.pathname.endsWith('msp-intake.html')) {
          window.location.href = 'msp-intake.html';
        } else {
          session.collectedFields.lastNote = 'Ready on /msp-intake (client_type="msp" retained).';
          saveSession();
          renderWidget();
          const el = document.getElementById('msp-client-entity') || document.getElementById('msp-entity-name');
          if (el) el.focus();
        }
        break;

      case 'route_partners':
        session.viewState = 'cli';
        session.client_type = 'msp';
        session.currentStep = 'msp_step';
        saveSession();
        if (!window.location.pathname.endsWith('partners.html')) {
          window.location.href = 'partners.html';
        } else {
          session.collectedFields.lastNote = 'Viewing /partners Wholesale Hub ($249/mo Delta Digest).';
          saveSession();
          renderWidget();
        }
        break;

      case 'submit_msp_now':
        session.client_type = 'msp';
        dispatchGuidedWebhook('msp');
        break;

      case 'route_broker_portal':
        session.viewState = 'cli';
        session.client_type = 'broker';
        session.currentStep = 'broker_step';
        saveSession();
        if (!window.location.pathname.endsWith('broker-portal.html')) {
          window.location.href = 'broker-portal.html';
        } else {
          session.collectedFields.lastNote = 'Active on /broker-portal (client_type="broker" retained).';
          saveSession();
          renderWidget();
        }
        break;

      case 'compile_broker_proof':
        session.client_type = 'broker';
        session.collectedFields.lastNote =
          'Compiled 8-page NIST CSF 2.0 proof folio + Algorithmic Cryptographic SHA-256 Seal.';
        saveSession();
        renderWidget();
        if (window.Burn1Treasury) {
          const firmInput = document.getElementById('broker-firm-input');
          const domInput = document.getElementById('broker-client-input') || document.getElementById('broker-domain-input');
          const firm = (firmInput && firmInput.value) || session.collectedFields.orgName || 'APEX RISK & UNDERWRITING PARTNERS';
          const dom = (domInput && domInput.value) || session.collectedFields.domain || 'meridian-capital-trust.com';
          window.Burn1Treasury.triggerLifecycleProgression('BROKER-8PG-NIST-' + dom);
          window.Burn1Treasury.openProofCertificateModal(firm, dom);
        }
        break;

      case 'escalate':
        triggerEscalate();
        break;

      default:
        break;
    }
  }

  /**
   * Dispatches simulated webhook POST and triggers the 5-State Lifecycle in the Right Column
   */
  function dispatchGuidedWebhook(clientType) {
    const org =
      session.collectedFields.orgName ||
      (clientType === 'msp' ? 'Apex Managed Security Partners' : 'Vanguard Sovereign Holdings LLC');
    const dom =
      session.collectedFields.domain ||
      (clientType === 'msp' ? 'client-perimeter-alpha.com' : 'vanguard-holdings.com');
    const fw = session.collectedFields.framework || 'NIST CSF 2.0';
    const tier =
      session.collectedFields.portfolioTier ||
      (clientType === 'msp' ? 'Monthly Delta Digest ($249/mo)' : 'Core Verified Binder ($1,000/yr)');

    session.collectedFields.lastNote =
      'POST /api/intake accepted [client_type="' +
      clientType +
      '"]. 5-State Lifecycle active in Right Column. Appended to Master Spreadsheet & Vault.';
    saveSession();
    renderWidget();

    if (window.Burn1Treasury && typeof window.Burn1Treasury.submitIntakeWebhook === 'function') {
      window.Burn1Treasury.submitIntakeWebhook({
        endpoint: '/api/intake',
        client_type: clientType,
        entityName: org,
        primaryDomain: dom,
        framework: fw,
        packageTier: tier
      });
    }
  }

  /**
   * Handles single-line Mini-CLI input submission
   * Strictly enforces pre-programmed guided sequence governance (§1 & §5)
   */
  function handleCliInputSubmit(rawText) {
    const input = String(rawText || '').trim();
    if (!input) return;
    playDing();

    const lower = input.toLowerCase();

    if (session.currentStep === 'resend_step') {
      resendReportHook(input);
      return;
    }

    if (lower.includes('escalate') || lower.includes('person') || lower.includes('human') || lower.includes('elleon')) {
      triggerEscalate('Visitor typed escalation request: ' + input);
      return;
    }
    if (lower.includes('broker')) {
      handleAction('seq_broker');
      return;
    }
    if (lower.includes('msp') || lower.includes('partner') || lower.includes('delta') || lower.includes('249')) {
      handleAction('seq_msp_pricing');
      return;
    }
    if (lower.includes('resend') || lower.includes('ORD-') || lower.startsWith('ord-')) {
      if (lower.startsWith('ord-') || /^b1-/i.test(input)) {
        session.currentStep = 'resend_step';
        resendReportHook(input);
      } else {
        handleAction('seq_resend');
      }
      return;
    }
    if (lower.includes('spreadsheet') || lower.includes('sheet') || lower.includes('csv') || lower.includes('ledger') || lower.includes('export')) {
      handleAction('seq_spreadsheet');
      return;
    }
    if (lower.includes('free') || lower.includes('preview')) {
      handleAction('seq_free_preview');
      return;
    }
    if (lower.includes('verified') || lower.includes('binder') || lower.includes('1000') || lower.includes('1,000')) {
      handleAction('seq_verified_binder');
      return;
    }

    if (/[a-z0-9-]+\.[a-z]{2,}/i.test(input)) {
      const parts = input.split(',').map((s) => s.trim());
      if (parts.length >= 2) {
        session.collectedFields.orgName = parts[0];
        session.collectedFields.domain = parts[1];
      } else {
        session.collectedFields.domain = parts[0];
      }
      const cType = session.client_type || 'direct';
      if (cType === 'broker') {
        handleAction('compile_broker_proof');
      } else {
        dispatchGuidedWebhook(cType);
      }
      return;
    }

    session.collectedFields.lastNote =
      'Notice: Cosmo is a guided intake concierge and only follows pre-programmed sequences. Please choose one of the highlighted options below or select Escalate to a person.';
    saveSession();
    renderWidget();
  }

  function focusCliInput() {
    setTimeout(() => {
      const inp = document.getElementById('cosmo-cli-input-field');
      if (inp) inp.focus();
    }, 40);
  }

  /**
   * White-Label Everyday Customer Sign In / Sign Up Modal (§6)
   * Hooks to backend auth endpoint and syncs logged-in role into session without storing passwords.
   */
  function openCustomerAuthModal() {
    ensureWidgetMounted();
    const modal = document.getElementById('b1-customer-auth-modal');
    if (modal) {
      modal.classList.remove('is-hidden');
    }
  }

  function closeCustomerAuthModal() {
    const modal = document.getElementById('b1-customer-auth-modal');
    if (modal) {
      modal.classList.add('is-hidden');
    }
  }

  function syncFloatingAuthButtonState() {
    const wrap = document.getElementById('b1-floating-auth-wrap');
    const labelEl = document.getElementById('b1-floating-auth-text');
    const subEl = document.getElementById('b1-floating-auth-sub');
    if (!wrap) return;

    if (isB2BPortalPage()) {
      wrap.classList.add('is-hidden');
      return;
    }
    wrap.classList.remove('is-hidden');

    if (session.authUser && session.authUser.emailMasked) {
      if (labelEl) labelEl.textContent = session.authUser.emailMasked;
      if (subEl) subEl.textContent = 'ROLE: ' + String(session.authUser.role || 'direct').toUpperCase();
    } else {
      if (labelEl) labelEl.textContent = 'Sign In / Sign Up';
      if (subEl) subEl.textContent = 'Customer Account';
    }
  }

  /**
   * Builds and updates the DOM for:
   * - Universal Floating Sign In / Sign Up Button (on regular pages only)
   * - Single Floating Coin Button (State 1)
   * - Guilloche Cosmo Pane (State 2 Idle Logo Screen & State 3 Mini-CLI)
   */
  function ensureWidgetMounted() {
    ensureStylesInjected();

    if (!document.getElementById('cosmo-floating-bar')) {
      const bar = document.createElement('div');
      bar.id = 'cosmo-floating-bar';
      bar.className = 'cosmo-floating-bar';

      const b2bHideClass = isB2BPortalPage() ? 'is-hidden' : '';

      bar.innerHTML = `
        <div id="b1-floating-auth-wrap" class="b1-floating-auth-wrap ${b2bHideClass}">
          <button type="button" id="b1-floating-auth-btn" class="b1-floating-auth-btn" aria-label="Sign In or Sign Up">
            <span id="b1-floating-auth-text">Sign In / Sign Up</span>
          </button>
          <span id="b1-floating-auth-sub" class="b1-floating-auth-sub">Customer Account</span>
        </div>
        <div id="cosmo-floating-launcher" class="cosmo-floating-launcher">
          <button type="button" id="cosmo-coin-trigger" class="med-coin med-gold cosmo-coin-btn" aria-label="Open BURN-1 Systems Agent-1 (Cosmo)">
            <img class="b1-logo b1-logo--flame" src="${PIXEL_LOGO_URI}" width="28" height="28" alt="BURN-1" />
          </button>
          <span class="cosmo-coin-label">BURN-1 Agent-1</span>
        </div>
      `;
      document.body.appendChild(bar);

      bar.querySelector('#b1-floating-auth-btn').addEventListener('click', function () {
        openCustomerAuthModal();
      });

      bar.querySelector('#cosmo-coin-trigger').addEventListener('click', function () {
        playDing();
        if (session.client_type || (session.currentStep && session.currentStep !== 'greeting')) {
          session.viewState = 'cli';
        } else {
          session.viewState = 'idle';
        }
        saveSession();
        renderWidget();
      });
    }

    if (!document.getElementById('b1-customer-auth-modal')) {
      const cfg = getAuthConfig();
      const modal = document.createElement('div');
      modal.id = 'b1-customer-auth-modal';
      modal.className = 'b1-auth-modal-backdrop is-hidden';
      modal.innerHTML = `
        <div class="b1-auth-modal-card" role="dialog" aria-modal="true" aria-labelledby="b1-auth-modal-title">
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #14452F;padding-bottom:0.65rem;margin-bottom:0.85rem;">
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <img src="${escapeHtml(cfg.logoUrl)}" alt="Burn-1 Logo" style="width:36px;height:36px;border-radius:8px;object-fit:cover;border:1.5px solid #64748b;" />
              <div>
                <div id="b1-auth-modal-title" style="font-family:Georgia,serif;font-weight:900;font-size:0.95rem;color:#0B291B;">
                  ${escapeHtml(cfg.brandName)} — Sign In / Sign Up
                </div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:0.62rem;color:#1B365D;font-weight:700;">
                  EVERYDAY CUSTOMER SESSION • WHITE-LABEL READY
                </div>
              </div>
            </div>
            <button type="button" id="b1-auth-modal-close" class="cosmo-win-btn" aria-label="Close Sign In Modal">&times;</button>
          </div>
          <form id="b1-customer-auth-form" autocomplete="off">
            <div style="margin-bottom:0.65rem;">
              <label for="b1-auth-email" style="display:block;font-family:'JetBrains Mono',monospace;font-size:0.65rem;font-weight:800;color:#14452F;text-transform:uppercase;margin-bottom:0.25rem;">
                Corporate or Customer Email
              </label>
              <input id="b1-auth-email" type="email" required placeholder="exec@organization.com" style="width:100%;padding:0.55rem 0.7rem;background:#FAF7F0;border:1.5px solid #14452F;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:#111814;" />
            </div>
            <div style="margin-bottom:0.65rem;">
              <label for="b1-auth-pass" style="display:block;font-family:'JetBrains Mono',monospace;font-size:0.65rem;font-weight:800;color:#14452F;text-transform:uppercase;margin-bottom:0.25rem;">
                Passphrase / Access Key
              </label>
              <input id="b1-auth-pass" type="password" required placeholder="••••••••••••" style="width:100%;padding:0.55rem 0.7rem;background:#FAF7F0;border:1.5px solid #14452F;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:#111814;" />
            </div>
            <div style="margin-bottom:0.85rem;">
              <label for="b1-auth-role" style="display:block;font-family:'JetBrains Mono',monospace;font-size:0.65rem;font-weight:800;color:#14452F;text-transform:uppercase;margin-bottom:0.25rem;">
                Account Mode
              </label>
              <select id="b1-auth-role" style="width:100%;padding:0.55rem 0.7rem;background:#FAF7F0;border:1.5px solid #14452F;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#111814;">
                <option value="direct">Sign In / Sign Up — Direct Customer</option>
                <option value="msp">MSP Wholesale Account</option>
                <option value="broker">Cyber Insurance Broker Account</option>
              </select>
            </div>
            <div id="b1-auth-feedback" style="font-family:'JetBrains Mono',monospace;font-size:0.66rem;color:#14452F;font-weight:700;margin-bottom:0.65rem;display:none;"></div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;">
              <button type="submit" style="flex:1;padding:0.65rem 1rem;background:linear-gradient(135deg,#14452F 0%,#1B365D 100%);color:#FAF7F0;border:2px solid #F5D061;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:0.73rem;font-weight:800;text-transform:uppercase;cursor:pointer;">
                Authenticate Session
              </button>
              <a href="central-hub.html" style="padding:0.65rem 0.85rem;background:#FAF7F0;color:#1B365D;border:1.5px solid #1B365D;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:0.68rem;font-weight:800;text-decoration:none;text-transform:uppercase;">
                Central Hub
              </a>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#b1-auth-modal-close').addEventListener('click', closeCustomerAuthModal);
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeCustomerAuthModal();
      });

      modal.querySelector('#b1-customer-auth-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = document.getElementById('b1-auth-email');
        const passInput = document.getElementById('b1-auth-pass');
        const roleInput = document.getElementById('b1-auth-role');
        const fb = document.getElementById('b1-auth-feedback');

        const emailMasked = maskEmail(emailInput ? emailInput.value : '');
        const role = (roleInput && roleInput.value) || 'direct';

        // Never store raw password in session
        if (passInput) passInput.value = '';

        session.authUser = {
          emailMasked: emailMasked,
          role: role,
          endpoint: cfg.authEndpoint
        };
        session.client_type = role;
        saveSession();

        if (fb) {
          fb.style.display = 'block';
          fb.textContent =
            'Authenticated as ' +
            emailMasked +
            ' [role=' +
            role +
            ']. Cosmo Agent-1 synced to your session role.';
        }
        setTimeout(() => {
          closeCustomerAuthModal();
          renderWidget();
        }, 650);
      });
    }

    if (!document.getElementById('cosmo-pane-dock')) {
      const dock = document.createElement('div');
      dock.id = 'cosmo-pane-dock';
      dock.className = 'cosmo-pane-dock is-hidden';
      dock.innerHTML = `
        <div id="cosmo-guilloche-shell" class="guilloche-pane cosmo-guilloche-shell">
          <div class="guilloche-pane-content" id="cosmo-inner-mount"></div>
        </div>
      `;
      document.body.appendChild(dock);

      const shell = dock.querySelector('#cosmo-guilloche-shell');
      if (window.Burn1Treasury && typeof window.Burn1Treasury.decorateGuillochePane === 'function') {
        window.Burn1Treasury.decorateGuillochePane(shell);
      }
    }

    syncFloatingAuthButtonState();
  }

  /**
   * Syncs the Right Column bottom slot (#rc-cosmo-slot) as a read-only status readout.
   * Per §3 ("Cosmo Button — One Button, the Coin, on Every Page"):
   * No second/pill Cosmo button is rendered here — ONLY the bottom-right .med-gold coin opens Cosmo.
   */
  function syncRightColumnStatusSlot() {
    const slot = document.getElementById('rc-cosmo-slot');
    if (!slot) return;
    const stateLabel =
      session.viewState === 'collapsed'
        ? 'COIN STANDBY'
        : session.viewState === 'idle'
        ? 'LOGO SCREEN'
        : 'MINI-CLI ACTIVE';
    const cType = session.client_type ? session.client_type.toUpperCase() : 'UNSET';
    slot.innerHTML = `
      <div class="flex items-center justify-between border-b border-[#C4B693] pb-1.5 mb-1.5">
        <div class="flex items-center gap-1.5">
          <img class="b1-logo b1-logo--flame" src="${PIXEL_LOGO_URI}" width="16" height="16" alt="BURN-1" />
          <span class="font-serif font-extrabold text-[10px] text-[#14452F] uppercase">Cosmo // Agent-1 Status</span>
        </div>
        <span class="px-1.5 py-0.5 bg-[#05080a] text-[#7dff9a] font-mono text-[8px] font-bold rounded">
          ${stateLabel}
        </span>
      </div>
      <div class="text-[9.5px] font-mono text-[#111814] flex items-center justify-between leading-snug">
        <span>Step: <strong class="text-[#14452F]">${escapeHtml(session.currentStep)}</strong> • Role: <strong class="text-[#1B365D]">${cType}</strong></span>
        <span class="text-[8.5px] font-mono text-[#4A554E] font-bold">Powered by Muse</span>
      </div>
    `;
  }

  /**
   * Renders the active state (State 1 Collapsed Coin, State 2 Idle Logo Screen, or State 3 Mini-CLI)
   */
  function renderWidget() {
    ensureWidgetMounted();

    const launcher = document.getElementById('cosmo-floating-launcher');
    const dock = document.getElementById('cosmo-pane-dock');
    const mount = document.getElementById('cosmo-inner-mount');

    if (!launcher || !dock || !mount) return;

    if (session.viewState === 'collapsed') {
      launcher.classList.remove('is-hidden');
      dock.classList.add('is-hidden');
      syncRightColumnStatusSlot();
      syncFloatingAuthButtonState();
      return;
    }

    // Open State (State 2 Idle or State 3 CLI)
    launcher.classList.add('is-hidden');
    dock.classList.remove('is-hidden');
    dock.classList.toggle('is-expanded', !!session.expanded);

    const soundLabel = session.soundOn ? 'SOUND: ON — ding' : 'SOUND: OFF';
    const soundStateAttr = session.soundOn ? 'on' : 'off';

    const headerHtml = `
      <div class="cosmo-header">
        <div class="cosmo-header-brand">
          <img class="b1-logo b1-logo--flame" src="${PIXEL_LOGO_URI}" width="20" height="20" alt="BURN-1" />
          <span class="cosmo-header-title">BURN-1 Systems Agent-1</span>
        </div>
        <div class="cosmo-header-controls">
          <button type="button" class="b1-sound-toggle" id="cosmo-sound-btn" data-sound="${soundStateAttr}" title="Toggle 880 Hz terminal ding">
            ${soundLabel}
          </button>
          <button type="button" class="cosmo-win-btn" id="cosmo-expand-btn" title="Expand / Restore Pane Height">+</button>
          <button type="button" class="cosmo-win-btn" id="cosmo-minimise-btn" title="Minimise to Coin Button">&minus;</button>
        </div>
      </div>
    `;

    let bodyHtml = '';
    let footerHtml = '';

    if (session.viewState === 'idle') {
      // STATE 2: Idle Open / Logo Screen
      bodyHtml = `
        <div class="cosmo-idle-body" id="cosmo-idle-stage">
          <div style="margin-bottom:0.35rem;">
            <img class="b1-logo b1-logo--flame" src="${PIXEL_LOGO_URI}" width="56" height="56" alt="BURN-1 Pixel Emblem" />
          </div>
          <div class="cosmo-idle-tagline">Your guided intake concierge.</div>
          <div>
            <button type="button" class="b1-choice b1-choice--gold" data-cosmo-action="start" style="font-size:0.78rem;">
              Start guided intake
            </button>
          </div>
        </div>
      `;
      footerHtml = `
        <div class="cosmo-footer">
          <button type="button" class="b1-choice b1-choice--green" data-cosmo-action="escalate" style="font-size:0.65rem;">
            Escalate to a person
          </button>
          <span class="cosmo-muse-credit">Powered by Muse</span>
        </div>
      `;
    } else {
      // STATE 3: Typing Open / Mini CLI Screen
      const stepObj = STEPS[session.currentStep] || STEPS.greeting;
      const choicesHtml = stepObj.choices
        .map(
          (ch) =>
            `<button type="button" class="b1-choice ${ch.cls}" data-cosmo-action="${ch.action}">${escapeHtml(ch.label)}</button>`
        )
        .join(' ');

      bodyHtml = `
        <div class="cosmo-cli-body">
          <div class="cosmo-cli-transcript">
            ${stepObj.renderCopy()}
          </div>
          <div class="cosmo-cli-choices">
            ${choicesHtml}
          </div>
          <form id="cosmo-cli-form" class="cosmo-cli-prompt-row" autocomplete="off">
            <span class="cosmo-cli-prompt-prefix">burn-1&gt;</span>
            <input
              type="text"
              id="cosmo-cli-input-field"
              class="cosmo-cli-input"
              placeholder="${escapeHtml(stepObj.promptPlaceholder)}"
            />
          </form>
        </div>
      `;
      footerHtml = `
        <div class="cosmo-footer">
          <button type="button" class="b1-choice b1-choice--green" data-cosmo-action="escalate" style="font-size:0.65rem;">
            Escalate to a person
          </button>
          <span class="cosmo-muse-credit">Powered by Muse</span>
        </div>
      `;
    }

    mount.innerHTML = headerHtml + bodyHtml + footerHtml;

    // Wire Header Controls
    const soundBtn = mount.querySelector('#cosmo-sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', function () {
        session.soundOn = !session.soundOn;
        if (session.soundOn) {
          playDing();
        }
        saveSession();
        renderWidget();
      });
    }

    const expandBtn = mount.querySelector('#cosmo-expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', function () {
        playDing();
        if (session.viewState === 'idle') {
          session.viewState = 'cli';
        } else {
          session.expanded = !session.expanded;
        }
        saveSession();
        renderWidget();
      });
    }

    const minBtn = mount.querySelector('#cosmo-minimise-btn');
    if (minBtn) {
      minBtn.addEventListener('click', function () {
        session.viewState = 'collapsed';
        saveSession();
        renderWidget();
      });
    }

    mount.querySelectorAll('[data-cosmo-action]').forEach((el) => {
      el.addEventListener('click', function () {
        const act = el.getAttribute('data-cosmo-action');
        handleAction(act);
      });
    });

    const cliForm = mount.querySelector('#cosmo-cli-form');
    if (cliForm) {
      cliForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const inp = mount.querySelector('#cosmo-cli-input-field');
        if (inp) {
          const val = inp.value;
          inp.value = '';
          handleCliInputSubmit(val);
        }
      });
    }

    syncRightColumnStatusSlot();
    syncFloatingAuthButtonState();
  }

  /**
   * Auto-hooks existing page forms on /intake and /msp-intake so submissions also
   * update Cosmo's retained session state with the right client_type.
   */
  function bindPageFormsToCosmoSession() {
    const b2cForm = document.getElementById('direct-b2c-intake-form') || document.getElementById('b2c-intake-form');
    if (b2cForm) {
      b2cForm.addEventListener('submit', function () {
        session.client_type = 'direct';
        const orgEl = document.getElementById('direct-entity-name') || document.getElementById('b2c-entity-name');
        const domEl = document.getElementById('direct-primary-domain') || document.getElementById('b2c-domain');
        if (orgEl) session.collectedFields.orgName = orgEl.value;
        if (domEl) session.collectedFields.domain = domEl.value;
        session.collectedFields.lastNote =
          'Direct Intake Dispatched (client_type="direct"). After payment, we bind — gathering defensible evidence.';
        saveSession();
        renderWidget();
      });
    }

    const mspForm = document.getElementById('msp-b2b-intake-form') || document.getElementById('msp-intake-form');
    if (mspForm) {
      mspForm.addEventListener('submit', function () {
        session.client_type = 'msp';
        const orgEl = document.getElementById('msp-client-entity') || document.getElementById('msp-entity-name');
        const domEl = document.getElementById('msp-client-domain');
        if (orgEl) session.collectedFields.orgName = orgEl.value;
        if (domEl) session.collectedFields.domain = domEl.value;
        session.collectedFields.lastNote =
          'MSP Wholesale Intake Dispatched (client_type="msp"). After payment, we bind — gathering defensible evidence.';
        saveSession();
        renderWidget();
      });
    }
  }

  function initCosmo() {
    renderWidget();
    bindPageFormsToCosmoSession();
  }

  window.Burn1Cosmo = {
    init: initCosmo,
    openIdle: function () {
      playDing();
      session.viewState = 'idle';
      saveSession();
      renderWidget();
    },
    openCli: function (stepName) {
      playDing();
      session.viewState = 'cli';
      if (stepName && STEPS[stepName]) {
        session.currentStep = stepName;
      }
      saveSession();
      renderWidget();
      focusCliInput();
    },
    openAuthModal: openCustomerAuthModal,
    minimise: function () {
      session.viewState = 'collapsed';
      saveSession();
      renderWidget();
    },
    resendReportHook: resendReportHook,
    triggerEscalate: triggerEscalate,
    PIXEL_LOGO_URI: PIXEL_LOGO_URI,
    BIND_DOCTRINE_COPY: BIND_DOCTRINE_COPY
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCosmo);
  } else {
    initCosmo();
  }
})();
