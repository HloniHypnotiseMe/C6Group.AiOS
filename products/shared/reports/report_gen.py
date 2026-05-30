"""
C6 Group - Report Generator
Shared reporting for all products
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

class ReportGenerator:
    def __init__(self):
        self.reports_dir = Path(__file__).parent / "output"
        self.reports_dir.mkdir(exist_ok=True)

    def generate_metrics_report(self, metrics: Dict[str, Any], user_id: str = None) -> Dict[str, Any]:
        """Generate a metrics report"""
        report = {
            "type": "metrics",
            "generated_at": datetime.now().isoformat(),
            "user_id": user_id,
            "data": metrics,
            "summary": {
                "total_cycles": metrics.get("total_cycles", 0),
                "status": "healthy" if metrics.get("total_errors", 1) < 5 else "degraded"
            }
        }
        return report

    def generate_decision_report(self, decisions: list) -> Dict[str, Any]:
        """Generate a decision history report"""
        return {
            "type": "decisions",
            "generated_at": datetime.now().isoformat(),
            "total_decisions": len(decisions),
            "recent_decisions": decisions[:10]
        }

    def save_report(self, report: Dict[str, Any], report_name: str) -> Path:
        """Save a report to disk"""
        filename = self.reports_dir / f"{report_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        return filename

if __name__ == "__main__":
    gen = ReportGenerator()
    test_metrics = {"total_cycles": 10, "total_errors": 1}
    report = gen.generate_metrics_report(test_metrics)
    print("Sample report:", json.dumps(report, indent=2))
