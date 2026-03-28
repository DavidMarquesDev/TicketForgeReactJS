export type ApiSuccessDirect = {
    success: true;
    id?: number;
    token?: string;
};

export type ApiSuccessEnvelope<TData> = {
    success: true;
    data: TData;
    meta?: PaginationMeta;
};

export type ApiError = {
    success: false;
    message: string;
    code: string;
    errors?: Record<string, unknown>;
    trace_id?: string;
};

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type ApiResponse<TData> = ApiSuccessDirect | ApiSuccessEnvelope<TData> | ApiError;
