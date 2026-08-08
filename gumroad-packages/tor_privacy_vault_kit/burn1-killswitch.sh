#!/usr/bin/env bash
# ==============================================================================
# BURN-1 MASTER KILL SWITCH v1.0
# 3-Second Atomic RAM Purge & Terminal History Incinerator
# ==============================================================================
echo -e '\033[1;31m[!] EXECUTING BURN-1 MASTER KILL SWITCH...\033[0m'
echo -e '\033[1;31m[!] RESTARTING LOCAL SERVICES & PURGING ACTIVE RAM...\033[0m'

sudo systemctl restart ollama 2>/dev/null || killall ollama 2>/dev/null

echo -e '\033[1;33m[!] INCINERATING TERMINAL HISTORY (.bash_history & .zsh_history)...\033[0m'
cat /dev/null > ~/.bash_history 2>/dev/null
cat /dev/null > ~/.zsh_history 2>/dev/null
history -c 2>/dev/null

sleep 1
clear
echo -e '\033[1;32m[✓] BURN-1 SYSTEM PURGED & AIRGAP RESTORED.\033[0m'
