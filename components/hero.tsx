"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieType, TVShowType } from '@/lib/types';

interface HeroProps {
  featuredMovies: (MovieType | TVShowType)[];
}

export default function Hero({ featuredMovies }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = featuredMovies[currentIndex];
  const isMovie = 'title' in currentItem;
  
  // Auto rotate featured movies
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background image with overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent z-10" />
          <Image
            src={currentItem.backdropUrl || '/placeholder-backdrop.jpg'}
            alt={isMovie ? (currentItem as MovieType).title : (currentItem as TVShowType).name}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Hero content */}
      <div className="container relative z-20 h-full flex flex-col justify-end pb-16 md:pb-20 px-4 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex gap-2 mb-4">
              {currentItem.genres?.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-3 md:mb-4 line-clamp-2">
              {isMovie ? (currentItem as MovieType).title : (currentItem as TVShowType).name}
            </h1>
            
            <p className="text-muted-foreground mb-6 line-clamp-2 md:line-clamp-3">
              {currentItem.overview}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href={isMovie ? `/movie/${currentItem.id}/watch` : `/tv-show/${currentItem.id}/watch`}>
                <Button size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Watch Now
                </Button>
              </Link>
              <Link href={isMovie ? `/movie/${currentItem.id}` : `/tv-show/${currentItem.id}`}>
                <Button variant="outline" size="lg" className="gap-2">
                  <Info className="h-4 w-4" />
                  More Info
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-primary' 
                  : 'w-4 bg-muted-foreground/50 hover:bg-muted-foreground'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}