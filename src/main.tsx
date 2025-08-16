import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Check for required environment variables
const requiredEnvVars = [
  'VITE_TMDB_API_KEY',
  'VITE_OMDB_API_KEY',
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !import.meta.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  
  // Show error message for missing environment variables
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Configuration Error
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Missing required environment variables. Please check your .env file.
        </p>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
            Missing variables:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
            {missingEnvVars.map((envVar) => (
              <li key={envVar}>{envVar}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Copy .env.example to .env and add your API keys.
        </p>
      </div>
    </div>
  );
} else {
  // Render the app normally
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
