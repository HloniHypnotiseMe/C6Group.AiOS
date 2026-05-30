"""
C6 Neural Forge - LOCAL CEO AGENT (No VPS dependency)
Runs entirely on your laptop
"""

import json
import os
from datetime import datetime
from pathlib import Path

class LocalMemory:
    def __init__(self):
        self.memory_file = Path("C:/Users/samsung/agent-os/memory_local.json")
        self.load()
    
    def load(self):
        if self.memory_file.exists():
            with open(self.memory_file, 'r') as f:
                self.data = json.load(f)
        else:
            self.data = {"cycles": 0, "videos": 0, "decisions": []}
    
    def save(self):
        with open(self.memory_file, 'w') as f:
            json.dump(self.data, f, indent=2)
    
    def increment_cycle(self):
        self.data["cycles"] = self.data.get("cycles", 0) + 1
        self.save()
        return self.data["cycles"]
    
    def add_decision(self, decision):
        self.data["decisions"].insert(0, {
            "decision": decision,
            "time": str(datetime.now())
        })
        self.data["decisions"] = self.data["decisions"][:100]
        self.save()

class CEOAgent:
    def __init__(self):
        print("\n" + "="*50)
        print("C6 CEO AGENT - LOCAL MODE")
        print(f"Time: {datetime.now()}")
        print("="*50)
        
        self.memory = LocalMemory()
        self.cycle = self.memory.increment_cycle()
        print(f"Cycle: {self.cycle}")
    
    def think(self):
        print("\n[CEO] Running tasks...\n")
        
        trends = [
            "AI automation",
            "faceless YouTube channels", 
            "crypto recovery",
            "AI businesses",
            "passive income AI"
        ]
        
        top_trend = trends[0]
        decision = f"Create content about {top_trend}"
        
        print(f"Top trend: {top_trend}")
        print(f"Decision: {decision}")
        
        self.memory.add_decision(decision)
        
        print("\n" + "="*50)
        print(f"CEO Agent Ready - Cycle {self.cycle}")
        print("="*50 + "\n")
        
        return {"status": "success", "cycle": self.cycle}

if __name__ == "__main__":
    agent = CEOAgent()
    agent.think()
