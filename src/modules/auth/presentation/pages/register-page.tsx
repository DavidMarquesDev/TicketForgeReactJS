import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HttpError } from '../../../../core/http/api-client';
import { useAuth } from '../context/use-auth';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await register({ name, cpf, email, password });
            navigate('/login');
        } catch (caughtError) {
            if (caughtError instanceof HttpError) {
                setError(caughtError.payload?.message ?? 'Falha ao criar conta.');
            } else {
                setError('Falha ao criar conta.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="tf-auth-layout">
            <div className="tf-auth-card">
                <h1 className="tf-auth-title">Criar conta</h1>
                <p className="tf-auth-subtitle">Registre-se para abrir, acompanhar e comentar tickets.</p>
                <form onSubmit={handleSubmit} className="tf-auth-form">
                    <input required placeholder="Nome completo" value={name} onChange={(event) => setName(event.target.value)} />
                    <input
                        required
                        minLength={11}
                        maxLength={11}
                        placeholder="CPF (11 dígitos)"
                        value={cpf}
                        onChange={(event) => setCpf(event.target.value.replace(/\D/g, ''))}
                    />
                    <input required type="email" placeholder="E-mail" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <input
                        required
                        minLength={8}
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Criando...' : 'Criar conta'}
                    </button>
                </form>
                {error ? <p className="error">{error}</p> : null}
                <p>
                    Já possui conta? <Link to="/login">Entrar</Link>
                </p>
            </div>
        </div>
    );
};
