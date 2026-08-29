import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "./loading";
import Modal from "../components/Modal";
import TopTier from "./toptier";
import { Link } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import { FALLBACK_MOVIES } from "../utils/fallbackMovies";
import "../styles/collection.css";

interface Movie {
  id: string;
  src: string;
  title: string;
  description: string;
  category: 'Series' | 'Movies' | 'Documentaries' | 'Others';
  genre: string;
  ratings: {
    excitement: number;
    romance: number;
    emotion: number;
    overall: number;
  };
  created_at: string;
  hot: string;
}

const DEFAULT_MOVIES: Movie[] = FALLBACK_MOVIES.map((movie: any) => ({
  ...movie,
  hot: movie.ratings?.overall >= 9 ? 'true' : 'false'
}));

function Collection() {
  const [loading, setLoading] = useState(false);
  const [selectedMovieForModal, setSelectedMovieForModal] = useState<Movie | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Series" | "Movies" | "Documentaries" | "Others" | "All">("Series");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [collection, setCollection] = useState<Movie[]>(DEFAULT_MOVIES);

  useEffect(() => {
    let isMounted = true;
    const fetchMovies = async () => {
      try {
        const { data, error } = await supabase.from('Store').select('*');
        if (!error && data && data.length > 0 && isMounted) {
          setCollection(data.map((movie: any) => ({
            ...movie,
            hot: movie.ratings?.overall >= 9 ? 'true' : 'false'
          })));
        }
      } catch (err) {
        console.error("Error fetching collection, using fallback:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredSeries = collection.find(movie => movie.category === "Series" && movie.hot === "true") ||
                        collection.find(movie => movie.category === "Series") ||
                        collection[0] ||
                        DEFAULT_MOVIES[0];


  const seriesGenres = Array.from(new Set(collection
    .filter(movie => movie.category === "Series")
    .map(movie => movie.genre)
  )).sort();

  const filteredMovies = selectedCategory === "All"
    ? collection
    : selectedCategory === "Series" && selectedGenre
    ? collection.filter(movie => movie.category === "Series" && movie.genre === selectedGenre)
    : collection.filter(movie => movie.category === selectedCategory);

  const sliderSettings = {
    dots: filteredMovies.length > 1 && filteredMovies.length <= 10, 
    infinite: filteredMovies.length >= 5, 
    speed: 500,
    slidesToShow: Math.min(filteredMovies.length, 5), 
    slidesToScroll: Math.min(filteredMovies.length, 2), 
    responsive: [
      { 
        breakpoint: 1024, 
        settings: { 
          slidesToShow: Math.min(filteredMovies.length, 4), 
          slidesToScroll: Math.min(filteredMovies.length, 2) 
        } 
      },
      { 
        breakpoint: 768, 
        settings: { 
          slidesToShow: Math.min(filteredMovies.length, 2), 
          slidesToScroll: 1 
        } 
      },
      { 
        breakpoint: 480, 
        settings: { 
          slidesToShow: 1, 
          slidesToScroll: 1 
        } 
      },
    ],
  };

  const closeModal = () => {
    setSelectedMovieForModal(null);
  };

  return (
    <div className="collection-container">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          {/* Series Hero Section */}
          {featuredSeries && (
            <div className="series-hero-section">
              <img 
                src={featuredSeries.src} 
                alt={featuredSeries.title} 
                onClick={() => {
                  setSelectedMovieForModal(featuredSeries);
                }}
                style={{ cursor: 'pointer' }}
              />
              <div className="series-hero-overlay">
                <div className="series-hero-content">
                  <span className="category-badge series">{featuredSeries.genre} Series</span>
                  <h1 
                    onClick={() => {
                      setSelectedMovieForModal(featuredSeries);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {featuredSeries.title}
                  </h1>
                  <p className="review-text">{featuredSeries.description}</p>
                  <div className="series-btn">
                    <Link to="/admin/login" ><button className="play-btn" aria-label="Play trailer">
                      <span className="play-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5V19L19 12L8 5Z" />
                        </svg>
                      </span>
                      Writing Blog
                    </button></Link>
                    
                    <button 
                      className="info-btn" 
                      aria-label="More info"
                      onClick={() => {
                        setSelectedMovieForModal(featuredSeries);
                      }}
                    >
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Navigation */}
          <nav className="category-nav">
            {["Series", "Movies", "Documentaries", "All"].map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category as "Series" | "Movies" | "Documentaries" | "Others" | "All");
                  if (category !== "Series") setSelectedGenre(null);
                }}
                aria-current={selectedCategory === category ? "true" : "false"}
              >
                {category === "All" ? "All Media" : category}
              </button>
            ))}
          </nav>

          {/* Series Genre Filter */}
          {selectedCategory === "Series" && (
            <div className="genre-filter">
              <button
                className={`genre-btn ${!selectedGenre ? 'active' : ''}`}
                onClick={() => setSelectedGenre(null)}
                aria-current={!selectedGenre ? "true" : "false"}
              >
                All Genres
              </button>
              {seriesGenres.map(genre => (
                <button
                  key={genre}
                  className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(genre)}
                  aria-current={selectedGenre === genre ? "true" : "false"}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}

          {/* Recommended Section */}
          <section className="recommend-container">
            <div className="section-header">
              <h2>{selectedCategory === "All" ? "Curated Collection" : selectedCategory === "Series" && selectedGenre ? `${selectedGenre} Series` : selectedCategory}</h2>
              <span className="movie-count-badge">{filteredMovies.length} Titles</span>
            </div>
            {filteredMovies.length <= 2 ? (
              <div className="movie-grid">
                {filteredMovies.map((movie) => (
                  <div key={movie.id} className="movie-card-item" onClick={() => setSelectedMovieForModal(movie)}>
                    <div className="movie-poster-wrapper">
                      <img
                        src={movie.src}
                        alt={movie.title}
                        loading="lazy"
                      />
                      <div className="poster-rating-pill">
                        <span className="star-icon">★</span>
                        <span>{movie.ratings?.overall?.toFixed(1) || "N/A"}</span>
                      </div>
                      <div className="movie-overlay-info">
                        <span className="card-genre-badge">{movie.genre}</span>
                        <h3 className="card-movie-title">{movie.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="slider-wrapper-custom">
                <Slider {...sliderSettings}>
                  {filteredMovies.map((movie) => (
                    <div key={movie.id} className="movie-card-item" onClick={() => setSelectedMovieForModal(movie)}>
                      <div className="movie-poster-wrapper">
                        <img
                          src={movie.src}
                          alt={movie.title}
                          loading="lazy"
                        />
                        <div className="poster-rating-pill">
                          <span className="star-icon">★</span>
                          <span>{movie.ratings?.overall?.toFixed(1) || "N/A"}</span>
                        </div>
                        <div className="movie-overlay-info">
                          <span className="card-genre-badge">{movie.genre}</span>
                          <h3 className="card-movie-title">{movie.title}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </section>

          {selectedMovieForModal && (
            <Modal movie={selectedMovieForModal} onClose={closeModal} />
          )}
          <TopTier />
        </>
      )}
    </div>
  );
}

export default Collection;