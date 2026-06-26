import type { UserProfileType } from "@/state/userSlice";
import type { ApiResponse } from "../abstractions/apiResponse";

export interface SigninRequest {
    email: string;
    password: string;
}

export interface SigninResponse {
    id: number;
    name: string;
    email: string;
    profileType:UserProfileType
}

export interface MeResponse {
    id: number,
    name: string,
    email: string
    profileType: UserProfileType
}

export interface UpdateMeRequest {
    name?: string;
    birthdate?: string;
    registration?: string;
    telephone?: string;
}

export interface IAuthServices {
    signin(data: SigninRequest): Promise<ApiResponse<SigninResponse>>;
    me(): Promise<ApiResponse<MeResponse>>;
    updateMe(data: UpdateMeRequest): Promise<ApiResponse<MeResponse>>;
    logout(): Promise<ApiResponse<void>>;
}
