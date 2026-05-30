"""
Semantic Memory Client - Working Version
"""

import urllib.request
import urllib.error
import json
import time
from datetime import datetime

QDRANT_URL = "http://159.69.107.150:6333"
COLLECTION = "c6_semantic_memory"

class SemanticMemory:
    def __init__(self):
        self._ensure_collection()
    
    def _request(self, method, path, data=None):
        url = f"{QDRANT_URL}{path}"
        req = urllib.request.Request(url, method=method)
        req.add_header('Content-Type', 'application/json')
        if data:
            req.data = json.dumps(data).encode('utf-8')
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                return json.loads(resp.read().decode())
        except Exception as e:
            print(f"Request error: {e}")
            return None
    
    def _ensure_collection(self):
        # Check if collection exists
        resp = self._request("GET", "/collections")
        if resp and COLLECTION in str(resp):
            print(f"[OK] Collection exists: {COLLECTION}")
            return
        
        # Create collection
        schema = {
            "vectors": {
                "size": 384,
                "distance": "Cosine"
            }
        }
        result = self._request("PUT", f"/collections/{COLLECTION}", schema)
        if result:
            print(f"[OK] Collection created: {COLLECTION}")
    
    def store(self, text, vector):
        point = {
            "id": abs(hash(text)) % 1000000,
            "vector": vector,
            "payload": {
                "text": text,
                "time": str(datetime.now())
            }
        }
        data = {"points": [point]}
        result = self._request("PUT", f"/collections/{COLLECTION}/points", data)
        if result:
            print(f"[OK] Stored: {text[:40]}...")
        return result
    
    def search(self, vector, limit=3):
        data = {"vector": vector, "limit": limit, "with_payload": True}
        result = self._request("POST", f"/collections/{COLLECTION}/points/search", data)
        if result and "result" in result:
            return result["result"]
        return []

def simple_embed(text):
    vec = [0.0] * 384
    for i, ch in enumerate(text):
        vec[i % 384] += ord(ch) / 1000.0
    norm = sum(x*x for x in vec) ** 0.5
    return [x/norm for x in vec] if norm > 0 else vec

if __name__ == "__main__":
    print("\n" + "="*40)
    print("SEMANTIC MEMORY TEST")
    print("="*40 + "\n")
    
    mem = SemanticMemory()
    
    # Store
    text = "AI automation is the top business trend for 2026"
    vec = simple_embed(text)
    mem.store(text, vec)
    
    # Search
    results = mem.search(vec)
    print(f"\nFound {len(results)} similar memories")
    for r in results:
        payload = r.get("payload", {})
        print(f"  - {payload.get('text', 'unknown')[:50]}")
    
    print("\n" + "="*40)
    print("TEST COMPLETE")
    print("="*40)