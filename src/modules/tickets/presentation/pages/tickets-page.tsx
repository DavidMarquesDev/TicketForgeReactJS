import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { HttpError } from '../../../../core/http/api-client';
import { useAuth } from '../../../auth/presentation/context/use-auth';
import { TicketsService } from '../../application/tickets.service';
import type { Ticket, TicketStatus } from '../../domain/ticket.types';
import { TicketsApiRepository } from '../../infrastructure/tickets-api.repository';

const ticketsService = new TicketsService(new TicketsApiRepository());

export const TicketsPage = () => {
    const { user, logout } = useAuth();
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

    return (
        <div className="app-shell">
            <div className="card">
                <div className="row">
                    <h1>Tickets</h1>
                    <span className="muted">
                        Usuário: {user?.name} ({user?.role})
                    </span>
                    <button type="button" onClick={() => void logout()}>
                        Sair
                    </button>
                </div>
            </div>

            <div className="card">
                <h2>Criar ticket</h2>
                <form onSubmit={handleCreate}>
                    <div className="row">
                        <input required placeholder="Título" value={title} onChange={(event) => setTitle(event.target.value)} />
                        <input
                            required
                            minLength={10}
                            placeholder="Descrição"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                        <button type="submit">Criar</button>
                    </div>
                </form>
            </div>

            <div className="card">
                <div className="row">
                    <h2>Lista de tickets</h2>
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
                {tickets.map((ticket) => (
                    <div className="card" key={ticket.id}>
                        <div className="row">
                            <strong>#{ticket.id}</strong>
                            <span>{ticket.title}</span>
                            <span className="muted">Status: {ticket.status}</span>
                            <Link to={`/tickets/${ticket.id}`}>Ver detalhe</Link>
                        </div>
                    </div>
                ))}
                <div className="row">
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
            </div>
        </div>
    );
};
