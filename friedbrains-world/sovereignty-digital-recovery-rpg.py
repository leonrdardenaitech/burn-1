#!/usr/bin/env python3
"""
===============================================================================
SOVEREIGNTY DIGITAL RECOVERY RPG :: BURN-1 SYSTEMS TERMINAL ENGINE v2.6
===============================================================================
An interactive terminal recovery RPG simulating digital perimeter isolation,
metadata purging, obfs4 Tor bridge routing, and memory cache flushing.
"""

import sys
import time
import random

def print_slow(text, delay=0.02):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def header():
    print("=" * 75)
    print(" 🧠 BURN-1 SYSTEMS :: SOVEREIGNTY DIGITAL RECOVERY RPG ⚡")
    print("   Operational Clearance: Level 4 | Hard Hat Protocol Active")
    print("=" * 75)

class Player:
    def __init__(self, name):
        self.name = name
        self.focus_points = 100
        self.privacy_score = 25
        self.d2_density = 45.0
        self.rank = "Novice Striker"
        self.inventory = []

    def status(self):
        print(f"\n---------------- STATUS REPORT: [{self.name}] ----------------")
        print(f"  Focus Points      : {self.focus_points}/100")
        print(f"  Privacy Clearance : {self.privacy_score}%")
        print(f"  D2 Receptor Density: {self.d2_density:.1f}%")
        print(f"  Current Rank      : {self.rank}")
        print(f"  Scrubbed Modules  : {', '.join(self.inventory) if self.inventory else 'None'}")
        print("------------------------------------------------------------\n")

def mission_exif_scrub(player):
    print_slow("\n[MISSION 1] RUNNING: exiftool_scrub.sh")
    print_slow("Scanning local directory for unscrubbed EXIF GPS tags & camera metadata...")
    time.sleep(1)
    
    files = ["photo_2026_08_01.jpg", "document_scan_04.pdf", "family_event.png"]
    for f in files:
        print_slow(f"  -> Stripping GPS coordinates & device serial from [{f}]...")
        time.sleep(0.5)
    
    player.privacy_score += 25
    player.d2_density += 12.5
    player.inventory.append("EXIF Metadata Purged")
    print_slow("\n✅ MISSION 1 COMPLETE: All photo metadata scrubbed clean! (+25% Privacy, +12.5% D2 Density)")

def mission_tor_bridge(player):
    print_slow("\n[MISSION 2] CONNECTING: obfs4 Tor Pluggable Transports")
    print_slow("Bypassing commercial ISP Deep Packet Inspection (DPI)...")
    time.sleep(1)
    
    bridges = ["192.0.2.45:9001 obfs4 cert=XyZ9...", "198.51.100.12:443 obfs4 cert=aB3..."]
    for b in bridges:
        print_slow(f"  -> Testing bridge node: [{b}]... CONNECTED")
        time.sleep(0.6)
    
    player.privacy_score += 30
    player.d2_density += 15.0
    player.inventory.append("obfs4 Tor Transport Established")
    print_slow("\n✅ MISSION 2 COMPLETE: Encrypted obfs4 Tor bridge active! (+30% Privacy, +15% D2 Density)")

def mission_burn1_cache(player):
    print_slow("\n[MISSION 3] EXECUTING: burn1-cache-clear.sh")
    print_slow("Flushing telemetry tracking cookies, local storage beacons, and browser gray matter cache...")
    time.sleep(1)
    
    targets = ["Supercookies (HSTS)", "Canvas Fingerprinting Beacon", "Ad-Id Telemetry Hook"]
    for t in targets:
        print_slow(f"  -> Terminating & Shredding: [{t}]...")
        time.sleep(0.5)
    
    player.privacy_score += 20
    player.d2_density += 15.0
    player.rank = "Sovereign Mind Master"
    player.inventory.append("Telemetry Shredded")
    print_slow("\n✅ MISSION 3 COMPLETE: Telemetry shredded! You are now a Sovereign Mind Master!")

def main():
    header()
    name = input("\nEnter your Operative Call Sign: ").strip() or "Operative_Alpha"
    player = Player(name)
    
    print_slow(f"\nWelcome, Operative {player.name}. The electronic pushers are tracking your every scroll.")
    print_slow("Your objective: Complete the 3 Hard Hat Recovery Missions to reclaim your brain.\n")
    
    while True:
        player.status()
        print("Select Mission:")
        print("  1. Mission 1: Run exiftool_scrub.sh (Metadata Purging)")
        print("  2. Mission 2: Connect obfs4 Tor Bridges (Bypass DPI Surveillance)")
        print("  3. Mission 3: Execute burn1-cache-clear.sh (Shred Telemetry)")
        print("  4. View Final System Clearance Certificate")
        print("  5. Exit Terminal")
        
        choice = input("\nEnter choice [1-5]: ").strip()
        
        if choice == '1':
            if "EXIF Metadata Purged" in player.inventory:
                print("\n⚠️ Mission 1 already completed!")
            else:
                mission_exif_scrub(player)
        elif choice == '2':
            if "obfs4 Tor Transport Established" in player.inventory:
                print("\n⚠️ Mission 2 already completed!")
            else:
                mission_tor_bridge(player)
        elif choice == '3':
            if "Telemetry Shredded" in player.inventory:
                print("\n⚠️ Mission 3 already completed!")
            else:
                mission_burn1_cache(player)
        elif choice == '4':
            print("\n" + "="*60)
            print(" 🏆 FINAL SOVEREIGNTY CLEARANCE CERTIFICATE")
            print(f" Operative        : {player.name}")
            print(f" Privacy Rating   : {player.privacy_score}% / 100%")
            print(f" D2 Density Level : {player.d2_density:.1f}%")
            print(f" System Status    : {player.rank}")
            print("="*60 + "\n")
        elif choice == '5':
            print_slow("\nExiting Burn-1 Terminal. Remember: Don't Be A Fried Brains. Step away from the device! 🧠⚡")
            break
        else:
            print("\n❌ Invalid choice! Select 1-5.")

if __name__ == "__main__":
    main()
