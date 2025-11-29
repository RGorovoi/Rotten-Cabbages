import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <img src="/CabbagesLogo3.png" alt="Rotten Cabbages" className="logo-img" />
        </Link>
        <nav className="nav-links">
          <a href="https://github.com" target="_blank" rel="noreferrer">View on GitHub</a>
        </nav>
      </div>
    </header>
  );
}