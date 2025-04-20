import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://movie-challenge-api-xpand.azurewebsites.net/api', // real base URL
    headers: {
        'Content-Type': 'application/json',
    },
});