import { createIdempotencyKey } from '../../../core/utils/idempotency';
import type { GetTicketsFilters, Ticket, TicketListResult, TicketStatus } from '../domain/ticket.types';
import type { TicketsRepository } from './tickets.repository';

export class TicketsService
{
    private readonly repository: TicketsRepository;

    constructor(repository: TicketsRepository)
    {
        this.repository = repository;
    }

    public async createTicket(payload: { title: string; description: string }): Promise<number>
    {
        return this.repository.create(payload, createIdempotencyKey());
    }

    public async updateTicketStatus(ticketId: number, status: TicketStatus): Promise<number>
    {
        return this.repository.updateStatus(ticketId, status, createIdempotencyKey());
    }

    public async assignTicket(ticketId: number, userId: number): Promise<number>
    {
        return this.repository.assign(ticketId, userId, createIdempotencyKey());
    }

    public async listTickets(filters: GetTicketsFilters): Promise<TicketListResult>
    {
        return this.repository.list(filters);
    }

    public async getTicket(ticketId: number): Promise<Ticket>
    {
        return this.repository.getById(ticketId);
    }
}
