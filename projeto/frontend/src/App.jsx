import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Gamepad2, Sun, Moon, Activity } from 'lucide-react';
import Home from './pages/Home/Home';
import GameDetails from './pages/Home/GameDetails';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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
              GAME CATALOGUE
            </div>
          </div>
          <Link to="/" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gamepad2 size={20} />
            Games
          </Link>
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
            </div>
          </nav>

          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games/:id" element={<GameDetails />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;