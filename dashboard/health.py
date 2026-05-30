#!/usr/bin/env python3
"""
Health check endpoint for monitoring
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import json
from datetime import datetime
from config.loader import get_system_config

def health_check():
    """Run health checks and return status"""
    config = get_system_config()
    
    checks = {
        "config_loaded": True,
        "memory_file": Path(config['paths']['memory_file']).exists(),
        "audit_dir": Path(config['paths']['logs_dir']).exists(),
        "kill_switch": Path(config['paths']['control_dir']).exists(),
    }
    
    all_healthy = all(checks.values())
    
    return {
        "status": "healthy" if all_healthy else "degraded",
        "timestamp": datetime.now().isoformat(),
        "checks": checks
    }

if __name__ == "__main__":
    import json
    print(json.dumps(health_check(), indent=2))
