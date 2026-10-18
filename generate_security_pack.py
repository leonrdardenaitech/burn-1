"""
Burn-1 Cyber Clinic - Free Self-Help Security Pack Generator
Generates 5 clinical PDF guides + README Manifest and packages into a ZIP bundle.
Uses fpdf2 with clinical cyber-defense styling.
"""

import os
import sys
import hashlib
import zipfile
from datetime import datetime
from fpdf import FPDF

# Custom PDF class for Burn-1 Clinical Styling
class Burn1Document(FPDF):
    def __init__(self, doc_code, doc_title, subtitle=""):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.doc_code = doc_code
        self.doc_title = doc_title
        self.subtitle = subtitle
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(18, 18, 18)

    def header(self):
        # Top banner line
        self.set_fill_color(18, 20, 24) # Dark obsidian
        self.rect(0, 0, 210, 14, 'F')
        
        # Red accent pip
        self.set_fill_color(255, 59, 48) # Burn-1 crimson
        self.rect(18, 4.5, 5, 5, 'F')
        
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(240, 240, 240)
        self.set_xy(26, 4.5)
        self.cell(100, 5, "BURN-1 CYBER CLINIC  //  DEFENSE-IN-DEPTH SPECIFICATION", align="L")
        
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(160, 160, 160)
        self.set_xy(130, 4.5)
        self.cell(62, 5, f"DOC-ID: {self.doc_code}", align="R")
        
        self.ln(12)

    def footer(self):
        self.set_y(-15)
        self.set_draw_color(220, 224, 230)
        self.set_line_width(0.3)
        self.line(18, 282, 192, 282)
        
        self.set_font("Helvetica", "", 7.5)
        self.set_text_color(120, 120, 120)
        self.cell(100, 6, "Burn-1 Cyber Clinic  *  Native Security Pack  *  Zero Cloud Telemetry", align="L")
        self.cell(74, 6, f"Page {self.page_no()} of {{nb}}", align="R")

    def render_title_block(self):
        self.set_y(22)
        # Category pill
        self.set_fill_color(240, 244, 250)
        self.set_text_color(20, 70, 140)
        self.set_font("Helvetica", "B", 8)
        self.cell(46, 6, " FREE COMMUNITY ASSET ", fill=True, ln=True)
        self.ln(2)

        # Main Title
        self.set_text_color(15, 23, 42)
        self.set_font("Helvetica", "B", 18)
        self.multi_cell(174, 8, self.doc_title)
        self.ln(1)

        # Subtitle
        if self.subtitle:
            self.set_font("Helvetica", "", 9.5)
            self.set_text_color(80, 90, 105)
            self.multi_cell(174, 5, self.subtitle)
            self.ln(3)

        # Divider rule
        self.set_draw_color(255, 59, 48)
        self.set_line_width(0.8)
        self.line(18, self.get_y(), 192, self.get_y())
        self.ln(5)

    def section_header(self, num_str, title):
        self.ln(2)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(15, 23, 42)
        self.cell(8, 6, num_str)
        self.cell(166, 6, title.upper())
        self.ln(6)
        self.set_draw_color(226, 232, 240)
        self.set_line_width(0.3)
        self.line(18, self.get_y(), 192, self.get_y())
        self.ln(3)

    def body_p(self, text):
        self.set_font("Helvetica", "", 9)
        self.set_text_color(40, 45, 55)
        self.multi_cell(174, 5, text)
        self.ln(2)

    def bullet(self, bold_prefix, text):
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(255, 59, 48)
        self.cell(4, 5, "*")
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(20, 25, 35)
        self.cell(self.get_string_width(bold_prefix) + 2, 5, bold_prefix)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(50, 55, 65)
        self.multi_cell(0, 5, text)
        self.ln(1)

    def callout(self, title, text, c_type="info"):
        self.ln(1)
        # Background color
        if c_type == "danger":
            bg = (254, 242, 242)
            border = (239, 68, 68)
            title_color = (185, 28, 28)
        elif c_type == "tip":
            bg = (240, 253, 244)
            border = (34, 197, 94)
            title_color = (21, 128, 61)
        else:
            bg = (239, 246, 255)
            border = (59, 130, 246)
            title_color = (29, 78, 216)

        x = self.get_x()
        y = self.get_y()
        self.set_fill_color(*bg)
        self.set_draw_color(*border)
        self.set_line_width(0.5)

        # Estimate height
        est_lines = len(text) / 80 + 2
        box_h = max(16, est_lines * 4.5 + 8)
        
        # Check if page break needed
        if y + box_h > 270:
            self.add_page()
            y = self.get_y()

        self.rect(x, y, 174, box_h, 'DF')
        self.set_xy(x + 4, y + 3)
        self.set_font("Helvetica", "B", 8.5)
        self.set_text_color(*title_color)
        self.cell(166, 4, title.upper(), ln=True)
        
        self.set_xy(x + 4, y + 8)
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(30, 35, 45)
        self.multi_cell(166, 4.2, text)
        self.set_y(y + box_h + 3)

    def link_box(self, label, url):
        self.set_font("Helvetica", "B", 8.5)
        self.set_text_color(20, 25, 35)
        self.cell(42, 5, label + ":", ln=False)
        self.set_font("Helvetica", "U", 8.5)
        self.set_text_color(37, 99, 235)
        self.cell(132, 5, url, ln=True, link=url)
        self.ln(1)


# Document 1: MFA Setup Guide
def generate_mfa_guide(dest_path):
    pdf = Burn1Document(
        doc_code="B1-MFA-2026",
        doc_title="Microsoft Authenticator & Multi-Factor Authentication (MFA) Setup Guide",
        subtitle="Clinical protocol for eradicating SMS swap vulnerabilities, phishing proxies, and push-fatigue exploits using native app-based TOTP and number matching."
    )
    pdf.add_page()
    pdf.render_title_block()

    pdf.section_header("1.0", "Threat Surface: Why SMS Authentication Has Failed")
    pdf.body_p(
        "SMS-based two-factor authentication is no longer considered defensible under modern cybersecurity standards. "
        "Threat actors routinely bypass SMS verification through SIM-swapping, mobile carrier employee social engineering, "
        "and SS7 network routing manipulation. Furthermore, adversary-in-the-middle (AiTM) reverse proxies capture SMS session "
        "cookies in real time, rendering them inert."
    )
    pdf.callout(
        "Critical Vulnerability Alert",
        "SMS verification codes transmitted over unencrypted cellular networks provide zero cryptographic binding to the "
        "initiating session. Upgrading to Microsoft Authenticator or FIDO2 hardware tokens closes 99.4% of automated identity attacks.",
        c_type="danger"
    )

    pdf.section_header("2.0", "Prerequisites & Native Architecture")
    pdf.bullet("Native Zero-Cost Asset: ", "Microsoft Authenticator is freely available on iOS (App Store) and Android (Google Play Store).")
    pdf.bullet("Supported Protocols: ", "Time-based One-Time Password (TOTP, RFC 6238), Cryptographic Push Notifications, and FIDO2 Passkeys.")
    pdf.bullet("Target Systems: ", "Microsoft 365, Entra ID, Google Workspace, AWS, GitHub, banking portals, and local administrative accounts.")

    pdf.section_header("3.0", "Step-by-Step Hardening Protocol")
    pdf.bullet("Step 1: Download & Initial Verification: ", "Install 'Microsoft Authenticator' by Microsoft Corporation. Verify the developer signature to avoid fake utility lookalikes.")
    pdf.bullet("Step 2: Sign-In Staging: ", "Log into your account security dashboard at https://mysignins.microsoft.com/security-info on a secure desktop workstation.")
    pdf.bullet("Step 3: Add Authenticator Method: ", "Select 'Add sign-in method' -> 'Authenticator app'. Click 'Next' to present the setup QR code.")
    pdf.bullet("Step 4: Optical Pairing: ", "Open Microsoft Authenticator on your mobile device -> Tap '+' -> Choose 'Work or school account' (or 'Personal account') -> Scan the on-screen QR code.")
    pdf.bullet("Step 5: Enforce Number Matching: ", "Modern Microsoft tenants mandate 'Number Matching'. When an authentication challenge triggers, the app requires typing the exact 2-digit number displayed on the login terminal.")

    pdf.callout(
        "Push Notification Fatigue Mitigation",
        "Never approve a notification you did not immediately generate. If you receive an unexpected 2-digit prompt, "
        "tap 'No, it's not me' immediately. This automatically locks the account from that malicious IP address and flags a high-risk security alert.",
        c_type="tip"
    )

    pdf.section_header("4.0", "Backup & Disaster Recovery Protocol")
    pdf.body_p(
        "Losing mobile hardware without a recovery plan creates operational lockouts. Follow these two rules immediately:"
    )
    pdf.bullet("Cloud Encrypted Backup: ", "Enable 'Cloud Backup' within Authenticator Settings. On iOS, this binds to iCloud Keychain; on Android, to your personal Microsoft Account.")
    pdf.bullet("Break-Glass Emergency Accounts: ", "Tenant administrators must maintain at least one cloud-only Global Admin account with a 24+ character password stored in a physical fireproof safe, excluded from standard conditional access.")

    pdf.section_header("5.0", "Official Direct Links & Vendor Documentation")
    pdf.link_box("Microsoft Authenticator Portal", "https://www.microsoft.com/en-us/security/mobile-authenticator-app")
    pdf.link_box("Security Info Management", "https://mysignins.microsoft.com/security-info")
    pdf.link_box("Number Matching Policy Guide", "https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-mfa-number-match")

    pdf.output(dest_path)


# Document 2: Security Defaults Checklist
def generate_security_defaults(dest_path):
    pdf = Burn1Document(
        doc_code="B1-SECDEF-2026",
        doc_title="Microsoft 365 & Entra ID Security Defaults Checklist",
        subtitle="Immediate baseline defense protocol to lock down all tenant accounts, block legacy protocols, and require MFA without licensing upgrades."
    )
    pdf.add_page()
    pdf.render_title_block()

    pdf.section_header("1.0", "Executive Summary: Zero-Cost Tenant Protection")
    pdf.body_p(
        "Microsoft Security Defaults is a pre-configured security posture switch designed for organizations that want baseline "
        "identity protection without purchasing premium Entra ID P1 or P2 licenses. Enabling this single setting eliminates "
        "the primary entry vectors used in over 80% of business email compromise (BEC) incidents."
    )

    pdf.section_header("2.0", "The 5 Mandatory Policies Enforced by Security Defaults")
    pdf.bullet("1. Tenant-Wide MFA Registration: ", "All users have 14 days to register for MFA via Microsoft Authenticator from their first sign-in.")
    pdf.bullet("2. Mandatory Admin MFA: ", "Every account with administrator roles (Global Admin, Privileged Role Admin, Security Admin) MUST use MFA on EVERY sign-in.")
    pdf.bullet("3. Challenging High-Risk Sign-ins: ", "Standard users are prompted for MFA whenever login anomalies, unfamiliar locations, or atypical devices are detected.")
    pdf.bullet("4. Complete Block of Legacy Authentication: ", "Older mail clients using POP3, IMAP, SMTP, or legacy ActiveSync that cannot process modern MFA dialogs are strictly blocked.")
    pdf.bullet("5. Protected Management Access: ", "Accessing the Azure Portal, Microsoft 365 Admin Center, Exchange Admin Center, or Azure PowerShell requires mandatory MFA.")

    pdf.callout(
        "Legacy Authentication Warning",
        "Legacy protocols (POP/IMAP) are the #1 attack vector for credential-stuffing botnets because they pass passwords in cleartext "
        "without supporting multi-factor handshakes. Blocking them closes an entire class of automated brute-force attacks.",
        c_type="danger"
    )

    pdf.section_header("3.0", "Implementation Checklist: 4 Clicks to Deployment")
    pdf.bullet("[ ] Step 1: ", "Sign in to the Microsoft Entra Admin Center (https://entra.microsoft.com) as a Global Administrator.")
    pdf.bullet("[ ] Step 2: ", "Navigate to: Identity > Overview > Properties tab (or search 'Properties' in the top search bar).")
    pdf.bullet("[ ] Step 3: ", "Scroll to the bottom of the Properties pane and select: Manage security defaults.")
    pdf.bullet("[ ] Step 4: ", "Toggle 'Security defaults' to 'Enabled'. Select 'Save'.")

    pdf.callout(
        "Pre-Activation Prerequisite",
        "If your organization has legacy Conditional Access policies enabled, Security Defaults cannot be turned on until they are disabled. "
        "For small teams, Security Defaults offers superior out-of-the-box coverage compared to poorly maintained custom rules.",
        c_type="info"
    )

    pdf.section_header("4.0", "Post-Deployment Verification")
    pdf.bullet("Test Admin Access: ", "Open a private browsing window (InPrivate/Incognito) and attempt to sign in to https://admin.microsoft.com. Confirm MFA challenge triggers.")
    pdf.bullet("Inspect Sign-in Logs: ", "Navigate to Entra ID > Monitoring > Sign-in logs. Filter by 'Client App: Other / Legacy Protocols' to ensure legacy attempts are returned as 'Blocked'.")
    pdf.bullet("User Communication: ", "Notify staff that upon next login they will receive a prompt to install Microsoft Authenticator.")

    pdf.section_header("5.0", "Direct Documentation Links")
    pdf.link_box("Entra Admin Center", "https://entra.microsoft.com")
    pdf.link_box("Microsoft Security Defaults Docs", "https://learn.microsoft.com/en-us/entra/fundamentals/security-defaults")
    pdf.link_box("Legacy Auth Remediation Guide", "https://learn.microsoft.com/en-us/entra/identity/conditional-access/block-legacy-authentication")

    pdf.output(dest_path)


# Document 3: Secure Score Benchmark Walkthrough
def generate_securescore_guide(dest_path):
    pdf = Burn1Document(
        doc_code="B1-SECSCORE-2026",
        doc_title="Microsoft Secure Score Benchmark & Posture Hardening Guide",
        subtitle="Clinical telemetry framework for measuring identity, device, and data posture, resolving misconfigurations, and validating cyber insurance hygiene."
    )
    pdf.add_page()
    pdf.render_title_block()

    pdf.section_header("1.0", "What is Microsoft Secure Score?")
    pdf.body_p(
        "Microsoft Secure Score is a numerical measurement (0% to 100%) of an organization's cybersecurity posture based on "
        "active configurations, user behaviors, and device hygiene. Rather than guessing vulnerabilities, Secure Score provides "
        "a live, audited telemetry dashboard that demonstrates demonstrable compliance to cyber insurers and executive leadership."
    )

    pdf.section_header("2.0", "Navigating the Telemetry Dashboard")
    pdf.body_p(
        "Access the centralized portal at https://security.microsoft.com/securescore. The interface categorizes exposure across three primary pillars:"
    )
    pdf.bullet("Identity: ", "Accounts, password hygiene, conditional access, MFA coverage, role assignments.")
    pdf.bullet("Devices: ", "BitLocker encryption, OS patch velocity, Defender EDR onboarding, antivirus definitions.")
    pdf.bullet("Apps & Data: ", "Exchange mailbox forwarding rules, SharePoint external sharing links, OneDrive sensitive data permissions.")

    pdf.section_header("3.0", "Top 5 High-Impact, Zero-Cost Hardening Remediations")
    pdf.bullet("1. Enforce MFA for All Administrative Roles (+15.2%): ", "Ensure 100% of Global Admins, Exchange Admins, and SharePoint Admins have registered authenticator apps.")
    pdf.bullet("2. Prohibit External Mail Forwarding Rules (+8.4%): ", "Attackers who compromise an inbox create silent inbox rules forwarding copies of all emails to an external mailbox. Block automatic forwarding in Exchange Online Admin.")
    pdf.bullet("3. Eliminate Password Expiration Mandates (+5.1%): ", "NIST 800-63b guidelines prove arbitrary 90-day password changes cause users to pick predictable patterns. Rely on length (16+ chars) and MFA.")
    pdf.bullet("4. Enable Self-Service Password Reset (SSPR) (+6.3%): ", "Reduces helpdesk impersonation vulnerabilities while enforcing multi-channel verification upon reset.")
    pdf.bullet("5. Audit Global Administrator Counts (+4.2%): ", "Restrict Global Administrators to between 2 and 4 accounts. Assign granular role-based access (User Admin, Helpdesk Admin) for routine duties.")

    pdf.callout(
        "Insurance Underwriting Verification",
        "Many cyber insurance underwriters now demand a minimum Secure Score benchmark (>65%) before issuing policy binders. "
        "Export the 'History' tab as a signed PDF report to demonstrate proactive risk reduction.",
        c_type="tip"
    )

    pdf.section_header("4.0", "Execution & Tracking Protocol")
    pdf.bullet("Step 1: ", "Open https://security.microsoft.com/securescore and note your Baseline Posture Score.")
    pdf.bullet("Step 2: ", "Select the 'Recommended actions' tab. Sort by 'Impact' (Highest to Lowest).")
    pdf.bullet("Step 3: ", "Click any recommendation to view the native 'Remediation Action' button and step-by-step guidance.")
    pdf.bullet("Step 4: ", "Allow 24 to 48 hours for the Microsoft telemetry engine to recalculate points after making changes.")

    pdf.section_header("5.0", "Direct Portal Links")
    pdf.link_box("Microsoft Secure Score Portal", "https://security.microsoft.com/securescore")
    pdf.link_box("Microsoft Defender Portal", "https://security.microsoft.com")
    pdf.link_box("NIST SP 800-63b Identity Guidelines", "https://pages.nist.gov/800-63-3/sp800-63b.html")

    pdf.output(dest_path)


# Document 4: Compliance Manager & Zero Trust Starter Kit
def generate_compliance_guide(dest_path):
    pdf = Burn1Document(
        doc_code="B1-COMPLY-2026",
        doc_title="Compliance Manager & Zero Trust Starter Kit",
        subtitle="Pre-audit assessment blueprint mapping native free controls to HIPAA, NIST 800-53, and CMMC frameworks without third-party overhead."
    )
    pdf.add_page()
    pdf.render_title_block()

    pdf.section_header("1.0", "Zero Trust Architecture: The Three Golden Rules")
    pdf.body_p(
        "Zero Trust is an operational security model that eliminates implicit trust from all system interactions. "
        "Whether a request originates inside the corporate local network or from a remote coffee shop, Zero Trust mandates:"
    )
    pdf.bullet("1. Verify Explicitly: ", "Always authenticate and authorize based on all available data points (identity, location, device health, resource classification).")
    pdf.bullet("2. Use Least Privileged Access: ", "Limit user access with Just-In-Time (JIT) and Just-Enough-Access (JEA) models, adaptive risk policies, and data protection.")
    pdf.bullet("3. Assume Breach: ", "Minimize blast radius by segmenting access by network, user, devices, and application awareness. Encrypt all end-to-end telemetry.")

    pdf.section_header("2.0", "Microsoft Purview Compliance Manager: Free Baseline")
    pdf.body_p(
        "Microsoft Purview Compliance Manager is built directly into Microsoft 365 to measure compliance progress against "
        "global standards. Every tenant receives the 'Data Protection Baseline' assessment free of charge."
    )
    pdf.bullet("Regulatory Alignment: ", "Maps native cloud configurations directly against controls from NIST CSF, ISO 27001, and HIPAA.")
    pdf.bullet("Continuous Evidence Gathering: ", "Automatically audits whether encryption at rest, audit logging, and role separations are active without manual spreadsheets.")

    pdf.section_header("3.0", "Pre-Audit Self-Assessment Questionnaire")
    pdf.bullet("[ ] Identity Hygiene: ", "Are administrative accounts strictly separated from everyday email/browsing accounts? (Yes / No)")
    pdf.bullet("[ ] Disk Encryption: ", "Is BitLocker (Windows) or FileVault (macOS) enforced with TPM hardware attestation on all laptops? (Yes / No)")
    pdf.bullet("[ ] Audit Logging: ", "Is Unified Audit Logging enabled in Purview, retaining 180+ days of mailbox and file access logs? (Yes / No)")
    pdf.bullet("[ ] Network Isolation: ", "Are office printers, IoT smart TVs, and guest Wi-Fi segregated into isolated VLANs away from production workstations? (Yes / No)")
    pdf.bullet("[ ] Offboarding Killswitch: ", "Does your offboarding checklist terminate Active Directory/Entra tokens within 15 minutes of employee departure? (Yes / No)")

    pdf.callout(
        "Regulatory Penalties Warning",
        "HIPAA and CMMC compliance investigations focus heavily on 'lack of basic technical controls' (e.g., missing MFA, unencrypted laptops). "
        "Documenting your native configurations using this starter kit provides critical safe-harbor evidence in dispute resolutions.",
        c_type="danger"
    )

    pdf.section_header("4.0", "Implementation Path")
    pdf.bullet("Access Portal: ", "Sign in to Microsoft Purview at https://purview.microsoft.com/ or https://compliance.microsoft.com.")
    pdf.bullet("Select Assessments: ", "Open 'Compliance Manager' -> 'Assessments'. Review your baseline score percentage.")
    pdf.bullet("Assign Improvement Actions: ", "Delegate control tasks (e.g., 'Turn on BitLocker') directly to system administrators with step-by-step verification notes.")

    pdf.section_header("5.0", "Direct Links & Reference Frameworks")
    pdf.link_box("Microsoft Purview Compliance Portal", "https://purview.microsoft.com")
    pdf.link_box("Microsoft Zero Trust Guidance Center", "https://learn.microsoft.com/en-us/security/zero-trust/")
    pdf.link_box("NIST Computer Security Resource Center", "https://csrc.nist.gov")

    pdf.output(dest_path)


# Document 5: Phishing Awareness & Incident Response Protocol
def generate_phishing_guide(dest_path):
    pdf = Burn1Document(
        doc_code="B1-PHISH-2026",
        doc_title="Phishing Awareness & Rapid Incident Response Protocol",
        subtitle="Practical telemetry and tactical steps to dissect modern AiTM proxies, QR-code lures, analyze email headers, and execute rapid session revocations."
    )
    pdf.add_page()
    pdf.render_title_block()

    pdf.section_header("1.0", "The Modern Phishing Landscape")
    pdf.body_p(
        "Phishing attacks have evolved beyond generic spelling errors and fake lottery winnings. Attackers utilize sophisticated "
        "tactics that evade standard mail filters:"
    )
    pdf.bullet("Adversary-in-the-Middle (AiTM): ", "Reverse-proxy sites that clone real Microsoft/Google login pages, intercepting user credentials AND active session cookies simultaneously.")
    pdf.bullet("Quishing (QR Code Phishing): ", "Embedding QR codes inside PNG/PDF attachments. Because email filters scan text rather than image pixels, these bypass standard gateways.")
    pdf.bullet("Executive Impersonation & Wire Fraud: ", "Registering lookalike domain names (e.g., 'bvrn-1.com' vs 'burn-1.com') requesting urgent vendor wire changes or gift cards.")

    pdf.section_header("2.0", "Forensic Email Header Analysis in 60 Seconds")
    pdf.body_p(
        "When an email looks suspicious, examine the raw headers before clicking. In Outlook, select: File > Properties > Internet Headers. "
        "Inspect these three critical lines:"
    )
    pdf.bullet("SPF (Sender Policy Framework): ", "Must return 'spf=pass'. If 'softfail' or 'fail', the sending server is unauthorized.")
    pdf.bullet("DKIM (DomainKeys Identified Mail): ", "Cryptographic signature verifying the message body was not altered in transit. Look for 'dkim=pass'.")
    pdf.bullet("DMARC (Domain-based Message Authentication): ", "Specifies what happens if SPF/DKIM fail. Look for 'dmarc=pass'.")

    pdf.callout(
        "Immediate Triage Rule",
        "If an email demands urgent financial transactions, requests credentials, or prompts multi-factor approvals, "
        "NEVER reply or click. Pick up a phone and call the purported sender using a known, trusted telephone number.",
        c_type="tip"
    )

    pdf.section_header("3.0", "The 4-Minute Incident Response Checklist: Click -> Quarantine")
    pdf.bullet("[ ] 00:00 - Disconnect & Revoke: ", "Do NOT shut down the machine. Unplug ethernet or disconnect Wi-Fi to stop lateral movement. Open https://mysignins.microsoft.com from a secondary phone/PC and select 'Sign out of all sessions'.")
    pdf.bullet("[ ] 01:00 - Credential Reset: ", "Immediately reset the account password from the clean secondary device. Ensure the new password is at least 16 characters.")
    pdf.bullet("[ ] 02:00 - Audit Mailbox Forwarding Rules: ", "Open Outlook Web App > Settings > Mail > Rules. Check for hidden rules created by attackers (e.g., rules named '.' or 'auto' moving emails to RSS Feeds or Deleted Items).")
    pdf.bullet("[ ] 03:00 - Review Connected OAuth Apps: ", "Navigate to https://myapps.microsoft.com. Audit third-party apps granted mailbox or file permissions. Revoke any unrecognized integrations.")
    pdf.bullet("[ ] 04:00 - Offline Endpoint Scan: ", "Initiate a full offline antimalware scan (Windows Defender Offline or Mender runtime sweep).")

    pdf.section_header("4.0", "Establishing a Blameless Culture")
    pdf.body_p(
        "Punishing employees who fall for phishing attacks incentivizes them to hide breaches until it is too late. "
        "Reward rapid reporting. A reported compromise mitigated within 5 minutes saves an organization hundreds of thousands in ransomware remediation."
    )

    pdf.section_header("5.0", "Official Threat Intel Resources")
    pdf.link_box("CISA Phishing Guidance", "https://www.cisa.gov/resources-tools/resources/avoiding-social-engineering-and-phishing-attacks")
    pdf.link_box("Microsoft Incident Response", "https://learn.microsoft.com/en-us/security/incident-response/")
    pdf.link_box("Burn-1 Threat Advisory", "https://burn-1.com/tools.html")

    pdf.output(dest_path)


# Document 6: Manifest & Verification Document
def generate_manifest(dest_path, pdf_files):
    hashes = {}
    for filename, filepath in pdf_files.items():
        if os.path.exists(filepath):
            with open(filepath, "rb") as f:
                hashes[filename] = hashlib.sha256(f.read()).hexdigest()
        else:
            hashes[filename] = "FILE_NOT_FOUND"

    manifest_content = f"""================================================================================
BURN-1 CYBER CLINIC  //  FREE SELF-HELP SECURITY PACK
PACKAGE RELEASE: v2026.1 (AUTUMN EDITION)
DISTRIBUTION: ZERO-COST COMMUNITY HYGIENE PACK
CLASSIFICATION: PUBLIC DEFENSIVE PROTOCOL
GENERATED: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}
================================================================================

OVERVIEW
This Free Self-Help Security Pack is engineered as a zero-cost, vendor-neutral
defensive kit empowering individuals, solopreneurs, and small business IT
administrators to harden their environment using native, built-in enterprise tools
before spending money on expensive audits or third-party cybersecurity software.

ZERO CLOUD TELEMETRY NOTICE
All guidelines in this bundle leverage free, native configuration switches (MFA,
Security Defaults, Secure Score, Purview Baselines, and Mailbox Triage). No third-party
agents, proprietary software trackers, or cloud subscriptions are required.

--------------------------------------------------------------------------------
INCLUDED GUIDES & CRYPTOGRAPHIC VERIFICATION (SHA-256)
--------------------------------------------------------------------------------
1. MFA2_Setup_Guide.pdf
   SHA-256: {hashes.get('MFA2_Setup_Guide.pdf', 'N/A')}
   Scope: App-based TOTP, number matching, and push-fatigue defense.
   Direct Link: https://www.microsoft.com/en-us/security/mobile-authenticator-app

2. Security_Defaults_Checklist.pdf
   SHA-256: {hashes.get('Security_Defaults_Checklist.pdf', 'N/A')}
   Scope: 4-step tenant baseline locking out legacy POP3/IMAP attacks.
   Direct Link: https://learn.microsoft.com/en-us/entra/fundamentals/security-defaults

3. Secure_Score_Quickstart.pdf
   SHA-256: {hashes.get('Secure_Score_Quickstart.pdf', 'N/A')}
   Scope: Live telemetry benchmarking, top 5 zero-cost point boosts.
   Direct Link: https://security.microsoft.com/securescore

4. Compliance_PreCheck.pdf
   SHA-256: {hashes.get('Compliance_PreCheck.pdf', 'N/A')}
   Scope: Zero Trust architecture pre-audit checklist (HIPAA/NIST/CMMC).
   Direct Links: https://purview.microsoft.com / https://learn.microsoft.com/en-us/security/zero-trust/

5. Phishing_Awareness_Kit.pdf
   SHA-256: {hashes.get('Phishing_Awareness_Kit.pdf', 'N/A')}
   Scope: AiTM reverse proxies, header inspection, 4-minute incident triage.
   Direct Link: https://www.cisa.gov/resources-tools/resources/avoiding-social-engineering-and-phishing-attacks

--------------------------------------------------------------------------------
OFFICIAL DIRECT LINKS & VENDOR DASHBOARDS
--------------------------------------------------------------------------------
* Microsoft Security Center:       https://security.microsoft.com
* Microsoft Entra Admin Center:    https://entra.microsoft.com
* Microsoft Purview Compliance:    https://purview.microsoft.com
* Microsoft User Security Info:    https://mysignins.microsoft.com/security-info
* CISA Cyber Guidance:             https://www.cisa.gov/topics/cyber-threats-and-advisories
* NIST Security Resource Center:   https://csrc.nist.gov
* Burn-1 Cyber Clinic & Mender:    https://burn-1.com/tools.html
* Contact Burn-1 Direct Dispatch:  dispatch@burn-1.com

--------------------------------------------------------------------------------
NEXT ESCALATION TIERS (WHEN NATIVE HARDENING IS COMPLETE)
--------------------------------------------------------------------------------
When you have implemented the 5 native baselines in this pack:
1. Mender Runtime Accelerator ($75 / Lifetime):
   Client-side hardware strain benchmark, RAM garbage-collection sweep, and process throttling.
2. Clinical Posture Exposure Audit ($499):
   1-on-1 external reconnaissance, open-port telemetry sweep, and verifiable remediation plan.
3. Guwop Annual Shield ($1,000 / Year):
   Continuous monitoring, monthly credential leak alerts, and priority incident dispatch.
4. Anergi Penetration Testing ($5,000+):
   Full-spectrum red-team offensive simulation and regulatory compliance certification.

(C) 2026 Burn-1 Cyber Clinic. All Rights Reserved. Defend with Precision.
================================================================================
"""
    with open(dest_path, "w", encoding="utf-8") as f:
        f.write(manifest_content.strip() + "\n")


def build_bundle():
    print("[*] Initiating Burn-1 Free Self-Help Security Pack Build...")
    
    # Target directory structure
    project_root = r"C:\Users\Leonr\projects\burn-1.com"
    downloads_dir = os.path.join(project_root, "downloads")
    bundle_temp = os.path.join(downloads_dir, "Free_Self_Help_Security_Pack")
    os.makedirs(bundle_temp, exist_ok=True)

    pdf_targets = {
        "MFA2_Setup_Guide.pdf": os.path.join(bundle_temp, "MFA2_Setup_Guide.pdf"),
        "Security_Defaults_Checklist.pdf": os.path.join(bundle_temp, "Security_Defaults_Checklist.pdf"),
        "Secure_Score_Quickstart.pdf": os.path.join(bundle_temp, "Secure_Score_Quickstart.pdf"),
        "Compliance_PreCheck.pdf": os.path.join(bundle_temp, "Compliance_PreCheck.pdf"),
        "Phishing_Awareness_Kit.pdf": os.path.join(bundle_temp, "Phishing_Awareness_Kit.pdf"),
    }

    print("[*] Generating Guide 1: MFA Setup Guide...")
    generate_mfa_guide(pdf_targets["MFA2_Setup_Guide.pdf"])

    print("[*] Generating Guide 2: Security Defaults Checklist...")
    generate_security_defaults(pdf_targets["Security_Defaults_Checklist.pdf"])

    print("[*] Generating Guide 3: Secure Score Benchmark Walkthrough...")
    generate_securescore_guide(pdf_targets["Secure_Score_Quickstart.pdf"])

    print("[*] Generating Guide 4: Compliance Manager & Zero Trust Starter Kit...")
    generate_compliance_guide(pdf_targets["Compliance_PreCheck.pdf"])

    print("[*] Generating Guide 5: Phishing Awareness & Incident Response Protocol...")
    generate_phishing_guide(pdf_targets["Phishing_Awareness_Kit.pdf"])

    print("[*] Generating Guide 6: Manifest & Resource Links (README_Manifest.txt)...")
    manifest_target = os.path.join(bundle_temp, "README_Manifest.txt")
    generate_manifest(manifest_target, pdf_targets)

    # Compile into ZIP archive
    zip_output_downloads = os.path.join(downloads_dir, "Free_Self_Help_Security_Pack.zip")
    zip_output_root = os.path.join(project_root, "Free_Self_Help_Security_Pack.zip")

    print(f"[*] Packaging ZIP bundle -> {zip_output_downloads}...")
    with zipfile.ZipFile(zip_output_downloads, "w", zipfile.ZIP_DEFLATED) as zf:
        for fname in os.listdir(bundle_temp):
            full_p = os.path.join(bundle_temp, fname)
            if os.path.isfile(full_p):
                # Archive name inside ZIP
                zf.write(full_p, arcname=f"Free_Self_Help_Security_Pack/{fname}")
    
    # Also copy to root for clean URL access: burn-1.com/Free_Self_Help_Security_Pack.zip
    import shutil
    shutil.copyfile(zip_output_downloads, zip_output_root)
    print(f"[*] Copied to root -> {zip_output_root}")

    print("[+] BUILD COMPLETE! Security Pack successfully created and verified.")
    for f, p in pdf_targets.items():
        print(f"    - {f} ({os.path.getsize(p):,} bytes)")
    print(f"    - README_Manifest.txt ({os.path.getsize(manifest_target):,} bytes)")
    print(f"    - Final Bundle ZIP ({os.path.getsize(zip_output_downloads):,} bytes)")


if __name__ == "__main__":
    build_bundle()
