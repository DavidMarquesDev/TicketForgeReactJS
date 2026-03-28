import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HttpError } from '../../../../core/http/api-client';
import { useAuth } from '../../../auth/presentation/context/use-auth';
import { CommentsPanel } from '../../../comments/presentation/components/comments-panel';
import { TicketsService } from '../../application/tickets.service';
import type { Ticket, TicketStatus } from '../../domain/ticket.types';
import { TicketsApiRepository } from '../../infrastructure/tickets-api.repository';

const ticketsService = new TicketsService(new TicketsApiRepository());

export const TicketDetailsPage = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const ticketId = Number(id);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [status, setStatus] = useState<TicketStatus>('open');
    const [assignUserId, setAssignUserId] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadTicket = useCallback(async () => {
        setIsLoading(true);
        try {
            const ticketResponse = await ticketsService.getTicket(ticketId);
            setTicket(ticketResponse);
            setStatus(ticketResponse.status);
            setError('');
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao carregar ticket.');
            } else {
                setError('Falha ao carregar ticket.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        if (Number.isNaN(ticketId) || ticketId <= 0) {
            setError('Identificador do ticket inválido.');
            setIsLoading(false);
            return;
        }
        void loadTicket();
    }, [loadTicket, ticketId]);

    const handleUpdateStatus = async () => {
        try {
            await ticketsService.updateTicketStatus(ticketId, status);
            await loadTicket();
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao atualizar status.');
            } else {
                setError('Falha ao atualizar status.');
            }
        }
    };

    const handleAssign = async () => {
        const parsedUserId = Number(assignUserId);
        if (Number.isNaN(parsedUserId) || parsedUserId <= 0) {
            setError('Informe um ID de usuário válido para atribuição.');
            return;
        }
        try {
            await ticketsService.assignTicket(ticketId, parsedUserId);
            setAssignUserId('');
            await loadTicket();
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao atribuir ticket.');
            } else {
                setError('Falha ao atribuir ticket.');
            }
        }
    };

    const canAssign = user?.role === 'admin' || user?.role === 'support';
    const canUpdateStatus =
        user &&
        ticket &&
        (user.role === 'admin' || user.role === 'support' || ticket.createdBy === user.id || ticket.assignedTo === user.id);

    return (
        <div className="app-shell">
            <div className="card">
                <div className="row">
                    <h1>Detalhe do ticket</h1>
                    <Link to="/tickets">Voltar</Link>
                </div>
                {error ? <p className="error">{error}</p> : null}
                {isLoading ? <p className="muted">Carregando ticket...</p> : null}
                {!isLoading && ticket ? (
                    <>
                        <p>
                            <strong>#{ticket.id}</strong> - {ticket.title}
                        </p>
                        <p>{ticket.description}</p>
                        <p className="muted">Status atual: {ticket.status}</p>
                        <p className="muted">Criado por: {ticket.createdBy}</p>
                        <p className="muted">Atribuído para: {ticket.assignedTo ?? 'não atribuído'}</p>
                    </>
                ) : null}
            </div>

            {ticket && canUpdateStatus ? (
                <div className="card">
                    <h3>Atualizar status</h3>
                    <div className="row">
                        <select value={status} onChange={(event) => setStatus(event.target.value as TicketStatus)}>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                        <button type="button" onClick={() => void handleUpdateStatus()}>
                            Atualizar
                        </button>
                    </div>
                </div>
            ) : null}

            {ticket && canAssign ? (
                <div className="card">
                    <h3>Atribuir ticket</h3>
                    <div className="row">
                        <input
                            placeholder="ID do usuário"
                            value={assignUserId}
                            onChange={(event) => setAssignUserId(event.target.value)}
                        />
                        <button type="button" onClick={() => void handleAssign()}>
                            Atribuir
                        </button>
                    </div>
                </div>
            ) : null}

            {ticket ? <CommentsPanel ticketId={ticket.id} /> : null}
        </div>
    );
};
