export type Movie = {
    id: string;
    ranking: number;
    title: string;
    year: number;
    revenue: string;
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