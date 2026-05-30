"""
Market Intelligence - Trend Scanner
Leverages existing CEO trend intelligence
"""

import sys
from pathlib import Path

agent_os_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(agent_os_root))

import json
import sqlite3
from datetime import datetime
from config.loader import get_models_config
from audit.audit_logger import get_logger

class MarketScanner:
    def __init__(self, db_path=None):
        if db_path is None:
            db_path = Path(__file__).parent / "market_intelligence.db"
        self.db_path = db_path
        self.audit = get_logger()
        self.config = get_models_config()
        self._init_db()

    def _init_db(self):
        """Initialize database tables"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS daily_reports (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    report_date TEXT UNIQUE,
                    top_trend TEXT,
                    top_score INTEGER,
                    all_trends TEXT,
                    generated_at TEXT
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS opportunities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT,
                    trend TEXT,
                    score INTEGER,
                    reasoning TEXT
                )
            """)

    def get_trends(self):
        """Get trends from configuration"""
        return self.config.get('trends', {}).get('topics', [
            "AI automation", "faceless YouTube", "crypto recovery",
            "AI businesses", "passive income AI"
        ])

    def score_trend(self, trend):
        """Score a trend based on relevance and momentum"""
        base_score = 70
        keywords = {
            "AI": 10, "automation": 8, "business": 7,
            "crypto": 6, "passive": 5, "income": 5,
            "YouTube": 4, "faceless": 3
        }
        extra = sum(v for k, v in keywords.items() if k.lower() in trend.lower())
        return min(100, base_score + extra)

    def scan(self):
        """Perform a full market scan"""
        trends = self.get_trends()
        scored = [(trend, self.score_trend(trend)) for trend in trends]
        scored.sort(key=lambda x: x[1], reverse=True)

        self.audit.log(
            agent="MARKET_INTELLIGENCE",
            action="scan_completed",
            details={"trends_scanned": len(trends), "top_trend": scored[0][0] if scored else None},
            status="success"
        )

        return scored

    def save_daily_report(self, scored_trends):
        """Save today's scan to database"""
        today = datetime.now().date().isoformat()
        top_trend, top_score = scored_trends[0] if scored_trends else ("None", 0)

        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT OR REPLACE INTO daily_reports (report_date, top_trend, top_score, all_trends, generated_at)
                VALUES (?, ?, ?, ?, ?)
            """, (today, top_trend, top_score, json.dumps(scored_trends), datetime.now().isoformat()))

        return {"date": today, "top_trend": top_trend, "top_score": top_score}

    def get_todays_report(self):
        """Get today's report if it exists"""
        today = datetime.now().date().isoformat()
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT top_trend, top_score, all_trends FROM daily_reports WHERE report_date = ?",
                (today,)
            )
            row = cursor.fetchone()
            if row:
                return {
                    "top_trend": row[0],
                    "top_score": row[1],
                    "all_trends": json.loads(row[2])
                }
        return None

if __name__ == "__main__":
    scanner = MarketScanner()
    print("=== Market Intelligence Scanner ===\n")
    trends = scanner.scan()
    print("Scored Trends:")
    for trend, score in trends:
        print(f"  {score:3d} - {trend}")
    scanner.save_daily_report(trends)
    print(f"\nSaved report for {datetime.now().date().isoformat()}")
