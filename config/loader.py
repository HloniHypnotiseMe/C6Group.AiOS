# Configuration Loader for C6 Group agents
# Usage: from config.loader import get_config

import yaml
from pathlib import Path

CONFIG_DIR = Path(__file__).parent

_config_cache = {}

def load_config(config_name):
    """Load a YAML configuration file"""
    config_path = CONFIG_DIR / config_name
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")
    
    with open(config_path, 'r') as f:
        return yaml.safe_load(f)

def get_system_config():
    """Load system configuration"""
    if 'system' not in _config_cache:
        _config_cache['system'] = load_config('system.yaml')
    return _config_cache['system']

def get_business_config():
    """Load business configuration"""
    if 'business' not in _config_cache:
        _config_cache['business'] = load_config('business.yaml')
    return _config_cache['business']

def get_models_config():
    """Load AI models configuration"""
    if 'models' not in _config_cache:
        _config_cache['models'] = load_config('ai_models.yaml')
    return _config_cache['models']

def get_email_config():
    """Load email configuration"""
    if 'email' not in _config_cache:
        _config_cache['email'] = load_config('email.yaml')
    return _config_cache['email']

def get_all_configs():
    """Load all configurations"""
    return {
        'system': get_system_config(),
        'business': get_business_config(),
        'models': get_models_config(),
        'email': get_email_config()
    }

if __name__ == "__main__":
    # Test the configuration loader
    print("Testing configuration loader...")
    print("\n--- SYSTEM CONFIG ---")
    print(f"Root path: {get_system_config()['paths']['agent_os_root']}")
    print(f"Control room port: {get_system_config()['services']['control_room']['port']}")
    
    print("\n--- BUSINESS CONFIG ---")
    print(f"Company: {get_business_config()['company']['name']}")
    print(f"Email: {get_business_config()['company']['emails']['info']}")
    
    print("\n--- AI MODELS CONFIG ---")
    print(f"Primary model: {get_models_config()['models']['primary']['name']}")
    print(f"Decision interval: {get_models_config()['decision']['interval_minutes']} minutes")
    
    print("\n✅ Configuration loader working")
