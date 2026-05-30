"""
Department Tracker for C6 Group
Tracks status of all company departments
"""

import json
from pathlib import Path
from datetime import datetime

DEPARTMENTS_FILE = Path("C:/Users/samsung/agent-os/company_departments.json")
STATUS_FILE = Path("C:/Users/samsung/agent-os/department_status.json")

def load_departments():
    with open(DEPARTMENTS_FILE, 'r') as f:
        return json.load(f)

def load_status():
    if STATUS_FILE.exists():
        with open(STATUS_FILE, 'r') as f:
            return json.load(f)
    return {"last_updated": str(datetime.now()), "departments": {}}

def save_status(status):
    with open(STATUS_FILE, 'w') as f:
        json.dump(status, f, indent=2)

def update_status():
    company = load_departments()
    status = load_status()
    
    print("\n" + "="*60)
    print("C6 GROUP - DEPARTMENT STATUS")
    print(f"Time: {datetime.now()}")
    print("="*60)
    
    for dept in company['departments']:
        print(f"\n📁 {dept['name']} [{dept['id']}]")
        print(f"   Status: {dept['status']}")
        print(f"   Agents: {', '.join(dept['agents']) if dept['agents'] else 'None'}")
        print(f"   Functions: {', '.join(dept['functions'])}")
    
    print("\n" + "="*60)
    print(f"Total Departments: {len(company['departments'])}")
    print(f"Total Agents: {company['total_agents']}")
    print(f"Active Agents: {company['active_agents']}")
    print("="*60)

if __name__ == "__main__":
    update_status()
