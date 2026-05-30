#!/bin/bash
# Log rotation for C6 Agent-OS
# Keeps logs from filling disk

LOG_DIR="/c/Users/VAT PRODUCTION/agent-os/logs"
AUDIT_DIR="/c/Users/VAT PRODUCTION/agent-os/audit/logs"
ARCHIVE_DIR="/c/Users/VAT PRODUCTION/agent-os/logs/archive"

mkdir -p "$ARCHIVE_DIR"

# Rotate main logs older than 30 days
if [ -d "$LOG_DIR" ]; then
    find "$LOG_DIR" -name "*.log" -type f -mtime +30 -exec gzip {} \; -exec mv {}.gz "$ARCHIVE_DIR/" \; 2>/dev/null
    find "$LOG_DIR" -name "*.txt" -type f -mtime +30 -exec gzip {} \; -exec mv {}.gz "$ARCHIVE_DIR/" \; 2>/dev/null
fi

# Archive audit logs older than 365 days
if [ -d "$AUDIT_DIR" ]; then
    find "$AUDIT_DIR" -name "*.jsonl" -type f -mtime +365 -exec gzip {} \; -exec mv {}.gz "$ARCHIVE_DIR/" \; 2>/dev/null
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Log rotation completed" >> "$LOG_DIR/rotation.log"
