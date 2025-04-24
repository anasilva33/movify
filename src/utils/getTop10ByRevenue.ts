import { Movie } from '../types/movieTable';

// export function getTop10ByRevenue(movies: Movie[]): Movie[] {
//     return [...movies]
//         .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
//         .slice(0, 10);
// }

export function getTop10ByRevenue(movies: Movie[]): Movie[] {
    return [...movies]
        .sort((a, b) => {
            const revenueA = a.revenue ?? -1;
            const revenueB = b.revenue ?? -1;

            if (revenueA === revenueB) {
                return a.title.localeCompare(b.title);
            }

            // Coloca os null (convertidos para -1) no fim, ordenando normalmente os restantes
            return revenueB - revenueA;
        })
        .slice(0, 10);
}