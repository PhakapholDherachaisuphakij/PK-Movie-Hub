# 🎬 PK Movie Hub

<p align="center">
  <img src="public/vite.svg" alt="PK Movie Hub Logo" width="80" height="80" />
</p>

<h3 align="center">PK Movie Hub</h3>
<p align="center">
  A premium, high-performance web application for curated movie and series collections. Built with a modern tech stack focused on blazing-fast performance, stunning aesthetics, and a dynamic user experience.
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
</p>

---

## ✨ Features

### 🌟 Premium User Experience
- **Dynamic Animated Grid**: An immersive landing page featuring a smooth, physics-based grid powered by **GSAP** animations.
- **Calculated % Match Score**: Real-time match scores computed directly from authentic database ratings (no mock placeholders).
- **Interactive Movie Modals**: Detailed modal views highlighting specific ratings (e.g., Excitement, Romance, Emotion) with sleek visual progress bars.
- **Smart Filtering & Transitions**: Custom-styled "Pill" category/genre filters with fluid animation transitions.
- **Optimized Carousel Slider**: Tailored slider settings with dynamic dot rendering, optimized for both small and large screens.

### 🛡️ Secure Admin Control
- **Full CRUD Operations**: Create, read, update, and delete entries directly from the admin dashboard.
- **Dynamic Image Upload**: Integrated Supabase Storage with automatic filename sanitization and instant form hydration.
- **Form State Recovery**: Auto-scroll and edit-mode form auto-population for a seamless content editing flow.

### ⚡ Technical Highlights
- **Tailwind CSS v4 & daisyUI v5**: Responsive layout styled with utility classes for maximum performance and consistent design tokens.
- **Automated Data Migration**: Custom TypeScript utilities to manage, back up, and seamlessly migrate database records and binary assets.

---

## 🛠️ Technology Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite 6 | Core application framework and module bundler |
| **Styling** | Tailwind CSS v4, daisyUI v5, Custom CSS | Modern utility classes and UI components |
| **Database** | Supabase (PostgreSQL) | Secure backend database and user management |
| **Storage** | Supabase Storage | File storage hosting for movie posters and avatars |
| **Animations** | GSAP (GreenSock) | Physics-based animations and landing page grid |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- A **Supabase** account with an active project

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

3. **Configure Environment Variables**
   Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and configure the following variables:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_ADMIN_USERNAME=your-admin-username
   VITE_ADMIN_PASSWORD=your-secure-admin-password
   ```

---

## 💾 Database & Asset Management

This project contains utility scripts under the `scripts/` directory to manage database seeds, backups, and asset migrations.

### 1. Seeding Data
If you are initializing a new database instance, populate the `Store` table with original movies:
```bash
npx tsx scripts/feed_data.ts
```

### 2. Assets Migration (Legacy to New Supabase)
To migrate all movie posters and user avatars from a legacy Supabase project to your new project storage:
```bash
npx tsx scripts/migrate_assets.ts
```
*Note: This script downloads binary assets from the legacy public storage and uploads them directly to the current Supabase `image` bucket, updating database rows automatically.*

---

## 💻 Development & Build

Run the local development server:
```bash
npm run dev
```

Build the application for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```text
├── scripts/              # Database seeding, backups, and migration utilities
│   ├── feed_data.ts      # Seeding script
│   └── migrate_assets.ts # Storage/DB assets migration script
├── src/
│   ├── components/       # Reusable React components (Modal, Navbar, Login, etc.)
│   ├── pages/            # View pages (Collection, TopTier, Homepage, etc.)
│   ├── styles/           # Styling files
│   ├── supabaseClient.ts # Supabase client initialization
│   └── main.tsx          # App entry point
├── public/               # Static assets
├── index.html            # HTML entry point
└── movies_backup.json    # Local movie database backup
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">
  Crafted with ❤️ by <b>Phakaphol Dherachaisuphakij</b>
</p>
