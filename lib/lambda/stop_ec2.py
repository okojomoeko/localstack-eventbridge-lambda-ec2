import boto3
import os
import logging
import json
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# localstackのためにendpoint_urlを指定しているので要カスタマイズ
ec2 = boto3.client('ec2',region_name='ap-northeast-1', endpoint_url='http://host.docker.internal:4566')
EC2_INSTANCE_ID = os.environ['EC2_INSTANCE_ID']

def lambda_handler(event, context):

    logger.info(EC2_INSTANCE_ID)

    ret = ec2.stop_instances(InstanceIds=[EC2_INSTANCE_ID])
    logger.info('stopped your instances: ' + str(EC2_INSTANCE_ID))
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(ret)
    }
