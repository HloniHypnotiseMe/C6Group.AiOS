import redis
from datetime import datetime

def decide():
    print("\n" + "="*40)
    print("CEO DECISION ENGINE")
    print(f"Time: {datetime.now()}")
    print("="*40 + "\n")
    
    try:
        r = redis.Redis(
            host='159.69.107.150',
            port=6379,
            password='C6SecureRedis2026',
            decode_responses=True
        )
        
        trend = r.get('top_trend')
        
        if trend:
            print(f"Top opportunity: {trend}")
            print("Decision: CREATE CONTENT")
            r.set('latest_decision', f"Create content about {trend}")
        else:
            print("No trend data found")
            print("Decision: WAIT FOR TRENDS")
            
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*40)
    print("DECISION COMPLETE")
    print("="*40 + "\n")

if __name__ == "__main__":
    decide()