
import json

import requests

# 0 5 * * * ec2-user cd /home/ec2-user/health-check && python _py/healthcheck.py


def send_email(success, body):
    print ('sending healthcheck email')
    with open("_local/mailgun.json") as jsonFile:
        creds = json.load(jsonFile)
    subject = "HEALTHCHECK %s" % ("OK" if success else "FAILED")
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
    with open("static/services.json") as jsonFile:
        endpoints = json.load(jsonFile)
    success = True
    messages = []
    for endpoint in endpoints:
        for url in endpoint['urls']:
            response = requests.get(url)
            url_success = response.status_code == 200
            message = "%s %s" % (
                "  UP" if url_success else "DOWN",
                url,
            )
            messages.append(message)
            success = success and url_success
    return success, "\n".join(messages)


if __name__ == "__main__":
    success, messages = perform_check()
    send_email(success, messages)
