export interface Coordination {
    id: number;
    name: string;
    acronym: string;
    block: string;
    status: 'active' | 'inactive';
    professorCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Professor {
    id: number;
    name: string;
    email: string;
    registration: string;
    coordinationId: number;
    lattes?: string;
    status: 'active' | 'inactive';
    projectCount: number;
    borrowCount: number;
    labCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    registration: string;
    course: string;
    lattes?: string;
    status: 'active' | 'inactive';
    projectCount: number;
    borrowCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Equipment {
    id: number;
    name: string;
    category: string;
    laboratory: string;
}

export interface Borrow {
    id: number;
    equipmentId: number;
    equipmentName: string;
    borrowerType: 'professor' | 'student';
    borrowerId: number;
    borrowerName: string;
    startDate: string;
    expectedReturnDate: string;
    completionDate: string | null;
    status: 'pending' | 'completed';
    notes: string;
}

export interface Admin {
    name: string;
    email: string;
    role: string;
    phone: string;
    updatedAt: string;
}

export interface RemoveResult {
    allowed: boolean;
    reason?: string;
}
