import React, { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import Navbar from "./Navbar";

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
          src: imageUrl, // Store full URL
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
        fetchMovies(); // Refresh list
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Create New Movie</h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <div className="w-full h-60 bg-gray-700 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <label className="text-gray-300 cursor-pointer">
              Click to upload image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="ชื่อหนัง / Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded bg-[#222] border border-red-600"
            required
          />
          <textarea
            placeholder="รายละเอียด / Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="p-3 rounded bg-[#222] border border-red-600"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded bg-[#222] border border-gray-600"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="p-3 rounded bg-[#222] border border-gray-600"
            required
          >
            <option value="">Select Genre</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-6 w-full">
            {["excitement", "romance", "emotion", "overall"].map((field) => (
              <div key={field} className="flex flex-col w-full">
                <label className="text-lg font-semibold capitalize mb-2">
                  {field}
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
                  className="w-full p-4 rounded-xl bg-[#222] border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  min={0}
                  max={10}
                  step={0.1}
                  required
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded mt-4"
            disabled={loading}
          >
            {loading ? "Processing..." : isEditing ? "Update Movie" : "Save Movie"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded mt-2 w-full"
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Manage Movies</h2>
          <div className="grid grid-cols-1 gap-4">
            {movies.map((movie) => (
              <div key={movie.id} className="bg-[#222] p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={movie.src} alt={movie.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-bold">{movie.title}</h3>
                    <p className="text-sm text-gray-400">{movie.category} | {movie.genre}</p>
                  </div>
                </div>
                <div className="flex gap-2">
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Edit
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
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewBlog;