export interface MovieType {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genre_ids?: number[];
  posterUrl: string;
  backdropUrl: string;
  year: number;
  rating: number;
  duration: string;
  genres: string[];
  cast: string[];
  director: string;
}

export interface TVShowType {
  id: string;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  episode_run_time?: number[];
  genre_ids?: number[];
  posterUrl: string;
  backdropUrl: string;
  year: number;
  rating: number;
  duration: string;
  genres: string[];
  cast: string[];
  director: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovie {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
  genre_ids?: number[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: { id: number; name: string; job: string }[];
  };
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  similar?: {
    results: TMDBMovie[];
  };
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  genre_ids?: number[];
  seasons: {
    id: number;
    season_number: number;
    episode_count: number;
    name: string;
    overview: string;
    poster_path: string;
    episodes?: {
      id: number;
      episode_number: number;
      name: string;
      overview: string;
      still_path: string;
      vote_average: number;
      runtime: number;
    }[];
  }[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: { id: number; name: string; job: string }[];
  };
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  similar?: {
    results: TMDBTVShow[];
  };
}