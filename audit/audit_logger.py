"""
C6 Group - Audit Logging System
Immutable, timestamped, JSON Lines format (.jsonl)
"""

import json
import os
from datetime import datetime
from pathlib import Path
import threading

class AuditLogger:
    """Thread-safe audit logger for C6 Group agents"""

    def __init__(self, log_dir=None):
        if log_dir is None:
            log_dir = Path(__file__).parent / "logs"
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()

    def _get_current_log_file(self):
        """Get the current month's log file"""
        current_month = datetime.now().strftime("%Y_%m")
        return self.log_dir / f"audit_{current_month}.jsonl"

    def log(self, agent, action, details, status="success"):
        """
        Write an audit log entry

        Args:
            agent: Name of the agent (CEO, SYSTEM, CONTROL_ROOM, etc.)
            action: Action being performed (decision, kill_switch_detected, workflow_started, etc.)
            details: Dict of relevant details about the action
            status: success, failure, warning, paused, etc.
        """
        entry = {
            "timestamp": datetime.now().isoformat(),
            "agent": agent,
            "action": action,
            "status": status,
            "details": details
        }

        log_file = self._get_current_log_file()

        with self._lock:
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(json.dumps(entry) + '\n')

        return entry

    def log_decision(self, cycle, trend, decision, score=None):
        """Log a CEO decision event"""
        return self.log(
            agent="CEO",
            action="decision",
            details={
                "cycle": cycle,
                "trend": trend,
                "decision": decision,
                "score": score
            },
            status="success"
        )

    def log_workflow(self, workflow_name, status, duration_seconds=None, error=None):
        """Log a workflow execution event"""
        details = {"workflow": workflow_name}
        if duration_seconds:
            details["duration_seconds"] = duration_seconds
        if error:
            details["error"] = error
        return self.log(
            agent="WORKFLOW",
            action=workflow_name,
            details=details,
            status=status
        )

    def log_system_event(self, event_type, details, status="info"):
        """Log a system event (startup, shutdown, kill switch, etc.)"""
        return self.log(
            agent="SYSTEM",
            action=event_type,
            details=details,
            status=status
        )

    def log_kill_switch(self, action, reason=None):
        """Log kill switch activation or deactivation"""
        return self.log(
            agent="SYSTEM",
            action=f"kill_switch_{action}",
            details={"reason": reason or "manual"},
            status="paused" if action == "activated" else "resumed"
        )

    def log_error(self, agent, action, error, context=None):
        """Log an error event"""
        details = {"error": str(error)}
        if context:
            details["context"] = context
        return self.log(
            agent=agent,
            action=action,
            details=details,
            status="failure"
        )

    def query(self, limit=100, agent=None, action=None, status=None):
        """Query recent audit logs (for debugging)"""
        log_file = self._get_current_log_file()
        if not log_file.exists():
            return []

        entries = []
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    entry = json.loads(line)
                    if agent and entry.get('agent') != agent:
                        continue
                    if action and entry.get('action') != action:
                        continue
                    if status and entry.get('status') != status:
                        continue
                    entries.append(entry)

        return entries[-limit:]

# Global instance for easy importing
_default_logger = None

def get_logger():
    global _default_logger
    if _default_logger is None:
        _default_logger = AuditLogger()
    return _default_logger

if __name__ == "__main__":
    # Test the audit logger
    logger = get_logger()

    print("Testing Audit Logger...")
    logger.log_system_event("startup", {"version": "1.0", "mode": "test"})
    logger.log_decision(cycle=1, trend="AI automation", decision="create_content")
    logger.log_kill_switch("activated", reason="maintenance")
    logger.log_kill_switch("deactivated")
    logger.log_error("CEO", "decision_failed", "Connection timeout", {"cycle": 2})

    print(f"Logs written to: {logger.log_dir}")
    print("\nLast 5 entries:")
    for entry in logger.query(limit=5):
        print(f"  {entry['timestamp']} | {entry['agent']} | {entry['action']} | {entry['status']}")
