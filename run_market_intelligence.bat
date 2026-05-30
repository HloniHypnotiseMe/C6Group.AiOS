@echo off
cd /d C:\Users\VAT PRODUCTION\agent-os
set PYTHONPATH=.
C:\Users\VAT PRODUCTION\agent-os\venv\Scripts\python.exe products\market_intelligence\run_daily.py >> logs\market_intel.log 2>&1
