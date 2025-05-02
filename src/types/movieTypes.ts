export type Movie = {
    id: string;
    rank: number;
    title: string;
    year: number;
    revenue: number;
};

export type MovieDetails = {
    id: string;
    title: string;
    year: number;
    rank: number;
    revenue: number;
    genre: string;
    description: string;
    director: string;
    actors: string;
    runtime: number;
    rating: number;
    votes: number;
    metascore: number;
};

export type ActiveStateType = 'all' | 'top10' | 'top10ByYear' | null;

export type ActiveFilters = { activeFilter: ActiveStateType, year?: number | null };

export type MovieTableProps = {
    posts: Movie[];
    error: string;
    hasMore: boolean;
    isFetching: boolean;
    loadNextPage: Function;
};

export type FilterProps = {
    filters: ActiveFilters;
    updateFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
};

export type loadMoviesForPageProps = {
    page: number;
    isFetching: boolean;
    setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
    posts: Movie[];
    setPosts: React.Dispatch<React.SetStateAction<Movie[]>>;
};
