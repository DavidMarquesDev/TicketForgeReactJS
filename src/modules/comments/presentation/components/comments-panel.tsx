import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { HttpError } from '../../../../core/http/api-client';
import { CommentsService } from '../../application/comments.service';
import type { Comment } from '../../domain/comment.types';
import { CommentsApiRepository } from '../../infrastructure/comments-api.repository';
import { useAuth } from '../../../auth/presentation/context/use-auth';

const commentsService = new CommentsService(new CommentsApiRepository());

type CommentsPanelProps = {
    ticketId: number;
};

export const CommentsPanel = ({ ticketId }: CommentsPanelProps) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState('');

    const loadComments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await commentsService.listComments(ticketId);
            setComments(response.items);
            setError('');
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao carregar comentários.');
            } else {
                setError('Falha ao carregar comentários.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        void loadComments();
    }, [loadComments]);

    const canManageComment = (comment: Comment): boolean => {
        if (!user) {
            return false;
        }
        return comment.authorId === user.id || user.role === 'admin';
    };

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!content.trim()) {
            return;
        }
        try {
            await commentsService.createComment(ticketId, content.trim());
            setContent('');
            await loadComments();
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao criar comentário.');
            } else {
                setError('Falha ao criar comentário.');
            }
        }
    };

    const handleDelete = async (commentId: number) => {
        try {
            await commentsService.deleteComment(ticketId, commentId);
            await loadComments();
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao excluir comentário.');
            } else {
                setError('Falha ao excluir comentário.');
            }
        }
    };

    const handleUpdate = async (commentId: number) => {
        if (!editingContent.trim()) {
            return;
        }
        try {
            await commentsService.updateComment(ticketId, commentId, editingContent.trim());
            setEditingCommentId(null);
            setEditingContent('');
            await loadComments();
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao atualizar comentário.');
            } else {
                setError('Falha ao atualizar comentário.');
            }
        }
    };

    return (
        <div className="card">
            <h3>Comentários</h3>
            <form onSubmit={handleCreate}>
                <div className="row">
                    <input
                        required
                        placeholder="Novo comentário"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                    />
                    <button type="submit">Comentar</button>
                </div>
            </form>
            {error ? <p className="error">{error}</p> : null}
            {isLoading ? <p className="muted">Carregando comentários...</p> : null}
            {!isLoading && comments.length === 0 ? <p className="muted">Nenhum comentário.</p> : null}
            {comments.map((comment) => (
                <div className="card" key={comment.id}>
                    <p className="muted">
                        #{comment.id} · Autor {comment.authorId} · {new Date(comment.createdAt).toLocaleString('pt-BR')}
                    </p>
                    {editingCommentId === comment.id ? (
                        <div className="row">
                            <input value={editingContent} onChange={(event) => setEditingContent(event.target.value)} />
                            <button type="button" onClick={() => void handleUpdate(comment.id)}>
                                Salvar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingCommentId(null);
                                    setEditingContent('');
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <p>{comment.content}</p>
                    )}
                    {canManageComment(comment) && editingCommentId !== comment.id ? (
                        <div className="row">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingCommentId(comment.id);
                                    setEditingContent(comment.content);
                                }}
                            >
                                Editar
                            </button>
                            <button type="button" onClick={() => void handleDelete(comment.id)}>
                                Excluir
                            </button>
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
};
