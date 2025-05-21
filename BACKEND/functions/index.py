from flask import Flask
from flask_cors import CORS
from functions_framework import create_app

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Hello, Flask on Firebase!"

if __name__ == "__main__":
    app.run()
