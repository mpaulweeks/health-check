
from datetime import datetime
import json
import subprocess
import sys

import requests

# 0 * * * * ec2-user cd /home/ec2-user/health-check && ./bash/cronjob.sh


HTML_TEMPLATE = """<pre>
Result of health check
======================
%s
</pre>"""


def get_more_info(body):
    return [
        body,
        subprocess.check_output(
            ["./bash/disk_usage.sh"],
        ),
    ]


def send_email(success, body):
    with open("local/mailgun.json") as jsonFile:
        creds = json.load(jsonFile)
    today_str = datetime.utcnow().strftime("%Y/%m/%d")
    from_address = "HEALTH ROBOT <health.robot@%s>" % (
        creds['mailgun_domain_name']
    )
    subject = "HEALTHCHECK %s %s" % (
        today_str,
        "OK" if success else "FAILED",
    )
    html = HTML_TEMPLATE % "\n\n".join(get_more_info(body))
    url = "https://api.mailgun.net/v3/%s/messages"
    return requests.post(
        url % creds['mailgun_domain_name'],
        auth=(
            "api",
            creds['mailgun_api_key'],
        ),
        data={
            "from": from_address,
            "to": "mpaulweeks@gmail.com",
            "subject": subject,
            "html": html,
        },
    )


def check_services(endpoints):
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


def check_files(endpoints):
    success = True
    messages = []
    for endpoint in endpoints:
        url = endpoint['url']
        response = requests.get(url)
        try:
            date_str = response.json()
            for field_name in endpoint['date_field']:
                date_str = date_str[field_name]
            updated = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%f")
            seconds = (datetime.utcnow() - updated).total_seconds()
            hours = int(seconds / 3600)
            success = success and hours <= 24
            message = "%s %sh %s" % (
                response.status_code,
                hours,
                url,
            )
            messages.append(message)
        except Exception as e:
            print(e)
            success = False
            message = "%s ??? %s" % (
                response.status_code,
                url,
            )
            messages.append(message)
    return success, "\n".join(messages)


def last_check_ok():
    with open('local/status.json') as jsonFile:
        status = json.load(jsonFile)
    return status.get('ok') or False


def update_status(is_ok):
    status = {'ok': is_ok}
    with open('local/status.json', 'wb') as jsonFile:
        json.dump(status, jsonFile)


def is_special_time():
    return datetime.utcnow().hour == 7


def run():
    with open("docs/static/data.json") as jsonFile:
        data = json.load(jsonFile)
    services_ok, service_messages = check_services(data['services'])
    files_ok, file_messages = check_files(data['files'])
    success = (services_ok and files_ok)
    messages = "\n\n".join([service_messages, file_messages])

    force_email = len(sys.argv) > 1
    was_last_check_ok = last_check_ok()
    update_status(success)
    should_send_email = (
        force_email or
        (not success) or
        (not was_last_check_ok) or
        is_special_time()
    )
    if should_send_email:
        send_email(success, messages)

if __name__ == "__main__":
    run()
