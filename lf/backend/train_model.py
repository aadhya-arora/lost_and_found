import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

# 🔧 Expanded sample dataset
data = {
    "text": [
        "laptop", "notebook", "macbook", "dell laptop", "hp laptop", "lenovo laptop",
        "mobile", "smartphone", "iphone", "samsung phone", "oneplus",
        "bag", "wallet", "purse", "handbag",
        "watch", "rolex watch", "smartwatch",
        "charger", "cable", "adapter", "headphones", "earphones"
    ],
    "category": [
        "electronics", "electronics", "electronics", "electronics", "electronics", "electronics",
        "electronics", "electronics", "electronics", "electronics", "electronics",
        "accessories", "accessories", "accessories", "accessories",
        "accessories", "accessories", "accessories",
        "accessories", "accessories", "accessories", "accessories", "accessories"
    ]
}

# Verify counts
assert len(data["text"]) == len(data["category"]), f"Length mismatch: {len(data['text'])} vs {len(data['category'])}"

df = pd.DataFrame(data)

# Vectorize text
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["text"])
y = df["category"]

# Train model
model = MultinomialNB()
model.fit(X, y)

# Save model and vectorizer
with open("category_model.pkl", "wb") as f:
    pickle.dump((vectorizer, model), f)

print("✅ Model trained and saved as category_model.pkl")
