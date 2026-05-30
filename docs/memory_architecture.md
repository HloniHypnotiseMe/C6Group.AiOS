# C6 Group - Memory Architecture

## Overview
C6 Group uses multiple memory systems, each optimized for different purposes.

## Memory Layers

| Layer | Technology | Purpose | Retention |
|-------|------------|---------|-----------|
| Short-term | JSON (memory_local.json) | Current state, cycles, recent decisions | Indefinite |
| Semantic | SQLite (simple_memory.db) | Keyword search, content recall | Indefinite |
| Audit | JSON Lines (audit/logs/) | Immutable event history | Monthly rotation |
| Config | YAML files | System configuration | Version controlled |

## JSON Memory (memory_local.json)
- Format: JSON
- Contents: cycles, decisions list, last_topics
- Access: Read/write by CEO agent
- Backup: Included in daily backups

## SQLite Memory (simple_memory.db)
- Format: SQLite
- Contents: memories table (id, text, keywords, timestamp, metadata)
- Access: Semantic search via keyword matching
- Backup: Included in daily backups

## Audit Logs (audit/logs/)
- Format: JSON Lines (.jsonl)
- Contents: One event per line: timestamp, agent, action, status, details
- Rotation: Monthly (audit_2026_05.jsonl, audit_2026_06.jsonl)
- Retention: Current month + archive
- Access: Append-only, queryable via audit_logger.py

## Configuration (config/*.yaml)
- Format: YAML
- Files: system.yaml, business.yaml, ai_models.yaml, email.yaml
- Access: Read-only via config.loader
- Version control: Track changes manually

## Future Additions
- Vector database (Qdrant/Chroma) for true semantic search
- Graph database (Neo4j) for relationship mapping
- Redis for distributed state (if moving to cloud)

## Data Flow
1. CEO reads config -> makes decision -> logs to audit
2. Decision stored in JSON memory
3. Content stored in SQLite for recall
4. All changes backed up daily

## Last Updated
2026-05-30
