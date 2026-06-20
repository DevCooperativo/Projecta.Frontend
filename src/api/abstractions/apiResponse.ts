export interface ApiResponse<T> {
    message: string
    type: 'success' | 'info' | 'warn' | 'error'
    code: number
    name: string
    data?: T
    pagination?: PaginationMeta
    details?: ResponseDetail[]
}
interface PaginationMeta {
    total: number
    limit: number
    offset: number
}

interface ResponseDetail {
    field?: string
    reason: string
    acceptableValue?: string
}