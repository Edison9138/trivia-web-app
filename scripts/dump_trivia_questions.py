import json
import pymysql
import paramiko # for creating ssh tunnel to connect to the ec2 bastion server
from pathlib import Path
from dotenv import load_dotenv
import os
from sshtunnel import SSHTunnelForwarder

trivia_questions_path = Path("../data/trivia_questions.json")

if trivia_questions_path.exists() and trivia_questions_path.stat().st_size != 0: # also check for existed empty file
    with open(trivia_questions_path, "r") as file:
        all_questions = json.load(file)
else:
    raise Exception("No trivia questions file found")

load_dotenv()

ec2_host=os.getenv("EC2_HOST")
ec2_user=os.getenv("EC2_USER")
ec2_ssh_key_path=os.getenv("EC2_SSH_KEY_PATH")
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = "trivia_db"

# print("ec2_ssh_key_path")
# print(ec2_ssh_key_path)
# print("ec2_host")
# print(ec2_host)
# print("ec2_ssh_key_path")
# print(ec2_ssh_key_path)
ssh_key = paramiko.RSAKey.from_private_key_file(ec2_ssh_key_path)

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
            num_inserted = 0
            for question in all_questions:
                # insert into trivia_questions table
                insert_trivia_questions_command = """
                insert into trivia_questions (question_type, difficulty, category, question, correct_answer)
                values (%s, %s, %s, %s, %s)
                """
                cursor.execute(
                    insert_trivia_questions_command,
                    (question["type"],
                    question["difficulty"],
                    question["category"],
                    question["question"],
                    question["correct_answer"])
                )

                question_id = cursor.lastrowid

                # insert into wrong_answers table
                insert_wrong_answers_command = """
                insert into wrong_answers (question_id, wrong_answer)
                values (%s, %s)
                """
                for wrong_answer in question["incorrect_answers"]:
                    cursor.execute(
                        insert_wrong_answers_command,
                        (question_id, wrong_answer), 
                    )
                print(f"Question Inserted: {num_inserted}")
                num_inserted += 1
            connection.commit() # data modified, need to commit to save
            print("Changes committed")

    finally:
        connection.close()
        print("Connection closed")
        # if no connection.commit(), data will not be saved

