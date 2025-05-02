import { Movie } from '../types/movieTypes';
import { apiClient } from './apiClient';

export const realApi = {
    getById: (id: string) => apiClient.get(`/movies/${id}`),
    getPagedList: (page: number, size: number) =>
        apiClient.get(`/movies?page=${page}&size=${size}`),
    getByYear: (year: number): Promise<{ data: Movie[] }> =>
        apiClient.get(`/movies?start=${year}&end=${year}`),
    getAll: () => apiClient.get('/movies'),
};