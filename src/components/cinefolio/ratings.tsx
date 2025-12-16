import { Star } from 'lucide-react';
import { ImdbIcon, RottenTomatoesIcon, TmdbIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface RatingsProps {
  ratings: {
    imdb: number;
    rottenTomatoes: number;
    tmdb: number;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function Ratings({ ratings, size = 'md' }: RatingsProps) {
  const sizeClasses = {
    sm: { wrapper: 'gap-2', icon: 'h-5 w-auto', text: 'text-sm font-semibold' },
    md: { wrapper: 'gap-4', icon: 'h-6 w-auto', text: 'text-base font-bold' },
    lg: { wrapper: 'gap-6', icon: 'h-8 w-auto', text: 'text-lg font-extrabold' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn('flex items-center', currentSize.wrapper)}>
      <div className="flex items-center gap-1.5" title="IMDb Rating">
        <ImdbIcon className={cn(currentSize.icon, 'h-5')} />
        <span className={currentSize.text}>{ratings.imdb.toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-1.5" title="Rotten Tomatoes Score">
        <RottenTomatoesIcon className={currentSize.icon} />
        <span className={currentSize.text}>{Math.round(ratings.rottenTomatoes)}%</span>
      </div>
      <div className="flex items-center gap-1.5" title="TMDB Score">
        <TmdbIcon className={currentSize.icon} />
        <span className={currentSize.text}>{ratings.tmdb.toFixed(1)}</span>
      </div>
    </div>
  );
}
