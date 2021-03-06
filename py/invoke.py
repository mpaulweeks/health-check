import json
from .aws import (
    FUNCTION_NAME,
    get_client,
)

FORCE_TEST = """
{
  "force_email": true
}
""".strip()


def invoke():
    lambda_client = get_client()
    res = lambda_client.invoke(
        FunctionName=FUNCTION_NAME,
        InvocationType="RequestResponse",
        Payload=FORCE_TEST,
    )
    payload = res['Payload']
    json_str = payload.read().decode("utf-8")
    res_json = json.loads(json_str)
    if res_json:
        print(res_json)
    else:
        print(payload)
        print(json_str)
        raise Exception("health check failed")


if __name__ == "__main__":
    invoke()
