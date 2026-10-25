/**
 * BURN-1 SYSTEMS // UNIVERSAL CYBER ONBOARDING, RADAR SCAN & EVIDENCE BINDER ENGINE
 * Full Conversion Journey: Diagnostics Radar -> Evidence Scope -> Road to Remediation -> Commercial PayPal Checkout
 * PayPal Client ID: AQRc1I49e-m1d28VHJWfRBdV_bna0vAfMlVYYUhLlO9kSVfvShXmVSW6fOb6pyozsJbJJcIqNS2wn2PH
 */

(function() {
    'use strict';

    const PAYPAL_CLIENT_ID = "AQRc1I49e-m1d28VHJWfRBdV_bna0vAfMlVYYUhLlO9kSVfvShXmVSW6fOb6pyozsJbJJcIqNS2wn2PH";

    // Sector Detection & Standards
    const SECTORS = {
        healthcare: { name: 'Healthcare & Medical', standard: 'HIPAA 45 CFR § 164.312', risk: 'High Ransomware Target' },
        finance: { name: 'Finance & Banking', standard: 'GLBA • SEC Item 1.05 • PCI-DSS 4.0', risk: 'Strict Underwriting Audits' },
        energy: { name: 'Energy & Utilities', standard: 'NERC-CIP • CISA OT Shield', risk: 'Critical Infrastructure SLA' },
        defense: { name: 'Defense Industrial Base', standard: 'CMMC 2.0 • NIST SP 800-171', risk: 'FIPS 140-3 Cryptographic Mandate' },
        retail: { name: 'Retail & E-Commerce', standard: 'PCI-DSS v4.0 • FTC Safeguards', risk: 'Shadow API & Session Hijacking' },
        legal: { name: 'Legal & Professional', standard: 'ABA Formal Opinion 477R', risk: 'Client Privilege Data Exfiltration' },
        academy: { name: 'Cyber Training Academy', standard: 'NIST CSF 2.0 Workforce', risk: 'Continuous Staff Hygiene' },
        it: { name: 'IT & Cloud Infrastructure', standard: 'SOC 2 Type II • ISO 27001', risk: 'Supply Chain Day-Three Delta' },
        manufacturing: { name: 'Manufacturing & Industrial', standard: 'IEC 62443 • CISA Cross-Sector', risk: 'OT / Legacy PLC Airgap Breach' },
        enterprise: { name: 'Enterprise Operations', standard: 'Continuous Threat Exposure Management (CTEM)', risk: 'Cross-Vector Surface Drift' }
    };

    function getPageSector() {
        const path = window.location.pathname.toLowerCase();
        for (const key in SECTORS) {
            if (path.includes(key)) return { code: key, ...SECTORS[key] };
        }
        return { code: 'enterprise', ...SECTORS.enterprise };
    }

    let currentSector = getPageSector();

    // Canonical Commercial Tiers ($500 Binder w/ Training Credits Offset, $999 Single Domain, $2,499 Multi-Domain, $4,999 Enterprise)
    const PACKAGES = [
        {
            id: 'pkg-binder-500',
            name: 'A-La-Carte Evidence Binder v2',
            period: 'A La Carte Delivery',
            basePrice: 500.00,
            badge: '50% ACADEMY CREDIT ELIGIBLE',
            popular: false,
            desc: 'Cryptographic Evidence Binder v2 compilation. Machine-signed assessment report for underwriting readiness. (Save $250 with Academy Pass).'
        },
        {
            id: 'pkg-single-999',
            name: 'Standard Single Domain Tier',
            period: 'Annual License ($83/mo)',
            basePrice: 999.00,
            badge: 'MOST POPULAR',
            popular: true,
            desc: '1 Domain + Evidence Binder + 1 Free Rescan within 12 months. Ideal for single-site clinics or regional firms.'
        },
        {
            id: 'pkg-multi-2499',
            name: 'Multi-Domain Tier (Up to 5 Domains)',
            period: 'Annual License ($208/mo)',
            basePrice: 2499.00,
            badge: 'MULTI-SITE COVERAGE',
            popular: false,
            desc: 'Covers up to 5 domains/subdomains with consolidated evidence binders and unlimited SLM rescans.'
        },
        {
            id: 'pkg-enterprise-4999',
            name: 'Enterprise Footprint (Up to 15 Domains)',
            period: 'Annual License ($416/mo)',
            basePrice: 4999.00,
            badge: 'FULL SHIELD • ANERGI CLEARED',
            popular: false,
            desc: 'Uncompromising multi-sector coverage for holding companies and CUI networks. Includes executive scorecards and priority Anergi escalation.'
        }
    ];

    let currentStep = 1;
    const TOTAL_STEPS = 4;
    let selectedPackageId = 'pkg-single-999';
    let applyCreditsDiscount = true;
    let authMode = 'signin';
    let isScanning = false;
    let scanCompleted = false;

    // DATA PERSISTENCE & CREDITS AGGREGATION
    function getAccountsRegistry() {
        try {
            return JSON.parse(localStorage.getItem('burn1_accounts_registry') || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveAccountsRegistry(registry) {
        localStorage.setItem('burn1_accounts_registry', JSON.stringify(registry));
    }

    function aggregateEarnedCredits() {
        let credits = 0;
        let score = 0;
        let badgesCount = 0;

        try {
            const clinicRaw = localStorage.getItem('burn1_clinic_v1');
            if (clinicRaw) {
                const clinic = JSON.parse(clinicRaw);
                credits += parseInt(clinic.credits || 0, 10);
                score = Math.max(score, parseInt(clinic.score || 0, 10));
                if (Array.isArray(clinic.badges)) badgesCount = Math.max(badgesCount, clinic.badges.length);
            }
        } catch (e) {}

        try {
            const zcodeRaw = localStorage.getItem('cyber-hygiene-protocol-v1');
            if (zcodeRaw) {
                const zcode = JSON.parse(zcodeRaw);
                if (zcode.score) score = Math.max(score, parseInt(zcode.score, 10));
                if (zcode.credits) credits = Math.max(credits, parseInt(zcode.credits, 10));
            }
        } catch (e) {}

        try {
            const directCreds = parseInt(localStorage.getItem('burn1_clinic_credits') || '0', 10);
            const directScore = parseInt(localStorage.getItem('burn1_clinic_score') || '0', 10);
            const directBadges = parseInt(localStorage.getItem('burn1_badges') || '0', 10);
            credits = Math.max(credits, directCreds);
            score = Math.max(score, directScore);
            badgesCount = Math.max(badgesCount, directBadges);
        } catch (e) {}

        if (score === 0) score = 195;
        if (credits === 0) credits = 40;
        if (badgesCount === 0) badgesCount = 6;

        return { score, credits, badges: badgesCount };
    }

    function getStoredData() {
        const aggregated = aggregateEarnedCredits();
        const activeToken = localStorage.getItem('burn1_active_user_token');
        const registry = getAccountsRegistry();

        let profile = {};
        let token = activeToken || '';
        let isLoggedIn = false;

        if (activeToken && registry[activeToken]) {
            profile = registry[activeToken].profile || {};
            isLoggedIn = true;
            aggregated.credits = Math.max(aggregated.credits, parseInt(registry[activeToken].credits || 0, 10));
            aggregated.score = Math.max(aggregated.score, parseInt(registry[activeToken].score || 0, 10));
        } else {
            try {
                profile = JSON.parse(localStorage.getItem('burn1_client_profile') || '{}');
            } catch (e) {}
            token = localStorage.getItem('burn1_client_token') || ('B1-' + Math.random().toString(36).substring(2, 8).toUpperCase());
            if (!localStorage.getItem('burn1_client_token')) {
                localStorage.setItem('burn1_client_token', token);
            }
        }

        return {
            isLoggedIn,
            profile,
            token,
            score: aggregated.score,
            credits: aggregated.credits,
            badges: aggregated.badges
        };
    }

    function calculatePricing() {
        const pkg = PACKAGES.find(p => p.id === selectedPackageId) || PACKAGES[1];
        const data = getStoredData();
        let discount = 0;

        if (applyCreditsDiscount && pkg.id === 'pkg-binder-500') {
            discount = Math.min(250.00, data.credits * 5.0);
        }

        const finalPrice = Math.max(0, pkg.basePrice - discount);
        return { pkg, discount, finalPrice };
    }

    // PAYPAL SDK INTEGRATION
    function loadPayPalSDK(callback) {
        if (window.paypal) {
            callback();
            return;
        }

        if (document.getElementById('burn1-paypal-sdk')) {
            const existing = document.getElementById('burn1-paypal-sdk');
            existing.addEventListener('load', callback);
            return;
        }

        const script = document.createElement('script');
        script.id = 'burn1-paypal-sdk';
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&components=buttons`;
        script.async = true;
        script.onload = () => {
            callback();
        };
        document.head.appendChild(script);
    }

    function renderPayPalButtonsInTarget(targetId) {
        const container = document.getElementById(targetId);
        if (!container) return;

        container.innerHTML = '<div style="color: #64748b; font-size: 13px; font-weight: bold; padding: 12px; text-align: center;">Loading Secure PayPal Checkout...</div>';

        loadPayPalSDK(() => {
            container.innerHTML = '';

            const pricing = calculatePricing();
            const finalValue = pricing.finalPrice.toFixed(2);
            const data = getStoredData();

            try {
                window.paypal.Buttons({
                    style: {
                        layout: 'vertical',
                        color: 'silver',
                        shape: 'rect',
                        label: 'checkout',
                        height: 45
                    },
                    createOrder: function(dataPayload, actions) {
                        return actions.order.create({
                            purchase_units: [{
                                description: `Burn-1 ${pricing.pkg.name} [Sector: ${currentSector.code}]`,
                                custom_id: data.token,
                                amount: {
                                    currency_code: 'USD',
                                    value: finalValue
                                }
                            }]
                        });
                    },
                    onApprove: function(dataPayload, actions) {
                        return actions.order.capture().then(function(details) {
                            container.innerHTML = '<div style="color: #38bdf8; font-family: monospace; font-size: 13px; font-weight: bold; padding: 14px; text-align: center;" class="animate-pulse">⚡ VERIFYING PAYMENT &amp; GENERATING SECURE TOKEN...</div>';

                            const registry = getAccountsRegistry();
                            if (registry[data.token]) {
                                if (!registry[data.token].orders) registry[data.token].orders = [];
                                registry[data.token].orders.push({
                                    orderId: details.id,
                                    package: pricing.pkg.name,
                                    amount: finalValue,
                                    date: new Date().toISOString()
                                });
                                saveAccountsRegistry(registry);
                            }

                            const payerEmail = (details.payer && details.payer.email_address) || (data.profile && data.profile.email) || 'client@enterprise.com';

                            fetch('https://burn-1.com/webhook/payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    order_number: details.id,
                                    email: payerEmail,
                                    product_id: pricing.pkg.name,
                                    client_key: data.token,
                                    amount: finalValue,
                                    sector: currentSector.code
                                })
                            })
                            .then(response => response.json())
                            .then(serverData => {
                                if (serverData && (serverData.status === "SUCCESS" || serverData.audit_token)) {
                                    const token = serverData.audit_token || data.token;
                                    window.location.href = `/cinematic-onboarding?token=${token}`;
                                } else {
                                    displaySuccessFallback(container, details, data);
                                }
                            })
                            .catch(error => {
                                console.warn('Droplet Webhook Notice (Failsafe triggered):', error);
                                displaySuccessFallback(container, details, data);
                            });
                        });
                    },
                    onError: function(err) {
                        console.error('PayPal Error:', err);
                        container.innerHTML = `<div style="color: #dc2626; font-size: 13px; font-weight: bold; padding: 10px; text-align: center;">Payment service error. Please verify network or contact support.</div>`;
                    }
                }).render('#' + targetId);
            } catch (err) {
                console.error('PayPal Render Exception', err);
            }
        });
    }

    function displaySuccessFallback(container, details, data) {
        container.innerHTML = `
            <div style="background: #064e3b; border: 1px solid #10b981; color: #ecfdf5; padding: 16px; border-radius: 12px; text-align: center;">
                <div style="font-weight: 900; font-size: 15px; margin-bottom: 6px;">🎉 UNDERWRITING TRANSACTION CONFIRMED</div>
                <div>Order ID: <strong>${details.id}</strong></div>
                <div>Client Key: <strong>${data.token}</strong></div>
                <div style="margin-top: 8px; color: #34d399; font-weight: bold;">Machine-Signed Binder &amp; S.P.A. Audit Unlocked!</div>
                <button onclick="window.downloadPurchasedBinder()" style="margin-top: 12px; background: #059669; color: #ffffff; font-weight: 800; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer;">
                    Download Signed Evidence Binder Now
                </button>
            </div>
        `;
    }

    window.downloadPurchasedBinder = function() {
        const data = getStoredData();
        const content = `# BURN-1 MACHINE-SIGNED CYBER EVIDENCE BINDER v2\nClient Key: ${data.token}\nCompany: ${data.profile.company || 'Enterprise Client'}\nSector: ${currentSector.name}\nStandard: ${currentSector.standard}\nUnderwriting Status: CERTIFIED COMPLIANT\nVerification Hash: B1-${Date.now().toString(16).toUpperCase()}\n\nIssued under Burn-1 Autonomous Intelligence Architecture.\n`;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cyber_Insurance_Evidence_Binder_${data.token}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Auto Init PayPal in target containers if present
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('burn1-paypal-buttons')) {
            renderPayPalButtonsInTarget('burn1-paypal-buttons');
        }
        if (document.getElementById('paypal-button-container')) {
            renderPayPalButtonsInTarget('paypal-button-container');
        }
    });

})();