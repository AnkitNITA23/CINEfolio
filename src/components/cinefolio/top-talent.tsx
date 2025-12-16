
'use client';

import { useMemo } from 'react';
import type { ContentItem, MovieDetails, SeriesDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getImageUrl } from '@/lib/tmdb';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

interface TopTalentProps {
  watchedHistory: ContentItem[];
}

interface Talent {
  id: number;
  name: string;
  count: number;
  profile_path: string;
}

export function TopTalent({ watchedHistory }: TopTalentProps) {
  const { topActors, topDirectors } = useMemo(() => {
    const actorCounts: { [key: number]: Talent } = {};
    const directorCounts: { [key: number]: Talent } = {};

    watchedHistory.forEach(item => {
      const credits = (item as MovieDetails | SeriesDetails).credits;
      if (credits) {
        // Count actors (top 10 from cast)
        credits.cast?.slice(0, 10).forEach(actor => {
          if (actor.profile_path) {
            if (!actorCounts[actor.id]) {
              actorCounts[actor.id] = {
                id: actor.id,
                name: actor.name,
                count: 0,
                profile_path: actor.profile_path,
              };
            }
            actorCounts[actor.id].count++;
          }
        });

        // Find and count directors
        const directors = credits.crew?.filter(
          member => member.job === 'Director'
        );
        directors?.forEach(director => {
          if (director.profile_path) {
            if (!directorCounts[director.id]) {
              directorCounts[director.id] = {
                id: director.id,
                name: director.name,
                count: 0,
                profile_path: director.profile_path,
              };
            }
            directorCounts[director.id].count++;
          }
        });
      }
    });

    const sortedActors = Object.values(actorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    const sortedDirectors = Object.values(directorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { topActors: sortedActors, topDirectors: sortedDirectors };
  }, [watchedHistory]);

  if (topActors.length === 0 && topDirectors.length === 0) {
    return null; // Don't render the component if there's no data
  }

  const TalentCarousel = ({
    talent,
  }: {
    talent: Talent[];
  }) => (
    <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
      <CarouselContent className="-ml-4">
        {talent.map(person => (
          <CarouselItem key={person.id} className="basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4">
            <div className="text-center">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 mx-auto mb-2 shadow-md">
                <AvatarImage
                  src={getImageUrl(person.profile_path, 'w500')}
                  alt={person.name}
                  data-ai-hint="person portrait"
                />
                <AvatarFallback>
                  {person.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <p className="font-semibold text-sm truncate">{person.name}</p>
              <p className="text-xs text-muted-foreground">
                {person.count} {person.count > 1 ? 'titles' : 'title'}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
    </Carousel>
  );

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-8"
    >
      {topActors.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Favorite Actors</CardTitle>
            <User className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <TalentCarousel talent={topActors} />
          </CardContent>
        </Card>
      )}
      {topDirectors.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Favorite Directors</CardTitle>
            <Video className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <TalentCarousel talent={topDirectors} />
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
