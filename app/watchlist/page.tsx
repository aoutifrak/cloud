"use client"

import { useEffect, useState } from "react"
import { MovieType } from "@/lib/types"
import MovieCard from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<MovieType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        setIsLoading(true)
        const storedWatchlist = localStorage.getItem("watchlist")
        if (storedWatchlist) {
          setWatchlist(JSON.parse(storedWatchlist))
        }
      } catch (err) {
        setError("Failed to load watchlist")
        console.error("Error loading watchlist:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadWatchlist()
  }, [])

  const clearWatchlist = () => {
    localStorage.removeItem("watchlist")
    setWatchlist([])
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (watchlist.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Watchlist is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Add movies and TV shows to your watchlist to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Watchlist</h1>
        <Button variant="destructive" onClick={clearWatchlist}>
          Clear Watchlist
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {watchlist.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
} 