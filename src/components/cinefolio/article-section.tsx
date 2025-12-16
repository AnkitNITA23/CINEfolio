import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Article } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { getLatestCinemaNews } from '@/lib/news';
import { format, parseISO } from 'date-fns';
import { Suspense } from 'react';

const ArticleCard = ({
  article,
  large = false,
}: {
  article: Article;
  large?: boolean;
}) => {
  if (!article.title) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Recently';
    }
  };

  const articleUrl = article.url;

  if (large) {
    return (
      <Link
        href={articleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-2xl rounded-xl">
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <img
                src={
                  article.image ||
                  `https://picsum.photos/seed/${article.title}/600/400`
                }
                alt={article.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint="cinema news"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-sm text-white/80">{`${
                  article.source.name
                } • ${formatDate(article.publishedAt)}`}</p>
                <h3 className="mt-2 text-2xl font-bold leading-tight text-white group-hover:underline">
                  {article.title}
                </h3>
              </div>
            </div>
            <div className="p-6 pt-4">
              <p className="text-muted-foreground line-clamp-3">
                {article.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href={articleUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl rounded-xl">
        <CardContent className="flex gap-5 p-4">
          <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={
                article.image ||
                `https://picsum.photos/seed/${article.title}/200/200`
              }
              alt={article.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              data-ai-hint="cinema article"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs text-muted-foreground">{`${
              article.source.name
            } • ${formatDate(article.publishedAt)}`}</p>
            <h4 className="mt-1 font-semibold leading-tight text-foreground group-hover:underline line-clamp-3">
              {article.title}
            </h4>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

async function NewsContent() {
  const articles = await getLatestCinemaNews();

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-20 bg-card border rounded-lg">
        <p className="text-muted-foreground">
          No articles available at the moment.
        </p>
      </div>
    );
  }

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {mainArticle && <ArticleCard article={mainArticle} large />}
      <div className="space-y-6">
        {sideArticles.map(article => (
          <ArticleCard key={article.url} article={article} />
        ))}
      </div>
    </div>
  );
}

export function ArticleSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">In the Spotlight</h2>
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'hidden md:inline-flex'
          )}
        >
          View All Articles
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
      <Suspense fallback={<p>Loading news...</p>}>
        <NewsContent />
      </Suspense>
    </section>
  );
}
