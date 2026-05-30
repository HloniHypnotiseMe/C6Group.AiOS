"""
C6 Group - User Registry
Shared user management for all products
"""

import sqlite3
import hashlib
import secrets
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

class UserRegistry:
    def __init__(self, db_path=None):
        if db_path is None:
            db_path = Path(__file__).parent / "users.db"
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    name TEXT,
                    password_hash TEXT,
                    status TEXT DEFAULT 'active',
                    role TEXT DEFAULT 'user',
                    created_at TEXT NOT NULL,
                    last_login TEXT,
                    metadata TEXT
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS user_products (
                    user_id TEXT,
                    product_id TEXT,
                    subscribed_at TEXT,
                    expires_at TEXT,
                    status TEXT DEFAULT 'active',
                    PRIMARY KEY (user_id, product_id)
                )
            """)

    def _hash_password(self, password: str) -> str:
        salt = secrets.token_hex(16)
        hash_obj = hashlib.sha256(f"{salt}:{password}".encode()).hexdigest()
        return f"{salt}:{hash_obj}"

    def _verify_password(self, password: str, stored: str) -> bool:
        salt, hash_val = stored.split(':')
        computed = hashlib.sha256(f"{salt}:{password}".encode()).hexdigest()
        return computed == hash_val

    def create_user(self, email: str, name: str, password: str) -> Dict[str, Any]:
        """Create a new user"""
        user_id = secrets.token_hex(8)
        password_hash = self._hash_password(password)
        created_at = datetime.now().isoformat()

        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute(
                    "INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
                    (user_id, email, name, password_hash, created_at)
                )
            return {"success": True, "user_id": user_id, "email": email}
        except sqlite3.IntegrityError:
            return {"success": False, "error": "Email already exists"}

    def authenticate(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate a user"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT id, email, name, password_hash, status FROM users WHERE email = ?",
                (email,)
            )
            row = cursor.fetchone()
            if not row:
                return None
            if not self._verify_password(password, row[3]):
                return None
            if row[4] != 'active':
                return None

            # Update last login
            conn.execute(
                "UPDATE users SET last_login = ? WHERE id = ?",
                (datetime.now().isoformat(), row[0])
            )
            return {"user_id": row[0], "email": row[1], "name": row[2]}

    def subscribe_to_product(self, user_id: str, product_id: str, duration_days: int = 30) -> Dict[str, Any]:
        """Subscribe a user to a product"""
        subscribed_at = datetime.now().isoformat()
        expires_at = None
        if duration_days:
            from datetime import timedelta
            expires_at = (datetime.now() + timedelta(days=duration_days)).isoformat()

        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO user_products (user_id, product_id, subscribed_at, expires_at, status) VALUES (?, ?, ?, ?, 'active')",
                (user_id, product_id, subscribed_at, expires_at)
            )
        return {"success": True, "product": product_id, "expires_at": expires_at}

    def get_user_products(self, user_id: str) -> list:
        """Get all products a user is subscribed to"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT product_id, subscribed_at, expires_at, status FROM user_products WHERE user_id = ? AND status = 'active'",
                (user_id,)
            )
            return [{"product_id": row[0], "subscribed_at": row[1], "expires_at": row[2]} for row in cursor]

if __name__ == "__main__":
    registry = UserRegistry()
    print("User Registry initialized at:", registry.db_path)
    print("\nTest commands:")
    print("  registry.create_user('test@example.com', 'Test User', 'password123')")
    print("  registry.authenticate('test@example.com', 'password123')")
