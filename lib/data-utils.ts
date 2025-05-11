import { 
  TMDBMovie, 
  TMDBTVShow, 
  MovieType,
  TMDBGenre
} from './types';
import { getTMDBImageUrl, formatRuntime, extractYear } from './utils';

// Map of genre IDs to names for quick lookups
const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Convert TMDB movie to our MovieType format
export const convertTMDBToMovie = (item: TMDBMovie | TMDBTVShow): MovieType => {
  // Determine if it's a movie or TV show
  const isMovie = 'title' in item;
  
  // Get title/name
  const title = isMovie ? (item as TMDBMovie).title : (item as TMDBTVShow).name;
  
  // Get year from release_date/first_air_date
  const dateString = isMovie 
    ? (item as TMDBMovie).release_date 
    : (item as TMDBTVShow).first_air_date;
  const year = extractYear(dateString) || 0;
  
  // Get runtime/duration
  let duration = 'N/A';
  if (isMovie && (item as TMDBMovie).runtime) {
    duration = formatRuntime((item as TMDBMovie).runtime);
  } else if (!isMovie && (item as TMDBTVShow).episode_run_time?.length) {
    duration = formatRuntime((item as TMDBTVShow).episode_run_time[0]);
  }
  
  // Get genres
  let genres: string[] = [];
  if (item.genres) {
    genres = item.genres.map(genre => genre.name);
  } else if (item.genre_ids) {
    genres = item.genre_ids.map(id => genreMap[id] || `Genre ${id}`);
  }
  
  // Get cast
  const cast: string[] = item.credits?.cast
    ? item.credits.cast.slice(0, 5).map(member => member.name)
    : [];
  
  // Get director (from crew with job === 'Director')
  let director = 'Unknown';
  if (item.credits?.crew) {
    const directorCrew = item.credits.crew.find(
      member => member.job === 'Director'
    );
    if (directorCrew) {
      director = directorCrew.name;
    }
  }
  
  return {
    id: String(item.id),
    title,
    overview: item.overview,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    release_date: isMovie ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date,
    vote_average: item.vote_average,
    runtime: isMovie ? (item as TMDBMovie).runtime : undefined,
    genre_ids: item.genre_ids,
    posterUrl: getTMDBImageUrl(item.poster_path, 'large', 'poster'),
    backdropUrl: getTMDBImageUrl(item.backdrop_path, 'large', 'backdrop'),
    rating: Math.round(item.vote_average * 10) / 10,
    year: Number(year),
    duration,
    genres,
    cast,
    director
  };
};

// Batch convert multiple TMDB items
export const convertTMDBArray = (items: (TMDBMovie | TMDBTVShow)[]): MovieType[] => {
  return items.map(convertTMDBToMovie);
};

// Get genre name from ID
export const getGenreName = (id: number): string => {
  return genreMap[id] || `Genre ${id}`;
};

// Map all genres to our format
export const mapGenres = (genres: TMDBGenre[]) => {
  return genres.map(genre => ({
    id: genre.id,
    name: genre.name
  }));
};