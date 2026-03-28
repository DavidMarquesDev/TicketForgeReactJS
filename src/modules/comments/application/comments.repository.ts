import type { CommentListResult } from '../domain/comment.types';

export interface CommentsRepository {
    create(ticketId: number, content: string, idempotencyKey: string): Promise<number>;
    list(ticketId: number, page?: number, limit?: number, order?: 'ASC' | 'DESC'): Promise<CommentListResult>;
    update(ticketId: number, commentId: number, content: string, idempotencyKey: string): Promise<number>;
    remove(ticketId: number, commentId: number, idempotencyKey: string): Promise<number>;
}
