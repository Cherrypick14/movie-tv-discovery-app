# Contributing to Movie & TV Discovery App

Thank you for your interest in contributing to the Movie & TV Discovery App! 🎬

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))
- OMDB API key ([Get one here](https://www.omdbapi.com/apikey.aspx))

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/movie-tv-discovery-app.git
   cd movie-tv-discovery-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### 1. Choose an Issue

- Browse [open issues](https://github.com/Cherrypick14/movie-tv-discovery-app/issues)
- Look for issues labeled `good first issue` for beginners
- Comment on the issue to let others know you're working on it

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check

# Build to ensure no errors
npm run build
```

### 5. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add movie trailer integration"
git commit -m "fix: resolve search pagination issue"
git commit -m "docs: update API documentation"
```

### 6. Push and Create PR

```bash
git push origin your-branch-name
```

Then create a Pull Request using our [PR template](.github/PULL_REQUEST_TEMPLATE.md).

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` types unless absolutely necessary
- Use meaningful variable and function names

```typescript
// Good
interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

// Avoid
const data: any = response.data;
```

### React

- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization when needed
- Clean up effects properly

```typescript
// Good
const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, []);
  
  return <div>{/* Component JSX */}</div>;
};
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Create reusable component classes when needed
- Follow mobile-first responsive design
- Ensure dark mode compatibility

```css
/* Good - Utility classes */
<div className="flex items-center space-x-2 p-4 bg-white dark:bg-gray-800">

/* Good - Custom component class */
.movie-card {
  @apply relative overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105;
}
```

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all new functions and components
- Use React Testing Library for component tests
- Mock external dependencies

```typescript
import { render, screen } from '@testing-library/react';
import { MovieCard } from './MovieCard';

test('renders movie title', () => {
  const mockMovie = { id: 1, title: 'Test Movie' };
  render(<MovieCard movie={mockMovie} />);
  expect(screen.getByText('Test Movie')).toBeInTheDocument();
});
```

### Integration Tests

- Test API service integrations
- Test component interactions
- Test error handling scenarios

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex logic
- Update README for new features

```typescript
/**
 * Formats a movie runtime from minutes to hours and minutes
 * @param minutes - Runtime in minutes
 * @returns Formatted string like "2h 30m"
 */
function formatRuntime(minutes: number): string {
  // Implementation
}
```

### API Documentation

- Document new API endpoints
- Include request/response examples
- Update type definitions

## 🐛 Bug Reports

When reporting bugs:

1. Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
2. Include steps to reproduce
3. Provide browser/environment details
4. Add screenshots if applicable

## ✨ Feature Requests

When requesting features:

1. Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
2. Explain the problem it solves
3. Provide mockups if possible
4. Consider implementation complexity

## 🔍 Code Review Process

### For Contributors

- Ensure your PR follows the template
- Respond to feedback promptly
- Make requested changes
- Keep PRs focused and small

### For Reviewers

- Be constructive and helpful
- Test the changes locally
- Check for:
  - Code quality and style
  - Performance implications
  - Security considerations
  - Test coverage
  - Documentation updates

## 🏷️ Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention is needed |
| `documentation` | Improvements or additions to docs |
| `duplicate` | This issue or PR already exists |
| `question` | Further information is requested |

## 📋 Release Process

1. Features are merged to `main` branch
2. Version is bumped following semantic versioning
3. Release notes are generated
4. Deployment to production

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## 📞 Getting Help

- Check existing [issues](https://github.com/Cherrypick14/movie-tv-discovery-app/issues)
- Start a [discussion](https://github.com/Cherrypick14/movie-tv-discovery-app/discussions)
- Ask questions in PR comments

## 🎉 Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Recognized in the community

Thank you for contributing to making this project better! 🚀
