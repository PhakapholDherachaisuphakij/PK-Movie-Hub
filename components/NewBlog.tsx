import React, { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import Navbar from "./Navbar";
import "../styles/newblog.css";

// Initialize Supabase client
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const NewBlog: React.FC = () => {
  const categories = ["Series", "Movies", "Documentaries"] as const;
  const genres = ["Romance", "Drama", "Action", "Thriller", "Documentary", "Comedy"] as const;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [genre, setGenre] = useState("");
  const [ratings, setRatings] = useState({
    excitement: 0,
    romance: 0,
    emotion: 0,
    overall: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);

  const fetchMovies = async () => {
    const { data, error } = await supabase.from("Store").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setMovies(data);
    }
  };

  React.useEffect(() => {
    fetchMovies();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    const fileExtension = file.name.split('.').pop();
    const safeFileName = `${crypto.randomUUID()}.${fileExtension}`;

    const { error } = await supabase.storage
      .from("image")
      .upload(safeFileName, file);

    if (error) {
      console.error("Upload error", error);
      setError(`Failed to upload image: ${error.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("image")
      .getPublicUrl(safeFileName);

    return publicUrlData?.publicUrl ?? null;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setGenre("");
    setRatings({ excitement: 0, romance: 0, emotion: 0, overall: 0 });
    setImage(null);
    setIsEditing(false);
    setEditingMovieId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isEditing && !image) {
      setError("Please upload an image");
      setLoading(false);
      return;
    }

    if (Object.values(ratings).some((r) => r < 0 || r > 10)) {
      setError("Ratings must be between 0 and 10");
      setLoading(false);
      return;
    }

    let imageUrl = "";
    if (image) {
      const uploadedUrl = await uploadImageToStorage(image);
      if (!uploadedUrl) {
        setLoading(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    if (isEditing && editingMovieId) {
      const { error } = await supabase
        .from("Store")
        .update({
          title,
          description,
          category,
          genre,
          ratings: {
            excitement: ratings.excitement,
            romance: ratings.romance,
            emotion: ratings.emotion,
            overall: ratings.overall,
          },
          ...(imageUrl && { src: imageUrl }), 
        })
        .eq("id", editingMovieId);

      if (error) {
        console.error("Supabase update error", error);
        setError(`Failed to update movie: ${error.message}`);
      } else {
        alert("Movie updated successfully!");
        resetForm();
        fetchMovies();
      }
    } else {
      const { error } = await supabase.from("Store").insert([
        {
          id: crypto.randomUUID(),
          src: imageUrl,
          title,
          description,
          category,
          genre,
          ratings: {
            excitement: ratings.excitement,
            romance: ratings.romance,
            emotion: ratings.emotion,
            overall: ratings.overall,
          },
        },
      ]);

      if (error) {
        console.error("Supabase insert error", error);
        setError(`Failed to save movie: ${error.message}`);
      } else {
        alert("Movie saved successfully!");
        resetForm();
        fetchMovies();
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="dashboard-header">
            <div className="dashboard-pre-title">✍️ Curation Panel</div>
            <h1 className="dashboard-title">PK Editorial Board</h1>
            <p className="dashboard-subtitle">Create and manage your high-end cinematic curation lists</p>
          </div>

          {error && (
            <div className="bg-red-600 text-white p-4 rounded-xl mb-6 text-center font-semibold shadow-md">
              ⚠️ {error}
            </div>
          )}

          <div className="dashboard-upload-zone">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="dashboard-upload-preview"
              />
            ) : (
              <label className="dashboard-upload-label">
                <span className="dashboard-upload-icon">📷</span>
                <span>Click to upload cinematic cover poster</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <form onSubmit={handleSubmit} className="dashboard-form">
            <div className="dashboard-field">
              <label className="dashboard-label">Movie / Series Title</label>
              <input
                type="text"
                placeholder="ชื่อหนัง / Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="dashboard-input"
                required
              />
            </div>

            <div className="dashboard-field">
              <label className="dashboard-label">Review Details / Description</label>
              <textarea
                placeholder="รายละเอียด / Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="dashboard-textarea"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="dashboard-field">
                <label className="dashboard-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="dashboard-select"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dashboard-field">
                <label className="dashboard-label">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="dashboard-select"
                  required
                >
                  <option value="">Select Genre</option>
                  {genres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="dashboard-ratings-title">Cinematic Scores</div>
            <div className="dashboard-ratings-grid">
              {["excitement", "romance", "emotion", "overall"].map((field) => (
                <div key={field} className="dashboard-field">
                  <label className="dashboard-label capitalize">
                    {field === "excitement" ? "ความมัน" : field === "romance" ? "ความฟิน" : field === "emotion" ? "ความซึ้ง" : "Overall Rating"}
                  </label>
                  <input
                    type="number"
                    placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} (0-10)`}
                    value={(ratings as any)[field]}
                    onChange={(e) =>
                      setRatings((prev) => ({
                        ...prev,
                        [field]: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="dashboard-input"
                    min={0}
                    max={10}
                    step={0.1}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="dashboard-btn-group">
              <button
                type="submit"
                className="dashboard-btn primary"
                disabled={loading}
              >
                {loading ? "Processing..." : isEditing ? "Update Entry" : "Add to Collection"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="dashboard-btn secondary"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="dashboard-list-section">
            <h2 className="dashboard-list-title">Manage Curation Catalog ({movies.length})</h2>
            <div className="dashboard-list-grid">
              {movies.map((movie) => (
                <div key={movie.id} className="dashboard-movie-item">
                  <div className="dashboard-item-info">
                    <img src={movie.src} alt={movie.title} className="dashboard-item-thumbnail" />
                    <div>
                      <h3 className="dashboard-item-title">{movie.title}</h3>
                      <div className="dashboard-item-meta">
                        <span className="dashboard-item-badge">{movie.category}</span>
                        <span>•</span>
                        <span className="text-gray-400">{movie.genre}</span>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-item-actions">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditingMovieId(movie.id);
                        setTitle(movie.title);
                        setDescription(movie.description);
                        setCategory(movie.category);
                        setGenre(movie.genre);
                        setRatings(movie.ratings);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="dashboard-action-btn edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete ${movie.title}?`)) {
                          const { error } = await supabase.from("Store").delete().eq("id", movie.id);
                          if (error) {
                            alert(`Failed to delete: ${error.message}`);
                          } else {
                            alert("Deleted successfully!");
                            fetchMovies();
                          }
                        }
                      }}
                      className="dashboard-action-btn delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewBlog;