# =========================================================================
# BURN-1 SYSTEMS // GUMROAD CLI PRODUCT DISPATCH SCRIPT
# =========================================================================

$cliPath = "C:\Users\Leonr\.local\bin\gumroad.exe"
$coverPath = "C:\Users\Leonr\Downloads\files (1)\gumroad-cover-1280x720.png"
$thumbPath = "C:\Users\Leonr\Downloads\files (1)\gumroad-thumbnail-600x600.png"
$zipPath = "C:\Users\Leonr\projects\burn-1.com\zero_party_data_kit.zip"

$desc = "<p><strong>Zero-Party Data Collection Kit ($50 Flat Fee)</strong></p><p>Deploy a 100% self-contained, offline-ready mobile kiosk form on your iPad, Android tablet, or counter screen. Collect customer names, emails, and preferences directly without third-party cloud data trackers or monthly SaaS fees.</p><p><strong>What's inside:</strong></p><ul><li><strong>index.html</strong> — Standalone touch-optimized mobile kiosk form with 5-second auto-reset timer.</li><li><strong>style.css</strong> — 30-second branding control panel for your company hex colors.</li><li><strong>webhook-engine.js</strong> — Commented JS script to route data directly to Zapier, Make.com, or n8n.</li><li><strong>test-connection.html</strong> — Built-in webhook diagnostic test — tap one button to confirm your connection is live before you put the tablet on the counter. Red banner = check line 8. Green banner = you're done. No more guessing whether it's set up right.</li><li><strong>01_READ_ME_DEPLOYMENT.pdf</strong> — Step-by-step visual deployment manual.</li></ul><p><strong>The Burn Challenge — Round 5 (Confirm the Burn in 30 sec):</strong></p><p>Tap [RUN WEBHOOK DIAGNOSTIC TEST]. Green banner means it's live. Red banner means recheck line 8. Either way, you know before your customer ever sees the screen.</p>"

if (-not (Env:GUMROAD_ACCESS_TOKEN)) {
    Write-Host "NOTE: If not logged in, pipe your token or set `$env:GUMROAD_ACCESS_TOKEN` before running." -ForegroundColor Yellow
}

& $cliPath products create `
  --name "Zero-Party Data Collection Kit" `
  --price "50" `
  --description $desc `
  --cover-image $coverPath `
  --thumbnail $thumbPath `
  --file $zipPath `
  --file-name "zero_party_data_kit.zip"
