import pymysql
import paramiko
from dotenv import load_dotenv
import os
import socket
import threading
import logging
import random
from contextlib import contextmanager
from typing import List, Dict, Union, Generator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

REQUIRED_ENV_VARS = [
    "EC2_HOST", "EC2_USER", "EC2_SSH_KEY_PATH",
    "DB_HOST", "DB_USER", "DB_PASSWORD"
]

def get_db_config() -> Dict[str, str]:
    """Load and validate database configuration when a database call is made."""
    missing_env_vars = [
        var
        for var in REQUIRED_ENV_VARS
        if not os.getenv(var)
    ]
    if missing_env_vars:
        missing_env_vars_text = ", ".join(missing_env_vars)
        raise EnvironmentError(
            f"Missing required environment variables: {missing_env_vars_text}"
        )

    return {
        'ec2_host': os.getenv("EC2_HOST"),
        'ec2_user': os.getenv("EC2_USER"),
        'ec2_ssh_key_path': os.getenv("EC2_SSH_KEY_PATH"),
        'db_host': os.getenv("DB_HOST"),
        'db_user': os.getenv("DB_USER"),
        'db_password': os.getenv("DB_PASSWORD"),
        'db_name': os.getenv("DB_NAME", "trivia_db")
    }

def load_ssh_key(ssh_key_path: str):
    try:
        return paramiko.PKey.from_path(os.path.expanduser(ssh_key_path))
    except Exception as e:
        logger.error(f"Failed to load SSH key: {str(e)}")
        raise

def create_error_response(message: str) -> Dict:
    """Create a standardized error response"""
    return {
        "status": "fail",
        "data": message
    }

def create_success_response(data: Union[List, Dict]) -> Dict:
    """Create a standardized success response"""
    return {
        "status": "success",
        "data": data
    }

_ssh_client: paramiko.SSHClient = None
_stop_event: threading.Event = None


def start_tunnel() -> None:
    global _ssh_client, _stop_event

    db_config = get_db_config()
    ssh_key = load_ssh_key(db_config['ec2_ssh_key_path'])

    _ssh_client = paramiko.SSHClient()
    _ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    _ssh_client.connect(
        db_config['ec2_host'],
        port=22,
        username=db_config['ec2_user'],
        pkey=ssh_key,
    )

    local_host = os.getenv('LOCAL_BIND_HOST', 'localhost')
    local_port = int(os.getenv('LOCAL_BIND_PORT', '3307'))
    db_port = int(os.getenv('DB_PORT', '3306'))

    _stop_event = threading.Event()
    ready = threading.Event()
    threading.Thread(
        target=_forward_tunnel,
        args=(local_host, local_port, db_config['db_host'], db_port,
              _ssh_client.get_transport(), _stop_event, ready),
        daemon=True,
    ).start()

    if not ready.wait(timeout=10):
        raise RuntimeError("SSH tunnel failed to start within 10 seconds")
    logger.info("SSH tunnel established")


def stop_tunnel() -> None:
    global _ssh_client, _stop_event
    if _stop_event:
        _stop_event.set()
    if _ssh_client:
        _ssh_client.close()
    _ssh_client = None
    _stop_event = None


def _pipe(chan, sock):
    def forward(src, dst):
        try:
            while True:
                data = src.recv(4096)
                if not data:
                    break
                dst.sendall(data)
        except Exception:
            pass
        finally:
            try: chan.close()
            except Exception: pass
            try: sock.close()
            except Exception: pass

    threading.Thread(target=forward, args=(chan, sock), daemon=True).start()
    forward(sock, chan)


def _forward_tunnel(local_host, local_port, remote_host, remote_port, transport, stop_event, ready_event):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((local_host, local_port))
    server.listen(100)
    server.settimeout(0.5)
    ready_event.set()
    while not stop_event.is_set():
        try:
            client_sock, addr = server.accept()
        except socket.timeout:
            continue
        try:
            chan = transport.open_channel('direct-tcpip', (remote_host, remote_port), addr)
        except Exception as e:
            logger.error(f"Failed to open SSH channel: {e}")
            client_sock.close()
            continue
        threading.Thread(target=_pipe, args=(chan, client_sock), daemon=True).start()
    server.close()


@contextmanager
def get_db_connection() -> Generator[pymysql.connections.Connection, None, None]:
    """
    Create a pymysql connection through the persistent SSH tunnel.
    Call start_tunnel() once before using this.
    """
    connection = None
    try:
        db_config = get_db_config()
        connection = pymysql.connect(
            host=os.getenv('LOCAL_BIND_HOST', 'localhost'),
            port=int(os.getenv('LOCAL_BIND_PORT', '3307')),
            user=db_config['db_user'],
            password=db_config['db_password'],
            db=db_config['db_name'],
            cursorclass=pymysql.cursors.DictCursor,
        )
        logger.info("Database connection established successfully")
        yield connection
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise
    finally:
        if connection:
            connection.close()

def get_trivia_questions(
    question_types: List[str],
    category: str,
    difficulties: List[str],
    count: int = 10
) -> Dict:
    """
    Fetch trivia questions based on specified criteria.
    """
    # Validate input parameters
    if not all([question_types, category, difficulties]):
        logger.error("Missing required parameters")
        return create_error_response(
            "Missing required parameters: question_types, category, or difficulties"
        )

    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                # Create dynamic placeholders for IN clauses
                question_types_placeholders = ', '.join(['%s'] * len(question_types))
                difficulties_placeholders = ', '.join(['%s'] * len(difficulties))

                query = f'''
                SELECT id, question, correct_answer, question_type, category, difficulty
                FROM trivia_questions
                WHERE question_type IN ({question_types_placeholders})
                AND category = %s
                AND difficulty IN ({difficulties_placeholders})
                '''

                params = (*question_types, category, *difficulties)
                
                # Log query for debugging
                logger.debug("Executing query: %s", cursor.mogrify(query, params))
                # mogrify prevents SQL injection
                
                cursor.execute(query, params)
                result = cursor.fetchall()
                available_count = len(result)

                # Handle insufficient questions
                if available_count < int(count):
                    logger.warning(f"Insufficient questions. Available: {available_count}, Requested: {count}")
                    return create_error_response(
                        f"Not enough questions available. Found: {available_count}, Requested: {count}"
                    )

                # Randomly select questions if more are available than requested
                if available_count > int(count):
                    result = random.sample(result, int(count))

                if not result:
                    return create_success_response(result)

                question_ids = [question["id"] for question in result]
                question_id_placeholders = ', '.join(['%s'] * len(question_ids))
                wrong_answers_query = f'''
                SELECT id, question_id, wrong_answer
                FROM wrong_answers
                WHERE question_id IN ({question_id_placeholders})
                ORDER BY question_id, id
                '''

                cursor.execute(wrong_answers_query, tuple(question_ids))
                wrong_answers_result = cursor.fetchall()
                wrong_answers_by_question_id = {
                    question_id: []
                    for question_id in question_ids
                }

                for wrong_answer in wrong_answers_result:
                    wrong_answers_by_question_id[
                        wrong_answer["question_id"]
                    ].append(wrong_answer["wrong_answer"])

                missing_wrong_answers = [
                    question_id
                    for question_id, wrong_answers in wrong_answers_by_question_id.items()
                    if not wrong_answers
                ]
                if missing_wrong_answers:
                    logger.warning(
                        f"No wrong answers found for question ids: {missing_wrong_answers}"
                    )
                    return create_error_response(
                        "No wrong answers found for all selected questions"
                    )

                for question in result:
                    question["wrong_answers"] = wrong_answers_by_question_id[
                        question["id"]
                    ]

                return create_success_response(result)

    except Exception as e:
        logger.exception("Failed to retrieve trivia questions")
        return create_error_response(f"Database error: {str(e)}")

def get_wrong_answers(question_id: int) -> Dict:
    """
    Fetch wrong answers for a specific question.
    """
    if not question_id:
        logger.error("Missing question_id parameter")
        return create_error_response("Missing question_id parameter")

    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                query = '''
                SELECT id, question_id, wrong_answer
                FROM wrong_answers
                WHERE question_id = %s
                ORDER BY id
                '''
                
                cursor.execute(query, (question_id,))
                result = cursor.fetchall()

                if not result:
                    logger.warning(f"No wrong answers found for question_id: {question_id}")
                    return create_error_response(
                        f"No wrong answers found for question_id: {question_id}"
                    )

                return create_success_response(result)

    except Exception as e:
        logger.exception("Failed to retrieve wrong answers")
        return create_error_response(f"Database error: {str(e)}")

def get_correct_answers(question_ids: List[int]) -> Dict:
    """
    Fetch correct answers for the submitted question ids in the same order.
    """
    if not question_ids:
        logger.error("Missing question_ids parameter")
        return create_error_response("Missing question_ids parameter")

    unique_question_ids = list(dict.fromkeys(question_ids))

    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                question_id_placeholders = ', '.join(['%s'] * len(unique_question_ids))
                query = f'''
                SELECT id, correct_answer
                FROM trivia_questions
                WHERE id IN ({question_id_placeholders})
                '''

                cursor.execute(query, tuple(unique_question_ids))
                result = cursor.fetchall()

                answers_by_id = {
                    row["id"]: row["correct_answer"]
                    for row in result
                }
                missing_question_ids = [
                    question_id
                    for question_id in unique_question_ids
                    if question_id not in answers_by_id
                ]

                if missing_question_ids:
                    logger.warning(f"Missing submitted question ids: {missing_question_ids}")
                    return create_error_response(
                        "Could not find all submitted question ids"
                    )

                return create_success_response([
                    answers_by_id[question_id]
                    for question_id in question_ids
                ])

    except Exception as e:
        logger.exception("Failed to retrieve correct answers")
        return create_error_response(f"Database error: {str(e)}")

def health_check() -> Dict:
    """
    Check database connection health.
    """
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                return create_success_response({"message": "Database connection successful"})
    except Exception as e:
        logger.exception("Database health check failed")
        return create_error_response(f"Database connection failed: {str(e)}")
