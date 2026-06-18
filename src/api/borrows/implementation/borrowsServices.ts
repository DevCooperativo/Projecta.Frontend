import { httpClient } from '../../httpClient';
import type {
    IBorrowsServices,
    BorrowResponse,
    CreateBorrowRequest,
    ListBorrowsParams,
} from '../iBorrowsServices';

export const borrowsServices: IBorrowsServices = {
    async list(params?: ListBorrowsParams): Promise<BorrowResponse[]> {
        const response = await httpClient.get<BorrowResponse[]>('/api/borrow', { params });
        return response.data;
    },

    async get(id: number): Promise<BorrowResponse> {
        const response = await httpClient.get<BorrowResponse>(`/api/borrow/${id}`);
        return response.data;
    },

    async create(data: CreateBorrowRequest): Promise<BorrowResponse> {
        const response = await httpClient.post<BorrowResponse>('/api/borrow', data);
        return response.data;
    },

    async update(id: number, data: { equipmentId: number }): Promise<BorrowResponse> {
        const response = await httpClient.put<BorrowResponse>(`/api/borrow/${id}`, data);
        return response.data;
    },

    async returnBorrow(id: number): Promise<void> {
        await httpClient.post(`/api/borrow/return/${id}`);
    },

    async remove(id: number): Promise<void> {
        await httpClient.delete(`/api/borrow/${id}`);
    },
};
