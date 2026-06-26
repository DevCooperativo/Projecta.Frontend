import type { ApiResponse } from '../abstractions/apiResponse';

export interface ProjectResponse {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    status: string;
    laboratoryId: number;
    projectCategoryId: number;
    participantCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CoordinatorInput {
    area: string;
    startDate: string;
    endDate?: string;
    professorId: number;
}

export interface ResearcherInput {
    name: string;
    functionName: string;
    weeklyHours: number;
    startDate: string;
    endDate?: string;
    professorId?: number;
    studentId?: number;
}

export interface CreateProjectRequest {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    status: string;
    laboratoryId: number;
    projectCategoryId: number;
    coordinators: CoordinatorInput[];
    researchers?: ResearcherInput[];
}

export interface UpdateProjectRequest {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    status: string;
    laboratoryId: number;
    projectCategoryId: number;
}

export interface IProjectsServices {
    list(params?: { categoryId?: number; laboratoryId?: number; name?: string }): Promise<ApiResponse<ProjectResponse[]>>;
    get(id: number): Promise<ApiResponse<ProjectResponse>>;
    create(data: CreateProjectRequest): Promise<ApiResponse<ProjectResponse>>;
    update(id: number, data: UpdateProjectRequest): Promise<ApiResponse<ProjectResponse>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
