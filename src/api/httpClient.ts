import axios from 'axios';

const TOKEN_KEY = 'projecta_token';

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});


export const TOKEN_KEY_STORAGE = TOKEN_KEY;
