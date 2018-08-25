#!/bin/bash

./install/create_venv.sh venv_lambda
. venv_lambda/bin/activate
pip install requests[security]
deactivate
