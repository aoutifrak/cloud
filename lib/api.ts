import axios from 'axios';
import config from './config';

const { baseUrl, apiKey } = config.tmdb;

// Create axios instance with default config
const api = axios.create({
  baseURL: baseUrl,
  timeout: 30000, // 30 seconds timeout
  params: {
    api_key: apiKey,
    language: "en-US"
  }
});

// API endpoints
export async function getMovies(page = 1) {
  const { data } = await api.get('/movie/popular', { params: { page } });
  return data;
}

export async function getMovie(id: string) {
  const { data } = await api.get(`/movie/${id}`);
  return data;
}


export async function searchMovies(query: string) {
  try {
    const { data } = await api.get(`/search/multi`, {
      params: { query },
    });
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Failed to fetch movies");
  }
}

export async function getMoviesByGenre(genreId: string, page = 1) {
  const { data } = await api.get('/discover/movie', {
    params: { with_genres: genreId, page }
  });
  return data;
}

export async function getTopRatedMovies(page = 1) {
  const { data } = await api.get('/movie/top_rated', { params: { page } });
  return {
    results: data.results || [],
    total_pages: data.total_pages || 1,
    total_results: data.total_results || 0,
    page: data.page || 1
  };
}

export async function getTopRatedTVShows(page = 1) {
  const { data } = await api.get('/tv/top_rated', { params: { page } });
  return {
    results: data.results || [],
    total_pages: data.total_pages || 1,
    total_results: data.total_results || 0,
    page: data.page || 1
  };
}

export async function getTVShowDetails(id: string) {
  const { data } = await api.get(`/tv/${id}`, {
    params: { append_to_response: 'credits, videos, similar' }
  });
  return data;
}

export async function fetchTrending(mediaType: 'all' | 'movie' | 'tv', timeWindow: 'day' | 'week') {
  const { data } = await api.get(`/trending/${mediaType}/${timeWindow}`);
  return data;
}

export async function fetchPopular(mediaType: 'movie' | 'tv', page = 1) {
  const { data } = await api.get(`/${mediaType}/popular`, { params: { page } });
  return {
    results: data.results || [],
    total_pages: data.total_pages || 1,
    total_results: data.total_results || 0,
    page: data.page || 1
  };
}

export async function fetchTopRated(mediaType: 'movie' | 'tv', page = 1) {
  const { data } = await api.get(`/${mediaType}/top_rated`, { params: { page } });
  return {
    results: data.results || [],
    total_pages: data.total_pages || 1,
    total_results: data.total_results || 0,
    page: data.page || 1
  };
}

export async function fetchGenres() {
  const { data } = await api.get('/genre/movie/list');
  return data.genres || [];
}

export async function fetchMovieDetails(id: string) {
  const { data } = await api.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,similar' }
  });
  return data;
}

export async function fetchMoviesByGenre(genreId: number, page = 1) {
  const { data } = await api.get('/discover/movie', {
    params: {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    }
  });
  return data;
}

export async function fetchVideoSources(params: {
  mediaType: 'movie' | 'tv';
  tmdbId: string;
  season?: number;
  episode?: number;
  provider?: string;
}) {
  const { mediaType, tmdbId, season, episode, provider } = params;
  
  // Construct the API URL based on media type and parameters
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ''); // Remove trailing slash
  if (!baseUrl) {
    throw new Error('API URL is not configured');
  }

  let path = '';
  if (mediaType === 'movie') {
    path = provider 
      ? `movie/${provider}/${tmdbId}`
      : `movie/${tmdbId}`;
  } else {
    path = provider
      ? `tv/${provider}/${tmdbId}?s=${season}&e=${episode}`
      : `tv/${tmdbId}?s=${season}&e=${episode}`;
  }

  // Use proxied API endpoint in development
  const apiUrl = process.env.NODE_ENV === 'development'
    ? `/api/${path}`
    : `${baseUrl}/${path}`;


  try {
    const { data } = await axios.get(apiUrl);
    
    // Filter out providers with errors
    const validProviders = data.filter((p: any) => p.source && !p.ERROR);
    
    if (validProviders.length === 0) {
      throw new Error('No valid video sources available');
    }

    return validProviders.map((p: any) => p.source);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      throw new Error(`Failed to fetch video sources: ${errorMessage}`);
    }
    throw error;
  }
}