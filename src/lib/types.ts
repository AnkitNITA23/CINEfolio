
export interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: { id: number; name: string }[];
  genre_ids?: number[];
}

export interface Movie extends ContentItem {
  media_type: 'movie';
  title: string;
  release_date: string;
  runtime?: number;
}

export interface Series extends ContentItem {
  media_type: 'tv';
  name: string;
  first_air_date: string;
  number_of_seasons?: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string;
}

export interface MovieDetails extends Movie {
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos: {
    results: Video[];
  };
}

export interface SeriesDetails extends Series {
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos: {
    results: Video[];
  };
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}


export interface User {
  name: string;
  avatarUrl: string;
  stats: {
    moviesWatched: number;
    watchlistCount: number;
    favoriteGenres: { genre: string; count: number }[];
  };
  watchlist: ContentItem[];
  watchedHistory: ContentItem[];
  likedTitles: ContentItem[];
}

export interface Genre {
    id: number;
    name: string;
}

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface Article extends GNewsArticle {}
