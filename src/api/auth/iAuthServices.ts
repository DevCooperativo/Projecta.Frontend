import type { UserProfileType } from "@/state/userSlice";
import type { ApiResponse } from "../abstractions/apiResponse";

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

export interface MeResponse {
    id: number,
    name: string,
    email: string
    profileType: UserProfileType
}

export interface IAuthServices {
    signin(data: SigninRequest): Promise<ApiResponse<SigninResponse>>;
    me(): Promise<ApiResponse<MeResponse>>;
}
