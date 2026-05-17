import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
// import Collections from "../../utils/movie"; // ลบออก
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from "./loading";
import Modal from "../components/Modal";
import TopTier from "./toptier";
import { Link } from 'react-router-dom';
import "../styles/collection.css";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

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

function Collection() {
  const [loading, setLoading] = useState(true);
  const [selectedMovieForModal, setSelectedMovieForModal] = useState<Movie | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Series" | "Movies" | "Documentaries" | "Others" | "All">("Series");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [collection, setCollection] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('Store').select('*');
      if (!error && data) {
        setCollection(data.map((movie: any) => ({
          ...movie,
          hot: movie.ratings?.overall >= 9 ? 'true' : 'false'
        })));
      }
      setLoading(false);
    };
    fetchMovies();
  }, []);

  const featuredSeries = collection.find(movie => movie.category === "Series" && movie.hot === "true") ||
                        collection.find(movie => movie.category === "Series") || collection[0];

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

          {/* Category Navigation */}
          <nav className="category-nav">
            {["Series", "Movies", "Documentaries", "All"].map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''} ${category.toLowerCase()}`}
                onClick={() => {
                  setSelectedCategory(category as "Series" | "Movies" | "Documentaries" | "Others" | "All");
                  if (category !== "Series") setSelectedGenre(null);
                }}
                aria-current={selectedCategory === category ? "true" : "false"}
              >
                {category}
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
                All Series
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
            <h2>{selectedCategory === "All" ? "Recommended" : selectedCategory === "Series" && selectedGenre ? `${selectedGenre} Series` : selectedCategory}</h2>
            {filteredMovies.length <= 2 ? (
              <div className="movie-grid">
                {filteredMovies.map((movie, index) => (
                  <div key={index} className={`movie-slide ${movie.category.toLowerCase()}`}>
                    <img
                      src={movie.src}
                      alt={movie.title}
                      onClick={() => {
                        setSelectedMovieForModal(movie);
                      }}
                    />
                    <div className="movie-info">
                      <span className={`category-badge ${movie.category.toLowerCase()}`}>{movie.genre}</span>
                      <p className="movie-title">{movie.title}</p>
                      <p className="movie-ratings">Overall: {movie.ratings.overall}/10</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Slider {...sliderSettings}>
                {filteredMovies.map((movie, index) => (
                  <div key={index} className={`movie-slide ${movie.category.toLowerCase()}`}>
                    <img
                      src={movie.src}
                      alt={movie.title}
                      onClick={() => {
                        setSelectedMovieForModal(movie);
                      }}
                    />
                    <div className="movie-info">
                      <span className={`category-badge ${movie.category.toLowerCase()}`}>{movie.genre}</span>
                      <p className="movie-title">{movie.title}</p>
                      <p className="movie-ratings">Overall: {movie.ratings.overall}/10</p>
                    </div>
                  </div>
                ))}
              </Slider>
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