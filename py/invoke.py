from .aws import (
    FUNCTION_NAME,
    get_client,
)


def invoke():
    lambda_client = get_client()
    result = lambda_client.invoke(
        FunctionName=FUNCTION_NAME,
    )
    print(result)


if __name__ == "__main__":
    invoke()
