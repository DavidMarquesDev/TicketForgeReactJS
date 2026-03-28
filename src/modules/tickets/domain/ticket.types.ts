import type { PaginationMeta } from '../../../shared/domain/api.types';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type Ticket = {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    createdBy: number;
    assignedTo: number | null;
    createdAt: string;
    updatedAt: string;
    creator?: {
        id: number;
        name?: string;
        email?: string;
    };
    assignee?: {
        id: number;
        name?: string;
        email?: string;
    } | null;
};

export type GetTicketsFilters = {
    status?: TicketStatus;
    assigneeId?: number;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'status';
    order?: 'ASC' | 'DESC';
};

export type TicketListResult = {
    items: Ticket[];
    meta: PaginationMeta;
};
