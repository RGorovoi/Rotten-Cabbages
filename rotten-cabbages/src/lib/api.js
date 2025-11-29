import axios from "axios";

const USE_MOCK = import.meta.env.VITE_MOCK === "1";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: API_BASE_URL });

// Mock data
const MOCK_MOVIES = [
  { tmdb_id: 550, title: "Fight Club", genres: ["Drama", "Thriller"], poster_url: null, rating: 8.8 },
  { tmdb_id: 13, title: "Forrest Gump", genres: ["Drama", "Romance"], poster_url: null, rating: 8.8 },
  { tmdb_id: 27205, title: "Inception", genres: ["Sci-Fi", "Thriller"], poster_url: null, rating: 8.8 },
  { tmdb_id: 278, title: "The Shawshank Redemption", genres: ["Drama"], poster_url: null, rating: 9.3 },
  { tmdb_id: 680, title: "Pulp Fiction", genres: ["Crime", "Drama"], poster_url: null, rating: 8.9 },
  { tmdb_id: 603, title: "The Matrix", genres: ["Action", "Sci-Fi"], poster_url: null, rating: 8.7 },
  { tmdb_id: 157336, title: "Interstellar", genres: ["Adventure", "Drama"], poster_url: null, rating: 8.6 },
  { tmdb_id: 238, title: "The Godfather", genres: ["Crime", "Drama"], poster_url: null, rating: 9.2 },
];

// Mock functions
const mockSuggestTitles = (q, limit = 8) => {
  const query = q.toLowerCase();
  return Promise.resolve(
    MOCK_MOVIES
      .filter(m => m.title.toLowerCase().includes(query))
      .slice(0, limit)
      .map(m => ({ ...m, score: m.rating, rating: m.rating }))
  );
};

const mockGetMovie = (tmdbId) => {
  const movie = MOCK_MOVIES.find(m => m.tmdb_id === parseInt(tmdbId));
  if (!movie) {
    return Promise.reject(new Error("Movie not found"));
  }
  return Promise.resolve({
    ...movie,
    overview: "A compelling story that captivates audiences with its unique narrative and memorable characters.",
  });
};

const mockGetUsersAlsoWatched = (tmdbId, k = 10) => {
  return Promise.resolve(
    MOCK_MOVIES
      .filter(m => m.tmdb_id !== parseInt(tmdbId))
      .slice(0, k)
  );
};

// API functions
// getTrending always uses the real /trending endpoint (demographic filter)
export const getTrending = (limit = 12) => {
  return api.get(`/trending`, { params: { limit } }).then(r => r.data);
};

export const suggestTitles = (q, limit = 8) => {
  if (USE_MOCK) {
    return mockSuggestTitles(q, limit);
  }
  return api.get(`/suggest`, { params: { query: q, limit } })
    .then(r => r.data)
    .catch(() => mockSuggestTitles(q, limit)); // Fallback to mock if endpoint doesn't exist
};

export const getMovie = (tmdbId) => {
  if (USE_MOCK) {
    return mockGetMovie(tmdbId);
  }
  return api.get(`/movie/${tmdbId}`)
    .then(r => r.data)
    .catch(() => mockGetMovie(tmdbId)); // Fallback to mock if endpoint doesn't exist
};

export const getUsersAlsoWatched = (tmdbId, k = 10) => {
  if (USE_MOCK) {
    return mockGetUsersAlsoWatched(tmdbId, k);
  }
  return api.get(`/movie/${tmdbId}/users_also_watched`, { params: { k } })
    .then(r => r.data)
    .catch(() => mockGetUsersAlsoWatched(tmdbId, k)); // Fallback to mock if endpoint doesn't exist
};

export default api;