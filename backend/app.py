from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Flask Backend!"

@app.route('/api')
def hello_world():
    return jsonify(message='Hello from Flask!')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)