'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PopularMovies from "./popular-movies";
import TopRatedMovies from "./top-rated-movies";

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

export default function MoviesTabs() {
  return (
    <Suspense fallback={<MoviesGridSkeleton />}>
      <MoviesTabsContent />
    </Suspense>
  );
}

function MoviesTabsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'popular';
  const page = searchParams.get('page') || '1';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    params.set('page', '1'); // Reset to page 1 when changing tabs
    router.push(`/movies?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/movies?${params.toString()}`);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="mb-8">
      <TabsList>
        <TabsTrigger value="popular">Popular</TabsTrigger>
        <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
      </TabsList>
      
      <TabsContent value="popular">
        <Suspense fallback={<MoviesGridSkeleton />}>
          <PopularMovies 
            page={page} 
            onPageChange={handlePageChange}
          />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="top-rated">
        <Suspense fallback={<MoviesGridSkeleton />}>
          <TopRatedMovies 
            page={page} 
            onPageChange={handlePageChange}
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
} 