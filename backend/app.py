from flask import Flask, jsonify, request
from db_actions import get_trivia_questions, get_wrong_answers
import math

app = Flask(__name__)

# Ok for small projects, but not for large projects
questions_ids = []
questions = []
correct_answers = []
wrong_answers = []

@app.route('/')
def home():
    return "Home Page of Trivia App"

@app.route('/hello')
def hellp():
    return "Hello from Trivia App"

@app.route('/get_questions', methods=['GET'])
def get_questions():
    global questions, correct_answers, wrong_answers, questions_ids, wrong_answers

    question_type = request.args.get('question_type')
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    count = request.args.get('count')
    response = get_trivia_questions(question_type, category, difficulty, count)

    if response["status"] == "fail":
        return response
    else:
        data = response["data"]
        questions = [entry["question"] for entry in data]
        correct_answers = [entry["correct_answer"] for entry in data]
        questions_ids = [entry["id"] for entry in data]
        wrong_answers = []

        wrong_answers_entries = [get_wrong_answers(id) for id in questions_ids]
        for wrong_answers_entry in wrong_answers_entries:
            data = wrong_answers_entry["data"]
            if len(data) == 1: # boolean
                wrong_answers.append(data[0]["wrong_answer"])
            else: # multiple choice
                curr_wrong_answers = []
                for data_entry in data: 
                    curr_wrong_answers.append(data_entry["wrong_answer"])
                wrong_answers.append(curr_wrong_answers)

        return jsonify({
            "status": "success",
            "data": {
                "questions": questions,
                "correct_answers": correct_answers,
                "wrong_answers": wrong_answers
            }
        })

@app.route('/calculate_score', methods=['GET'])
def calculate_score():

    global questions, correct_answers
    score_per_question = 100 / len(questions)
    user_score = 0
    user_answers = request.args.getlist('user_answers')

    for i in range(len(questions)):
        if user_answers[i] == correct_answers[i]:
            user_score += score_per_question

    user_score = min(100, math.ceil(user_score))

    return jsonify({
        "status": "success",
        "data": {
            "user_score": user_score
        }
    })

if __name__ == '__main__':
    app.run(host='localhost', port=5001)


# http://localhost:5001/get_questions?question_type=boolean&category=Art&difficulty=medium&count=3
# http://localhost:5001/calculate_score?user_answers=True&user_answers=True&user_answers=False
