
from datetime import datetime
import json

import requests

# 0 * * * * ec2-user cd /home/ec2-user/health-check && python _py/healthcheck.py


def send_email(success, body):
    with open("_local/mailgun.json") as jsonFile:
        creds = json.load(jsonFile)
    today_str = datetime.utcnow().strftime("%Y/%m/%d")
    subject = "HEALTHCHECK %s %s" % (
        today_str,
        "OK" if success else "FAILED",
    )
    text = """
Result of health check
======================
%s
""" % body
    url = "https://api.mailgun.net/v3/%s/messages"
    return requests.post(
        url % creds['mailgun_domain_name'],
        auth=(
            "api",
            creds['mailgun_api_key'],
        ),
        data={
            "from": "HEALTH ROBOT <health.robot@%s>" % creds['mailgun_domain_name'],
            "to": "mpaulweeks@gmail.com",
            "subject": subject,
            "text": text,
        },
    )


def perform_check():
    with open("docs/static/services.json") as jsonFile:
        endpoints = json.load(jsonFile)
    success = True
    messages = []
    for endpoint in endpoints:
        for url in endpoint['urls']:
            response = requests.get(url)
            ms = int(response.elapsed.total_seconds() * 1000)
            message = "%s %sms %s" % (
                response.status_code,
                ms,
                url,
            )
            messages.append(message)
            success = success and response.status_code == 200
    return success, "\n".join(messages)


def is_special_time():
    return datetime.utcnow().hour == 7


if __name__ == "__main__":
    success, messages = perform_check()
    if is_special_time() or not success:
        send_email(success, messages)
