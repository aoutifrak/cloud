// Environment variables configuration
const config = {
  tmdb: {
    apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY,
    baseUrl: 'https://api.themoviedb.org/3',
  },
  app: {
    name: 'Movie App',
    description: 'Discover and explore movies',
  },
} as const;

// Validate required environment variables

export default config; 