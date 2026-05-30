#!/bin/bash
# Disk space monitoring for C6 Agent-OS

THRESHOLD=90
DRIVE="/c/Users/VAT PRODUCTION"

USAGE=$(df -h "$DRIVE" | tail -1 | awk '{print $5}' | sed 's/%//')

if [ "$USAGE" -gt "$THRESHOLD" ]; then
    echo "[WARNING] Disk usage is ${USAGE}% - above ${THRESHOLD}% threshold"
    echo "Free up space on $DRIVE"
    # Could send email alert here
else
    echo "[OK] Disk usage is ${USAGE}%"
fi
