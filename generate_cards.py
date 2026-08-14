import os
import re

# 1. Path setup
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(CURRENT_DIR, "burn1-digital-card-v3.html")
CARDS_DIR = os.path.join(CURRENT_DIR, "cards")

os.makedirs(CARDS_DIR, exist_ok=True)

# 2. Read the card template
if not os.path.exists(TEMPLATE_PATH):
    # Fallback to Downloads if not found in root
    TEMPLATE_PATH = os.path.expanduser(r"~\Downloads\burn1-digital-card-v3.txt")

with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
    template_content = f.read()

# 3. Extract and parse the BUSINESS_DATABASE using regex
blocks = re.findall(r'\"([a-zA-Z0-9-]+)\"\s*:\s*\{([\s\S]+?)\s*\}', template_content)
if not blocks:
    print("Error: Could not extract BUSINESS_DATABASE from card template.")
    exit(1)

business_db = {}
for slug, body in blocks:
    fields = dict(re.findall(r'(\w+)\s*:\s*\"([^\"]+)\"', body))
    business_db[slug] = fields

print(f"Loaded {len(business_db)} businesses from database.")

# 4. Corporate exclusions
exclusions = {
    'ashley-stewart',
    'marshalls',
    'ross',
    'dsw',
    'shoppers-world',
    'davita'
}

# 5. Slug Aliases mapping (so both directory links and base slugs resolve perfectly)
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
    'mimosa-suites': 'mimosa-salon-suites'
}

# 6. Static HTML template base
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
        <span class="text-xs font-bold tracking-widest bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 uppercase rounded-full">
            Burn-1 Platform Verified
        </span>
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

def render_and_save(target_slug, data):
    biz_name = data.get('name', 'VERIFIED MERCHANT')
    biz_category = data.get('category', 'LOCAL SERVICE')
    biz_address = data.get('address', 'Stonecrest / Lithonia Area, GA')
    biz_phone = data.get('phone', '')
    raw_phone = re.sub(r'[^0-9]', '', biz_phone)
    map_query = re.sub(r'\s+', '+', data.get('mapSearch', biz_name))
    
    page_content = static_template_base
    page_content = page_content.replace('__BIZ_NAME__', biz_name)
    page_content = page_content.replace('__BIZ_CATEGORY__', biz_category)
    page_content = page_content.replace('__BIZ_ADDRESS__', biz_address)
    page_content = page_content.replace('__BIZ_PHONE__', biz_phone)
    page_content = page_content.replace('__RAW_PHONE__', raw_phone)
    page_content = page_content.replace('__MAP_QUERY__', map_query)
    
    file_path = os.path.join(CARDS_DIR, f"{target_slug}.html")
    with open(file_path, 'w', encoding='utf-8') as out_f:
        out_f.write(page_content)

generated_count = 0
for slug, data in business_db.items():
    if slug in exclusions:
        print(f"Skipping corporate exclusion: {slug}")
        continue
    
    # Render primary slug
    render_and_save(slug, data)
    generated_count += 1
    
    # If alias exists, render alias as well
    if slug in aliases:
        alias_slug = aliases[slug]
        render_and_save(alias_slug, data)
        print(f"Generated alias: {alias_slug}.html -> {slug}")

print(f"\nSuccessfully generated {generated_count} core merchant cards (plus aliases) in {CARDS_DIR}!")
