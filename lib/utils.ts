// Sleep utility for delay
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Extract year from date string
export const extractYear = (dateString: string | null): string => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
};

// Format runtime from minutes to hours and minutes
export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 
    ? `${hours}h ${remainingMinutes}m`
    : `${remainingMinutes}m`;
};

// Get TMDB image URL with size and type
export const getTMDBImageUrl = (
  path: string | null, 
  size: 'small' | 'medium' | 'large' | 'original' = 'original',
  type: 'poster' | 'backdrop' = 'poster'
): string => {
  if (!path) return '';
  
  const sizes = {
    poster: {
      small: 'w185',
      medium: 'w342',
      large: 'w500',
      original: 'original'
    },
    backdrop: {
      small: 'w300',
      medium: 'w780',
      large: 'w1280',
      original: 'original'
    }
  };
  
  const imageSize = sizes[type][size];
  return `https://image.tmdb.org/t/p/${imageSize}${path}`;
};

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}