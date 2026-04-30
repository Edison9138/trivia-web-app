import os

try:
    from .trivia_data import (
        DEFAULT_TRIVIA_QUESTIONS_PATH,
        PROJECT_ROOT,
        load_questions,
        normalize_questions,
    )
except ImportError:
    from trivia_data import (
        DEFAULT_TRIVIA_QUESTIONS_PATH,
        PROJECT_ROOT,
        load_questions,
        normalize_questions,
    )


REQUIRED_ENV_VARS = [
    "EC2_HOST",
    "EC2_USER",
    "EC2_SSH_KEY_PATH",
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
]


def load_project_env():
    try:
        from dotenv import load_dotenv
    except ImportError:
        return

    load_dotenv(PROJECT_ROOT / ".env")


def get_config():
    load_project_env()
    missing_env_vars = [name for name in REQUIRED_ENV_VARS if not os.getenv(name)]
    if missing_env_vars:
        raise EnvironmentError(
            "Missing required environment variables: "
            + ", ".join(missing_env_vars)
        )

    return {
        "ec2_host": os.getenv("EC2_HOST"),
        "ec2_port": int(os.getenv("EC2_PORT", "22")),
        "ec2_user": os.getenv("EC2_USER"),
        "ec2_ssh_key_path": os.getenv("EC2_SSH_KEY_PATH"),
        "db_host": os.getenv("DB_HOST"),
        "db_port": int(os.getenv("DB_PORT", "3306")),
        "db_user": os.getenv("DB_USER"),
        "db_password": os.getenv("DB_PASSWORD"),
        "db_name": os.getenv("DB_NAME", "trivia_db"),
        "local_bind_host": os.getenv("LOCAL_BIND_HOST", "localhost"),
        "local_bind_port": int(os.getenv("LOCAL_BIND_PORT", "3307")),
    }


def load_seed_questions():
    all_questions = load_questions(DEFAULT_TRIVIA_QUESTIONS_PATH)
    if not all_questions:
        raise FileNotFoundError(
            f"No trivia questions found at {DEFAULT_TRIVIA_QUESTIONS_PATH}"
        )

    normalized_questions, duplicate_questions = normalize_questions(all_questions)
    if duplicate_questions:
        print(f"Skipped duplicate questions: {len(duplicate_questions)}")
    return normalized_questions


def insert_questions(connection, all_questions):
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
                (
                    question["type"],
                    question["difficulty"],
                    question["category"],
                    question["question"],
                    question["correct_answer"],
                ),
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


def main():
    import paramiko # for creating ssh tunnel to connect to the ec2 bastion server
    import pymysql
    from sshtunnel import SSHTunnelForwarder

    all_questions = load_seed_questions()
    config = get_config()

    ssh_key = paramiko.RSAKey.from_private_key_file(config["ec2_ssh_key_path"])

    with SSHTunnelForwarder(
        (config["ec2_host"], config["ec2_port"]),
        ssh_username=config["ec2_user"],
        ssh_pkey=ssh_key,
        remote_bind_address=(config["db_host"], config["db_port"]),
        local_bind_address=(config["local_bind_host"], config["local_bind_port"]),
    ) as tunnel:
        connection = pymysql.connect(
            host=config["local_bind_host"],
            port=tunnel.local_bind_port,
            user=config["db_user"],
            password=config["db_password"],
            db=config["db_name"],
            cursorclass=pymysql.cursors.DictCursor # each row returned from db as a dictionary
        )

        try:
            insert_questions(connection, all_questions)
        finally:
            connection.close()
            print("Connection closed")
            # if no connection.commit(), data will not be saved


if __name__ == "__main__":
    main()
