# 🎬 PK Movie Hub

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)

A premium, high-performance web application for curated movie and series collections. Built with a modern tech stack focused on blazing-fast performance, stunning aesthetics, and a dynamic user experience.

---

## ✨ Features

### 🌟 Premium User Experience
- **Dynamic Animated Grid**: Immersive landing page featuring a smooth, physics-based image grid powered by **GSAP**.
- **Calculated % Match**: Real-time match score calculated from authentic database ratings (no mock data).
- **Interactive Modal**: Beautiful, detailed modal view for movies with visual rating bars (Excitement, Romance, Emotion).
- **Smart Filtering**: Custom-styled "Pill" chips for genre filtering with smooth transitions.
- **Optimized Carousel**: Custom-styled Slick sliders with limited dots for clean navigation even with massive lists.

### 🛡️ Advanced Admin Control
- **Full CRUD Operations**: Create, Read, Update, and Delete movies directly from the secure admin dashboard.
- **Dynamic Image Upload**: Integrated Supabase Storage for seamless image management.
- **Form State Hydration**: Click "Edit" to instantly populate the form and update existing records with auto-scroll.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Animations**: GSAP (GreenSock Animation Platform)
- **Database & Storage**: Supabase (PostgreSQL)
- **Styling**: Vanilla CSS (Optimized for performance and specific premium components)
- **Slider**: React Slick

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PhakapholDherachaisuphakij/PK-Movie-Hub.git
   cd PK-Movie-Hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file and fill in your Supabase credentials.
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in:
   ```env
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   VITE_ADMIN_USERNAME=your_secure_admin_username
   VITE_ADMIN_PASSWORD=your_secure_admin_password
   ```

4. **Seed the Database** (Optional)
   If you want to feed the initial backup data into your Supabase `Store` table:
   ```bash
   npx tsx scripts/feed_data.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
├── scripts/              # Database seeding and backup scripts
├── src/
│   ├── components/       # Reusable UI components (Modal, NewBlog, etc.)
│   ├── pages/            # Page components (Collection, TopTier, Login)
│   ├── styles/           # Dedicated CSS styles for each component
│   ├── supabaseClient.ts # Supabase initialization
│   └── main.tsx          # Application entry point
└── movies_backup.json    # Initial data backup
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Crafted with ❤️ by Phakaphol Dherachaisuphakij
</p>
