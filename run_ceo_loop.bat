@echo off
:loop
echo [%date% %time%] Starting CEO cycle >> logs\ceo_loop.txt
cd /d C:\Users\VAT PRODUCTION\agent-os
C:\Users\VAT PRODUCTION\agent-os\venv\Scripts\python.exe agents\ceo\ceo_safe.py >> logs\ceo_loop.txt 2>&1
echo [%date% %time%] Cycle complete, waiting 15 minutes >> logs\ceo_loop.txt
timeout /t 900 /nobreak >nul
goto loop
