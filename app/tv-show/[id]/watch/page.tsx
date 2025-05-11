import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Info, Download, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTVShowDetails } from "@/lib/api";
import { notFound } from "next/navigation";
import { TMDBTVShow } from "@/lib/types";
import SeasonEpisodeSelector from "@/components/season-episode-selector";
import VideoPlayer from "@/components/video-player";

export default async function WatchPage({ 
  params,
  searchParams 
}: { 
  params: { id: string };
  searchParams: { season?: string; episode?: string };
}) {
  const tvShowData = await getTVShowDetails(params.id);
  
  if (!tvShowData || tvShowData.success === false) {
    notFound();
  }
  
  const tvShow = tvShowData as TMDBTVShow;
  const currentSeason = Number(searchParams.season) || 1;
  const currentEpisode = Number(searchParams.episode) || 1;
  
  // Get the current season's data
  const seasonData = tvShow.seasons?.find(s => s.season_number === currentSeason);
  const episodeData = seasonData?.episodes?.find(e => e.episode_number === currentEpisode);
  
  return (
    <div className="pt-16 h-screen flex flex-col">
      {/* Video player area */}
      <div className="relative flex-grow min-h-[70vh] bg-black">
        <VideoPlayer
          mediaType="tv"
          tmdbId={tvShow.id.toString()}
          season={currentSeason}
          episode={currentEpisode}
        />
        
        {/* Overlay controls - shown initially and on hover */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="container flex items-center justify-between">
            <Link href={`/tv-show/${tvShow.id}`}>
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
                  src={`https://image.tmdb.org/t/p/w342${tvShow.poster_path}`}
                  alt={tvShow.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Info */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-2">{tvShow.name}</h1>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
                <span>•</span>
                <span>{tvShow.number_of_seasons} Seasons</span>
                <span>•</span>
                <span>HD</span>
              </div>
              
              {/* Season and Episode Selection */}
              <SeasonEpisodeSelector
                tvShowId={tvShow.id}
                currentSeason={currentSeason}
                currentEpisode={currentEpisode}
                totalSeasons={tvShow.number_of_seasons}
                episodeCount={seasonData?.episode_count || 0}
              />
              
              {/* Episode Info */}
              {episodeData && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">
                    {episodeData.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {episodeData.overview}
                  </p>
                </div>
              )}
              
              <div className="flex gap-3">
                <Link href={`/tv-show/${tvShow.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Info className="h-3.5 w-3.5" />
                    More Info
                  </Button>
                </Link>
                
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 