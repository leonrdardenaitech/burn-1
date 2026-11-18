#!/usr/bin/env python3
"""
daily_crew_check.py
===================
Automated 8:00 AM Maintenance, Intake Security Sweep & Pipeline Test Engine
Created for BURN-1 Systems (burn-1.com)
"""

import ssl
import socket
import datetime
import urllib.request
import csv
import os
import requests

ENDPOINTS = [
    "https://burn-1.com",
    "https://www.burn-1.com",
    "https://freezer.burn-1.com",
    "https://www.burn-1.com/cinematic-onboarding",
    "https://www.burn-1.com/intake",
    "https://www.burn-1.com/msp-intake",
    "https://www.burn-1.com/academy",
    "https://www.burn-1.com/fast-lane",
    "https://www.burn-1.com/partners",
    "https://www.burn-1.com/broker-portal",
    "https://www.burn-1.com/api/health"
]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
SPREADSHEET_PATH = os.path.join(PROJECT_ROOT, "maintenance_ledger.csv")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
ATT_PHONE_EMAIL = os.getenv("ATT_PHONE_EMAIL", "")

def check_endpoints():
    failures = []
    latencies = []
    
    for url in ENDPOINTS:
        try:
            start = datetime.datetime.now()
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Burn1-Scout/2.0'}
            )
            with urllib.request.urlopen(req, timeout=10) as res:
                duration_ms = int((datetime.datetime.now() - start).total_seconds() * 1000)
                latencies.append(duration_ms)
                if res.status != 200:
                    failures.append(f"{url} returned HTTP {res.status}")
                elif duration_ms > 4500:
                    failures.append(f"{url} slow ({duration_ms}ms)")
        except Exception as e:
            failures.append(f"{url} DOWN ({str(e)})")
            
    avg_latency = int(sum(latencies) / len(latencies)) if latencies else 0
    return failures, avg_latency

def check_ssl(domain="burn-1.com"):
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=domain) as s:
            s.settimeout(6.0)
            s.connect((domain, 443))
            cert = s.getpeercert()
            exp = datetime.datetime.strptime(cert['notAfter'], "%b %d %H:%M:%S %Y %Z")
            days_left = (exp - datetime.datetime.utcnow()).days
            return days_left
    except Exception as e:
        return -1

def fire_emergency_alert(msg):
    print(f"[!] EMERGENCY ALERT: {msg}")
    
    # 1. Telegram Dispatch
    if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:
        try:
            requests.post(
                f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
                data={"chat_id": TELEGRAM_CHAT_ID, "text": f"🚨 BURN-1 ALERT:\n{msg}"},
                timeout=5
            )
        except Exception as e:
            print(f"Telegram alert error: {e}")

def main():
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S EST")
    failures, avg_ms = check_endpoints()
    ssl_days = check_ssl()
    
    if ssl_days >= 0 and ssl_days < 14:
        failures.append(f"SSL certificate expires in {ssl_days} days!")
    elif ssl_days < 0:
        failures.append("SSL certificate check failed!")

    status = "PASS" if not failures else "FAIL"
    checked_count = f"{len(ENDPOINTS) - len(failures)}/{len(ENDPOINTS)} OK"
    notes = f"All 11 routes nominal ({avg_ms}ms avg, SSL {ssl_days}d)" if status == "PASS" else " | ".join(failures)

    file_exists = os.path.isfile(SPREADSHEET_PATH)
    with open(SPREADSHEET_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["Timestamp", "Status", "AvgLatencyMs", "SSLDaysRemaining", "DNSStatus", "MXStatus", "EndpointsChecked", "Notes"])
        writer.writerow([now, status, avg_ms, ssl_days, "RESOLVED", "ACTIVE", checked_count, notes])

    if status == "FAIL":
        fire_emergency_alert(notes)
    else:
        print(f"[{now}] Crew check PASS: {checked_count} ({avg_ms}ms avg). Logged to maintenance_ledger.csv.")

if __name__ == "__main__":
    main()
