import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { normalizeApiResponse } from '@/api/abstractions/normalizeApiResponse';
import { httpClient } from '../../httpClient';
import type { IProjectCategoriesServices, ProjectCategoryRequest, ProjectCategoryResponse } from '../iProjectCategoriesServices';

export const projectCategoriesServices: IProjectCategoriesServices = {
    async list(): Promise<ApiResponse<ProjectCategoryResponse[]>> {
        const response = await httpClient.get<ApiResponse<ProjectCategoryResponse[]>>('/api/projectCategories');
        return normalizeApiResponse(response.data);
    },
    async get(id: number): Promise<ApiResponse<ProjectCategoryResponse>> {
        const response = await httpClient.get<ApiResponse<ProjectCategoryResponse>>(`/api/projectCategories/${id}`);
        return normalizeApiResponse(response.data);
    },
    async create(data: ProjectCategoryRequest): Promise<ApiResponse<ProjectCategoryResponse>> {
        const response = await httpClient.post<ApiResponse<ProjectCategoryResponse>>('/api/projectCategories', data);
        return normalizeApiResponse(response.data, 201);
    },
    async update(id: number, data: ProjectCategoryRequest): Promise<ApiResponse<ProjectCategoryResponse>> {
        const response = await httpClient.put<ApiResponse<ProjectCategoryResponse>>(`/api/projectCategories/${id}`, data);
        return normalizeApiResponse(response.data);
    },
    async remove(id: number): Promise<ApiResponse<void>> {
        const response = await httpClient.delete<ApiResponse<void>>(`/api/projectCategories/${id}`);
        return normalizeApiResponse(response.data);
    },
};
