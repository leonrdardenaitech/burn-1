@echo off
title BURN-1 // 4-DIVISION SHARED WORKER & AGY CLI SYNC ENGINE
color 0B
echo ======================================================================
echo   BURN-1 SYSTEMS // 4-DIVISION AUTONOMOUS WORKER (FREEZER / ACID / TIMES2 / SIZZLEAN)
echo   Modes:
echo     - Single Sync (agy CLI): run_divisions_sync.bat --sync --division all
echo     - 5-Min Cron Daemon:     run_divisions_sync.bat --poll --interval 300
echo ======================================================================
echo.
if "%~1"=="" (
    echo [*] Running immediate 4-Division Sync pass followed by 5-minute polling cron...
    "C:\Users\Leonr\AppData\Local\Python\bin\python.exe" "%~dp0worker.py" --poll --interval 300
) else (
    "C:\Users\Leonr\AppData\Local\Python\bin\python.exe" "%~dp0worker.py" %*
)
