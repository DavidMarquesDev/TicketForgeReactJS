import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HttpError } from '../../../../core/http/api-client';
import { useAuth } from '../context/use-auth';

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fromPath = (location.state as { from?: string } | undefined)?.from ?? '/tickets';

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login({ cpf, password });
            navigate(fromPath, { replace: true });
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao autenticar.');
            } else {
                setError('Falha ao autenticar.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="tf-auth-layout">
            <div className="tf-auth-card">
                <h1 className="tf-auth-title">Entrar no TicketForge</h1>
                <p className="tf-auth-subtitle">Acesse sua conta para acompanhar tickets e comentários.</p>
                <form onSubmit={handleSubmit} className="tf-auth-form">
                    <input
                        required
                        minLength={11}
                        maxLength={11}
                        placeholder="CPF (11 dígitos)"
                        value={cpf}
                        onChange={(event) => setCpf(event.target.value.replace(/\D/g, ''))}
                    />
                    <input
                        required
                        minLength={8}
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                {error ? <p className="error">{error}</p> : null}
                <p>
                    Não possui conta? <Link to="/register">Criar conta</Link>
                </p>
            </div>
        </div>
    );
};
