"""
Local Semantic Memory - ChromaDB (No VPS needed)
"""

import chromadb
from chromadb.utils import embedding_functions
from datetime import datetime
import hashlib

class LocalSemanticMemory:
    def __init__(self):
        # Use persistent client (saves to disk)
        self.client = chromadb.PersistentClient(path="C:/Users/samsung/agent-os/chroma_db")
        # Use simple embedding function (no API key needed)
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
        
        # Get or create collection
        try:
            self.collection = self.client.get_collection("c6_memory")
            print("[Semantic] Loaded existing collection")
        except:
            self.collection = self.client.create_collection(
                name="c6_memory",
                embedding_function=self.embedding_fn
            )
            print("[Semantic] Created new collection")
    
    def store(self, text, metadata=None):
        """Store text in semantic memory"""
        doc_id = hashlib.md5(f"{text}{datetime.now()}".encode()).hexdigest()[:16]
        
        if metadata is None:
            metadata = {"timestamp": str(datetime.now())}
        else:
            metadata["timestamp"] = str(datetime.now())
        
        self.collection.add(
            documents=[text],
            metadatas=[metadata],
            ids=[doc_id]
        )
        print(f"[Semantic] Stored: {text[:50]}...")
        return doc_id
    
    def search(self, query, n_results=3):
        """Search for similar memories"""
        results = self.collection.query(query_texts=[query], n_results=n_results)
        return results
    
    def get_all(self):
        """Get all memories"""
        return self.collection.get()

if __name__ == "__main__":
    print("\n" + "="*50)
    print("LOCAL SEMANTIC MEMORY TEST")
    print("="*50)
    
    memory = LocalSemanticMemory()
    
    # Store some memories
    memory.store("AI automation is the top trend for 2026")
    memory.store("Faceless YouTube channels are growing rapidly")
    memory.store("Crypto market showing recovery signs")
    
    # Search
    results = memory.search("artificial intelligence trends")
    print(f"\nSearch results for 'AI trends':")
    if results['documents']:
        for i, doc in enumerate(results['documents'][0]):
            print(f"  {i+1}. {doc[:60]}...")
    
    print("\n" + "="*50)
    print("TEST COMPLETE")
    print("="*50)
