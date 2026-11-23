
const RAWG_BASE_URL = 'https://api.rawg.io/api';

const allowedGameParams = [
    'page', 'page_size', 'search', 'search_precise', 'search_exact',
    'parent_platforms', 'platforms', 'stores', 'developers', 'publishers',
    'genres', 'tags', 'creators', 'dates', 'updated', 'platforms_count',
    'metacritic', 'exclude_collection', 'exclude_additions',
    'exclude_parents', 'exclude_game_series', 'exclude_stores', 'ordering'
];

const allowedEsrbRatings = new Set([
    'everyone',
    'everyone-10-plus',
    'teen'
]);

const isSafeGame = (game) =>
    allowedEsrbRatings.has(game.esrb_rating?.slug);

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

    const requestedPage = Number(safeParams.page) || 1;
    const requestedPageSize = Number(safeParams.page_size) || 20;

    let results = [];
    let rawgPage = requestedPage;
    let totalCount = 0;
    let next = null;

    while (results.length < requestedPageSize) {
        const data = await requestRawg('/games', {
            ...safeParams,
            page: rawgPage,
            page_size: 40
        });

        totalCount = data.count || 0;

        results.push(...(data.results || []).filter(isSafeGame));

        next = data.next;
        rawgPage++;

        if (!next || !data.results?.length) {
            break;
        }
    }

    return {
        count: totalCount,
        results: results.slice(0, requestedPageSize),
        next: next && results.length >= requestedPageSize
            ? true
            : null,
        previous: requestedPage > 1
    };
};


const getGameById = async (id) => {
    const game = await requestRawg(`/games/${encodeURIComponent(id)}`);

    if (!isSafeGame(game)) {
        const error = new Error('Este jogo não está disponível.');
        error.status = 404;
        throw error;
    }

    return game;
};

const getGenres = () => requestRawg('/genres', { page_size: 40 });

const getPlatforms = () => requestRawg('/platforms/lists/parents');

module.exports = { getGames, getGameById, getGenres, getPlatforms };
