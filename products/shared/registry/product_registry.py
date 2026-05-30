"""
C6 Group - Product Registry
Central registry of all C6 Group products
"""

import json
from pathlib import Path
from typing import Dict, List

class ProductRegistry:
    def __init__(self):
        self.registry_file = Path(__file__).parent / "products.json"
        self._init_registry()

    def _init_registry(self):
        if not self.registry_file.exists():
            products = {
                "success_gps": {
                    "name": "Success GPS",
                    "description": "Personal success mentor app",
                    "version": "0.1.0",
                    "status": "planned",
                    "features": ["goal_setting", "daily_actions", "progress_tracking"]
                },
                "doctor_booking": {
                    "name": "Doctor Booking System",
                    "description": "Queue management and appointment system",
                    "version": "0.1.0",
                    "status": "planned",
                    "features": ["booking", "queue", "notifications", "prescriptions"]
                },
                "market_intelligence": {
                    "name": "Market Intelligence",
                    "description": "AI-powered market trend reports",
                    "version": "0.1.0",
                    "status": "planned",
                    "features": ["trend_scanning", "reports", "alerts"]
                }
            }
            with open(self.registry_file, 'w') as f:
                json.dump(products, f, indent=2)

    def get_all_products(self) -> Dict:
        with open(self.registry_file, 'r') as f:
            return json.load(f)

    def get_product(self, product_id: str) -> Dict:
        products = self.get_all_products()
        return products.get(product_id, {})

    def update_status(self, product_id: str, status: str):
        products = self.get_all_products()
        if product_id in products:
            products[product_id]['status'] = status
            with open(self.registry_file, 'w') as f:
                json.dump(products, f, indent=2)

if __name__ == "__main__":
    registry = ProductRegistry()
    print("Available products:")
    for pid, info in registry.get_all_products().items():
        print(f"  {pid}: {info['name']} ({info['status']})")
