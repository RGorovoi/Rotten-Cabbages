import { Link } from "react-router-dom";

export default function MovieCard({ m }) {
  return (
    <Link to={`/${m.tmdb_id}`} className="card small">
      <div className="poster-skel" />
      <div className="card-body">
        <div className="card-title">{m.title}</div>
        {m.rating && <div className="card-rating">{m.rating}</div>}
      </div>
    </Link>
  );
}
