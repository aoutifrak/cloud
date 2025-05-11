'use client';

import { useState, useEffect } from 'react';
import { addToWatchlist, removeFromWatchlist, isInWatchlist, getWatchlist, WatchlistItem } from '@/lib/watchlist';
import { Button } from '@/components/ui/button';

export default function WatchlistTest() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [testItem, setTestItem] = useState<WatchlistItem>({
    id: '123',
    title: 'Test Movie',
    poster_path: '/test-poster.jpg',
    vote_average: 8.5,
    release_date: '2023-01-01',
    media_type: 'movie'
  });
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    // Load watchlist on component mount
    const items = getWatchlist();
    setWatchlist(items);
    setIsInList(isInWatchlist(testItem.id, testItem.media_type));
  }, []);

  const handleAddToWatchlist = () => {
    addToWatchlist(testItem);
    setIsInList(true);
    // Reload watchlist
    const items = getWatchlist();
    setWatchlist(items);
  };

  const handleRemoveFromWatchlist = () => {
    removeFromWatchlist(testItem.id, testItem.media_type);
    setIsInList(false);
    // Reload watchlist
    const items = getWatchlist();
    setWatchlist(items);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Watchlist Test</h2>
      
      <div className="mb-4">
        <p>Test Item: {testItem.title}</p>
        <p>Is in watchlist: {isInList ? 'Yes' : 'No'}</p>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Button onClick={handleAddToWatchlist}>Add to Watchlist</Button>
        <Button onClick={handleRemoveFromWatchlist}>Remove from Watchlist</Button>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">Current Watchlist ({watchlist.length} items):</h3>
        <ul className="list-disc pl-4">
          {watchlist.map((item) => (
            <li key={`${item.media_type}-${item.id}`}>
              {item.title} ({item.media_type})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 