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
    list(params?: ListBorrowsParams): Promise<BorrowResponse[]>;
    get(id: number): Promise<BorrowResponse>;
    create(data: CreateBorrowRequest): Promise<BorrowResponse>;
    update(id: number, data: { equipmentId: number }): Promise<BorrowResponse>;
    returnBorrow(id: number): Promise<void>;
    remove(id: number): Promise<void>;
}
