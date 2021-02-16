import os
import subprocess

from flask import Flask


def health():
    output = subprocess.check_output(
        ["./bash/disk_usage.sh"],
    )
    return '<pre>' + output + '</pre>'


if __name__ == "__main__":
    with open('server.pid', 'wt') as f:
        f.write(str(os.getpid()))
    app = Flask(__name__)
    app.add_url_rule('/health', 'health', health)
    app.run(host='0.0.0.0', port=os.environ['HEALTH_PORT'])
