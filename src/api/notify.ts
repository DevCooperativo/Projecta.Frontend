import { toast } from 'react-toastify';
import type { ApiResponse } from './abstractions/apiResponse';

const isApiEnvelope = (data: unknown): data is ApiResponse<unknown> => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    return 'type' in data && 'message' in data;
};

const buildMessage = (response: ApiResponse<unknown>): string => {
    if (!response.details?.length) return response.message;
    const lines = response.details.map(d =>
        d.field ? `${d.field}: ${d.reason}` : d.reason
    );
    return `${response.message}\n${lines.join('\n')}`;
};

export const notifyApiResponse = (data: unknown): void => {
    if (!isApiEnvelope(data)) return;
    const message = buildMessage(data);
    switch (data.type) {
        case 'success': toast.success(message); break;
        case 'info':    toast.info(message);    break;
        case 'warn':    toast.warning(message); break;
        case 'error':   toast.error(message);   break;
    }
};
