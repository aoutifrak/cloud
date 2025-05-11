import Link from 'next/link';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-card/50 border-t py-8">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
              123Movies
            </h3>
            <p className="text-sm text-muted-foreground">
              The ultimate destination for streaming movies and TV shows online.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/movies" className="text-muted-foreground hover:text-primary">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tv-shows" className="text-muted-foreground hover:text-primary">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/top-imdb" className="text-muted-foreground hover:text-primary">
                  Top IMDB
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Genres</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/genre/action" className="text-muted-foreground hover:text-primary">
                  Action
                </Link>
              </li>
              <li>
                <Link href="/genre/comedy" className="text-muted-foreground hover:text-primary">
                  Comedy
                </Link>
              </li>
              <li>
                <Link href="/genre/drama" className="text-muted-foreground hover:text-primary">
                  Drama
                </Link>
              </li>
              <li>
                <Link href="/genre/horror" className="text-muted-foreground hover:text-primary">
                  Horror
                </Link>
              </li>
              <li>
                <Link href="/genre/sci-fi" className="text-muted-foreground hover:text-primary">
                  Sci-Fi
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/legal/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/legal/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} 123Movies. All rights reserved.</p>
          <p className="mt-1">This is a demo website for educational purposes only.</p>
        </div>
      </div>
    </footer>
  );
}