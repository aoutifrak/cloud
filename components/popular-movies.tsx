'use client';

import { useEffect, useState } from "react";
import { fetchPopular } from "@/lib/api";
import { convertTMDBArray } from "@/lib/data-utils";
import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PopularMoviesProps {
  page: string;
  onPageChange: (page: number) => void;
}

export default function PopularMovies({ page, onPageChange }: PopularMoviesProps) {
  const [movies, setMovies] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const currentPage = Number(page) || 1;

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchPopular('movie', currentPage);
        setMovies(convertTMDBArray(data?.results || []));
        setTotalPages(data?.total_pages || 1);
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [currentPage]);

  if (loading) {
    return (
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
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 pt-8">
        {currentPage > 1 && (
          <Button 
            variant="outline" 
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
        )}
        <span className="px-4 py-2">
          Page {currentPage} of {Math.min(totalPages, 500)}
        </span>
        {currentPage < Math.min(totalPages, 500) && (
          <Button 
            variant="outline" 
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
} 