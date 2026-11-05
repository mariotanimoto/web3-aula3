import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, senha });
            const token = response.data?.data?.token;
            if (!token) throw new Error('Resposta de autenticação inválida.');
            onLogin(token);
            navigate('/usuarios', { replace: true });
        } catch (err) {
            setError(err.response?.data?.error || 'Não foi possível entrar. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1>Entrar</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
                </label>
                <label>
                    Senha
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required autoComplete="current-password" />
                </label>
                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}

export default Login;
