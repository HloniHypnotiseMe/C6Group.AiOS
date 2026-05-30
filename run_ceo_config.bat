@echo off
:loop
echo [%date% %time%] Starting CEO cycle (config driven) >> logs\ceo_loop.txt
cd /d C:\Users\VAT PRODUCTION\agent-os
set PYTHONPATH=.
C:\Users\VAT PRODUCTION\agent-os\venv\Scripts\python.exe agents\ceo\ceo_config.py >> logs\ceo_loop.txt 2>&1
echo [%date% %time%] Cycle complete, waiting 15 minutes >> logs\ceo_loop.txt
timeout /t 900 /nobreak >nul
goto loop
