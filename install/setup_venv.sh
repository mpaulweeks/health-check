#!/bin/sh
function create_venv()
{
    local venv_name=$1
    python3 -m venv --without-pip $venv_name
    . $venv_name/bin/activate
    curl https://bootstrap.pypa.io/get-pip.py | python
    deactivate
}

create_venv venv_lambda
. venv_lambda/bin/activate
pip install requests[security]
deactivate

create_venv venv_server
. venv_server/bin/activate
pip install Flask
deactivate

create_venv venv_dev
. venv_dev/bin/activate
pip install boto3
deactivate
