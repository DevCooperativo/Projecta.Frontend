import type { ApiResponse } from '../abstractions/apiResponse';

export interface ResearcherResponse {
    id: number;
    name: string;
    functionName: string;
    weeklyHours: number;
    startDate: string;
    endDate?: string;
    projectId: number;
    studentId?: number;
    professorId?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateResearcherRequest {
    name: string;
    functionName: string;
    weeklyHours: number;
    startDate: string;
    endDate?: string;
    projectId: number;
    studentId?: number;
    professorId?: number;
}

export interface UpdateResearcherRequest {
    name: string;
    functionName: string;
    weeklyHours: number;
    startDate: string;
    endDate?: string;
    projectId: number;
    studentId?: number;
    professorId?: number;
}

export interface IResearchersServices {
    list(): Promise<ApiResponse<ResearcherResponse[]>>;
    get(id: number): Promise<ApiResponse<ResearcherResponse>>;
    create(data: CreateResearcherRequest): Promise<ApiResponse<ResearcherResponse>>;
    update(id: number, data: UpdateResearcherRequest): Promise<ApiResponse<ResearcherResponse>>;
    remove(id: number): Promise<ApiResponse<void>>;
}
