import type { ApiResponse } from '../abstractions/apiResponse';

export interface BorrowResponse {
    id: number;
    equipmentId: number;
    equipmentName?: string;
    borrowDate: string;
    borrowerType?: 'professor' | 'student';
    borrowerId?: number;
    borrowerName?: string;
    expectedReturnDate?: string;
    completionDate?: string | null;
    status: 'pending' | 'completed';
    notes?: string;
}

export interface CreateBorrowRequest {
    equipmentId: number;
    borrowDate: string;
}

export interface ListBorrowsParams {
    borrowerId?: number;
    borrowerType?: string;
    startPeriod?: string;
    endPeriod?: string;
}

export interface IBorrowsServices {
    list(params?: ListBorrowsParams): Promise<ApiResponse<BorrowResponse[]>>;
    get(id: number): Promise<ApiResponse<BorrowResponse>>;
    create(data: CreateBorrowRequest): Promise<ApiResponse<BorrowResponse>>;
    update(id: number, data: { equipmentId: number }): Promise<ApiResponse<BorrowResponse>>;
    returnBorrow(id: number): Promise<ApiResponse<void>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
