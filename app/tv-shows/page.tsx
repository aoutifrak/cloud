import TVShowCard from "@/components/tv-show-card"
import { getTopRatedTVShows } from "@/lib/api"
import { TVShowType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Top TV Shows",
  description: "Browse the highest-rated TV shows"
}

function transformTVShowData(tvShow: any): TVShowType {
  return {
    ...tvShow,
    posterUrl: tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : '',
    year: tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : undefined,
    rating: tvShow.vote_average,
    duration: tvShow.episode_run_time?.[0] ? `${tvShow.episode_run_time[0]}m` : undefined,
    genres: tvShow.genre_ids?.map((id: number) => id.toString()) || [],
    description: tvShow.overview
  };
}

export default async function TVShowsPage({ 
  searchParams 
}: { 
  searchParams: { page?: string } 
}) {
  const currentPage = Number(searchParams.page) || 1;
  const response = await getTopRatedTVShows(currentPage);
  const tvShows = (response.results || []).map(transformTVShowData);
  const totalPages = response.total_pages || 1;
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Top TV Shows</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tvShows.map((tvShow: TVShowType) => (
          <TVShowCard key={tvShow.id} tvShow={tvShow} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 pt-8">
        {currentPage > 1 && (
          <Link href={`/tv-shows?page=${currentPage - 1}`}>
            <Button variant="outline">Previous</Button>
          </Link>
        )}
        <span className="px-4 py-2">
          Page {currentPage} of {Math.min(totalPages, 500)}
        </span>
        {currentPage < Math.min(totalPages, 500) && (
          <Link href={`/tv-shows?page=${currentPage + 1}`}>
            <Button variant="outline">Next</Button>
          </Link>
        )}
      </div>
    </div>
  );
} 