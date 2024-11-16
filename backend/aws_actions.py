import boto3
from dotenv import load_dotenv
import os
import argparse
import time

# Load environment variables
load_dotenv()

# Initialize AWS clients
ec2 = boto3.client('ec2', region_name='us-east-1')  # Replace with your region
rds = boto3.client('rds', region_name='us-east-1')  # Replace with your region

# Get instance IDs from environment variables
ec2_instance_id = os.getenv("EC2_INSTANCE_ID")
rds_instance_id = os.getenv("RDS_INSTANCE_ID")

# Start EC2 instance
def start_ec2_instance(ec2_instance_id):
    response = ec2.start_instances(InstanceIds=[ec2_instance_id])
    print(f"Starting EC2 instance: {ec2_instance_id}")
    # print(response)
    
    # Wait until the instance is running
    waiter = ec2.get_waiter('instance_running')
    print("Waiting for EC2 instance to be in 'running' state...")
    waiter.wait(InstanceIds=[ec2_instance_id])
    
    # Get the public DNS name
    instance_info = ec2.describe_instances(InstanceIds=[ec2_instance_id])
    public_dns_name = instance_info['Reservations'][0]['Instances'][0].get('PublicDnsName', 'No Public DNS')
    print(f"EC2 instance public DNS: {public_dns_name}")

# Start RDS instance
def start_rds_instance(rds_instance_id):
    response = rds.start_db_instance(DBInstanceIdentifier=rds_instance_id)
    print(f"Starting RDS instance: {rds_instance_id}")
    # print(response)

# Stop EC2 instance
def stop_ec2_instance(ec2_instance_id):
    response = ec2.stop_instances(InstanceIds=[ec2_instance_id])
    print(f"Stopping EC2 instance: {ec2_instance_id}")
    # print(response)

# Stop RDS instance
def stop_rds_instance(rds_instance_id):
    response = rds.stop_db_instance(DBInstanceIdentifier=rds_instance_id)
    print(f"Stopping RDS instance: {rds_instance_id}")
    # print(response)

# Function to handle start or stop based on the argument
def start_or_stop(action):
    if action == 'start':
        start_ec2_instance(ec2_instance_id)
        start_rds_instance(rds_instance_id)
    elif action == 'stop':
        stop_ec2_instance(ec2_instance_id)
        stop_rds_instance(rds_instance_id)
    else:
        print("Invalid action for starting EC2 and RDS. Use 'start' or 'stop'.")

# Main function to handle command-line arguments
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Start or Stop AWS EC2 and RDS instances")
    parser.add_argument('action', choices=['start', 'stop'], help="Action to perform: 'start' or 'stop'")
    args = parser.parse_args()

    # Call the start_or_stop function with the provided action
    start_or_stop(args.action)
