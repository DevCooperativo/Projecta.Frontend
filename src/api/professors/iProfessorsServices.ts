export interface ProfessorResponse {
    id: number;
    name: string;
    email: string;
    registration: string;
    telephone: string;
    coordinationId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProfessorRequest {
    name: string;
    email: string;
    registration: string;
    telephone: string;
    coordinationId: number;
}

export interface UpdateProfessorRequest {
    name?: string;
    registration?: string;
    telephone?: string;
}

export interface IProfessorsServices {
    list(): Promise<ProfessorResponse[]>;
    get(id: number): Promise<ProfessorResponse>;
    create(data: CreateProfessorRequest): Promise<ProfessorResponse>;
    update(id: number, data: UpdateProfessorRequest): Promise<ProfessorResponse>;
    changeCoordination(coordinationId: number): Promise<void>;
    remove(id: number): Promise<void>;
}
