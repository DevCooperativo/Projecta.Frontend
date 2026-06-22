import axios from 'axios';
import { httpClientHandlers } from './httpClientHandlers';
import { notifyApiResponse } from './notify';

const TOKEN_KEY = 'projecta_token';

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

httpClient.interceptors.response.use(
    (response) => {
        if (response.config.method?.toUpperCase() !== 'GET') {
            notifyApiResponse(response.data);
        }
        return response;
    },
    (error) => {
        if (error.config?.method?.toUpperCase() !== 'GET') {
            notifyApiResponse(error.response?.data);
        }

        const status: number | undefined = error.response?.status;

        if (status === 401) {
            httpClientHandlers.onUnauthorized?.();
        } else if (status === 403) {
            httpClientHandlers.onForbidden?.();
        }

        return Promise.reject(error);
    }
);

export const TOKEN_KEY_STORAGE = TOKEN_KEY;
