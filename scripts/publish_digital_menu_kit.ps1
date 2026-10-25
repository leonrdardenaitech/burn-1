# =========================================================================
# BURN-1 SYSTEMS // PRODUCT 3: DIGITAL MENU KIT GUMROAD DISPATCH
# =========================================================================

$kitDir = "C:\Users\Leonr\projects\digital-menu-kit"
if (Test-Path $kitDir) { Remove-Item $kitDir -Recurse -Force }
New-Item -ItemType Directory -Path "$kitDir\css", "$kitDir\js" -Force

Copy-Item "C:\Users\Leonr\projects\burn-1.com\digital_menu_kit.html" "$kitDir\index.html"

@'
:root {
    --primary-color: #0f172a;
    --accent-color: #0284c7;
    --bg-color: #f8fafc;
}
body { background-color: var(--bg-color); font-family: sans-serif; }
'@ | Out-File -FilePath "$kitDir\css\style.css" -Encoding utf8

@'
========================================================================
BURN-1 SYSTEMS // DIGITAL MENU KIT DEPLOYMENT GUIDE
========================================================================
STEP 1: Open index.html in any text editor and swap out dish names and prices.
STEP 2: Drag the folder onto Netlify, GitHub Pages, or Firebase Hosting.
STEP 3: Point your QR code to your URL and print once!
'@ | Out-File -FilePath "$kitDir\01_READ_ME_MENU_KIT.txt" -Encoding utf8

$zipPath = "C:\Users\Leonr\projects\burn-1.com\digital_menu_kit.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$kitDir\*" -DestinationPath $zipPath -Force

$cliPath = "C:\Users\Leonr\.local\bin\gumroad.exe"
$coverPath = "C:\Users\Leonr\Downloads\files (2)\menu-kit-gumroad-cover-1280x720.png"
$thumbPath = "C:\Users\Leonr\Downloads\files (2)\menu-kit-gumroad-thumbnail-600x600.png"

$desc = @'
<p><strong>Digital Menu Kit - Burn-1 ($50 Flat Fee)</strong></p><p>You already have a URL. What you do not have is an easy way to change what is on it. This kit fixes that - edit a text file, push it, your menu is updated everywhere in under 2 minutes. No reprinting, no app dashboard, no monthly bill.</p><p><strong>Who this is for:</strong></p><p>Restaurants, food trucks, and cafes that already have a domain or a page somewhere, and are tired of the update cycle - reprinting when a price changes, crossing out 86d items with a Sharpie, waiting on a print run for a new seasonal item.</p><p><strong>What is inside:</strong></p><ul><li><strong>Mobile-first HTML/CSS digital menu template</strong> - loads in under 1 second</li><li><strong>Category tab switcher built-in</strong> - mains, sides, drinks</li><li><strong>QR code frame wrapper SVG</strong> with built-in quiet-zone margins</li><li><strong>Deployment guide</strong> for Netlify, GitHub Pages, or Firebase Hosting</li></ul><p><strong>The 10-minute burn challenge:</strong></p><p>Round 1: Open the HTML template, swap sample dishes for yours. Round 2: Drop in your logo. Round 3: Go live. Round 4: Print the QR code once.</p>
'@

& $cliPath products create `
  --name "Digital Menu Kit - Burn-1" `
  --price "50" `
  --description $desc `
  --cover-image $coverPath `
  --thumbnail $thumbPath `
  --file $zipPath `
  --file-name "digital_menu_kit.zip"
