'use client';

import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCheck, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/provider';
import { collection } from 'firebase/firestore';


interface UserResultCardProps {
    user: any;
}

export function UserResultCard({ user }: UserResultCardProps) {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const isOwnProfile = currentUser?.uid === user.id;

  const followersRef = useMemoFirebase(() => collection(firestore, 'users', user.id, 'followers'), [firestore, user.id]);
  const { data: followers } = useCollection(followersRef);
  
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

    const currentUserFollowingRef = doc(firestore, 'users', currentUser.uid, 'following', user.id);
    const targetUserFollowersRef = doc(firestore, 'users', user.id, 'followers', currentUser.uid);

    if (isFollowing) {
      // Unfollow
      deleteDocumentNonBlocking(currentUserFollowingRef);
      deleteDocumentNonBlocking(targetUserFollowersRef);
      toast({ title: `Unfollowed ${user.username}` });
    } else {
      // Follow
      const timestamp = serverTimestamp();
      setDocumentNonBlocking(currentUserFollowingRef, { followedAt: timestamp });
      setDocumentNonBlocking(targetUserFollowersRef, { followedAt: timestamp });
      toast({ title: `Followed ${user.username}` });
    }
  };

  const userInitial = user.username ? user.username.charAt(0) : '?';

  return (
     <Card className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
      <Link href={`/profile/${user.id}`} className="flex items-center gap-4 group">
        <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-primary transition-colors">
          <AvatarImage src={user.avatarUrl} alt={user.username} data-ai-hint="user avatar"/>
          <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-lg group-hover:underline">{user.username}</p>
          <p className="text-sm text-muted-foreground">{followers?.length || 0} Followers</p>
        </div>
      </Link>
      {!isOwnProfile && currentUser && (
        <Button onClick={handleFollowToggle} variant={isFollowing ? "secondary" : "default"}>
          {isFollowing ? <UserCheck className="mr-2" /> : <UserPlus className="mr-2" />}
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
    </Card>
  )
}


export function UserResultSkeleton() {
    return (
        <Card className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
            <Skeleton className="h-10 w-28" />
        </Card>
    )
}
