import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path.cwd()))

# Try to import
from config.loader import get_system_config
print("Import successful!")
config = get_system_config()
print(f"Root path: {config['paths']['agent_os_root']}")
