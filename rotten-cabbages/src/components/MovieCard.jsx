import { Link } from "react-router-dom";

export default function MovieCard({ m }) {
  return (
    <Link to={`/${m.tmdb_id}`} className="card small">
      <img 
        src={m.poster_url || "/placeholder.png"} 
        alt={m.title} 
        className="poster-img"
        onError={(e) => {
          e.target.src = "/placeholder.png";
        }}
      />
      <div className="card-body">
        <div className="card-title">{m.title}</div>
        {m.rating && <div className="card-rating">{m.rating}</div>}
      </div>
    </Link>
  );
}
