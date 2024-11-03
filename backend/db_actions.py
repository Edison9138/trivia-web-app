import pymysql
import paramiko
from dotenv import load_dotenv
import os
import logging
import random
from sshtunnel import SSHTunnelForwarder

load_dotenv()

ec2_host=os.getenv("EC2_HOST")
ec2_user=os.getenv("EC2_USER")
ec2_ssh_key_path=os.getenv("EC2_SSH_KEY_PATH")
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = "trivia_db"
ssh_key = paramiko.RSAKey.from_private_key_file(ec2_ssh_key_path)

def get_trivia_questions(question_type, category, difficulty, count=10):
    '''
    Returns number of trivia questions of given type, category, and difficulty
    '''
    with SSHTunnelForwarder(
        (ec2_host, 22),
        ssh_username=ec2_user,
        ssh_pkey=ssh_key,
        remote_bind_address=(db_host, 3306),
        local_bind_address=('localhost', 3307) # 3306 was occupied by mysql server
    ) as tunnel:
        connection = pymysql.connect(
            host="localhost",
            port=tunnel.local_bind_port,
            user=db_user,
            password=db_password,
            db=db_name,
            cursorclass=pymysql.cursors.DictCursor # each row returned from db as a dictionary
        )
    
        try:
            with connection.cursor() as cursor:
                count_trivia_questions_command = '''
                select * from trivia_questions
                where question_type = %s and category = %s and difficulty = %s
                '''
                cursor.execute(count_trivia_questions_command, (question_type, category, difficulty))
                result = cursor.fetchall()

                if len(result) < count:
                    # print(f"len(result): {len(result)}")
                    data = {
                        "status": "fail",
                        "data": f"no enough questions, max num of questions: {str(len(result))}"
                    }
                    # print(data)
                    return data
                
                if len(result) > count:
                    result = random.sample(result, count) # without repeatition
                # print(f"len(result): {len(result)}")
                data = {
                    "status": "success",
                    "data": result
                }
                # print(data)
                return data
        
        except Exception as e:
            logging.error(e)
            data = {
                "status": "fail",
                "data": str(e)
            }

            return data
        finally:
            connection.close()
            print("Connection closed")
            # if no connection.commit(), data will not be saved

if __name__ == "__main__":
    get_trivia_questions("boolean", "Politics", "hard", 4)