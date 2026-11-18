/**
 * BURN-1 Systems — V2 Gamified Ecosystem
 * Phase 1: Fast Lane & Cinematic Intake Controller (ES6 Classes)
 * Authority: Darden Trust Architecture // Burning Friction... Shattering Time
 */

const ORDINANCE_CITATIONS = {
  freezer: 'NIST CSF 2.0 (PR.AC / DE.CM) • CISA KEV 22-01 • RFC 7489 (DMARC) • RFC 8446 (TLS 1.3)',
  acid: 'OSHA 29 CFR 1910.1200 • NFPA 70E Electrical Safety • EPA EPCRA Tier II • ISO 45001',
  times2: 'NYDFS 23 NYCRR 500 • SEC 4-Day Cyber Disclosure • Municipal Code §14-402 • NAIC MDL-668',
  sizzlean: 'UCC Article 2 Commercial Standard • White-Label MSP Governance • NIST SP 800-171 Rev 2'
};

/**
 * Renders subtle Treasury-grade spirograph guilloche curves on the background canvas
 * adhering strictly to Money Green (#14452F) and Printed Money Blue (#1B365D).
 */
class TreasuryGuillocheEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.handleResize = this.render.bind(this);
    window.addEventListener('resize', this.handleResize);
    this.render();
  }

  render() {
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    this.drawRosette(ctx, width * 0.86, height * 0.2, 210, 82, 125, '#14452F');
    this.drawRosette(ctx, width * 0.12, height * 0.78, 240, 95, 140, '#1B365D');
  }

  drawRosette(ctx, cx, cy, R, r, d, strokeHex) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = strokeHex;
    ctx.lineWidth = 0.75;

    const totalSteps = 1400;
    for (let i = 0; i <= totalSteps; i++) {
      const theta = (i / totalSteps) * Math.PI * 24;
      const k = (R - r) / r;
      const x = cx + (R - r) * Math.cos(theta) + d * Math.cos(k * theta);
      const y = cy + (R - r) * Math.sin(theta) - d * Math.sin(k * theta);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * High-Speed Dropzone Engine:
 * Handles file drag-and-drop, text/URL drops, client-side SHA-256 artifact hashing,
 * and automatic domain extraction to eliminate manual intake friction.
 */
class HighSpeedDropzoneEngine {
  constructor({ dropzoneEl, fileInputEl, manifestEl, onDomainDetected, onArtifactAdded }) {
    this.dropzoneEl = dropzoneEl;
    this.fileInputEl = fileInputEl;
    this.manifestEl = manifestEl;
    this.onDomainDetected = onDomainDetected;
    this.onArtifactAdded = onArtifactAdded;
    this.artifacts = [];

    this.bindEvents();
  }

  bindEvents() {
    if (!this.dropzoneEl) return;

    this.dropzoneEl.addEventListener('click', () => this.fileInputEl.click());
    this.dropzoneEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.fileInputEl.click();
      }
    });

    ['dragenter', 'dragover'].forEach((evtName) => {
      this.dropzoneEl.addEventListener(evtName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropzoneEl.classList.add('dropzone-active');
      });
    });

    ['dragleave', 'drop'].forEach((evtName) => {
      this.dropzoneEl.addEventListener(evtName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.dropzoneEl.classList.remove('dropzone-active');
      });
    });

    this.dropzoneEl.addEventListener('drop', async (e) => {
      const droppedText = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
      if (droppedText) {
        const extracted = this.extractDomainFromString(droppedText);
        if (extracted) this.onDomainDetected(extracted);
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await this.ingestFiles(Array.from(e.dataTransfer.files));
      }
    });

    this.dropzoneEl.addEventListener('paste', (e) => {
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const extracted = this.extractDomainFromString(pasted);
      if (extracted) this.onDomainDetected(extracted);
    });

    this.fileInputEl.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        await this.ingestFiles(Array.from(e.target.files));
      }
    });
  }

  extractDomainFromString(raw) {
    if (!raw) return null;
    const cleaned = raw.trim().replace(/^https?:\/\//i, '').split(/[/?#\s]/)[0].toLowerCase();
    const domainPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    return domainPattern.test(cleaned) ? cleaned : null;
  }

  async ingestFiles(files) {
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const digestHex = await FastLaneCryptoUtil.sha256ArrayBuffer(buffer);

      // Inspect small text/csv/json files for embedded domain hints
      if (file.size < 250000 && /\.(txt|csv|json|log)$/i.test(file.name)) {
        const textSample = new TextDecoder().decode(buffer);
        const match = textSample.match(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|org|net|io|gov|edu|co|us|health)\b/i);
        if (match) {
          this.onDomainDetected(match[0].toLowerCase());
        }
      }

      const record = {
        name: file.name,
        sizeKb: (file.size / 1024).toFixed(1),
        sha256Short: digestHex.slice(0, 12)
      };
      this.artifacts.push(record);
      this.onArtifactAdded(this.artifacts);
    }
    this.renderManifest();
  }

  renderManifest() {
    this.manifestEl.innerHTML = this.artifacts
      .map(
        (art) => `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-moneyGreen text-neonEmerald font-mono text-[11px] border border-printedBlue">
            <span>✓ ${this.escapeHtml(art.name)}</span>
            <span class="text-scrollTan/75">(${art.sizeKb}KB • ${art.sha256Short}…)</span>
          </span>
        `
      )
      .join('');
  }

  escapeHtml(str) {
    return str.replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  }
}

/**
 * Cryptographic Helper implementing the exact BURN-1 SHA-256 Seal specification:
 * SHA-256("BURN1_SEAL:{domain}:{timestamp}:NIST_CSF_2.0:CISA_KEV_VERIFIED")
 */
class FastLaneCryptoUtil {
  static async sha256String(input) {
    const encoded = new TextEncoder().encode(input);
    return FastLaneCryptoUtil.sha256ArrayBuffer(encoded);
  }

  static async sha256ArrayBuffer(buffer) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  static generateSingleUseToken() {
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `B1_TOK_${hex.toUpperCase()}`;
  }

  static generateOrderId(division) {
    const stamp = Date.now().toString(36).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `B1-${division.toUpperCase()}-${stamp}-${rand}`;
  }
}

/**
 * Master Controller for Progressive Disclosure UltraBar & 3-Step Cinematic Accordion Intake
 */
class FastLaneUltraBarController {
  constructor() {
    this.modalEl = document.getElementById('ultraBarCinematicModal');
    this.floatingPillEl = document.getElementById('ultraBarFloatingPill');
    this.expandBtn = document.getElementById('expandUltraBarBtn');
    this.minimizeBtn = document.getElementById('minimizeUltraBarBtn');

    this.domainInput = document.getElementById('clientDomainInput');
    this.emailInput = document.getElementById('contactEmailInput');
    this.divisionSelect = document.getElementById('divisionSelect');
    this.citationPreview = document.getElementById('activeCitationPreview');

    this.mfaCheckbox = document.getElementById('attestMfaCheckbox');
    this.backupCheckbox = document.getElementById('attestBackupCheckbox');
    this.lifecycleBadge = document.getElementById('projectedLifecycleBadge');
    this.sealFormulaEl = document.getElementById('sealFormulaString');
    this.liveShaEl = document.getElementById('liveSha256Preview');

    this.summaryOrderIdEl = document.getElementById('summaryOrderId');
    this.summaryTokenEl = document.getElementById('summarySessionToken');
    this.summaryAmountEl = document.getElementById('summaryAmountDue');
    this.csvRowPreviewEl = document.getElementById('csvRowPreview');
    this.paypalBtn = document.getElementById('paypalBindCheckoutBtn');
    this.dispatchStatusEl = document.getElementById('dispatchApiStatus');

    this.state = {
      isExpanded: false,
      activeStep: 1,
      unlockedStep: 1,
      timestampIso: new Date().toISOString(),
      orderId: FastLaneCryptoUtil.generateOrderId('freezer'),
      sessionToken: FastLaneCryptoUtil.generateSingleUseToken(),
      candidateSeal: '',
      artifacts: []
    };

    this.initDropzone();
    this.bindEvents();
    this.refreshSealAndLedger();
  }

  initDropzone() {
    this.dropzone = new HighSpeedDropzoneEngine({
      dropzoneEl: document.getElementById('fastLaneDropzone'),
      fileInputEl: document.getElementById('artifactFileInput'),
      manifestEl: document.getElementById('droppedFilesManifest'),
      onDomainDetected: (domain) => {
        if (!this.domainInput.value.trim()) {
          this.domainInput.value = domain;
        }
        this.refreshSealAndLedger();
      },
      onArtifactAdded: (artifacts) => {
        this.state.artifacts = artifacts;
        this.refreshSealAndLedger();
      }
    });
  }

  bindEvents() {
    // Bot-logic Progressive Disclosure triggers (Context CTA buttons + Minimized Floating UltraBar)
    document.querySelectorAll('[data-trigger-ultrabar]').forEach((btn) => {
      btn.addEventListener('click', () => this.openCinematicIntake());
    });

    this.expandBtn.addEventListener('click', () => this.openCinematicIntake());
    this.minimizeBtn.addEventListener('click', () => this.minimizeToUltraBar());

    // Close on backdrop click outside panel
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.minimizeToUltraBar();
      }
    });

    // Escape key minimizes back to floating UltraBar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isExpanded) {
        this.minimizeToUltraBar();
      }
    });

    // Accordion headers
    document.querySelectorAll('[data-accordion-toggle]').forEach((headerBtn) => {
      headerBtn.addEventListener('click', () => {
        const targetStep = Number(headerBtn.getAttribute('data-accordion-toggle'));
        if (targetStep <= this.state.unlockedStep) {
          this.setActiveAccordion(targetStep);
        }
      });
    });

    // Step progression buttons
    document.getElementById('advanceToStep2Btn').addEventListener('click', () => {
      if (!this.validateStep1()) return;
      this.state.unlockedStep = Math.max(this.state.unlockedStep, 2);
      document.getElementById('step1StatusBadge').textContent = 'VERIFIED ✓';
      document.getElementById('step2StatusBadge').textContent = 'ACTIVE';
      this.setActiveAccordion(2);
      this.refreshSealAndLedger();
    });

    document.getElementById('advanceToStep3Btn').addEventListener('click', () => {
      this.state.unlockedStep = 3;
      document.getElementById('step2StatusBadge').textContent = 'ATTESTED ✓';
      document.getElementById('step3StatusBadge').textContent = 'READY TO BIND';
      this.setActiveAccordion(3);
      this.refreshSealAndLedger();
    });

    // Live reactive inputs
    [this.domainInput, this.emailInput, this.divisionSelect, this.mfaCheckbox, this.backupCheckbox].forEach((el) => {
      el.addEventListener('input', () => {
        if (el === this.divisionSelect) {
          this.state.orderId = FastLaneCryptoUtil.generateOrderId(this.divisionSelect.value);
        }
        this.refreshSealAndLedger();
      });
      el.addEventListener('change', () => this.refreshSealAndLedger());
    });

    // PayPal Settlement & Intake API Queue Dispatch
    this.paypalBtn.addEventListener('click', (e) => {
      if (!this.validateStep1()) {
        e.preventDefault();
        this.setActiveAccordion(1);
        return;
      }
      this.dispatchIntakeToSupervisor();
    });
  }

  openCinematicIntake() {
    this.state.isExpanded = true;
    this.modalEl.classList.add('is-open');
    this.floatingPillEl.classList.add('opacity-0', 'pointer-events-none');
    this.expandBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => this.domainInput.focus(), 220);
  }

  minimizeToUltraBar() {
    this.state.isExpanded = false;
    this.modalEl.classList.remove('is-open');
    this.floatingPillEl.classList.remove('opacity-0', 'pointer-events-none');
    this.expandBtn.setAttribute('aria-expanded', 'false');
  }

  setActiveAccordion(stepNumber) {
    this.state.activeStep = stepNumber;
    document.querySelectorAll('.accordion-item').forEach((item) => {
      const itemStep = Number(item.getAttribute('data-step'));
      const header = item.querySelector('.accordion-header');
      if (itemStep === stepNumber) {
        item.classList.add('is-active');
        header.classList.remove('bg-printedBlue');
        header.classList.add('bg-moneyGreen');
      } else {
        item.classList.remove('is-active');
        header.classList.remove('bg-moneyGreen');
        header.classList.add('bg-printedBlue');
      }
    });
  }

  validateStep1() {
    const rawDomain = this.domainInput.value.trim().replace(/^https?:\/\//i, '').split('/')[0];
    const email = this.emailInput.value.trim();
    const msgEl = document.getElementById('step1ValidationMsg');

    const validDomain = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(rawDomain);
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!validDomain) {
      msgEl.innerHTML = '<span class="text-moneyGreen font-bold">⚠ Enter or drop a valid target domain (e.g., acmemfg.com) to proceed.</span>';
      this.domainInput.focus();
      return false;
    }

    if (!validEmail) {
      msgEl.innerHTML = '<span class="text-moneyGreen font-bold">⚠ Enter a valid Vault Delivery Email for dossier issuance.</span>';
      this.emailInput.focus();
      return false;
    }

    this.domainInput.value = rawDomain.toLowerCase();
    msgEl.innerHTML = `Citation Matrix: <span id="activeCitationPreview">${ORDINANCE_CITATIONS[this.divisionSelect.value]}</span>`;
    return true;
  }

  async refreshSealAndLedger() {
    const division = this.divisionSelect.value;
    const selectedOpt = this.divisionSelect.options[this.divisionSelect.selectedIndex];
    const price = selectedOpt.getAttribute('data-price');
    const productType = selectedOpt.getAttribute('data-product');
    const paypalButtonId = selectedOpt.getAttribute('data-paypal');

    const cleanDomain = (this.domainInput.value.trim() || 'pending.domain')
      .replace(/^https?:\/\//i, '')
      .split('/')[0]
      .toLowerCase();
    const cleanEmail = this.emailInput.value.trim() || 'pending@vault.burn-1.com';

    if (this.citationPreview) {
      this.citationPreview.textContent = ORDINANCE_CITATIONS[division];
    }

    // Lifecycle Gate Preview based on Operational Self-Attestations
    const attestationsComplete = this.mfaCheckbox.checked && this.backupCheckbox.checked;
    const projectedState = attestationsComplete ? 'APPROVED_SEALED' : 'NON_CONV_INCOMPLETE';

    if (attestationsComplete) {
      this.lifecycleBadge.textContent = 'ELIGIBLE: APPROVED_SEALED';
      this.lifecycleBadge.className = 'px-2 py-0.5 bg-neonEmerald text-moneyGreen font-bold';
    } else {
      this.lifecycleBadge.textContent = 'GATE WARNING: NON_CONV_INCOMPLETE';
      this.lifecycleBadge.className = 'px-2 py-0.5 bg-scrollTan text-printedBlue font-bold';
    }

    // Official Cryptographic Seal Formula
    const rawSealPreimage = `BURN1_SEAL:${cleanDomain}:${this.state.timestampIso}:NIST_CSF_2.0:CISA_KEV_VERIFIED`;
    this.sealFormulaEl.textContent = rawSealPreimage;

    const sha256Hex = await FastLaneCryptoUtil.sha256String(rawSealPreimage);
    this.state.candidateSeal = sha256Hex;
    this.liveShaEl.textContent = `SHA-256: ${sha256Hex}`;

    // Summary & Official PayPal Hosted Checkout URL
    this.summaryOrderIdEl.textContent = this.state.orderId;
    this.summaryTokenEl.textContent = this.state.sessionToken;
    this.summaryAmountEl.textContent = `$${price}.00 USD`;

    const paypalUrl = new URL(`https://www.paypal.com/ncp/payment/${paypalButtonId}`);
    paypalUrl.searchParams.set('custom', `${this.state.orderId}|${this.state.sessionToken}`);
    this.paypalBtn.href = paypalUrl.toString();

    // Build exact 13-column division_queue.csv row
    const vaultUrl = `https://burn-1.com/vault/${this.state.orderId}`;
    const csvColumns = [
      this.state.timestampIso,
      this.state.orderId,
      division,
      cleanDomain,
      cleanEmail,
      productType,
      price,
      'AWAITING_PAYPAL_SETTLEMENT',
      'PENDING',
      'PENDING_LUMBO_SWEEP',
      `"${ORDINANCE_CITATIONS[division]}"`,
      sha256Hex,
      vaultUrl
    ];
    this.csvRowPreviewEl.textContent =
      `timestamp,order_id,division_origin,client_domain,contact_email,product_type,amount_paid,payment_status,processed_status,risk_index_score,ordinance_citations,sha256_seal,vault_url\n` +
      csvColumns.join(',');
  }

  async dispatchIntakeToSupervisor() {
    const division = this.divisionSelect.value;
    const selectedOpt = this.divisionSelect.options[this.divisionSelect.selectedIndex];

    const payload = {
      timestamp: this.state.timestampIso,
      order_id: this.state.orderId,
      session_token: this.state.sessionToken,
      division_origin: division,
      client_domain: this.domainInput.value.trim().toLowerCase(),
      contact_email: this.emailInput.value.trim(),
      product_type: selectedOpt.getAttribute('data-product'),
      amount_paid: Number(selectedOpt.getAttribute('data-price')),
      payment_gateway: 'PAYPAL_HOSTED_NCP',
      payment_status: 'PENDING_SETTLEMENT',
      processed_status: 'PENDING',
      attestations: {
        mfa_enforced: this.mfaCheckbox.checked,
        immutable_backups_tested: this.backupCheckbox.checked
      },
      artifacts_manifest: this.state.artifacts,
      ordinance_citations: ORDINANCE_CITATIONS[division],
      candidate_sha256_seal: this.state.candidateSeal
    };

    // Persist locally for instant session continuity post-PayPal redirect
    sessionStorage.setItem(`BURN1_FASTLANE_${this.state.orderId}`, JSON.stringify(payload));
    this.dispatchStatusEl.textContent = `Queued Order ${this.state.orderId} → Launching PayPal Settlement...`;

    // Non-blocking POST to server_intake_api.py (Bee SLM Orchestrator endpoint)
    try {
      await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      });
    } catch (_) {
      // Static/offline graceful fallback: session ledger already stored
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TreasuryGuillocheEngine('treasuryGuillocheCanvas');
  new FastLaneUltraBarController();
});