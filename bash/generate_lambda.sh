cd venv/lib/python2.7/site-packages/
zip -r9 ../../../../lambda.zip *
cd ../../../../

cd py/
zip -g ../lambda.zip lambda.py
cd ../

zip -g lambda.zip bash/disk_usage.sh
zip -g lambda.zip docs/static/data.json
