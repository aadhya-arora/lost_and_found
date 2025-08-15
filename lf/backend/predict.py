# backend/predict.py
from flask import Flask, request, jsonify
import pickle

# Load the trained model
with open("category_model.pkl", "rb") as f:
    vectorizer, model = pickle.load(f)

app = Flask(__name__)

@app.route("/predict-category", methods=["POST"])
def predict_category():
    data = request.get_json()
    text = data.get("text", "")
    if not text.strip():
        return jsonify({"error": "No text provided"}), 400
    X = vectorizer.transform([text])
    category = model.predict(X)[0]
    return jsonify({"category": category})

if __name__ == "__main__":
    app.run(port=5001)
