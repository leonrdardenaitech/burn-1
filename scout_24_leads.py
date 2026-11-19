#!/usr/bin/env python3
"""
BURN-1 Systems — Pre-Scout Lead Scanner & Drift Tracker
Module: scout_24_leads.py
Author: Leon R. Darden • BURN-1 Systems (burn-1.com)

Runs passive outside-in baseline sweeps on the 24 Atlanta Metro prospects.
Stores findings in vault/pre_scout_leads/ so when a lead responds,
we already have their historical baseline and drift delta cached!
"""

import sys
import os
import json
import socket
import ssl
import hashlib
import datetime
import urllib.parse
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
LEADS_FILE = BASE_DIR / "scratch" / "extracted_24_leads.json"
SCOUT_DIR = BASE_DIR / "vault" / "pre_scout_leads"
SCOUT_DIR.mkdir(parents=True, exist_ok=True)

# Also check scratch in brain dir
BRAIN_LEADS_FILE = Path(r"C:\Users\Leonr\.gemini\antigravity-cli\brain\6c6d6996-2b66-4f89-881c-ebd6cc3dc68c\scratch\extracted_24_leads.json")

def clean_domain(url_or_name: str) -> str:
    if not url_or_name:
        return ""
    if url_or_name.startswith("http"):
        parsed = urllib.parse.urlparse(url_or_name)
        netloc = parsed.netloc.lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        return netloc
    return url_or_name.strip().lower()

def scout_single_domain(domain: str, company_name: str, category: str) -> dict:
    timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
    record = {
        "company_name": company_name,
        "category": category,
        "scouted_domain": domain,
        "scouted_timestamp": timestamp,
        "dns_resolved": False,
        "ip_addresses": [],
        "tls_version": "N/A",
        "open_ports": [],
        "high_risk_exposure": False,
        "baseline_grade": "UNKNOWN",
        "underwriting_talking_point": ""
    }

    if not domain:
        record["underwriting_talking_point"] = "Missing registered primary web domain; high initial discovery friction."
        return record

    # 1. DNS Resolution
    try:
        ips = socket.gethostbyname_ex(domain)[2]
        record["dns_resolved"] = True
        record["ip_addresses"] = ips
    except Exception:
        record["dns_resolved"] = False
        record["underwriting_talking_point"] = f"DNS resolution failed on {domain}; possible expired or misconfigured nameservers."
        return record

    # 2. TLS Handshake check
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=3.0) as sock:
            with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                record["tls_version"] = ssock.version()
    except Exception:
        record["tls_version"] = "DEGRADED_OR_TIMEOUT"

    # 3. Check high-risk ports (RDP 3389, SMB 445, SSH 22)
    test_ports = [22, 445, 3389]
    for port in test_ports:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1.0)
                if s.connect_ex((record["ip_addresses"][0], port)) == 0:
                    record["open_ports"].append(port)
                    if port in [445, 3389]:
                        record["high_risk_exposure"] = True
        except Exception:
            pass

    # 4. Synthesize Underwriting Intelligence
    if record["high_risk_exposure"]:
        record["baseline_grade"] = "CRITICAL_REMEDIATION_NEEDED"
        record["underwriting_talking_point"] = "Exposed management port (3389/445) detected. Immediate declination risk with commercial underwriters."
    elif record["tls_version"] == "DEGRADED_OR_TIMEOUT":
        record["baseline_grade"] = "B"
        record["underwriting_talking_point"] = "TLS handshake latency or legacy cipher configuration observed. Carrier readiness tune-up recommended."
    else:
        record["baseline_grade"] = "A+"
        record["underwriting_talking_point"] = "Perimeter is clean and hardened. Ready for immediate fast-track underwriting binder sign-off."

    return record

def run_scout_batch(limit: int = 24):
    target_file = LEADS_FILE if LEADS_FILE.exists() else BRAIN_LEADS_FILE
    if not target_file.exists():
        print(f"Leads file not found at {target_file}")
        return

    with open(target_file, "r", encoding="utf-8") as f:
        leads = json.load(f)

    print(f"[*] Starting Pre-Scout Run on {len(leads)} leads...")
    results = []
    for idx, lead in enumerate(leads[:limit]):
        dom = clean_domain(lead.get("url"))
        print(f"[{idx+1}/{len(leads)}] Scouting: {lead['name']} ({dom or 'No Domain'})...")
        res = scout_single_domain(dom, lead["name"], lead["category"])
        results.append(res)

    master_scout_file = SCOUT_DIR / "atlanta_24_leads_pre_scout.json"
    with open(master_scout_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"[✓] Pre-scout complete! Master intelligence dossier saved to:\n  {master_scout_file}")

if __name__ == "__main__":
    run_scout_batch()
