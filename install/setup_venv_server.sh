#!/bin/bash

./install/create_venv.sh venv_server
. venv_server/bin/activate
pip install Flask
deactivate
