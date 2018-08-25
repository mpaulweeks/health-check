import boto3

FUNCTION_NAME = 'arn:aws:lambda:us-west-2:317856666432:function:health'


def get_client():
    return boto3.client('lambda', 'us-west-2')
