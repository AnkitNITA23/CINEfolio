
'use client';

import React, { useMemo, useState, useEffect, ReactNode } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, History, Heart, Star, UserCheck, UserPlus, Film, TrendingUp } from 'lucide-react';
import { MovieCard } from '@/components/cinefolio/movie-card';
import { ViewingStatsChart } from '@/components/cinefolio/viewing-stats-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import type { ContentItem, Genre, MovieDetails } from '@/lib/types';
import { genres as allGenres } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { MonthlyActivityChart } from '@/components/cinefolio/monthly-activity-chart';
import { TopTalent } from '@/components/cinefolio/top-talent';
import { formatRuntime } from '@/lib/utils';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { CineMatch } from './cinematch';
import { getSimilar } from '@/lib/tmdb';
import { MovieScrollSection } from './movie-scroll-section';
import { motion } from 'framer-motion';

interface ProfileClientPageProps {
  profileId: string;
}

function ProfileRecommendations({ history }: { history: ContentItem[] }) {
    const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecommendations() {
            if (history.length === 0) {
                setLoading(false);
                return;
            }

            // Get the most recently watched item to base recommendations on.
            const latestItem = history.sort((a, b) => {
                const dateA = (a as any).watchedDate ? new Date((a as any).watchedDate).getTime() : 0;
                const dateB = (b as any).watchedDate ? new Date((b as any).watchedDate).getTime() : 0;
                return dateB - dateA;
            })[0];
            
            try {
                const similarItems = await getSimilar(latestItem.media_type, String(latestItem.id));
                setRecommendations(similarItems.filter(item => item.id !== latestItem.id));
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRecommendations();
    }, [history]);

    if (loading) {
       return (
         <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[2/3] w-full" />)}
            </div>
         </div>
       );
    }
    
    if (recommendations.length === 0) {
        return null;
    }

    return <MovieScrollSection title="Recommended For You" items={recommendations} />
}


export function ProfileClientPage({ profileId }: ProfileClientPageProps) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const isOwnProfile = currentUser?.uid === profileId;

  // Data for the profile being viewed
  const profileRef = useMemoFirebase(() => doc(firestore, 'users', profileId), [firestore, profileId]);
  const { data: profileUser, isLoading: isProfileLoading } = useDoc<any>(profileRef);

  // Data for the currently logged-in user
  const currentUserWatchlistRef = useMemoFirebase(() => currentUser ? collection(firestore, 'users', currentUser.uid, 'watchlist') : null, [firestore, currentUser]);
  const currentUserHistoryRef = useMemoFirebase(() => currentUser ? collection(firestore, 'users', currentUser.uid, 'watchedHistory') : null, [firestore, currentUser]);
  const currentUserLikedRef = useMemoFirebase(() => currentUser ? collection(firestore, 'users', currentUser.uid, 'likedTitles') : null, [firestore, currentUser]);

  const { data: currentUserWatchlist, isLoading: isCurrentUserWatchlistLoading } = useCollection<ContentItem>(currentUserWatchlistRef);
  const { data: currentUserHistory, isLoading: isCurrentUserHistoryLoading } = useCollection<ContentItem>(currentUserHistoryRef);
  const { data: currentUserLiked, isLoading: isCurrentUserLikedLoading } = useCollection<ContentItem>(currentUserLikedRef);

  // Data for the profile being viewed (can be the current user or another user)
  const otherUserWatchlistRef = useMemoFirebase(() => collection(firestore, 'users', profileId, 'watchlist'), [firestore, profileId]);
  const otherUserHistoryRef = useMemoFirebase(() => collection(firestore, 'users', profileId, 'watchedHistory'), [firestore, profileId]);
  const otherUserLikedRef = useMemoFirebase(() => collection(firestore, 'users', profileId, 'likedTitles'), [firestore, profileId]);

  const { data: otherUserWatchlist, isLoading: isOtherUserWatchlistLoading } = useCollection<ContentItem>(otherUserWatchlistRef);
  const { data: otherUserHistory, isLoading: isOtherUserHistoryLoading } = useCollection<ContentItem>(otherUserHistoryRef);
  const { data: otherUserLiked, isLoading: isOtherUserLikedLoading } = useCollection<ContentItem>(otherUserLikedRef);


  const followersRef = useMemoFirebase(() => collection(firestore, 'users', profileId, 'followers'), [firestore, profileId]);
  const followingRef = useMemoFirebase(() => collection(firestore, 'users', profileId, 'following'), [firestore, profileId]);
  const { data: followers } = useCollection(followersRef);
  const { data: following } = useCollection(followingRef);
  

  const isFollowing = useMemo(() => {
    if (!currentUser || !followers) return false;
    return followers.some(follower => follower.id === currentUser.uid);
  }, [currentUser, followers]);


  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast({ title: "Please login to follow users.", variant: "destructive" });
      return;
    }
    if (isOwnProfile) return;

    const currentUserFollowingRef = doc(firestore, 'users', currentUser.uid, 'following', profileId);
    const profileUserFollowersRef = doc(firestore, 'users', profileId, 'followers', currentUser.uid);

    if (isFollowing) {
      // Unfollow
      deleteDocumentNonBlocking(currentUserFollowingRef);
      deleteDocumentNonBlocking(profileUserFollowersRef);
      toast({ title: `Unfollowed ${profileUser?.username || 'user'}` });
    } else {
      // Follow
      const timestamp = serverTimestamp();
      setDocumentNonBlocking(currentUserFollowingRef, { followedAt: timestamp });
      setDocumentNonBlocking(profileUserFollowersRef, { followedAt: timestamp });
      toast({ title: `Followed ${profileUser?.username || 'user'}` });
    }
  };

  const watchedItems = isOwnProfile ? (currentUserHistory ?? []) : (otherUserHistory ?? []);
  const likedItems = isOwnProfile ? (currentUserLiked ?? []) : (otherUserLiked ?? []);


  const favoriteGenres = useMemo(() => {
    const allItems = [...likedItems, ...watchedItems];
    
    if (allItems.length === 0) return [];
    const genreCounts: { [key: string]: { id: number, name: string, count: number } } = {};

    allItems.forEach(item => {
      const itemGenres: { id: number, name: string }[] = item.genres?.length
        ? item.genres
        : (item.genre_ids?.map(id => allGenres.find(g => g.id === id)).filter(Boolean) as Genre[] || []);
      
      itemGenres.forEach(genre => {
        if (genre) {
          if (!genreCounts[genre.name]) {
            genreCounts[genre.name] = { ...genre, count: 0 };
          }
          genreCounts[genre.name].count++;
        }
      });
    });

    return Object.values(genreCounts).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [likedItems, watchedItems]);

  const totalMinutesWatched = useMemo(() => {
     if (!watchedItems) return 0;
     return watchedItems.reduce((total, item) => {
       const runtime = (item as MovieDetails)?.runtime;
       return total + (typeof runtime === 'number' ? runtime : 0);
     }, 0);
  }, [watchedItems]);

  const isLoading = isProfileLoading || (isOwnProfile && (isCurrentUserWatchlistLoading || isCurrentUserHistoryLoading || isCurrentUserLikedLoading)) || (!isOwnProfile && (isOtherUserWatchlistLoading || isOtherUserHistoryLoading || isOtherUserLikedLoading));

  if (isLoading) {
    return (
      <div className="container py-12">
        <header className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] w-full" />
              ))}
            </div>
          </div>
          <aside className="space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </aside>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
        <div className="container py-24 text-center">
            <h1 className="text-4xl font-bold">User Not Found</h1>
            <p className="text-muted-foreground mt-4">We couldn't find a profile with this ID.</p>
        </div>
    )
  }
  
  const userInitial = profileUser.username ? profileUser.username.charAt(0) : (profileUser.email ? profileUser.email.charAt(0) : '?');
  


  return (
    <div className="container py-12">
      <header className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary">
           <AvatarImage src={profileUser.avatarUrl || `https://picsum.photos/seed/${profileUser.id}/100/100`} alt={profileUser.username || 'User'} data-ai-hint="user avatar" />
          <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold">{profileUser.username || 'Cinephile'}</h1>
          <div className="mt-4 grid grid-cols-3 sm:flex sm:flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-4 text-muted-foreground">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{watchedItems.length}</p>
              <p className="text-xs sm:text-sm">Watched</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{(isOwnProfile ? currentUserWatchlist : otherUserWatchlist)?.length || 0}</p>
              <p className="text-xs sm:text-sm">Watchlist</p>
            </div>
             <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{likedItems.length}</p>
              <p className="text-xs sm:text-sm">Liked</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{followers?.length || 0}</p>
              <p className="text-xs sm:text-sm">Followers</p>
            </div>
             <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{following?.length || 0}</p>
              <p className="text-xs sm:text-sm">Following</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{formatRuntime(totalMinutesWatched)}</p>
              <p className="text-xs sm:text-sm">Time Watched</p>
            </div>
          </div>
        </div>
        {!isOwnProfile && currentUser && (
          <Button onClick={handleFollowToggle} className="w-full sm:w-auto">
            {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </header>
      
      {isOwnProfile ? (
        <>
          <div className="mb-12">
              <ProfileRecommendations history={watchedItems} />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 h-auto">
              <TabsTrigger value="overview"><TrendingUp className="mr-2 h-4 w-4" />Overview</TabsTrigger>
              <TabsTrigger value="watchlist"><List className="mr-2 h-4 w-4"/>Watchlist</TabsTrigger>
              <TabsTrigger value="history"><History className="mr-2 h-4 w-4"/>History</TabsTrigger>
              <TabsTrigger value="liked"><Heart className="mr-2 h-4 w-4"/>Liked</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <TopTalent watchedHistory={watchedItems} />
                </div>
                <aside className="space-y-8">
                  <MonthlyActivityChart watchedHistory={watchedItems} />
                  <ViewingStatsChart watchedHistory={watchedItems} />
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Favorite Genres</CardTitle>
                          <Star className="h-5 w-5 text-primary" />
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                          {(isOtherUserLikedLoading || isOtherUserHistoryLoading) ? <Skeleton className="h-6 w-24" /> : 
                           favoriteGenres.length > 0 ? (
                              favoriteGenres.map(genre => (
                                  <Badge key={genre.id} variant="secondary" className="font-normal">
                                      {genre.name}
                                  </Badge>
                              ))
                          ) : (
                              <p className="text-sm text-muted-foreground">Like some titles to see favorite genres.</p>
                          )}
                      </CardContent>
                  </Card>
                </aside>
              </div>
            </TabsContent>
            <TabsContent value="watchlist" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {isCurrentUserWatchlistLoading ? [...Array(5)].map((_, i) => <Skeleton key={`sk-wl-${i}`} className="aspect-[2/3] w-full" />) 
                      : currentUserWatchlist?.map(item => <MovieCard key={`wl-${item.id}`} item={item}/>)}
                </div>
                 {!isCurrentUserWatchlistLoading && currentUserWatchlist?.length === 0 && <p className="text-center text-muted-foreground py-8">Your watchlist is empty.</p>}
            </TabsContent>
            <TabsContent value="history" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                     {isCurrentUserHistoryLoading ? [...Array(5)].map((_, i) => <Skeleton key={`sk-wh-${i}`} className="aspect-[2/3] w-full" />) 
                      : currentUserHistory?.map(item => <MovieCard key={`wh-${item.id}`} item={item}/>)}
                </div>
                {!isCurrentUserHistoryLoading && currentUserHistory?.length === 0 && <p className="text-center text-muted-foreground py-8">You haven't watched anything yet.</p>}
            </TabsContent>
            <TabsContent value="liked" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {isCurrentUserLikedLoading ? [...Array(5)].map((_, i) => <Skeleton key={`sk-lt-${i}`} className="aspect-[2/3] w-full" />) 
                      : currentUserLiked?.map(item => <MovieCard key={`lt-${item.id}`} item={item}/>)}
                </div>
                 {!isCurrentUserLikedLoading && currentUserLiked?.length === 0 && <p className="text-center text-muted-foreground py-8">You haven't liked any titles yet.</p>}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <CineMatch
            currentUser={{
                watchlist: currentUserWatchlist || [],
                watchedHistory: currentUserHistory || [],
                liked: currentUserLiked || [],
            }}
            profileUser={{
                watchlist: otherUserWatchlist || [],
                watchedHistory: otherUserHistory || [],
                liked: otherUserLiked || [],
                username: profileUser.username,
            }}
        />
      )}
    </div>
  );
}
