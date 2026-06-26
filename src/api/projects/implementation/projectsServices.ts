import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type {
    IProjectsServices,
    ProjectResponse,
    CreateProjectRequest,
    UpdateProjectRequest,
} from '../iProjectsServices';

export const projectsServices: IProjectsServices = {
    async list(params): Promise<ApiResponse<ProjectResponse[]>> {
        const response = await httpClient.get<ApiResponse<ProjectResponse[]>>('/api/projects', { params });
        return response.data;
    },

    async get(id: number): Promise<ApiResponse<ProjectResponse>> {
        const response = await httpClient.get<ApiResponse<ProjectResponse>>(`/api/projects/${id}`);
        return response.data;
    },

    async create(data: CreateProjectRequest): Promise<ApiResponse<ProjectResponse>> {
        const response = await httpClient.post<ApiResponse<ProjectResponse>>('/api/projects', data);
        return response.data;
    },

    async update(id: number, data: UpdateProjectRequest): Promise<ApiResponse<ProjectResponse>> {
        const response = await httpClient.put<ApiResponse<ProjectResponse>>(`/api/projects/${id}`, data);
        return response.data;
    },

    async remove(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/projects/${id}`);
        return response.data;
    },
};
