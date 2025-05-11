'use client';

import { useEffect, useState } from 'react';
import { fetchTrending, fetchPopular, fetchTopRated } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Star, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
}

export default function TVShowPage() {
  const [trending, setTrending] = useState<TVShow[]>([]);
  const [popular, setPopular] = useState<TVShow[]>([]);
  const [topRated, setTopRated] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTVShows = async () => {
      try {
        setLoading(true);
        const [trendingData, popularData, topRatedData] = await Promise.all([
          fetchTrending('tv', 'day'),
          fetchPopular('tv'),
          fetchTopRated('tv')
        ]);

        setTrending(trendingData.results);
        setPopular(popularData.results);
        setTopRated(topRatedData.results);
      } catch (error) {
        console.error('Error loading TV shows:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTVShows();
  }, []);

  const renderTVShowCard = (show: TVShow) => (
    <Card key={show.id} className="group relative overflow-hidden">
      <div className="relative aspect-[2/3]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          alt={show.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Link href={`/series/${show.id}`}>
              <Button className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Watch Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1">{show.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Badge variant="secondary">
            <Star className="w-3 h-3 mr-1" />
            {show.vote_average.toFixed(1)}
          </Badge>
          <Badge variant="secondary">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(show.first_air_date).getFullYear()}
          </Badge>
        </CardDescription>
      </CardHeader>
    </Card>
  );

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[2/3] w-full" />
          <CardHeader className="p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>
              {renderSkeleton()}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Popular TV Shows</h2>
              {renderSkeleton()}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Top Rated TV Shows</h2>
              {renderSkeleton()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const featuredShow = trending[0];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      {featuredShow && (
        <div className="relative h-[70vh] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${featuredShow.backdrop_path}`}
            alt={featuredShow.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {featuredShow.name}
              </h1>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl line-clamp-3">
                {featuredShow.overview}
              </p>
              <div className="flex items-center gap-4">
                <Link href={`/series/${featuredShow.id}`}>
                  <Button size="lg" className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Watch Now
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-lg">
                    <Star className="w-4 h-4 mr-1" />
                    {featuredShow.vote_average.toFixed(1)}
                  </Badge>
                  <Badge variant="secondary" className="text-lg">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(featuredShow.first_air_date).getFullYear()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {trending.slice(1).map(renderTVShowCard)}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Popular TV Shows</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {popular.map(renderTVShowCard)}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Top Rated TV Shows</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {topRated.map(renderTVShowCard)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 