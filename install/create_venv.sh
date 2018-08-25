#!/bin/bash

# ec2 had issues with python3 -m venv
# https://stackoverflow.com/a/26314477/6461842

venv_name=$1
python3 -m venv --without-pip $venv_name
. $venv_name/bin/activate
curl https://bootstrap.pypa.io/get-pip.py | python
deactivate
