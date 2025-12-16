import type { GNewsArticle as Article } from '@/lib/types';
import { cache } from 'react';

const API_URL = 'https://gnews.io/api/v4';

interface NewsApiResponse {
  totalArticles: number;
  articles: Article[];
}

export const getLatestCinemaNews = cache(async (
  keywords = 'cinema OR film OR movie OR bollywood OR hollywood',
  language = 'en',
  max = 4
): Promise<Article[]> => {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GNEWS_API_KEY' || apiKey.startsWith('YOUR_') || apiKey === "") {
    console.warn('GNews API key is missing or is a placeholder. The news section will be disabled.');
    return [];
  }

  const url = new URL(`${API_URL}/search`);
  url.searchParams.append('apikey', apiKey);
  url.searchParams.append('q', keywords);
  url.searchParams.append('lang', language);
  url.searchParams.append('max', String(max));
  url.searchParams.append('sortby', 'publishedAt');

  try {
    const res = await fetch(url.toString());

    if (!res.ok) {
      const errorBody = await res.text(); // Use .text() to avoid JSON parsing errors
      console.error(`GNews API request failed for URL: ${url.toString()}. Status: ${res.status} ${res.statusText}`, errorBody);
      return [];
    }

    const data: NewsApiResponse = await res.json();
    // Filter out articles without a title or image for better UI quality
    return data.articles.filter(article => article.title && article.image);
  } catch (error) {
    console.error('Failed to fetch news data:', error);
    return [];
  }
});
