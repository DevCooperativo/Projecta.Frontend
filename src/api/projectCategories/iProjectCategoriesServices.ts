import type { ApiResponse } from '../abstractions/apiResponse';

export interface ProjectCategoryResponse {
    id: number;
    name: string;
    area: string;
    description: string;
    commerciallyRelevant: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IProjectCategoriesServices {
    list(): Promise<ApiResponse<ProjectCategoryResponse[]>>;
}
