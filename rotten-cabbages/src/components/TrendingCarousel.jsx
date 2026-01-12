import { useEffect, useState } from "react";
import { getTrending } from "../lib/api";
import { Link } from "react-router-dom";

export default function TrendingCarousel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getTrending(12)
      .then(setItems)
      .catch(err => {
        console.error("Failed to load trending:", err);
        setError("Failed to load trending movies");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <h2 className="section-title">Trending Now</h2>
      {loading && <div className="loading">Loading trending movies...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <div className="carousel" role="region" aria-label="Trending carousel">
          {items.map(m => (
            <Link key={m.tmdb_id} to={`/${m.tmdb_id}`} className="card">
              <img 
                src={m.poster_url || "/placeholder.png"} 
                alt={m.title} 
                className="poster-img large"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
              <div className="card-body">
                <div className="card-title">{m.title}</div>
                {m.rating && <div className="card-rating">{m.rating}</div>}
                {m.genres && m.genres.length > 0 && (
                  <div className="card-sub">{(m.genres || []).slice(0,2).join(" • ")}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
