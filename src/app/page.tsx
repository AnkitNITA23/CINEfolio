
import { HeroCarousel } from '@/components/cinefolio/hero-carousel';
import { MovieScrollSection } from '@/components/cinefolio/movie-scroll-section';
import { ArticleSection } from '@/components/cinefolio/article-section';
import { getPopular, getTopRated, getTrending } from '@/lib/tmdb';

export default async function HomePage() {
  const trending = await getTrending('week');
  const topRatedMovies = await getTopRated('movie');
  const popularMovies = await getPopular('movie');
  const popularSeries = await getPopular('tv');

  return (
    <div className="flex flex-col space-y-16 overflow-x-hidden">
      <HeroCarousel items={trending.results.slice(0, 5)} />
      <div className="container space-y-16 pb-16">
        <MovieScrollSection title="Trending This Week" items={trending.results} />
        <ArticleSection />
        <MovieScrollSection title="Top Rated Movies" items={topRatedMovies.results} />
        <MovieScrollSection title="Popular Movies" items={popularMovies.results} />
        <MovieScrollSection title="Popular TV Shows" items={popularSeries.results} />
      </div>
    </div>
  );
}
