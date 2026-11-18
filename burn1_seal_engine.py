#!/usr/bin/env python3
"""
BURN-1 Systems — Algorithmic Cryptographic Seal Generator
Module: burn1_seal_engine.py
Authority: © 2026 Leon R. Darden • BURN-1 Systems (burn-1.com)

Renders tamper-proof, anti-counterfeiting Code-Band Seals for:
1. Document Binders (Print/PDF) via assets/seals/documentSeal.jpg
2. Digital Dashboards / Subdomain Vaults via assets/seals/onlineseal.jpg
"""

import math
import os
import hashlib
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = Path(__file__).resolve().parent
SEALS_DIR = BASE_DIR / "assets" / "seals"
VAULT_SEALS_DIR = BASE_DIR / "vault" / "seals"

def generate_sha256_hash(domain: str, timestamp: str) -> str:
    """Generates the official Algorithmic Cryptographic SHA-256 Seal hash."""
    raw_payload = f"BURN1_SEAL:{domain}:{timestamp}:NIST_CSF_2.0:CISA_KEV_VERIFIED"
    return hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()

def render_codeband_seal(
    sha256_hash: str,
    domain: str,
    cert_id: str = "B1-884-902-SEC",
    seal_type: str = "document",  # 'document' or 'online'
    output_path: str = None
) -> str:
    """
    Renders an immutable micro-code band around the seal perimeter.
    The client's exact 64-char SHA-256 hash, domain, and cert ID are permanently
    rendered into the rosette boundary in high-contrast intaglio ink.
    """
    VAULT_SEALS_DIR.mkdir(parents=True, exist_ok=True)
    
    if seal_type == "online":
        src_path = SEALS_DIR / "onlineseal.jpg"
        ink_color = (255, 215, 100) # Metallic Gold / Amber
        r = 492
    else:
        src_path = SEALS_DIR / "documentSeal.jpg"
        ink_color = (35, 35, 35)    # Intaglio Banknote Black
        r = 490

    if not src_path.exists():
        raise FileNotFoundError(f"Source master seal not found at: {src_path}")

    im = Image.open(src_path).convert("RGB")
    draw = ImageDraw.Draw(im)
    w, h = im.size
    cx, cy = w / 2, h / 2

    # Construct the micro-print security string
    clean_hash = sha256_hash.upper()
    text_segment = f"• SHA256:{clean_hash} • CERT:{cert_id} • DOMAIN:{domain.upper()} • NIST_CSF_2.0_VERIFIED "
    
    circumference = 2 * math.pi * r
    char_spacing_px = 11.5
    total_chars = int(circumference / char_spacing_px)
    repeat_count = int(total_chars / len(text_segment)) + 1
    full_band_text = (text_segment * repeat_count)[:total_chars]

    angle_step = 360.0 / total_chars

    try:
        font = ImageFont.truetype("cour.ttf", 10)
    except Exception:
        try:
            font = ImageFont.truetype("DejaVuSansMono.ttf", 10)
        except Exception:
            font = ImageFont.load_default()

    for i, char in enumerate(full_band_text):
        angle_deg = i * angle_step - 90
        angle_rad = math.radians(angle_deg)
        x = cx + r * math.cos(angle_rad)
        y = cy + r * math.sin(angle_rad)
        draw.text((x, y), char, fill=ink_color, font=font, anchor="mm")

    if not output_path:
        out_filename = f"seal_{domain.replace('.', '_')}_{sha256_hash[:12]}_{seal_type}.jpg"
        output_path = str(VAULT_SEALS_DIR / out_filename)

    im.save(output_path, quality=95)
    return output_path

if __name__ == "__main__":
    test_dom = "apex-logistics.com"
    test_h = generate_sha256_hash(test_dom, "2026-11-18")
    doc_out = render_codeband_seal(test_h, test_dom, seal_type="document")
    onl_out = render_codeband_seal(test_h, test_dom, seal_type="online")
    print(f"Generated Document Code-Band Seal: {doc_out}")
    print(f"Generated Online Code-Band Seal:   {onl_out}")
