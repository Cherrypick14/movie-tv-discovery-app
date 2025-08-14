# 🎬 Movie/TV Show Discovery Web App

Discover, search, and track movies & TV shows with a clean, responsive UI powered by TMDB and OMDB.

![Status](https://img.shields.io/badge/status-in_progress-yellow) ![License](https://img.shields.io/badge/license-MIT-blue) ![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)

---

## ✨ Overview

A comprehensive entertainment discovery platform where users can:

- Search for movies and TV shows with real-time results
- View rich details (plot, cast, ratings, release date, posters)
- Manage a personal watchlist (add/remove/mark watched)
- Explore trending content and browse by genre
- See user ratings aggregated from IMDB, Rotten Tomatoes, and TMDB
- Get smart recommendations based on watchlist preferences

---

## 🧰 Tech Stack

- **Frontend:** React + Vite (or Next.js) · TypeScript (optional) · Tailwind CSS
- **State & Data:** React Query (or SWR) · Context API for watchlist/preferences
- **APIs:** TMDB (primary data/images/trending) · OMDB (extra ratings/plots)
- **Build & Quality:** ESLint · Prettier · Jest/RTL (optional)

---

## 🔑 Environment Variables

Create a `.env` file from the example below:

```bash
VITE_TMDB_API_KEY=your_tmdb_key_here
VITE_OMDB_API_KEY=your_omdb_key_here
