const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

console.log('TMDB API KEY:', TMDB_API_KEY);
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';


export async function searchTMDB(query) {
  const url = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('TMDB search failed');
  const data = await res.json();
  return data.results || [];
}

export async function getTrendingTMDB() {
  const url = `${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('TMDB trending failed');
  const data = await res.json();
  return data.results || [];
}

export function getPosterUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w200${path}` : '/placeholder.png';
} 