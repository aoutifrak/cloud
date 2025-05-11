import { Suspense } from "react";
import { Metadata } from "next";
import { fetchTrending } from "@/lib/api";
import { convertTMDBArray } from "@/lib/data-utils";
import MovieCard from "@/components/movie-card";
import TVShowCard from "@/components/tv-show-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Schema } from "@/components/schema";
import { MovieType, TVShowType } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Watch Trending Movies & TV Shows Online | 123Movies",
  description: "Watch trending movies and TV shows online for free on 123Movies. Stay updated with the latest popular content across all genres in HD quality.",
  openGraph: {
    title: "Watch Trending Movies & TV Shows Online | 123Movies",
    description: "Watch trending movies and TV shows online for free on 123Movies. Stay updated with the latest popular content across all genres in HD quality.",
    type: "website",
    locale: "en_US",
    url: "https://bflixto.org/trending",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch Trending Movies & TV Shows Online | 123Movies",
    description: "Watch trending movies and TV shows online for free on 123Movies. Stay updated with the latest popular content across all genres in HD quality.",
  },
};

// Trending results component with loading state
const TrendingResults = async () => {
  const results = await fetchTrending('all', 'day');
  const items = convertTMDBArray(results?.results || []);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">No trending content found</h2>
        <p className="text-muted-foreground">
          We couldn't find any trending movies or TV shows
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {items.map((item: MovieType | TVShowType) => {
        if ('title' in item) {
          return (
            <MovieCard 
              key={item.id} 
              movie={item as MovieType}
            />
          );
        } else {
          return (
            <TVShowCard 
              key={item.id} 
              tvShow={item as TVShowType}
            />
          );
        }
      })}
    </div>
  );
};

// Loading skeleton
const TrendingResultsSkeleton = () => (
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

export default function TrendingPage() {
  return (
    <>
      <Schema 
        type="Collection"
        title="Watch Trending Movies & TV Shows Online | 123Movies"
        description="Watch trending movies and TV shows online for free on 123Movies. Stay updated with the latest popular content across all genres in HD quality."
      />
      <div className="container py-24 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Watch Trending Movies & Shows</h1>
          <p className="text-muted-foreground mb-4">
            Watch the latest trending movies and TV shows in HD quality
          </p>
          
          {/* Hero Section with Image */}
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src="/images/trending-hero.jpg"
              alt="Watch trending movies and TV shows online in HD quality"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">Trending Entertainment</h2>
                <p className="text-xl">Watch the most popular content right now</p>
              </div>
            </div>
          </div>

          {/* Introduction Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Watch Trending Content Today</h2>
            <p className="text-base mb-4">
              Discover the most popular movies and TV shows that everyone's talking about. Our trending section is updated daily to bring you the latest and most-watched content. From blockbuster movies to binge-worthy TV series, find what's hot right now.
            </p>
            <p className="text-base mb-4">
              Whether you're looking for action-packed adventures, heartwarming dramas, or thrilling mysteries, our trending collection has something for everyone. All content is available in HD quality with English subtitles.
            </p>
          </section>

          {/* Categories Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Browse Trending Content by Category</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/movies/popular" className="text-blue-500 hover:underline">
                Watch Popular Movies
              </Link>
              <Link href="/movies/top-rated" className="text-blue-500 hover:underline">
                Watch Top Rated Movies
              </Link>
              <Link href="/tv-shows" className="text-blue-500 hover:underline">
                Watch TV Shows
              </Link>
              <Link href="/genre/action" className="text-blue-500 hover:underline">
                Watch Action Movies
              </Link>
              <Link href="/genre/comedy" className="text-blue-500 hover:underline">
                Watch Comedy Movies
              </Link>
              <Link href="/genre/drama" className="text-blue-500 hover:underline">
                Watch Drama Movies
              </Link>
            </div>
          </section>

          {/* Featured Content Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Watch Featured Trending Content</h2>
            <p className="text-base mb-4">
              Our trending section features a carefully curated selection of the most popular movies and TV shows. Each title is handpicked based on viewer ratings, social media buzz, and current popularity. Watch trending content that everyone's talking about.
            </p>
          </section>
        </div>

        <Suspense fallback={<TrendingResultsSkeleton />}>
          <TrendingResults />
        </Suspense>

        {/* Additional Information Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Watch Trending Content on 123Movies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2">HD Quality Streaming</h3>
              <p className="text-base">
                Watch all trending movies and TV shows in crystal clear HD quality. We ensure the best streaming experience for our users.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Free Streaming Access</h3>
              <p className="text-base">
                Watch trending content completely free. No hidden charges or subscription fees required.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Daily Content Updates</h3>
              <p className="text-base">
                Watch new trending content every day. Our collection is updated regularly to keep you informed about the latest popular movies and shows.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 