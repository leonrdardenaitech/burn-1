@echo off
title BURN-1 // CENTRAL INTAKE API & 5-STATE LIFECYCLE ENGINE
color 02
echo ======================================================================
echo   BURN-1 SYSTEMS // CENTRAL INTAKE API SERVER (PORT 5000)
echo   Obsidian Vault: %USERPROFILE%\ObsidianVault\BURN1_Master_Vault
echo ======================================================================
echo.
echo [*] Launching Central Intake API...
"C:\Users\Leonr\AppData\Local\Python\bin\python.exe" server_intake_api.py
pause
