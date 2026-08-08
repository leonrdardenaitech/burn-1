import subprocess

cli = r"C:\Users\Leonr\.local\bin\gumroad.exe"
product_id = "qsFFWmq3jThZHEn1OVgG1w=="
zip_path = r"C:\Users\Leonr\projects\burn-1.com\gumroad-packages\tor_privacy_vault_kit.zip"

desc = (
    "<p>Reclaim your digital footprint from commercial surveillance, metadata tracking, and algorithmic fatigue. "
    "The Burn-1 Tor Privacy Vault is an air-gapped, zero-cloud digital toolkit designed to transition your online posture "
    "from tracking fog to privacy clarity.</p>"
    "<p><strong>WHAT'S INSIDE THE $50 VAULT ZIP:</strong></p>"
    "<ul>"
    "<li><strong>[x] Tor Browser & Tails OS Master Guide:</strong> Security level configuration, obfs4 Bridges setup, and bootable Tails USB installation.</li>"
    "<li><strong>[x] ExifTool Metadata Scrubber Script (exiftool_scrub.sh):</strong> 1-click bash script to purge GPS location, camera model, and timestamp metadata from your photos before sharing.</li>"
    "<li><strong>[x] PGP Encryption & Messaging Guide:</strong> Generate 4096-bit GPG keypairs and sign encrypted messages.</li>"
    "<li><strong>[x] Digital Detox & Surveillance Shield:</strong> Block tracker feeds, configure NextDNS, and deploy Session/Signal encrypted messengers.</li>"
    "<li><strong>[x] Zero-Residue Privacy Reset (burn1-killswitch.sh):</strong> Emergency script to incinerate active RAM and shell history.</li>"
    "</ul>"
    "<p><strong>100% OFFLINE GUARANTEE:</strong></p>"
    "<p>Zero cloud telemetry. Zero subscription fees. You own the files on your hardware.</p>"
)

print("Updating Tor Privacy Vault product on Gumroad...")
cmd = [
    cli, "products", "update", product_id,
    "--name", "Burn-1 Tor Privacy Vault & OpSec Guidebook ($50)",
    "--description", desc,
    "--file", zip_path,
    "--file-name", "tor_privacy_vault_kit.zip"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print(res.stdout)
if res.stderr:
    print("ERR:", res.stderr)

print("Publishing updated Tor Privacy Vault...")
res_pub = subprocess.run([cli, "products", "publish", product_id], capture_output=True, text=True)
print(res_pub.stdout)
if res_pub.stderr:
    print("ERR:", res_pub.stderr)
