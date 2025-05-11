'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTVShowDetails } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Star, Calendar, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Season {
  season_number: number;
  episode_count: number;
  name: string;
  overview: string;
  poster_path: string;
}

interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
  vote_average: number;
}

export default function TVShowDetailsPage() {
  const params = useParams();
  const [series, setSeries] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        setLoading(true);
        const data = await getTVShowDetails(params.id as string);
        setSeries(data);
        if (data.seasons && data.seasons.length > 0) {
          setSelectedSeason(data.seasons[0].season_number);
        }
      } catch (error) {
        console.error('Error loading series:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, [params.id]);

  useEffect(() => {
    const loadEpisodes = async () => {
      if (!series) return;
      try {
        const seasonData = await getTVShowDetails(params.id as string);
        setEpisodes(seasonData.episodes || []);
      } catch (error) {
        console.error('Error loading episodes:', error);
      }
    };

    loadEpisodes();
  }, [series, selectedSeason, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-full md:w-1/3 h-[500px]" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Series not found</h1>
            <p className="text-gray-500">The series you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
          alt={series.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {series.name}
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-2xl line-clamp-3">
              {series.overview}
            </p>
            <div className="flex items-center gap-4">
              <Link href={`/tv-show/${series.id}/watch`}>
                <Button size="lg" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Now
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-lg">
                  <Star className="w-4 h-4 mr-1" />
                  {series.vote_average.toFixed(1)}
                </Badge>
                <Badge variant="secondary" className="text-lg">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(series.first_air_date).getFullYear()}
                </Badge>
                <Badge variant="secondary" className="text-lg">
                  <Clock className="w-4 h-4 mr-1" />
                  {series.episode_run_time?.[0]} min
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Series Poster */}
          <div className="w-full md:w-1/3">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Series Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">About</h2>
              <p className="text-gray-300">{series.overview}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {series.genres?.map((genre: any) => (
                  <Badge key={genre.id} variant="outline">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Seasons</h2>
              <Tabs defaultValue={selectedSeason.toString()}>
                <TabsList>
                  {series.seasons?.map((season: Season) => (
                    <TabsTrigger
                      key={season.season_number}
                      value={season.season_number.toString()}
                      onClick={() => setSelectedSeason(season.season_number)}
                    >
                      Season {season.season_number}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={selectedSeason.toString()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {episodes.map((episode) => (
                      <Card key={episode.episode_number}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Episode {episode.episode_number}: {episode.name}
                          </CardTitle>
                          <CardDescription>
                            {new Date(episode.air_date).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                            <Image
                              src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                              alt={episode.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-300 line-clamp-3">{episode.overview}</p>
                          <div className="mt-4">
                            <Link href={`/tv-show/${series.id}/watch?s=${selectedSeason}&e=${episode.episode_number}`}>
                              <Button variant="outline" className="w-full">
                                Watch Episode
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 