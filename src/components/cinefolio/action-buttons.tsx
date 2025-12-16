
'use client';

import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Bookmark, ThumbsUp, Check, History } from 'lucide-react';
import type { ContentItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';


interface ActionButtonsProps {
  item: ContentItem;
}

export function ActionButtons({ item }: ActionButtonsProps) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const watchlistRef = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'watchlist') : null),
    [firestore, user]
  );
  const { data: watchlist, isLoading: isWatchlistLoading } = useCollection(watchlistRef);
  const isOnWatchlist = watchlist?.some(i => i.id === item.id);

  const likedTitlesRef = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'likedTitles') : null),
    [firestore, user]
  );
  const { data: likedTitles, isLoading: isLikedLoading } = useCollection(likedTitlesRef);
  const isLiked = likedTitles?.some(i => i.id === item.id);
  
  const watchedHistoryRef = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'watchedHistory') : null),
    [firestore, user]
  );
  const { data: watchedHistory, isLoading: isWatchedHistoryLoading } = useCollection(watchedHistoryRef);
  const isWatched = watchedHistory?.some(i => i.id === item.id);


  const handleAuthRedirect = () => {
    toast({
      title: 'Login Required',
      description: 'You need to be logged in to perform this action.',
      variant: 'destructive',
    });
    router.push('/login');
  };

  const handleWatchlistToggle = () => {
    if (!user) return handleAuthRedirect();
    if (!watchlistRef) return;
    
    const docRef = doc(watchlistRef, String(item.id));
    if (isOnWatchlist) {
      deleteDocumentNonBlocking(docRef);
      toast({ title: 'Removed from Watchlist' });
    } else {
      const dataToSave = { ...item, userId: user.uid, id: String(item.id) };
      setDocumentNonBlocking(docRef, dataToSave, { merge: true });
      toast({ title: 'Added to Watchlist!' });
    }
  };

  const handleLikeToggle = () => {
    if (!user) return handleAuthRedirect();
    if (!likedTitlesRef) return;

    const docRef = doc(likedTitlesRef, String(item.id));

    if (isLiked) {
      deleteDocumentNonBlocking(docRef);
      toast({ title: 'Unliked' });
    } else {
      const dataToSave = { ...item, userId: user.uid, id: String(item.id) };
      setDocumentNonBlocking(docRef, dataToSave, { merge: true });
      toast({ title: 'Liked!' });
    }
  };

  const handleWatchedToggle = () => {
    if (!user) return handleAuthRedirect();
    if (!watchedHistoryRef) return;

    const docRef = doc(watchedHistoryRef, String(item.id));
    if (isWatched) {
      // Maybe allow un-watching? For now, we'll just inform.
      toast({ title: 'Already in your history' });
    } else {
      const dataToSave = { ...item, userId: user.uid, id: String(item.id), watchedDate: new Date().toISOString() };
      setDocumentNonBlocking(docRef, dataToSave, { merge: true });
      toast({ title: 'Added to Watched History!' });
    }
  }
  
  const isLoading = isUserLoading || isWatchlistLoading || isLikedLoading || isWatchedHistoryLoading;

  return (
    <div className="grid grid-cols-1 gap-2">
      <Button
        size="lg"
        onClick={handleWatchlistToggle}
        disabled={isLoading}
      >
        {isOnWatchlist ? (
          <>
            <Check className="mr-2 h-4 w-4" /> On Watchlist
          </>
        ) : (
          <>
            <Bookmark className="mr-2 h-4 w-4" /> Add to Watchlist
          </>
        )}
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={handleWatchedToggle}
        disabled={isLoading}
      >
        {isWatched ? (
          <>
            <Check className="mr-2 h-4 w-4" /> Watched
          </>
        ) : (
          <>
            <History className="mr-2 h-4 w-4" /> Mark as Watched
          </>
        )}
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={handleLikeToggle}
        disabled={isLoading}
      >
        <ThumbsUp
          className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current text-primary' : ''}`}
        />
        {isLiked ? 'Liked' : 'Like'}
      </Button>
    </div>
  );
}
