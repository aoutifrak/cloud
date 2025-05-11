import { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchMoviesByGenre } from "@/lib/api"
import MovieCard from "@/components/movie-card"
import { MovieType } from "@/lib/types"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
  return {
    title: `${category} Movies | Movie App`,
    description: `Browse ${category} movies and TV shows`,
  }
}

const categories = {
  action: {
    title: "Action",
    id: 28,
  },
  comedy: {
    title: "Comedy",
    id: 35,
  },
  drama: {
    title: "Drama",
    id: 18,
  },
  horror: {
    title: "Horror",
    id: 27,
  },
  romance: {
    title: "Romance",
    id: 10749,
  },
  scifi: {
    title: "Sci-Fi",
    id: 878,
  },
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const category = categories[slug as keyof typeof categories]

  if (!category) {
    notFound()
  }

  const movies: MovieType[] = await fetchMoviesByGenre(category.id)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">{category.title} Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie: MovieType) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
} 