
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDetails, getImageUrl, getSimilar } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Tv } from 'lucide-react';
import { MovieScrollSection } from '@/components/cinefolio/movie-scroll-section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { SeriesDetails } from '@/lib/types';
import { Ratings } from '@/components/cinefolio/ratings';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ActionButtons } from '@/components/cinefolio/action-buttons';


type SeriesPageProps = {
  params: {
    id: string;
  };
};

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { id } = params;
  const item = await getDetails('tv', id);

  if (!item) {
    notFound();
  }

  const relatedContent = await getSimilar('tv', id);
  const trailer = item.videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <article>
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[70vh] w-full">
         <div className="absolute inset-0">
             <Image
                src={getImageUrl(item.backdrop_path, 'original')}
                alt={`Banner for ${item.name}`}
                fill
                className="object-cover object-center"
                priority
                data-ai-hint="movie scene background"
            />
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-background via-background/50 to-transparent" />
         </div>
      </div>
        
      {/* Main Content */}
      <div className="container -mt-[25vh] pb-12">
        <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 items-start">
            {/* Left Rail (Poster & Actions) */}
            <aside className="md:col-span-1 space-y-6 sticky top-24">
                <AspectRatio ratio={2/3} className="overflow-hidden rounded-xl shadow-2xl bg-muted">
                     {trailer ? (
                         <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}&controls=0&showinfo=0&autohide=1`}
                            title={`${item.name} Trailer`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    ) : (
                        <Image
                            src={getImageUrl(item.poster_path, 'w500')}
                            alt={`Poster for ${item.name}`}
                            fill
                            className="object-cover"
                            data-ai-hint="movie poster"
                        />
                    )}
                </AspectRatio>
                <ActionButtons item={item} />
            </aside>
            
            {/* Right Rail (Details) */}
            <main className="md:col-span-2 lg:col-span-3 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">{item.name}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/><span>{new Date(item.first_air_date || '').getFullYear()}</span></div>
                         <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-2"><Tv className="h-4 w-4"/><span>{(item as SeriesDetails).number_of_seasons} Seasons</span></div>
                         <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-2"><Tv className="h-4 w-4"/><span>TV Series</span></div>
                    </div>
                     <div className="flex flex-wrap gap-2">
                        {item.genres.map((genre) => (
                            <div key={genre.id} className="text-xs border px-3 py-1 rounded-full">{genre.name}</div>
                        ))}
                    </div>
                </div>
                
                <p className="text-lg text-muted-foreground max-w-prose">{item.overview}</p>

                <div className="pt-4">
                    <h3 className="text-xl font-bold mb-4">Ratings</h3>
                    <Ratings ratings={{
                      imdb: item.vote_average,
                      rottenTomatoes: (item.vote_average * 10),
                      tmdb: item.vote_average
                    }} />
                </div>

                <Separator />
                
                {/* Cast & Crew */}
                {item.credits.cast.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Top Billed Cast</h2>
                        <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
                            <CarouselContent className="-ml-4">
                                {item.credits.cast.slice(0, 15).map(member => (
                                     <CarouselItem key={member.id} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 pl-4">
                                        <div className="text-center">
                                            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 mx-auto mb-2 shadow-md">
                                                <AvatarImage src={getImageUrl(member.profile_path, 'w500')} alt={member.name} data-ai-hint="actor portrait"/>
                                                <AvatarFallback>{member.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <p className="font-semibold text-sm">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.character}</p>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
                            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
                        </Carousel>
                    </div>
                )}

                <Separator />
                
                {/* Related & Similar */}
                {relatedContent && relatedContent.length > 0 && (
                    <div className="pt-8">
                         <MovieScrollSection title="More Like This" items={relatedContent} />
                    </div>
                )}
            </main>
        </div>
      </div>
    </article>
  );
}
