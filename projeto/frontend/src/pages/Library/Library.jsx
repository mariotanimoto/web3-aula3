import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../services/api';

const statuses = [
  { value: 'planned', label: 'Plan to play' },
  { value: 'playing', label: 'Playing' },
  { value: 'completed', label: 'Completed' },
  { value: 'dropped', label: 'Dropped' }
];

export default function LibraryPage() {
  const [games, setGames] = useState([]);
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState('');

  const loadLibrary = () => {
    setLoading(true);
    api.get('/library', { params: { genre: genre || undefined, status: status || undefined } })
      .then(({ data }) => { setGames(data); setError(''); })
      .catch(() => setError('Could not load your library.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/library/genres').then(({ data }) => setGenres(data)).catch(() => setGenres([]));
  }, []);

  useEffect(() => { loadLibrary(); }, [genre, status]);

  const updateStatus = async (id, nextStatus) => {
    await api.patch(`/library/${id}`, { status: nextStatus });
    loadLibrary();
  };

  const removeGame = async (id) => {
    await api.delete(`/library/${id}`);
    loadLibrary();
  };


  return (
    <>
      <section className="page-heading"><div><p className="eyebrow">YOUR COLLECTION</p><h1>My library</h1><p className="muted">Track what you are playing, finished, or want to play.</p></div></section>
      <div className="filters">
        <label htmlFor="library-genre">Genre</label>
        <select id="library-genre" value={genre} onChange={(e) => setGenre(e.target.value)}><option value="">All genres</option>{genres.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <label htmlFor="library-status">Status</label>
        <select id="library-status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
      </div>
      {error && <p className="error-message">{error}</p>}
      {loading ? <p className="muted">Loading library...</p> : games.length ? (
        <div className="library-list">{games.map((game) => (
          <article className="library-row" key={game.id}>
            {game.imagem && <img src={game.imagem} alt="" />}
            <div className="library-game"><h2>{game.nome}</h2><p>{(game.genreNames || []).join(' · ')}</p></div>
            <select aria-label={`Status for ${game.nome}`} value={game.status} onChange={(e) => updateStatus(game.id, e.target.value)}>{statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
            <button className="icon-button danger" onClick={() => removeGame(game.id)} aria-label={`Remove ${game.nome}`}><Trash2 size={18} /></button>
          </article>
        ))}</div>
      ) : <div className="empty-state"><h2>Your library is empty</h2><p className="muted">Browse the catalogue and add games to start your collection.</p></div>}
    </>
  );
}
