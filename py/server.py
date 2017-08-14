import subprocess

from flask import Flask

app = Flask(__name__)

@app.route("/health")
def health():
    info = subprocess.check_output(
        ["./bash/disk_usage.sh"],
    )
    return info

if __name__ == "__main__":
    pass
