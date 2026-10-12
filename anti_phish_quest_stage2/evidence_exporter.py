#!/usr/bin/env python3
"""
Anti-Phish Quest Stage 2 — demo evidence exporter.
Creates CSV/JSON, a draft certificate, and SHA-256 manifest.
IMPORTANT: example rows are synthetic. Replace them with validated, authorized
simulation results. A hash is an integrity checksum, not a digital signature
and not proof that underlying data is true.
"""
from pathlib import Path
from datetime import date, datetime, timezone
import csv, json, hashlib, os

OUT = Path("anti_phish_evidence_output")
OUT.mkdir(exist_ok=True)
TARGET_CLICK_RATE = 3.5  # configurable illustrative benchmark; verify carrier requirements

# Synthetic example records only — do not submit these as real evidence.
records = [
    {"simulation_date":"2026-09-04","department":"Finance","employees_invited":120,"employees_completed":116,"phishing_clicks":3,"reported_suspicious":79,"source":"SYNTHETIC DEMO"},
    {"simulation_date":"2026-09-11","department":"Engineering","employees_invited":180,"employees_completed":176,"phishing_clicks":2,"reported_suspicious":123,"source":"SYNTHETIC DEMO"},
    {"simulation_date":"2026-09-18","department":"Sales","employees_invited":95,"employees_completed":91,"phishing_clicks":3,"reported_suspicious":54,"source":"SYNTHETIC DEMO"},
]

for row in records:
    invited = row["employees_invited"]
    row["completion_rate_pct"] = round(row["employees_completed"] / invited * 100, 2) if invited else 0
    row["click_rate_pct"] = round(row["phishing_clicks"] / invited * 100, 2) if invited else 0
    row["benchmark_under_3_5_pct"] = row["click_rate_pct"] < TARGET_CLICK_RATE
    row["benchmark_note"] = "Illustrative benchmark only; confirm insurer wording and denominator."

csv_path = OUT / "Anti_Phishing_Underwriting_Evidence.csv"
json_path = OUT / "Anti_Phishing_Underwriting_Evidence.json"
with csv_path.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=list(records[0].keys()))
    writer.writeheader()
    writer.writerows(records)
json_path.write_text(json.dumps({
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "record_type": "SYNTHETIC DEMO — NOT REAL UNDERWRITING EVIDENCE",
    "benchmark_click_rate_pct": TARGET_CLICK_RATE,
    "records": records
}, indent=2), encoding="utf-8")

def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

csv_hash, json_hash = sha256(csv_path), sha256(json_path)
certificate = f"""DRAFT TRAINING EVIDENCE CERTIFICATE — NOT INSURER-ISSUED OR APPROVED
Program: Anti-Phish Quest: Stage 2
Generated (UTC): {datetime.now(timezone.utc).isoformat()}
Data status: SYNTHETIC DEMO RECORDS ONLY — MUST BE REPLACED AND VALIDATED
Illustrative click-rate benchmark: strictly below {TARGET_CLICK_RATE:.2f}%
CSV SHA-256: {csv_hash}
JSON SHA-256: {json_hash}

This draft is not a representation that Travelers Item 4C, Chubb Schedule B,
Beazley requirements, NIST controls, or any policy warranty have been satisfied.
Requirements vary by policy, organization, population, denominator, and testing
method. Have the broker, carrier, and compliance counsel validate requirements
and evidence before submission.

Integrity note: SHA-256 detects byte changes only when compared with a trusted
hash stored separately. It does not authenticate the author or truth of records.
For a signed certificate, use an organization-controlled signing key (for example,
an approved PKI certificate or a KMS-backed signing workflow) and preserve audit logs.
"""
cert_path = OUT / "Draft_Phishing_Compliance_Certificate.txt"
cert_path.write_text(certificate, encoding="utf-8")
manifest = {
    "algorithm":"SHA-256",
    "files": {
        csv_path.name: csv_hash,
        json_path.name: json_hash,
        cert_path.name: sha256(cert_path)
    },
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "note":"Synthetic demonstration output. Store manifest/hash in a trusted, access-controlled location."
}
(OUT / "SHA256_Manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print("Generated demo evidence in:", OUT.resolve())
for name, digest in manifest["files"].items():
    print(f"{name}: {digest}")
