import os
import sys
import re

CURRENT_DIR = r"C:\Users\Leonr\projects\burn-1.com"
CARDS_DIR = os.path.join(CURRENT_DIR, "cards")
os.makedirs(CARDS_DIR, exist_ok=True)

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

if 'cartopia-car-wash' in businesses_db:
    businesses_db['cartopia-car-wash']['phone'] = '(470) 385-6241'

print(f"Total businesses in V14 compiled database: {len(businesses_db)}")

static_template_base = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__BIZ_NAME__ | Burn-1 Platform Verified Card</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: 'Space Grotesk', sans-serif;
            overflow-x: hidden;
        }
        .glass-card {
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(6, 182, 212, 0.2);
            box-shadow: 0 0 30px rgba(6, 182, 212, 0.15);
        }
        @keyframes pulse-cyan {
            0%, 100% {
                box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
                border-color: rgba(6, 182, 212, 0.8);
            }
            50% {
                box-shadow: 0 0 25px rgba(6, 182, 212, 0.7);
                border-color: rgba(34, 211, 238, 1);
            }
        }
        .pulse-badge {
            animation: pulse-cyan 2.5s infinite;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between p-4 md:p-8 bg-radial-gradient">

    <!-- TOP HEADER / BRANDING -->
    <header class="w-full max-w-md mx-auto text-center pt-4">
        __BADGE__
    </header>

    <!-- MAIN STATIC CARD CONTAINER -->
    <main class="w-full max-w-md mx-auto my-auto py-6">
        <div id="card-content" class="glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden transition-all duration-300">
            
            <!-- Category and Status -->
            <div class="flex justify-between items-center">
                <span class="text-xs font-bold tracking-wider text-cyan-400 uppercase font-mono bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-800/30">
                    __BIZ_CATEGORY__
                </span>
                <span class="flex h-2.5 w-2.5 relative">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
            </div>

            <!-- Business Name -->
            <div class="flex flex-col gap-1.5 mt-2">
                <h1 class="text-3xl md:text-4xl font-black tracking-tight text-white uppercase leading-none">
                    __BIZ_NAME__
                </h1>
                <span class="h-1 w-16 bg-cyan-500 rounded-full mt-2"></span>
            </div>

            <!-- Address -->
            <div class="flex flex-col gap-1 mt-2">
                <span class="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">PHYSICAL LOCATION</span>
                <p class="text-sm text-slate-200 leading-relaxed font-bold">
                    __BIZ_ADDRESS__
                </p>
            </div>

            <!-- Phone Number -->
            <div class="flex flex-col gap-1">
                <span class="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">TELEPHONE CONTACT</span>
                <p class="text-lg text-white font-black tracking-wide font-mono">
                    __BIZ_PHONE__
                </p>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="grid grid-cols-2 gap-4 mt-4">
                <a href="tel:__RAW_PHONE__" class="flex items-center justify-center gap-2 py-3 bg-white text-black font-black text-sm uppercase rounded-xl hover:bg-slate-200 transition-all text-center">
                    📞 Call Now
                </a>
                <a href="https://www.google.com/maps/search/?api=1&query=__MAP_QUERY__" target="_blank" class="flex items-center justify-center gap-2 py-3 bg-cyan-600 text-white font-black text-sm uppercase rounded-xl hover:bg-cyan-500 transition-all text-center border border-cyan-500/50">
                    📍 Directions
                </a>
            </div>

        </div>
    </main>

    <!-- FOOTER / RETURN NAVIGATION -->
    <footer class="w-full max-w-md mx-auto text-center pb-4 flex flex-col gap-4 items-center">
        <a href="https://burn-1.com/directory" class="text-xs font-black text-slate-400 hover:text-cyan-400 uppercase tracking-widest transition-all font-mono">
            ← Return to Directory Hub
        </a>
        <div class="text-[9px] text-slate-600 font-mono">
            © 2026 BURN-1 PLATFORM
        </div>
    </footer>
</body>
</html>"""

corporate_slugs = [
    'ashley-stewart', 'marshalls', 'ross', 'dsw-warehouse', 'shoppers-world', 'davita',
    'kroger', 'wells-fargo', 'dollar-tree', 'little-caesars', 'goodwill',
    'staples', 'us-army-recruiting', 'hr-block', 'wendys', 'subway', 'family-dollar', 'unclaimed-freight-vacancy'
]

aliases = {
    'automotion': 'auto-motion-wheel-repairs',
    'plaza-grill': 'plaza-grill-wings',
    'elite-braids': 'elite-braids-weaves',
    'ilocdit': 'ilocdit-natural-hair',
    'barber-kingz': 'barber-kingz-studio',
    'luxe-nails': 'luxe-nails-spa',
    'mowersplus': 'mowers-plus',
    'island-spice': 'island-spice-hut',
    'apogee-barber': 'apogee-barber-shop',
    'mimosa-suites': 'mimosa-salon-suites',
    'doublescoop': 'double-scoop',
    'double-scoop': 'doublescoop'
}

def render_and_save(target_slug, data):
    biz_name = data.get('name', 'VERIFIED MERCHANT')
    biz_category = data.get('category', 'LOCAL SERVICE')
    biz_address = data.get('address', 'Stonecrest / Lithonia Area, GA')
    biz_phone = data.get('phone', '')
    
    is_corporate = any(c in target_slug for c in corporate_slugs) or any(c in biz_name.lower() for c in ['kroger', 'wells fargo', 'dollar tree', 'little caesars', 'goodwill', 'staples', 'army recruiting', 'h&r block', 'wendy', 'subway', 'family dollar', 'unclaimed freight'])
    if is_corporate:
        badge = '<span class="text-xs font-bold tracking-widest bg-slate-800/40 text-slate-400 border border-slate-700/30 px-3 py-1 uppercase rounded-full">Public Community Listing</span>'
    else:
        badge = '<span class="text-xs font-bold tracking-widest bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 uppercase rounded-full">Burn-1 Platform Verified</span>'

    raw_phone = re.sub(r'[^0-9]', '', biz_phone)
    map_query = re.sub(r'\s+', '+', data.get('name', '') + ' ' + biz_address)
    
    page_content = static_template_base
    page_content = page_content.replace('__BIZ_NAME__', biz_name)
    page_content = page_content.replace('__BIZ_CATEGORY__', biz_category)
    page_content = page_content.replace('__BIZ_ADDRESS__', biz_address)
    page_content = page_content.replace('__BIZ_PHONE__', biz_phone)
    page_content = page_content.replace('__RAW_PHONE__', raw_phone)
    page_content = page_content.replace('__MAP_QUERY__', map_query)
    page_content = page_content.replace('__BADGE__', badge)
    
    file_path = os.path.join(CARDS_DIR, f"{target_slug}.html")
    with open(file_path, 'w', encoding='utf-8') as out_f:
        out_f.write(page_content)

count = 0
for slug, data in businesses_db.items():
    render_and_save(slug, data)
    count += 1
    if slug in aliases:
        render_and_save(aliases[slug], data)

print(f"Successfully generated {count} merchant cards + aliases to {CARDS_DIR}!")
