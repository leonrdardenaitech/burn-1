# 02. OPSEC PGP ENCRYPTION & EXIFTOOL METADATA SCRUBBER GUIDE

## 1. ExifTool Photo & Document Metadata Removal
Digital cameras and smartphones embed hidden EXIF data into photos including GPS coordinates, camera serial numbers, device model, and exact timestamps.

### Strip metadata using ExifTool:
```bash
# Scrub all EXIF metadata in place and overwrite originals
exiftool -overwrite_original -all= image.jpg

# Batch scrub an entire directory of photos
exiftool -overwrite_original -all= /path/to/target_folder/*
```

---

## 2. 4096-Bit RSA PGP Keypair Generation
Pretty Good Privacy (PGP) / GnuPG guarantees end-to-end message encryption and cryptographic signature verification.

### Generate 4096-bit Keypair:
```bash
gpg --full-generate-key
# Select: (1) RSA and RSA
# Keysize: 4096
# Expiration: 1y or 2y
```

### Export Public Key:
```bash
gpg --armor --export your_email@domain.com > public_key.asc
```

### Encrypt a Message for Recipient:
```bash
gpg --encrypt --armor --recipient recipient@domain.com secret_message.txt
```

### Decrypt Encrypted Message:
```bash
gpg --decrypt encrypted_message.asc
```
