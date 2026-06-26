import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type {
    IBorrowsServices,
    BorrowResponse,
    CreateBorrowRequest,
    UpdateBorrowRequest,
    ListBorrowsParams,
} from '../iBorrowsServices';

export const borrowsServices: IBorrowsServices = {
    async list(params?: ListBorrowsParams): Promise<ApiResponse<BorrowResponse[]>> {
        const response = await httpClient.get<ApiResponse<BorrowResponse[]>>('/api/borrow', { params });
        return response.data;
    },

    async get(id: number): Promise<ApiResponse<BorrowResponse>> {
        const response = await httpClient.get<ApiResponse<BorrowResponse>>(`/api/borrow/${id}`);
        return response.data;
    },

    async create(data: CreateBorrowRequest): Promise<ApiResponse<BorrowResponse>> {
        const response = await httpClient.post<ApiResponse<BorrowResponse>>('/api/borrow', data);
        return response.data;
    },

    async update(id: number, data: UpdateBorrowRequest): Promise<ApiResponse<BorrowResponse>> {
        const response = await httpClient.put<ApiResponse<BorrowResponse>>(`/api/borrow/${id}`, data);
        return response.data;
    },

    async returnBorrow(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.post<ApiResponse<void>>(`/api/borrow/return/${id}`);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/borrow/${id}`);
        return response.data;
    },
};
