import os
import sys
import re
import qrcode
from PIL import Image, ImageDraw, ImageFont

CURRENT_DIR = r"C:\Users\Leonr\projects\burn-1.com"
CARDS_DIR = os.path.join(CURRENT_DIR, "cards")
out_dir = r"C:\Users\Leonr\Downloads\Burn1_Pitch_QRCodes"
os.makedirs(out_dir, exist_ok=True)

# 1. Base database from v3
SOURCE_V3 = r"C:\Users\Leonr\Downloads\burn1-card-generator-v3.txt"
with open(SOURCE_V3, "r", encoding="utf-8") as f:
    code_text = f.read()

start_idx = code_text.find("businesses_db = {")
end_idx = code_text.find("\nos.makedirs(")
if end_idx == -1:
    end_idx = code_text.find("\ncorporate_slugs =")

db_code = code_text[start_idx:end_idx]
local_scope = {}
exec(db_code, {}, local_scope)
businesses_db = local_scope["businesses_db"]

# 2. Add additions from v4
new_survey_additions = {
    'champion-muffler': {
        'name': "Champion Muffler & Brake Service", 'category': "Auto Services",
        'address': "5978 Covington Hwy, Decatur, GA 30035", 'phone': "(770) 322-6065",
        'corridor': 'covington', 'subtext': '📍 Covington Strip'
    },
    'tacos-acapulco': {
        'name': "Tacos Acapulco & Roadside BBQ Lot", 'category': "Food & Dining",
        'address': "5995 Covington Hwy, Decatur, GA 30035", 'phone': "(404) 555-0190",
        'corridor': 'covington', 'subtext': '📍 Covington Strip'
    },
    'elite-vision-events': {
        'name': "Elite Vision Event Center", 'category': "Entertainment & Venues",
        'address': "2348 Panola Rd, Lithonia, GA 30058", 'phone': "(678) 739-9801",
        'corridor': 'panola', 'subtext': '📍 Panola Corridor'
    },
    'extra-space-panola': {
        'name': "Extra Space Storage", 'category': "Self-Storage",
        'address': "2329 Panola Rd, Lithonia, GA 30058", 'phone': "(770) 323-2917",
        'corridor': 'panola', 'subtext': '📍 Panola Corridor'
    },
    'spiritual-faith-house': {
        'name': "Spiritual / Faith Sanctuary House", 'category': "Faith & Community",
        'address': "2418 Panola Rd, Lithonia, GA 30058", 'phone': "N/A",
        'corridor': 'panola', 'subtext': '📍 Panola Corridor'
    },
    'hillendale-care': {
        'name': "Hillendale Primary Care", 'category': "Healthcare & Medical",
        'address': "2523 Panola Rd, Lithonia, GA 30058", 'phone': "(770) 322-9660",
        'corridor': 'panola', 'subtext': '📍 Panola Corridor'
    },
    'super-suds': {
        'name': "Super Suds Car Wash", 'category': "Auto Services",
        'address': "2563 Panola Rd, Lithonia, GA 30058", 'phone': "(470) 385-6241",
        'corridor': 'panola', 'subtext': '📍 Panola Corridor'
    },
    'space-shop-panola': {
        'name': "Space Shop Self Storage", 'category': "Self-Storage",
        'address': "2590 Panola Rd, Lithonia, GA 30058", 'phone': "(770) 593-4270",
        'corridor': 'panola', 'subtext': '📍 Panola Corridor'
    },
    'family-dollar': {
        'name': "Family Dollar", 'category': "Retail",
        'address': "2627 Panola Rd, Lithonia, GA 30058", 'phone': "N/A",
        'corridor': 'panola', 'subtext': '📍 Panola Corridor'
    },
    'state-farm-joseph-marshall': {
        'name': "Joseph Marshall — State Farm Insurance Agency", 'category': "Insurance & Financial Services",
        'address': "2661 Panola Rd, Lithonia, GA 30058", 'phone': "(770) 322-0756",
        'corridor': 'panola', 'subtext': '📍 Panola Corridor'
    },
    'unclaimed-freight-vacancy': {
        'name': "Former Unclaimed Freight Building", 'category': "Commercial Real Estate Vacancy",
        'address': "6151 Covington Hwy, Stonecrest, GA 30058", 'phone': "N/A",
        'corridor': 'covington', 'subtext': '📍 Covington Strip'
    }
}
businesses_db.update(new_survey_additions)

# Add Jason Kuts
if 'jasonkuts' not in businesses_db:
    businesses_db['jasonkuts'] = {
        'name': "Jason 'Knowledge' Barber",
        'category': "Barber & Beauty",
        'address': "Lithonia / Stonecrest Area, GA",
        'phone': "(904) 403-1792"
    }

# Build business list
business_items = []
for slug, data in sorted(businesses_db.items(), key=lambda x: x[1]['name']):
    name = data.get('name', slug.replace('-', ' ').title())
    category = data.get('category', 'Local Service')
    phone = data.get('phone', '')
    url = f"https://{slug}.burn-1.com"
    business_items.append({
        'slug': slug,
        'name': name,
        'category': category,
        'phone': phone,
        'url': url
    })

print(f"Total businesses to generate QR Badges for: {len(business_items)}")

font_title = ImageFont.load_default()
font_sub = ImageFont.load_default()

for idx, b in enumerate(business_items, 1):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(b['url'])
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#0f172a", back_color="white").convert("RGB")
    
    # Create Badge Canvas (Width: 340, Height: 400)
    w, h = 340, 400
    badge = Image.new("RGB", (w, h), "white")
    draw = ImageDraw.Draw(badge)
    
    # Outer Cyan/Blue Border
    draw.rectangle([(2, 2), (w - 3, h - 3)], outline="#0ea5e9", width=3)
    
    # Header Banner
    draw.rectangle([(2, 2), (w - 3, 46)], fill="#0f172a")
    
    # Header Title
    name_display = b['name'][:30]
    draw.text((12, 16), name_display.upper(), fill="#38bdf8", font=font_title)
    
    # Paste QR Code
    qr_w, qr_h = qr_img.size
    offset_x = (w - qr_w) // 2
    badge.paste(qr_img, (offset_x, 56))
    
    # Subdomain Footer
    clean_sub = b['url'].replace("https://", "")
    draw.rectangle([(2, h - 52), (w - 3, h - 3)], fill="#f8fafc")
    draw.text((16, h - 44), f"URL: {clean_sub}", fill="#0f172a", font=font_sub)
    draw.text((16, h - 24), "SCAN FOR VERIFIED DIGITAL CARD", fill="#64748b", font=font_sub)
    
    clean_name = re.sub(r'[^a-zA-Z0-9]', '_', b['name']).strip('_')
    clean_name = re.sub(r'_+', '_', clean_name)
    
    # Save as numbered PNG
    badge.save(os.path.join(out_dir, f"{idx:02d}_{clean_name}.png"))
    # Save as named JPEG for easy email attachments
    badge.save(os.path.join(out_dir, f"{clean_name}.jpg"), "JPEG", quality=95)
    # Save as slug.png for grid embedding
    badge.save(os.path.join(out_dir, f"{b['slug']}.png"))

print(f"Generated {len(business_items)} PNG and JPEG badges in {out_dir}!")

# Update 1-Click Printable Pitch Sheet Grid HTML
html_grid_path = os.path.join(r"C:\Users\Leonr\Downloads", "Burn1_Printable_Pitch_Grid.html")
html_cards = ""
for b in business_items:
    html_cards += f"""
    <div class="pitch-card">
      <div class="card-header">
        <span class="category">{b['category']}</span>
        <h3 class="biz-name">{b['name']}</h3>
      </div>
      <div class="qr-container">
        <img src="Burn1_Pitch_QRCodes/{b['slug']}.png" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={b['url']}'" class="qr-img" />
      </div>
      <div class="card-footer">
        <span class="url-text">{b['url'].replace('https://', '')}</span>
        <span class="sub-text">⚡ Scan for Live Digital Card</span>
      </div>
    </div>
    """

printable_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Burn-1 Merchant Directory // Printable Pitch QR Sheets</title>
  <style>
    @page {{
      size: letter portrait;
      margin: 0.4in;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f1f5f9;
      color: #0f172a;
    }}
    .no-print-bar {{
      background: #0f172a;
      color: white;
      padding: 14px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}
    .print-btn {{
      background: #0284c7;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
    }}
    .grid-container {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 16px;
    }}
    .pitch-card {{
      background: white;
      border: 1.5px dashed #0284c7;
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      page-break-inside: avoid;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }}
    .card-header {{
      width: 100%;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }}
    .category {{
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 800;
      color: #0284c7;
      letter-spacing: 0.5px;
    }}
    .biz-name {{
      margin: 2px 0 0 0;
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }}
    .qr-img {{
      width: 130px;
      height: 130px;
      object-fit: contain;
      margin: 4px 0;
    }}
    .card-footer {{
      width: 100%;
      border-top: 1px solid #f1f5f9;
      padding-top: 6px;
      margin-top: 4px;
    }}
    .url-text {{
      display: block;
      font-family: monospace;
      font-size: 10px;
      font-weight: bold;
      color: #0f172a;
    }}
    .sub-text {{
      display: block;
      font-size: 8px;
      color: #64748b;
      margin-top: 2px;
      text-transform: uppercase;
    }}
    @media print {{
      body {{
        background: white;
        padding: 0;
      }}
      .no-print-bar {{
        display: none;
      }}
      .grid-container {{
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }}
      .pitch-card {{
        border: 1px dashed #94a3b8;
        box-shadow: none;
      }}
    }}
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div>
      <strong style="font-size: 16px;">Burn-1 Merchant Directory // Full Pitch Sheet ({len(business_items)} Businesses)</strong>
      <div style="font-size: 12px; color: #94a3b8;">{len(business_items)} Pre-configured Merchant QR Badges ready to print &amp; pitch.</div>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print All Cards (Ctrl+P)</button>
  </div>
  <div class="grid-container">
    {html_cards}
  </div>
</body>
</html>"""

with open(html_grid_path, "w", encoding="utf-8") as f:
    f.write(printable_html)

print(f"Updated printable HTML grid created at: {html_grid_path}")
