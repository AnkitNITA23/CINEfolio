import type { ContentItem, MovieDetails, SeriesDetails } from '@/lib/types';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = 'https://api.themoviedb.org/3';

interface PaginatedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

const emptyPaginatedResponse = {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
};

async function fetcher(path: string, params: Record<string, string | undefined> = {}) {
  // Gracefully handle missing API key
  if (!API_KEY || API_KEY === 'YOUR_TMDB_API_KEY' || API_KEY.startsWith('YOUR_')) {
    console.warn('TMDB API key is missing or is a placeholder. API calls will be skipped.');
    // Return a default empty response structure that matches what the API would return
    if (path.includes('/trending') || path.includes('/top_rated') || path.includes('/popular') || path.includes('/search') || path.includes('/discover')) {
      return emptyPaginatedResponse;
    }
    // For details, return null to trigger a 404 or empty state downstream
    if (path.includes('/movie/') || path.includes('/tv/')) {
      return null;
    }
    return { genres: [] }; // For genres
  }

  const url = new URL(`${API_URL}${path}`);
  url.searchParams.append('api_key', API_KEY!);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
        url.searchParams.append(key, value);
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error(`API request failed for path: ${path}`, await res.text());
    // Instead of throwing, return a consistent empty state to prevent app crashes
    if (path.includes('/trending') || path.includes('/top_rated') || path.includes('/popular') || path.includes('/search') || path.includes('/discover')) {
      return emptyPaginatedResponse;
    }
     if (path.includes('/movie/') || path.includes('/tv/')) {
      return null;
    }
    return { results: [] };
  }
  return res.json();
}

export function getImageUrl(path: string | undefined | null, size: 'w500' | 'original' = 'w500') {
  if (!path) {
    return '/placeholder.png'; // Provide a placeholder image path
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function getTrending(timeWindow: 'day' | 'week', page: number = 1): Promise<PaginatedResponse<ContentItem>> {
  const data = await fetcher(`/trending/all/${timeWindow}`, { page: String(page) });
  return data;
}

export async function getTopRated(type: 'movie' | 'tv', page: number = 1): Promise<PaginatedResponse<ContentItem>> {
  const data = await fetcher(`/${type}/top_rated`, { page: String(page) });
  if (data.results) {
    data.results = data.results.map((item: any) => ({ ...item, media_type: type }));
  }
  return data;
}

export async function getPopular(type: 'movie' | 'tv', page: number = 1): Promise<PaginatedResponse<ContentItem>> {
  const data = await fetcher(`/${type}/popular`, { page: String(page) });
   if (data.results) {
    data.results = data.results.map((item: any) => ({ ...item, media_type: type }));
  }
  return data;
}

export async function getDetails(mediaType: 'movie' | 'tv', id: string): Promise<MovieDetails | SeriesDetails | null> {
  const data = await fetcher(`/${mediaType}/${id}`, { append_to_response: 'videos,credits' });
  if (!data) return null;
  return { ...data, media_type: mediaType };
}

export async function getSimilar(mediaType: 'movie' | 'tv', id: string): Promise<ContentItem[]> {
  const data = await fetcher(`/${mediaType}/${id}/similar`);
  return data.results.map((item: any) => ({ ...item, media_type: mediaType }));
}

export async function search(query: string, page: number = 1): Promise<PaginatedResponse<ContentItem>> {
  const data = await fetcher('/search/multi', { query, page: String(page) });
  if (data.results) {
    data.results = data.results.filter((item: any) => (item.media_type === 'movie' || item.media_type === 'tv'));
  }
  return data;
}

export async function discover(
  mediaType: 'movie' | 'tv',
  page: number = 1,
  filters: Record<string, string | undefined> = {}
): Promise<PaginatedResponse<ContentItem>> {
  const data = await fetcher(`/discover/${mediaType}`, { page: String(page), ...filters });
  if (data.results) {
    data.results = data.results.map((item: any) => ({ ...item, media_type: mediaType }));
  }
  return data;
}

export async function getGenres(): Promise<{id: number, name: string}[]> {
    const data = await fetcher('/genre/movie/list');
    const dataTv = await fetcher('/genre/tv/list');
    if (!data.genres || !dataTv.genres) return [];
    const all = [...data.genres, ...dataTv.genres];
    const uniqueGenres = all.filter(
      (genre, index, self) => index === self.findIndex(g => g.id === genre.id)
    );
    return uniqueGenres;
}
