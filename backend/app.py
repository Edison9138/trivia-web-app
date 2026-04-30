from flask import Flask, jsonify, request
from flask_cors import CORS
import math
import logging
import os
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

QUESTION_TYPE_ALIASES = {
    "True/False": "boolean",
    "true/false": "boolean",
    "Boolean": "boolean",
    "boolean": "boolean",
    "Multiple Choice": "Multiple Choice",
    "multiple choice": "Multiple Choice",
    "multiple": "Multiple Choice",
}

def create_error_response(message, status_code=400):
    """Helper function to create consistent error responses"""
    return jsonify({
        "status": "fail",
        "data": message
    }), status_code

def create_success_response(data):
    """Helper function to create consistent success responses"""
    return jsonify({
        "status": "success",
        "data": data
    })

def normalize_question_types(question_types):
    normalized_types = []

    if isinstance(question_types, str):
        question_types = [question_types]
    elif not isinstance(question_types, list):
        raise ValueError("question_types must be a list")

    for question_type in question_types:
        if not isinstance(question_type, str):
            raise ValueError("question_types must contain only strings")

        question_type_key = question_type.strip()
        normalized_type = (
            QUESTION_TYPE_ALIASES.get(question_type_key)
            or QUESTION_TYPE_ALIASES.get(question_type_key.lower())
        )
        if normalized_type is None:
            raise ValueError(f"Unsupported question type: {question_type}")
        normalized_types.append(normalized_type)

    return normalized_types

@app.route('/')
def home():
    return "Home Page of Trivia App"

# In a RESTful API, POST is the standard for submitting complex queries or performing actions that involve processing or computations.
@app.route('/get-questions', methods=['POST'])  # Changed to POST and hyphenated endpoint
def get_questions():
    """
    Endpoint to retrieve trivia questions based on parameters provided in the request body.

    Required parameters:

    - `question_types`: List of question types (e.g. boolean, multiple)
    - `category`: Category of questions (e.g. Animals, History)
    - `difficulties`: List of difficulties (e.g. easy, medium, hard)

    Optional parameters:

    - `count`: Number of questions to retrieve (default: 10)

    Returns a JSON response with the following format:

    {
        "status": "success",
        "data": {
            "questions": [...],
            "answers": [...],
            "question_ids": [...]
        }
    }

    If there are any errors, returns a JSON response with a 400 status code and the following format:

    {
        "status": "fail",
        "data": "<error message>"
    }
    """
    
    try:
        # Get data from request body instead of URL parameters
        data = request.get_json()
        if not data:
            return create_error_response("No data provided in request body")

        question_types = data.get('question_types')
        category = data.get('category')
        difficulties = data.get('difficulties')
        count = data.get('count', 10)  # Default to 10 if not provided

        # Validate required parameters
        if not all([question_types, category, difficulties]):
            return create_error_response(
                "Missing required parameters. Need question_types, category, and difficulties"
            )

        try:
            question_types = normalize_question_types(question_types)
        except ValueError as e:
            return create_error_response(str(e))

        # Log incoming request
        logger.info(f"Received request with: types={question_types}, "
                   f"category={category}, difficulties={difficulties}, count={count}")

        from db_actions import get_trivia_questions

        # Get questions from database
        response = get_trivia_questions(question_types, category, difficulties, count)
        if response["status"] == "fail":
            return create_error_response(response["data"])

        # Process questions and answers
        questions_data = response["data"]
        formatted_data = {
            "questions": [],
            "answers": [],
            "question_ids": []
        }

        # Process each question
        for question in questions_data:
            question_id = question["id"]
            wrong_answers = question["wrong_answers"]

            # Add question data to formatted response
            formatted_data["questions"].append(question["question"])
            all_answers = [question["correct_answer"]] + wrong_answers
            random.shuffle(all_answers)
            formatted_data["answers"].append(all_answers)
            formatted_data["question_ids"].append(question_id)


        success_response = create_success_response(formatted_data)
        print("success_response from /get-questions:", success_response)
        return success_response

    except Exception as e:
        logger.exception("Error processing question request")
        return create_error_response(str(e), 500)

@app.route('/calculate-score', methods=['POST'])
def calculate_score():
    try:
        data = request.get_json()
        if not data:
            return create_error_response("No data provided in request body")

        user_answers = data.get('user_answers')
        question_ids = data.get('question_ids')

        # Validate inputs
        if user_answers is None or question_ids is None:
            return create_error_response(
                "Missing user_answers or question_ids in request body"
            )

        if not isinstance(user_answers, list) or not isinstance(question_ids, list):
            return create_error_response(
                "user_answers and question_ids must be lists"
            )

        if not user_answers or not question_ids:
            return create_error_response(
                "At least one answer is required"
            )

        if len(user_answers) != len(question_ids):
            return create_error_response(
                "Number of user answers and question ids do not match"
            )

        try:
            question_ids = [int(question_id) for question_id in question_ids]
        except (TypeError, ValueError):
            return create_error_response("question_ids must contain only integers")

        from db_actions import get_correct_answers

        correct_answers_response = get_correct_answers(question_ids)
        if correct_answers_response["status"] == "fail":
            return create_error_response(correct_answers_response["data"])

        correct_answers = correct_answers_response["data"]

        # Calculate score
        total_questions = len(correct_answers)
        correct_count = sum(
            1 for ua, ca in zip(user_answers, correct_answers) if ua == ca
        )
        user_score = (correct_count / total_questions) * 100
        final_score = min(100, math.ceil(user_score))

        success_response = create_success_response({"user_score": final_score})
        print("success_response from /calculate-score:", success_response)
        return success_response

    except Exception as e:
        logger.exception("Error calculating score")
        return create_error_response(str(e), 500)

@app.errorhandler(404)
def not_found(error):
    return create_error_response("Resource not found", 404)

@app.errorhandler(405)
def method_not_allowed(error):
    return create_error_response("Method not allowed", 405)

@app.errorhandler(500)
def internal_error(error):
    return create_error_response("Internal server error", 500)

if __name__ == '__main__':
    app.run(
        host=os.getenv("FLASK_RUN_HOST", "0.0.0.0"),
        port=int(os.getenv("FLASK_RUN_PORT", "5001")),
    )
