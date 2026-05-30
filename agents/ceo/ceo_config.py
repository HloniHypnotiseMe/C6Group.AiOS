import json
import os
import random
import sys
from datetime import datetime
from pathlib import Path

# Add the agent-os root and config directory explicitly
agent_os_root = Path(__file__).parent.parent
sys.path.insert(0, str(agent_os_root))
sys.path.insert(0, str(agent_os_root / 'config'))

# Try to import - using different syntax
try:
    from loader import get_system_config, get_models_config, get_business_config
except ImportError:
    from config.loader import get_system_config, get_models_config, get_business_config

# Get configs
SYSTEM_CONFIG = get_system_config()
MODELS_CONFIG = get_models_config()
BUSINESS_CONFIG = get_business_config()

# Get paths from config
AGENT_OS_ROOT = SYSTEM_CONFIG['paths']['agent_os_root']
MEMORY_FILE = Path(SYSTEM_CONFIG['paths']['memory_file'])
KILL_SWITCH = Path(SYSTEM_CONFIG['paths']['control_dir']) / "STOP_ALL.flag"

# Check for kill switch
if KILL_SWITCH.exists():
    print(f"[{datetime.now()}] EMERGENCY STOP: Kill switch active. CEO will not run.")
    print(f"Remove {KILL_SWITCH} to resume operations.")
    sys.exit(0)

# Import memory module
from memory.vector.simple_memory import SimpleMemory

class LocalMemory:
    def __init__(self):
        self.memory_file = MEMORY_FILE
        self.load()

    def load(self):
        if self.memory_file.exists():
            with open(self.memory_file, 'r') as f:
                self.data = json.load(f)
            if "last_topics" not in self.data:
                self.data["last_topics"] = []
            if "decisions" not in self.data:
                self.data["decisions"] = []
            if "cycles" not in self.data:
                self.data["cycles"] = 0
            self.save()
        else:
            self.data = {"cycles": 0, "decisions": [], "last_topics": []}

    def save(self):
        with open(self.memory_file, 'w') as f:
            json.dump(self.data, f, indent=2)

    def increment_cycle(self):
        self.data["cycles"] = self.data.get("cycles", 0) + 1
        self.save()
        return self.data["cycles"]

    def add_decision(self, decision, topic):
        self.data["decisions"].insert(0, {
            "decision": decision,
            "topic": topic,
            "time": str(datetime.now())
        })
        self.data["decisions"] = self.data["decisions"][:100]
        self.data["last_topics"].insert(0, topic)
        self.data["last_topics"] = self.data["last_topics"][:10]
        self.save()

    def get_last_topic(self):
        return self.data["last_topics"][0] if self.data["last_topics"] else None

class CEOAgent:
    def __init__(self):
        print("\n" + "="*50)
        print("C6 CEO AGENT - CONFIG DRIVEN")
        print(f"Company: {BUSINESS_CONFIG['company']['name']}")
        print(f"Time: {datetime.now()}")
        print("="*50)

        self.memory = LocalMemory()
        self.semantic = SimpleMemory()
        self.cycle = self.memory.increment_cycle()
        print(f"Cycle: {self.cycle}")
        print(f"Config source: {SYSTEM_CONFIG['paths']['config_dir']}")

    def think(self):
        print("\n[CEO] Running tasks...\n")

        all_trends = MODELS_CONFIG.get('trends', {}).get('topics', [
            "AI automation", "faceless YouTube channels", "crypto recovery"
        ])

        last_topic = self.memory.get_last_topic()
        available = [t for t in all_trends if t != last_topic] if last_topic else all_trends
        top_trend = random.choice(available) if available else all_trends[0]

        decision = f"Create content about {top_trend}"

        print(f"Selected trend: {top_trend}")
        print(f"Decision: {decision}")

        self.semantic.store(f"Cycle {self.cycle}: {decision}")

        similar = self.semantic.search(top_trend)
        if similar:
            print(f"\n[Recall] Similar past content:")
            for r in similar[:2]:
                print(f"  -> {r['text'][:60]}...")

        self.memory.add_decision(decision, top_trend)

        print("\n" + "="*50)
        print(f"CEO Agent Ready - Cycle {self.cycle}")
        print("="*50 + "\n")

        return {"status": "success", "cycle": self.cycle, "trend": top_trend}

if __name__ == "__main__":
    agent = CEOAgent()
    result = agent.think()
    print(f"Result: {result}")
