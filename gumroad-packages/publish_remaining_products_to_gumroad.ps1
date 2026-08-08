# =========================================================================
# BURN-1 SYSTEMS // MASTER GUMROAD DISPATCH FOR REMAINING 5 PRODUCTS
# =========================================================================

$cliPath = "C:\Users\Leonr\.local\bin\gumroad.exe"
$pkgDir = "C:\Users\Leonr\projects\burn-1.com\gumroad-packages"

Write-Host "[+] Initializing Gumroad Dispatch for 5 Remaining Products..." -ForegroundColor Cyan

# 1. TOR PRIVACY VAULT (SYS: TOR-10)
Write-Host "[1/5] Dispatching Tor Privacy Vault & OpSec Guidebook..." -ForegroundColor Yellow
& $cliPath products create `
  --name "Tor Privacy Vault & OpSec Guidebook" `
  --price "50" `
  --description "<p><strong>Tor Privacy Vault ($50 Flat Fee)</strong></p><p>Air-gapped zero-cloud security toolkit, 127.0.0.1 network binder, and emergency 3-second RAM purge killswitch.</p>" `
  --file "$pkgDir\tor_privacy_vault_kit.zip" `
  --file-name "tor_privacy_vault_kit.zip"

# 2. QR VECTOR ASSET PACK (SYS: VECTOR-03)
Write-Host "[2/5] Dispatching QR Vector Asset Pack..." -ForegroundColor Yellow
& $cliPath products create `
  --name "QR Vector Asset Pack" `
  --price "50" `
  --description "<p><strong>QR Vector Asset Pack ($50 Flat Fee)</strong></p><p>15+ scalable SVG vector frames and banners with built-in quiet zone margins.</p>" `
  --file "$pkgDir\qr_vector_asset_pack.zip" `
  --file-name "qr_vector_asset_pack.zip"

# 3. SCORM LMS COURSE SHELLS (SYS: LMS-06)
Write-Host "[3/5] Dispatching SCORM LMS Course Shells..." -ForegroundColor Yellow
& $cliPath products create `
  --name "SCORM LMS Course Shells" `
  --price "50" `
  --description "<p><strong>SCORM LMS Course Shells ($50 Flat Fee)</strong></p><p>Pre-structured SCORM 1.2 & 2004 templates ready for Canvas, Moodle, and Blackboard.</p>" `
  --file "$pkgDir\scorm_lms_course_shells.zip" `
  --file-name "scorm_lms_course_shells.zip"

# 4. AUTOMATED CHATBOT FLOW MAPS (SYS: BOT-08)
Write-Host "[4/5] Dispatching Automated Chatbot Flow Maps..." -ForegroundColor Yellow
& $cliPath products create `
  --name "Automated Chatbot Flow Maps" `
  --price "50" `
  --description "<p><strong>Automated Chatbot Flow Maps ($50 Flat Fee)</strong></p><p>Decision-tree logic maps, prompt matrices, and lead qualification node diagrams.</p>" `
  --file "$pkgDir\automated_chatbot_flow_maps.zip" `
  --file-name "automated_chatbot_flow_maps.zip"

# 5. EXECUTIVE DIGITAL ETIQUETTE PLAYBOOK (SYS: PLAYBOOK-09)
Write-Host "[5/5] Dispatching Executive Digital Etiquette Playbook..." -ForegroundColor Yellow
& $cliPath products create `
  --name "Executive Digital Etiquette Playbook" `
  --price "50" `
  --description "<p><strong>Executive Digital Etiquette Playbook ($50 Flat Fee)</strong></p><p>48-page protocol guide covering remote team communications and data hygiene.</p>" `
  --file "$pkgDir\executive_digital_etiquette_playbook.zip" `
  --file-name "executive_digital_etiquette_playbook.zip"

Write-Host "[SUCCESS] All 5 products dispatched successfully!" -ForegroundColor Green
