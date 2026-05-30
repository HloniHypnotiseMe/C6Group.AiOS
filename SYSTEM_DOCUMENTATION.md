# C6 Group / RemotePay Fintech Services - System Documentation

## System Overview
- Company: RemotePay Fintech Services Pty Ltd (trading as C6 Group)
- AI Operating System: Agent-OS
- Location: C:\Users\VAT PRODUCTION\agent-os

## Components

### 1. CEO Agent
- Location: agents/ceo/ceo_simple.py
- Function: Makes decisions every 15 minutes
- Memory: memory_local.json (JSON) + simple_memory.db (SQLite)
- Status: Operational

### 2. Control Room Dashboard
- Location: dashboard/
- Access: http://127.0.0.1:5000
- Functions: Start/stop CEO, view status, send commands
- Status: Operational

### 3. Memory Systems
- JSON Memory: memory_local.json (decisions, cycles)
- SQLite Memory: simple_memory.db (semantic, keywords)
- Location: ~/agent-os/

### 4. Ollama Local AI
- Models: tinyllama (637MB), phi (1.6GB)
- API: http://localhost:11434
- Status: Operational

### 5. Legal Documents
- Location: legal/popia/
- Files: privacy_policy.md, paia_manual.md, data_processing_agreement.md
- Status: Draft complete

### 6. Backups
- Script: ~/backup_agent_os.sh
- Location: ~/backups/
- Schedule: Daily at 2:00 AM (via Task Scheduler "C6_Backup")
- Retention: Last 7 backups

### 7. Sandbox
- Location: ~/sandbox/
- Purpose: Isolated testing environment
- Rules: sandbox/RULES.md

### 8. Business Email
- Domain: c6group.co.za
- Forwarding: info@, hloni@, sales@ → primary inbox
- Provider: Cloudflare Email Routing

## Key Commands

| Action | Command (Git Bash) |
|--------|---------------------|
| Start Control Room | cd ~/agent-os/dashboard && python server.py |
| Run CEO once | python ~/agent-os/agents/ceo/ceo_simple.py |
| Check CEO status | ps aux | grep python |
| Manual backup | ~/backup_agent_os.sh |
| View backups | ls -la ~/backups/ |

## Important Notes
- All systems run locally on this laptop
- No cloud dependencies (Oracle optional later)
- POPIA documents are drafts — need final review and signing
- Email is forward-only (cannot send from these addresses yet)

## Last Updated
2026-05-30
