'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MovieCard } from '@/components/cinefolio/movie-card';
import { genres as allGenres } from '@/lib/data';
import type { ContentItem } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { discover, search } from '@/lib/tmdb';
import { useDebounce } from 'use-debounce';
import { Skeleton } from '@/components/ui/skeleton';

const allYears = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() - i
);

export default function DiscoverPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(true);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          if (!loading) {
            setPage(prevPage => prevPage + 1);
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  
  // Effect to reset content when filters change
  useEffect(() => {
    setContent([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  }, [debouncedSearchTerm, genre, year, ratingRange]);

  // Effect to fetch data
  useEffect(() => {
    let active = true;
    
    async function fetchData() {
      setLoading(true);

      const fetchPage = page;
      let results: ContentItem[] = [];
      let totalPages = 1;
      
      try {
        if (debouncedSearchTerm) {
          const searchResults = await search(debouncedSearchTerm, fetchPage);
          results = searchResults.results;
          totalPages = searchResults.total_pages;
        } else {
          // Use the discover endpoints when not searching
          const discoverParams = {
            'vote_average.gte': String(ratingRange[0]),
            'vote_average.lte': String(ratingRange[1]),
            with_genres: genre && genre !== 'all' ? genre : undefined,
            primary_release_year: year && year !== 'all' ? year : undefined,
            first_air_date_year: year && year !== 'all' ? year : undefined,
          };
          
          // Fetch from both movie and TV discover endpoints
          const [movieRes, tvRes] = await Promise.all([
            discover('movie', fetchPage, discoverParams),
            discover('tv', fetchPage, discoverParams),
          ]);
          
          results = [...movieRes.results, ...tvRes.results]
            .sort((a, b) => b.popularity - a.popularity)
            .filter(item => item.poster_path);

          totalPages = Math.max(movieRes.total_pages, tvRes.total_pages);
        }

        if (active) {
            setContent(prev => (fetchPage === 1 ? results : [...prev, ...results]));
            setHasMore(fetchPage < totalPages && results.length > 0);
        }
      } catch (error) {
        console.error('Failed to fetch discover data:', error);
        if (active) setHasMore(false);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [debouncedSearchTerm, genre, year, ratingRange, page]);


  return (
    <div className="container py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Discover
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find your next favorite movie or series.
        </p>
      </header>

      <aside className="mb-8 p-6 rounded-lg border bg-card sticky top-20 z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Genre</Label>
            <Select onValueChange={setGenre} value={genre}>
              <SelectTrigger>
                <SelectValue placeholder="Any Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Genre</SelectItem>
                {allGenres.map(g => (
                  <SelectItem key={g.id} value={String(g.id)}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Year</Label>
            <Select onValueChange={setYear} value={year}>
              <SelectTrigger>
                <SelectValue placeholder="Any Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Year</SelectItem>
                {allYears.map(y => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rating-range">
              Rating: {ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)}
            </Label>
            <Slider
              id="rating-range"
              min={0}
              max={10}
              step={0.1}
              value={ratingRange}
              onValueChange={setRatingRange}
            />
          </div>
        </div>
      </aside>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
      >
        <AnimatePresence>
          {content.map((item, index) => {
             if (content.length === index + 1) {
              return (
                <motion.div
                  key={`${item.id}-${index}`}
                  ref={lastElementRef}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <MovieCard item={item} />
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  key={`${item.id}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <MovieCard item={item} />
                </motion.div>
              );
            }
          })}
        </AnimatePresence>
      </motion.div>
       {loading && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

      {!loading && content.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No results found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}

    