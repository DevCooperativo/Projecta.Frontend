import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type {
    IStudentsServices,
    StudentResponse,
    CreateStudentRequest,
    UpdateStudentRequest,
} from '../iStudentsServices';

export const studentsServices: IStudentsServices = {
    async list(): Promise<ApiResponse<StudentResponse[]>> {
        const response = await httpClient.get<ApiResponse<StudentResponse[]>>('/api/students');
        return response.data;
    },

    async get(id: number): Promise<ApiResponse<StudentResponse>> {
        const response = await httpClient.get<ApiResponse<StudentResponse>>(`/api/students/${id}`);
        return response.data;
    },

    async create(data: CreateStudentRequest): Promise<ApiResponse<StudentResponse>> {
        const response = await httpClient.post<ApiResponse<StudentResponse>>('/api/students', data);
        return response.data;
    },

    async update(id: number, data: UpdateStudentRequest): Promise<ApiResponse<StudentResponse>> {
        const response = await httpClient.put<ApiResponse<StudentResponse>>(`/api/students/${id}`, data);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/students/${id}`);
        return response.data;
    },
};
