import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class BookSearchEngine:
    def __init__(self, csv_path):
        self.df = pd.read_csv(csv_path).fillna("")
        self.df['combined'] = (
            self.df['judul'] + " " + self.df['deskripsi_cleaned'] + " " + self.df['author']
        )
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['combined'])

    def preprocess_query(self, query):
        query = query.lower()
        query = re.sub(r'[^a-zA-Z0-9\s]', '', query)
        return query

    def search(self, query, min_score=0.05):
        clean_query = self.preprocess_query(query)

        # Handle AND / OR logic
        if " and " in clean_query:
            keywords = [k.strip() for k in clean_query.split(" and ")]
            match_mode = "AND"
        elif " or " in clean_query:
            keywords = [k.strip() for k in clean_query.split(" or ")]
            match_mode = "OR"
        else:
            keywords = [clean_query]
            match_mode = "DEFAULT"

        scores = None
        for keyword in keywords:
            query_vec = self.vectorizer.transform([keyword])
            sim = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

            if scores is None:
                scores = sim
            else:
                if match_mode == "AND":
                    scores *= sim  # Element-wise multiplication
                elif match_mode == "OR":
                    scores = (scores + sim) / 2  # Mean of similarities

        indices = scores.argsort()[::-1]
        filtered = [(i, scores[i]) for i in indices if scores[i] >= min_score]

        results = self.df.iloc[[i for i, _ in filtered]].copy()
        results['score'] = [s for _, s in filtered]
        return results.to_dict(orient="records")
