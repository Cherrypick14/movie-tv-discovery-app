// Base interfaces for movies and TV shows
export interface BaseMedia {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title?: string;
  original_name?: string;
}

// Movie specific interface
export interface Movie extends BaseMedia {
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
}

// TV Show specific interface
export interface TVShow extends BaseMedia {
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

// Detailed movie interface for individual movie pages
export interface MovieDetails extends Movie {
  belongs_to_collection: Collection | null;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  credits?: Credits;
  videos?: VideoResponse;
  similar?: TMDBResponse<Movie>;
  recommendations?: TMDBResponse<Movie>;
}

// Detailed TV show interface
export interface TVShowDetails extends TVShow {
  created_by: Creator[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  credits?: Credits;
  videos?: VideoResponse;
  similar?: TMDBResponse<TVShow>;
  recommendations?: TMDBResponse<TVShow>;
}

// Supporting interfaces
export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface Network {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

export interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

// Credits interfaces
export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface CrewMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

// Video interfaces
export interface VideoResponse {
  results: Video[];
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

// Union type for media items
export type MediaItem = Movie | TVShow;
export type MediaDetails = MovieDetails | TVShowDetails;

// Type guards
export const isMovie = (media: MediaItem): media is Movie => {
  return 'title' in media && 'release_date' in media;
};

export const isTVShow = (media: MediaItem): media is TVShow => {
  return 'name' in media && 'first_air_date' in media;
};

export const isMovieDetails = (media: MediaDetails): media is MovieDetails => {
  return 'title' in media && 'release_date' in media;
};

export const isTVShowDetails = (media: MediaDetails): media is TVShowDetails => {
  return 'name' in media && 'first_air_date' in media;
};
