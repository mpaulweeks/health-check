# health-check

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

## Debugging Storage issues

- Delete any mail files `ls -al /var/spool/mail`
- `sudo reboot`
  1. `sudo service nginx start`
  2. Restart servers for the following:
```
anny-vote
cat-herder
health-check
postboard
type4flash
```
- `du -sh ~/*`
- https://stackoverflow.com/questions/20031604/how-can-i-find-out-why-my-storage-space-on-amazon-ec2-is-full
- https://stackoverflow.com/questions/50847838/running-out-of-disk-space-in-amazon-ec2-cant-find-what-i-am-using-my-storage-f

## Todo

- Convert lambda job to node.js to share code between FE and BE
