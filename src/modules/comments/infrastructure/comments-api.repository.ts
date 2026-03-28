import { ApiClient, HttpError } from '../../../core/http/api-client';
import { apiClient } from '../../../core/http/api-instance';
import type { PaginationMeta } from '../../../shared/domain/api.types';
import type { Comment } from '../domain/comment.types';
import type { CommentsRepository } from '../application/comments.repository';
import type { CommentListResult } from '../domain/comment.types';

type IdResponse = {
    id: number;
    success: true;
};

const extractId = (response: IdResponse): number => {
    if (!response.success || typeof response.id !== 'number') {
        throw new HttpError(500);
    }
    return response.id;
};

export class CommentsApiRepository implements CommentsRepository
{
    private readonly client: ApiClient;

    constructor(client: ApiClient = apiClient)
    {
        this.client = client;
    }

    public async create(ticketId: number, content: string, idempotencyKey: string): Promise<number>
    {
        const response = await this.client.request<IdResponse>(`/tickets/${ticketId}/comments`, {
            method: 'POST',
            headers: { 'idempotency-key': idempotencyKey },
            body: { content },
        });
        return extractId(response as IdResponse);
    }

    public async list(ticketId: number, page = 1, limit = 20, order: 'ASC' | 'DESC' = 'DESC'): Promise<CommentListResult>
    {
        const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            order,
        });
        const response = await this.client.request<Comment[]>(`/tickets/${ticketId}/comments?${query.toString()}`);

        if ('data' in response && response.success) {
            return {
                items: response.data,
                meta: response.meta as PaginationMeta,
            };
        }

        throw new HttpError(500);
    }

    public async update(ticketId: number, commentId: number, content: string, idempotencyKey: string): Promise<number>
    {
        const response = await this.client.request<IdResponse>(`/tickets/${ticketId}/comments/${commentId}`, {
            method: 'PATCH',
            headers: { 'idempotency-key': idempotencyKey },
            body: { content },
        });
        return extractId(response as IdResponse);
    }

    public async remove(ticketId: number, commentId: number, idempotencyKey: string): Promise<number>
    {
        const response = await this.client.request<IdResponse>(`/tickets/${ticketId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'idempotency-key': idempotencyKey },
        });
        return extractId(response as IdResponse);
    }
}
