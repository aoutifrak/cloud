"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string }[];
}

export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Animation states
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isAnimating && !isOpen) return null;

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="container h-full pt-16 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X className="h-6 w-6" />
        </Button>
        
        <nav className="flex flex-col space-y-6 pt-8">
          {links.map(link => (
            <Link 
              key={link.name}
              href={link.href}
              className="text-lg font-medium py-2 transition-colors hover:text-primary border-b border-border/30"
              onClick={onClose}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 space-y-4">
            <Link 
              href="/login" 
              className="block w-full"
              onClick={onClose}
            >
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link 
              href="/register" 
              className="block w-full"
              onClick={onClose}
            >
              <Button className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}