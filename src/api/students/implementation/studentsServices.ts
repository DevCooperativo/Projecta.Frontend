import { httpClient } from '../../httpClient';
import type {
    IStudentsServices,
    StudentResponse,
    CreateStudentRequest,
    UpdateStudentRequest,
} from '../iStudentsServices';

export const studentsServices: IStudentsServices = {
    async list(): Promise<StudentResponse[]> {
        const response = await httpClient.get<StudentResponse[]>('/api/students');
        return response.data;
    },

    async get(id: number): Promise<StudentResponse> {
        const response = await httpClient.get<StudentResponse>(`/api/students/${id}`);
        return response.data;
    },

    async create(data: CreateStudentRequest): Promise<StudentResponse> {
        const response = await httpClient.post<StudentResponse>('/api/students', data);
        return response.data;
    },

    async update(id: number, data: UpdateStudentRequest): Promise<StudentResponse> {
        const response = await httpClient.put<StudentResponse>(`/api/students/${id}`, data);
        return response.data;
    },

    async remove(id: number): Promise<void> {
        await httpClient.delete(`/api/students/${id}`);
    },
};
