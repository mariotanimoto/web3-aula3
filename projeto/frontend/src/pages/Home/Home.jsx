import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getGames, getGenres } from '../../services/gamesService';
import './Games.css';

function Home() {
    const [games, setGames] = useState([]);
    const [genres, setGenres] = useState([]);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [genre, setGenre] = useState('');
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadGames = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getGames({
                search: search.trim(),
                genres: genre,
                page,
                page_size: 20,
                ordering: '-rating'
            });
            setGames(data.results || []);
            setCount(data.count || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [search, genre, page]);

    useEffect(() => {
        getGenres()
            .then((data) => setGenres(data.results || []))
            .catch((err) => setError(err.message));
    }, []);

    useEffect(() => {
        loadGames();
    }, [loadGames]);

    const submitSearch = (event) => {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const totalPages = Math.ceil(count / 20);

    return (
        <div className="games-page">
            <section className="games-hero">
                <p className="eyebrow">GAME DATABASE</p>
                <h1>Explore your next game.</h1>
                <p>Search thousands of games, discover genres and find your next favourite.</p>
                <form className="game-search" onSubmit={submitSearch}>
                    <Search size={20} />
                    <input
                        value={search}
                        onChange={(event) => setSearchInput(event.target.value)}
                        placeholder="Search games..."
                        aria-label="Search games"
                    />
                    <button type="submit">Search</button>
                </form>
            </section>

            <div className="catalogue-toolbar">
                <div>
                    <h2>{search ? `Results for "${search}"` : 'Discover games'}</h2>
                    <p>{count.toLocaleString()} games in the RAWG database</p>
                </div>
                <select value={genre} onChange={(event) => { setGenre(event.target.value); setPage(1); }}>
                    <option value="">All genres</option>
                    {genres.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
                </select>
            </div>

            {error && <div className="games-error">{error}</div>}
            {loading ? (
                <p className="games-state">Loading games...</p>
            ) : games.length === 0 ? (
                <p className="games-state">No games found. Try another search.</p>
            ) : (
                <div className="game-grid">
                    {games.map((game) => (
                        <Link to={`/games/${game.slug || game.id}`} className="game-card" key={game.id}>
                            <div className="game-cover">
                                {game.background_image
                                    ? <img src={game.background_image} alt="" loading="lazy" />
                                    : <div className="game-cover-placeholder">No image</div>}
                            </div>
                            <div className="game-card-content">
                                <div className="game-meta">
                                    <span>{game.released || 'Release date TBA'}</span>
                                    {game.rating > 0 && <span className="game-rating"><Star size={14} fill="currentColor" /> {game.rating.toFixed(1)}</span>}
                                </div>
                                <h3>{game.name}</h3>
                                <p>{(game.genres || []).map((item) => item.name).join(' · ') || 'Genre not listed'}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {!loading && totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
                        <ChevronLeft size={18} /> Previous
                    </button>
                    <span>Page {page} of {totalPages.toLocaleString()}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>
                        Next <ChevronRight size={18} />
                    </button>
                </div>
            )}

            <footer className="rawg-credit">
                Game data and images provided by <a href="https://rawg.io/" target="_blank" rel="noreferrer">RAWG</a>.
            </footer>
        </div>
    );
}

export default Home;
