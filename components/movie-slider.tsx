"use client";

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/movie-card';
import { MovieType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MovieSliderProps {
  title: string;
  subtitle?: string;
  movies: MovieType[];
  viewAllLink?: string;
  variant?: 'default' | 'featured';
}

export default function MovieSlider({
  title,
  subtitle,
  movies,
  viewAllLink,
  variant = 'default',
}: MovieSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
      // Initial check
      checkScrollButtons();
      
      // Check after images load which might change content size
      const handleResize = () => {
        checkScrollButtons();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        slider.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const cardClass = variant === 'featured' 
    ? 'min-w-[280px] md:min-w-[320px] lg:min-w-[360px]'
    : 'min-w-[160px] md:min-w-[200px] lg:min-w-[220px]';

  return (
    <section className="relative py-6">
      <div className="container px-4 md:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              View All
            </Link>
          )}
        </div>
        
        <div className="relative group">
          {/* Scroll buttons */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -left-4 top-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100",
              !canScrollLeft && "hidden"
            )}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -right-4 top-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100",
              !canScrollRight && "hidden"
            )}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map((movie) => (
              <div key={movie.id} className={cardClass}>
                <MovieCard movie={movie} variant={variant} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}