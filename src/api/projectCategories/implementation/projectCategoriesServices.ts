import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type { IProjectCategoriesServices, ProjectCategoryResponse } from '../iProjectCategoriesServices';

export const projectCategoriesServices: IProjectCategoriesServices = {
    async list(): Promise<ApiResponse<ProjectCategoryResponse[]>> {
        const response = await httpClient.get<ApiResponse<ProjectCategoryResponse[]>>('/api/projectCategories');
        return response.data;
    },
};
