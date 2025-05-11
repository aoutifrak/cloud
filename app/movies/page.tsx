import { Suspense } from "react";
import { fetchPopular, fetchTopRated, fetchGenres } from "@/lib/api";
import { convertTMDBArray } from "@/lib/data-utils";
import MovieCard from "@/components/movie-card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MoviesTabs from "@/components/movies-tabs";

// Movies grid component with loading state
const MoviesGrid = ({ movies }: { movies: any[] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

// Loading skeleton
const MoviesGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
    {Array(15).fill(0).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

// Movie categories from the top genres
const MovieCategories = async () => {
  const genres = await fetchGenres();
  const topGenres = genres.slice(0, 12);

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {topGenres.map((genre: { id: number; name: string }) => (
        <Link key={genre.id} href={`/genre/${genre.name.toLowerCase()}`}>
          <div className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            "border border-border hover:bg-primary hover:text-primary-foreground"
          )}>
            {genre.name}
          </div>
        </Link>
      ))}
    </div>
  );
};

// Pagination component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  baseUrl,
  tab 
}: { 
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  tab: string;
}) => {
  return (
    <div className="flex justify-center items-center gap-2 pt-8">
      {currentPage > 1 && (
        <Link href={`${baseUrl}?page=${currentPage - 1}&tab=${tab}`}>
          <Button variant="outline">Previous</Button>
        </Link>
      )}
      <span className="px-4 py-2">
        Page {currentPage} of {Math.min(totalPages, 500)}
      </span>
      {currentPage < Math.min(totalPages, 500) && (
        <Link href={`${baseUrl}?page=${currentPage + 1}&tab=${tab}`}>
          <Button variant="outline">Next</Button>
        </Link>
      )}
    </div>
  );
};

// Popular movies tab content
const PopularMovies = async ({ 
  searchParams 
}: { 
  searchParams: { page?: string; tab?: string } 
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const data = await fetchPopular('movie', currentPage);
  const movies = convertTMDBArray(data?.results || []);
  const totalPages = data?.total_pages || 1;
  
  return (
    <div className="space-y-6">
      <MoviesGrid movies={movies} />
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        baseUrl="/movies"
        tab="popular"
      />
    </div>
  );
};

// Top rated movies tab content
const TopRatedMovies = async ({ 
  searchParams 
}: { 
  searchParams: { page?: string; tab?: string } 
}) => {
  const currentPage = Number(searchParams.page) || 1;
  const data = await fetchTopRated('movie', currentPage);
  const movies = convertTMDBArray(data?.results || []);
  const totalPages = data?.total_pages || 1;
  
  return (
    <div className="space-y-6">
      <MoviesGrid movies={movies} />
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        baseUrl="/movies"
        tab="top-rated"
      />
    </div>
  );
};

export default function MoviesPage() {
  return (
    <div className="container py-24 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Movies</h1>
        <p className="text-muted-foreground">
          Browse our collection of movies by category, popularity, or rating
        </p>
      </div>

      <Suspense fallback={<div className="h-8 mb-8"><Skeleton className="h-full w-3/4" /></div>}>
        <MovieCategories />
      </Suspense>

      <MoviesTabs />
    </div>
  );
}