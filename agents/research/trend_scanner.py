import redis
from datetime import datetime

trends = [
    "AI automation",
    "faceless YouTube channels",
    "crypto recovery",
    "AI businesses",
    "passive income AI"
]

def scan_trends():
    print("\n" + "="*40)
    print("TREND INTELLIGENCE ACTIVE")
    print(f"Time: {datetime.now()}")
    print("="*40 + "\n")
    
    for trend in trends:
        print(f"  -> {trend}")
    
    top_trend = trends[0]
    print(f"\n[INFO] Top trend: {top_trend}")
    
    try:
        r = redis.Redis(
            host='159.69.107.150',
            port=6379,
            password='C6SecureRedis2026',
            decode_responses=True
        )
        r.set('top_trend', top_trend)
        print("[INFO] Saved to Redis")
    except Exception as e:
        print(f"[ERROR] Redis: {e}")
    
    print("\n" + "="*40)
    print("TREND SCAN COMPLETE")
    print("="*40 + "\n")

if __name__ == "__main__":
    scan_trends()