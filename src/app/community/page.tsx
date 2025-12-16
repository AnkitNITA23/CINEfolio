
'use client';

import { useState, useEffect } from 'react';
import {
  useFirestore,
  useUser,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  collection,
  query,
  getDocs,
  limit,
  orderBy,
  startAt,
  endAt,
  doc,
  getDoc,
  where,
} from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import {
  UserResultCard,
  UserResultSkeleton,
} from '@/components/cinefolio/user-result-card';
import type { User } from '@/lib/types';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

function FollowingList() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const followingRef = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'following') : null),
    [firestore, user]
  );
  const { data: followingIds } = useCollection(followingRef);

  useEffect(() => {
    async function fetchFollowingUsers() {
      if (!followingIds) {
        setLoading(false);
        return;
      }
      if (followingIds.length === 0) {
        setFollowingUsers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userPromises = followingIds.map(f =>
          getDoc(doc(firestore, 'users', f.id))
        );
        const userDocs = await Promise.all(userPromises);
        const users = userDocs
          .map(d => d.data() as User)
          .filter(Boolean); // Filter out any undefined users
        setFollowingUsers(users);
      } catch (error) {
        console.error('Error fetching following users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFollowingUsers();
  }, [followingIds, firestore]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followingUsers.length > 0 ? (
        followingUsers.map(u => <UserResultCard key={u.id} user={u} />)
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          You are not following anyone yet.
        </p>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    async function searchUsers() {
      if (!debouncedSearchTerm.trim() || !user) {
        setResults([]);
        return;
      }
      setLoading(true);

      try {
        const usersRef = collection(firestore, 'users');
        const q = query(
          usersRef,
          orderBy('username'),
          startAt(debouncedSearchTerm),
          endAt(debouncedSearchTerm + '\uf8ff'),
          limit(20)
        );

        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => u.id !== user.uid); // Exclude current user from search results
        setResults(users);
      } catch (error) {
        console.error('Error searching for users:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    searchUsers();
  }, [debouncedSearchTerm, firestore, user]);

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Community
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find and connect with other cinephiles.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content: Search */}
        <main className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Discover Users</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for users by username..."
                className="pl-12 h-12 text-lg"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <UserResultSkeleton key={`skel-${i}`} />
              ))}
            {!loading && debouncedSearchTerm && results.length > 0 && (
              <>
                <h3 className="text-lg font-semibold">Search Results</h3>
                {results.map(userResult => (
                  <UserResultCard key={userResult.id} user={userResult} />
                ))}
              </>
            )}
            {!loading && debouncedSearchTerm && results.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p>No users found matching "{debouncedSearchTerm}".</p>
              </div>
            )}
            {!loading && !debouncedSearchTerm && (
              <div className="text-center py-16 text-muted-foreground">
                <p>Start typing above to find users.</p>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar: Following */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="p-6 rounded-lg border bg-card sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Following</h2>
            <Separator className="mb-6" />
            <FollowingList />
          </div>
        </aside>
      </div>
    </div>
  );
}
