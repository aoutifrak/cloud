import { Suspense } from "react";
import { Metadata } from "next";
import { fetchPopular } from "@/lib/api";
import { convertTMDBArray } from "@/lib/data-utils";
import MovieCard from "@/components/movie-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Schema } from "@/components/schema";
import { MovieType } from "@/lib/types";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Popular Movies | 123Movies",
  description: "Watch the most popular movies online for free on 123Movies. Stream the latest trending and highly-rated films in HD quality with English subtitles.",
  openGraph: {
    title: "Popular Movies | 123Movies",
    description: "Watch the most popular movies online for free on 123Movies. Stream the latest trending and highly-rated films in HD quality with English subtitles.",
    type: "website",
    locale: "en_US",
    url: "https://bflixto.org/movies/popular",
  },
  twitter: {
    card: "summary_large_image",
    title: "Popular Movies | 123Movies",
    description: "Watch the most popular movies online for free on 123Movies. Stream the latest trending and highly-rated films in HD quality with English subtitles.",
  },
};

// Popular movies component with loading state
const PopularMovies = async () => {
  const results = await fetchPopular('movie');
  const movies = convertTMDBArray(results?.results || []);

  if (movies.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">No popular movies found</h2>
        <p className="text-muted-foreground">
          We couldn't find any popular movies at the moment
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
const PopularMoviesSkeleton = () => (
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

export default function PopularMoviesPage() {
  return (
    <>
      <Schema 
        type="Collection"
        title="Popular Movies | 123Movies"
        description="Watch the most popular movies online for free on 123Movies. Stream the latest trending and highly-rated films in HD quality with English subtitles."
      />
      <div className="container py-24 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Popular Movies on 123Movies</h1>
          <p className="text-muted-foreground mb-4">
            Watch the most popular movies in HD quality
          </p>

          {/* Introduction Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Most Popular Movies Right Now</h2>
            <p className="text-base mb-4">
              Explore our collection of the most popular movies that are currently trending worldwide. From blockbuster hits to critically acclaimed films, find the movies everyone's talking about. Our popular movies section is updated regularly to bring you the latest and most-watched content.
            </p>
            <p className="text-base mb-4">
              Whether you're in the mood for action, comedy, drama, or romance, our popular movies collection has something for every taste. All movies are available in HD quality with English subtitles for the best viewing experience.
            </p>
          </section>

          {/* Categories Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Browse Popular Movies by Genre</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/genre/action" className="text-blue-500 hover:underline">
                Popular Action Movies
              </Link>
              <Link href="/genre/comedy" className="text-blue-500 hover:underline">
                Popular Comedy Movies
              </Link>
              <Link href="/genre/drama" className="text-blue-500 hover:underline">
                Popular Drama Movies
              </Link>
              <Link href="/genre/romance" className="text-blue-500 hover:underline">
                Popular Romance Movies
              </Link>
              <Link href="/genre/thriller" className="text-blue-500 hover:underline">
                Popular Thriller Movies
              </Link>
              <Link href="/genre/sci-fi" className="text-blue-500 hover:underline">
                Popular Sci-Fi Movies
              </Link>
            </div>
          </section>

          {/* Featured Content Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What Makes a Movie Popular?</h2>
            <p className="text-base mb-4">
              Our popular movies are selected based on various factors including viewer ratings, box office success, social media buzz, and current trends. Each movie in this collection has captured the attention of audiences worldwide and continues to be a favorite among movie enthusiasts.
            </p>
          </section>
        </div>

        <Suspense fallback={<PopularMoviesSkeleton />}>
          <PopularMovies />
        </Suspense>

        {/* Additional Information Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Stream Popular Movies on 123Movies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2">HD Streaming</h3>
              <p className="text-base">
                Watch all popular movies in crystal clear HD quality. We ensure the best streaming experience with high-quality video and audio.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Free Access</h3>
              <p className="text-base">
                Enjoy unlimited access to our popular movies collection completely free. No subscription or payment required.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Regular Updates</h3>
              <p className="text-base">
                Our popular movies section is updated daily to keep you informed about the latest trending films.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 