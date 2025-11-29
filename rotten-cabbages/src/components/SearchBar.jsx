import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { suggestTitles } from "../lib/api";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const ref = useRef();

  useEffect(() => {
    const h = setTimeout(async () => {
      if (q.trim().length < 2) { setItems([]); setOpen(false); return; }
      setLoading(true);
      try {
        const res = await suggestTitles(q.trim(), 8);
        setItems(res);
        setOpen(true);
      } catch (err) {
        console.error("Search error:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(h);
  }, [q]);

  useEffect(() => {
    const onClick = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const handleSelect = (tmdbId) => {
    setOpen(false);
    setQ("");
    nav(`/${tmdbId}`);
  };

  return (
    <div className="search-wrap" ref={ref}>
      <input
        className="search-input"
        placeholder="Search for any movie..."
        value={q}
        onChange={e => setQ(e.target.value)}
        onFocus={() => items.length > 0 && setOpen(true)}
        aria-label="Search for movies"
        aria-expanded={open}
        aria-controls="autocomplete-results"
      />
      {open && (
        <div className="autocomplete" id="autocomplete-results" role="listbox">
          {loading && <div className="ac-item">Loading...</div>}
          {!loading && items.length === 0 && q.trim().length >= 2 && (
            <div className="ac-item">No matches found</div>
          )}
          {!loading && items.map(it => (
            <div
              key={it.tmdb_id}
              className="ac-item"
              onClick={() => handleSelect(it.tmdb_id)}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(it.tmdb_id);
                }
              }}
            >
              <div className="poster-skel" />
              <div className="ac-text">
                <div className="ac-title">{it.title}</div>
                {it.genres && it.genres.length > 0 && (
                  <div className="ac-genres">{it.genres.slice(0, 2).join(", ")}</div>
                )}
                {it.rating && (
                  <div className="ac-sub">★ {it.rating}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
