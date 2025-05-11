// Types for watchlist items
export type WatchlistItem = {
  id: string;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
};

// Get all items from watchlist
export function getWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const movies = JSON.parse(localStorage.getItem('watchlistMovies') || '[]');
    const tvShows = JSON.parse(localStorage.getItem('watchlistTVShows') || '[]');
    return [...movies, ...tvShows];
  } catch (error) {
    console.error('Error loading watchlist:', error);
    return [];
  }
}

// Get movies from watchlist
export function getWatchlistMovies(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('watchlistMovies') || '[]');
  } catch (error) {
    console.error('Error loading watchlist movies:', error);
    return [];
  }
}

// Get TV shows from watchlist
export function getWatchlistTVShows(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('watchlistTVShows') || '[]');
  } catch (error) {
    console.error('Error loading watchlist TV shows:', error);
    return [];
  }
}

// Add item to watchlist
export function addToWatchlist(item: WatchlistItem): void {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = item.media_type === 'movie' ? 'watchlistMovies' : 'watchlistTVShows';
    const currentItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Check if item already exists
    if (!currentItems.some((existing: WatchlistItem) => existing.id === item.id)) {
      currentItems.push(item);
      localStorage.setItem(storageKey, JSON.stringify(currentItems));
    } else {
      console.log(`Item already in watchlist: ${item.title} (${item.media_type})`);
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
  }
}

// Remove item from watchlist
export function removeFromWatchlist(id: string, mediaType: 'movie' | 'tv'): void {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = mediaType === 'movie' ? 'watchlistMovies' : 'watchlistTVShows';
    const currentItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const updatedItems = currentItems.filter((item: WatchlistItem) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Error removing from watchlist:', error);
  }
}

// Check if item is in watchlist
export function isInWatchlist(id: string, mediaType: 'movie' | 'tv'): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const storageKey = mediaType === 'movie' ? 'watchlistMovies' : 'watchlistTVShows';
    const currentItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const isInList = currentItems.some((item: WatchlistItem) => item.id === id);
    return isInList;
  } catch (error) {
    console.error('Error checking watchlist status:', error);
    return false;
  }
} 