from flask import Flask, request, jsonify
from flask_cors import CORS
from search_engine import BookSearchEngine

app = Flask(__name__)
CORS(app)
search_engine = BookSearchEngine("books_with_authors.csv")

@app.route("/api/search", methods=["GET"])
def search():
    query = request.args.get("q", "")
    if not query.strip():
        return jsonify([])
    results = search_engine.search(query)
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)