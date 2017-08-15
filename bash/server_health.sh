touch server.pid
source venv/bin/activate
HEALTH_PORT=5100 python -m py.server
