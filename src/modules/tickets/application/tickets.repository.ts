import type { Ticket, TicketListResult, TicketStatus, GetTicketsFilters } from '../domain/ticket.types';

export interface TicketsRepository {
    create(payload: { title: string; description: string }, idempotencyKey: string): Promise<number>;
    updateStatus(ticketId: number, status: TicketStatus, idempotencyKey: string): Promise<number>;
    assign(ticketId: number, userId: number, idempotencyKey: string): Promise<number>;
    list(filters: GetTicketsFilters): Promise<TicketListResult>;
    getById(ticketId: number): Promise<Ticket>;
}
