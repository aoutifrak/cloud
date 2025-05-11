import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play, Star, Clock, Calendar, User, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import MovieSlider from "@/components/movie-slider";
import { fetchMovieDetails } from "@/lib/api";
import { convertTMDBArray } from "@/lib/data-utils";
import { TMDBMovie } from "@/lib/types";
import WatchlistButton from '@/components/watchlist-button';
import { WatchlistItem } from '@/lib/watchlist';

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movieData = await fetchMovieDetails(params.id);
  
  if (!movieData || movieData.success === false) {
    notFound();
  }
  
  const movie = movieData as TMDBMovie;
  const similar = convertTMDBArray(movie.similar?.results || []);
  
  // Get director from crew
  const director = movie.credits?.crew?.find(
    person => person.job === "Director"
  );
  
  // Get top cast members
  const topCast = movie.credits?.cast?.slice(0, 5) || [];
  
  return (
    <div className="pt-16">
      {/* Backdrop */}
      <div className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent z-10" />
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        
        {/* Back button */}
        <div className="absolute top-6 left-6 z-20">
          <Link href="/">
            <Button variant="ghost" size="icon" className="bg-background/20 backdrop-blur-sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Movie details */}
      <div className="container px-4 md:px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          <div className="hidden md:block">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-xl">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{movie.runtime} min</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              
              {director && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{director.name}</span>
                </div>
              )}
            </div>
            
            <p className="text-lg mb-8">{movie.overview}</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Link href={`/movie/${movie.id}/watch`}>
                <Button size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Watch Now
                </Button>
              </Link>
              
              <div>
                <WatchlistButton 
                  movie={{
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    runtime: movie.runtime,
                    genre_ids: movie.genre_ids,
                    posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
                    backdropUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '',
                    year: new Date(movie.release_date).getFullYear(),
                    rating: movie.vote_average,
                    duration: `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`,
                    genres: movie.genres?.map(g => g.name) || [],
                    cast: movie.credits?.cast.slice(0, 5).map(c => c.name) || [],
                    director: movie.credits?.crew.find(c => c.job === 'Director')?.name || 'Unknown'
                  }}
                />
              </div>
            </div>
            
            <Separator className="my-8" />
            
            {/* Cast */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Top Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {topCast.map((person) => (
                  <div key={person.id} className="text-center">
                    <div className="relative w-full aspect-square overflow-hidden rounded-full mb-2">
                      <Image
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                            : 'https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                        }
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="font-medium text-sm">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar movies */}
        {similar.length > 0 && (
          <MovieSlider
            title="Similar Movies"
            subtitle="You might also like"
            movies={similar}
          />
        )}
      </div>
    </div>
  );
}