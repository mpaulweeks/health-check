# health-check

[![CircleCI](https://circleci.com/gh/mpaulweeks/health-check/tree/master.svg?style=svg)](https://circleci.com/gh/mpaulweeks/health-check/tree/master)

Static page and lambda job for health-checking my websites

## Deploy

Health-Check has three services:
- a static website that checks endpoints via AJAX
- an automated Lambda job that checks endpoints via python request, sends an email on failure
- a thin server running on ec2 to report memory information

### Static site

Static files are located in [docs/](/docs)

### Lambda job

Create new Lambda zip with `./bash/generate_lambda.sh`, then upload the zip manually

Services are specified in [docs/static/data.json](docs/static/data.json)

Lambda job pulls the latest endpoints directly from [GitHub](https://raw.githubusercontent.com/mpaulweeks/health-check/master/docs/static/data.json)

### Server health
```
.install/setup_venv.sh
.bash/bg_health.sh
```

See `install/nginx.conf`

## todo

- Convert lambda job to node.js to share code between FE and BE
- Use different requirements for lambda vs server
