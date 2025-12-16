'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Star, Bookmark, Play } from 'lucide-react';
import type { ContentItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  item: ContentItem;
  className?: string;
}

export function MovieCard({ item, className }: MovieCardProps) {
  const title = item.title || item.name;
  const releaseYear = item.release_date ? new Date(item.release_date).getFullYear() : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A');
  const rating = item.vote_average.toFixed(1);
  const posterPath = getImageUrl(item.poster_path, 'w500');

  return (
    <Link href={`/${item.media_type}/${item.id}`} className="block group">
      <motion.div
        whileHover="hover"
        className={cn('relative rounded-xl overflow-hidden aspect-[2/3] bg-muted shadow-md transition-shadow hover:shadow-2xl', className)}
      >
        <Image
          src={posterPath}
          alt={`Poster for ${title}`}
          width={500}
          height={750}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          data-ai-hint="movie poster"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Hover state */}
        <motion.div
          initial={{ opacity: 0 }}
          variants={{ hover: { opacity: 1 } }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col justify-end p-4 text-white"
        >
            <h3 className="font-bold text-lg leading-tight mb-2">{title}</h3>
            <div className="flex items-center gap-2 text-sm text-amber-400 mb-2">
                <Star className="w-4 h-4 fill-current"/>
                <span>{rating}</span>
                <span className="text-gray-400">&bull;</span>
                <span className="text-gray-400">{releaseYear}</span>
            </div>
            <p className="text-sm text-gray-300 mt-1 line-clamp-3 md:line-clamp-4">
              {item.overview}
            </p>
            <Button size="sm" className="w-full mt-4 bg-primary/90 hover:bg-primary text-primary-foreground font-bold">
                <Play className="mr-2 h-4 w-4 fill-current" /> View
            </Button>
        </motion.div>
         <div className="absolute top-2 right-2 bg-background/80 text-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm group-hover:opacity-0 transition-opacity">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{rating}</span>
        </div>
      </motion.div>
      <div className="mt-2.5">
        <h3 className="font-semibold text-base truncate">{title}</h3>
        <p className="text-sm text-muted-foreground">{releaseYear}</p>
      </div>
    </Link>
  );
}
