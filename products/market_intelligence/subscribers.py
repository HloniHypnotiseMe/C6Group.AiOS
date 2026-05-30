"""
Market Intelligence - Subscriber Manager
Manages product subscribers and email delivery
"""

import sys
from pathlib import Path

agent_os_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(agent_os_root))

import sqlite3
from datetime import datetime
from products.shared.users.user_registry import UserRegistry
from products.shared.notifications.notify import NotificationService

class SubscriberManager:
    def __init__(self, db_path=None):
        if db_path is None:
            db_path = Path(__file__).parent / "market_intelligence.db"
        self.db_path = db_path
        self.user_registry = UserRegistry()
        self.notify = NotificationService()
        self._init_subscribers()

    def _init_subscribers(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS subscribers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE,
                    name TEXT,
                    tier TEXT DEFAULT 'free',
                    subscribed_at TEXT,
                    last_sent TEXT
                )
            """)

    def add_subscriber(self, email, name, tier="free"):
        """Add a new subscriber"""
        subscribed_at = datetime.now().isoformat()
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute(
                    "INSERT INTO subscribers (email, name, tier, subscribed_at) VALUES (?, ?, ?, ?)",
                    (email, name, tier, subscribed_at)
                )
            # Also create user in user registry
            self.user_registry.create_user(email, name, "temp_password_change_me")
            return {"success": True, "email": email}
        except sqlite3.IntegrityError:
            return {"success": False, "error": "Email already subscribed"}

    def get_subscribers(self, tier=None):
        """Get all subscribers, optionally filtered by tier"""
        with sqlite3.connect(self.db_path) as conn:
            if tier:
                cursor = conn.execute(
                    "SELECT email, name, tier, subscribed_at FROM subscribers WHERE tier = ?",
                    (tier,)
                )
            else:
                cursor = conn.execute("SELECT email, name, tier, subscribed_at FROM subscribers")
            return [{"email": row[0], "name": row[1], "tier": row[2], "subscribed_at": row[3]} for row in cursor]

    def send_report_to_subscribers(self, report_text, subject="C6 Market Intelligence Report"):
        """Send the daily report to all subscribers"""
        subscribers = self.get_subscribers()
        results = []
        for sub in subscribers:
            result = self.notify.send_email(sub['email'], subject, report_text)
            results.append(result)
        return results

if __name__ == "__main__":
    sm = SubscriberManager()
    print("Subscriber Manager initialized")
    print(f"Current subscribers: {len(sm.get_subscribers())}")
