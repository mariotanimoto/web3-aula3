import { useEffect, useRef, useState } from 'react';
import { Gamepad2 } from 'lucide-react';
import api from '../../services/api';

export default function Login({ onLogin }) {
  const buttonRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let attempts = 0;
    const setupGoogle = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) {
        if (attempts++ < 30) setTimeout(setupGoogle, 200);
        return;
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        setError('Configure VITE_GOOGLE_CLIENT_ID no arquivo .env do frontend.');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          try {
            setError('');
            const response = await api.post('/auth/google', { credential });
            onLogin(response.data);
          } catch (err) {
            console.error('Google login error:', err);
            console.error('Backend response:', err.response?.data);

            setError(
              err.response?.data?.error ||
              err.message ||
              'Não foi possível entrar com Google.'
            );
          }
        }
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 280
      });
    };

    setupGoogle();
  }, [onLogin]);

  return (
    <div className="login-screen">
      <section className="login-card">
        <Gamepad2 size={42} />
        <p className="eyebrow">YOUR PERSONAL GAME TRACKER</p>
        <h1>Keep your games<br />in one place.</h1>
        <p className="muted">Sign in to build and manage your personal game library.</p>
        <div className="google-button" ref={buttonRef} />
        {error && <p className="error-message">{error}</p>}
      </section>
    </div>
  );
}
