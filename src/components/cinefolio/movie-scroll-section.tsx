'use client';
import type { ContentItem } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { MovieCard } from './movie-card';

interface MovieScrollSectionProps {
  title: string;
  items: ContentItem[];
}

export function MovieScrollSection({ title, items }: MovieScrollSectionProps) {
    if (!items || items.length === 0) {
        return null;
    }
    
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4"
            >
              <MovieCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      </Carousel>
    </section>
  );
}
