import { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import api from '../../services/api';

export default function Home() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/games/genres').then(({ data }) => setGenres(data.results || [])).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get('/games', { params: { page, page_size: 20, genres: genre, search: search || undefined, ordering: '-rating' } })
      .then(({ data }) => { if (active) { setGames(data.results || []); setHasNext(Boolean(data.next)); } })
      .catch((error) => { if (active) setMessage(error.response?.data?.error || 'Could not load games.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [genre, page, search]);

  const addToLibrary = async (game) => {
    try {
      await api.post('/library', { rawgGameId: game.id, status: 'planned' });
      setMessage(`${game.name} added to your library.`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Could not add game.');
    }
  };

  return (
    <>
      <section className="page-heading">
        <div><p className="eyebrow">RAWG GAME DATABASE</p><h1>Discover games</h1><p className="muted">Find your next game and save it to your library.</p></div>
        <label className="search-box"><Search size={18} /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search games..." /></label>
      </section>
      <div className="filters">
        <label htmlFor="genre-filter">Genre</label>
        <select id="genre-filter" value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }}>
          <option value="">All genres</option>
          {genres.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
        </select>
      </div>
      {message && <p className="notice" onClick={() => setMessage('')}>{message}</p>}
      {loading ? <p className="muted">Loading games...</p> : games.length ? (
        <div className="game-grid">{games.map((game) => (
          <article className="game-card" key={game.id}>
            <div className="game-image">{game.background_image && <img src={game.background_image} alt={game.name} loading="lazy" />}</div>
            <div className="game-info"><div className="game-meta"><span>{game.released?.slice(0, 4) || 'Release date unknown'}</span><span>★ {game.rating || '—'}</span></div><h2>{game.name}</h2><p>{(game.genres || []).map((g) => g.name).join(' · ')}</p><button className="primary-button" onClick={() => addToLibrary(game)}><Plus size={16} /> Add to library</button></div>
          </article>
        ))}</div>
      ) : <p className="muted">No games found for these filters.</p>}
      <div className="pagination"><button disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>Previous</button><span>Page {page}</span><button disabled={!hasNext || loading} onClick={() => setPage((p) => p + 1)}>Next</button></div>
    </>
  );
}
