---
document_id: "MOD-007-MFA"
title: "Zero-Cost MFA & Identity Hardening Setup Guide Database"
version: "2026.1"
schema_version: "1.0"
date_created: "2026-10-11"
target_audience: "IT Admins, MSPs, CISOs, Compliance Officers"
applicable_idps:
  - "Microsoft Entra ID (Azure AD)"
  - "Google Workspace"
  - "Cisco Duo Security (Free Tier)"
  - "FIDO2 / Passkeys / WebAuthn"
framework_mappings:
  NIST_CSF_2_0: ["PR.AA-01", "PR.AA-02", "PR.AA-03"]
  NIST_SP_800_63B: ["AAL2", "AAL3"]
  PCI_DSS_v4_0: ["Req 8.3.1", "Req 8.3.6"]
  NYDFS_23_NYCRR_500: ["500.12"]
  CMMC_2_0: ["IA.L2-3.5.3"]
---

# Zero-Cost MFA & Identity Hardening Setup Guide Database

## 1. Executive Overview: Bridging the Implementation Gap

Most clients already pay for Microsoft 365, Google Workspace, or modern operating systems that include **phishing-resistant MFA capabilities at $0 additional license cost**. However, over 80% of organizations remain non-compliant because they do not know:
1. **Which exact settings to configure** to satisfy cyber insurance underwriters and regulatory frameworks.
2. **How to disable legacy protocols** (IMAP, POP3, Basic Auth) that bypass MFA.
3. **How to export time-stamped proof logs** for audit binders.

This database provides step-by-step administrative configuration guides, PowerShell/API commands, and user onboarding templates that transform free native tools into a luxury, audit-ready managed service.

---

## 2. Microsoft Entra ID (Azure AD) - Zero-Cost Hardening

### 2.1 Free Tier: Enabling Security Defaults ($0 M365 Licenses)
* **Target Audience**: SMBs without Entra ID P1/P2 licenses.
* **Underwriter Impact**: Satisfies baseline MFA requirement for 100% of users and admins.
* **Step-by-Step Setup**:
  1. Log into **Microsoft Entra Admin Center** as Global Admin.
  2. Navigate to **Identity** > **Overview** > **Properties**.
  3. Select **Manage security defaults** at the bottom of the page.
  4. Toggle **Security defaults** to **Enabled**.
  5. Click **Save**.
* **What Security Defaults Enforces Automatically**:
  * Mandatory MFA registration for all users within 14 days of creation.
  * Mandatory MFA for Global/Domain/Privileged Admin roles on every sign-in.
  * Blocks legacy authentication protocols (IMAP, POP3, SMTP AUTH).
  * Requires MFA when risky sign-in behavior is detected.

### 2.2 Entra ID P1/P2: Conditional Access & Phishing-Resistant MFA
* **Target Audience**: Mid-Market & Enterprise with M365 Business Premium / E3 / E5.
* **Step-by-Step Setup**:
  1. **Block Legacy Auth**:
     * Go to **Protection** > **Conditional Access** > **New policy**.
     * Name: `[CA-01] Block Legacy Authentication`.
     * Users: **All users** (Exclude 1 Break-Glass Emergency Admin).
     * Target Resources: **All cloud apps**.
     * Conditions: **Client apps** > Select **Exchange ActiveSync clients** and **Other clients** (IMAP/POP3).
     * Access Controls: **Block access**.
  2. **Require Phishing-Resistant MFA for Admins (FIDO2 / Passkeys)**:
     * New policy: `[CA-02] Require FIDO2 Passkeys for Privileged Admins`.
     * Users: Select Directory Roles (Global Admin, Privileged Role Admin, Exchange Admin, Billing Admin).
     * Grant: **Require authentication strength** > Select **Phishing-resistant MFA** (FIDO2 security keys, Windows Hello for Business).

### 2.3 Proof Export Protocol (Audit Evidence)
```powershell
# Export All Conditional Access Policies to JSON for Evidence Binder
Connect-MgGraph -Scopes "Policy.Read.All"
Get-MgIdentityConditionalAccessPolicy | ConvertTo-Json -Depth 5 | Out-File -FilePath "/drive/slm_library/cyber_insurance_binder/01_Identity_MFA/Entra_CA_Policies_Export.json"
```

---

## 3. Google Workspace - Zero-Cost Identity Hardening

### 3.1 Step-by-Step 2-Step Verification (2SV) Enforcement
1. Log into **Google Admin Console**.
2. Navigate to **Security** > **Authentication** > **2-step verification**.
3. Select Organizational Unit (OU) (Apply to Root or Sub-OUs).
4. Check **Allow users to turn on 2-Step Verification**.
5. Set **Enforcement** to **ON** and select enforcement start date.
6. Under **Allowed 2SV methods**:
   * Change from *Any* to *Any except verification codes via text/phone call* (blocks SMS interception).
   * Require **Security Key only** (FIDO2/WebAuthn) for high-risk admin OUs.
7. Click **Save**.

### 3.2 Disabling Less Secure Apps & Legacy Protocols
1. Go to **Security** > **Access and data control** > **Less secure apps**.
2. Select **Disable access to less secure apps for all users** (Enforces OAuth 2.0).

---

## 4. Cisco Duo Security (Free Tier up to 10 Users)

### 4.1 Deployment for Administrative Jump Boxes & RDP
1. Register for the Duo free tier (supports up to 10 admin users).
2. Create **Applications** > **Microsoft RDP / Windows Logon**.
3. Download and install `Duo Windows Logon Installer` on domain controllers and admin servers.
4. Input configuration credentials from the admin console.
5. Enable **Fail-Safe Mode: Closed** (blocks logon if API is unreachable).

---

## 5. Hardware-Based FIDO2 Passkeys ($0 Added Hardware)

### 5.1 Platform Authenticator Setup (Windows Hello / Apple TouchID / Passkeys)
* **Windows Hello for Business**:
  * Enable via Group Policy: `Computer Configuration` > `Administrative Templates` > `Windows Components` > `Windows Hello for Business` > **Enabled**.
  * Satisfies NIST SP 800-63B Authenticator Assurance Level 3 (AAL3) and eliminates passwords.
* **Mobile Phone Security Keys**:
  * Users can register iOS (TouchID/FaceID) or Android biometrics as FIDO2 security keys natively in Microsoft Entra and Google Workspace without buying separate hardware keys.

---

## 6. End-User Communication & Onboarding Templates

### 6.1 Employee MFA Enrollment Guidance
* **Action Required**: Enforcing Multi-Factor Authentication (MFA) Guidance.
* **Employee Steps**:
  1. Download the free Microsoft Authenticator or Google Authenticator app on your mobile phone.
  2. Log into your account portal on your computer.
  3. Scan the QR code with your authenticator app.
  4. Save your backup recovery codes in a secure location.
* **Policy Note**: SMS text message codes are prohibited per cybersecurity compliance guidelines.

---

## 7. Audit Checklist & Scorecard Mapping

| MFA Implementation Vector | Free Technical Method | Insurance Underwriter Impact | Audit Status |
| :--- | :--- | :--- | :--- |
| **All Employee Email/Cloud Logins** | Entra Security Defaults / Google 2SV | Eliminates policy exclusion risk | `[PASS / FAIL]` |
| **Privileged Admin Accounts** | FIDO2 Passkeys / Windows Hello | Unlocks 15%-20% premium discount | `[PASS / FAIL]` |
| **Remote Access / RDP** | Duo Free Tier / Entra ZTNA | Prevents unmonitored RDP entry | `[PASS / FAIL]` |
| **Legacy Auth Protocol Blocking** | Conditional Access / Less Secure Apps Disabled | Blocks 99% of automated spray attacks | `[PASS / FAIL]` |
