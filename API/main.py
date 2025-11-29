from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rapidfuzz import process, fuzz
import numpy as np
import pandas as pd
import json
import os
import tensorflow as tf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# File paths
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "Data")
MOVIES_CSV = os.path.join(DATA_DIR, "clean_parsed_tmdb_5000.csv")
LINKS_CSV = os.path.join(DATA_DIR, "links.csv")

app = FastAPI(title="RottenCabbages API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data
try:
    movies = pd.read_csv(MOVIES_CSV)
    movies = movies.dropna(subset=["id","title"])
    
    # Ensure required columns exist
    if "vote_average" not in movies.columns or "vote_count" not in movies.columns:
        raise ValueError("Required columns 'vote_average' or 'vote_count' not found in CSV")
    
    links = pd.read_csv(LINKS_CSV)[["movieId","tmdbId"]].dropna()
    links["tmdbId"] = links["tmdbId"].astype(int)
    
    title_index = movies.merge(links, left_on="id", right_on="tmdbId", how="inner")[["title","id","movieId"]]
except Exception as e:
    print(f"Error loading data: {e}")
    raise

######################
# DEMOGRAPHIC BASED TRENDING MOVIES
def compute_trending_movies(top_percent = 30, top_k = 20):
    # Mean average rating across all movies
    mean_rating = movies["vote_average"].mean()
    
    # Handle case where mean_rating might be NaN
    if pd.isna(mean_rating):
        mean_rating = 0.0
    
    quant = 1 - (top_percent / 100)
    # Minimum votes required to be in the top %
    minimum_votes = movies['vote_count'].quantile(quant)
    
    # Handle case where minimum_votes might be NaN
    if pd.isna(minimum_votes):
        minimum_votes = 0.0
    
    topMovies = movies.copy().loc[movies['vote_count'] >= minimum_votes]
    
    # If no movies meet the criteria, return empty list
    if len(topMovies) == 0:
        return []
    
    def weighted_rating(x, m=minimum_votes, C=mean_rating):
        v = x['vote_count']
        R = x['vote_average']
        # IMDB formula for weighted rating
        return (v / (v + m) * R) + (m / (m + v) * C)

    # Calculate weighted score
    topMovies['score'] = topMovies.apply(weighted_rating, axis=1) 
    
    # Sort movies by score
    topMovies = topMovies.sort_values('score', ascending=False)
    
    # Convert to list of dictionaries
    result = []
    for r in topMovies.head(top_k).to_dict(orient="records"):
        result.append({
            "tmdb_id": int(r["id"]),
            "title": str(r["title"]),
            "genres": [g.strip() for g in str(r.get("genres","")).split(",")[:2]],
            "vote_average": float(r.get("vote_average", 0)),
            "vote_count": int(r.get("vote_count", 0)),
            "score": float(r.get("score", 0)),
            "poster_url": None
        })
    return result

trendingMovies = compute_trending_movies(top_percent = 30, top_k = 20)
###################

###################
# ENDPOINTS
@app.get("/health")
def health():
    return {"ok": True}

@app.get("/trending")
def trending(limit: int = 12):
    return trendingMovies[:limit]

# TO HOST:
'''
Use Railway (fast), Render, or Fly.io. Add requirements.txt (fastapi, uvicorn[standard], pandas, rapidfuzz, scikit-learn, tensorflow if using collab model).

Ensure CORS is ON (already done). Grab the public API URL for the frontend env var.
'''