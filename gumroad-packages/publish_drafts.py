import subprocess

cli = r"C:\Users\Leonr\.local\bin\gumroad.exe"
ids = [
    "qsFFWmq3jThZHEn1OVgG1w==",  # Tor Privacy Vault
    "m2rECMLU5Y1MyBck31y8hA==",  # QR Vector Asset Pack
    "qzkBX5X46dn9ASczIa9dHQ==",  # SCORM LMS Shells
    "5T28kXj8kNEFC8o8ngPSvA==",  # Automated Chatbot Flow Maps
    "8zusnxpotbi4pjNHC318JA==",  # Executive Digital Etiquette Playbook
]

for product_id in ids:
    print(f"Publishing {product_id}...")
    res = subprocess.run([cli, "products", "publish", product_id], capture_output=True, text=True)
    print(res.stdout)
    if res.stderr:
        print("ERR:", res.stderr)

print("Publishing sequence completed.")
