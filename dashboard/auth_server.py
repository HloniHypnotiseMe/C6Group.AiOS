"""
C6 Control Room - Authenticated Server
"""

from flask import Flask, jsonify, send_from_directory, request, Response
import json
import os
import subprocess
from pathlib import Path
from functools import wraps
import base64

app = Flask(__name__, static_folder='.', template_folder='.')
AGENT_OS_PATH = Path('C:/Users/VAT PRODUCTION/agent-os')
MEMORY_FILE = AGENT_OS_PATH / 'memory_local.json'
PID_FILE = AGENT_OS_PATH / 'ceo.pid'
HTPASSWD_FILE = Path(__file__).parent / '.htpasswd'

def check_auth(username, password):
    """Check if username/password is valid"""
    if not HTPASSWD_FILE.exists():
        return True  # No auth file, allow access
    with open(HTPASSWD_FILE, 'r') as f:
        for line in f:
            stored_user, stored_hash = line.strip().split(':', 1)
            if stored_user == username:
                # Verify password (Apache htpasswd format)
                import crypt
                return crypt.crypt(password, stored_hash) == stored_hash
    return False

def authenticate():
    """Send 401 response for authentication"""
    return Response(
        'Authentication required', 401,
        {'WWW-Authenticate': 'Basic realm="C6 Control Room"'}
    )

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated

def is_ceo_running():
    if PID_FILE.exists():
        try:
            with open(PID_FILE, 'r') as f:
                pid = int(f.read().strip())
            os.kill(pid, 0)
            return True
        except:
            pass
    return False

@app.route('/')
@requires_auth
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/status')
@requires_auth
def status():
    memory = {'cycles': 0, 'decisions': []}
    if MEMORY_FILE.exists():
        try:
            with open(MEMORY_FILE, 'r') as f:
                memory = json.load(f)
        except:
            pass
    decisions = memory.get('decisions', [])
    return jsonify({
        'cycles': memory.get('cycles', 0),
        'last_trend': decisions[0].get('topic') if decisions else None,
        'last_decision': decisions[0].get('decision') if decisions else None,
        'decisions': decisions[:10],
        'trends': ['AI automation', 'faceless YouTube', 'crypto recovery', 'AI businesses', 'passive income AI'],
        'ceo_running': is_ceo_running(),
        'moneyprinter_ready': True
    })

@app.route('/api/command', methods=['POST'])
@requires_auth
def command():
    data = request.get_json()
    cmd = data.get('command', '').lower()
    
    if 'trend' in cmd:
        return jsonify({'reply': 'Top trends: AI automation, faceless YouTube, crypto recovery, AI businesses, passive income AI'})
    elif 'video' in cmd:
        return jsonify({'reply': 'Starting video generation. MoneyPrinterV2 is ready.'})
    elif 'run' in cmd or 'start' in cmd:
        bat_file = AGENT_OS_PATH / 'run_ceo_loop.bat'
        if bat_file.exists():
            proc = subprocess.Popen([str(bat_file)], shell=True, creationflags=subprocess.CREATE_NO_WINDOW)
            with open(PID_FILE, 'w') as f:
                f.write(str(proc.pid))
            return jsonify({'reply': 'CEO started.', 'action': 'refresh'})
        return jsonify({'reply': 'CEO batch file not found.'})
    elif 'stop' in cmd:
        if is_ceo_running():
            with open(PID_FILE, 'r') as f:
                pid = int(f.read().strip())
            os.kill(pid, 9)
            PID_FILE.unlink()
            return jsonify({'reply': 'CEO stopped.', 'action': 'refresh'})
        return jsonify({'reply': 'CEO not running.'})
    else:
        return jsonify({'reply': f'Command: "{cmd}". Try: trends, video, run, stop'})

@app.route('/api/start', methods=['POST'])
@requires_auth
def start_ceo():
    bat_file = AGENT_OS_PATH / 'run_ceo_loop.bat'
    if bat_file.exists():
        proc = subprocess.Popen([str(bat_file)], shell=True, creationflags=subprocess.CREATE_NO_WINDOW)
        with open(PID_FILE, 'w') as f:
            f.write(str(proc.pid))
    return jsonify({'status': 'success'})

@app.route('/api/stop', methods=['POST'])
@requires_auth
def stop_ceo():
    if is_ceo_running():
        with open(PID_FILE, 'r') as f:
            pid = int(f.read().strip())
        os.kill(pid, 9)
        PID_FILE.unlink()
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    print('='*50)
    print('C6 CONTROL ROOM (Authenticated)')
    print('Username: admin')
    print('Password: C6Control2026')
    print('Open http://127.0.0.1:5000')
    print('='*50)
    app.run(host='127.0.0.1', port=5000, debug=False)
