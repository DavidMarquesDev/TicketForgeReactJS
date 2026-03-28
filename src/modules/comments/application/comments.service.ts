import { createIdempotencyKey } from '../../../core/utils/idempotency';
import type { CommentListResult } from '../domain/comment.types';
import type { CommentsRepository } from './comments.repository';

export class CommentsService
{
    private readonly repository: CommentsRepository;

    constructor(repository: CommentsRepository)
    {
        this.repository = repository;
    }

    public async createComment(ticketId: number, content: string): Promise<number>
    {
        return this.repository.create(ticketId, content, createIdempotencyKey());
    }

    public async listComments(ticketId: number, page = 1, limit = 20, order: 'ASC' | 'DESC' = 'DESC'): Promise<CommentListResult>
    {
        return this.repository.list(ticketId, page, limit, order);
    }

    public async updateComment(ticketId: number, commentId: number, content: string): Promise<number>
    {
        return this.repository.update(ticketId, commentId, content, createIdempotencyKey());
    }

    public async deleteComment(ticketId: number, commentId: number): Promise<number>
    {
        return this.repository.remove(ticketId, commentId, createIdempotencyKey());
    }
}
