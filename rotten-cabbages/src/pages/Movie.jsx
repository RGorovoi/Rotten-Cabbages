import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovie, getUsersAlsoWatched } from "../lib/api";
import MovieCard from "../components/MovieCard.jsx";

export default function Movie() {
  const { tmdbId } = useParams();
  const [movie, setMovie] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMovie(null);
    setRecs([]);
    setLoading(true);
    setError(null);
    
    Promise.all([
      getMovie(tmdbId).catch(err => {
        console.error("Failed to load movie:", err);
        setError("Failed to load movie details");
        throw err;
      }),
      getUsersAlsoWatched(tmdbId, 12).catch(err => {
        console.error("Failed to load recommendations:", err);
        return [];
      })
    ])
      .then(([movieData, recsData]) => {
        setMovie(movieData);
        setRecs(recsData);
      })
      .catch(() => {
        // Error already set above
      })
      .finally(() => setLoading(false));
  }, [tmdbId]);

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (error || !movie) return <div className="error">{error || "Movie not found"}</div>;

  return (
    <>
      <section className="movie-hero">
        <div className="poster-skel hero-poster" />
        <div className="movie-info">
          <h1 className="movie-title">{movie.title}</h1>
          {movie.rating && <div className="movie-rating">{movie.rating}/10</div>}
          {movie.genres && movie.genres.length > 0 && (
            <div className="movie-genres">
              {movie.genres.map((genre, idx) => (
                <span key={idx} className="genre-tag">{genre}</span>
              ))}
            </div>
          )}
          {movie.overview && <p className="movie-overview">{movie.overview}</p>}
        </div>
      </section>

      {recs.length > 0 && (
        <section className="section">
          <h2 className="section-title">Users Also Watched</h2>
          <div className="grid">
            {recs.map(m => <MovieCard key={m.tmdb_id} m={m} />)}
          </div>
        </section>
      )}
    </>
  );
}
