import type { PaginationMeta } from '../../../shared/domain/api.types';

export type Comment = {
    id: number;
    ticketId: number;
    authorId: number;
    content: string;
    createdAt: string;
};

export type CommentListResult = {
    items: Comment[];
    meta: PaginationMeta;
};
