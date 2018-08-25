#!/bin/bash

./install/create_venv.sh venv_deploy
. venv_deploy/bin/activate
pip install boto3
deactivate
