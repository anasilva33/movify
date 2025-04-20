import { apiClient } from './apiClient';

export const realApi = {
    getById: (id: string) => apiClient.get(`/movies/${id}`),
    getPagedList: (page: number, size: number) =>
        apiClient.get(`/movies?page=${page}&size=${size}`),
};