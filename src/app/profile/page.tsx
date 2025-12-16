'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProfileClientPage } from '@/components/cinefolio/profile-client-page';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    // You can return a loading skeleton here if you want
    return null; 
  }

  // This page now only handles the LOGGED-IN user's own profile.
  // It redirects to the dynamic route /profile/[id]
  return <ProfileClientPage profileId={user.uid} />;
}
