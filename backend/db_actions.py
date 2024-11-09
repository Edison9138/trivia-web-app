import pymysql
import paramiko
from dotenv import load_dotenv
import os
import logging
import random
from sshtunnel import SSHTunnelForwarder
from contextlib import contextmanager

load_dotenv()

ec2_host = os.getenv("EC2_HOST")
ec2_user = os.getenv("EC2_USER")
ec2_ssh_key_path = os.getenv("EC2_SSH_KEY_PATH")
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = "trivia_db"
ssh_key = paramiko.RSAKey.from_private_key_file(ec2_ssh_key_path)

@contextmanager
def get_db_connection():
    with SSHTunnelForwarder(
        (ec2_host, 22),
        ssh_username=ec2_user,
        ssh_pkey=ssh_key,
        remote_bind_address=(db_host, 3306),
        local_bind_address=('localhost', 3307)
    ) as tunnel:
        connection = pymysql.connect(
            host="localhost",
            port=tunnel.local_bind_port,
            user=db_user,
            password=db_password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor
        )
        try:
            yield connection
        finally:
            connection.close()

def get_trivia_questions(question_types, category, difficulties, count=10):
    '''
    Returns a number of trivia questions of given types, category, and difficulties.
    '''
    with get_db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                # dynamic placeholders for multi-value parameters
                question_types_placeholders = ', '.join(['%s'] * len(question_types))
                difficulties_placeholders = ', '.join(['%s'] * len(difficulties))

                query = f'''
                SELECT * FROM trivia_questions
                WHERE question_type IN ({question_types_placeholders})
                AND category = %s
                AND difficulty IN ({difficulties_placeholders})
                '''

                params = (*question_types, category, *difficulties)

                # debug
                print("Executing query:", cursor.mogrify(query, params))

                cursor.execute(query, params)
                result = cursor.fetchall()
                available_count = len(result)
                
                if available_count < int(count):
                    return {
                        "status": "fail",
                        "data": f"Not enough questions. Available questions: {available_count}"
                    }
                
                if available_count > int(count):
                    result = random.sample(result, int(count))
                
                return {
                    "status": "success",
                    "data": result
                }
        except Exception as e:
            logging.exception("Failed to retrieve trivia questions.")
            return {
                "status": "fail",
                "data": "An error occurred while fetching trivia questions."
            }

def get_wrong_answers(question_id):
    '''
    Returns wrong answers for a given question ID.
    '''
    with get_db_connection() as connection:
        try:
            with connection.cursor() as cursor:
                query = '''
                SELECT * FROM wrong_answers
                WHERE question_id = %s
                '''
                cursor.execute(query, (question_id,))
                result = cursor.fetchall()

                if len(result) == 0:
                    data = {
                        "status": "fail",
                        "data": f"Found 0 wrong answers for question_id: {question_id}"
                    }
                    return data
                
                data = {
                    "status": "success",
                    "data": result
                }

                return data
        
        except Exception as e:
            logging.exception("Failed to retrieve wrong answers.")
            data = {
                "status": "fail",
                "data": "An error occurred while fetching wrong answers."
            }
            return data

