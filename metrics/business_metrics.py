"""
C6 Group - Business Metrics Tracker
Tracks key performance indicators for the AI business
"""

import json
from datetime import datetime
from pathlib import Path

class MetricsTracker:
    def __init__(self):
        self.metrics_file = Path(__file__).parent / "metrics.json"
        self.load()

    def load(self):
        if self.metrics_file.exists():
            with open(self.metrics_file, 'r') as f:
                self.data = json.load(f)
        else:
            self.data = {
                "created": str(datetime.now()),
                "totals": {
                    "ceo_cycles": 0,
                    "decisions_made": 0,
                    "content_suggestions": 0,
                    "errors": 0
                },
                "daily": {},
                "last_updated": str(datetime.now())
            }

    def save(self):
        self.data["last_updated"] = str(datetime.now())
        with open(self.metrics_file, 'w') as f:
            json.dump(self.data, f, indent=2)

    def increment(self, metric_name, value=1):
        """Increment a total metric"""
        if metric_name not in self.data["totals"]:
            self.data["totals"][metric_name] = 0
        self.data["totals"][metric_name] += value
        self.save()

    def record_daily(self, date, metrics):
        """Record daily metrics"""
        self.data["daily"][date] = metrics
        self.save()

    def get_summary(self):
        """Get a summary of all metrics"""
        return {
            "total_cycles": self.data["totals"].get("ceo_cycles", 0),
            "total_decisions": self.data["totals"].get("decisions_made", 0),
            "total_content": self.data["totals"].get("content_suggestions", 0),
            "total_errors": self.data["totals"].get("errors", 0),
            "last_updated": self.data["last_updated"]
        }

if __name__ == "__main__":
    tracker = MetricsTracker()
    print("Current Metrics:")
    print(json.dumps(tracker.get_summary(), indent=2))
