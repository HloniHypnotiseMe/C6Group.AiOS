from flask import Flask, jsonify, send_from_directory, request
import json
import os
import subprocess
from pathlib import Path

app = Flask(__name__, static_folder='.', template_folder='.')
AGENT_OS_PATH = Path('C:/Users/VAT PRODUCTION/agent-os')
MEMORY_FILE = AGENT_OS_PATH / 'memory_local.json'
PID_FILE = AGENT_OS_PATH / 'ceo.pid'

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
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/status')
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
def command():
    data = request.get_json()
    cmd = data.get('command', '').lower()
    print(f"[CMD] {cmd}")
    
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
    elif 'decisions' in cmd:
        if MEMORY_FILE.exists():
            with open(MEMORY_FILE, 'r') as f:
                memory = json.load(f)
            decisions = memory.get('decisions', [])[:3]
            if decisions:
                reply = 'Recent decisions:\n' + '\n'.join([f'- {d["topic"]}' for d in decisions])
                return jsonify({'reply': reply})
        return jsonify({'reply': 'No decisions yet.'})
    else:
        return jsonify({'reply': f'Command: "{cmd}". Try: trends, video, run, stop, decisions'})

@app.route('/api/start', methods=['POST'])
def start_ceo():
    bat_file = AGENT_OS_PATH / 'run_ceo_loop.bat'
    if bat_file.exists():
        proc = subprocess.Popen([str(bat_file)], shell=True, creationflags=subprocess.CREATE_NO_WINDOW)
        with open(PID_FILE, 'w') as f:
            f.write(str(proc.pid))
    return jsonify({'status': 'success'})

@app.route('/api/stop', methods=['POST'])
def stop_ceo():
    if is_ceo_running():
        with open(PID_FILE, 'r') as f:
            pid = int(f.read().strip())
        os.kill(pid, 9)
        PID_FILE.unlink()
    return jsonify({'status': 'success'})

@app.route('/api/run_once', methods=['POST'])
def run_once():
    subprocess.Popen([str(AGENT_OS_PATH / 'venv/Scripts/python.exe'), str(AGENT_OS_PATH / 'agents/ceo/ceo_simple.py')], shell=False, creationflags=subprocess.CREATE_NO_WINDOW)
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    print('='*50)
    print('C6 CONTROL ROOM')
    print('Open http://127.0.0.1:5000')
    print('='*50)
    app.run(host='127.0.0.1', port=5000, debug=False)
