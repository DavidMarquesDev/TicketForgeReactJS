import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { HttpError } from '../../../../core/http/api-client';
import { useAuth } from '../../../auth/presentation/context/use-auth';
import { TicketsService } from '../../application/tickets.service';
import type { Ticket, TicketStatus } from '../../domain/ticket.types';
import { TicketsApiRepository } from '../../infrastructure/tickets-api.repository';

const ticketsService = new TicketsService(new TicketsApiRepository());

export const TicketsPage = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState<TicketStatus | ''>('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadTickets = useCallback(async (selectedPage: number) => {
        setIsLoading(true);
        try {
            const response = await ticketsService.listTickets({
                page: selectedPage,
                limit: 10,
                order: 'DESC',
                sortBy: 'createdAt',
                ...(status ? { status } : {}),
            });
            setTickets(response.items);
            setTotalPages(response.meta.totalPages);
            setError('');
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao carregar tickets.');
            } else {
                setError('Falha ao carregar tickets.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [status]);

    useEffect(() => {
        void loadTickets(page);
    }, [loadTickets, page]);

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await ticketsService.createTicket({ title, description });
            setTitle('');
            setDescription('');
            await loadTickets(1);
            setPage(1);
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao criar ticket.');
            } else {
                setError('Falha ao criar ticket.');
            }
        }
    };

    const getStatusClassName = (ticketStatus: TicketStatus): string => {
        if (ticketStatus === 'in_progress') {
            return 'tf-status-badge tf-status-in-progress';
        }

        if (ticketStatus === 'resolved') {
            return 'tf-status-badge tf-status-resolved';
        }

        if (ticketStatus === 'closed') {
            return 'tf-status-badge tf-status-closed';
        }

        return 'tf-status-badge tf-status-open';
    };

    return (
        <div className="tf-page">
            <header className="tf-page-header">
                <div>
                    <h1 className="tf-page-title">Tickets</h1>
                    <p className="tf-page-description">
                        Gerencie chamados por prioridade e status. Sessão atual: {user?.name} ({user?.role}).
                    </p>
                </div>
            </header>

            <section className="tf-page-card">
                <h2 className="tf-card-title">Criar ticket</h2>
                <form onSubmit={handleCreate} className="tf-inline-form">
                    <input required placeholder="Título do ticket" value={title} onChange={(event) => setTitle(event.target.value)} />
                    <input
                        required
                        minLength={10}
                        placeholder="Descrição detalhada"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                    <button type="submit">Criar</button>
                </form>
            </section>

            <section className="tf-page-card">
                <div className="tf-page-header">
                    <div>
                        <h2 className="tf-card-title">Lista de tickets</h2>
                        <p className="tf-page-description">Visualize os chamados com paginação e filtro por status.</p>
                    </div>
                    <select value={status} onChange={(event) => setStatus(event.target.value as TicketStatus | '')}>
                        <option value="">Todos os status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                {error ? <p className="error">{error}</p> : null}
                {isLoading ? <p className="muted">Carregando tickets...</p> : null}
                {!isLoading && tickets.length === 0 ? <p className="muted">Nenhum ticket encontrado.</p> : null}

                <div className="tf-ticket-list">
                    {tickets.map((ticket) => (
                        <article className="tf-ticket-card" key={ticket.id}>
                            <div className="tf-ticket-top">
                                <span className={getStatusClassName(ticket.status)}>{ticket.status.replace('_', ' ')}</span>
                                <Link to={`/tickets/${ticket.id}`}>Ver detalhe</Link>
                            </div>
                            <h3 className="tf-ticket-title">{ticket.title}</h3>
                            <p className="tf-ticket-description">{ticket.description}</p>
                            <div className="tf-ticket-meta">
                                <span>#{ticket.id}</span>
                                <span>Criado por {ticket.createdBy}</span>
                                <span>{new Date(ticket.createdAt).toLocaleString('pt-BR')}</span>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="tf-pagination">
                    <button type="button" disabled={page <= 1} onClick={() => setPage((previous) => previous - 1)}>
                        Anterior
                    </button>
                    <span className="muted">
                        Página {page} de {totalPages}
                    </span>
                    <button type="button" disabled={page >= totalPages} onClick={() => setPage((previous) => previous + 1)}>
                        Próxima
                    </button>
                </div>
            </section>
        </div>
    );
};
