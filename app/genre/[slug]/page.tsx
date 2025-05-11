import { Suspense } from "react";
import { fetchMoviesByGenre, fetchGenres } from "@/lib/api";
import { convertTMDBArray } from "@/lib/data-utils";
import MovieCard from "@/components/movie-card";
import { Skeleton } from "@/components/ui/skeleton";
import { TMDBGenre } from "@/lib/types";

// Get genre ID from slug
const getGenreIdFromSlug = async (slug: string) => {
  const genres = await fetchGenres();
  const genre = genres.find((g: TMDBGenre) => g.name.toLowerCase() === slug);
  return genre?.id;
};

// Genre results component with loading state
const GenreResults = async ({ genreId }: { genreId: number }) => {
  const results = await fetchMoviesByGenre(genreId);
  const movies = convertTMDBArray(results?.results || []);

  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">No movies found</h2>
        <p className="text-muted-foreground">
          We couldn't find any movies in this genre
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

// Loading skeleton
const GenreResultsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
    {Array(10).fill(0).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

export default async function GenrePage({
  params,
}: {
  params: { slug: string };
}) {
  const genreId = await getGenreIdFromSlug(params.slug);
  const genreName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  if (!genreId) {
    return (
      <div className="container py-24 px-4 md:px-6">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-2">Genre not found</h2>
          <p className="text-muted-foreground">
            The genre you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-24 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{genreName} Movies</h1>
        <p className="text-muted-foreground">
          Browse our collection of {genreName.toLowerCase()} movies
        </p>
      </div>

      <Suspense fallback={<GenreResultsSkeleton />}>
        <GenreResults genreId={genreId} />
      </Suspense>
    </div>
  );
}