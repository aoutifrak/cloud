import MovieCard from "@/components/movie-card"
import { getTopRatedMovies } from "@/lib/api"
import { MovieType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Top IMDb Movies",
  description: "Browse the highest-rated movies on IMDb"
}

function transformMovieData(movie: any): MovieType {
  return {
    ...movie,
    posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined,
    rating: movie.vote_average,
    duration: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : undefined,
    genres: movie.genre_ids?.map((id: number) => id.toString()) || [],
    description: movie.overview
  };
}

export default async function TopIMDbPage({ 
  searchParams 
}: { 
  searchParams: { page?: string } 
}) {
  const currentPage = Number(searchParams.page) || 1;
  const response = await getTopRatedMovies(currentPage);
  const movies = (response.results || []).map(transformMovieData);
  const totalPages = response.total_pages || 1;
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Top IMDb Movies</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie: MovieType) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 pt-8">
        {currentPage > 1 && (
          <Link href={`/top-imdb?page=${currentPage - 1}`}>
            <Button variant="outline">Previous</Button>
          </Link>
        )}
        <span className="px-4 py-2">
          Page {currentPage} of {Math.min(totalPages, 500)}
        </span>
        {currentPage < Math.min(totalPages, 500) && (
          <Link href={`/top-imdb?page=${currentPage + 1}`}>
            <Button variant="outline">Next</Button>
          </Link>
        )}
      </div>
    </div>
  );
}