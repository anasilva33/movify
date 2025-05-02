import { Movie } from '../types/movieTypes';

export function getTop10ByRevenue(movies: Movie[]): Movie[] {
    return [...movies]
        .sort((a, b) => {
            const revenueA = a.revenue ?? -1;
            const revenueB = b.revenue ?? -1;

            if (revenueA === revenueB) {
                return a.title.localeCompare(b.title);
            }
            return revenueB - revenueA;
        })
        .slice(0, 10);
}