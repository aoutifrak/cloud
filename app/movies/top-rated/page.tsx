import { Suspense } from "react";
import { Metadata } from "next";
import { fetchTopRated } from "@/lib/api";
import { convertTMDBArray } from "@/lib/data-utils";
import MovieCard from "@/components/movie-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Schema } from "@/components/schema";
import { MovieType } from "@/lib/types";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top Rated Movies | 123Movies",
  description: "Watch the highest rated movies online for free on 123Movies. Stream critically acclaimed films and award-winning masterpieces in HD quality with English subtitles.",
  openGraph: {
    title: "Top Rated Movies | 123Movies",
    description: "Watch the highest rated movies online for free on 123Movies. Stream critically acclaimed films and award-winning masterpieces in HD quality with English subtitles.",
    type: "website",
    locale: "en_US",
    url: "https://bflixto.org/movies/top-rated",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Rated Movies | 123Movies",
    description: "Watch the highest rated movies online for free on 123Movies. Stream critically acclaimed films and award-winning masterpieces in HD quality with English subtitles.",
  },
};

// Top rated movies component with loading state
const TopRatedMovies = async () => {
  const results = await fetchTopRated('movie');
  const movies = convertTMDBArray(results?.results || []);

  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">No top rated movies found</h2>
        <p className="text-muted-foreground">
          We couldn't find any top rated movies at the moment
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie: MovieType) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

// Loading skeleton
const TopRatedMoviesSkeleton = () => (
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

export default function TopRatedMoviesPage() {
  return (
    <>
      <Schema 
        type="Collection"
        title="Top Rated Movies | 123Movies"
        description="Watch the highest rated movies online for free on 123Movies. Stream critically acclaimed films and award-winning masterpieces in HD quality with English subtitles."
      />
      <div className="container py-24 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Top Rated Movies on 123Movies</h1>
          <p className="text-muted-foreground mb-4">
            Watch the highest rated movies in HD quality
          </p>

          {/* Introduction Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Critically Acclaimed Masterpieces</h2>
            <p className="text-base mb-4">
              Discover our collection of the highest rated movies that have received critical acclaim and audience praise. From award-winning dramas to groundbreaking films, explore the best of cinema that has stood the test of time. Our top-rated movies are carefully selected based on professional reviews and viewer ratings.
            </p>
            <p className="text-base mb-4">
              Whether you're looking for thought-provoking dramas, innovative storytelling, or cinematic masterpieces, our top-rated collection showcases the finest films ever made. All movies are available in HD quality with English subtitles for an immersive viewing experience.
            </p>
          </section>

          {/* Categories Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Top Rated Movies by Genre</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/genre/drama" className="text-blue-500 hover:underline">
                Top Rated Drama Movies
              </Link>
              <Link href="/genre/thriller" className="text-blue-500 hover:underline">
                Top Rated Thriller Movies
              </Link>
              <Link href="/genre/sci-fi" className="text-blue-500 hover:underline">
                Top Rated Sci-Fi Movies
              </Link>
              <Link href="/genre/action" className="text-blue-500 hover:underline">
                Top Rated Action Movies
              </Link>
              <Link href="/genre/comedy" className="text-blue-500 hover:underline">
                Top Rated Comedy Movies
              </Link>
              <Link href="/genre/documentary" className="text-blue-500 hover:underline">
                Top Rated Documentary Movies
              </Link>
            </div>
          </section>

          {/* Featured Content Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What Makes a Movie Top Rated?</h2>
            <p className="text-base mb-4">
              Our top-rated movies are selected based on a combination of factors including critical reviews, audience ratings, awards recognition, and cultural impact. Each film in this collection has been recognized for its exceptional quality, storytelling, and contribution to cinema.
            </p>
          </section>
        </div>

        <Suspense fallback={<TopRatedMoviesSkeleton />}>
          <TopRatedMovies />
        </Suspense>

        {/* Additional Information Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Experience Top Rated Movies on 123Movies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Premium Quality</h3>
              <p className="text-base">
                Watch all top-rated movies in stunning HD quality. We ensure the best possible viewing experience with high-quality video and audio.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Free Streaming</h3>
              <p className="text-base">
                Access our entire collection of top-rated movies completely free. No subscription fees or hidden charges.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Curated Selection</h3>
              <p className="text-base">
                Our top-rated movies are carefully curated to bring you the best of cinema from around the world.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 