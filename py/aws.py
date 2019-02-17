import boto3

FUNCTION_NAME = 'arn:aws:lambda:us-east-1:988820348419:function:health'


def get_client():
    return boto3.client('lambda', 'us-east-1')
