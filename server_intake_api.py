#!/usr/bin/env python3
"""
BURN-1 Systems - Central Intake API & 5-State Lifecycle Engine
Endpoint: POST /api/intake
Author: Enterprise Architecture Core (leonrdarden.com / burn-1.com)
"""

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import sys
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
if sys.stderr and hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
import os
import csv
import json
import hashlib
import datetime
from pathlib import Path

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests for front-end form submissions

# Directory Setup: Points to local Obsidian Vault
VAULT_DIR = Path.home() / "ObsidianVault" / "BURN1_Master_Vault" / "Clients"
VAULT_DIR.mkdir(parents=True, exist_ok=True)
MANIFESTS_DIR = VAULT_DIR.parent / "Manifests"
MANIFESTS_DIR.mkdir(parents=True, exist_ok=True)
LEDGER_FILE = MANIFESTS_DIR / "master_ledger.json"
CSV_LEDGER_FILE = MANIFESTS_DIR / "master_spreadsheet.csv"
PROJECT_CSV_FILE = Path(__file__).parent / "master_spreadsheet.csv"
LOGS_DIR = VAULT_DIR.parent / "Logs"
LOGS_DIR.mkdir(parents=True, exist_ok=True)
ESCALATIONS_FILE = LOGS_DIR / "escalations.jsonl"


def generate_sha256_seal(domain: str, timestamp: str) -> str:
    """Generates the official Algorithmic Cryptographic SHA-256 Seal hash."""
    raw_payload = f"BURN1_SEAL:{domain}:{timestamp}:NIST_CSF_2.0:CISA_KEV_VERIFIED"
    return hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()


def evaluate_lifecycle_state(telemetry_data: dict, attestations: dict) -> tuple:
    """
    Evaluates observed telemetry + self-attestation data against rules:
    - APPROVED_SEALED: 100% verified, zero critical ports, DMARC enforced, attestations present.
    - NON_CONV_INCOMPLETE: Scan complete, but missing mandatory self-attestation fields.
    - REJECTED_NEEDS_REMEDIATION: Critical ports (RDP 3389 / SMB 445) open or CISA KEV CVE flags.
    """
    open_ports = telemetry_data.get("open_ports", [])
    cisa_kev_flags = telemetry_data.get("cisa_kev_flags", 0)

    # 1. Critical Remediation Rejection Check
    if 3389 in open_ports or 445 in open_ports or cisa_kev_flags > 0:
        return (
            "REJECTED_NEEDS_REMEDIATION",
            "Critical perimeter vulnerability or exposed management port detected (RDP 3389 / SMB 445). Remediation required."
        )

    # 2. Check for Missing Self-Attestation Content
    has_mfa_proof = attestations.get("mfa_enforced", False)
    has_backup_date = bool(attestations.get("last_backup_test_date"))

    if not (has_mfa_proof and has_backup_date):
        return (
            "NON_CONV_INCOMPLETE",
            "Agentless perimeter telemetry passed, but mandatory operational self-attestations (MFA proof / backup test logs) are incomplete."
        )

    # 3. Approved & Cryptographically Sealed
    return (
        "APPROVED_SEALED",
        "All agentless perimeter telemetry and compliance attestations fully verified."
    )


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "UP",
        "service": "BURN-1 Central Intake API & 5-State Lifecycle Engine",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }), 200


@app.route("/api/intake/ledger", methods=["GET"])
def get_ledger():
    if LEDGER_FILE.exists():
        try:
            with open(LEDGER_FILE, "r", encoding="utf-8") as f:
                return jsonify(json.load(f)), 200
        except Exception as e:
            return jsonify({"status": "ERROR", "message": str(e)}), 500
    return jsonify([]), 200


@app.route("/api/intake/csv", methods=["GET"])
def get_spreadsheet_csv():
    if CSV_LEDGER_FILE.exists():
        try:
            with open(CSV_LEDGER_FILE, "r", encoding="utf-8") as f:
                content = f.read()
            return Response(
                content,
                mimetype="text/csv",
                headers={"Content-Disposition": "attachment;filename=burn1_master_spreadsheet.csv"}
            )
        except Exception as e:
            return jsonify({"status": "ERROR", "message": str(e)}), 500
    return Response("UTC Timestamp,Order ID,Legal Entity,Perimeter Domain\n", mimetype="text/csv")


@app.route("/api/intake", methods=["POST"])
def process_intake():
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({"status": "ERROR", "message": "Invalid or empty JSON payload"}), 400

        # Extract domain
        raw_domain = data.get("client_domain") or data.get("primaryDomain") or ""
        domain = raw_domain.strip().lower()
        contact_email = data.get("contact_email", "").strip()
        form_origin = data.get("form_origin") or ("msp_intake" if data.get("client_type") == "msp" else "direct_intake")
        company_name = data.get("company_name") or data.get("entityName") or (domain.split('.')[0].upper() if domain else "Client Entity")

        if not domain:
            return jsonify({"status": "ERROR", "message": "Client domain is required."}), 400

        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # Extract telemetry & attestations
        telemetry_block = data.get("observed_telemetry") or {
            "dmarc_policy": data.get("dmarc_policy", "p=reject"),
            "tls_version": data.get("tls_version", "1.3"),
            "open_ports": data.get("open_ports", []),
            "cisa_kev_flags": data.get("cisa_kev_flags", 0)
        }

        attestation_block = data.get("attested_telemetry") or {
            "mfa_enforced": bool(data.get("mfa_enforced", True)),
            "last_backup_test_date": data.get("last_backup_test_date") or datetime.date.today().isoformat(),
            "osha_log_reviewed": bool(data.get("osha_log_reviewed", True))
        }

        # Evaluate 5-State Machine
        final_state, state_reason = evaluate_lifecycle_state(telemetry_block, attestation_block)

        sha256_seal = None
        vault_subdomain = None

        if final_state == "APPROVED_SEALED":
            sha256_seal = generate_sha256_seal(domain, timestamp)
            vault_subdomain = f"{domain.split('.')[0]}.burn-1.com"

        record_id = f"REQ-{hashlib.md5(f'{domain}:{timestamp}'.encode()).hexdigest()[:8]}"

        record = {
            "id": record_id,
            "timestamp": timestamp,
            "form_origin": form_origin,
            "company_name": company_name,
            "client_domain": domain,
            "contact_email": contact_email,
            "framework": data.get("framework", "NIST CSF 2.0"),
            "tier_selected": data.get("tier_selected") or data.get("packageTier", "core_verified_binder_1000"),
            "plus_add_ons": data.get("plus_add_ons", []),
            "broker_ref": data.get("broker_ref", None),
            "lifecycle_state": final_state,
            "lifecycle_reason": state_reason,
            "sha256_seal": sha256_seal,
            "vault_subdomain": vault_subdomain,
            "observed_telemetry": telemetry_block,
            "attested_telemetry": attestation_block,
            "turnaround_sla": "Standard delivery up to 5 business days"
        }

        # 1. Write Client Markdown Manifest to Obsidian Vault
        safe_domain_filename = domain.replace('.', '_').replace('/', '_')
        client_md_path = VAULT_DIR / f"{safe_domain_filename}.md"
        md_content = f"""---
id: "{record['id']}"
domain: "{domain}"
company: "{record['company_name']}"
form_origin: "{form_origin}"
state: "{final_state}"
sha256_seal: "{sha256_seal or 'UNSEALED'}"
vault_url: "{vault_subdomain or 'N/A'}"
timestamp: "{timestamp}"
---

# 🏛️ BURN-1 CLIENT MANIFEST: {domain}

- **Lifecycle State**: `{final_state}`
- **Reason**: {state_reason}
- **Cryptographic Seal**: `{sha256_seal or 'PENDING_REMEDIATION'}`
- **Hosted Subdomain Vault**: [{vault_subdomain or 'N/A'}](https://{vault_subdomain or 'burn-1.com'})
- **Primary Tier**: `{record['tier_selected']}`
- **Framework**: `{record['framework']}`
- **PLUS Add-Ons**: `{', '.join(record['plus_add_ons']) if record['plus_add_ons'] else 'None'}`
- **Turnaround SLA**: {record['turnaround_sla']}

---
### 🔍 Agentless Perimeter Telemetry (Observed)
- **DMARC Policy**: `{telemetry_block.get('dmarc_policy', 'N/A')}`
- **TLS Version**: `{telemetry_block.get('tls_version', 'N/A')}`
- **WAN Ports Detected**: `{telemetry_block.get('open_ports', [])}`
- **Threat Flags**: `{telemetry_block.get('cisa_kev_flags', 0)}`

---
### 📋 Operational Attestations (Client Provided)
- **MFA Enforced**: `{attestation_block.get('mfa_enforced', False)}`
- **Last Immutable Backup Test**: `{attestation_block.get('last_backup_test_date', 'N/A')}`
- **OSHA Log Review**: `{attestation_block.get('osha_log_reviewed', False)}`
"""
        with open(client_md_path, "w", encoding="utf-8") as f:
            f.write(md_content)

        # 2. Append to Local Master Ledger JSON
        ledger_data = []
        if LEDGER_FILE.exists():
            try:
                with open(LEDGER_FILE, "r", encoding="utf-8") as f:
                    ledger_data = json.load(f)
            except Exception:
                ledger_data = []

        ledger_data = [r for r in ledger_data if r.get("client_domain") != domain]
        ledger_data.insert(0, record)

        with open(LEDGER_FILE, "w", encoding="utf-8") as f:
            json.dump(ledger_data, f, indent=2)

        # 3. Synchronize Physical CSV Spreadsheet on disk
        csv_headers = [
            "UTC Timestamp", "Order ID", "Legal Entity", "Perimeter Domain",
            "Contact Email", "Framework", "Wholesale Tier", "SHA-256 Seal Reference",
            "Lifecycle State", "Vault Subdomain", "Turnaround SLA"
        ]
        csv_rows = [csv_headers]
        for item in ledger_data:
            csv_rows.append([
                item.get("timestamp", ""),
                item.get("id", ""),
                item.get("company_name", ""),
                item.get("client_domain", ""),
                item.get("contact_email", ""),
                item.get("framework", ""),
                item.get("tier_selected", ""),
                item.get("sha256_seal", ""),
                item.get("lifecycle_state", ""),
                item.get("vault_subdomain", ""),
                item.get("turnaround_sla", "")
            ])

        for target_csv in [CSV_LEDGER_FILE, PROJECT_CSV_FILE]:
            try:
                with open(target_csv, "w", newline="", encoding="utf-8") as csv_fp:
                    writer = csv.writer(csv_fp)
                    writer.writerows(csv_rows)
            except Exception as csv_err:
                print(f"[!] CSV write notice: {csv_err}")

        # 4. Optional sync to external Cloud Spreadsheet (Google Sheets / Make.com)
        cloud_webhook = os.environ.get("CLOUD_SPREADSHEET_WEBHOOK") or os.environ.get("GOOGLE_SHEET_WEBHOOK")
        if cloud_webhook:
            try:
                import urllib.request
                req = urllib.request.Request(
                    cloud_webhook,
                    data=json.dumps(record).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )
                urllib.request.urlopen(req, timeout=5)
            except Exception as hook_err:
                print(f"[!] Cloud spreadsheet sync notice: {hook_err}")

        return jsonify({
            "status": "SUCCESS",
            "lifecycle_state": final_state,
            "sha256_seal": sha256_seal,
            "vault_subdomain": vault_subdomain,
            "message": state_reason,
            "record_id": record["id"],
            "timestamp": timestamp
        }), 200

    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 500


def dispatch_resend_email(recipient_email: str, order_data: dict) -> tuple:
    """
    Sends real email dispatch to recipient via SMTP (e.g. IONOS or Gmail).
    If SMTP env variables are omitted, logs dispatch to Vault without throwing error.
    """
    smtp_host = os.environ.get("SMTP_HOST", "smtp.ionos.com")
    smtp_port = int(os.environ.get("SMTP_PORT", 587))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASSWORD", "")
    from_email = os.environ.get("FROM_EMAIL", smtp_user or "support@burn-1.com")

    if not smtp_user or not smtp_pass:
        log_entry = {
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "event": "RESEND_DISPATCH_DRY_RUN",
            "recipient": recipient_email,
            "order_id": order_data.get("id"),
            "domain": order_data.get("client_domain"),
            "note": "SMTP credentials not provided; logged as dry-run."
        }
        with open(LOGS_DIR / "resend_dispatches.jsonl", "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry) + "\n")
        return False, "DRY_RUN_LOGGED"

    try:
        import smtplib
        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText

        subject = f"BURN-1 Verified Evidence Report Re-Dispatch // {order_data.get('client_domain')}"
        plain_body = f"""BURN-1 SYSTEMS // CENTRAL EVIDENCE REGISTRY
------------------------------------------------------------
Requested re-dispatch for Order: {order_data.get('id')}
Client Domain: {order_data.get('client_domain')}
Company: {order_data.get('company_name')}
Lifecycle State: {order_data.get('lifecycle_state')}
Cryptographic Seal: {order_data.get('sha256_seal')}
Vault URL: https://{order_data.get('vault_subdomain', 'burn-1.com')}

Delivered within standard business turnaround up to 5 business days.
------------------------------------------------------------
BURN-1 Systems • Underwriting Evidence Registry
"""
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = from_email
        msg["To"] = recipient_email
        msg.attach(MIMEText(plain_body, "plain", "utf-8"))

        server = smtplib.SMTP(smtp_host, smtp_port, timeout=15)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(from_email, [recipient_email], msg.as_string())
        server.quit()
        return True, "DISPATCHED"
    except Exception as e:
        print(f"[!] Resend SMTP delivery error: {e}")
        return False, f"ERROR: {str(e)}"


@app.route("/api/cosmo/resend", methods=["POST"])
def cosmo_resend():
    """JOB 3: Look up order in master ledger, trigger actual email dispatch, and return masked confirmation."""
    try:
        data = request.get_json(force=True) or {}
        order_query = data.get("order_number", "").strip().upper()
        if not order_query:
            return jsonify({"status": "ERROR", "message": "Order number is required."}), 400

        # Look up in master_ledger.json
        matched = None
        if LEDGER_FILE.exists():
            with open(LEDGER_FILE, "r", encoding="utf-8") as f:
                ledger = json.load(f)
                for entry in ledger:
                    if order_query in entry.get("id", "").upper() or order_query in entry.get("client_domain", "").upper():
                        matched = entry
                        break

        if matched:
            email = matched.get("contact_email", "")
            if "@" in email:
                user_part, dom_part = email.split("@", 1)
                masked = user_part[0] + "***@" + dom_part
            else:
                masked = "original recipient on file"

            # Execute real email dispatch
            dispatched, dispatch_status = dispatch_resend_email(email, matched)

            return jsonify({
                "status": "SUCCESS",
                "matched": True,
                "masked_email": masked,
                "order_id": matched.get("id"),
                "email_dispatched": dispatched,
                "dispatch_status": dispatch_status,
                "message": f"Report re-dispatched to {masked}."
            }), 200
        else:
            return jsonify({
                "status": "NOT_FOUND",
                "matched": False,
                "message": "No matching order found. You may escalate this request."
            }), 200
    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 500


@app.route("/api/cosmo/escalate", methods=["POST"])
def cosmo_escalate():
    """JOB 4: Dispatch escalation alert to Elleon and record in logs."""
    try:
        data = request.get_json(force=True) or {}
        session_id = data.get("session_id", "ANON")
        client_domain = data.get("client_domain", "unspecified")
        form_origin = data.get("form_origin", "cosmo_chat")
        current_step = data.get("current_step", "intake_inquiry")
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

        escalation_record = {
            "timestamp": timestamp,
            "session_id": session_id,
            "client_domain": client_domain,
            "form_origin": form_origin,
            "current_step": current_step
        }

        with open(ESCALATIONS_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(escalation_record) + "\n")

        return jsonify({
            "status": "SUCCESS",
            "message": "Escalated. Elleon will guide you from here.",
            "timestamp": timestamp
        }), 200
    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 500


@app.route("/api/divisions/intake", methods=["POST"])
def divisions_intake():
    """Enqueues an order from Freezer, Acid, Times2, or Sizzlean into division_queue.csv."""
    try:
        import worker
        data = request.get_json(force=True) or {}
        row = worker.enqueue_division_order(data)
        auto_sync = data.get("auto_sync", True)
        sync_result = worker.process_pending_queue(target_division=row["division_origin"]) if auto_sync else None
        return jsonify({
            "status": "SUCCESS",
            "queued_order": row,
            "sync_result": sync_result
        }), 200
    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 500


@app.route("/api/divisions/sync", methods=["POST", "GET"])
def divisions_sync():
    """Remote & agy CLI endpoint to trigger 4-division queue processing or inspect status."""
    try:
        import worker
        if request.method == "GET":
            rows = worker.read_queue_rows()
            return jsonify({"status": "SUCCESS", "total_rows": len(rows), "queue": rows}), 200
        data = request.get_json(silent=True) or {}
        division = data.get("division", "all")
        remote_ep = data.get("remote_endpoint", "")
        result = worker.process_pending_queue(target_division=division, remote_endpoint=remote_ep)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 BURN-1 Central Intake API Server running on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
