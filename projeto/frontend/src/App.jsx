import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Sun, Moon, Activity, CloudSun } from 'lucide-react';
import Home from './pages/Home/Home';
import Usuarios from './pages/Usuarios/NewUsuarios';
import Login from './pages/Login/Login';
import Clima from './pages/Clima/Clima';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={24} color="var(--primary-color)" />
              WEB III
            </div>
          </div>
          <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/usuarios" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <Users size={20} />
            Usuários
          </NavLink>
          <NavLink to="/clima" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <CloudSun size={20} />
            Clima
          </NavLink>
          <NavLink to="/configuracoes" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <Settings size={20} />
            Configurações
          </NavLink>
          {token && (
            <button type="button" onClick={handleLogout} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', marginBottom: '1rem' }}>
              <LogOut size={20} />
              Sair
            </button>
          )}
        </aside>

        <div className="right-area">
          <nav className="top-navbar">
            <div className="navbar-right">
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {theme === 'light' ? (
                  <><Moon size={18} /></>
                ) : (
                  <><Sun size={18} /></>
                )}
              </button>
              <div className="user-profile">Administrador</div>
            </div>
          </nav>

          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={token ? <Navigate to="/usuarios" replace /> : <Login onLogin={handleLogin} />} />
              <Route path="/usuarios" element={token ? <Usuarios /> : <Navigate to="/login" replace />} />
              <Route path="/clima" element={<Clima />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;