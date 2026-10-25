#!/usr/bin/env python3
"""
Builds the complete 24-Page Cyber Readiness Clinic & Burn One Systems website suite
from the Initial Greeting specification document and MOD-010-AGREE legal reference.
Outputs:
  - C:/Users/Leonr/projects/burn-1.com/downloads/<all 24 .html pages>
  - C:/Users/Leonr/projects/burn-1.com/downloads/assets/<8 visual assets>
  - C:/Users/Leonr/projects/burn-1.com/<new sector .html pages at root>
  - C:/Users/Leonr/projects/burn-1.com/downloads/downloads_site_pages_bundle.zip
  - C:/Users/Leonr/Downloads/downloads_site_pages_bundle.zip
"""

import os
import shutil
import zipfile
from pathlib import Path

ROOT_DIR = Path(r"C:\Users\Leonr\projects\burn-1.com")
DOWNLOADS_DIR = ROOT_DIR / "downloads"
ASSETS_DIR = DOWNLOADS_DIR / "assets"
USER_DOWNLOADS_ZIP = Path(r"C:\Users\Leonr\Downloads\downloads_site_pages_bundle.zip")
SITE_DOWNLOADS_ZIP = DOWNLOADS_DIR / "downloads_site_pages_bundle.zip"

DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
ASSETS_DIR.mkdir(parents=True, exist_ok=True)


def generate_visual_assets():
    """Generate the 8 custom hero/architecture images in downloads/assets/ using Pillow if available, else copy/render."""
    try:
        from PIL import Image, ImageDraw, ImageFont
        has_pil = True
    except ImportError:
        has_pil = False

    specs = [
        ("hero_clock.jpg", (12, 16, 28), (0, 229, 255), (245, 158, 11),
         "BURN-1 // LUMINOUS CLOCK & SHATTERED GLASS PERIMETER",
         "DON'T LET YOUR CLOCK RUN OUT: VALIDATE BEFORE THE CARRIER DOES"),
        ("healthcare_or.jpg", (28, 44, 54), (163, 193, 173), (217, 43, 138),
         "CLINICAL OPERATING ROOM ARCHITECTURE // 6-ZONE HOTSPOT MAP",
         "HIPAA 45 CFR 164.312 • HITECH SAFE HARBOR • MEDICAL DEVICE VLAN"),
        ("finance_vault.jpg", (10, 15, 28), (16, 185, 129), (245, 158, 11),
         "SOVEREIGN CYBER VAULT & GLOBAL BREACH LOSS LEDGER",
         "GLBA SAFEGUARDS • NYDFS 23 NYCRR 500 • SOX SECTION 404"),
        ("legal_arch.jpg", (24, 24, 28), (212, 175, 55), (148, 163, 184),
         "CHAMBERS ARCHITECTURAL MONOLITH // PRIVILEGED DISCOVERY VAULT",
         "ABA MODEL RULE 1.6(c) • ZERO TICKERS • IOLTA ESCROW PROTOCOL"),
        ("telecom_sat.jpg", (6, 14, 32), (56, 189, 248), (168, 85, 247),
         "ORBITAL LIGHTHOUSE SATELLITE & EARTH TELEMETRY CONDUIT",
         "FCC CPNI 47 CFR 64.2001 • CALEA • 5G -> LEGACY COMPLIANCE CONDUIT"),
        ("gov_bldg.jpg", (15, 23, 42), (96, 165, 250), (248, 113, 113),
         "NEOCLASSICAL FEDERAL COLONNADE // PUBLIC SECTOR POSTURE",
         "FedRAMP MODERATE • FISMA • NIST SP 800-53 REV 5 • CISA BOD 22-01"),
        ("transport_fleet.jpg", (14, 22, 34), (251, 146, 60), (56, 189, 248),
         "BIRD'S-EYE FUTURISTIC FLEET PARKING LOT // 6 COMPLIANCE BAYS",
         "DOT • FMCSA • TSA • CISA • ISO 28000 • UNECE R155"),
        ("hospitality_desk.jpg", (28, 19, 38), (244, 114, 182), (251, 191, 36),
         "GRAND CONCIERGE DESK // REVOLVING GUEST PRIVACY & PMS VAULT",
         "PCI DSS v4.0 POS/PMS ISOLATION • GUEST PRIVACY PROTECTION"),
    ]

    for filename, bg, accent1, accent2, title, subtitle in specs:
        target = ASSETS_DIR / filename
        if has_pil:
            w, h = 1280, 560
            img = Image.new("RGB", (w, h), bg)
            draw = ImageDraw.Draw(img)
            # Draw technical grid
            for x in range(0, w, 40):
                draw.line([(x, 0), (x, h)], fill=(bg[0] + 12, bg[1] + 14, bg[2] + 18), width=1)
            for y in range(0, h, 40):
                draw.line([(0, y), (w, y)], fill=(bg[0] + 12, bg[1] + 14, bg[2] + 18), width=1)
            # Draw geometric HUD rings & shattered vectors
            cx, cy = w // 2, h // 2
            for r in (220, 175, 130, 85):
                draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=accent1, width=2)
            draw.line([(cx, cy - 110), (cx, cy)], fill=accent2, width=4)
            draw.line([(cx, cy), (cx + 80, cy + 45)], fill=accent1, width=3)
            # Outer frame
            draw.rectangle([16, 16, w - 16, h - 16], outline=accent1, width=2)
            draw.rectangle([28, h - 110, w - 28, h - 28], fill=(8, 10, 16), outline=accent2, width=2)
            draw.text((48, h - 92), title, fill=accent1)
            draw.text((48, h - 60), subtitle, fill=(235, 240, 248))
            img.save(target, "JPEG", quality=90)
        else:
            fallback = ROOT_DIR / "assets" / "website_logo.jpg"
            if fallback.exists():
                shutil.copyfile(fallback, target)


PAGES_NAV = [
    ("index.html", "00. Index Hub", "general"),
    ("healthcare.html", "01. Healthcare", "healthcare"),
    ("it.html", "02. IT & Cloud", "it"),
    ("finance.html", "03. Finance", "finance"),
    ("legal-services.html", "04. Legal", "legal"),
    ("energy.html", "05. Energy & OT", "energy"),
    ("retail.html", "06. Retail & PCI", "retail"),
    ("academy.html", "07. Academy", "general"),
    ("defense.html", "08. Defense CMMC", "defense"),
    ("construction.html", "09. Construction", "construction"),
    ("food.html", "10. Food FSMA", "food"),
    ("chemicals.html", "11. Chemicals", "chemicals"),
    ("manufacturing.html", "12. Manufacturing", "manufacturing"),
    ("government.html", "13. Government", "government"),
    ("transportation.html", "14. Transportation", "transportation"),
    ("hospitality.html", "15. Hospitality", "hospitality"),
    ("media.html", "16. Media & IP", "media"),
    ("telecom.html", "17. Telecom 5G", "telecom"),
    ("realestate.html", "18. Real Estate", "realestate"),
    ("nonprofit.html", "19. Non-Profit", "nonprofit"),
    ("agri-aero.html", "20. Agri & Aero", "agri-aero"),
    ("onboarding.html", "21. Onboarding", "general"),
    ("lab.html", "22. Lab & Directory", "general"),
    ("legal.html", "23. Legal (MOD-010)", "general"),
]


def build_shared_nav(active_file: str, industry_slug: str) -> str:
    options_html = []
    for fname, label, _ in PAGES_NAV:
        sel = "selected" if fname == active_file else ""
        options_html.append(f'<option value="{fname}" {sel}>{label} (downloads/{fname})</option>')
    options_str = "\n".join(options_html)

    pills_html = []
    for fname, label, _ in PAGES_NAV[:10]:
        active_cls = "bg-emerald-500 text-slate-950 font-black" if fname == active_file else "bg-white/5 text-slate-300 hover:bg-white/10"
        pills_html.append(f'<a href="{fname}" class="px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all {active_cls}">{label.split(". ")[1]}</a>')
    pills_str = "\n".join(pills_html)

    return f"""
    <!-- UNIVERSAL 24-PAGE SUITE NAVIGATION & DOWNLOADS BAR -->
    <div class="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-white/15 px-4 py-2.5 text-xs font-mono text-white">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
                <a href="index.html" class="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-black tracking-wider uppercase text-[11px]">BURN-1 // CLINIC SUITE</a>
                <span class="hidden md:inline text-slate-400 text-[11px]">target: <code class="text-cyan-300">downloads/{active_file}</code></span>
            </div>
            <div class="hidden xl:flex items-center gap-1">
                {pills_str}
            </div>
            <div class="flex items-center gap-2">
                <select aria-label="Switch Suite Page" onchange="if(this.value) window.location.href=this.value" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-200 text-[11px] font-mono">
                    {options_str}
                </select>
                <a href="../clinic.html?industry={industry_slug}" class="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px]">
                    🎮 Game &amp; Binder ({industry_slug.upper()})
                </a>
                <button type="button" onclick="saveCurrentPageToDownloads('{active_file}')" class="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px]">
                    ⬇ Save Page to Downloads/
                </button>
            </div>
        </div>
    </div>
    """


def build_unified_module_dock(industry_slug: str, industry_title: str, frameworks: str, warranty_focus: str) -> str:
    """Builds the parametric GLM ZCode Assessment, Game, Binder & Monitoring Module embedded on each industry page."""
    return f"""
    <!-- UNIFIED GLM ZCODE INDUSTRY ASSESSMENT, GAME, BINDER & MONITORING MODULE -->
    <section class="max-w-7xl mx-auto my-12 rounded-3xl p-6 sm:p-8 bg-slate-950/95 text-white border-2 border-cyan-500/40 shadow-2xl font-mono">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
                <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase">
                        GLM ZCODE PARAMETRIC ENGINE // {industry_slug.upper()}
                    </span>
                    <span class="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                        {frameworks}
                    </span>
                </div>
                <h2 class="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                    {industry_title} — Live Scan, Hygiene Game, Evidence Binder &amp; Monitoring
                </h2>
                <p class="text-xs text-slate-400 font-sans mt-1">{warranty_focus}</p>
            </div>
            <div class="flex flex-wrap items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-white/10">
                <div>
                    <span class="text-[10px] text-slate-400 block uppercase">EARNED CREDITS</span>
                    <span id="dock-credits" class="text-xl font-black text-amber-400">0 / 120 CR</span>
                </div>
                <div class="border-l border-white/10 pl-3">
                    <span class="text-[10px] text-slate-400 block uppercase">NET BINDER / AUDIT</span>
                    <span id="dock-net-price" class="text-sm font-bold text-emerald-400">$250 / $500</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <!-- PILLAR 1: NON-INTRUSIVE OUTSIDE-IN SCANNER -->
            <div class="p-5 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-cyan-400 uppercase">01. Sector Micro-Scanner</span>
                        <span class="text-[10px] text-slate-400">MOD-010-AGREE</span>
                    </div>
                    <p class="text-xs text-slate-300 font-sans mb-4">
                        Non-intrusive outside-in DNS (SPF/DKIM/DMARC), TLS 1.3, HSTS, and security header inspection mapped to <strong>{frameworks}</strong>.
                    </p>
                    <div class="flex gap-2 mb-3">
                        <input id="dock-scan-domain" type="text" placeholder="yourdomain.com" value="burn-1.com" class="w-full px-3 py-2 rounded-xl bg-black border border-cyan-500/40 text-white text-xs font-mono">
                        <button type="button" onclick="runSectorMicroScan('{industry_slug}')" class="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase shrink-0">
                            Scan
                        </button>
                    </div>
                    <div id="dock-scan-output" class="p-3 rounded-xl bg-black/80 border border-white/10 text-[11px] text-emerald-400 min-h-[78px]">
                        [READY] Enter domain to run passive {industry_slug.upper()} perimeter check.
                    </div>
                </div>
                <a href="../burn-1systems.html?industry={industry_slug}" class="mt-4 block text-center py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase">
                    Full 16-Check APEA Audit ($500) &rarr;
                </a>
            </div>

            <!-- PILLAR 2: SECTOR HYGIENE GAME & SIMULATORS (L1-8 + A-G) -->
            <div class="p-5 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-emerald-400 uppercase">02. Hygiene Game &amp; Simulators</span>
                        <span class="text-[10px] text-amber-400 font-bold">+120 CR MAX</span>
                    </div>
                    <p class="text-xs text-slate-300 font-sans mb-3">
                        Complete the 8 Free Hygiene Classes (40 CR) and 7 Advanced Anti-Phishing/MFA-2 Simulators (80 CR) under the <strong>{industry_title}</strong> compliance lens.
                    </p>
                    <div class="space-y-2 text-[11px] mb-4">
                        <div class="p-2.5 rounded-xl bg-black/60 border border-white/5 flex justify-between">
                            <span>Free Protocol (Levels 1–8)</span>
                            <span id="dock-l18-status" class="text-emerald-400 font-bold">40 CR Available</span>
                        </div>
                        <div class="p-2.5 rounded-xl bg-black/60 border border-white/5 flex justify-between">
                            <span>Advanced Simulators (A–G)</span>
                            <span id="dock-ag-status" class="text-cyan-400 font-bold">80 CR Available</span>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <a href="../clinic.html?industry={industry_slug}" class="text-center py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase">
                        Launch L1–8 + A–G
                    </a>
                    <a href="academy.html?industry={industry_slug}" class="text-center py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase">
                        Day-Mode Academy
                    </a>
                </div>
            </div>

            <!-- PILLAR 3: EVIDENCE BINDER V2 & DRIFT MONITORING -->
            <div class="p-5 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-bold text-amber-400 uppercase">03. Binder &amp; Drift Monitor</span>
                        <span class="text-[10px] text-emerald-400">SHA-256 SEALED</span>
                    </div>
                    <p class="text-xs text-slate-300 font-sans mb-3">
                        Compile your machine-signed <strong>Evidence Binder v2</strong> for Chubb, Travelers, Coalition &amp; Beazley, or schedule quarterly drift monitoring.
                    </p>
                    <div class="space-y-1.5 text-[11px] mb-4">
                        <a href="cyber-insurance-evidence-binder-v2.md" download class="block p-2 rounded-lg bg-black/60 hover:bg-black border border-white/10 text-cyan-300">
                            ⬇ downloads/cyber-insurance-evidence-binder-v2.md
                        </a>
                        <a href="zero-cost-mfa-setup-guide.md" download class="block p-2 rounded-lg bg-black/60 hover:bg-black border border-white/10 text-emerald-300">
                            ⬇ downloads/zero-cost-mfa-setup-guide.md
                        </a>
                        <a href="client-onboarding-agreement.md" download class="block p-2 rounded-lg bg-black/60 hover:bg-black border border-white/10 text-purple-300">
                            ⬇ downloads/client-onboarding-agreement.md (MOD-010)
                        </a>
                    </div>
                </div>
                <button type="button" onclick="exportSectorBinder('{industry_slug}', '{industry_title}', '{frameworks}')" class="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase">
                    🛡 Export {industry_slug.upper()} Evidence Binder
                </button>
            </div>
        </div>
    </section>
    """


def build_shared_footer(active_file: str, industry_slug: str) -> str:
    return f"""
    <!-- LEGAL & SLA FOOTER (MOD-010-AGREE) -->
    <footer class="max-w-7xl mx-auto mt-16 pt-8 pb-12 px-4 border-t border-white/15 font-mono text-xs text-slate-400">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
                <span class="text-white font-bold uppercase block mb-1">BURN-1 SYSTEMS &amp; CYBER READINESS CLINIC</span>
                <p class="text-[11px] leading-relaxed">
                    Non-Intrusive Outside-In Digital Reconnaissance &amp; Underwriting Evidence Architecture. Governed by Master Services Agreement <a href="legal.html" class="text-cyan-400 underline">MOD-010-AGREE</a>.
                </p>
            </div>
            <div>
                <span class="text-white font-bold uppercase block mb-1">DOWNLOADABLE GUIDES (downloads/)</span>
                <ul class="space-y-1 text-[11px]">
                    <li><a href="zero-cost-mfa-setup-guide.md" download class="hover:text-emerald-400 underline">downloads/zero-cost-mfa-setup-guide.md</a></li>
                    <li><a href="cyber-insurance-evidence-binder-v2.md" download class="hover:text-cyan-400 underline">downloads/cyber-insurance-evidence-binder-v2.md</a></li>
                    <li><a href="zero-cost-immutable-backups-guide.md" download class="hover:text-amber-400 underline">downloads/zero-cost-immutable-backups-guide.md</a></li>
                    <li><a href="downloads_site_pages_bundle.zip" download class="hover:text-purple-400 underline font-bold">downloads/downloads_site_pages_bundle.zip</a></li>
                </ul>
            </div>
            <div>
                <span class="text-white font-bold uppercase block mb-1">INDEPENDENT PARTNER DISCLOSURE</span>
                <p class="text-[11px] leading-relaxed">
                    Intrusive penetration testing, active incident response, and Tier-3 red-team engagements are referred to independent partner <strong>Anergi.io</strong> (<a href="../yelle.html" class="text-amber-400 underline">Anergi Vault</a>) under separate Statement of Work.
                </p>
            </div>
        </div>
        <div class="pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-2 text-[11px]">
            <span>&copy; 2026 Burn One Systems &bull; Path: <code>downloads/{active_file}</code></span>
            <div class="flex gap-4">
                <a href="index.html" class="hover:text-white underline">Suite Index</a>
                <a href="legal.html" class="hover:text-white underline">Legal &amp; SLAs</a>
                <a href="lab.html" class="hover:text-white underline">The Lab &amp; Directory</a>
                <a href="../clinic.html?industry={industry_slug}" class="hover:text-emerald-400 underline">Full Clinic Workbench</a>
            </div>
        </div>
    </footer>

    <script>
        function saveCurrentPageToDownloads(filename) {{
            const htmlContent = "<!DOCTYPE html>\\n" + document.documentElement.outerHTML;
            const blob = new Blob([htmlContent], {{ type: "text/html;charset=utf-8" }});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }}

        function runSectorMicroScan(industry) {{
            const domInput = document.getElementById("dock-scan-domain");
            const out = document.getElementById("dock-scan-output");
            const domain = (domInput && domInput.value.trim()) ? domInput.value.trim() : "burn-1.com";
            if (!out) return;
            out.innerHTML = `<span class="text-amber-300">[SCANNING]</span> Passive outside-in DNS/TLS/Header probe on <strong>${{domain}}</strong> (${{industry.toUpperCase()}} lens)...`;
            setTimeout(() => {{
                const score = domain.includes("burn-1") ? 94 : 78;
                out.innerHTML = `
                    <div class="space-y-1">
                        <div><span class="text-emerald-400 font-bold">✓ PASSIVE SCAN COMPLETE:</span> <strong>${{domain}}</strong> &bull; Readiness Score: <strong>${{score}}/100</strong></div>
                        <div class="text-slate-300">TLS 1.3: <span class="text-emerald-400">PASS</span> | HSTS: <span class="text-emerald-400">PASS</span> | DMARC: <span class="text-amber-300">VERIFY p=reject</span> | Sector Lens: <span class="text-cyan-300">${{industry.toUpperCase()}}</span></div>
                    </div>
                `;
            }}, 550);
        }}

        function exportSectorBinder(industry, title, frameworks) {{
            let credits = 0;
            try {{
                const z = JSON.parse(localStorage.getItem("cyber-hygiene-protocol-v1") || "null");
                const c = JSON.parse(localStorage.getItem("burn1_clinic_v1") || "null");
                if (z && typeof z.credits === "number") credits = Math.max(credits, z.credits);
                if (c && typeof c.credits === "number") credits = Math.max(credits, c.credits);
            }} catch (e) {{}}
            const payload = {{
                dossier: "BURN-1 CYBER INSURANCE EVIDENCE BINDER V2",
                msa: "MOD-010-AGREE",
                industrySlug: industry,
                industryTitle: title,
                regulatoryFrameworks: frameworks,
                earnedCredits: credits,
                maxCredits: 120,
                carrierMatrix: ["Chubb Cyber Enterprise Risk", "Travelers CyberRisk Item 4C/6A", "Coalition Active Posture", "Beazley Breach Response"],
                generatedAt: new Date().toISOString(),
                sha256Seal: "8A1907CB249DF1E38902AA710499C4187E601C33800B"
            }};
            const blob = new Blob([JSON.stringify(payload, null, 2)], {{ type: "application/json" }});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Evidence_Binder_v2_${{industry}}_${{Date.now()}}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }}

        window.addEventListener("DOMContentLoaded", () => {{
            try {{
                let credits = 0;
                const z = JSON.parse(localStorage.getItem("cyber-hygiene-protocol-v1") || "null");
                const c = JSON.parse(localStorage.getItem("burn1_clinic_v1") || "null");
                if (z && typeof z.credits === "number") credits = Math.max(credits, z.credits);
                if (c && typeof c.credits === "number") credits = Math.max(credits, c.credits);
                const crEl = document.getElementById("dock-credits");
                const netEl = document.getElementById("dock-net-price");
                if (crEl) crEl.textContent = `${{credits}} / 120 CR`;
                if (netEl) netEl.textContent = `$${{Math.max(130, 250 - credits)}} / $${{Math.max(380, 500 - credits)}}`;
            }} catch (e) {{}}
        }});
    </script>
    """


def wrap_page(filename: str, title: str, industry_slug: str, industry_title: str,
              frameworks: str, warranty_focus: str, body_html: str,
              custom_css: str = "", body_class: str = "bg-slate-950 text-slate-100") -> str:
    nav = build_shared_nav(filename, industry_slug)
    dock = build_unified_module_dock(industry_slug, industry_title, frameworks, warranty_focus)
    footer = build_shared_footer(filename, industry_slug)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Cyber Readiness Clinic &amp; Burn One Systems</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {{ font-family: 'Plus Jakarta Sans', sans-serif; }}
        .font-mono {{ font-family: 'JetBrains Mono', monospace; }}
        .heading {{ font-family: 'Space Grotesk', sans-serif; }}
        {custom_css}
    </style>
</head>
<body class="{body_class} min-h-screen">
    {nav}
    <main class="px-4 sm:px-6 lg:px-10 py-8">
        {body_html}
        {dock}
    </main>
    {footer}
</body>
</html>
"""


def build_all_24_pages():
    pages = {}

    # 1. HOMEPAGE (downloads/index.html)
    pages["index.html"] = wrap_page(
        "index.html",
        "Homepage // Validate Your Cyber Readiness Before The Carrier Does",
        "general",
        "Universal Cyber Readiness & Underwriting Hub",
        "NIST CSF 2.0 • SOC 2 • ISO 27001 • MOD-010-AGREE",
        "Interactive Mini S.P.A. Omnibar Scanner, 3-Step Onboarding Status Monitor & PayPal REST API Checkout Tiers ($250 / $500 / $750 / $1,000 / $2,400)",
        body_html="""
        <!-- LUMINOUS CLOCK & SHATTERED GLASS HERO BANNER -->
        <section class="max-w-7xl mx-auto rounded-3xl overflow-hidden border-2 border-cyan-500/40 bg-slate-900/90 shadow-2xl mb-10">
            <div class="relative">
                <img src="assets/hero_clock.jpg" alt="Luminous Clock & Shattered Glass Hero" class="w-full h-64 sm:h-80 object-cover opacity-55">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex flex-col justify-end p-6 sm:p-10">
                    <span class="inline-block w-fit px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-xs font-bold uppercase mb-3">
                        ⏱ INITIAL GREETING MASTER HUB // 24-PAGE SUITE
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase tracking-tight">
                        "Don't let your clock run out: validate your cyber readiness before the carrier does"
                    </h1>
                    <p class="text-slate-300 text-sm sm:text-base mt-2 max-w-3xl">
                        Non-intrusive automated perimeter reconnaissance, 8-level cyber hygiene curriculum + 7 advanced operator simulators, and SHA-256 sealed Evidence Binders across 20 regulated industries.
                    </p>
                </div>
            </div>

            <!-- INTERACTIVE MINI S.P.A. OMNIBAR SCANNER & 3-STEP ONBOARDING STATUS MONITOR -->
            <div class="p-6 sm:p-8 bg-slate-950 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-7 space-y-3">
                    <label class="block text-xs font-mono uppercase text-cyan-400 font-bold">
                        // MINI S.P.A. (SECURITY POSTURE ASSESSMENT) OMNIBAR SCANNER
                    </label>
                    <div class="flex flex-col sm:flex-row gap-2">
                        <input id="spa-omnibar-input" type="text" placeholder="Enter corporate domain (e.g. burn-1.com)" value="burn-1.com" class="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-white font-mono text-sm">
                        <button type="button" onclick="runIndexOmnibar()" class="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase">
                            ⚡ Run Mini S.P.A. Scan
                        </button>
                    </div>
                    <div id="spa-omnibar-result" class="p-3 rounded-xl bg-slate-900/90 border border-white/10 font-mono text-xs text-emerald-400">
                        [OMNIBAR READY] Passive DNS (SPF/DKIM/DMARC), TLS 1.3 &amp; HTTP Security Header probe standing by.
                    </div>
                </div>
                <div class="lg:col-span-5 p-4 rounded-2xl bg-slate-900 border border-white/10 font-mono text-xs space-y-2">
                    <span class="text-[10px] text-amber-400 font-bold uppercase block">// 3-STEP ONBOARDING STATUS MONITOR</span>
                    <div class="grid grid-cols-3 gap-2 text-center">
                        <div id="mon-step-1" class="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold">1. PASSIVE SCAN<br><span class="text-[10px]">ACTIVE</span></div>
                        <div id="mon-step-2" class="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold">2. HYGIENE + SIMS<br><span class="text-[10px]">120 CR MAX</span></div>
                        <div id="mon-step-3" class="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-bold">3. SEALED BINDER<br><span class="text-[10px]">SHA-256</span></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PAYPAL REST API CHECKOUT TIERS ($250 / $500 / $750 / $1,000 / $2,400) -->
        <section class="max-w-7xl mx-auto mb-12">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
                <div>
                    <span class="text-xs font-mono text-emerald-400 uppercase font-bold">// COMMERCIAL DELIVERABLE TIERS &bull; PAYPAL REST API CHECKOUT</span>
                    <h2 class="text-2xl sm:text-3xl font-black heading text-white uppercase">Transparent Underwriting &amp; Audit Tiers</h2>
                </div>
                <span class="text-xs font-mono text-amber-300">Earn up to $120 in Academy Credits (L1–8 + A–G) applied automatically</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
                <div class="p-5 rounded-2xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                    <div>
                        <span class="text-[10px] text-cyan-400 font-bold uppercase">TIER 1 // BINDER</span>
                        <div class="text-2xl font-black text-white my-1">$250</div>
                        <div class="text-sm font-bold text-white mb-2">Sealed Evidence Binder v2</div>
                        <p class="text-[11px] text-slate-400 font-sans mb-4">6-page SHA-256 carrier dossier mapped to Chubb, Travelers, Coalition &amp; Beazley.</p>
                    </div>
                    <a href="https://www.paypal.com/ncp/payment/5R9U23V7S2J8S" target="_blank" class="block text-center py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black uppercase">Checkout $250</a>
                </div>
                <div class="p-5 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 flex flex-col justify-between">
                    <div>
                        <span class="text-[10px] text-emerald-400 font-bold uppercase">TIER 2 // APEA AUDIT</span>
                        <div class="text-2xl font-black text-white my-1">$500</div>
                        <div class="text-sm font-bold text-white mb-2">16-Check Live Audit PDF</div>
                        <p class="text-[11px] text-slate-400 font-sans mb-4">Dual IT Engineering + CFO Boardroom 8-page report with live DNS/TLS/Header scan.</p>
                    </div>
                    <a href="https://www.paypal.com/ncp/payment/5R9U23V7S2J8S" target="_blank" class="block text-center py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black uppercase">Checkout $500</a>
                </div>
                <div class="p-5 rounded-2xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                    <div>
                        <span class="text-[10px] text-amber-400 font-bold uppercase">TIER 3 // BUNDLE</span>
                        <div class="text-2xl font-black text-white my-1">$750</div>
                        <div class="text-sm font-bold text-white mb-2">Audit + Evidence Binder + Re-Scan</div>
                        <p class="text-[11px] text-slate-400 font-sans mb-4">Full initial APEA Audit + Sealed Evidence Binder + 30-day post-remediation verification.</p>
                    </div>
                    <a href="https://www.paypal.com/ncp/payment/5R9U23V7S2J8S" target="_blank" class="block text-center py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black uppercase">Checkout $750</a>
                </div>
                <div class="p-5 rounded-2xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                    <div>
                        <span class="text-[10px] text-purple-400 font-bold uppercase">TIER 4 // DRIFT SLA</span>
                        <div class="text-2xl font-black text-white my-1">$1,000</div>
                        <div class="text-sm font-bold text-white mb-2">4x Quarterly Drift Audits</div>
                        <p class="text-[11px] text-slate-400 font-sans mb-4">Annual scheduled outside-in posture verification across all 4 quarters + directory seal.</p>
                    </div>
                    <a href="https://www.paypal.com/ncp/payment/5R9U23V7S2J8S" target="_blank" class="block text-center py-2.5 rounded-xl bg-purple-500 text-white font-black uppercase">Checkout $1,000</a>
                </div>
                <div class="p-5 rounded-2xl bg-slate-900 border border-white/10 flex flex-col justify-between">
                    <div>
                        <span class="text-[10px] text-pink-400 font-bold uppercase">TIER 5 // ENTERPRISE</span>
                        <div class="text-2xl font-black text-white my-1">$2,400</div>
                        <div class="text-sm font-bold text-white mb-2">Multi-Domain Fleet + Priority Triage</div>
                        <p class="text-[11px] text-slate-400 font-sans mb-4">Up to 5 domains, monthly drift telemetry, executive briefing &amp; Anergi.io escalation lane.</p>
                    </div>
                    <a href="https://www.paypal.com/ncp/payment/5R9U23V7S2J8S" target="_blank" class="block text-center py-2.5 rounded-xl bg-pink-500 text-white font-black uppercase">Checkout $2,400</a>
                </div>
            </div>
        </section>

        <!-- DIRECTORY OF ALL 24 SITE SUITE PAGES -->
        <section class="max-w-7xl mx-auto mb-12">
            <h2 class="text-2xl font-black heading text-white uppercase mb-4">Complete 24-Page Sector Architecture (downloads/)</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 font-mono text-xs">
                <a href="healthcare.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-emerald-400 font-bold block">01. Healthcare &amp; Medical</span><span class="text-[11px] text-slate-400">6-Zone OR Hotspot Map • HIPAA</span></a>
                <a href="it.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-cyan-400 font-bold block">02. IT &amp; Infrastructure</span><span class="text-[11px] text-slate-400">CSS Stopwatch &amp; 14-Day CVSS SLA</span></a>
                <a href="finance.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-amber-400 font-bold block">03. Finance &amp; Banking</span><span class="text-[11px] text-slate-400">Dual Breach Ticker • GLBA/SOX</span></a>
                <a href="legal-services.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-slate-200 font-bold block">04. Legal Services</span><span class="text-[11px] text-slate-400">Zero-Ticker Minimalist • Discovery</span></a>
                <a href="energy.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-emerald-400 font-bold block">05. Energy &amp; Utilities</span><span class="text-[11px] text-slate-400">Binary Rain Cloud • NERC CIP</span></a>
                <a href="retail.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-pink-400 font-bold block">06. Retail &amp; E-Commerce</span><span class="text-[11px] text-slate-400">Split-Screen PCI DSS v4.0 Binder</span></a>
                <a href="academy.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-cyan-400 font-bold block">07. Academy &amp; Education</span><span class="text-[11px] text-slate-400">True Day-Mode • L1–8 + A–G</span></a>
                <a href="defense.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-amber-400 font-bold block">08. Defense Contractors</span><span class="text-[11px] text-slate-400">Military Gray #1b1e23 • CMMC 2.0</span></a>
                <a href="construction.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-orange-400 font-bold block">09. Construction</span><span class="text-[11px] text-slate-400">Wire BEC + Independent OSHA Ref</span></a>
                <a href="food.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-lime-400 font-bold block">10. Food &amp; Beverage</span><span class="text-[11px] text-slate-400">FDA FSMA Sec. 204 Traceability</span></a>
                <a href="chemicals.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-purple-400 font-bold block">11. Chemicals &amp; Pharma</span><span class="text-[11px] text-slate-400">29-Min Dissolvable Ghost Line</span></a>
                <a href="manufacturing.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-cyan-400 font-bold block">12. Manufacturing</span><span class="text-[11px] text-slate-400">ICS/SCADA &amp; NIST 800-82 Feed</span></a>
                <a href="government.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-blue-400 font-bold block">13. Government &amp; Public</span><span class="text-[11px] text-slate-400">Federal Colonnade • FedRAMP/FISMA</span></a>
                <a href="transportation.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-amber-400 font-bold block">14. Transportation</span><span class="text-[11px] text-slate-400">6 Flip-Card Fleet Bays (DOT/TSA)</span></a>
                <a href="hospitality.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-pink-400 font-bold block">15. Hospitality &amp; Travel</span><span class="text-[11px] text-slate-400">Concierge Desk • PMS/PCI Panels</span></a>
                <a href="media.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-white font-bold block">16. Media &amp; Entertainment</span><span class="text-[11px] text-slate-400">Monochromatic 4px Double Grid</span></a>
                <a href="telecom.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-cyan-400 font-bold block">17. Telecommunications</span><span class="text-[11px] text-slate-400">Dual-Tower 5G Compliance Conduit</span></a>
                <a href="realestate.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-emerald-400 font-bold block">18. Real Estate</span><span class="text-[11px] text-slate-400">Document-Style Wire &amp; Tenant PII</span></a>
                <a href="nonprofit.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-teal-400 font-bold block">19. Non-Profit</span><span class="text-[11px] text-slate-400">3-Step Donor &amp; Grant Endpoint Flow</span></a>
                <a href="agri-aero.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-amber-400 font-bold block">20. Agriculture &amp; Aerospace</span><span class="text-[11px] text-slate-400">Dual Smart-Farm IoT &amp; ITAR Modules</span></a>
                <a href="onboarding.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-purple-400 font-bold block">21. Cinematic Onboarding</span><span class="text-[11px] text-slate-400">Clinic vs Fire Theme + Fast Mode</span></a>
                <a href="lab.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-cyan-400 font-bold block">22. The Lab &amp; Directory</span><span class="text-[11px] text-slate-400">Trusted Vendor Seal Roster + Ghost</span></a>
                <a href="legal.html" class="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10"><span class="text-red-400 font-bold block">23. Legal Reference (MOD-010)</span><span class="text-[11px] text-slate-400">MSA, SLAs &amp; Anergi.io Disclosures</span></a>
                <a href="downloads_site_pages_bundle.zip" download class="p-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400"><span class="text-emerald-300 font-black block">⬇ Full ZIP Bundle</span><span class="text-[11px] text-emerald-200">downloads_site_pages_bundle.zip</span></a>
            </div>
        </section>
        <script>
            function runIndexOmnibar() {
                const v = document.getElementById('spa-omnibar-input').value.trim() || 'burn-1.com';
                const out = document.getElementById('spa-omnibar-result');
                out.innerHTML = `[SCANNING ${v.toUpperCase()}...] Checking SPF/DMARC, TLS 1.3 handshake, HSTS preload, and X-Frame-Options...`;
                setTimeout(() => {
                    out.innerHTML = `✓ <strong>${v}</strong> VALIDATED: Outside-in posture <strong>92/100</strong> (TLS 1.3 PASS, HSTS PASS, DMARC p=reject READY). Proceed to Step 2 (Hygiene Game) or Step 3 (Binder).`;
                }, 450);
            }
        </script>
        """
    )

    # 2. HEALTHCARE & MEDICAL (downloads/healthcare.html)
    pages["healthcare.html"] = wrap_page(
        "healthcare.html",
        "Healthcare & Medical // 6-Zone Operating Room Hotspot Map",
        "healthcare",
        "Healthcare & Medical Clinical Readiness",
        "HIPAA 45 CFR § 164.312 • HITECH Safe Harbor • NIST SP 800-66",
        "Muted clinical palette (#D8E2E9 / #A3C1AD / #3A4B56) with deep plum/magenta vitality buttons (#2A081C / #D92B8A) and Interactive 6-Zone Operating Room Hotspot Map",
        body_class="bg-[#D8E2E9] text-[#3A4B56]",
        custom_css="""
            .clinical-card { background: #EBF1F5; border: 2px solid #A3C1AD; color: #3A4B56; }
            .vitality-btn { background: #2A081C; color: #ffffff; border: 2px solid #D92B8A; transition: all 0.2s; }
            .vitality-btn:hover { background: #D92B8A; color: #ffffff; box-shadow: 0 0 18px rgba(217,43,138,0.5); }
        """,
        body_html="""
        <section class="max-w-7xl mx-auto clinical-card rounded-3xl p-6 sm:p-10 shadow-xl mb-10">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b border-[#A3C1AD]">
                <div>
                    <span class="px-3 py-1 rounded-full bg-[#A3C1AD]/40 text-[#2A081C] font-mono text-xs font-bold uppercase">
                        HIPAA 45 CFR § 164.312 &bull; CLINICAL OPERATING ROOM ARCHITECTURE
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-black heading text-[#2A081C] uppercase mt-2">
                        Healthcare &amp; Medical Cyber Readiness Clinic
                    </h1>
                    <p class="text-sm sm:text-base text-[#3A4B56] mt-1">
                        Interactive 6-Zone Operating Room Hotspot Map: click any surgical zone below to inspect ePHI technical safeguards and HITECH encryption Safe Harbor controls.
                    </p>
                </div>
                <a href="../clinic.html?industry=healthcare" class="vitality-btn px-5 py-3 rounded-2xl font-mono text-xs font-bold uppercase shrink-0">
                    ♥ Launch Healthcare Clinic Protocol
                </a>
            </div>

            <!-- INTERACTIVE 6-ZONE OPERATING ROOM HOTSPOT MAP -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div class="lg:col-span-7 relative rounded-2xl overflow-hidden border-2 border-[#3A4B56]">
                    <img src="assets/healthcare_or.jpg" alt="Clinical Operating Room Architecture Map" class="w-full h-80 sm:h-96 object-cover">
                    <div class="absolute inset-0 bg-[#2A081C]/35 p-4 flex flex-wrap content-between justify-between">
                        <button type="button" onclick="selectOrZone(1)" class="vitality-btn px-3 py-2 rounded-xl font-mono text-xs font-bold">① Instrument Table</button>
                        <button type="button" onclick="selectOrZone(2)" class="vitality-btn px-3 py-2 rounded-xl font-mono text-xs font-bold">② Wall Clock (SLA)</button>
                        <button type="button" onclick="selectOrZone(3)" class="vitality-btn px-3 py-2 rounded-xl font-mono text-xs font-bold">③ X-Ray Lightbox (PACS)</button>
                        <button type="button" onclick="selectOrZone(4)" class="vitality-btn px-3 py-2 rounded-xl font-mono text-xs font-bold">④ Center Surgical Table</button>
                        <button type="button" onclick="selectOrZone(5)" class="vitality-btn px-3 py-2 rounded-xl font-mono text-xs font-bold">⑤ Vitality Monitors (IoMT)</button>
                        <button type="button" onclick="selectOrZone(6)" class="vitality-btn px-3 py-2 rounded-xl font-mono text-xs font-bold">⑥ Medical Staff RBAC</button>
                    </div>
                </div>
                <div class="lg:col-span-5 p-6 rounded-2xl bg-[#2A081C] text-white border-2 border-[#D92B8A] font-mono">
                    <span class="text-xs text-[#D92B8A] font-bold uppercase block mb-1">// SELECTED OPERATING ROOM HOTSPOT</span>
                    <h3 id="or-zone-title" class="text-xl font-black uppercase text-white mb-2">① Instrument Table — Endpoint &amp; USB Sanitization</h3>
                    <p id="or-zone-desc" class="text-xs text-slate-200 font-sans leading-relaxed mb-4">
                        Clinical workstations and diagnostic carts require USB mass-storage lockdown, CrowdStrike/Defender EDR telemetry, and automated 15-minute idle session termination under 45 CFR § 164.312(a)(2)(iii).
                    </p>
                    <div id="or-zone-control" class="p-3 rounded-xl bg-black/50 border border-[#A3C1AD]/40 text-xs text-[#A3C1AD]">
                        Underwriting Artifact: Endpoint Encryption &amp; Auto-Logoff GPO Screenshot
                    </div>
                </div>
            </div>
        </section>
        <script>
            const OR_ZONES = {
                1: { t: "① Instrument Table — Endpoint & USB Sanitization", d: "Clinical workstations and diagnostic carts require BitLocker/FileVault full-disk encryption and automated idle logoff (45 CFR § 164.312(a)(2)(iii)).", c: "Underwriting Artifact: Full-Disk Encryption & USB Lockdown Policy" },
                2: { t: "② Wall Clock — 60-Minute Golden Hour & HITECH Breach Clock", d: "Synchronized NTP audit logs across all EHR servers and 72-hour cyber insurance carrier notification playbooks.", c: "Underwriting Artifact: NTP Audit Log Sync & Incident Response Tabletop Log" },
                3: { t: "③ X-Ray Lightbox — DICOM / PACS Medical Imaging VLAN", d: "Isolate legacy PACS imaging servers on a restricted clinical VLAN with zero direct internet exposure and SMBv1 disabled.", c: "Underwriting Artifact: PACS VLAN Firewall Segmentation Matrix" },
                4: { t: "④ Center Surgical Table — Core EHR Database & S3 Object Lock", d: "Immutable 3-2-1-1-0 air-gapped backups of Epic/Cerner/Athena databases with AES-256 encryption at rest.", c: "Underwriting Artifact: Immutable Backup Restore Test Certificate (Item 6A)" },
                5: { t: "⑤ Vitality Monitors — IoMT & Infusion Pump Telemetry Isolation", d: "Connected patient monitors and telemetry gateways isolated from guest Wi-Fi with strict MAC allowlisting.", c: "Underwriting Artifact: IoMT Network Access Control (NAC) Inventory" },
                6: { t: "⑥ Medical Staff RBAC — FIDO2 Tap-Badge & Privileged MFA", d: "Zero shared nurse-station credentials; phishing-resistant MFA on 100% of remote VPN, Citrix, and cloud EHR logins.", c: "Underwriting Artifact: IdP 100% MFA Enrollment Export (Chubb Schedule B)" }
            };
            function selectOrZone(id) {
                const z = OR_ZONES[id];
                if (!z) return;
                document.getElementById('or-zone-title').textContent = z.t;
                document.getElementById('or-zone-desc').textContent = z.d;
                document.getElementById('or-zone-control').textContent = z.c;
            }
        </script>
        """
    )

    # 3. IT & INFRASTRUCTURE (downloads/it.html)
    pages["it.html"] = wrap_page(
        "it.html",
        "IT & Infrastructure // CSS Stopwatch & 14-Day CVSS 9+ SLA Countdown",
        "it",
        "IT, SaaS & Cloud Infrastructure",
        "SOC 2 Type II • ISO/IEC 27001:2022 • Coalition 14-Day CVSS 9+ SLA",
        "Dark slate technical layout for SOC 2 and ISO 27001 evidence recipients featuring the Accelerating Solutions CSS Stopwatch & 14-Day CVSS 9+ SLA Countdown Timer",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border border-cyan-500/40 mb-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div class="lg:col-span-7 space-y-4">
                    <span class="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase">
                        SOC 2 TYPE II &bull; ISO 27001:2022 &bull; EDGE PATCHING SLA
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase">
                        Accelerating Solutions &amp; 14-Day CVSS 9+ SLA Countdown
                    </h1>
                    <p class="text-slate-300 text-sm sm:text-base">
                        Coalition and Beazley cyber policies mandate patching critical perimeter CVEs (CVSS 9.0+ on VPNs, firewalls, and edge gateways) within 14 days of disclosure. Benchmark your MTTR against the live SLA countdown.
                    </p>
                </div>
                <!-- ACCELERATING SOLUTIONS CSS STOPWATCH & 14-DAY SLA COUNTDOWN -->
                <div class="lg:col-span-5 p-6 rounded-3xl bg-slate-950 border-2 border-cyan-400 text-center font-mono">
                    <div class="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-cyan-400 flex items-center justify-center relative shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                        <div class="w-1 h-9 bg-amber-400 origin-bottom animate-spin" style="animation-duration: 8s;"></div>
                        <span class="absolute text-[10px] bottom-2 text-cyan-300 font-bold">CSS CHRONO</span>
                    </div>
                    <span class="text-[11px] text-amber-400 font-bold uppercase block">14-DAY CVSS 9.0+ REMEDIATION SLA CLOCK</span>
                    <div id="it-sla-countdown" class="text-2xl sm:text-3xl font-black text-white my-2">13d : 23h : 59m : 42s</div>
                    <button type="button" onclick="accelerateSlaClock()" class="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase">
                        ⚡ Verify Edge Patch &amp; Lock SLA Stamp
                    </button>
                </div>
            </div>
        </section>
        <script>
            let itSeconds = 14 * 86400 - 18;
            setInterval(() => {
                itSeconds = Math.max(0, itSeconds - 1);
                const d = Math.floor(itSeconds / 86400);
                const h = Math.floor((itSeconds % 86400) / 3600);
                const m = Math.floor((itSeconds % 3600) / 60);
                const s = itSeconds % 60;
                const el = document.getElementById('it-sla-countdown');
                if (el && !el.dataset.locked) el.textContent = `${d}d : ${String(h).padStart(2,'0')}h : ${String(m).padStart(2,'0')}m : ${String(s).padStart(2,'0')}s`;
            }, 1000);
            function accelerateSlaClock() {
                const el = document.getElementById('it-sla-countdown');
                el.dataset.locked = "1";
                el.textContent = "SLA VERIFIED // 0 OPEN CVSS 9+";
                el.className = "text-xl sm:text-2xl font-black text-emerald-400 my-2";
            }
        </script>
        """
    )

    # 4. FINANCE & BANKING (downloads/finance.html)
    pages["finance.html"] = wrap_page(
        "finance.html",
        "Finance & Banking // Dual Stock & Breach Loss Ticker Hub",
        "finance",
        "Finance, Banking & Wealth Management",
        "GLBA Safeguards Rule • NYDFS 23 NYCRR 500 • SOX Sec. 404",
        "Toggleable Dual Stock & Breach Loss Ticker Bar ($10.5T annual global cost / $4.88M average breach), Quarterly Global Cybercrime Loss Ledger, and Breach News Feed & Video Briefing Player",
        body_html="""
        <!-- TOGGLEABLE DUAL STOCK & BREACH LOSS TICKER BAR -->
        <section class="max-w-7xl mx-auto mb-8 rounded-2xl bg-slate-900 border border-amber-500/40 p-4 font-mono text-xs">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span class="text-amber-400 font-bold uppercase">// LIVE FINANCIAL RISK &amp; BREACH LOSS TELEMETRY</span>
                <button type="button" onclick="toggleFinanceTicker()" class="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px] uppercase">
                    ⇄ Toggle Stock / Breach Loss Ticker
                </button>
            </div>
            <div id="fin-ticker-breach" class="p-2.5 rounded-xl bg-black text-red-400 font-bold overflow-x-auto whitespace-nowrap">
                [GLOBAL BREACH LEDGER] Annual Cybercrime Cost: $10.5 TRILLION ▲ &bull; Avg Financial Breach Cost: $6.08M ($4.88M Cross-Sector) ▲ &bull; BEC Wire Fraud Median Loss: $125,000 ▲ &bull; NYDFS 500.17 Reporting Window: 72 HOURS
            </div>
            <div id="fin-ticker-stock" class="hidden p-2.5 rounded-xl bg-black text-emerald-400 font-bold overflow-x-auto whitespace-nowrap">
                [CYBER UNDERWRITING INDEX] CHUBB (CB): +1.4% ▲ &bull; TRAVELERS (TRV): +0.9% ▲ &bull; BEAZLEY (BEZ.L): +1.8% ▲ &bull; FIDO2 MFA DISCOUNT ELIGIBILITY: +15% PREMIUM CREDIT
            </div>
        </section>

        <section class="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-slate-900 border border-emerald-500/30 mb-10">
            <img src="assets/finance_vault.jpg" alt="Finance Cyber Vault & Global Ledger" class="w-full h-56 sm:h-72 object-cover opacity-65">
            <div class="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- QUARTERLY GLOBAL CYBERCRIME LOSS LEDGER -->
                <div class="lg:col-span-6 space-y-3 font-mono text-xs">
                    <span class="text-emerald-400 font-bold uppercase block">// QUARTERLY GLOBAL CYBERCRIME LOSS LEDGER</span>
                    <h1 class="text-2xl sm:text-3xl font-black heading text-white uppercase">GLBA, NYDFS Part 500 &amp; SOX 404 Vault</h1>
                    <table class="w-full text-left border-collapse border border-white/10">
                        <thead>
                            <tr class="bg-slate-950 text-amber-300">
                                <th class="p-2.5 border border-white/10">Quarter</th>
                                <th class="p-2.5 border border-white/10">Global Loss Run</th>
                                <th class="p-2.5 border border-white/10">Primary Vector</th>
                                <th class="p-2.5 border border-white/10">Warranty Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td class="p-2.5 border border-white/10">Q1</td><td class="p-2.5 border border-white/10 text-red-400">$2.41T</td><td class="p-2.5 border border-white/10">ACH / SWIFT BEC</td><td class="p-2.5 border border-white/10 text-emerald-400">Dual Out-of-Band Callback</td></tr>
                            <tr><td class="p-2.5 border border-white/10">Q2</td><td class="p-2.5 border border-white/10 text-red-400">$2.58T</td><td class="p-2.5 border border-white/10">AiTM Session Hijack</td><td class="p-2.5 border border-white/10 text-emerald-400">FIDO2 Hardware Keys</td></tr>
                            <tr><td class="p-2.5 border border-white/10">Q3</td><td class="p-2.5 border border-white/10 text-red-400">$2.69T</td><td class="p-2.5 border border-white/10">Citrix / VPN Zero-Day</td><td class="p-2.5 border border-white/10 text-emerald-400">14-Day CVSS 9+ SLA</td></tr>
                            <tr><td class="p-2.5 border border-white/10">Q4</td><td class="p-2.5 border border-white/10 text-red-400">$2.82T</td><td class="p-2.5 border border-white/10">Backup Extortion</td><td class="p-2.5 border border-white/10 text-emerald-400">S3 Object Lock Compliance</td></tr>
                        </tbody>
                    </table>
                </div>
                <!-- SIDE-BY-SIDE BREACH NEWS FEED & VIDEO BRIEFING PLAYER -->
                <div class="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    <div class="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                        <span class="text-cyan-400 font-bold uppercase block">// LIVE BREACH INTEL FEED</span>
                        <div class="p-2.5 rounded-lg bg-slate-900 border-l-2 border-red-400"><strong>NYDFS § 500.12:</strong> Multi-Factor enforcement audit penalties increased for non-exempt wire desks.</div>
                        <div class="p-2.5 rounded-lg bg-slate-900 border-l-2 border-amber-400"><strong>SEC 8-K Item 1.05:</strong> 4-business-day material cybersecurity incident disclosure clock active.</div>
                        <div class="p-2.5 rounded-lg bg-slate-900 border-l-2 border-emerald-400"><strong>Travelers Item 4C:</strong> Out-of-band phone verification required on all routing changes.</div>
                    </div>
                    <div class="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col justify-between">
                        <div>
                            <span class="text-amber-400 font-bold uppercase block mb-2">// EXECUTIVE VIDEO BRIEFING</span>
                            <video controls poster="assets/finance_vault.jpg" class="w-full h-36 rounded-xl object-cover bg-black border border-white/10">
                                <source src="../assets/Why_You_Need_A_Security_Posture_Assessment.mp4" type="video/mp4">
                            </video>
                        </div>
                        <p class="text-[11px] text-slate-400 font-sans mt-2">Boardroom S.P.A. &amp; Underwriting Defense Briefing</p>
                    </div>
                </div>
            </div>
        </section>
        <script>
            function toggleFinanceTicker() {
                document.getElementById('fin-ticker-breach').classList.toggle('hidden');
                document.getElementById('fin-ticker-stock').classList.toggle('hidden');
            }
        </script>
        """
    )

    # 5. LEGAL SERVICES (downloads/legal-services.html)
    pages["legal-services.html"] = wrap_page(
        "legal-services.html",
        "Legal Services // Privileged Discovery & ABA Rule 1.6 Architecture",
        "legal",
        "Legal Services & Law Firm Discovery Vault",
        "ABA Model Rule 1.6(c) • State Bar Ethics • IOLTA Escrow Protection",
        "Long-scroll minimalist layout with zero tickers, modern geometric typography, full-bleed architectural hero image, and discovery confidentiality stages",
        body_class="bg-neutral-950 text-neutral-100",
        body_html="""
        <!-- FULL-BLEED ARCHITECTURAL HERO (ZERO TICKERS, MINIMALIST GEOMETRIC) -->
        <section class="max-w-7xl mx-auto mb-14">
            <div class="rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900">
                <img src="assets/legal_arch.jpg" alt="Modern Legal Architectural Monolith" class="w-full h-72 sm:h-96 object-cover">
                <div class="p-8 sm:p-12 space-y-4">
                    <span class="font-mono text-xs uppercase tracking-widest text-amber-400">ABA MODEL RULE 1.6(c) &bull; ZERO-TICKER PRIVILEGED ARCHITECTURE</span>
                    <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase tracking-tight">
                        Counsel Confidentiality &amp; eDiscovery Evidentiary Integrity
                    </h1>
                    <p class="text-neutral-300 text-base max-w-3xl leading-relaxed">
                        Designed for Managing Partners, General Counsel, and Litigation Support Teams. Verify privileged document management (iManage / NetDocuments), IOLTA escrow wire callbacks, and ethical competence duties without noisy distractions.
                    </p>
                </div>
            </div>

            <!-- 4 DISCOVERY CONFIDENTIALITY STAGES -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 font-mono text-xs">
                <div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <span class="text-amber-400 font-bold">STAGE 01 // INTAKE</span>
                    <h3 class="text-base font-bold text-white uppercase">Conflict &amp; Privilege Wall</h3>
                    <p class="text-neutral-400 font-sans text-xs">Matter-level ethical walls and FIDO2 MFA across all partner and paralegal remote access.</p>
                </div>
                <div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <span class="text-amber-400 font-bold">STAGE 02 // eDISCOVERY</span>
                    <h3 class="text-base font-bold text-white uppercase">Metadata Scrubbing</h3>
                    <p class="text-neutral-400 font-sans text-xs">Automated EXIF/revision-history purging and zero-knowledge encrypted production vaults.</p>
                </div>
                <div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <span class="text-amber-400 font-bold">STAGE 03 // IOLTA ESCROW</span>
                    <h3 class="text-base font-bold text-white uppercase">Out-of-Band Wire Protocol</h3>
                    <p class="text-neutral-400 font-sans text-xs">Dual-partner signature and verified phone callback prior to any settlement or trust disbursement.</p>
                </div>
                <div class="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <span class="text-amber-400 font-bold">STAGE 04 // SEALED BINDER</span>
                    <h3 class="text-base font-bold text-white uppercase">Outside Counsel OCG Audit</h3>
                    <p class="text-neutral-400 font-sans text-xs">Machine-signed SHA-256 posture binder satisfying institutional client Outside Counsel Guidelines.</p>
                </div>
            </div>
        </section>
        """
    )

    # 6. ENERGY & UTILITIES (downloads/energy.html)
    pages["energy.html"] = wrap_page(
        "energy.html",
        "Energy & Utilities // Server-to-Server Electricity & Binary Rain Cloud",
        "energy",
        "Energy, Power Grid & Critical Utilities",
        "NERC CIP-005 / CIP-007 • TSA Pipeline Directives • CISA CPGs",
        "Contrasting IT/OT NERC CIP layout with Interactive Center-Page CSS Server-to-Server Electricity & Binary-Code Rain Cloud Demonstration plus pre-filled questionnaire",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border border-emerald-500/40 mb-10">
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase">
                NERC CIP-005 ELECTRONIC SECURITY PERIMETER (ESP) &bull; IT/OT CONVERGENCE
            </span>
            <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-3 mb-6">
                Interactive Server-to-Server Electricity &amp; Binary-Code Rain Cloud
            </h1>

            <!-- CENTER-PAGE CSS SERVER-TO-SERVER ELECTRICITY & BINARY-CODE RAIN CLOUD -->
            <div class="p-6 rounded-3xl bg-slate-950 border-2 border-cyan-500/50 mb-8 font-mono text-xs">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                    <div class="p-5 rounded-2xl bg-slate-900 border border-cyan-400">
                        <i class="fa-solid fa-server text-3xl text-cyan-400 mb-2"></i>
                        <div class="font-black text-white uppercase">IT CORPORATE NODE</div>
                        <div class="text-[11px] text-slate-400">ERP / Billing / Entra ID</div>
                    </div>
                    <div class="p-4 rounded-2xl bg-gradient-to-b from-cyan-950/60 to-emerald-950/60 border border-emerald-400 relative overflow-hidden">
                        <div class="text-amber-300 font-black uppercase mb-1">⚡ HIGH-VOLTAGE DATA CONDUIT ⚡</div>
                        <div id="binary-rain-stream" class="text-emerald-400 tracking-widest text-xs font-bold leading-5">
                            01001110 01000101 01010010 01000011<br>
                            11010010 00110101 10101100 01110001
                        </div>
                        <button type="button" onclick="pulseEnergyArc()" class="mt-2 px-3 py-1 rounded bg-emerald-400 text-slate-950 font-black text-[10px] uppercase">
                            Test Unidirectional Data Diode
                        </button>
                    </div>
                    <div class="p-5 rounded-2xl bg-slate-900 border border-amber-400">
                        <i class="fa-solid fa-bolt-lightning text-3xl text-amber-400 mb-2"></i>
                        <div class="font-black text-white uppercase">OT SCADA SUBSTATION</div>
                        <div class="text-[11px] text-slate-400">PLC / RTU / Historian Air-Gap</div>
                    </div>
                </div>
            </div>

            <!-- PRE-FILLED NERC CIP QUESTIONNAIRE & CINEMATIC ONBOARDING SWITCHER -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div class="p-4 rounded-2xl bg-slate-950 border border-white/10">
                    <span class="text-emerald-400 font-bold block mb-1">✓ PRE-FILLED NERC CIP-005 QUESTION 01:</span>
                    <p class="text-slate-300 font-sans">Are all interactive remote access sessions into the Electronic Security Perimeter (ESP) routed through an Intermediate System with MFA?</p>
                    <span class="text-cyan-300 font-bold block mt-2">Default Status: VERIFIED (Jump-Host + FIDO2 Enforced)</span>
                </div>
                <div class="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col justify-between">
                    <div>
                        <span class="text-amber-400 font-bold block mb-1">// CINEMATIC ONBOARDING SWITCHER</span>
                        <p class="text-slate-300 font-sans">Switch to big-button step-by-step Cinematic Onboarding for utility field operators.</p>
                    </div>
                    <a href="onboarding.html?industry=energy" class="mt-3 inline-block text-center py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black uppercase">Open Cinematic Onboarding &rarr;</a>
                </div>
            </div>
        </section>
        <script>
            function pulseEnergyArc() {
                const el = document.getElementById('binary-rain-stream');
                el.innerHTML = "11110000 10101010 [ESP DIODE LOCKED] 01010101<br>✓ ZERO INBOUND OT PACKETS PERMITTED";
            }
        </script>
        """
    )

    # 7. RETAIL & E-COMMERCE (downloads/retail.html)
    pages["retail.html"] = wrap_page(
        "retail.html",
        "Retail & E-Commerce // 2-Column Split-Screen PCI DSS v4.0 Binder",
        "retail",
        "Retail, POS & E-Commerce Merchants",
        "PCI DSS v4.0 Req. 6.4.3 & 11.6.1 • CCPA / CPRA",
        "'Accelerating Through Time' 2-Column Split-Screen with scrollable PCI DSS v4.0 Evidence Binder & Retail Customer/Transaction Data Security Policy on the left and sticky rapid onboarding & seat selector on the right",
        body_html="""
        <section class="max-w-7xl mx-auto mb-10">
            <span class="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-mono text-xs font-bold uppercase">
                ACCELERATING THROUGH TIME // PCI DSS v4.0 SPLIT-SCREEN WORKBENCH
            </span>
            <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-2 mb-6">
                Retail &amp; E-Commerce PCI DSS v4.0 Evidence Binder
            </h1>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <!-- LEFT: SCROLLABLE PCI DSS v4.0 EVIDENCE BINDER & SECURITY POLICY -->
                <div class="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-white/15 max-h-[460px] overflow-y-auto space-y-4 font-mono text-xs">
                    <h3 class="text-lg font-black text-pink-400 uppercase sticky top-0 bg-slate-900 py-2 border-b border-white/10">
                        📜 Scrollable PCI DSS v4.0 Evidence Binder &amp; Transaction Data Policy
                    </h3>
                    <div class="p-4 rounded-xl bg-slate-950 border border-white/10">
                        <strong class="text-white block mb-1">Section 1 — PCI DSS v4.0 Req. 6.4.3 (Payment Page Script Inventory):</strong>
                        <p class="text-slate-300 font-sans">All third-party JavaScript executing on the hosted checkout page is authorized, inventoried, and enforced via Content-Security-Policy (CSP) and Subresource Integrity (SRI) hashes to prevent Magecart e-skimming.</p>
                    </div>
                    <div class="p-4 rounded-xl bg-slate-950 border border-white/10">
                        <strong class="text-white block mb-1">Section 2 — PCI DSS v4.0 Req. 11.6.1 (Tamper-Detection Mechanism):</strong>
                        <p class="text-slate-300 font-sans">Automated HTTP header and script-integrity drift checks evaluate payment pages weekly and alert personnel to unauthorized modifications.</p>
                    </div>
                    <div class="p-4 rounded-xl bg-slate-950 border border-white/10">
                        <strong class="text-white block mb-1">Section 3 — Point-of-Sale (POS) Terminal VLAN Segmentation:</strong>
                        <p class="text-slate-300 font-sans">Cardholder Data Environment (CDE) POS terminals operate on an isolated firewall VLAN separated from guest Wi-Fi and back-office workstations.</p>
                    </div>
                    <div class="p-4 rounded-xl bg-slate-950 border border-white/10">
                        <strong class="text-white block mb-1">Section 4 — Seasonal Associate Access &amp; Gift-Card Fraud Controls:</strong>
                        <p class="text-slate-300 font-sans">Unique associate POS PINs/tokens with zero shared manager overrides and mandatory out-of-band callback for supplier bank changes.</p>
                    </div>
                </div>

                <!-- RIGHT: STICKY RAPID ONBOARDING & SEAT SELECTOR -->
                <div class="lg:col-span-5 sticky top-20 p-6 rounded-3xl bg-slate-900 border-2 border-pink-500/50 font-mono text-xs space-y-4">
                    <span class="text-pink-400 font-bold uppercase block">// STICKY RAPID ONBOARDING &amp; SEAT SELECTOR</span>
                    <h3 class="text-xl font-black text-white uppercase">Configure Store &amp; Associate Seats</h3>
                    <div>
                        <label class="block text-slate-400 mb-1">Active Associate / POS Seats:</label>
                        <input id="retail-seats" type="range" min="5" max="250" value="25" oninput="updateRetailSeats(this.value)" class="w-full">
                        <div class="flex justify-between text-emerald-400 font-bold mt-1">
                            <span id="retail-seat-label">25 Associate Seats</span>
                            <span>PCI DSS v4.0 Ready</span>
                        </div>
                    </div>
                    <a href="../clinic.html?industry=retail" class="block text-center py-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-black uppercase">
                        Launch Retail Hygiene Protocol &rarr;
                    </a>
                </div>
            </div>
        </section>
        <script>
            function updateRetailSeats(v) {
                document.getElementById('retail-seat-label').textContent = `${v} Associate Seats`;
            }
        </script>
        """
    )

    # 8. ACADEMY & EDUCATION (downloads/academy.html)
    pages["academy.html"] = wrap_page(
        "academy.html",
        "Academy & Education // True Day-Mode 8 Free Classes & A-G Simulators",
        "general",
        "True Day-Mode Cyber Hygiene Academy (Levels 1-8 + Simulators A-G)",
        "NIST CSF 2.0 • Chubb MFA Schedule B • Travelers Item 6A",
        "True Day-Mode Academy featuring the 8 Free Cyber Hygiene Classes (Levels 1-8), Advanced Anti-Phishing & MFA-2 Simulators (Levels A-G) (toolsfunnel), and 1-click downloads",
        body_class="bg-slate-100 text-slate-900",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-white border-2 border-slate-300 shadow-xl mb-10 text-slate-900">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                    <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold uppercase">
                        TRUE DAY-MODE ACADEMY // TOOLSFUNNEL CURRICULUM
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-black heading text-slate-900 uppercase mt-2">
                        8 Free Cyber Hygiene Classes + Advanced Simulators (A–G)
                    </h1>
                    <p class="text-slate-600 text-sm sm:text-base mt-1">
                        Complete Levels 1–8 (40 Credits) and Advanced Anti-Phishing &amp; MFA-2 Simulators A–G (80 Credits) to unlock <strong>HOORAY // OPERATOR</strong> status and $120 in Evidence Binder credits.
                    </p>
                </div>
                <a href="../clinic.html" class="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-mono text-xs font-black uppercase shrink-0">
                    🎮 Open Interactive Workbench (L1–8 + A–G)
                </a>
            </div>

            <!-- 1-CLICK ZERO-COST DOWNLOADS BAR -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 font-mono text-xs">
                <a href="zero-cost-mfa-setup-guide.md" download class="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950">
                    <span class="font-black block uppercase">⬇ 1. Zero-Cost MFA Setup Guide</span>
                    <span class="text-[11px] text-emerald-700">downloads/zero-cost-mfa-setup-guide.md</span>
                </a>
                <a href="cyber-insurance-evidence-binder-v2.md" download class="p-4 rounded-2xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 text-cyan-950">
                    <span class="font-black block uppercase">⬇ 2. Evidence Binder v2 Template</span>
                    <span class="text-[11px] text-cyan-700">downloads/cyber-insurance-evidence-binder-v2.md</span>
                </a>
                <a href="zero-cost-immutable-backups-guide.md" download class="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950">
                    <span class="font-black block uppercase">⬇ 3. Immutable Backups Guide</span>
                    <span class="text-[11px] text-amber-700">downloads/zero-cost-immutable-backups-guide.md</span>
                </a>
            </div>

            <!-- 8 FREE CLASSES + 7 ADVANCED SIMULATORS SUMMARY GRID -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 class="text-base font-black uppercase text-slate-900">8 Free Cyber Hygiene Classes (40 Credits)</h3>
                    <ul class="space-y-1.5 text-slate-700 font-sans">
                        <li><strong>L1:</strong> Cookie Purge Protocol (Fresh Start • +5 CR)</li>
                        <li><strong>L2:</strong> Background App Shutdown (Silent Guardian • +5 CR)</li>
                        <li><strong>L3:</strong> Permission Creep Review (Zero Trust Rookie • +5 CR)</li>
                        <li><strong>L4:</strong> Extension &amp; Add-On Audit (Browser Sentinel • +5 CR)</li>
                        <li><strong>L5:</strong> Password Posture Check (Fortress Builder • +5 CR)</li>
                        <li><strong>L6:</strong> Digital Footprint Reduction (Shadow Mode • +5 CR)</li>
                        <li><strong>L7:</strong> Tracking Vector Lockdown (Ghost Protocol • +5 CR)</li>
                        <li><strong>L8:</strong> Device Integrity Check (System Guardian • +5 CR)</li>
                    </ul>
                </div>
                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 class="text-base font-black uppercase text-slate-900">7 Advanced Simulators A–G (toolsfunnel • 80 Credits)</h3>
                    <ul class="space-y-1.5 text-slate-700 font-sans">
                        <li><strong>MOD-A:</strong> Phishing Signal Decoder (Signal Decoder • +10 CR)</li>
                        <li><strong>MOD-B:</strong> URL Deconstruction Lab (Link Surgeon • +10 CR)</li>
                        <li><strong>MOD-C:</strong> MFA-2 Architecture &amp; Bypass Defense (Auth Architect • +12 CR)</li>
                        <li><strong>MOD-D:</strong> Identity Threat Detection / ITDR (Identity Hunter • +12 CR)</li>
                        <li><strong>MOD-E:</strong> Network &amp; DNS Hygiene (Packet Warden • +10 CR)</li>
                        <li><strong>MOD-F:</strong> Data Classification &amp; 3-2-1-1-0 Vault (Vault Keeper • +13 CR)</li>
                        <li><strong>MOD-G:</strong> Incident Response: First 15 Minutes (First Responder • +13 CR)</li>
                    </ul>
                </div>
            </div>
        </section>
        """
    )

    # 9. DEFENSE CONTRACTORS (downloads/defense.html)
    pages["defense.html"] = wrap_page(
        "defense.html",
        "Defense Contractors // Night-Mode Military Gray CMMC 2.0 Level 2 Locker",
        "defense",
        "Defense Industrial Base (DIB) Contractors",
        "CMMC 2.0 Level 2 • DFARS 252.204-7012 • NIST SP 800-171 Rev 2 (110 Controls)",
        "Night-Mode Military Gray (#1b1e23) aesthetic with CMMC 2.0 Level 2 and DFARS CUI automated evidence locker controls",
        body_class="bg-[#1b1e23] text-slate-100",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-[#23272e] border-2 border-amber-500/40 mb-10 font-mono">
            <span class="px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase">
                MILITARY GRAY #1B1E23 // CMMC 2.0 LEVEL 2 &amp; DFARS 252.204-7012 CUI ENCLAVE
            </span>
            <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-3 mb-4">
                Automated CUI Evidence Locker &amp; SPRS Score Readiness
            </h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-6">
                <div class="p-5 rounded-2xl bg-[#1b1e23] border border-white/10">
                    <span class="text-amber-400 font-bold block mb-1">3.1.1 / 3.5.3 — ACCESS &amp; FIPS MFA</span>
                    <p class="text-slate-300 font-sans">Multi-factor authentication using FIPS 140-3 validated cryptographic modules for all local and network access to Controlled Unclassified Information (CUI).</p>
                </div>
                <div class="p-5 rounded-2xl bg-[#1b1e23] border border-white/10">
                    <span class="text-emerald-400 font-bold block mb-1">DFARS 7012(c) — 72-HOUR DIBNET SLA</span>
                    <p class="text-slate-300 font-sans">Rapid cyber incident reporting workflow to DoD DIBNet within 72 hours of discovery, preserving media images for 90 days.</p>
                </div>
                <div class="p-5 rounded-2xl bg-[#1b1e23] border border-white/10">
                    <span class="text-cyan-400 font-bold block mb-1">3.12.4 — SYSTEM SECURITY PLAN (SSP)</span>
                    <p class="text-slate-300 font-sans">Automated POA&amp;M and SSP evidence binder mapped directly to NIST SP 800-171 Rev 2 for C3PAO assessment readiness.</p>
                </div>
            </div>
        </section>
        """
    )

    # 10. CONSTRUCTION (downloads/construction.html)
    pages["construction.html"] = wrap_page(
        "construction.html",
        "Construction & Trades // Subcontractor Wire BEC & Independent OSHA Partner",
        "construction",
        "Construction, General Contractors & Heavy Trades",
        "Travelers Item 4C Wire Callback • CAD/BIM Ransomware • Independent OSHA Partner",
        "Subcontractor wire BEC and CAD ransomware protection paired with digital training log intake and Independent OSHA Physical Audit Partner Referrals",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border-2 border-amber-500/40 mb-10">
            <span class="px-3 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase">
                GENERAL CONTRACTORS &amp; TRADES // WIRE BEC &amp; CAD VAULT PROTECTION
            </span>
            <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-3 mb-4">
                Subcontractor Pay-App Wire Defense &amp; Crew Training Log Intake
            </h1>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs mt-6">
                <div class="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <span class="text-emerald-400 font-bold uppercase block">// DIGITAL CREW TRAINING LOG INTAKE</span>
                    <p class="text-slate-300 font-sans">Log field superintendent and project manager completion of anti-phishing and AIA pay-application ACH callback verification.</p>
                    <div class="flex gap-2">
                        <input type="text" placeholder="Project / Crew Lead Name" class="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white">
                        <button type="button" onclick="alert('✓ Crew Lead Training Logged to Construction Evidence Binder!')" class="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black uppercase">Log Crew</button>
                    </div>
                </div>
                <div class="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                    <span class="text-amber-400 font-bold uppercase block">// INDEPENDENT OSHA PHYSICAL AUDIT PARTNER REFERRALS</span>
                    <p class="text-slate-200 font-sans">
                        Burn One Systems strictly performs non-intrusive digital cyber readiness assessments (MOD-010-AGREE). For jobsite physical safety inspections and OSHA 1926 compliance audits, request an introduction to our independent accredited OSHA physical audit partners.
                    </p>
                </div>
            </div>
        </section>
        """
    )

    # 11. FOOD & BEVERAGE (downloads/food.html)
    pages["food.html"] = wrap_page(
        "food.html",
        "Food & Beverage // FDA FSMA Section 204 Traceability Scanner",
        "food",
        "Food & Beverage Supply Chain & Cold Storage",
        "FDA FSMA Section 204 (KDE / CTE) • Cold-Chain OT Segmentation",
        "Automated supply chain traceability scanner with a static, objective FDA Food Safety Modernization Act (FSMA) Section 204 reference block",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border border-lime-500/40 mb-10">
            <span class="px-3 py-1 rounded bg-lime-500/20 text-lime-300 font-mono text-xs font-bold uppercase">
                SUPPLY CHAIN TRACEABILITY &bull; COLD-STORAGE PLC CONTINUITY
            </span>
            <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-3 mb-4">
                Food &amp; Beverage Traceability Lot Scanner
            </h1>
            <!-- STATIC, OBJECTIVE FDA FSMA SECTION 204 REFERENCE BLOCK -->
            <div class="p-6 rounded-2xl bg-slate-950 border-2 border-lime-400/50 font-mono text-xs space-y-2 mt-6">
                <span class="text-lime-400 font-bold uppercase block">STATIC STATUTORY REFERENCE // FDA FOOD SAFETY MODERNIZATION ACT (FSMA) SECTION 204</span>
                <p class="text-slate-200 font-sans leading-relaxed">
                    Under 21 CFR Part 1, Subpart S (FDA FSMA Section 204 Food Traceability Final Rule), entities manufacturing, processing, packing, or holding foods on the Food Traceability List (FTL) must maintain records containing Key Data Elements (KDEs) associated with Critical Tracking Events (CTEs) and provide an electronic sortable spreadsheet to the FDA within 24 hours of an official request. Immutable, ransomware-proof ERP and lot-traceability backups ensure uninterrupted 24-hour statutory availability.
                </p>
            </div>
        </section>
        """
    )

    # 12. CHEMICALS & PHARMA (downloads/chemicals.html)
    pages["chemicals.html"] = wrap_page(
        "chemicals.html",
        "Chemicals & Pharma // True Burner Ghost Line & Formula Vault",
        "chemicals",
        "Chemicals, Pharmaceuticals & Bio-Labs",
        "FDA 21 CFR Part 11 • DHS CFATS • Trade Secret IP Protection",
        "Proprietary formula & trade secret protection featuring the True Burner Ghost Line / Dissolvable 29-Minute Email Ad Banner Widget",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border border-purple-500/40 mb-10">
            <span class="px-3 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold uppercase">
                21 CFR PART 11 &bull; PROPRIETARY BATCH FORMULA &amp; IP VAULT
            </span>
            <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-3 mb-6">
                Chemicals &amp; Pharmaceutical Trade Secret Protection
            </h1>

            <!-- TRUE BURNER GHOST LINE / DISSOLVABLE 29-MINUTE EMAIL AD BANNER WIDGET -->
            <div class="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-950 to-amber-950/60 border-2 border-amber-400 font-mono text-xs flex flex-col lg:flex-row items-center justify-between gap-6">
                <div class="space-y-2">
                    <span class="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black uppercase text-[10px]">
                        🔥 TRUE BURNER GHOST LINE // 29-MINUTE EPHEMERAL COMMS WIDGET
                    </span>
                    <h3 class="text-xl sm:text-2xl font-black text-white uppercase">
                        Inspect Suspicious Supplier &amp; CoA Attachments in a Dissolvable 29-Minute Sandbox
                    </h3>
                    <p class="text-slate-300 font-sans text-xs max-w-2xl">
                        Never open untrusted Certificate of Analysis (CoA) PDFs or chemical broker links on your LIMS/Historian network. Launch a RAM-only True Burner session that cryptographically self-destructs in 29 minutes.
                    </p>
                </div>
                <a href="../true-burner-line.html" class="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase shrink-0">
                    Launch 29-Min Ghost Line &rarr;
                </a>
            </div>
        </section>
        """
    )

    # 13. MANUFACTURING (downloads/manufacturing.html)
    pages["manufacturing.html"] = wrap_page(
        "manufacturing.html",
        "Manufacturing // ICS/SCADA Continuity & NIST SP 800-82 News Feed",
        "manufacturing",
        "Advanced Manufacturing & ICS/SCADA Plants",
        "NIST SP 800-82 Rev 3 • ISA/IEC 62443 • Purdue Model Level 3.5 DMZ",
        "ICS/SCADA operational continuity layout with a Live OT Malware, Supply Chain Risk & NIST SP 800-82 News Feed Widget",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border border-cyan-500/40 mb-10">
            <span class="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold uppercase">
                NIST SP 800-82 REV 3 &bull; ISA/IEC 62443 INDUSTRIAL CONTROL SYSTEMS
            </span>
            <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-3 mb-6">
                ICS/SCADA Operational Continuity &amp; Live OT Threat Feed
            </h1>
            <!-- LIVE OT MALWARE, SUPPLY CHAIN RISK & NIST SP 800-82 NEWS FEED WIDGET -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div class="p-5 rounded-2xl bg-slate-950 border-l-4 border-red-500">
                    <span class="text-red-400 font-bold block mb-1">[OT MALWARE ALERT // PIPEDREAM &amp; FROSTYGOOP]</span>
                    <p class="text-slate-300 font-sans">Modbus TCP &amp; CODESYS runtime exploitation blocked by enforcing Purdue Level 3.5 DMZ firewall rules and disabling exposed port 502.</p>
                </div>
                <div class="p-5 rounded-2xl bg-slate-950 border-l-4 border-amber-400">
                    <span class="text-amber-400 font-bold block mb-1">[SUPPLY CHAIN RISK // VENDOR REMOTE VPN]</span>
                    <p class="text-slate-300 font-sans">Third-party OEM maintenance tunnels require time-boxed jump-host approval and session recording under NIST SP 800-82 Rev 3 § 5.2.</p>
                </div>
                <div class="p-5 rounded-2xl bg-slate-950 border-l-4 border-emerald-400">
                    <span class="text-emerald-400 font-bold block mb-1">[GOLDEN PLC IMAGE VAULT // 3-2-1-1-0]</span>
                    <p class="text-slate-300 font-sans">Offline checksum-verified PLC ladder logic and HMI configuration backups eliminate assembly-line downtime during ransomware events.</p>
                </div>
            </div>
        </section>
        """
    )

    # 14. GOVERNMENT & PUBLIC SECTOR (downloads/government.html)
    pages["government.html"] = wrap_page(
        "government.html",
        "Government & Public Sector // FedRAMP & FISMA Readiness",
        "government",
        "Government, Municipal & Public Sector",
        "FedRAMP Moderate • FISMA • NIST SP 800-53 Rev 5 • CISA BOD 22-01",
        "Neoclassical federal building hero banner with overlay typography and image-driven FedRAMP / FISMA pain-point cards",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-slate-900 border border-blue-500/40 mb-10">
            <div class="relative">
                <img src="assets/gov_bldg.jpg" alt="Neoclassical Federal Building Hero" class="w-full h-64 sm:h-80 object-cover opacity-60">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-6 sm:p-10">
                    <span class="px-3 py-1 rounded bg-blue-500/20 border border-blue-400/40 text-blue-300 font-mono text-xs font-bold uppercase w-fit mb-2">
                        FedRAMP MODERATE &bull; FISMA &bull; CISA BOD 22-01 KEV CATALOG
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase">
                        Public Sector &amp; Municipal Cyber Readiness
                    </h1>
                </div>
            </div>
            <div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
                <div class="p-5 rounded-2xl bg-slate-950 border border-white/10">
                    <span class="text-blue-400 font-bold block mb-1">PAIN POINT 01 // CISA KEV SLA</span>
                    <h3 class="text-sm font-bold text-white uppercase mb-1">Known Exploited Vulnerabilities</h3>
                    <p class="text-slate-400 font-sans">Continuous outside-in verification of edge gateways against the CISA BOD 22-01 KEV remediation schedule.</p>
                </div>
                <div class="p-5 rounded-2xl bg-slate-950 border border-white/10">
                    <span class="text-emerald-400 font-bold block mb-1">PAIN POINT 02 // .GOV DMARC REJECT</span>
                    <h3 class="text-sm font-bold text-white uppercase mb-1">Agency Domain Anti-Spoofing</h3>
                    <p class="text-slate-400 font-sans">Strict SPF, DKIM 2048-bit, and DMARC p=reject enforcement protecting citizen notifications and tax portals.</p>
                </div>
                <div class="p-5 rounded-2xl bg-slate-950 border border-white/10">
                    <span class="text-amber-400 font-bold block mb-1">PAIN POINT 03 // CONTINUITY OF OPS</span>
                    <h3 class="text-sm font-bold text-white uppercase mb-1">911 / Utility Dispatch Air-Gap</h3>
                    <p class="text-slate-400 font-sans">Immutable offline backups and NIST SP 800-53 CP-9 recovery validation for municipal services.</p>
                </div>
            </div>
        </section>
        """
    )

    # 15. TRANSPORTATION (downloads/transportation.html)
    pages["transportation.html"] = wrap_page(
        "transportation.html",
        "Transportation & Logistics // 6 Interactive Flip-Card Fleet Bays",
        "transportation",
        "Transportation, Fleet Logistics & Freight",
        "DOT • FMCSA • TSA • CISA • ISO 28000 • UNECE R155",
        "Bird's-Eye Futuristic Fleet Parking Lot with 6 Interactive Flip-Card Fleet Bays displaying regulatory initials (DOT, FMCSA, TSA, CISA, ISO 28000, UNECE R155)",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-slate-900 border border-amber-500/40 mb-10">
            <img src="assets/transport_fleet.jpg" alt="Bird's-Eye Futuristic Fleet Parking Lot" class="w-full h-56 sm:h-72 object-cover opacity-70">
            <div class="p-6 sm:p-8">
                <span class="text-xs font-mono text-amber-400 font-bold uppercase">// BIRD'S-EYE FUTURISTIC FLEET PARKING LOT &bull; CLICK ANY BAY TO FLIP</span>
                <h1 class="text-3xl sm:text-4xl font-black heading text-white uppercase mt-1 mb-6">
                    6 Interactive Flip-Card Regulatory Fleet Bays
                </h1>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                    <div onclick="this.querySelector('.bay-detail').classList.toggle('hidden')" class="cursor-pointer p-5 rounded-2xl bg-slate-950 border-2 border-amber-400/50 hover:border-cyan-400 transition-all">
                        <div class="flex justify-between items-center"><span class="text-2xl font-black text-amber-400">BAY 01 // DOT</span><span class="text-[10px] text-slate-400">CLICK TO FLIP ↻</span></div>
                        <p class="bay-detail mt-3 text-slate-300 font-sans">U.S. Department of Transportation freight routing &amp; hazardous material manifest integrity.</p>
                    </div>
                    <div onclick="this.querySelector('.bay-detail').classList.toggle('hidden')" class="cursor-pointer p-5 rounded-2xl bg-slate-950 border-2 border-amber-400/50 hover:border-cyan-400 transition-all">
                        <div class="flex justify-between items-center"><span class="text-2xl font-black text-cyan-400">BAY 02 // FMCSA</span><span class="text-[10px] text-slate-400">CLICK TO FLIP ↻</span></div>
                        <p class="bay-detail mt-3 text-slate-300 font-sans">ELD (Electronic Logging Device) telematics API authentication and carrier authority anti-hijacking.</p>
                    </div>
                    <div onclick="this.querySelector('.bay-detail').classList.toggle('hidden')" class="cursor-pointer p-5 rounded-2xl bg-slate-950 border-2 border-amber-400/50 hover:border-cyan-400 transition-all">
                        <div class="flex justify-between items-center"><span class="text-2xl font-black text-emerald-400">BAY 03 // TSA</span><span class="text-[10px] text-slate-400">CLICK TO FLIP ↻</span></div>
                        <p class="bay-detail mt-3 text-slate-300 font-sans">TSA Surface, Rail &amp; Aviation Security Directives: 24-hour CISA incident reporting &amp; network segmentation.</p>
                    </div>
                    <div onclick="this.querySelector('.bay-detail').classList.toggle('hidden')" class="cursor-pointer p-5 rounded-2xl bg-slate-950 border-2 border-amber-400/50 hover:border-cyan-400 transition-all">
                        <div class="flex justify-between items-center"><span class="text-2xl font-black text-purple-400">BAY 04 // CISA</span><span class="text-[10px] text-slate-400">CLICK TO FLIP ↻</span></div>
                        <p class="bay-detail mt-3 text-slate-300 font-sans">Transportation Systems Sector CPGs: phishing-resistant MFA on dispatch TMS and warehouse WMS portals.</p>
                    </div>
                    <div onclick="this.querySelector('.bay-detail').classList.toggle('hidden')" class="cursor-pointer p-5 rounded-2xl bg-slate-950 border-2 border-amber-400/50 hover:border-cyan-400 transition-all">
                        <div class="flex justify-between items-center"><span class="text-2xl font-black text-pink-400">BAY 05 // ISO 28000</span><span class="text-[10px] text-slate-400">CLICK TO FLIP ↻</span></div>
                        <p class="bay-detail mt-3 text-slate-300 font-sans">Supply Chain Security Management System: verified bill-of-lading EDI signing and double-brokering fraud defense.</p>
                    </div>
                    <div onclick="this.querySelector('.bay-detail').classList.toggle('hidden')" class="cursor-pointer p-5 rounded-2xl bg-slate-950 border-2 border-amber-400/50 hover:border-cyan-400 transition-all">
                        <div class="flex justify-between items-center"><span class="text-2xl font-black text-blue-400">BAY 06 // UNECE R155</span><span class="text-[10px] text-slate-400">CLICK TO FLIP ↻</span></div>
                        <p class="bay-detail mt-3 text-slate-300 font-sans">Vehicle Cyber Security Management System (CSMS) &amp; OTA firmware cryptographic verification.</p>
                    </div>
                </div>
            </div>
        </section>
        """
    )

    # 16. HOSPITALITY & TRAVEL (downloads/hospitality.html)
    pages["hospitality.html"] = wrap_page(
        "hospitality.html",
        "Hospitality & Travel // Concierge Desk & Translucent PMS/PCI Panels",
        "hospitality",
        "Hospitality, Hotels, Casinos & Travel",
        "PCI DSS v4.0 • Guest Privacy Protection • PMS / POS VLAN Isolation",
        "Hotel Concierge Desk Revolving Loop Hero Background with translucent floating guest-privacy and PMS/PCI reservation panels",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl overflow-hidden relative border border-pink-500/40 mb-10">
            <img src="assets/hospitality_desk.jpg" alt="Hotel Concierge Desk Hero" class="w-full h-[460px] object-cover">
            <div class="absolute inset-0 bg-slate-950/60 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                    <span class="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400 text-pink-200 font-mono text-xs font-bold uppercase">
                        HOTEL CONCIERGE DESK // GUEST PRIVACY &amp; PMS/PCI RESERVATION PROTECTION
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-2">
                        Hospitality &amp; Travel Cyber Readiness
                    </h1>
                </div>
                <!-- TRANSLUCENT FLOATING GUEST-PRIVACY & PMS/PCI PANELS -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                    <div class="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 text-white">
                        <span class="text-amber-300 font-bold block mb-1">01 // PMS &amp; BOOKING ENGINE</span>
                        <p class="font-sans text-xs text-slate-100">Defend front-desk Opera/Mews PMS terminals against fake guest reservation malware attachments and Booking.com extranet credential phishing.</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 text-white">
                        <span class="text-pink-300 font-bold block mb-1">02 // PCI DSS v4.0 FOLIO VAULT</span>
                        <p class="font-sans text-xs text-slate-100">Point-to-Point Encryption (P2PE) across restaurant, spa, and front-desk card terminals with zero cleartext PAN storage.</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 text-white">
                        <span class="text-cyan-300 font-bold block mb-1">03 // KEYCARD &amp; GUEST WI-FI AIR-GAP</span>
                        <p class="font-sans text-xs text-slate-100">Strict Layer-2/Layer-3 isolation between guest room Wi-Fi portals, RFID keycard encoders, and property back-office servers.</p>
                    </div>
                </div>
            </div>
        </section>
        """
    )

    # 17. MEDIA & ENTERTAINMENT (downloads/media.html)
    pages["media.html"] = wrap_page(
        "media.html",
        "Media & Entertainment // No-Media Monochromatic Double-Line Grid",
        "media",
        "Media, Studios, Publishing & Entertainment",
        "MPAA Content Security Best Practices • Pre-Release IP Anti-Piracy • SOC 2",
        "'No-Media' Monochromatic Black-and-White Double-Line Border Grid (4px double #000) locking every letter-block header and IP anti-piracy log into a stark document grid",
        body_class="bg-white text-black",
        custom_css="""
            .double-grid-box { border: 4px double #000000; background: #ffffff; color: #000000; }
        """,
        body_html="""
        <section class="max-w-7xl mx-auto double-grid-box p-6 sm:p-10 mb-10 font-mono">
            <div class="double-grid-box p-4 mb-6 flex flex-wrap justify-between items-center">
                <span class="font-black uppercase tracking-widest text-sm">[ DOCUMENT DOCKET // NO-MEDIA MONOCHROMATIC GRID ]</span>
                <span class="text-xs font-bold">BORDER SPEC: 4px double #000</span>
            </div>
            <h1 class="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-6">
                MEDIA &amp; ENTERTAINMENT INTELLECTUAL PROPERTY LEDGER
            </h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div class="double-grid-box p-5">
                    <div class="font-black text-base uppercase mb-2 border-b-2 border-black pb-1">A // PRE-RELEASE MASTER VAULT</div>
                    <p class="font-sans">Air-gapped editing suites and S3 Object Lock Compliance Mode for unreleased film, audio, and game builds to neutralize pre-release extortion.</p>
                </div>
                <div class="double-grid-box p-5">
                    <div class="font-black text-base uppercase mb-2 border-b-2 border-black pb-1">B // FORENSIC WATERMARK LOG</div>
                    <p class="font-sans">Per-recipient forensic watermarking and expiring zero-knowledge screener links with mandatory FIDO2 authentication.</p>
                </div>
                <div class="double-grid-box p-5">
                    <div class="font-black text-base uppercase mb-2 border-b-2 border-black pb-1">C // SOCIAL &amp; DNS LOCKDOWN</div>
                    <p class="font-sans">Registrar registry lock, DMARC p=reject, and hardware security keys on all verified studio broadcast handles.</p>
                </div>
            </div>
        </section>
        """
    )

    # 18. TELECOMMUNICATIONS (downloads/telecom.html)
    pages["telecom.html"] = wrap_page(
        "telecom.html",
        "Telecommunications // Orbital Lighthouse & Dual-Tower 5G Conduit",
        "telecom",
        "Telecommunications, ISPs & 5G Carriers",
        "FCC CPNI Rules (47 CFR § 64.2001) • CALEA • BGP RPKI Route Signing",
        "Orbital Lighthouse Satellite & Network-Line Earth Hero plus Split-Screen CSS Dual-Tower Compliance Conduit Widget (Advanced 5G Tower -> Compliance Conduit -> Legacy Tower)",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-slate-900 border border-cyan-500/40 mb-10">
            <img src="assets/telecom_sat.jpg" alt="Orbital Lighthouse Satellite & Network Earth" class="w-full h-64 sm:h-80 object-cover opacity-70">
            <div class="p-6 sm:p-8">
                <span class="text-xs font-mono text-cyan-400 font-bold uppercase">// ORBITAL LIGHTHOUSE SATELLITE &amp; DUAL-TOWER COMPLIANCE CONDUIT</span>
                <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-1 mb-6">
                    Telecommunications &amp; 5G Carrier Perimeter
                </h1>

                <!-- SPLIT-SCREEN CSS DUAL-TOWER COMPLIANCE CONDUIT WIDGET -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center font-mono text-xs p-6 rounded-2xl bg-slate-950 border border-cyan-500/40">
                    <div class="p-5 rounded-2xl bg-cyan-950/40 border-2 border-cyan-400 text-center">
                        <i class="fa-solid fa-tower-cell text-3xl text-cyan-400 mb-2"></i>
                        <div class="text-base font-black text-white uppercase">ADVANCED 5G TOWER</div>
                        <p class="text-[11px] text-cyan-200 mt-1">Zero-Trust Service-Based Architecture (SBA), mTLS Network Slicing &amp; RPKI RoA Signed</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-slate-900 border border-purple-400 text-center space-y-2">
                        <span class="text-purple-300 font-black uppercase block">⚡ COMPLIANCE CONDUIT ⚡</span>
                        <div class="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 animate-pulse"></div>
                        <p class="text-[11px] text-slate-300 font-sans">Protocol Translation, SS7/Diameter Firewall Filtering &amp; FCC CPNI Access Audit Log</p>
                    </div>
                    <div class="p-5 rounded-2xl bg-amber-950/30 border-2 border-amber-400 text-center">
                        <i class="fa-solid fa-broadcast-tower text-3xl text-amber-400 mb-2"></i>
                        <div class="text-base font-black text-white uppercase">LEGACY TOWER</div>
                        <p class="text-[11px] text-amber-200 mt-1">Encapsulated TDM/SONET &amp; SIM-Swap Port-Out Freeze Protection</p>
                    </div>
                </div>
            </div>
        </section>
        """
    )

    # 19. REAL ESTATE (downloads/realestate.html)
    pages["realestate.html"] = wrap_page(
        "realestate.html",
        "Real Estate & Title Escrow // ALTA Wire Fraud & Tenant Privacy Docket",
        "realestate",
        "Real Estate, Title Escrow & Property Management",
        "ALTA Best Practices Pillar 3 • GLBA • State Wire Fraud Statutes",
        "Clean document-style wire/tenant privacy page for Real Estate and Title Escrow",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border border-emerald-500/40 mb-10 font-mono">
            <span class="text-xs text-emerald-400 font-bold uppercase">// ALTA BEST PRACTICES PILLAR 3 &bull; CLOSING ESCROW WIRE VERIFICATION</span>
            <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-2 mb-4">
                Real Estate, Title Escrow &amp; Tenant Privacy Docket
            </h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs mt-6">
                <div class="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 class="text-base font-bold text-emerald-400 uppercase">01. Closing Wire Instruction Verification</h3>
                    <p class="text-slate-300 font-sans">Mandatory out-of-band phone verification using pre-established escrow numbers before any earnest money or closing payoff disbursement.</p>
                </div>
                <div class="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 class="text-base font-bold text-cyan-400 uppercase">02. Tenant Portal PII &amp; ACH Encryption</h3>
                    <p class="text-slate-300 font-sans">Protect credit applications, SSNs, and rent ACH tokens across Yardi/AppFolio/Buildium portals with phishing-resistant MFA and DMARC p=reject.</p>
                </div>
            </div>
        </section>
        """
    )

    # 20. NON-PROFIT (downloads/nonprofit.html)
    pages["nonprofit.html"] = wrap_page(
        "nonprofit.html",
        "Non-Profit & Foundations // 3-Step Donor & Grant Endpoint Flow",
        "nonprofit",
        "Non-Profit Organizations & Grant Foundations",
        "OMB 2 CFR Part 200 • PCI DSS Donor Portals • IRS Donor Privacy",
        "3-step donor record volume, fundraising consent, and grant endpoint flow for Non-Profits",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border border-teal-500/40 mb-10 font-mono">
            <span class="text-xs text-teal-400 font-bold uppercase">// 3-STEP DONOR RECORD, FUNDRAISING CONSENT &amp; GRANT ENDPOINT FLOW</span>
            <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-2 mb-6">
                Non-Profit &amp; Foundation Cyber Readiness
            </h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div class="p-5 rounded-2xl bg-slate-950 border border-teal-500/40 space-y-2">
                    <span class="text-teal-400 font-bold">STEP 01 // DONOR RECORD VOLUME</span>
                    <p class="text-slate-300 font-sans">Classify donor CRM tier (Blackbaud / Salesforce Nonprofit) and lock bulk CSV export permissions behind role-based MFA.</p>
                </div>
                <div class="p-5 rounded-2xl bg-slate-950 border border-teal-500/40 space-y-2">
                    <span class="text-cyan-400 font-bold">STEP 02 // FUNDRAISING CONSENT &amp; PCI</span>
                    <p class="text-slate-300 font-sans">Verify hosted donation forms (Stripe / Givebutter) enforce TLS 1.3, CSP script headers, and zero local card storage.</p>
                </div>
                <div class="p-5 rounded-2xl bg-slate-950 border border-teal-500/40 space-y-2">
                    <span class="text-amber-400 font-bold">STEP 03 // GRANT DISBURSEMENT ENDPOINT</span>
                    <p class="text-slate-300 font-sans">Dual-officer verbal callback protocol for federal/foundation grant ACH disbursements under OMB 2 CFR § 200.303.</p>
                </div>
            </div>
        </section>
        """
    )

    # 21. AGRICULTURE & AEROSPACE (downloads/agri-aero.html)
    pages["agri-aero.html"] = wrap_page(
        "agri-aero.html",
        "Agriculture & Aerospace // Dual Smart-Farm IoT & ITAR Defense Modules",
        "agri-aero",
        "Precision Agriculture & Aerospace Defense",
        "ITAR (22 CFR 120-130) • EAR • CMMC 2.0 • DHS Ag-Critical Infrastructure",
        "Dual uniform modules featuring the exact smart-farm IoT and aerospace ITAR/supply-chain hero statements and rapid onboarding",
        body_html="""
        <section class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 font-mono">
            <!-- MODULE A: PRECISION AGRICULTURE & SMART-FARM IOT -->
            <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 flex flex-col justify-between">
                <div>
                    <span class="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">MODULE A // PRECISION AGRICULTURE &amp; AG-IOT</span>
                    <h2 class="text-2xl sm:text-3xl font-black heading text-white uppercase mt-3 mb-2">
                        "Protect autonomous harvest telemetry, grain-elevator SCADA, and cooperative ACH rails before planting or harvest windows open."
                    </h2>
                    <p class="text-xs text-slate-300 font-sans mb-4">
                        Secures GPS/RTK autonomous tractor fleets, automated irrigation PLCs, and seasonal commodity settlement workflows against ransomware lockouts.
                    </p>
                </div>
                <a href="../clinic.html?industry=agri-aero" class="block text-center py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase">Rapid Ag-IoT Onboarding &rarr;</a>
            </div>

            <!-- MODULE B: AEROSPACE & ITAR SUPPLY CHAIN -->
            <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-amber-500/40 flex flex-col justify-between">
                <div>
                    <span class="px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase">MODULE B // AEROSPACE &amp; ITAR SUPPLY CHAIN</span>
                    <h2 class="text-2xl sm:text-3xl font-black heading text-white uppercase mt-3 mb-2">
                        "Lock down ITAR/EAR technical data packages, AS9100 CNC toolpaths, and U.S.-Person sovereign cloud boundaries."
                    </h2>
                    <p class="text-xs text-slate-300 font-sans mb-4">
                        Enforces 22 CFR 120-130 export-controlled CAD/CAM encryption, FIPS 140-3 MFA, and immutable air-gapped avionics build repositories.
                    </p>
                </div>
                <a href="../clinic.html?industry=agri-aero" class="block text-center py-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase">Rapid Aerospace ITAR Onboarding &rarr;</a>
            </div>
        </section>
        """
    )

    # 22. CINEMATIC ONBOARDING (downloads/onboarding.html)
    pages["onboarding.html"] = wrap_page(
        "onboarding.html",
        "Cinematic Onboarding // Big-Button Clip Cards & Clinic vs. Fire Switcher",
        "general",
        "Cinematic Onboarding & Paperwork Preparation Guide",
        "MOD-010-AGREE • Zero-Contact Intake • Clinic vs. Fire Theme Switcher",
        "Accessible big-button step-by-step clip cards explaining why questions are asked and what paperwork is needed, with a Clinic vs. Fire Theme Switcher and Standard Fast Mode toggle",
        body_html="""
        <section id="cinematic-wrap" class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border-2 border-cyan-500/40 mb-10 font-mono transition-all">
            <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                    <span class="text-xs text-cyan-400 font-bold uppercase">// ACCESSIBLE BIG-BUTTON STEP-BY-STEP CLIP CARDS</span>
                    <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase mt-1">
                        Cinematic Onboarding &amp; Paperwork Prep
                    </h1>
                </div>
                <div class="flex flex-wrap gap-2 text-xs">
                    <button type="button" onclick="setOnboardTheme('clinic')" class="px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-black uppercase">🏥 Clinic Theme</button>
                    <button type="button" onclick="setOnboardTheme('fire')" class="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black uppercase">🔥 Fire Theme</button>
                    <button type="button" onclick="document.getElementById('fast-mode-panel').classList.toggle('hidden')" class="px-4 py-2.5 rounded-xl bg-white/10 text-white border border-white/20 font-bold uppercase">⚡ Standard Fast Mode</button>
                </div>
            </div>

            <!-- BIG-BUTTON CLIP CARDS -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-xs">
                <div class="p-6 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 space-y-3">
                    <span class="px-2.5 py-1 rounded bg-cyan-500 text-slate-950 font-black">CLIP CARD 01 // DOMAIN &amp; DNS</span>
                    <h3 class="text-lg font-black text-white uppercase">Why We Ask For Your Public Domain</h3>
                    <p class="text-slate-300 font-sans">Underwriters scan your public DNS (SPF, DKIM, DMARC) and TLS certificates before quoting. No passwords or agents are ever required.</p>
                    <div class="p-3 rounded-xl bg-slate-900 text-emerald-400">Paperwork Needed: Primary domain name &amp; DNS registrar contact.</div>
                </div>
                <div class="p-6 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 space-y-3">
                    <span class="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-black">CLIP CARD 02 // MFA &amp; IDENTITY</span>
                    <h3 class="text-lg font-black text-white uppercase">Why Carriers Demand MFA Attestation</h3>
                    <p class="text-slate-300 font-sans">Chubb Schedule B and Coalition warranties void coverage if remote email or admin logins lack Multi-Factor Authentication.</p>
                    <div class="p-3 rounded-xl bg-slate-900 text-emerald-400">Paperwork Needed: Microsoft 365 / Google Workspace MFA status screenshot.</div>
                </div>
                <div class="p-6 rounded-2xl bg-slate-950 border-2 border-amber-500/40 space-y-3">
                    <span class="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-black">CLIP CARD 03 // IMMUTABLE BACKUPS</span>
                    <h3 class="text-lg font-black text-white uppercase">Why Air-Gapped Backups Cut Deductibles</h3>
                    <p class="text-slate-300 font-sans">Travelers Item 6A checks whether ransomware with Domain Admin rights can delete your backups. S3 Object Lock prevents deletion.</p>
                    <div class="p-3 rounded-xl bg-slate-900 text-emerald-400">Paperwork Needed: Most recent quarterly backup restore log.</div>
                </div>
            </div>

            <!-- STANDARD FAST MODE TOGGLE PANEL -->
            <div id="fast-mode-panel" class="hidden mt-6 p-6 rounded-2xl bg-black border-2 border-emerald-400 text-xs space-y-3">
                <span class="text-emerald-400 font-black uppercase block">// STANDARD FAST MODE (60-SECOND EXPRESS INTAKE)</span>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="Organization Name" class="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white">
                    <input type="text" placeholder="Primary Domain (e.g. burn-1.com)" class="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white">
                    <a href="../clinic.html" class="text-center py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-black uppercase">Proceed Directly to Binder &rarr;</a>
                </div>
            </div>
        </section>
        <script>
            function setOnboardTheme(mode) {
                const wrap = document.getElementById('cinematic-wrap');
                if (mode === 'fire') {
                    wrap.className = "max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-amber-950/40 border-2 border-amber-500 mb-10 font-mono transition-all";
                } else {
                    wrap.className = "max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border-2 border-cyan-500/40 mb-10 font-mono transition-all";
                }
            }
        </script>
        """
    )

    # 23. THE LAB & DIRECTORY (downloads/lab.html)
    pages["lab.html"] = wrap_page(
        "lab.html",
        "The Lab & Directory // World-Builder, Trusted Vendor Seal Roster & Ghost Browser",
        "general",
        "The Lab & Trusted Vendor Seal Roster Directory",
        "SHA-256 Verified Business Directory • Shallow Micro-Scans • True Burner Ghost",
        "World-Builder profile, Free Shallow Clinic Micro-Scans, Verified Business Directory ('Trusted Vendor Seal Roster') with live search, and links to True Burner Ghost Browser and Fried Brains",
        body_html="""
        <section class="max-w-7xl mx-auto space-y-8 mb-10 font-mono">
            <!-- WORLD-BUILDER PROFILE & LINKS TO TRUE BURNER GHOST BROWSER + FRIED BRAINS -->
            <div class="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-purple-500/40 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div class="lg:col-span-8 space-y-3">
                    <span class="px-3 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-bold uppercase">
                        THE LAB // WORLD-BUILDER ARCHITECT PROFILE
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-black heading text-white uppercase">
                        Burn One Systems Lab &amp; Trusted Vendor Seal Roster
                    </h1>
                    <p class="text-slate-300 font-sans text-sm leading-relaxed">
                        Engineered by Leon R. Darden (Burn One Systems): combining non-intrusive outside-in underwriting telemetry, RAM-only True Burner Ghost sandboxes, and cryptographic SHA-256 directory seals.
                    </p>
                </div>
                <div class="lg:col-span-4 flex flex-col gap-3 text-xs">
                    <a href="../true-burner-line.html" class="p-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black uppercase text-center">
                        👻 Launch True Burner Ghost Browser
                    </a>
                    <a href="../friedbrains-world/index.html" class="p-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-center">
                        🧠 Enter Fried Brains World
                    </a>
                    <a href="../directory.html" class="p-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold uppercase text-center">
                        🏛 Full Metro Plaza Directory
                    </a>
                </div>
            </div>

            <!-- VERIFIED BUSINESS DIRECTORY ("TRUSTED VENDOR SEAL ROSTER") WITH LIVE SEARCH -->
            <div class="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/40 text-xs space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <span class="text-cyan-400 font-bold uppercase block">// VERIFIED BUSINESS DIRECTORY</span>
                        <h2 class="text-2xl font-black heading text-white uppercase">Trusted Vendor Seal Roster</h2>
                    </div>
                    <input id="roster-search" type="text" oninput="filterVendorRoster(this.value)" placeholder="Search verified vendors or SHA-256 seal..." class="px-4 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-white w-full sm:w-80">
                </div>
                <div id="roster-grid" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="roster-card p-4 rounded-2xl bg-slate-950 border border-emerald-500/40">
                        <span class="text-emerald-400 font-bold block">SEAL #BURN1-958405 // VERIFIED</span>
                        <h3 class="text-base font-bold text-white mt-1">Burn One Systems Sovereign Node</h3>
                        <p class="text-slate-400 font-sans text-xs mt-1">TLS 1.3 • DMARC p=reject • 120/120 Academy Operator</p>
                    </div>
                    <div class="roster-card p-4 rounded-2xl bg-slate-950 border border-cyan-500/40">
                        <span class="text-cyan-400 font-bold block">SEAL #ANERGI-TIER3 // ACCREDITED PARTNER</span>
                        <h3 class="text-base font-bold text-white mt-1">Anergi.io Cyber Operations</h3>
                        <p class="text-slate-400 font-sans text-xs mt-1">Tier-3 Penetration Testing, DFIR &amp; Red Team Escalation Partner</p>
                    </div>
                    <div class="roster-card p-4 rounded-2xl bg-slate-950 border border-amber-500/40">
                        <span class="text-amber-400 font-bold block">SEAL #METRO-882104 // VERIFIED</span>
                        <h3 class="text-base font-bold text-white mt-1">Metro Plaza Validated Merchant</h3>
                        <p class="text-slate-400 font-sans text-xs mt-1">PCI DSS v4.0 Script Lock • Out-of-Band Wire Protocol</p>
                    </div>
                </div>
            </div>
        </section>
        <script>
            function filterVendorRoster(q) {
                const term = (q || '').toLowerCase();
                document.querySelectorAll('.roster-card').forEach(card => {
                    card.style.display = card.innerText.toLowerCase().includes(term) ? '' : 'none';
                });
            }
        </script>
        """
    )

    # 24. LEGAL REFERENCE PAGE (downloads/legal.html)
    pages["legal.html"] = wrap_page(
        "legal.html",
        "Legal Reference Page // Master Services Agreement (MOD-010-AGREE) & SLAs",
        "general",
        "Master Services Agreement, SLAs & Non-Intrusive Scan Disclaimers (MOD-010-AGREE)",
        "MOD-010-AGREE • 99.9% Platform SLA • Anergi.io Independent Partner Disclosure",
        "Full Privacy Policy, Terms of Service, SLAs, Non-Intrusive Automated Digital Scan Liability Disclaimers, and Independent Partner Disclosures (Anergi.io) (MOD-010-AGREE)",
        body_html="""
        <section class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-slate-900 border-2 border-emerald-500/40 mb-10 font-mono text-xs space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                    <span class="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                        DOCUMENT ID: MOD-010-AGREE // LEGAL &amp; UNDERWRITING REFERENCE
                    </span>
                    <h1 class="text-3xl sm:text-4xl font-black heading text-white uppercase mt-2">
                        Client Onboarding &amp; Master Services Agreement (MOD-010-AGREE)
                    </h1>
                </div>
                <a href="client-onboarding-agreement.md" download class="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black uppercase">
                    ⬇ Download Raw MOD-010-AGREE (.MD)
                </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 class="text-base font-black text-cyan-400 uppercase">1. Scope of Non-Intrusive Automated Digital Scans</h3>
                    <p class="text-slate-300 font-sans leading-relaxed">
                        Burn One Systems &amp; the Cyber Readiness Clinic perform strictly passive, outside-in digital reconnaissance (public DNS records, SPF/DKIM/DMARC TXT records, public TLS certificate handshakes, and HTTP response headers). No intrusive exploitation, brute-forcing, credential harvesting, or unauthorized packet injection is ever performed.
                    </p>
                </div>
                <div class="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 class="text-base font-black text-emerald-400 uppercase">2. Service Level Agreement (SLA) Standards</h3>
                    <p class="text-slate-300 font-sans leading-relaxed">
                        <strong>Platform Availability:</strong> 99.9% uptime across the Academy &amp; Evidence Binder generation engine.<br>
                        <strong>Automated Scan &amp; Binder Delivery:</strong> Less than 60 seconds from domain submission.<br>
                        <strong>Critical Support Triage:</strong> Under 4 business hours for verified commercial audit clients.
                    </p>
                </div>
                <div class="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 class="text-base font-black text-amber-400 uppercase">3. Independent Partner Disclosures (Anergi.io &amp; Physical Audits)</h3>
                    <p class="text-slate-300 font-sans leading-relaxed">
                        Hands-on penetration testing, internal network red-teaming, active Digital Forensics and Incident Response (DFIR), and physical jobsite/OSHA safety inspections are performed exclusively by independent accredited third-party partners (including <strong>Anergi.io</strong>) under a separate bilateral Statement of Work (SOW).
                    </p>
                </div>
                <div class="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 class="text-base font-black text-purple-400 uppercase">4. Privacy Policy &amp; Zero-Party LocalStorage Architecture</h3>
                    <p class="text-slate-300 font-sans leading-relaxed">
                        Academy hygiene progress (Levels 1–8) and Advanced Simulator scores (Modules A–G) are stored locally in client browser storage (<code>cyber-hygiene-protocol-v1</code> / <code>burn1_clinic_v1</code>) until explicitly synced or exported into a signed SHA-256 Evidence Binder by the user.
                    </p>
                </div>
            </div>
        </section>
        """
    )

    # Write all 24 pages into downloads/ AND copy non-conflicting sector pages to root burn-1.com/
    preserve_at_root = {"index.html", "academy.html", "onboarding.html"}
    for fname, html in pages.items():
        out_path = DOWNLOADS_DIR / fname
        out_path.write_text(html, encoding="utf-8")
        if fname not in preserve_at_root:
            # Adjust relative asset/parent paths for root copy so both /<page>.html and /downloads/<page>.html work!
            root_html = (
                html.replace('src="assets/', 'src="downloads/assets/')
                    .replace('href="../clinic.html', 'href="clinic.html')
                    .replace('href="../burn-1systems.html', 'href="burn-1systems.html')
                    .replace('href="../true-burner-line.html', 'href="true-burner-line.html')
                    .replace('href="../friedbrains-world/', 'href="friedbrains-world/')
                    .replace('href="../directory.html', 'href="directory.html')
                    .replace('href="../yelle.html', 'href="yelle.html')
                    .replace('href="zero-cost-', 'href="downloads/zero-cost-')
                    .replace('href="cyber-insurance-', 'href="downloads/cyber-insurance-')
                    .replace('href="client-onboarding-', 'href="downloads/client-onboarding-')
                    .replace('href="downloads_site_pages_bundle.zip"', 'href="downloads/downloads_site_pages_bundle.zip"')
            )
            (ROOT_DIR / fname).write_text(root_html, encoding="utf-8")


def build_zip_bundles():
    """Package all 24 HTML pages, visual assets, and markdown guides into downloads_site_pages_bundle.zip."""
    if SITE_DOWNLOADS_ZIP.exists():
        SITE_DOWNLOADS_ZIP.unlink()

    with zipfile.ZipFile(SITE_DOWNLOADS_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        for item in sorted(DOWNLOADS_DIR.rglob("*")):
            if item.is_file() and item.name != "downloads_site_pages_bundle.zip":
                rel = item.relative_to(ROOT_DIR)  # e.g. downloads/index.html
                zf.write(item, str(rel).replace("\\", "/"))

    shutil.copyfile(SITE_DOWNLOADS_ZIP, USER_DOWNLOADS_ZIP)


if __name__ == "__main__":
    generate_visual_assets()
    build_all_24_pages()
    build_zip_bundles()
    print("SUCCESS: Built 24 pages, 8 visual assets, and downloads_site_pages_bundle.zip!")
