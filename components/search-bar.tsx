"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { searchMovies } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Film, Tv } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
}

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchMovies(query);
        setResults(data.results || []);
      } catch (error) {
        console.error('Error searching:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    setQuery('');
    onClose?.();
    
    if (result.media_type === 'movie') {
      router.push(`/movie/${result.id}`);
    } else {
      router.push(`/tv-show/${result.id}`);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).getFullYear();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search movies and TV shows..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          className="w-full pl-10 pr-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={() => {
              setQuery('');
              setResults([]);
              onClose?.();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <Card
                  key={result.id}
                  className="mb-2 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <CardContent className="flex items-center gap-4 p-2">
                    <div className="relative w-16 h-24 flex-shrink-0">
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                        alt={result.title || result.name || ''}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1">
                        {result.title || result.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          {result.media_type === 'movie' ? (
                            <Film className="w-3 h-3 mr-1" />
                          ) : (
                            <Tv className="w-3 h-3 mr-1" />
                          )}
                          {result.media_type === 'movie' ? 'Movie' : 'TV Show'}
                        </Badge>
                        {result.vote_average !== undefined && (
                          <Badge variant="secondary">
                            <Star className="w-3 h-3 mr-1" />
                            {result.vote_average.toFixed(1)}
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(result.release_date || result.first_air_date)}
                        </Badge>
                      </CardDescription>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {result.overview}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}