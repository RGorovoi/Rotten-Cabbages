# Manual filter based on demographic criteria such as rating, genre, release year range, language, and runtime range

import pandas as pd
import numpy as np

# Cleaned, parsed, merged TMDB dataset
merged_df = pd.read_csv('../Data/clean_parsed_tmdb_5000.csv')

def demographic_filter(merged_df, min_vote_count=100, min_vote_average=0, genres=None, min_year=None, max_year=None, language=None, 
                       min_runtime=0, max_runtime=350):
    """
    Filter movies based on various demographic criteria
    Parameters:
    - min_vote_count: Minimum number of votes (popularity threshold)
    - min_vote_average: Minimum average rating (0-10)
    - genres: List of genres to include (ex. ['Action', 'Comedy'])
    - min_year: Earliest release year
    - max_year: Latest release year
    - language: Spoken language (ex. 'English')
    - min_runtime: Minimum movie runtime (minutes)
    - max_runtime: Maximum movie runtime (minutes)
    """
    
    filtered_df = merged_df.copy()
    
    # Filter by vote count (popularity)
    filtered_df = filtered_df[filtered_df['vote_count'] >= min_vote_count]
    
    # Filter by vote average (rating)
    filtered_df = filtered_df[filtered_df['vote_average'] >= min_vote_average]
    
    # Filter by genres
    if genres:
        genre_mask = filtered_df['genres'].apply(
            lambda x: any(genre in str(x) for genre in genres)
        )
        filtered_df = filtered_df[genre_mask]
    
    # Filter by release year
    if min_year or max_year:
        filtered_df['year'] = pd.to_datetime(filtered_df['release_date']).dt.year
        if min_year:
            filtered_df = filtered_df[filtered_df['year'] >= min_year]
        if max_year:
            filtered_df = filtered_df[filtered_df['year'] <= max_year]
    
    # Filter by language
    if language:
        filtered_df = filtered_df[filtered_df['spoken_languages'].str.contains(language, na=False)]
    
    # Filter by runtime
    if 'runtime' in filtered_df.columns:
        filtered_df = filtered_df[
            (filtered_df['runtime'] >= min_runtime) & 
            (filtered_df['runtime'] <= max_runtime)
        ]
    
    return filtered_df

# Example 1: Get popular horror movies from 1980-1990 with good ratings
popular_horror = demographic_filter(
    merged_df, 
    min_vote_count=500,
    min_vote_average=7.0,
    genres=['Horror'],
    min_year=1980,
    max_year=1990,
)

print(f"Found {len(popular_horror)} movies within criteria")
print("\nTop recommendations sorted by rating:")
print((popular_horror.sort_values(by='vote_average', ascending=False))[['title', 'vote_average', 'release_date', 'genres']].head(10))

# Example 2: Get action movies over 2 hours long sorted by runtime
long_action_movies = demographic_filter(
    merged_df,
    min_vote_count=200,
    min_vote_average=6.5,
    genres=['Action'],
    min_runtime=120
)

print(f"\n\nFound {len(long_action_movies)} movies within criteria")
print("\nTop recommendations sorted by runtime:")
print((long_action_movies.sort_values(by='runtime', ascending=False))[['title', 'vote_average', 'runtime']].head(10))