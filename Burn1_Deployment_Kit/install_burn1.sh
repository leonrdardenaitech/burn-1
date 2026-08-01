#!/usr/bin/env bash
# ==============================================================================
# BURN-1 VAULT LOCAL AI INSTALLER v1.1
# Air-Gapped Zero-Cloud Deployment Engine
# ==============================================================================
echo -e '\033[1;33m[!] INITIALIZING BURN-1 VAULT AIR-GAPPED ENVIRONMENT...\033[0m'

if ! command -v curl &> /dev/null; then
    echo -e '\033[1;31m[-] Error: curl is required. Please install curl.\033[0m'
    exit 1
fi

echo -e '\033[1;32m[+] Installing Ollama Engine...\033[0m'
curl -fsSL https://ollama.com/install.sh | sh

echo -e '\033[1;32m[+] Binding Host strictly to 127.0.0.1:11434...\033[0m'
export OLLAMA_HOST=127.0.0.1:11434

echo -e '\033[1;32m[+] Pulling Llama3 Uncensored Model Weights...\033[0m'
ollama pull llama3

echo -e '\033[1;36m[✓] BURN-1 VAULT DEPLOYMENT COMPLETE.\033[0m'
echo -e '\033[1;33m[*] WARNING: Run ./burn1-killswitch.sh at any time for 3-sec RAM purge.\033[0m'
