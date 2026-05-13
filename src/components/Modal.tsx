import React from "react";
import "../styles/modal.css";

interface ModalProps {
  movie: {
    title: string;
    description: string;
    src: string;
    category: string;
    genre: string;
    ratings: {
      excitement: number;
      romance: number;
      emotion: number;
      overall: number;
    };
  };
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ movie, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const matchScore = (movie.ratings.overall * 10).toFixed(0);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
              fill="white"
            />
          </svg>
        </button>
        <div className="modal-image">
          <img src={movie.src} alt={movie.title} />
          <div className="image-gradient"></div>
          <div className="play-button-overlay">
            <button className="play-button">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5V19L19 12L8 5Z" fill="white" />
              </svg>
              <span>Play</span>
            </button>
          </div>
        </div>
        <div className="modal-details">
          <h3 className="modal-title">{movie.title}</h3>
          <div className="modal-meta">
            <span className="match-score">{matchScore}% Match</span>
            <span className="category-badge">{movie.category}</span>
            <span className="genre-badge">{movie.genre}</span>
          </div>
          <p className="modal-description">
            {movie.description}
          </p>
          
          <div className="modal-ratings">
            {[
              { label: "ความมัน", value: movie.ratings.excitement },
              { label: "ความฟิน", value: movie.ratings.romance },
              { label: "ความซึ้ง", value: movie.ratings.emotion },
              { label: "Overall", value: movie.ratings.overall },
            ].map((rating) => (
              <div key={rating.label} className="rating-item">
                <span className="rating-label">{rating.label}</span>
                <div className="rating-bar">
                  <div 
                    className="rating-fill" 
                    style={{ width: `${rating.value * 10}%` }} 
                  />
                </div>
                <span className="rating-value">{rating.value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
