# 🎬 Movie & TV Discovery App

A comprehensive entertainment discovery platform built with React, TypeScript, and modern web technologies. Search for movies and TV shows, view detailed information, manage personal watchlists, and discover trending content.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Features

### 🔍 Search & Discovery
- **Real-time Search**: Search for movies and TV shows with debounced input
- **Trending Content**: Discover what's popular today or this week
- **Genre Filtering**: Browse content by specific genres
- **Advanced Filters**: Filter by year, rating, runtime, and more
- **Multi-source Data**: Combines TMDB and OMDB APIs for comprehensive information

### 📱 User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Infinite Scroll**: Seamless content loading with pagination
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: Graceful error handling with user-friendly messages

### 📚 Watchlist Management
- **Personal Watchlist**: Add/remove titles to your personal collection
- **Watch Status**: Mark items as watched with timestamps
- **Priority Levels**: Organize with low, medium, high priority
- **Local Storage**: Persistent data across browser sessions
- **Export Options**: Export watchlist as PDF or CSV (planned)

### 🎯 Content Details
- **Rich Information**: Plot, cast, ratings, release dates, and posters
- **Multiple Ratings**: IMDB, Rotten Tomatoes, and TMDB ratings
- **Trailers**: YouTube trailer integration (planned)
- **Similar Content**: Discover related movies and shows
- **Cast & Crew**: Detailed information about people involved

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))
- OMDB API key ([Get one here](https://www.omdbapi.com/apikey.aspx))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Cherrypick14/movie-tv-discovery-app.git
   cd movie-tv-discovery-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_OMDB_API_KEY=your_omdb_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── search/         # Search-related components
│   ├── movie/          # Movie/TV show components
│   ├── layout/         # Layout components
│   └── watchlist/      # Watchlist components
├── services/           # API services and utilities
│   ├── api.ts          # Base API client
│   ├── tmdb.ts         # TMDB API service
│   ├── omdb.ts         # OMDB API service
│   ├── cache.ts        # Caching system
│   └── config.ts       # Configuration
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── contexts/           # React contexts
└── assets/             # Static assets
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_TMDB_API_KEY` | The Movie Database API key | ✅ |
| `VITE_OMDB_API_KEY` | Open Movie Database API key | ✅ |
| `VITE_TMDB_BASE_URL` | TMDB API base URL | ❌ |
| `VITE_OMDB_BASE_URL` | OMDB API base URL | ❌ |
| `VITE_API_CACHE_DURATION` | Cache duration in milliseconds | ❌ |

### API Rate Limits

- **TMDB**: 40 requests per 10 seconds
- **OMDB**: 1000 requests per day

The app includes built-in rate limiting and caching to optimize API usage.

## 🧪 Testing

The project uses Jest and React Testing Library for testing.

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure
```
src/
├── __tests__/          # Test files
├── components/
│   └── __tests__/      # Component tests
└── services/
    └── __tests__/      # Service tests
```

## 🎨 Styling

The project uses Tailwind CSS for styling with a custom design system:

- **Colors**: Primary, secondary, accent colors with dark mode support
- **Typography**: Inter font family with responsive sizing
- **Components**: Reusable component classes
- **Animations**: Smooth transitions and loading states

### Custom CSS Classes

```css
.btn-primary          # Primary button style
.card                 # Card component style
.movie-card           # Movie card with hover effects
.grid-responsive      # Responsive grid layout
.text-gradient        # Gradient text effect
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm run test`
6. Run linting: `npm run lint`
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add JSDoc comments for functions
- Write tests for new features
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie and TV data
- [OMDb API](https://www.omdbapi.com/) for additional ratings and information
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/Cherrypick14/movie-tv-discovery-app/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible including:
   - Browser and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Console errors (if any)

---

**Built with ❤️ by [Cherrypick14](https://github.com/Cherrypick14)**
