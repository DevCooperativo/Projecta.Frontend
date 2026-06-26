import type { ApiResponse } from '../abstractions/apiResponse';

export interface BorrowBorrower {
    id: number;
    name: string;
}

export interface BorrowResponse {
    id: number;
    equipmentId: number;
    equipmentName?: string;
    borrowDate: string;
    student: BorrowBorrower | null;
    professor: BorrowBorrower | null;
    expectedReturnDate?: string;
    completionDate?: string | null;
    isStillBorrowed: boolean;
    notes?: string;
}

export interface CreateBorrowRequest {
    equipmentId: number;
    borrowDate: string;
    studentId?: number;
    professorId?: number;
}

export interface UpdateBorrowRequest {
    equipmentId?: number;
    studentId?: number;
    professorId?: number;
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
    update(id: number, data: UpdateBorrowRequest): Promise<ApiResponse<BorrowResponse>>;
    returnBorrow(id: number): Promise<ApiResponse<void>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
