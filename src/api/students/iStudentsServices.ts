export interface StudentResponse {
    id: number;
    name: string;
    email: string;
    registration: string;
    birthdate: string;
    term: number;
    shift: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStudentRequest {
    name: string;
    email: string;
    registration: string;
    password: string;
    birthdate: string;
    term: number;
    shift: string;
}

export interface UpdateStudentRequest {
    name?: string;
    email?: string;
    registration?: string;
    birthdate?: string;
    term?: number;
    shift?: string;
}

export interface IStudentsServices {
    list(): Promise<StudentResponse[]>;
    get(id: number): Promise<StudentResponse>;
    create(data: CreateStudentRequest): Promise<StudentResponse>;
    update(id: number, data: UpdateStudentRequest): Promise<StudentResponse>;
    remove(id: number): Promise<void>;
}
