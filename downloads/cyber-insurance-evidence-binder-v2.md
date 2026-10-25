---
document_id: "MOD-006-INS-v2"
title: "Cyber Insurance Renewal Evidence Binder Template (v2 - Custom Exports & Carrier Mappings)"
version: "2026.2"
schema_version: "2.0"
date_created: "2026-10-11"
target_audience: "CISO, CFO, General Counsel, Director of IT, Risk Managers, MSPs, Systems Administrators"
applicable_underwriters:
  - "Chubb Ltd Group (Chubb Cyber Central)"
  - "Beazley Insurance (Beazley Breach Response)"
  - "Travelers Group / Corvus (CyberRisk Assessment)"
  - "Coalition (Active Risk Assessment)"
  - "At-Bay (Munich Re)"
  - "AXA XL"
  - "Cowbell Cyber (Cowbell Factors)"
framework_mappings:
  NIST_CSF_2.0: ["GOV.RM", "PR.AA", "PR.DS", "DE.CM", "RS.MA", "RC.RP"]
  CIS_Controls_v8.1: ["Control 5", "Control 6", "Control 10", "Control 11", "Control 17"]
  ISO_IEC_27001_2022: ["A.5.15", "A.8.7", "A.8.12", "A.8.13", "A.8.14"]
  NYDFS_23_NYCRR_500: ["500.3", "500.5", "500.11", "500.12", "500.13", "500.17"]
  CMMC_2.0: ["AC.L2-3.1.1", "IA.L2-3.5.3", "CP.L2-3.8.9", "IR.L2-3.6.1"]
  SEC_Reg_S_P: ["Item 1.05", "30-Day Customer Notice"]
---

# Cyber Insurance Renewal Evidence Binder & Underwriting Proof Package (v2)

## Executive Summary & Purpose

In 2026, cyber insurance carriers have transitioned entirely from self-attestation "checkbox" questionnaires to **evidence-based technical underwriting**. Underwriters now require verifiable technical telemetry, exports, CLI configuration proofs, and dated artifact binders before binding coverage, waiving sublimits, or applying premium discounts.

This **Enhanced Evidence Binder Template (v2)** expands on baseline requirements by integrating:
1. **Carrier-Specific Underwriting Questionnaires**: Direct mapping against Chubb, Beazley, Coalition, and Travelers application checklists.
2. **Vendor-Specific Technical Export Logs**: Technical export instructions, PowerShell scripts, and API export targets for Microsoft Entra ID, Okta, Cisco Duo, Veeam, Datto, and AWS S3 Object Lock.
3. **Audit-Ready Evidence Binders**: Step-by-step assembly guides to capture technical telemetry that proves active execution of non-negotiable controls.
4. **Local SLM Ingestion Alignment**: Structured Markdown syntax with YAML metadata designed for direct ingestion into RAG pipelines and local Small Language Model (SLM) training.

---

## SECTION 1: Carrier-Specific Underwriting Questionnaire Scorecard

Different insurance underwriters weigh technical controls differently during risk pricing. The matrix below maps organizational controls directly against major underwriting questionnaires:

### 1.1 Carrier-Specific Control & Evidence Mapping Matrix

| Control Area | Chubb Cyber Central | Beazley Breach Response (BBR) | Coalition Active Risk Assessment | Travelers / Corvus Assessment | Target Discount / Credit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phishing-Resistant MFA** | Mandatory for Email, VPN, Admin & Cloud Apps | Required for 100% remote logins & privileged accounts | Required for O365/Google Workspace & Remote Access | Required for all admin, email, and remote gateways | **15% - 20% Discount** (Removes MFA sublimit) |
| **24/7 EDR / MDR** | Required on >95% Workstations + Servers | Required with 24/7 SOC escalation SLA | Active integration via Coalition Control agent | Required on all critical servers and endpoints | **10% - 15% Discount** (Unlocks full limits) |
| **Immutable Backups** | WORM/Object Lock + Offline/Air-Gapped | Mandatory separate credentials from Active Directory | Proof of cloud-isolated or immutable backups | 90-day restore drill verification mandatory | **10% - 15% Discount** (Eliminates 50% co-pay) |
| **Patch Management & RDP** | No open port 3389/SMB; Criticals <14 days | Open RDP = Immediate decline or $250k sublimit | Automated perimeter scan; 14-day SLA on KEVs | External vulnerability scan with zero open criticals | **5% - 10% Discount** (Avoids rate surcharge) |
| **DMARC & Email Security** | DMARC `p=quarantine` or `p=reject` mandatory | Inbound attachment sandboxing & link rewriting | DKIM/SPF/DMARC alignment verified via scan | External forwarding disabled & anti-BEC rules | **5% - 10% Discount** |
| **Incident Response & TTX** | Written IRP + Annual Tabletop drill | Pre-approved BBR panel counsel requirement | Tested IRP with executive sign-off log | Annual TTX required for >$10M revenue firms | **5% - 10% Discount** |

---

## SECTION 2: Custom Evidence Export Logs (Identity & Access Management)

Underwriters require technical configuration exports—not manual statements—proving MFA enforcement and legacy protocol blocking.

### 2.1 Microsoft Entra ID (Azure AD) Technical Export Protocols

#### A. Exporting Enforced Conditional Access Policies via PowerShell
Run the following Microsoft Graph PowerShell commands to generate an audit-ready JSON export of all active Conditional Access policies (proving MFA enforcement across all users and admin roles):

```powershell
# Connect to Microsoft Graph with Policy Read permissions
Connect-MgGraph -Scopes "Policy.Read.All", "Directory.Read.All"

# Export all active Conditional Access Policies to JSON
Get-MgIdentityConditionalAccessPolicy | Where-Object { $_.State -eq "enabled" } | 
    Select-Object DisplayName, State, Conditions, GrantControls | 
    ConvertTo-Json -Depth 10 | 
    Out-File -FilePath "./Binder/01-Identity/Entra_ConditionalAccess_Policies_Export.json"

# Export MFA Enrollment Status for all Active Users
Get-MgUser -All -Property UserPrincipalName, AccountEnabled, StrongAuthenticationRequirements | 
    Where-Object { $_.AccountEnabled -eq $true } | 
    Export-Csv -Path "./Binder/01-Identity/Entra_User_MFA_Status_Report.csv" -NoTypeInformation
```
* **Saved File Target**: `Binder/01-Identity/Entra_ConditionalAccess_Policies_Export.json`

#### B. Proving Legacy Authentication Protocol Block
To prove basic authentication (IMAP, POP3, SMTP, Exchange Online Basic Auth) is blocked domain-wide:
1. Navigate to **Microsoft Entra Admin Center** -> **Identity** -> **Protection** -> **Conditional Access**.
2. Capture screenshot of policy named `[Policy] Block Legacy Authentication`.
3. Save screenshot as: `Binder/01-Identity/Entra_Block_Legacy_Auth_Screenshot.png`.

---

### 2.2 Okta Identity Cloud Technical Export Protocols

#### A. Exporting Sign-On & Authenticator Policies via Okta API
To prove 100% MFA coverage across Okta applications and admin consoles:

1. In **Okta Admin Console**, navigate to **Security** -> **Authentication Policies** & **Global Session Policy**.
2. Export the Active Sign-On Policy JSON config via Okta API endpoint: `/api/v1/policies?type=OKTA_SIGN_ON`.
3. Export System Log query for MFA activation events over the last 90 days: `eventType eq "user.mfa.factor.activate"`.
4. Save exported JSON to: `Binder/01-Identity/Okta_SignOn_Policies_Export.json`.

---

### 2.3 Cisco Duo Security Technical Export Protocols

#### A. Duo MFA Policy & User Compliance Export
To prove Duo MFA protection across VPN, RDP, and SSH gateways:

1. In **Duo Admin Panel**, navigate to **Reports** -> **User Logins** and **User Inventory**.
2. Run CSV export for all Active Users detailing registered authentication devices (Duo Push, Security Keys, WebAuthn).
3. Export **Global Policy Settings** showing user enforcement requirements and bypass restrictions.
4. Save exported files as: `Binder/01-Identity/Duo_User_MFA_Inventory.csv` and `Binder/01-Identity/Duo_Global_Policies.pdf`.

---

## SECTION 3: Custom Evidence Export Logs (Backup & Recovery Vendors)

Underwriters enforce strict "Proof of Immutability" and "Proof of Restore Testing." Self-attestations without backup logs result in a 50% ransomware co-payment clause.

### 3.1 Veeam Backup & Replication Technical Export Protocols

#### A. PowerShell Export for Immutability & Restore Verification
Run the following Veeam PowerShell module script to generate an automated immutability and restore report:

```powershell
# Load Veeam PowerShell Module
Add-PSSnapin VeeamPSSnapIn

# Export Immutable Scale-Out Backup Repositories & Object Lock Status
Get-VBRBackupRepository | Select-Object Name, Type, IsImmutable, ImmutabilityPeriodDays | 
    Export-Csv -Path "./Binder/03-Backups/Veeam_Repository_Immutability_Report.csv" -NoTypeInformation

# Export Last 90 Days Restore Job History (Proof of Restore Drill)
Get-VBRRestoreSession | Where-Object { $_.CreationTime -gt (Get-Date).AddDays(-90) } | 
    Select-Object JobName, Initiator, State, CreationTime, EndTime, Result | 
    Export-Csv -Path "./Binder/03-Backups/Veeam_90Day_Restore_Drill_Log.csv" -NoTypeInformation
```
* **Saved File Target**: `Binder/03-Backups/Veeam_Repository_Immutability_Report.csv`

---

### 3.2 Datto SIRIS & BDR Technical Export Protocols

#### A. Exporting Datto Screenshot Verification & Immutability Proof
Datto provides automated virtual boot verification (screenshots) proving backups are uncorrupted and ransomware-free:

1. Log in to **Datto Partner Portal** -> **Device Management** -> **Status**.
2. Run automated report export for **Screenshot Verification History** (proving test bootability for all protected VMs over the last 90 days).
3. Export Cloud Continuity immutability retention settings.
4. Save exported logs to: `Binder/03-Backups/Datto_Screenshot_Verification_Report.pdf`.

---

### 3.3 AWS S3 Object Lock & AWS Backup Technical Export Protocols

#### A. AWS CLI Commands for Object Lock Immutability Proof
Run the following AWS CLI commands to verify S3 WORM (Write Once Read Many) bucket immutability and AWS Backup vault compliance:

```bash
# 1. Verify S3 Bucket Object Lock Configuration (Compliance Mode)
aws s3api get-object-lock-configuration     --bucket my-corporate-immutable-backup-bucket     --output json > ./Binder/03-Backups/AWS_S3_ObjectLock_Config.json

# 2. List Vault Recovery Points & Retention Expiry
aws backup list-recovery-points-by-backup-vault     --backup-vault-name Primary-Production-Vault     --output json > ./Binder/03-Backups/AWS_Backup_Vault_Recovery_Points.json
```
* **Saved File Target**: `Binder/03-Backups/AWS_S3_ObjectLock_Config.json`

---

## SECTION 4: Comprehensive Underwriting Proof Checklist

Use this checklist to ensure all carrier-required artifacts are present in your binder prior to submission:

```
[MASTER UNDERWRITING EVIDENCE BINDER CHECKLIST]

01-IDENTITY & ACCESS MANAGEMENT (MFA)
[x] Entra ID / Okta / Duo Active MFA Coverage Export (>98% target)
[x] Screenshots of Enforced Conditional Access Policies
[x] Legacy Authentication Blocking Export (IMAP/POP3/Basic Auth disabled)
[x] Privileged Account Inventory (Domain/Global Admins with MFA)

02-ENDPOINT DETECTION & RESPONSE (EDR / MDR)
[x] EDR Console Active Asset Coverage Report (>95% Workstations, 100% Servers)
[x] 24/7 SOC / MDR Statement of Work (SOW) with active containment SLA
[x] Stale/Offline Endpoint Isolation & Quarantine Log

03-BACKUPS & BUSINESS CONTINUITY
[x] Veeam / Datto / AWS S3 Object Lock Immutability Export
[x] 90-Day Backup Restoration Test Verification Log (RTO/RPO verified)
[x] Network Architecture Diagram proving Backup Repository AD isolation

04-INCIDENT RESPONSE & GOVERNANCE
[x] Written Incident Response Plan (IRP) revised within last 12 months
[x] Annual Tabletop Exercise (TTX) After-Action Report (AAR) with sign-offs
[x] Pre-Approved Carrier Panel Breach Counsel Contact Sheet

05-EMAIL SECURITY & DMARC
[x] DNS Zone File Export showing DMARC (`quarantine`/`reject`), SPF, and DKIM
[x] Inbound Anti-BEC / Anti-Phishing Filter Rule Export
[x] Annual Employee Security Awareness & Phishing Simulation Metrics

06-VULNERABILITY MANAGEMENT & PERIMETER SECURITY
[x] External Perimeter Vulnerability Scan (Zero open RDP 3389 / SMB 445)
[x] Patch SLA Compliance Log (Critical CVSS 9.0+ remediated <14 days)
```

---

## SECTION 5: Directory Structure for Local SLM Training & Drive Storage

Structure your local evidence repository as follows to enable automated ingestion and RAG scanning by local SLM models:

```
/drive/slm_library/cyber_insurance_binder/
├── slm-master-manifest.yaml
├── 00_Executive_Summary/
│   ├── Underwriting_Risk_Scorecard_Carrier_Mapped.xlsx
│   └── Executive_Cover_Letter_2026.pdf
├── 01_Identity_MFA/
│   ├── Entra_ConditionalAccess_Policies_Export.json
│   ├── Entra_User_MFA_Status_Report.csv
│   ├── Okta_SignOn_Policies_Export.json
│   ├── Duo_User_MFA_Inventory.csv
│   └── Entra_Block_Legacy_Auth_Screenshot.png
├── 02_Endpoint_EDR_MDR/
│   ├── EDR_Console_Device_Coverage.csv
│   └── MDR_SOC_Service_Agreement_Redacted.pdf
├── 03_Backups_BCDR/
│   ├── Veeam_Repository_Immutability_Report.csv
│   ├── Veeam_90Day_Restore_Drill_Log.csv
│   ├── Datto_Screenshot_Verification_Report.pdf
│   ├── AWS_S3_ObjectLock_Config.json
│   └── Backup_Architecture_Isolation_Diagram.pdf
├── 04_Incident_Response/
│   ├── Corporate_Incident_Response_Plan_2026.pdf
│   └── Tabletop_Exercise_After_Action_Report.pdf
├── 05_Email_Security/
│   ├── DMARC_SPF_DKIM_Alignment.png
│   └── Phishing_Simulation_Metrics_2026.csv
└── 06_Vulnerability_Management/
    ├── Patch_SLA_Compliance_Report.pdf
    └── External_Perimeter_Scan_Results.pdf
```

---
*Template Version 2026.2 (v2) -- Enhanced with Custom Vendor Exports & Carrier Questionnaire Mappings.*
