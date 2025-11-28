# Demographic-based filter showing top movies using the IMDB weighted rating formula

import pandas as pd
import numpy as np

merged_df = pd.read_csv('../Data/clean_parsed_tmdb_5000.csv')
C = merged_df['vote_average'].mean()
print('Mean average rating =', C)  # Mean average rating across all movies

m = merged_df['vote_count'].quantile(0.70)
print('Minimum votes required to be in top 30% =', m) # Minimum votes required to be in the top 30%

topMovies = merged_df.copy().loc[merged_df['vote_count'] >= m]
print(topMovies.shape) # Shape of the filtered dataframe

def weighted_rating(x, m=m, C=C):
    v = x['vote_count']
    R = x['vote_average']
    # IMDB formula for weighted rating
    return (v / (v + m) * R) + (m / (m + v) * C)

topMovies['score'] = topMovies.apply(weighted_rating, axis=1) # Calculate weighted score
topMovies = topMovies.sort_values('score', ascending=False) # Sort movies by score

print(topMovies[['title', 'vote_count', 'vote_average', 'score']].head(15))
# Print top 15 movies based on the weighted score