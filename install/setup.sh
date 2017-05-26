#!/bin/sh
virtualenv venv
source venv/bin/activate
pip install --upgrade pip
pip install requests[security]
