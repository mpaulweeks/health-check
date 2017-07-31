cd venv/lib/python2.7/site-packages/
zip -r9 ../../../../lambda.zip *
cd ../../../../

cd py/
zip -g ../lambda.zip lambda.py
cd ../

echo '{}' > local/status.json
zip -g lambda.zip local/status.json
zip -g lambda.zip docs/static/data.json
