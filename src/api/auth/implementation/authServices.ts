import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { httpClient } from '../../httpClient';
import type { MeResponse, IAuthServices, SigninRequest, SigninResponse, UpdateMeRequest } from '../iAuthServices';

export const authServices: IAuthServices = {
    async signin(data: SigninRequest): Promise<ApiResponse<SigninResponse>> {
        const response = await httpClient.post<ApiResponse<SigninResponse>>('/api/auth/signin', data);
        return response.data;
    },
    async me(): Promise<ApiResponse<MeResponse>> {
        const response = await httpClient.get<ApiResponse<MeResponse>>("/api/auth/me").catch(ex => { throw ex })
        return response.data
    },
    async updateMe(data: UpdateMeRequest): Promise<ApiResponse<MeResponse>> {
        const response = await httpClient.put<ApiResponse<MeResponse>>('/api/auth/me', data).catch(ex => { throw ex });
        return response.data;
    },
    async logout(): Promise<ApiResponse<void>> {
        const response = await httpClient.post<ApiResponse<void>>("/api/auth/logout").catch(ex => { throw ex })
        return response.data
    },
};
