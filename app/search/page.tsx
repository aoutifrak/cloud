import { searchMovies } from '@/lib/api';
import { convertTMDBArray } from '@/lib/data-utils';
import MovieCard from '@/components/movie-card';
import { SearchResultsSkeleton } from '@/components/skeletons';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;
  
  if (!query) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <p className="text-muted-foreground">Enter a search term to find movies and TV shows.</p>
      </div>
    );
  }

  const searchResults = await searchMovies(query);
  const movies = convertTMDBArray(searchResults?.results || []);
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h1>
      
      {movies.length === 0 ? (
        <p className="text-muted-foreground">No results found for "{query}".</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}