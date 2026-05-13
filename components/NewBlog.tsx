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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!image) {
      setError("Please upload an image");
      setLoading(false);
      return;
    }

    if (Object.values(ratings).some((r) => r < 0 || r > 10)) {
      setError("Ratings must be between 0 and 10");
      setLoading(false);
      return;
    }

    const imageUrl = await uploadImageToStorage(image);
    if (!imageUrl) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("movies").insert([
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
      setTitle("");
      setDescription("");
      setCategory("");
      setGenre("");
      setRatings({ excitement: 0, romance: 0, emotion: 0, overall: 0 });
      setImage(null);
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
            {loading ? "Saving..." : "Save Movie"}
          </button>
        </form>
      </div>
    </>
  );
};

export default NewBlog;