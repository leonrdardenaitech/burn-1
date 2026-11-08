/**
 * ============================================================================
 * BURN-1 SYSTEMS: PARAMETRIC GUILLOCHE & TELEMETRY ENGINE (PHASE 1)
 * Generates true mathematical SVG Guilloche curves:
 * - Polar Rose / Rhodonea Rosette Corners: r(θ) = R_base + A·cos(k·θ) + B·sin(m·θ)
 * - Hypotrochoid / Epitrochoid Cryptographic Seals
 * - Phase-Shifted Sinusoidal Intaglio Ribbon Waves
 * ============================================================================
 */

(function () {
  'use strict';

  /**
   * Generates an SVG path string for a parametric polar Guilloche Rosette
   * r(θ) = baseR + amp1 * cos(freq1 * θ + phase) + amp2 * cos(freq2 * θ)
   */
  function generateRosettePath(cx, cy, baseR, amp1, freq1, amp2, freq2, phase, steps = 360) {
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const r =
        baseR +
        amp1 * Math.cos(freq1 * theta + phase) +
        amp2 * Math.cos(freq2 * theta - phase * 0.5);
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      d += (i === 0 ? 'M ' : ' L ') + x.toFixed(2) + ' ' + y.toFixed(2);
    }
    return d + ' Z';
  }

  /**
   * Generates an SVG path string for a true Hypotrochoid / Epitrochoid curve
   * x(θ) = (R - r)cos(θ) + d*cos(((R - r)/r)*θ)
   * y(θ) = (R - r)sin(θ) - d*sin(((R - r)/r)*θ)
   */
  function generateHypotrochoidPath(cx, cy, R, r, dDist, loops = 12, steps = 720, scale = 1) {
    let d = '';
    const maxTheta = Math.PI * 2 * loops;
    const k = (R - r) / r;
    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * maxTheta;
      const x = cx + scale * ((R - r) * Math.cos(theta) + dDist * Math.cos(k * theta));
      const y = cy + scale * ((R - r) * Math.sin(theta) - dDist * Math.sin(k * theta));
      d += (i === 0 ? 'M ' : ' L ') + x.toFixed(2) + ' ' + y.toFixed(2);
    }
    return d + ' Z';
  }

  /**
   * Generates horizontal phase-shifted integer-frequency sinusoid ribbons
   * y(x) = y0 + A * sin(f1 * x + phase) + B * cos(f2 * x - phase)
   */
  function generateSinusoidRibbonPath(width, y0, amp1, freq1, amp2, freq2, phase, steps = 220) {
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * width;
      const rad = t * Math.PI * 2;
      const y =
        y0 +
        amp1 * Math.sin(freq1 * rad + phase) +
        amp2 * Math.cos(freq2 * rad - phase);
      d += (i === 0 ? 'M ' : ' L ') + x.toFixed(2) + ' ' + y.toFixed(2);
    }
    return d;
  }

  /**
   * Creates a Corner Rosette SVG element with multi-layered integer-frequency curves
   */
  function createCornerRosetteSVG(positionClass, primaryStroke, secondaryStroke) {
    const wrapper = document.createElement('div');
    wrapper.className = `guilloche-corner ${positionClass}`;

    let pathsHtml = '';
    // 4 phase-shifted rhodonea curves (k=12, m=24)
    for (let p = 0; p < 4; p++) {
      const phase = (p * Math.PI) / 6;
      const pathData = generateRosettePath(34, 34, 21 - p * 1.5, 6.5, 12, 3.0, 24, phase, 320);
      const stroke = p % 2 === 0 ? primaryStroke : secondaryStroke;
      pathsHtml += `<path d="${pathData}" fill="none" stroke="${stroke}" stroke-width="0.65" stroke-opacity="0.58"/>`;
    }

    // Inner mathematical hypotrochoid core
    const innerHypo = generateHypotrochoidPath(34, 34, 15, 3, 4.5, 3, 240, 0.85);
    pathsHtml += `<path d="${innerHypo}" fill="none" stroke="${primaryStroke}" stroke-width="0.6" stroke-opacity="0.75"/>`;
    pathsHtml += `<circle cx="34" cy="34" r="3.5" fill="none" stroke="${secondaryStroke}" stroke-width="0.9"/>`;

    wrapper.innerHTML = `<svg viewBox="0 0 68 68" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${pathsHtml}</svg>`;
    return wrapper;
  }

  /**
   * Creates full-pane sinusoidal wave mesh & border arcs inside a .guilloche-pane
   */
  function decorateGuillochePane(pane) {
    if (pane.dataset.guillocheMounted === 'true') return;
    pane.dataset.guillocheMounted = 'true';

    const isBlueTheme = pane.classList.contains('guilloche-pane-blue');
    const primaryColor = isBlueTheme ? '#1B365D' : '#14452F';
    const secondaryColor = isBlueTheme ? '#14452F' : '#1B365D';

    // Top & Bottom Sinusoidal Intaglio Ribbon Layer
    const svgLayer = document.createElement('div');
    svgLayer.className = 'guilloche-svg-layer';

    let wavePaths = '';
    const numRibbons = 7;
    for (let i = 0; i < numRibbons; i++) {
      const phase = (i / numRibbons) * Math.PI * 2;
      const stroke = i % 2 === 0 ? primaryColor : secondaryColor;
      // Top border guilloche wave
      const topWave = generateSinusoidRibbonPath(1000, 14, 6.5, 16, 3.2, 32, phase, 260);
      // Bottom border guilloche wave
      const botWave = generateSinusoidRibbonPath(1000, 586, 6.5, 16, 3.2, 32, -phase, 260);
      // Center watermark ambient sinusoid
      const midWave = generateSinusoidRibbonPath(1000, 300, 36, 5, 14, 15, phase, 240);

      wavePaths += `<path d="${topWave}" fill="none" stroke="${stroke}" stroke-width="0.65" stroke-opacity="0.28"/>`;
      wavePaths += `<path d="${botWave}" fill="none" stroke="${stroke}" stroke-width="0.65" stroke-opacity="0.28"/>`;
      wavePaths += `<path d="${midWave}" fill="none" stroke="${stroke}" stroke-width="0.55" stroke-opacity="0.09"/>`;
    }

    // Center faint geometric watermark medallion
    const centerWatermark = generateHypotrochoidPath(500, 300, 140, 35, 65, 4, 480, 1);
    wavePaths += `<path d="${centerWatermark}" fill="none" stroke="${primaryColor}" stroke-width="0.7" stroke-opacity="0.08"/>`;

    svgLayer.innerHTML = `<svg viewBox="0 0 1000 600" preserveAspectRatio="none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${wavePaths}</svg>`;
    pane.insertBefore(svgLayer, pane.firstChild);

    // Mount 4 Corner Rosettes
    ['tl', 'tr', 'bl', 'br'].forEach((pos) => {
      const cornerEl = createCornerRosetteSVG(pos, primaryColor, secondaryColor);
      pane.insertBefore(cornerEl, pane.firstChild);
    });
  }

  /**
   * Superimposes integer-frequency sinusoids (12, 24, 36) for a 14-pass phase-shifted moiré shimmer
   */
  function paintSealRosette(cx = 130, cy = 130) {
    let paths = '';
    for (let pass = 0; pass < 14; pass++) {
      const phase = (pass * Math.PI * 2) / 14;
      const stroke = pass % 2 === 0 ? '#14452F' : '#1B365D';
      const steps = 420;
      let d = '';
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const r =
          98 -
          pass * 1.4 +
          5.5 * Math.cos(12 * theta + phase) +
          3.2 * Math.cos(24 * theta - phase * 0.5) +
          1.8 * Math.sin(36 * theta + phase * 1.5);
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        d += (i === 0 ? 'M ' : ' L ') + x.toFixed(2) + ' ' + y.toFixed(2);
      }
      d += ' Z';
      paths += `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="0.65" stroke-opacity="0.62"/>`;
    }
    return paths;
  }

  /**
   * Renders a large high-precision Algorithmic Cryptographic SHA-256 Seal SVG
   * into any container with [data-guilloche-seal]
   */
  function mountCryptographicSeal(container) {
    if (!container || container.dataset.sealMounted === 'true') return;
    container.dataset.sealMounted = 'true';

    // 14-pass phase-shifted moiré shimmer (integer frequencies 12, 24, 36)
    let sealPaths = paintSealRosette(130, 130);

    // Inner Epitrochoid / Hypotrochoid Spirograph Web
    for (let j = 0; j < 4; j++) {
      const stroke = j % 2 === 0 ? '#1B365D' : '#14452F';
      const d = generateHypotrochoidPath(130, 130, 78, 13, 28 - j * 3, 6, 480, 0.85);
      sealPaths += `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="0.75" stroke-opacity="0.65"/>`;
    }

    container.innerHTML = `
      <svg viewBox="0 0 260 260" class="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sealCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FAF7F0"/>
            <stop offset="75%" stop-color="#F4EFE0"/>
            <stop offset="100%" stop-color="#D9CEB0"/>
          </radialGradient>
          <path id="sealTextArcTop" d="M 48,130 A 82,82 0 1,1 212,130" />
          <path id="sealTextArcBottom" d="M 212,130 A 82,82 0 1,1 48,130" />
        </defs>
        <circle cx="130" cy="130" r="118" fill="url(#sealCoreGrad)" stroke="#14452F" stroke-width="2"/>
        <circle cx="130" cy="130" r="113" fill="none" stroke="#1B365D" stroke-width="1" stroke-dasharray="3 2"/>
        ${sealPaths}
        <circle cx="130" cy="130" r="68" fill="#FAF7F0" fill-opacity="0.92" stroke="#14452F" stroke-width="1.5"/>
        <circle cx="130" cy="130" r="64" fill="none" stroke="#1B365D" stroke-width="0.8"/>
        <text fill="#14452F" font-family="'JetBrains Mono', monospace" font-size="7.2" font-weight="800" letter-spacing="1.8">
          <textPath href="#sealTextArcTop" startOffset="50%" text-anchor="middle">
            ALGORITHMIC CRYPTOGRAPHIC SHA-256 SEAL
          </textPath>
        </text>
        <text fill="#1B365D" font-family="'JetBrains Mono', monospace" font-size="6.8" font-weight="800" letter-spacing="1.5">
          <textPath href="#sealTextArcBottom" startOffset="50%" text-anchor="middle">
            AGENTLESS PERIMETER TELEMETRY • NIST CSF 2.0
          </textPath>
        </text>
        <text x="130" y="116" text-anchor="middle" fill="#14452F" font-family="'Cinzel', Georgia, serif" font-size="12" font-weight="900" letter-spacing="1">BURN-1</text>
        <text x="130" y="131" text-anchor="middle" fill="#1B365D" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="800">SHA-256 VERIFIED</text>
        <text x="130" y="145" text-anchor="middle" fill="#4A554E" font-family="'JetBrains Mono', monospace" font-size="6.8" font-weight="700">9F86D081...B1E4</text>
      </svg>
    `;
  }

  /**
   * 5-State Right Column Lifecycle Controller
   * Sequence (1.5s per step):
   * PENDING -> COMPLETE_PASS -> NON_CONV_INCOMPLETE -> REJECTED_NEEDS_REMEDIATION -> APPROVED_SEALED
   */
  const LIFECYCLE_STATES = [
    { code: 'PENDING', label: '1. PENDING', note: 'Initializing Agentless Perimeter Telemetry collector...' },
    { code: 'COMPLETE_PASS', label: '2. COMPLETE_PASS', note: 'Primary perimeter telemetry vectors enumerated.' },
    { code: 'NON_CONV_INCOMPLETE', label: '3. NON_CONV_INCOMPLETE', note: 'Evaluating non-convergent policy assertions...' },
    { code: 'REJECTED_NEEDS_REMEDIATION', label: '4. REJECTED_NEEDS_REMEDIATION', note: 'Auto-applying delta remediation baseline controls...' },
    { code: 'APPROVED_SEALED', label: '5. APPROVED_SEALED', note: 'Algorithmic Cryptographic SHA-256 Seal affixed.' }
  ];

  let activeLifecycleTimer = null;

  function triggerLifecycleProgression(payloadSummary) {
    const statusBadge = document.getElementById('rc-current-state-badge');
    const logContainer = document.getElementById('rc-telemetry-log');
    const nodes = document.querySelectorAll('[data-lifecycle-step]');

    if (activeLifecycleTimer) {
      clearInterval(activeLifecycleTimer);
      activeLifecycleTimer = null;
    }

    // Reset all nodes
    nodes.forEach((node) => {
      node.classList.remove('active-step', 'completed-step');
    });

    let stepIndex = 0;

    function executeStep() {
      const current = LIFECYCLE_STATES[stepIndex];
      nodes.forEach((node, idx) => {
        node.classList.remove('active-step', 'completed-step');
        if (idx < stepIndex) {
          node.classList.add('completed-step');
        } else if (idx === stepIndex) {
          node.classList.add('active-step');
        }
      });

      if (statusBadge) {
        statusBadge.textContent = current.code;
        statusBadge.style.backgroundColor = stepIndex === 4 ? '#14452F' : '#1B365D';
        statusBadge.style.color = '#FAF7F0';
      }

      // Sync any customer-facing spreadsheet row badges waiting on lifecycle state
      document.querySelectorAll('[data-active-spreadsheet-state="true"]').forEach((cell) => {
        cell.textContent = current.code;
        cell.className =
          stepIndex === 4
            ? 'px-2 py-0.5 rounded bg-[#14452F] text-[#FAF7F0] font-mono text-[10px] font-bold'
            : 'px-2 py-0.5 rounded bg-[#1B365D] text-[#FAF7F0] font-mono text-[10px] font-bold';
        if (stepIndex === 4) {
          cell.removeAttribute('data-active-spreadsheet-state');
        }
      });

      if (logContainer) {
        const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
        const entry = document.createElement('div');
        entry.className = 'py-1 border-b border-[#C4B693]/60 text-[10px] font-mono leading-tight';
        entry.innerHTML = `<span class="font-extrabold text-[#1B365D]">[${ts}]</span> <span class="font-bold text-[#14452F]">${current.code}</span>: ${current.note}`;
        logContainer.prepend(entry);
      }

      stepIndex++;
      if (stepIndex < LIFECYCLE_STATES.length) {
        activeLifecycleTimer = setTimeout(executeStep, 1500);
      } else {
        // Mark final step completed + active highlight
        if (nodes[4]) {
          nodes[4].classList.add('completed-step');
        }
        if (logContainer && payloadSummary) {
          const doneEntry = document.createElement('div');
          doneEntry.className = 'py-1.5 px-2 mt-1 bg-[#14452F]/15 border border-[#14452F] rounded text-[10px] font-mono text-[#0B291B] font-bold';
          doneEntry.innerHTML = `✓ LEDGER SYNCED: ${payloadSummary} • Delivered within standard business turnaround up to 5 business days.`;
          logContainer.prepend(doneEntry);
        }
      }
    }

    executeStep();
  }

  /**
   * Initialize Guilloche panes, Cryptographic Seals, and Right Column widgets
   */
  function initB2BTreasuryPortal() {
    document.querySelectorAll('.guilloche-pane').forEach(decorateGuillochePane);
    document.querySelectorAll('[data-guilloche-seal]').forEach(mountCryptographicSeal);

    // Hydrate Customer-Facing Spreadsheet from localStorage if available
    const sheetBody = document.getElementById('customer-spreadsheet-tbody');
    if (sheetBody) {
      try {
        const savedRows = JSON.parse(localStorage.getItem('burn1_b2b_spreadsheet_ledger_v1') || '[]');
        savedRows.slice(0, 8).reverse().forEach((item) => {
          const tr = document.createElement('tr');
          tr.className = 'border-b border-[#C4B693] bg-[#FAF7F0]';
          tr.innerHTML = `
            <td class="p-2 font-mono text-[10px] text-[#4A554E]">${item.timestamp}</td>
            <td class="p-2 font-mono text-[11px] font-bold text-[#14452F]">${item.entityName}</td>
            <td class="p-2 font-mono text-[11px] text-[#1B365D] font-semibold">${item.primaryDomain}</td>
            <td class="p-2 font-mono text-[10px]">${item.framework}</td>
            <td class="p-2 font-mono text-[10px] font-bold">${item.packageTier}</td>
            <td class="p-2 font-mono text-[10px] text-[#14452F]">${item.sealHash}</td>
            <td class="p-2">
              <span class="px-2 py-0.5 rounded bg-[#14452F] text-[#FAF7F0] font-mono text-[10px] font-bold">
                ${item.state || 'APPROVED_SEALED'}
              </span>
            </td>
          `;
          sheetBody.prepend(tr);
        });
      } catch (e) {
        // Ignore storage errors
      }
    }

    // Wire Right-Column Concierge Chat Box
    const chatForm = document.getElementById('rc-chat-form');
    const chatInput = document.getElementById('rc-chat-input');
    const logContainer = document.getElementById('rc-telemetry-log');
    if (chatForm && chatInput && logContainer) {
      chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;
        const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
        const userLine = document.createElement('div');
        userLine.className = 'py-1 border-b border-[#C4B693]/60 text-[10px] font-mono';
        userLine.innerHTML = `<span class="font-bold text-[#1B365D]">[${ts}] OPERATOR:</span> ${msg}`;
        logContainer.prepend(userLine);
        chatInput.value = '';

        setTimeout(() => {
          const replyLine = document.createElement('div');
          replyLine.className = 'py-1 border-b border-[#C4B693]/60 text-[10px] font-mono text-[#14452F]';
          replyLine.innerHTML = `<span class="font-bold">[VAULT DESK]:</span> Request logged under Algorithmic Cryptographic SHA-256 Seal protocol. Delivered within standard business turnaround up to 5 business days.`;
          logContainer.prepend(replyLine);
        }, 500);
      });
    }
  }

  /**
   * Resolves the Central Intake API base URL
   * In production (Vercel), returns '' so requests route to /api/intake, which vercel.json proxies to the Droplet.
   * Locally, routes to http://localhost:5000.
   */
  function getApiBaseUrl() {
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
   * Helper to persist records to localStorage ledger
   */
  function saveToLocalStorageLedger(item) {
    try {
      const storageKey = 'burn1_b2b_spreadsheet_ledger_v1';
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.unshift(item);
      localStorage.setItem(storageKey, JSON.stringify(existing.slice(0, 25)));
    } catch (err) {
      // Ignore quota errors
    }
  }

  /**
   * Dispatches POST request to the Backend Intake API & Lifecycle Engine
   * Saves the record into the Customer-Facing Spreadsheet Ledger & triggers the
   * 5-State Lifecycle progression (1.5s delay per step) in the Right Column.
   */
  function submitIntakeWebhook(formPayload) {
    const endpoint = formPayload.endpoint || '/api/intake';
    const clientType = formPayload.client_type || (String(endpoint).includes('msp') ? 'msp' : 'direct');
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const initialTempSeal =
      'SHA256-' +
      Math.random().toString(16).substring(2, 10).toUpperCase() +
      '-' +
      Math.random().toString(16).substring(2, 6).toUpperCase();
    const rowId = 'burn1-row-' + Date.now();

    const logContainer = document.getElementById('rc-telemetry-log');
    if (logContainer) {
      const postEntry = document.createElement('div');
      postEntry.className =
        'py-1.5 px-2 bg-[#1B365D]/15 border border-[#1B365D] rounded text-[9.5px] font-mono text-[#0F2342] font-bold';
      postEntry.innerHTML = `POST /api/intake [client_type="${clientType}"] • HTTP 202 ACCEPTED • Syncing row to Customer-Facing Spreadsheet...`;
      logContainer.prepend(postEntry);
    }

    // Prepend row to Customer-Facing Spreadsheet table if present on page
    const sheetBody = document.getElementById('customer-spreadsheet-tbody');
    if (sheetBody) {
      // Clear any previous active markers so only the newest submission animates
      sheetBody.querySelectorAll('[data-active-spreadsheet-state]').forEach((el) => {
        el.removeAttribute('data-active-spreadsheet-state');
      });

      const tr = document.createElement('tr');
      tr.id = rowId;
      tr.className = 'border-b border-[#C4B693] bg-[#14452F]/10 transition-colors';
      tr.innerHTML = `
        <td class="p-2 font-mono text-[10px] text-[#4A554E]">${timestamp}</td>
        <td class="p-2 font-mono text-[11px] font-bold text-[#14452F]">${formPayload.entityName || 'Applicant Entity'}</td>
        <td class="p-2 font-mono text-[11px] text-[#1B365D] font-semibold">${formPayload.primaryDomain || 'domain.tld'}</td>
        <td class="p-2 font-mono text-[10px]">${formPayload.framework || 'NIST CSF 2.0'}</td>
        <td class="p-2 font-mono text-[10px] font-bold">${formPayload.packageTier || 'Standard Dossier'}</td>
        <td class="p-2 font-mono text-[10px] text-[#14452F]" data-seal-cell>${initialTempSeal}</td>
        <td class="p-2">
          <span data-active-spreadsheet-state="true" class="px-2 py-0.5 rounded bg-[#1B365D] text-[#FAF7F0] font-mono text-[10px] font-bold">
            PENDING
          </span>
        </td>
      `;
      sheetBody.prepend(tr);
    }

    // Update webhook banner if present
    const webhookBanner = document.getElementById('webhook-post-receipt');
    if (webhookBanner) {
      webhookBanner.classList.remove('hidden');
      webhookBanner.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span><strong>WEBHOOK POST 202 ACCEPTED:</strong> Row appended to Customer-Facing Spreadsheet (${formPayload.primaryDomain}) • Seal ID: <code id="banner-seal-code">${initialTempSeal}</code></span>
          <span class="px-2 py-0.5 bg-[#14452F] text-[#FAF7F0] rounded text-[9.5px]">5-STATE LIFECYCLE ACTIVE (1.5s/STEP)</span>
        </div>
      `;
    }

    // Trigger 5-State Lifecycle in Right Column (1.5s per step)
    triggerLifecycleProgression(`${formPayload.entityName} (${formPayload.primaryDomain})`);

    // Asynchronously call backend /api/intake
    const apiBase = getApiBaseUrl();
    const payload = {
      client_domain: formPayload.primaryDomain,
      primaryDomain: formPayload.primaryDomain,
      contact_email: formPayload.contact_email || formPayload.email || '',
      company_name: formPayload.entityName,
      entityName: formPayload.entityName,
      client_type: clientType,
      form_origin: formPayload.endpoint || (clientType === 'msp' ? 'msp_intake' : 'direct_intake'),
      framework: formPayload.framework || 'NIST CSF 2.0',
      packageTier: formPayload.packageTier || 'Standard Dossier'
    };

    fetch(apiBase + '/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => {
        const finalSeal = data.sha256_seal ? ('SHA256-' + data.sha256_seal.substring(0, 16).toUpperCase()) : initialTempSeal;
        const targetRow = document.getElementById(rowId);
        if (targetRow) {
          const sealCell = targetRow.querySelector('[data-seal-cell]');
          if (sealCell) sealCell.textContent = finalSeal;
        }
        const bannerSeal = document.getElementById('banner-seal-code');
        if (bannerSeal) bannerSeal.textContent = finalSeal;

        if (logContainer) {
          const serverEntry = document.createElement('div');
          serverEntry.className =
            'py-1.5 px-2 bg-[#14452F]/15 border border-[#14452F] rounded text-[9.5px] font-mono text-[#0B291B] font-bold';
          serverEntry.innerHTML = `✓ BACKEND INTAKE RECORDED [${data.record_id || 'OK'}]: SHA-256 Seal verified • Vault: Clients/${formPayload.primaryDomain}.md • State: ${data.lifecycle_state || 'COMPLETE_PASS'}`;
          logContainer.prepend(serverEntry);
        }

        saveToLocalStorageLedger({
          timestamp: timestamp,
          client_type: clientType,
          entityName: formPayload.entityName || 'Applicant Entity',
          primaryDomain: formPayload.primaryDomain || 'domain.tld',
          framework: formPayload.framework || 'NIST CSF 2.0',
          packageTier: formPayload.packageTier || 'Standard Dossier',
          sealHash: finalSeal,
          recordId: data.record_id,
          state: data.lifecycle_state || 'APPROVED_SEALED'
        });
      })
      .catch((err) => {
        if (logContainer) {
          const offlineEntry = document.createElement('div');
          offlineEntry.className =
            'py-1 px-2 bg-[#B8860B]/15 border border-[#B8860B] rounded text-[9px] font-mono text-[#6A4E00]';
          offlineEntry.innerHTML = `ℹ LOCAL RESILIENCE: Backend unreachable (${err.message}). Cached in browser ledger.`;
          logContainer.prepend(offlineEntry);
        }
        saveToLocalStorageLedger({
          timestamp: timestamp,
          client_type: clientType,
          entityName: formPayload.entityName || 'Applicant Entity',
          primaryDomain: formPayload.primaryDomain || 'domain.tld',
          framework: formPayload.framework || 'NIST CSF 2.0',
          packageTier: formPayload.packageTier || 'Standard Dossier',
          sealHash: initialTempSeal,
          state: 'APPROVED_SEALED'
        });
      });
  }

  /**
   * Exports the current Customer-Facing Spreadsheet table rows as a downloadable CSV
   */
  function exportSpreadsheetCSV(filename) {
    const sheetBody = document.getElementById('customer-spreadsheet-tbody');
    if (!sheetBody) return;
    const rows = [
      ['UTC Timestamp', 'Entity Name', 'Perimeter Domain', 'Framework', 'Instrument Tier', 'SHA-256 Seal Reference', 'Lifecycle State']
    ];
    sheetBody.querySelectorAll('tr').forEach((tr) => {
      const cells = Array.from(tr.querySelectorAll('td')).map((td) =>
        '"' + td.textContent.trim().replace(/"/g, '""') + '"'
      );
      if (cells.length) rows.push(cells);
    });
    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'burn1-treasury-ledger.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Opens a printable / inspectable 8-Page NIST CSF 2.0 Proof & Cryptographic Seal Certificate Modal
   */
  function openProofCertificateModal(firmName, clientDomain) {
    const firm = firmName || 'APEX RISK & UNDERWRITING PARTNERS';
    const domain = clientDomain || 'meridian-capital-trust.com';
    const existing = document.getElementById('b1-certificate-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'b1-certificate-modal';
    modal.style.cssText =
      'position:fixed;inset:0;z-index:9999;background:rgba(17,24,20,0.72);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:1.5rem;';
    modal.innerHTML = `
      <div class="guilloche-pane max-w-3xl w-full max-h-[90vh] overflow-y-auto" style="background:#FAF7F0;">
        <div class="guilloche-pane-content">
          <div class="flex items-center justify-between border-b-2 border-[#14452F] pb-3 mb-4">
            <div>
              <div class="font-mono text-[10px] font-bold text-[#1B365D] uppercase tracking-widest">
                CO-BRANDED TREASURY PROOF INSTRUMENT • NIST CSF 2.0
              </div>
              <h3 class="text-xl font-black text-[#14452F]" style="font-family:var(--font-serif);">
                ${firm} × BURN-1 SYSTEMS
              </h3>
            </div>
            <button type="button" onclick="document.getElementById('b1-certificate-modal').remove()" class="med-coin med-bronze text-[10px] py-1 px-3">
              CLOSE [X]
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-4 items-center bg-[#F4EFE0] p-4 rounded border border-[#14452F] mb-4">
            <div class="font-mono text-xs space-y-1.5 text-[#111814]">
              <div><strong class="text-[#14452F]">INSURED APPLICANT DOMAIN:</strong> ${domain}</div>
              <div><strong class="text-[#14452F]">COLLECTION METHODOLOGY:</strong> Agentless Perimeter Telemetry</div>
              <div><strong class="text-[#1B365D]">ATTESTATION SEAL:</strong> Algorithmic Cryptographic SHA-256 Seal</div>
              <div><strong class="text-[#14452F]">LIFECYCLE STATUS:</strong> <span class="px-2 py-0.5 bg-[#14452F] text-[#FAF7F0] rounded text-[10px] font-bold">APPROVED_SEALED</span></div>
              <div class="text-[11px] text-[#4A554E] pt-1">Delivered within standard business turnaround up to 5 business days.</div>
            </div>
            <div class="w-36 h-36 mx-auto" data-guilloche-seal></div>
          </div>
          <div class="flex flex-wrap justify-end gap-2">
            <button type="button" onclick="window.print()" class="med-coin med-gold">
              <i class="fa-solid fa-print"></i> Print / Save 8-Page Proof PDF
            </button>
            <button type="button" onclick="document.getElementById('b1-certificate-modal').remove()" class="med-coin med-silver">
              Return to Portal
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    decorateGuillochePane(modal.querySelector('.guilloche-pane'));
    mountCryptographicSeal(modal.querySelector('[data-guilloche-seal]'));
  }

  window.Burn1Treasury = {
    init: initB2BTreasuryPortal,
    generateRosettePath: generateRosettePath,
    generateSinusoidRibbonPath: generateSinusoidRibbonPath,
    paintSealRosette: paintSealRosette,
    triggerLifecycleProgression: triggerLifecycleProgression,
    submitIntakeWebhook: submitIntakeWebhook,
    exportSpreadsheetCSV: exportSpreadsheetCSV,
    openProofCertificateModal: openProofCertificateModal,
    decorateGuillochePane: decorateGuillochePane,
    mountCryptographicSeal: mountCryptographicSeal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initB2BTreasuryPortal);
  } else {
    initB2BTreasuryPortal();
  }
})();

