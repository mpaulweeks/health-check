import boto3


def deploy():
    lambda_client = boto3.client('lambda', 'us-west-2')
    with open('build/lambda.zip', 'rb') as f:
        zipped_code = f.read()
    lambda_client.update_function_code(
        FunctionName='health',
        ZipFile=zipped_code,
    )


if __name__ == "__main__":
    deploy()
