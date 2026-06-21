import type { ApiResponse } from './apiResponse';

const isApiResponse = <T>(payload: ApiResponse<T> | T): payload is ApiResponse<T> => {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
    return 'type' in payload && 'code' in payload && 'message' in payload && 'name' in payload;
};

export const normalizeApiResponse = <T>(
    payload: ApiResponse<T> | T,
    code = 200,
): ApiResponse<T> => {
    if (isApiResponse(payload)) return payload;

    return {
        message: 'Operação realizada com sucesso.',
        type: 'success',
        code,
        name: 'SUCCESS',
        data: payload,
    };
};
