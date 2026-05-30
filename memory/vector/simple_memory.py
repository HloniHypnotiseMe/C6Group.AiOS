import sqlite3
import json
import hashlib
from datetime import datetime
from pathlib import Path

class SimpleMemory:
    def __init__(self):
        self.db_path = Path("C:/Users/VAT PRODUCTION/agent-os/simple_memory.db")
        self._init_db()

    def _init_db(self):
        self.conn = sqlite3.connect(str(self.db_path))
        self.cursor = self.conn.cursor()
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS memories (
                id TEXT PRIMARY KEY,
                text TEXT,
                keywords TEXT,
                timestamp TEXT,
                metadata TEXT
            )
        ''')
        self.conn.commit()

    def _extract_keywords(self, text):
        words = text.lower().split()
        stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        keywords = [w for w in words if w not in stopwords and len(w) > 3]
        return ' '.join(keywords[:10])

    def store(self, text, metadata=None):
        doc_id = hashlib.md5(f"{text}{datetime.now()}".encode()).hexdigest()[:16]
        keywords = self._extract_keywords(text)
        metadata_str = json.dumps(metadata or {})

        self.cursor.execute(
            "INSERT INTO memories (id, text, keywords, timestamp, metadata) VALUES (?, ?, ?, ?, ?)",
            (doc_id, text, keywords, str(datetime.now()), metadata_str)
        )
        self.conn.commit()
        print(f"[Memory] Stored: {text[:50]}...")
        return doc_id

    def search(self, query, limit=3):
        keywords = self._extract_keywords(query)
        words = keywords.split()
        
        if not words:
            return []
        
        conditions = ' OR '.join(['keywords LIKE ?'] * len(words))
        params = [f'%{w}%' for w in words]
        
        self.cursor.execute(f'''
            SELECT text, timestamp, metadata 
            FROM memories 
            WHERE {conditions}
            ORDER BY timestamp DESC
            LIMIT ?
        ''', params + [limit])
        
        results = self.cursor.fetchall()
        return [{"text": r[0], "timestamp": r[1], "metadata": r[2]} for r in results]

    def close(self):
        self.conn.close()
