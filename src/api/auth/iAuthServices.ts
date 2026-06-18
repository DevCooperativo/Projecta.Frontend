export interface SigninRequest {
    email: string;
    password: string;
    profileType: string;
}

export interface SigninResponse {
    token: string;
    id?: number;
    name?: string;
    email?: string;
}

export interface IAuthServices {
    signin(data: SigninRequest): Promise<SigninResponse>;
}
