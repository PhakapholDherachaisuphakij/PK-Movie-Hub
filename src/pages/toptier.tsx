import { useEffect, useState, useRef } from "react";
import { createClient } from '@supabase/supabase-js';
import Loading from "./loading";
import "../styles/toptier.css";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

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

const TopTier: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

        if (error) throw new Error(error.message);

        // Map data to include full image URL, hot, and rank
        const mappedMovies = data.map((movie: Omit<Movie, 'hot' | 'rank'>, index: number) => ({
          ...movie,
          src: `${movie.src}`,
          hot: movie.ratings.overall >= 9 ? 'true' : 'false', // Compute hot based on overall rating
          rank: index + 1, // Assign rank based on sorted order
        }));

        setMovies(mappedMovies);
      } catch (err) {
        setError('Failed to load movies');
        console.error(err);
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
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="tier-section">
          <h2 className="tier-title">PK Top 10 Ranking</h2>
          <div className="ranking-list">
            {rankedMovies.map((movie) => (
              <div
                key={movie.id} // Use unique id
                className="ranking-card"
                onClick={() => setHoveredMovie(movie)}
              >
                <div className="ranking-content">
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
                    <span className="rank-number">#{movie.rank}</span>
                    <div className="movie-details">
                      <span className="movie-title">{movie.title}</span>
                      <span className="movie-category">{movie.category}</span>
                      <span className="movie-rating">
                        <span className="star">★</span> {movie.ratings.overall.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hoveredMovie && (
            <div className="movie-modal-backdrop" onClick={() => setHoveredMovie(null)}>
              <div className="movie-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setHoveredMovie(null)}>
                  ×
                </button>
                <img
                  src={hoveredMovie.src || "/images/placeholder.png"}
                  alt={hoveredMovie.title}
                  className="modal-image"
                  loading="lazy"
                />
                <div className="modal-content">
                  <h3 className="modal-title">{hoveredMovie.title}</h3>
                  <p className="modal-category">{hoveredMovie.category}</p>
                  <p className="modal-description">{hoveredMovie.description}</p>
                  <div className="modal-ratings">
                    {[
                      { label: "ความมัน", value: hoveredMovie.ratings.excitement },
                      { label: "ความฟิน", value: hoveredMovie.ratings.romance },
                      { label: "ความซึ้ง", value: hoveredMovie.ratings.emotion },
                      { label: "Overall", value: hoveredMovie.ratings.overall },
                    ].map((rating) => (
                      <div key={rating.label} className="rating-item">
                        <span className="rating-label">{rating.label}</span>
                        <div className="rating-bar">
                          <div style={{ width: `${rating.value * 10}%` }} />
                        </div>
                        <span className="rating-value">{rating.value.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopTier;