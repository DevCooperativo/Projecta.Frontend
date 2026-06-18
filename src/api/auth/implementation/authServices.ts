import { httpClient } from '../../httpClient';
import type { IAuthServices, SigninRequest, SigninResponse } from '../iAuthServices';

export const authServices: IAuthServices = {
    async signin(data: SigninRequest): Promise<SigninResponse> {
        const response = await httpClient.post<SigninResponse>('/api/auth/signin', data);
        return response.data;
    },
};
