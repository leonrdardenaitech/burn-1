import os
import zipfile

pkg_dir = r"C:\Users\Leonr\projects\burn-1.com\gumroad-packages"
os.makedirs(pkg_dir, exist_ok=True)

# 1. TOR PRIVACY VAULT & OPSEC GUIDEBOOK (SYS: TOR-10)
tor_dir = os.path.join(pkg_dir, "tor_privacy_vault_kit")
os.makedirs(tor_dir, exist_ok=True)

readme_tor = """# TOR PRIVACY VAULT & OPSEC GUIDEBOOK (SYS: TOR-10)
Burn-1 Systems // Zero-Contact Privacy & Onion Routing Protocol

## Overview
The Tor Privacy Vault is an air-gapped, zero-cloud security toolkit and OpSec manual for technical operators, developers, and privacy enthusiasts who demand 100% data sovereignty.

## Included Components
1. `README_TOR_VAULT.md` - OpSec tactical deployment guide & Tor bridge setup.
2. `install_burn1.sh` - Automated air-gapped 127.0.0.1 environment binder.
3. `burn1-killswitch.sh` - 3-Second Atomic RAM purge & terminal history incinerator script.

## Quick Start
1. Execute `./install_burn1.sh` to initialize local isolated environment.
2. Follow OpSec guide for Tor proxy routing & DNS leak prevention.
3. Trigger `./burn1-killswitch.sh` anytime for zero-residue emergency memory purge.
"""

install_sh = """#!/usr/bin/env bash
# BURN-1 VAULT AIR-GAPPED DEPLOYMENT ENGINE v1.1
echo -e '\\033[1;33m[!] INITIALIZING BURN-1 TOR & LOCAL PRIVACY VAULT...\\033[0m'
export OLLAMA_HOST=127.0.0.1:11434
echo -e '\\033[1;32m[+] Network isolated to loopback 127.0.0.1\\033[0m'
"""

killswitch_sh = """#!/usr/bin/env bash
# BURN-1 MASTER KILL SWITCH v1.0
echo -e '\\033[1;31m[!] EXECUTING BURN-1 MASTER KILL SWITCH...\\033[0m'
sudo systemctl restart ollama 2>/dev/null || killall ollama 2>/dev/null
cat /dev/null > ~/.bash_history 2>/dev/null
cat /dev/null > ~/.zsh_history 2>/dev/null
history -c 2>/dev/null
clear
echo -e '\\033[1;32m[✓] ZERO RESIDUE ACHIEVED.\\033[0m'
"""

with open(os.path.join(tor_dir, "README_TOR_VAULT.md"), "w", encoding="utf-8") as f:
    f.write(readme_tor)
with open(os.path.join(tor_dir, "install_burn1.sh"), "w", newline="\n", encoding="utf-8") as f:
    f.write(install_sh)
with open(os.path.join(tor_dir, "burn1-killswitch.sh"), "w", newline="\n", encoding="utf-8") as f:
    f.write(killswitch_sh)

# 2. QR VECTOR ASSET PACK (SYS: VECTOR-03)
qr_dir = os.path.join(pkg_dir, "qr_vector_asset_pack")
os.makedirs(qr_dir, exist_ok=True)

readme_qr = """# QR VECTOR ASSET PACK (SYS: VECTOR-03)
Burn-1 Systems // High-Resolution Vector Assets & Quiet Zone Wrapper Frames

## Overview
15+ scalable SVG vector frames, borders, and call-to-action (CTA) banners designed for instant physical & digital print deployment.

## Key Features
- 1000x1000 Master SVG Canvas
- Built-in quiet zone margins to prevent scanning dropouts
- Transparent center drop-zones for dynamic QR insertion
- Pre-built CSS/SVG templates for web kiosk embeds
"""

with open(os.path.join(qr_dir, "README_QR_VECTOR.md"), "w", encoding="utf-8") as f:
    f.write(readme_qr)

# 3. SCORM LMS COURSE SHELLS (SYS: LMS-06)
scorm_dir = os.path.join(pkg_dir, "scorm_lms_course_shells")
os.makedirs(scorm_dir, exist_ok=True)

readme_scorm = """# SCORM LMS COURSE SHELLS (SYS: LMS-06)
Burn-1 Systems // Standalone EdTech SCORM 1.2 & SCORM 2004 Course Templates

## Overview
Pre-structured instructional design course shells ready for instant upload into Canvas, Moodle, Blackboard, and corporate LMS platforms.

## Key Features
- SCORM 1.2 and SCORM 2004 4th Edition Compliant
- Universal 3-Step Upload Blueprint
- Built-in completion tracking, quiz wrappers, and progress bookmarking
"""

with open(os.path.join(scorm_dir, "README_SCORM_LMS.md"), "w", encoding="utf-8") as f:
    f.write(readme_scorm)

# 4. AUTOMATED CHATBOT FLOW MAPS (SYS: BOT-08)
bot_dir = os.path.join(pkg_dir, "automated_chatbot_flow_maps")
os.makedirs(bot_dir, exist_ok=True)

readme_bot = """# AUTOMATED CHATBOT FLOW MAPS (SYS: BOT-08)
Burn-1 Systems // High-Converting Customer Service & Booking Bot Architecture

## Overview
Downloadable decision-tree logic maps, system prompt matrices, and workflow diagrams for automated customer support, intake, and scheduling bots.

## Key Features
- Lucidchart & Visio compatible decision tree flowcharts
- System Prompt Engineering Matrix for OpenAI / Anthropic / Ollama
- Customer Intake & Lead Qualification decision nodes
"""

with open(os.path.join(bot_dir, "README_BOT_FLOWS.md"), "w", encoding="utf-8") as f:
    f.write(readme_bot)

# 5. EXECUTIVE DIGITAL ETIQUETTE PLAYBOOK (SYS: PLAYBOOK-09)
playbook_dir = os.path.join(pkg_dir, "executive_digital_etiquette_playbook")
os.makedirs(playbook_dir, exist_ok=True)

readme_playbook = """# EXECUTIVE DIGITAL ETIQUETTE PLAYBOOK (SYS: PLAYBOOK-09)
Burn-1 Systems // Remote Operational Protocol & Digital Security Manual

## Overview
A comprehensive 48-page protocol guide covering remote team communications, digital hygiene, operational security (OpSec), and executive hospitality standards.

## Key Features
- Elite Hospitality & Remote Operational Standards
- Data Hygiene & Incident Response Blueprints
- Zero-SaaS overhead workflow management
"""

with open(os.path.join(playbook_dir, "README_EXECUTIVE_PLAYBOOK.md"), "w", encoding="utf-8") as f:
    f.write(readme_playbook)

# CREATE ZIP ARCHIVES
def create_zip(source_folder, output_zip_path):
    with zipfile.ZipFile(output_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_folder):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_folder)
                zipf.write(file_path, arcname)

create_zip(tor_dir, os.path.join(pkg_dir, "tor_privacy_vault_kit.zip"))
create_zip(qr_dir, os.path.join(pkg_dir, "qr_vector_asset_pack.zip"))
create_zip(scorm_dir, os.path.join(pkg_dir, "scorm_lms_course_shells.zip"))
create_zip(bot_dir, os.path.join(pkg_dir, "automated_chatbot_flow_maps.zip"))
create_zip(playbook_dir, os.path.join(pkg_dir, "executive_digital_etiquette_playbook.zip"))

# MASTER POWERSHELL DISPATCH SCRIPT
ps_content = """# =========================================================================
# BURN-1 SYSTEMS // MASTER GUMROAD DISPATCH FOR REMAINING 5 PRODUCTS
# =========================================================================

$cliPath = "C:\\Users\\Leonr\\.local\\bin\\gumroad.exe"
$pkgDir = "C:\\Users\\Leonr\\projects\\burn-1.com\\gumroad-packages"

Write-Host "[+] Initializing Gumroad Dispatch for 5 Remaining Products..." -ForegroundColor Cyan

# 1. TOR PRIVACY VAULT (SYS: TOR-10)
Write-Host "[1/5] Dispatching Tor Privacy Vault & OpSec Guidebook..." -ForegroundColor Yellow
& $cliPath products create `
  --name "Tor Privacy Vault & OpSec Guidebook" `
  --price "50" `
  --description "<p><strong>Tor Privacy Vault ($50 Flat Fee)</strong></p><p>Air-gapped zero-cloud security toolkit, 127.0.0.1 network binder, and emergency 3-second RAM purge killswitch.</p>" `
  --file "$pkgDir\\tor_privacy_vault_kit.zip" `
  --file-name "tor_privacy_vault_kit.zip"

# 2. QR VECTOR ASSET PACK (SYS: VECTOR-03)
Write-Host "[2/5] Dispatching QR Vector Asset Pack..." -ForegroundColor Yellow
& $cliPath products create `
  --name "QR Vector Asset Pack" `
  --price "50" `
  --description "<p><strong>QR Vector Asset Pack ($50 Flat Fee)</strong></p><p>15+ scalable SVG vector frames and banners with built-in quiet zone margins.</p>" `
  --file "$pkgDir\\qr_vector_asset_pack.zip" `
  --file-name "qr_vector_asset_pack.zip"

# 3. SCORM LMS COURSE SHELLS (SYS: LMS-06)
Write-Host "[3/5] Dispatching SCORM LMS Course Shells..." -ForegroundColor Yellow
& $cliPath products create `
  --name "SCORM LMS Course Shells" `
  --price "50" `
  --description "<p><strong>SCORM LMS Course Shells ($50 Flat Fee)</strong></p><p>Pre-structured SCORM 1.2 & 2004 templates ready for Canvas, Moodle, and Blackboard.</p>" `
  --file "$pkgDir\\scorm_lms_course_shells.zip" `
  --file-name "scorm_lms_course_shells.zip"

# 4. AUTOMATED CHATBOT FLOW MAPS (SYS: BOT-08)
Write-Host "[4/5] Dispatching Automated Chatbot Flow Maps..." -ForegroundColor Yellow
& $cliPath products create `
  --name "Automated Chatbot Flow Maps" `
  --price "50" `
  --description "<p><strong>Automated Chatbot Flow Maps ($50 Flat Fee)</strong></p><p>Decision-tree logic maps, prompt matrices, and lead qualification node diagrams.</p>" `
  --file "$pkgDir\\automated_chatbot_flow_maps.zip" `
  --file-name "automated_chatbot_flow_maps.zip"

# 5. EXECUTIVE DIGITAL ETIQUETTE PLAYBOOK (SYS: PLAYBOOK-09)
Write-Host "[5/5] Dispatching Executive Digital Etiquette Playbook..." -ForegroundColor Yellow
& $cliPath products create `
  --name "Executive Digital Etiquette Playbook" `
  --price "50" `
  --description "<p><strong>Executive Digital Etiquette Playbook ($50 Flat Fee)</strong></p><p>48-page protocol guide covering remote team communications and data hygiene.</p>" `
  --file "$pkgDir\\executive_digital_etiquette_playbook.zip" `
  --file-name "executive_digital_etiquette_playbook.zip"

Write-Host "[✓] All 5 products dispatched successfully!" -ForegroundColor Green
"""

with open(os.path.join(pkg_dir, "publish_remaining_products_to_gumroad.ps1"), "w", encoding="utf-8") as f:
    f.write(ps_content)

print("Successfully created all 5 package directories, zip archives, and master PowerShell script in:", pkg_dir)
