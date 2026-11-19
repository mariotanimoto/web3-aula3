const RAWG_BASE_URL = 'https://api.rawg.io/api';

const allowedGameParams = [
    'page', 'page_size', 'search', 'search_precise', 'search_exact',
    'parent_platforms', 'platforms', 'stores', 'developers', 'publishers',
    'genres', 'tags', 'creators', 'dates', 'updated', 'platforms_count',
    'metacritic', 'exclude_collection', 'exclude_additions',
    'exclude_parents', 'exclude_game_series', 'exclude_stores', 'ordering'
];

const requestRawg = async (path, params = {}) => {
    if (!process.env.RAWG_API_KEY) {
        const error = new Error('RAWG_API_KEY não configurada no servidor.');
        error.status = 500;
        throw error;
    }

    const url = new URL(`${RAWG_BASE_URL}${path}`);
    url.searchParams.set('key', process.env.RAWG_API_KEY);

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.set(key, String(value));
        }
    }

    const response = await fetch(url);

    if (!response.ok) {
        const error = new Error(`RAWG retornou status ${response.status}.`);
        error.status = response.status === 404 ? 404 : 502;
        throw error;
    }

    return response.json();
};

const getGames = async (params = {}) => {
    const safeParams = Object.fromEntries(
        Object.entries(params).filter(([key]) => allowedGameParams.includes(key))
    );

    const data = await requestRawg('/games', {
        page_size: 40,
        ...safeParams
    });

    data.results = data.results.filter(game =>
        game.esrb_rating?.slug !== 'adults-only' &&
        game.esrb_rating?.slug !== 'rating-pending' &&
        game.esrb_rating?.slug !== null
    );

    return data;
};

const getGameById = async (id) => {
    const game = await requestRawg(`/games/${encodeURIComponent(id)}`);

    if (
        game.esrb_rating?.slug === 'adults-only' ||
        game.esrb_rating?.slug === 'rating-pending' ||
        game.esrb_rating?.slug === null
    ) {
        const error = new Error('Este jogo não está disponível.');
        error.status = 404;
        throw error;
    }

    return game;
};

const getGenres = () => requestRawg('/genres', { page_size: 40 });

const getPlatforms = () => requestRawg('/platforms/lists/parents');

module.exports = { getGames, getGameById, getGenres, getPlatforms };