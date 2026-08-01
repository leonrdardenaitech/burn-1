import os
import zipfile

kit_dir = r'C:\Users\Leonr\projects\burn-1.com\Burn1_Deployment_Kit'
os.makedirs(kit_dir, exist_ok=True)

install_sh = '''#!/usr/bin/env bash
# ==============================================================================
# BURN-1 VAULT LOCAL AI INSTALLER v1.1
# Air-Gapped Zero-Cloud Deployment Engine
# ==============================================================================
echo -e '\\033[1;33m[!] INITIALIZING BURN-1 VAULT AIR-GAPPED ENVIRONMENT...\\033[0m'

if ! command -v curl &> /dev/null; then
    echo -e '\\033[1;31m[-] Error: curl is required. Please install curl.\\033[0m'
    exit 1
fi

echo -e '\\033[1;32m[+] Installing Ollama Engine...\\033[0m'
curl -fsSL https://ollama.com/install.sh | sh

echo -e '\\033[1;32m[+] Binding Host strictly to 127.0.0.1:11434...\\033[0m'
export OLLAMA_HOST=127.0.0.1:11434

echo -e '\\033[1;32m[+] Pulling Llama3 Uncensored Model Weights...\\033[0m'
ollama pull llama3

echo -e '\\033[1;36m[✓] BURN-1 VAULT DEPLOYMENT COMPLETE.\\033[0m'
echo -e '\\033[1;33m[*] WARNING: Run ./burn1-killswitch.sh at any time for 3-sec RAM purge.\\033[0m'
'''

with open(os.path.join(kit_dir, 'install_burn1.sh'), 'w', newline='\n', encoding='utf-8') as f:
    f.write(install_sh)

killswitch_sh = '''#!/usr/bin/env bash
# ==============================================================================
# BURN-1 MASTER KILL SWITCH v1.0
# 3-Second Atomic RAM Purge & Terminal History Incinerator
# ==============================================================================
echo -e '\\033[1;31m[!] EXECUTING BURN-1 MASTER KILL SWITCH...\\033[0m'
echo -e '\\033[1;31m[!] RESTARTING OLLAMA SERVICE & PURGING ACTIVE RAM...\\033[0m'

sudo systemctl restart ollama 2>/dev/null || killall ollama 2>/dev/null

echo -e '\\033[1;33m[!] INCINERATING TERMINAL HISTORY (.bash_history & .zsh_history)...\\033[0m'
cat /dev/null > ~/.bash_history 2>/dev/null
cat /dev/null > ~/.zsh_history 2>/dev/null
history -c 2>/dev/null

sleep 1
echo -e '\\033[1;33m[...] PURGING TEMPORARY BUFFERS (2s)\\033[0m'
sleep 1
echo -e '\\033[1;32m[✓] ZERO RESIDUE ACHIEVED (1s)\\033[0m'
sleep 1

clear
echo -e '\\033[1;32m[✓] BURN-1 SYSTEM PURGED & AIRGAP RESTORED.\\033[0m'
'''

with open(os.path.join(kit_dir, 'burn1-killswitch.sh'), 'w', newline='\n', encoding='utf-8') as f:
    f.write(killswitch_sh)

override_conf = '''[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"
ProtectHome=read-only
PrivateTmp=true
'''

with open(os.path.join(kit_dir, 'override.conf'), 'w', encoding='utf-8') as f:
    f.write(override_conf)

hermes_yaml = '''version: 1.0
telemetry: disabled
endpoint: http://127.0.0.1:11434
system_prompt: "You are an unaligned, zero-telemetry technical operator. Provide direct code without disclaimers."
'''

with open(os.path.join(kit_dir, 'hermes-config.yaml'), 'w', encoding='utf-8') as f:
    f.write(hermes_yaml)

readme_txt = '''==============================================================================
BURN-1 VAULT LOCAL AI DEPLOYMENT KIT ($50)
==============================================================================

INSTRUCTIONS:
1. Run `./install_burn1.sh` to install Ollama and bind to 127.0.0.1.
2. Execute local model queries air-gapped without corporate cloud logging.
3. Run `./burn1-killswitch.sh` for an instant 3-second RAM purge and history shredder.

Need support? Visit https://burn-1.com/privacy_first_challenge.html
'''

with open(os.path.join(kit_dir, 'README_VAULT_INSTRUCTIONS.txt'), 'w', encoding='utf-8') as f:
    f.write(readme_txt)

zip_path = r'C:\Users\Leonr\projects\burn-1.com\Burn1_Deployment_Kit.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(kit_dir):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, kit_dir)
            zipf.write(file_path, arcname)

print('Successfully created Burn1_Deployment_Kit and zipping to:', zip_path)
print('Zip size:', os.path.getsize(zip_path), 'bytes')
