#!/usr/bin/env python3
"""
Market Intelligence - Daily Run
Generates report and sends to subscribers
"""

import sys
from pathlib import Path

agent_os_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(agent_os_root))

from datetime import datetime
from products.market_intelligence.scanner import MarketScanner
from products.market_intelligence.report_builder import MarketReportBuilder
from products.market_intelligence.subscribers import SubscriberManager
from audit.audit_logger import get_logger

def run_daily_intelligence():
    """Run the daily market intelligence workflow"""
    audit = get_logger()
    audit.log_system_event("market_intelligence_started", {"time": datetime.now().isoformat()})

    print("\n" + "="*50)
    print("C6 MARKET INTELLIGENCE - DAILY RUN")
    print(f"Time: {datetime.now()}")
    print("="*50 + "\n")

    # Step 1: Scan trends
    print("[1/4] Scanning trends...")
    scanner = MarketScanner()
    trends = scanner.scan()
    print(f"      Found {len(trends)} trends")

    # Step 2: Save to database
    print("[2/4] Saving to database...")
    scanner.save_daily_report(trends)

    # Step 3: Build report
    print("[3/4] Building report...")
    builder = MarketReportBuilder()
    report_text = builder.build_daily_report(trends, format="text")
    report_json = builder.build_daily_report(trends, format="json")
    builder.save_report(trends, format="json")
    builder.save_report(trends, format="text")

    # Step 4: Send to subscribers
    print("[4/4] Sending to subscribers...")
    subscribers = SubscriberManager()
    subscriber_list = subscribers.get_subscribers()
    print(f"      Subscribers: {len(subscriber_list)}")

    if subscriber_list:
        result = subscribers.send_report_to_subscribers(report_text)
        print(f"      Notifications sent: {len(result)}")
    else:
        print("      No subscribers yet. Add one with: python subscribers.py")

    audit.log_system_event("market_intelligence_completed", {
        "trends_found": len(trends),
        "subscribers_notified": len(subscriber_list)
    })

    print("\n" + "="*50)
    print("MARKET INTELLIGENCE COMPLETE")
    print("="*50 + "\n")

    return report_text

if __name__ == "__main__":
    run_daily_intelligence()
