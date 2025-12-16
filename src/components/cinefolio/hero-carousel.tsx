
'use client';

import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Plus, Info, Bookmark, Play } from 'lucide-react';
import type { ContentItem } from '@/lib/types';
import { getImageUrl } from '@/lib/tmdb';

interface HeroCarouselProps {
  items: ContentItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  return (
    <Carousel
      className="w-full"
      plugins={[Autoplay({ delay: 7000, stopOnInteraction: true })]}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id}>
            <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
              <Image
                src={getImageUrl(item.backdrop_path, 'original')}
                alt={`Backdrop for ${item.title || item.name}`}
                fill
                className="object-cover"
                priority
                data-ai-hint="movie scene"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
               <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="container text-white max-w-3xl"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground shadow-lg">
                    {item.title || item.name}
                  </h1>
                  <div className="flex items-center gap-4 my-4 text-muted-foreground">
                    <span>{new Date(item.release_date || item.first_air_date || '').getFullYear()}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">{item.vote_average.toFixed(1)} ★</span>
                  </div>
                  <p className="text-base sm:text-lg text-muted-foreground line-clamp-3 leading-relaxed max-w-2xl">
                    {item.overview}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
                    <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                      <Link href={`/${item.media_type}/${item.id}`}>
                        <Play className="mr-2 h-5 w-5 fill-current" /> Play Trailer
                      </Link>
                    </Button>
                     <Button size="lg" variant="secondary" asChild>
                      <Link href={`/${item.media_type}/${item.id}`}>
                        <Info className="mr-2 h-5 w-5" /> More Info
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
