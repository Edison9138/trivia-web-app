from flask import Flask, jsonify, request
from flask_cors import CORS
from db_actions import get_trivia_questions, get_wrong_answers
import math
import logging
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

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
            "correct_answers": [...],
            "wrong_answers": [...],
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

        # Log incoming request
        logger.info(f"Received request with: types={question_types}, "
                   f"category={category}, difficulties={difficulties}, count={count}")

        # Get questions from database
        response = get_trivia_questions(question_types, category, difficulties, count)
        if response["status"] == "fail":
            return create_error_response(response["data"])

        # Process questions and get wrong answers
        questions_data = response["data"]
        formatted_data = {
            "questions": [],
            "correct_answers": [],
            "answers": [],
            "question_ids": []
        }

        # Process each question
        for question in questions_data:
            question_id = question["id"]
            
            # Get wrong answers for this question
            wrong_answers_response = get_wrong_answers(question_id)
            if wrong_answers_response["status"] != "success":
                logger.warning(f"Failed to get wrong answers for question {question_id}")
                continue

            # Format wrong answers based on question type
            wrong_answers_data = wrong_answers_response["data"]
            wrong_answers = (
                [wrong_answers_data[0]["wrong_answer"]]  # For true/false
                if len(wrong_answers_data) == 1
                else [entry["wrong_answer"] for entry in wrong_answers_data]  # For multiple choice
            )

            # Add question data to formatted response
            formatted_data["questions"].append(question["question"])
            formatted_data["correct_answers"].append(question["correct_answer"])
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
        correct_answers = data.get('correct_answers')

        # Validate inputs
        if not all([user_answers, correct_answers]):
            return create_error_response(
                "Missing user_answers or correct_answers in request body"
            )

        if len(user_answers) != len(correct_answers):
            return create_error_response(
                "Number of user answers and correct answers do not match"
            )

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
    app.run(host='0.0.0.0', port=5001)  # Changed to 0.0.0.0 for Docker compatibility
