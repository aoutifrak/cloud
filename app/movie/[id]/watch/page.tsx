import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Info, Download, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchMovieDetails } from "@/lib/api";
import { notFound } from "next/navigation";
import { TMDBMovie } from "@/lib/types";
import VideoPlayer from "@/components/video-player";

export default async function WatchPage({ params }: { params: { id: string } }) {
  const movieData = await fetchMovieDetails(params.id);
  
  if (!movieData || movieData.success === false) {
    notFound();
  }
  
  const movie = movieData as TMDBMovie;
  
  return (
    <div className="pt-16 h-screen flex flex-col">
      {/* Video player area */}
      <div className="relative flex-grow min-h-[70vh] bg-black">
        <VideoPlayer
          mediaType="movie"
          tmdbId={movie.id.toString()}
        />
        
        {/* Overlay controls - shown initially and on hover */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="container flex items-center justify-between">
            <Link href={`/movie/${movie.id}`}>
              <Button variant="ghost" size="sm" className="text-white gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Details
              </Button>
            </Link>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-white">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video info section */}
      <div className="bg-card border-t">
        <div className="container py-4 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
            {/* Poster */}
            <div className="hidden md:block">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md">
                <Image
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Info */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>•</span>
                <span>{movie.runtime} min</span>
                <span>•</span>
                <span>HD</span>
              </div>
              
              <p className="text-muted-foreground text-sm">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}