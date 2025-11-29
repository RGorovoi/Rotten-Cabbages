import SearchBar from "../components/SearchBar.jsx";
import TrendingCarousel from "../components/TrendingCarousel.jsx";

export default function Home() {
  return (
    <>
      <section className="hero">
        <SearchBar />
        <p className="hero-tagline">Find your next watch, verifiably natural.</p>
      </section>
      <TrendingCarousel />
    </>
  );
}
