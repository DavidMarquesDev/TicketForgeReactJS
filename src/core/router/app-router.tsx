import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { LoginPage } from '../../modules/auth/presentation/pages/login-page';
import { RegisterPage } from '../../modules/auth/presentation/pages/register-page';
import { TicketsPage } from '../../modules/tickets/presentation/pages/tickets-page';
import { TicketDetailsPage } from '../../modules/tickets/presentation/pages/ticket-details-page';

export const AppRouter = () => (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/tickets" replace />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetailsPage />} />
            <Route path="/users" element={<div className="tf-page-card">Módulo de usuários disponível em breve.</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/tickets" replace />} />
    </Routes>
);
