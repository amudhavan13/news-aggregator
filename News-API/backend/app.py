from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
from sklearn.feature_extraction.text import TfidfVectorizer

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = r"F:\news aggregator\News-API\News-API\backend\model\decision_tree_model (1).pkl"
model = load(model_path)

# Initialize a new TF-IDF vectorizer (approximate settings used in training)
vectorizer = TfidfVectorizer(max_features=5000)

@app.route('/')
def home():
    return "News Fake Detection API"

# Endpoint for fake news prediction
@app.route('/api/check_fake_news', methods=['POST'])
def check_if_fake_news():
    data = request.get_json()
    news_text = data.get("text")

    if not news_text:
        return jsonify({"error": "No news text provided"}), 400

    # Transform the text using the vectorizer
    transformed_text = vectorizer.fit_transform([news_text])

    # Predict using the loaded model
    prediction = model.predict(transformed_text)

    # Map the prediction to readable output
    result = "Real" if prediction[0] == 1 else "Fake"
    
    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
