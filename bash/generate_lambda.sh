# create zip of all python packages in our virtualenv
cd venv/lib/python3.6/site-packages/
zip -r9 ../../../../build/lambda.zip *
cd ../../../../

# add the lambda script to the zip
cd py/
zip -g ../build/lambda.zip lambda.py
cd ../
