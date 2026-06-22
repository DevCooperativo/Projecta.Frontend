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

export const KNOWLEDGE_AREAS = [
    'Ciências Exatas e da Terra',
    'Ciências Biológicas',
    'Engenharias',
    'Ciências da Saúde',
    'Ciências Agrárias',
    'Ciências Sociais Aplicadas',
    'Ciências Humanas',
    'Linguística, Letras e Artes',
] as const;

export interface ProjectCategoryRequest {
    name: string;
    area: string;
    description: string;
    commerciallyRelevant: boolean;
}

export interface IProjectCategoriesServices {
    list(): Promise<ApiResponse<ProjectCategoryResponse[]>>;
    get(id: number): Promise<ApiResponse<ProjectCategoryResponse>>;
    create(data: ProjectCategoryRequest): Promise<ApiResponse<ProjectCategoryResponse>>;
    update(id: number, data: ProjectCategoryRequest): Promise<ApiResponse<ProjectCategoryResponse>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
