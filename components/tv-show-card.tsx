"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TVShowType } from '@/lib/types';
import { cn } from '@/lib/utils';
import WatchlistButton from '@/components/watchlist-button';

interface TVShowCardProps {
  tvShow: TVShowType;
  variant?: 'default' | 'featured';
}

export default function TVShowCard({ 
  tvShow, 
  variant = 'default' 
}: TVShowCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardHeight = variant === 'featured' ? 'h-[440px]' : 'h-[360px]';
  const cardWidth = variant === 'featured' ? 'w-full' : 'w-full';
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-lg bg-card/50 transition-transform duration-300",
        cardHeight,
        cardWidth,
        isHovered && "scale-[1.02] shadow-xl"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* TV Show Poster */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Image
        src={tvShow.posterUrl || '/placeholder-poster.jpg'}
        alt={tvShow.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-75"
      />
      
      {/* Rating Badge */}
      <div className="absolute top-2 left-2 z-20">
        <Badge variant="secondary" className="bg-background/70 backdrop-blur-sm">
          ⭐ {tvShow.rating}
        </Badge>
      </div>
      
      {/* Quality Badge */}
      <div className="absolute top-2 right-2 z-20">
        <Badge className="bg-amber-500/90 text-black backdrop-blur-sm border-0">
          HD
        </Badge>
      </div>
      
      {/* Watchlist Button */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <WatchlistButton movie={tvShow} />
      </div>
      
      {/* Content Overlay on Hover */}
      <div className={cn(
        "absolute inset-0 z-20 flex flex-col justify-end p-4 bg-gradient-to-t from-background via-background/80 to-transparent opacity-0 transition-opacity duration-300",
        isHovered && "opacity-100"
      )}>
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{tvShow.name}</h3>
        
        <div className="flex items-center text-xs text-muted-foreground mb-2 gap-2">
          <span>{tvShow.year}</span>
          <span>•</span>
          <span>{tvShow.duration}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {tvShow.genres?.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Link href={`/tv-show/${tvShow.id}`} className="flex-1">
            <Button size="sm" className="w-full gap-1">
              <Play className="h-3 w-3" />
              Watch
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Normal state info (visible without hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background to-transparent z-10 group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="font-medium text-sm line-clamp-1">{tvShow.name}</h3>
        <div className="text-xs text-muted-foreground">{tvShow.year}</div>
      </div>
      
      {/* Link wrapper */}
      <Link href={`/tv-show/${tvShow.id}`} className="absolute inset-0 z-10" />
    </div>
  );
} 