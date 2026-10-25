import os, glob, re

CARDS_DIR = r"C:\Users\Leonr\projects\burn-1.com\cards"
files = glob.glob(os.path.join(CARDS_DIR, "*.html"))

categories = {}

for f in sorted(files):
    slug = os.path.splitext(os.path.basename(f))[0]
    with open(f, "r", encoding="utf-8") as fp:
        html = fp.read()
    
    name_m = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", html)
    name = name_m.group(1).strip() if name_m else slug
    cat_m = re.search(r'class="text-xs font-bold tracking-wider text-cyan-400[^>]*>([\s\S]*?)</span>', html)
    cat = cat_m.group(1).strip() if cat_m else "Local Service"
    phone_m = re.search(r'class="text-lg text-white font-black tracking-wide font-mono">\s*([\s\S]*?)\s*</p>', html)
    phone = phone_m.group(1).strip() if phone_m else "N/A"
    
    if cat not in categories:
        categories[cat] = []
    
    categories[cat].append({
        "slug": slug,
        "name": name,
        "phone": phone,
        "file": f.replace("\\", "/")
    })

print(f"Total Unique Cards / Subdomains: {len(files)}\n")
for cat, biz_list in sorted(categories.items()):
    print(f"### {cat} ({len(biz_list)})")
    for b in biz_list:
        print(f"- **{b['name']}**: `{b['slug']}.burn-1.com` | Tel: {b['phone']} | Path: {b['file']}")
    print()
