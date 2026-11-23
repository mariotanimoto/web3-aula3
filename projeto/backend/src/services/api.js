const RAWG_BASE_URL = 'https://api.rawg.io/api';
const ALLOWED_ESRB = new Set(['everyone', 'everyone-10-plus', 'teen']);

const requestRawg = async (path, params = {}) => {
    if (!process.env.RAWG_API_KEY) {
        const error = new Error('RAWG_API_KEY não configurada no servidor.');
        error.status = 500;
        throw error;
    }

    const url = new URL(`${RAWG_BASE_URL}${path}`);
    url.searchParams.set('key', process.env.RAWG_API_KEY);
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    }

    const response = await fetch(url);
    if (!response.ok) {
        const error = new Error(`RAWG retornou status ${response.status}.`);
        error.status = response.status === 404 ? 404 : 502;
        throw error;
    }
    return response.json();
};

const isSafeGame = (game) => ALLOWED_ESRB.has(game.esrb_rating?.slug);

const getGames = async (params = {}) => {
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.min(40, Math.max(1, Number(params.page_size) || 20));
    const targetCount = page * pageSize;
    const rawgParams = {
        page_size: 40,
        search: params.search,
        genres: params.genres,
        platforms: params.platforms,
        ordering: params.ordering,
        dates: params.dates,
        metacritic: params.metacritic
    };

    const safeGames = [];
    let rawgPage = 1;
    let rawgHasNext = true;
    let totalCount = 0;

    while (safeGames.length <= targetCount && rawgHasNext && rawgPage <= 50) {
        const data = await requestRawg('/games', { ...rawgParams, page: rawgPage });
        totalCount = data.count || 0;
        safeGames.push(...(data.results || []).filter(isSafeGame));
        rawgHasNext = Boolean(data.next) && Boolean(data.results?.length);
        rawgPage += 1;
    }

    const start = (page - 1) * pageSize;
    return {
        count: totalCount,
        results: safeGames.slice(start, start + pageSize),
        next: safeGames.length > start + pageSize || rawgHasNext,
        page,
        page_size: pageSize
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
