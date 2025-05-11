"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { MovieType, TVShowType } from "@/lib/types"

interface WatchlistButtonProps {
  movie: MovieType | TVShowType
}

export default function WatchlistButton({ movie }: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    const checkWatchlist = () => {
      const watchlist = localStorage.getItem("watchlist")
      if (watchlist) {
        const items = JSON.parse(watchlist)
        setIsInWatchlist(items.some((item: MovieType | TVShowType) => item.id === movie.id))
      }
    }

    checkWatchlist()
  }, [movie.id])

  const toggleWatchlist = () => {
    const watchlist = localStorage.getItem("watchlist")
    let items: (MovieType | TVShowType)[] = []

    if (watchlist) {
      items = JSON.parse(watchlist)
    }

    if (isInWatchlist) {
      items = items.filter((item) => item.id !== movie.id)
    } else {
      items.push(movie)
    }

    localStorage.setItem("watchlist", JSON.stringify(items))
    setIsInWatchlist(!isInWatchlist)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleWatchlist}
      className={`text-foreground hover:text-red-500 ${
        isInWatchlist ? "text-red-500" : ""
      }`}
    >
      <Heart className="h-5 w-5" fill={isInWatchlist ? "currentColor" : "none"} />
    </Button>
  )
} 