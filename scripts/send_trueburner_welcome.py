#!/usr/bin/env python3
"""
send_trueburner_welcome.py
==========================
Automated Welcome & Dispatch Email Script for the True Burner Suite at Burn-1.com.

Features:
- Sends high-impact, styled welcome emails to True Burner signups & pre-order backers.
- Detailed breakdown & closed-beta offer for Ghost Browser (ephemeral RAM sandbox).
- Teaser of upcoming products in the True Burner Suite (Phone App, Ghost VPN, Cloak Vault).
- Safe dry-run mode that outputs a standalone HTML preview file when SMTP is not configured.
- Supports environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, FROM_EMAIL.

Usage:
    python scripts/send_trueburner_welcome.py recipient@example.com
    python scripts/send_trueburner_welcome.py recipient@example.com --dry-run
"""

import sys
import os
import argparse
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def build_welcome_email(recipient_email, product_focus="All Suite Tools"):
    subject = "Welcome to True Burner // Burn-1 Volatile Security Protocol Stamped"
    
    plain_text = f"""
============================================================
TRUE BURNER // BURN-1.COM VOLATILE PRIVACY SUITE
============================================================

Welcome to the True Burner line. Your dispatch has been registered.

Recipient: {recipient_email}
Registered Focus: {product_focus}
Protocol Status: Active // Volatile RAM Isolation

Thank you for securing your position with the True Burner line at Burn-1.com.
We are resurrecting the untracked, zero-residue freedom of the classic burner
ethos -- built from the ground up for modern threat models.

------------------------------------------------------------
01. GHOST BROWSER: PRIVATE BETA DETAILS & FOUNDING OFFER
------------------------------------------------------------
Ghost Browser is our cloud-isolated volatile browser instance that runs
strictly out of ephemeral server RAM (tmpfs).

Key Architecture:
- 0 bytes written to hard drive, SSD, or mobile storage.
- Real-time entropy randomization for Canvas, WebGL, and AudioContext fingerprints.
- Automated 15-minute countdown auto-shred timer.
- 300ms emergency zero-fill killswitch to incinerate active sessions.

SPECIAL FOUNDING BETA OFFER:
As an early True Burner registrant, you have qualified for our Closed Beta
evaluation tier. You will receive priority access to our upcoming volatile
sandboxes with grandfathered rates before the general public release.

------------------------------------------------------------
02. UPCOMING SUITE BUNDLE LINEUP
------------------------------------------------------------
1. TRUE BURNER PHONE APP (Flagship):
   Virtual disposable phone numbers on demand. Capture 2FA SMS verification
   codes via in-memory scrapers and make encrypted VoIP calls without ever
   exposing your personal cellular carrier or IMEI.

2. GHOST VPN:
   Non-persistent, multi-hop volatile network tunnel with rotating exit nodes
   and zero persistent logging.

3. CLOAK VAULT:
   Zero-knowledge single-use file lockers that shred payloads instantly upon
   download or timer expiration.

Explore the live prototype in the store:
https://burn-1.com/store.html#true-burner-suite

Zero Surveillance. Zero Logs. Without a Trace.
-- The Burn-1 Systems Team (burn-1.com)
============================================================
"""

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to True Burner</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;color:#e5e5e5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Courier New',monospace;line-height:1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050505;padding:30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width:620px;background-color:#000000;border:1px solid #262626;border-radius:18px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.8);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding:28px 32px 20px 32px;background:#0d0d0d;border-bottom:1px solid #1f1f1f;">
              <div style="font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">
                // BURN-1.COM &bull; TRUE BURNER PROTOCOL
              </div>
              <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">
                TRUE BURNER
              </h1>
              <div style="font-size:16px;color:#a3a3a3;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;margin-top:2px;">
                GHOST BROWSER DISPATCH
              </div>
            </td>
          </tr>

          <!-- Welcome Note -->
          <tr>
            <td style="padding:28px 32px 16px 32px;">
              <p style="font-size:14px;color:#d4d4d4;margin:0 0 16px 0;">
                Welcome to the <strong style="color:#ffffff;">True Burner</strong> line at Burn-1.com. Your registration is confirmed.
              </p>
              <div style="background:#0a0a0a;border:1px solid #262626;border-radius:10px;padding:14px 18px;margin-bottom:20px;font-size:12px;color:#9ca3af;">
                <div style="color:#ffffff;font-weight:700;margin-bottom:4px;">DISPATCH TELEMETRY STAMP:</div>
                <div>&bull; Recipient: <span style="color:#ffffff;">{recipient_email}</span></div>
                <div>&bull; Primary Interest: <span style="color:#ffffff;">{product_focus}</span></div>
                <div>&bull; Enclave Status: <span style="color:#ffffff;">Active // Volatile RAM Isolation</span></div>
              </div>
              <p style="font-size:13px;color:#a3a3a3;margin:0 0 20px 0;line-height:1.6;">
                We are building the modern digital resurrection of the untracked blister-pack burner phone: single-use virtual numbers, ephemeral Guerrilla inboxes, and disposable volatile cloud browser sandboxes.
              </p>
            </td>
          </tr>

          <!-- Feature Focus: Ghost Browser -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0a;border:1px solid #2e2e2e;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-size:11px;color:#9ca3af;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">
                      FLAGSHIP RAM ENGINE
                    </div>
                    <h2 style="margin:0 0 12px 0;font-size:20px;font-weight:800;color:#ffffff;text-transform:uppercase;">
                      Ghost Browser Sessions
                    </h2>
                    <ul style="margin:0 0 16px 0;padding-left:18px;color:#d4d4d4;font-size:13px;line-height:1.8;">
                      <li><strong>0 Bytes Written to Disk:</strong> Executes strictly in temporary volatile RAM (tmpfs).</li>
                      <li><strong>Fingerprint Entropy Spoofing:</strong> Canvas, WebGL, and AudioContext randomized per session.</li>
                      <li><strong>15-Minute Auto-Shred:</strong> Hard session purge countdown automatically destroys active sockets.</li>
                      <li><strong>300ms Zero-Fill Killswitch:</strong> Complete memory overwrite with cryptographic noise.</li>
                    </ul>

                    <div style="background:#141414;border-left:3px solid #ffffff;padding:12px 14px;border-radius:4px;font-size:12px;color:#e5e5e5;">
                      <strong>CLOSED BETA OFFER:</strong> As an early registrant, your email has been flagged for grandfathered lifetime beta access. When the next sandbox batch opens, you will receive your direct session key before public release.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Upcoming Products Grid -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <div style="font-size:11px;color:#737373;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:12px;">
                // UPCOMING SUITE LINEUP
              </div>

              <!-- Item 1: Phone App -->
              <div style="background:#0a0a0a;border:1px solid #262626;border-radius:10px;padding:14px 16px;margin-bottom:10px;">
                <div style="font-size:14px;font-weight:800;color:#ffffff;text-transform:uppercase;">
                  True Burner Phone App
                </div>
                <div style="font-size:12px;color:#a3a3a3;margin-top:4px;">
                  Instant single-use virtual phone numbers, automatic SMS OTP code scrapers, encrypted VoIP relays, and zero SIM/IMEI hardware linkage.
                </div>
              </div>

              <!-- Item 2: Ghost VPN -->
              <div style="background:#0a0a0a;border:1px solid #262626;border-radius:10px;padding:14px 16px;margin-bottom:10px;">
                <div style="font-size:14px;font-weight:800;color:#ffffff;text-transform:uppercase;">
                  Ghost VPN
                </div>
                <div style="font-size:12px;color:#a3a3a3;margin-top:4px;">
                  Volatile, non-persistent cloud network routing tunnel with rotating exit nodes and zero packet journaling.
                </div>
              </div>

              <!-- Item 3: Cloak Vault -->
              <div style="background:#0a0a0a;border:1px solid #262626;border-radius:10px;padding:14px 16px;">
                <div style="font-size:14px;font-weight:800;color:#ffffff;text-transform:uppercase;">
                  Cloak Vault
                </div>
                <div style="font-size:12px;color:#a3a3a3;margin-top:4px;">
                  In-memory temporary file lockers that self-destruct immediately after single download or timer expiration.
                </div>
              </div>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td align="center" style="padding:0 32px 30px 32px;">
              <a href="https://burn-1.com/store.html#true-burner-suite" style="display:inline-block;background:#ffffff;color:#000000;text-decoration:none;font-weight:900;font-size:13px;letter-spacing:1px;text-transform:uppercase;padding:14px 32px;border-radius:10px;box-shadow:0 0 20px rgba(255,255,255,0.2);">
                VIEW PROTOCOL IN STORE &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#0d0d0d;border-top:1px solid #1f1f1f;text-align:center;font-size:11px;color:#737373;">
              <div>Burn-1 Systems &bull; Concept DBA Est. 2026 &bull; All Rights Reserved</div>
              <div style="margin-top:4px;">Zero Advertising Trackers &bull; PGP-Signed Build Registry &bull; Encrypted Telemetry</div>
              <div style="margin-top:6px;color:#525252;">If you received this in error, disregard. Zero persistent tracking records are retained.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    return subject, plain_text, html_content


def send_email(recipient, product_focus="True Burner Line", dry_run=False):
    subject, plain_text, html_content = build_welcome_email(recipient, product_focus)
    
    # Check SMTP configuration
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_port = int(os.environ.get("SMTP_PORT", 587))
    smtp_user = os.environ.get("SMTP_USER")
    smtp_pass = os.environ.get("SMTP_PASSWORD")
    from_email = os.environ.get("FROM_EMAIL", "True Burner <noreply@burn-1.com>")

    if dry_run or not (smtp_host and smtp_user and smtp_pass):
        print(f"\n=======================================================")
        print(f" [DRY-RUN / PREVIEW MODE] True Burner Welcome Dispatch")
        print(f"=======================================================")
        print(f" To:       {recipient}")
        print(f" Subject:  {subject}")
        print(f" Focus:    {product_focus}")
        print(f" Status:   SMTP not configured or --dry-run specified.")
        print(f"-------------------------------------------------------")
        print(plain_text)
        print(f"-------------------------------------------------------")
        
        # Save HTML preview
        preview_path = os.path.join(os.path.dirname(__file__), "welcome_email_preview.html")
        try:
            with open(preview_path, "w", encoding="utf-8") as fp:
                fp.write(html_content)
            print(f"[OK] HTML Preview written to: {preview_path}")
        except Exception as e:
            print(f"[!] Note: Could not write preview file: {e}")
            
        print(f"=======================================================\n")
        return True

    # Real SMTP Delivery
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = from_email
        msg["To"] = recipient

        part1 = MIMEText(plain_text, "plain", "utf-8")
        part2 = MIMEText(html_content, "html", "utf-8")
        msg.attach(part1)
        msg.attach(part2)

        print(f"[*] Connecting to SMTP server {smtp_host}:{smtp_port}...")
        server = smtplib.SMTP(smtp_host, smtp_port, timeout=15)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(from_email, [recipient], msg.as_string())
        server.quit()
        print(f"[OK] True Burner Welcome email successfully dispatched to {recipient}!")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send email via SMTP: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Send True Burner Welcome & Suite Preview Email")
    parser.add_argument("recipient", nargs="?", default="tester@domain.com", help="Recipient email address")
    parser.add_argument("--focus", default="Ghost Browser & True Burner Suite", help="Product focus/wishlist item")
    parser.add_argument("--dry-run", action="store_true", help="Generate preview without connecting to SMTP")
    args = parser.parse_args()

    send_email(args.recipient, args.focus, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
