#!/bin/sh
python3 -m venv venv_lambda
. venv_lambda/bin/activate
pip install --upgrade pip
pip install requests[security]
deactivate

python3 -m venv venv_server
. venv_server/bin/activate
pip install --upgrade pip
pip install Flask
deactivate

python3 -m venv venv_dev
. venv_dev/bin/activate
pip install --upgrade pip
pip install boto3
deactivate
