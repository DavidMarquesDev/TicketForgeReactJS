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
        <div className="app-shell">
            <div className="card">
                <h1>Entrar no TicketForge</h1>
                <p className="muted">Use CPF e senha para acessar os tickets.</p>
                <form onSubmit={handleSubmit}>
                    <div className="row">
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
                    </div>
                </form>
                {error ? <p className="error">{error}</p> : null}
                <p>
                    Não possui conta? <Link to="/register">Criar conta</Link>
                </p>
            </div>
        </div>
    );
};
