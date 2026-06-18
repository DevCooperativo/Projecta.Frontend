export interface AdministratorResponse {
    id: number;
    email: string;
    name?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAdministratorRequest {
    email: string;
    password: string;
}

export interface UpdateAdministratorRequest {
    email?: string;
}

export interface IAdministratorsServices {
    list(): Promise<AdministratorResponse[]>;
    get(id: number): Promise<AdministratorResponse>;
    create(data: CreateAdministratorRequest): Promise<AdministratorResponse>;
    update(id: number, data: UpdateAdministratorRequest): Promise<AdministratorResponse>;
    remove(id: number): Promise<void>;
}
