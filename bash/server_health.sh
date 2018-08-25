touch server.pid
source venv_server/bin/activate
HEALTH_PORT=5100 python -m py.server
