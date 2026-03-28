import { ApiClient, HttpError } from '../../../core/http/api-client';
import { apiClient } from '../../../core/http/api-instance';
import type { PaginationMeta } from '../../../shared/domain/api.types';
import type { TicketsRepository } from '../application/tickets.repository';
import type { GetTicketsFilters, Ticket, TicketListResult, TicketStatus } from '../domain/ticket.types';

type IdResponse = {
    id: number;
    success: true;
};

const buildQueryString = (filters: GetTicketsFilters): string => {
    const query = new URLSearchParams();
    if (filters.status) {
        query.set('status', filters.status);
    }
    if (typeof filters.assigneeId === 'number') {
        query.set('assigneeId', filters.assigneeId.toString());
    }
    if (typeof filters.page === 'number') {
        query.set('page', filters.page.toString());
    }
    if (typeof filters.limit === 'number') {
        query.set('limit', filters.limit.toString());
    }
    if (filters.sortBy) {
        query.set('sortBy', filters.sortBy);
    }
    if (filters.order) {
        query.set('order', filters.order);
    }
    const queryString = query.toString();
    return queryString.length > 0 ? `?${queryString}` : '';
};

const extractId = (response: IdResponse): number => {
    if (!response.success || typeof response.id !== 'number') {
        throw new HttpError(500);
    }
    return response.id;
};

export class TicketsApiRepository implements TicketsRepository
{
    private readonly client: ApiClient;

    constructor(client: ApiClient = apiClient)
    {
        this.client = client;
    }

    public async create(payload: { title: string; description: string }, idempotencyKey: string): Promise<number>
    {
        const response = await this.client.request<IdResponse>('/tickets', {
            method: 'POST',
            headers: { 'idempotency-key': idempotencyKey },
            body: payload,
        });
        return extractId(response as IdResponse);
    }

    public async updateStatus(ticketId: number, status: TicketStatus, idempotencyKey: string): Promise<number>
    {
        const response = await this.client.request<IdResponse>(`/tickets/${ticketId}/status`, {
            method: 'PATCH',
            headers: { 'idempotency-key': idempotencyKey },
            body: { status },
        });
        return extractId(response as IdResponse);
    }

    public async assign(ticketId: number, userId: number, idempotencyKey: string): Promise<number>
    {
        const response = await this.client.request<IdResponse>(`/tickets/${ticketId}/assign`, {
            method: 'PATCH',
            headers: { 'idempotency-key': idempotencyKey },
            body: { userId },
        });
        return extractId(response as IdResponse);
    }

    public async list(filters: GetTicketsFilters): Promise<TicketListResult>
    {
        const queryString = buildQueryString(filters);
        const response = await this.client.request<Ticket[]>(`/tickets${queryString}`);
        if ('data' in response && response.success) {
            return {
                items: response.data,
                meta: response.meta as PaginationMeta,
            };
        }
        throw new HttpError(500);
    }

    public async getById(ticketId: number): Promise<Ticket>
    {
        const response = await this.client.request<Ticket>(`/tickets/${ticketId}`);
        return ApiClient.unwrapData<Ticket>(response);
    }
}
