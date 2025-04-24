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

export type MovieTableProps = {
    posts: Movie[];
    setPosts: React.Dispatch<React.SetStateAction<Movie[]>>;
    activeState: ActiveStateType;
    error: string;
};

export type FilterProps = {
    posts: Movie[];
    setPosts: React.Dispatch<React.SetStateAction<Movie[]>>;
    activeState: ActiveStateType;
    setActiveState: React.Dispatch<React.SetStateAction<ActiveStateType>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
};
