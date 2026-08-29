import { useEffect, useState, useRef } from "react";
import Loading from "./loading";
import Modal from "../components/Modal";
import { supabase } from "../supabaseClient";
import { FALLBACK_MOVIES } from "../utils/fallbackMovies";
import "../styles/toptier.css";

interface Movie {
  id: string;
  src: string;
  title: string;
  description: string;
  category: 'Series' | 'Movies' | 'Documentaries';
  genre: 'Romance' | 'Drama' | 'Action' | 'Thriller' | 'Documentary' | 'Comedy';
  ratings: {
    excitement: number;
    romance: number;
    emotion: number;
    overall: number;
  };
  created_at: string;
  hot: string;
  rank?: number;
}

const DEFAULT_RANKED_MOVIES: Movie[] = [...FALLBACK_MOVIES]
  .sort((a, b) => (b.ratings?.overall || 0) - (a.ratings?.overall || 0))
  .map((movie: any, index: number) => ({
    ...movie,
    hot: (movie.ratings?.overall || 0) >= 9 ? 'true' : 'false',
    rank: index + 1,
  }));

const TopTier: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(DEFAULT_RANKED_MOVIES);
  const [loading, setLoading] = useState<boolean>(false);
  const [hoveredMovie, setHoveredMovie] = useState<Movie | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch movies from Supabase
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const { data, error } = await supabase
          .from('Store')
          .select('*')
          .order('ratings->overall', { ascending: false }); 

        if (!error && data && data.length > 0) {
          const mappedMovies = data.map((movie: Omit<Movie, 'hot' | 'rank'>, index: number) => ({
            ...movie,
            src: `${movie.src}`,
            hot: (movie.ratings?.overall || 0) >= 9 ? 'true' : 'false',
            rank: index + 1,
          }));
          setMovies(mappedMovies);
        }
      } catch (err) {
        console.error('Failed to load live movies, fallback in use:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        event.type === "mousedown"
      ) {
        setHoveredMovie(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter and sort movies for top 15
  const rankedMovies = movies
    .filter((movie) => movie.rank && movie.rank <= 15)
    .sort((a, b) => (a.rank || 0) - (b.rank || 0));

  return (
    <div className="toptier-container">
      {loading ? (
        <Loading />
      ) : (
        <div className="tier-section">
          <div className="tier-header-wrapper">
            <span className="tier-pre-badge">🏆 TOP RATED</span>
            <h2 className="tier-title">Hall of Fame Rankings</h2>
            <p className="tier-subtitle">Highest rated cinematic masterpieces in the collection</p>
          </div>
          
          <div className="ranking-list">
            {rankedMovies.map((movie) => (
              <div
                key={movie.id}
                className="ranking-card"
                onClick={() => setHoveredMovie(movie)}
              >
                <div className="ranking-content">
                  <div className="rank-number-box">
                    <span className="rank-num">
                      {String(movie.rank).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="ranking-image-wrapper">
                    <img
                      src={movie.src || "/images/placeholder.png"}
                      alt={movie.title}
                      className="ranking-image"
                      loading="lazy"
                    />
                    <div className="image-overlay" />
                  </div>

                  <div className="ranking-info">
                    <div className="movie-details">
                      <div className="meta-pill-row">
                        <span className="movie-category-pill">{movie.category}</span>
                        <span className="movie-genre-pill">{movie.genre}</span>
                      </div>
                      <h3 className="movie-title">{movie.title}</h3>
                      <p className="movie-desc-excerpt">{movie.description}</p>
                    </div>

                    <div className="movie-rating-badge">
                      <span className="star-icon">★</span>
                      <span className="rating-num">{movie.ratings.overall.toFixed(1)}</span>
                      <span className="rating-max">/10</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hoveredMovie && (
            <Modal 
              movie={hoveredMovie} 
              onClose={() => setHoveredMovie(null)} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TopTier;