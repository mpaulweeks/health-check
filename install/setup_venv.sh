#!/bin/sh
python3 -m venv venv
. venv/bin/activate
pip install --upgrade pip
pip install requests[security]
pip install Flask
pip install boto3
