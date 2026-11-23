import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Gamepad2, Library, Compass, LogOut } from 'lucide-react';
import Home from './pages/Home/Home';
import LibraryPage from './pages/Library/Library';
import Login from './pages/Login/Login';
import './App.css';

function Application() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) setUser(null);
  }, []);

  const handleLogin = useCallback((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.usuario));
    setUser(data.usuario);
    navigate('/');
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user) return <Routes><Route path="*" element={<Login onLogin={handleLogin} />} /></Routes>;

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand"><Gamepad2 /> GAME LIBRARY</NavLink>
        <nav>
          <NavLink to="/" end><Compass size={18} /> Discover</NavLink>
          <NavLink to="/library"><Library size={18} /> My Library</NavLink>
        </nav>
        <div className="account">
          {user.foto && <img src={user.foto} alt="" />}
          <span>{user.nome}</span>
          <button className="icon-button" onClick={logout} title="Sign out"><LogOut size={18} /></button>
        </div>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return <BrowserRouter><Application /></BrowserRouter>;
}
