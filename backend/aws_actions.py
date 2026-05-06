import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv, set_key, find_dotenv
import os
import argparse

load_dotenv()


def _get_clients():
    region = os.getenv("AWS_REGION", "us-east-1")
    return (
        boto3.client('ec2', region_name=region),
        boto3.client('rds', region_name=region),
    )


def start_ec2_instance(ec2, instance_id):
    try:
        ec2.start_instances(InstanceIds=[instance_id])
        print(f"Starting EC2 instance: {instance_id}")
        waiter = ec2.get_waiter('instance_running')
        print("Waiting for EC2 instance to be running...")
        waiter.wait(InstanceIds=[instance_id])
        info = ec2.describe_instances(InstanceIds=[instance_id])
        public_dns = info['Reservations'][0]['Instances'][0].get('PublicDnsName', '')
        print(f"EC2 instance running. Public DNS: {public_dns}")
        if public_dns:
            env_path = find_dotenv(usecwd=True)
            set_key(env_path, 'EC2_HOST', public_dns)
            print(f"Updated EC2_HOST in .env")
    except ClientError as e:
        print(f"Error starting EC2 instance: {e}")
        raise


def stop_ec2_instance(ec2, instance_id):
    try:
        ec2.stop_instances(InstanceIds=[instance_id])
        print(f"Stopping EC2 instance: {instance_id}")
        waiter = ec2.get_waiter('instance_stopped')
        print("Waiting for EC2 instance to stop...")
        waiter.wait(InstanceIds=[instance_id])
        print(f"EC2 instance {instance_id} stopped")
    except ClientError as e:
        print(f"Error stopping EC2 instance: {e}")
        raise


def start_rds_instance(rds, instance_id):
    try:
        rds.start_db_instance(DBInstanceIdentifier=instance_id)
        print(f"Starting RDS instance: {instance_id}")
        waiter = rds.get_waiter('db_instance_available')
        print("Waiting for RDS instance to be available (this takes a few minutes)...")
        waiter.wait(DBInstanceIdentifier=instance_id)
        print(f"RDS instance {instance_id} is available")
    except ClientError as e:
        print(f"Error starting RDS instance: {e}")
        raise


def stop_rds_instance(rds, instance_id):
    try:
        status = rds.describe_db_instances(DBInstanceIdentifier=instance_id)
        state = status['DBInstances'][0]['DBInstanceStatus']
        if state in ('stopped', 'stopping'):
            print(f"RDS instance {instance_id} is already {state}")
            return
        rds.stop_db_instance(DBInstanceIdentifier=instance_id)
        print(f"RDS instance {instance_id} stopping (takes a few minutes to complete)")
    except ClientError as e:
        print(f"Error stopping RDS instance: {e}")
        raise


def start_or_stop(action):
    ec2_instance_id = os.getenv("EC2_INSTANCE_ID")
    rds_instance_id = os.getenv("RDS_INSTANCE_ID")
    if not ec2_instance_id or not rds_instance_id:
        raise EnvironmentError("EC2_INSTANCE_ID and RDS_INSTANCE_ID must be set in .env")

    ec2, rds = _get_clients()

    if action == 'start':
        start_ec2_instance(ec2, ec2_instance_id)
        start_rds_instance(rds, rds_instance_id)
    elif action == 'stop':
        stop_ec2_instance(ec2, ec2_instance_id)
        stop_rds_instance(rds, rds_instance_id)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Start or Stop AWS EC2 and RDS instances")
    parser.add_argument('action', choices=['start', 'stop'])
    args = parser.parse_args()
    start_or_stop(args.action)
