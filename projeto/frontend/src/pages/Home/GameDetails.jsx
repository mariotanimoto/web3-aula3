import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { getGameById } from '../../services/gamesService';
import './Games.css';

function GameDetails() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        getGameById(id)
            .then(setGame)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="games-state">Loading game details...</p>;
    if (error) return <div className="games-error">{error}</div>;
    if (!game) return null;

    return (
        <article className="game-details">
            <Link to="/" className="back-link"><ArrowLeft size={18} /> Back to catalogue</Link>
            <div className="details-cover" style={{ backgroundImage: `linear-gradient(0deg, rgba(10,10,15,.92), rgba(10,10,15,.12)), url("${game.background_image || ''}")` }}>
                <div className="details-heading">
                    <p className="eyebrow">GAME DETAILS</p>
                    <h1>{game.name}</h1>
                    <div className="details-meta">
                        {game.released && <span>Released: {game.released}</span>}
                        {game.rating > 0 && <span><Star size={15} fill="currentColor" /> {game.rating.toFixed(1)} / 5</span>}
                        {game.metacritic && <span>Metacritic: {game.metacritic}</span>}
                    </div>
                </div>
            </div>
            <div className="details-content">
                <section>
                    <h2>About</h2>
                    <div className="game-description">{game.description_raw || game.description?.replace(/<[^>]*>/g, ' ') || 'No description available.'}</div>
                </section>
                <aside className="details-sidebar">
                    <h2>Information</h2>
                    <dl>
                        <dt>Genres</dt><dd>{(game.genres || []).map((item) => item.name).join(', ') || '—'}</dd>
                        <dt>Platforms</dt><dd>{(game.platforms || []).map((item) => item.platform?.name).filter(Boolean).join(', ') || '—'}</dd>
                        <dt>Developers</dt><dd>{(game.developers || []).map((item) => item.name).join(', ') || '—'}</dd>
                        <dt>Publishers</dt><dd>{(game.publishers || []).map((item) => item.name).join(', ') || '—'}</dd>
                        <dt>Website</dt><dd>{game.website ? <a href={game.website} target="_blank" rel="noreferrer">Official website</a> : '—'}</dd>
                    </dl>
                </aside>
            </div>
            <footer className="rawg-credit">Game data and images provided by <a href="https://rawg.io/" target="_blank" rel="noreferrer">RAWG</a>.</footer>
        </article>
    );
}

export default GameDetails;
