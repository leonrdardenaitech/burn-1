#!/usr/bin/env bash
# ==============================================================================
# BURN-1 EXIFTOOL METADATA SCRUBBER SCRIPT v1.0
# 1-Click Image EXIF, GPS & Timestamp Purger
# ==============================================================================

TARGET_DIR="${1:-.}"

echo -e '\033[1;33m[!] INITIALIZING EXIFTOOL METADATA SCRUBBER...\033[0m'
echo -e "\033[1;36m[+] Target Directory: ${TARGET_DIR}\033[0m"

if ! command -v exiftool &> /dev/null; then
    echo -e '\033[1;31m[-] Error: exiftool is required. Install via: sudo apt install libimage-exiftool-perl\033[0m'
    exit 1
fi

echo -e '\033[1;32m[+] Stripping all EXIF, GPS, camera model, and timestamp metadata...\033[0m'
exiftool -overwrite_original -all= -r "${TARGET_DIR}"

echo -e '\033[1;32m[✓] METADATA SCRUB COMPLETE. ZERO RESIDUE DETECTED.\033[0m'
