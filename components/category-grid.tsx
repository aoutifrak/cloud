import Link from 'next/link';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Action', color: 'from-red-500 to-orange-500', href: '/genre/action' },
  { name: 'Comedy', color: 'from-yellow-400 to-amber-500', href: '/genre/comedy' },
  { name: 'Drama', color: 'from-blue-500 to-indigo-600', href: '/genre/drama' },
  { name: 'Horror', color: 'from-gray-700 to-gray-900', href: '/genre/horror' },
  { name: 'Romance', color: 'from-pink-400 to-pink-600', href: '/genre/romance' },
  { name: 'Sci-Fi', color: 'from-violet-500 to-purple-600', href: '/genre/sci-fi' },
  { name: 'Thriller', color: 'from-green-500 to-emerald-600', href: '/genre/thriller' },
  { name: 'Animation', color: 'from-cyan-400 to-blue-500', href: '/genre/animation' },
];

export default function CategoryGrid() {
  return (
    <section className="py-8">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={cn(
                "relative h-24 rounded-lg overflow-hidden bg-gradient-to-r",
                category.color,
                "transition-transform hover:scale-[1.03] hover:shadow-lg"
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-white text-lg">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}