
from datetime import datetime
import os
import sys

import requests

# 0 * * * * ec2-user cd /home/ec2-user/health-check && ./bash/cronjob.sh


HTML_TEMPLATE = """<pre>
Result of health check
======================
%s
</pre>"""


def send_email(success, html):
    MAILGUN_API_KEY = os.environ['HEALTH_MAILGUN_API_KEY']
    MAILGUN_DOMAIN = os.environ['HEALTH_MAILGUN_DOMAIN']
    EMAIL_TO = os.environ['HEALTH_EMAIL_TO']

    today_str = datetime.utcnow().strftime("%Y/%m/%d")
    from_address = "HEALTH ROBOT <health.robot@%s>" % (
        MAILGUN_DOMAIN
    )
    subject = "HEALTHCHECK %s %s" % (
        today_str,
        "OK" if success else "FAILED",
    )
    url = "https://api.mailgun.net/v3/%s/messages"
    return requests.post(
        url % MAILGUN_DOMAIN,
        auth=(
            "api",
            MAILGUN_API_KEY,
        ),
        data={
            "from": from_address,
            "to": EMAIL_TO,
            "subject": subject,
            "html": html,
        },
    )


def check_url(url):
    try:
        response = requests.get(url + "?v=" + datetime.utcnow().total_seconds())
        ms = int(response.elapsed.total_seconds() * 1000)
        message = "%s %sms %s" % (
            response.status_code,
            ms,
            url,
        )
        success = response.status_code in [200, 204]
        return success, message, response
    except Exception as e:
        return False, str(e), None


def check_services(endpoints):
    success = True
    messages = []
    for endpoint in endpoints:
        for url in endpoint['urls']:
            s, m, _ = check_url(url)
            success = success and s
            if not s:
                print(m)
            messages.append(m)
    return success, "\n".join(messages)


def check_servers(endpoints):
    success = True
    messages = []
    for endpoint in endpoints:
        url = endpoint['url']
        s, m, r = check_url(url)
        success = success and s
        m = "%s\n%s" % (m, r.text)
        if not success:
            print(m)
        messages.append(m)
    return success, "\n\n".join(messages)


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
            m = "%s %sh %s" % (
                response.status_code,
                hours,
                url,
            )
        except Exception as e:
            print(e)
            success = False
            m = "%s ??? %s" % (
                response.status_code,
                url,
            )
        if not success:
            print(m)
        messages.append(m)
    return success, "\n".join(messages)


def is_special_time():
    return datetime.utcnow().hour == 7


def get_endpoint_data():
    DATA_URL = os.environ['HEALTH_DATA_URL']
    r = requests.get(DATA_URL)
    return r.json()


def run(force_email):
    data = get_endpoint_data()
    services_ok, service_messages = check_services(data['services'])
    files_ok, file_messages = check_files(data['files'])
    servers_ok, server_messages = check_servers(data['servers'])

    success = (services_ok and files_ok and servers_ok)
    messages = [service_messages, file_messages, server_messages]
    html = HTML_TEMPLATE % "\n\n".join(messages)

    should_send_email = (
        force_email or
        (not success) or
        is_special_time()
    )
    if should_send_email:
        send_email(success, html)
    return success


def lambda_handler(json_input, context):
    force_email = json_input.get('force_email')
    return run(force_email)


if __name__ == "__main__":
    force_email = len(sys.argv) > 1
    run(force_email)
