import pymysql
import paramiko
from dotenv import load_dotenv
import os
import logging
import random
from sshtunnel import SSHTunnelForwarder
from contextlib import contextmanager
from typing import List, Dict, Union, Generator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'ec2_host': os.getenv("EC2_HOST"),
    'ec2_user': os.getenv("EC2_USER"),
    'ec2_ssh_key_path': os.getenv("EC2_SSH_KEY_PATH"),
    'db_host': os.getenv("DB_HOST"),
    'db_user': os.getenv("DB_USER"),
    'db_password': os.getenv("DB_PASSWORD"),
    'db_name': "trivia_db"
}

# Validate environment variables
required_env_vars = [
    "EC2_HOST", "EC2_USER", "EC2_SSH_KEY_PATH",
    "DB_HOST", "DB_USER", "DB_PASSWORD"
]

for var in required_env_vars:
    if not os.getenv(var):
        raise EnvironmentError(f"Missing required environment variable: {var}")

try:
    ssh_key = paramiko.RSAKey.from_private_key_file(DB_CONFIG['ec2_ssh_key_path'])
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

@contextmanager
# The @contextmanager decorator relies on yield to enable context manager functionality.
def get_db_connection() -> Generator[pymysql.connections.Connection, None, None]:
    """
    Create a database connection using SSH tunnel.
    """
    tunnel = None
    connection = None

    try:
        # Establish SSH tunnel
        tunnel = SSHTunnelForwarder(
            (DB_CONFIG['ec2_host'], 22), # 22 is the default ssh port
            ssh_username=DB_CONFIG['ec2_user'],
            ssh_pkey=ssh_key,
            remote_bind_address=(DB_CONFIG['db_host'], 3306), # 3306 for ec2
            local_bind_address=('localhost', 3307)
        )
        tunnel.start()
        
        # Create database connection
        connection = pymysql.connect(
            host="localhost",
            port=tunnel.local_bind_port,
            user=DB_CONFIG['db_user'],
            password=DB_CONFIG['db_password'],
            db=DB_CONFIG['db_name'],
            cursorclass=pymysql.cursors.DictCursor
        )
        
        logger.info("Database connection established successfully")
        yield connection # yield return a Generator
        
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise
        
    finally:
        if connection:
            connection.close()
        if tunnel:
            tunnel.close()

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
