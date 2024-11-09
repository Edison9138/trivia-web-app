from flask import Flask, jsonify, request
from flask_cors import CORS
from db_actions import get_trivia_questions, get_wrong_answers
import math

app = Flask(__name__)
CORS(app) # eanble CORS for connecting backend with frontend

@app.route('/')
def home():
    return "Home Page of Trivia App"

@app.route('/get_questions', methods=['GET'])
def get_questions():
    question_types = request.args.get('question_type').split(',') # can have multiple question types
    category = request.args.get('category')
    difficulties = request.args.get('difficulty').split(',') # can have multiple difficulties
    count = request.args.get('count')

    # debugging
    print("Received question_types:", question_types)
    print("Received category:", category)
    print("Received difficulties:", difficulties)
    print("Received count:", count)
    
    response = get_trivia_questions(question_types, category, difficulties, count)

    if response["status"] == "fail":
        return jsonify({
            "status": "fail",
            "data": response["data"]
        })

    data = response["data"]
    questions = [entry["question"] for entry in data]
    correct_answers = [entry["correct_answer"] for entry in data]
    questions_ids = [entry["id"] for entry in data]
    wrong_answers = []

    wrong_answers_entries = [get_wrong_answers(id) for id in questions_ids]
    for wrong_answers_entry in wrong_answers_entries:
        if wrong_answers_entry["status"] == "success":
            wrong_data = wrong_answers_entry["data"]
            if len(wrong_data) == 1: # true/false
                wrong_answers.append(wrong_data[0]["wrong_answer"])
            else:  # multiple choice
                curr_wrong_answers = [entry["wrong_answer"] for entry in wrong_data]
                wrong_answers.append(curr_wrong_answers)
        else:
            wrong_answers.append([])

    return jsonify({
        "status": "success",
        "data": {
            "questions": questions,
            "correct_answers": correct_answers,
            "wrong_answers": wrong_answers,
            "question_ids": questions_ids 
        }
    })

@app.route('/calculate_score', methods=['POST'])
def calculate_score():
    data = request.get_json()
    user_answers = data.get('user_answers')
    correct_answers = data.get('correct_answers')

    if not user_answers or not correct_answers:
        return jsonify({
            "status": "fail",
            "data": "Missing user_answers or correct_answers in request body."
        }), 400

    if len(user_answers) != len(correct_answers):
        return jsonify({
            "status": "fail",
            "data": "Number of user answers and correct answers do not match."
        }), 400

    score_per_question = 100 / len(correct_answers)
    user_score = sum(
        score_per_question for ua, ca in zip(user_answers, correct_answers) if ua == ca
    )

    user_score = min(100, math.ceil(user_score))

    return jsonify({
        "status": "success",
        "data": {
            "user_score": user_score
        }
    })

if __name__ == '__main__':
    app.run(host='localhost', port=5001)
