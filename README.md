# health-check
Static page and lambda job for health-checking my websites

## Deploy

### Static site
 
Static files are located in `doc/`

### Lambda job

Create new lambda zip with `./bash/generate_lambda.sh`

### Server health
```
.bash/setup_venv.sh
.bash/bg_health.sh
```

## todo

- Convert to node.js to share all code between FE and BE?
- Lambda?
  - https://github.com/nficano/python-lambda
  - https://www.expeditedssl.com/aws-lambda-in-plain-english
