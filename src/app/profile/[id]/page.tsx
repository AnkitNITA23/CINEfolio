import { ProfileClientPage } from '@/components/cinefolio/profile-client-page';

export default function DynamicProfilePage({ params }: { params: { id: string } }) {
  // This page renders the client component responsible for fetching and displaying
  // a user's profile based on the ID from the URL.
  return <ProfileClientPage profileId={params.id} />;
}
