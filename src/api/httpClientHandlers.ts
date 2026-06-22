export type HttpClientHandlers = {
    onUnauthorized: (() => void) | null;
    onForbidden: (() => void) | null;
};

export const httpClientHandlers: HttpClientHandlers = {
    onUnauthorized: null,
    onForbidden: null,
};
