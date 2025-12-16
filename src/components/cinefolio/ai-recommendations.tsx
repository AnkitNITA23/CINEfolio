'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieScrollSection } from './movie-scroll-section';
import type { ContentItem } from '@/lib/types';
import { getSimilar } from '@/lib/tmdb';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query, orderBy } from 'firebase/firestore';

export function AiRecommendations() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the most recently watched item to base recommendations on.
  const viewingHistoryQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, `users/${user.uid}/watchedHistory`), orderBy('watchedDate', 'desc'), limit(1)) : null
  , [firestore, user]);

  const { data: latestWatchedHistory } = useCollection<ContentItem>(viewingHistoryQuery);

  useEffect(() => {
    async function fetchRecommendations() {
      if (isUserLoading) {
        return;
      }
      
      // Do not fetch recommendations if there's no user or no history
      if (!user || !latestWatchedHistory) {
        setLoading(false);
        setRecommendations([]);
        return;
      }

      if (latestWatchedHistory.length === 0) {
        setLoading(false);
        setRecommendations([]);
        return;
      }

      const latestItem = latestWatchedHistory[0];

      try {
        setLoading(true);
        setError(null);
        
        const similarItems = await getSimilar(latestItem.media_type, String(latestItem.id));
        
        if (similarItems && similarItems.length > 0) {
          // Filter out the item itself from the recommendations
          setRecommendations(similarItems.filter(item => item.id !== latestItem.id));
        } else {
          setRecommendations([]);
        }

      } catch (e: any) {
        console.error('Failed to fetch similar items from TMDB:', e);
        setError('Could not load recommendations.');
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [isUserLoading, user, latestWatchedHistory]);

  // On error, or if there are no recommendations, or while loading initial user data, return null.
  if (error || (!loading && recommendations.length === 0)) {
    return null;
  }

  if (loading) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-6">Recommended For You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
             <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return <MovieScrollSection title="Recommended For You" items={recommendations} />;
}
