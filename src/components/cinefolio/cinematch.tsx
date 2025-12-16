'use client';

import { useMemo } from 'react';
import type { ContentItem } from '@/lib/types';
import { MovieScrollSection } from './movie-scroll-section';

interface UserListData {
  watchlist: ContentItem[];
  watchedHistory: ContentItem[];
  liked: ContentItem[];
  username?: string;
}

interface CineMatchProps {
  currentUser: UserListData;
  profileUser: UserListData;
}

export function CineMatch({ currentUser, profileUser }: CineMatchProps) {
  const matches = useMemo(() => {
    // If either user's data is incomplete, we can't compute matches.
    if (
      !currentUser.watchlist ||
      !currentUser.watchedHistory ||
      !currentUser.liked ||
      !profileUser.watchlist ||
      !profileUser.watchedHistory ||
      !profileUser.liked
    ) {
      return null;
    }

    const currentUserWatchlistIds = new Set(currentUser.watchlist.map(item => item.id));
    const currentUserHistoryIds = new Set(currentUser.watchedHistory.map(item => item.id));
    const currentUserLikedIds = new Set(currentUser.liked.map(item => item.id));

    const profileUserWatchlistIds = new Set(profileUser.watchlist.map(item => item.id));
    const profileUserHistoryIds = new Set(profileUser.watchedHistory.map(item => item.id));
    const profileUserLikedIds = new Set(profileUser.liked.map(item => item.id));

    // Find items that are in both users' watchlists.
    const commonWatchlist = currentUser.watchlist.filter(item =>
      profileUserWatchlistIds.has(item.id)
    );

    // Find items that both users have watched.
    const commonHistory = currentUser.watchedHistory.filter(item =>
      profileUserHistoryIds.has(item.id)
    );

    // Find items that both users have liked.
    const commonLiked = currentUser.liked.filter(item =>
      profileUserLikedIds.has(item.id)
    );

    // Find items on the current user's watchlist that the other user has watched.
    const currentUserWatchlistProfileWatched = currentUser.watchlist.filter(
      item => profileUserHistoryIds.has(item.id)
    );

    // Find items on the other user's watchlist that the current user has watched.
    const profileUserWatchlistCurrentUserWatched = profileUser.watchlist.filter(
      item => currentUserHistoryIds.has(item.id)
    );

    return {
      commonWatchlist,
      commonHistory,
      commonLiked,
      currentUserWatchlistProfileWatched,
      profileUserWatchlistCurrentUserWatched,
    };
  }, [currentUser, profileUser]);

  if (!matches) {
     return (
       <div className="text-center py-16 text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">CineMatch is Loading...</h2>
        <p className="mt-2 max-w-md mx-auto">
          Comparing your lists with {profileUser.username || 'this user'}'s lists to find what you have in common.
        </p>
      </div>
    );
  }
  
  const hasAnyMatches = Object.values(matches).some(list => list.length > 0);

  if (!hasAnyMatches) {
     return (
       <div className="text-center py-16 text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">No Matches Found</h2>
        <p className="mt-2 max-w-md mx-auto">
          You and {profileUser.username || 'this user'} don't have any matching titles in your public lists yet. Explore more content to find common interests!
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-12">
      {matches.commonWatchlist.length > 0 && (
        <MovieScrollSection
          title={`You Both Want to Watch`}
          items={matches.commonWatchlist}
        />
      )}
      {matches.commonHistory.length > 0 && (
        <MovieScrollSection
          title={`You've Both Watched`}
          items={matches.commonHistory}
        />
      )}
      {matches.commonLiked.length > 0 && (
        <MovieScrollSection
          title={`You Both Liked`}
          items={matches.commonLiked}
        />
      )}
      {matches.currentUserWatchlistProfileWatched.length > 0 && (
        <MovieScrollSection
          title={`On Your Watchlist, Watched by ${profileUser.username}`}
          items={matches.currentUserWatchlistProfileWatched}
        />
      )}
      {matches.profileUserWatchlistCurrentUserWatched.length > 0 && (
        <MovieScrollSection
          title={`On ${profileUser.username}'s Watchlist, Watched by You`}
          items={matches.profileUserWatchlistCurrentUserWatched}
        />
      )}
    </div>
  );
}
