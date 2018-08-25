# health-check

[![CircleCI](https://circleci.com/gh/mpaulweeks/health-check/tree/master.svg?style=svg)](https://circleci.com/gh/mpaulweeks/health-check/tree/master)

Static page and lambda job for health-checking my websites

## Setup

Health-Check has three services:
- a static website that checks endpoints via AJAX
- a thin server running on ec2 to report memory information
- an automated Lambda job that checks endpoints via python request, sends an email on failure

On repo clone, run the following:
```
.bash/bg_health.sh
```

### Static site

Static files are located in [docs/](/docs)

Deploy by pushing the new files to `master`, GitHub pages will update internally

### Server health API

Server code is located in [py/server.py](/py/server.py)

Deploy by cloning the code onto an EC2 server and running the following:
```
.install/setup_venv.sh
.bash/bg_health.sh
```

See also `install/nginx.conf`

### Lambda job

The lambda job itself is contained in [py/lambda.py](/py/lambda.py)

Services are specified in [docs/static/data.json](docs/static/data.json)

Lambda job pulls the latest endpoints directly from [GitHub](https://raw.githubusercontent.com/mpaulweeks/health-check/master/docs/static/data.json)

Deploy by pushing to master. CircleCI will deploy the lambda following the instructions in [.circleci/config.yml](/.circleci/config.yml)

## Todo

- Convert lambda job to node.js to share code between FE and BE
