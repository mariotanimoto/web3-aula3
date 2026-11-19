const rawgService = require('../services/rawgService');

const handleError = (res, error) => {
    console.error('RAWG API error:', error.message);
    res.status(error.status || 502).json({
        error: 'Não foi possível obter dados da RAWG API.',
        details: error.message
    });
};

const listarJogos = async (req, res) => {
    try {
        const data = await rawgService.getGames(req.query);
        res.json(data);
    } catch (error) {
        handleError(res, error);
    }
};

const buscarJogo = async (req, res) => {
    try {
        const data = await rawgService.getGameById(req.params.id);
        res.json(data);
    } catch (error) {
        handleError(res, error);
    }
};

const listarGeneros = async (_req, res) => {
    try {
        res.json(await rawgService.getGenres());
    } catch (error) {
        handleError(res, error);
    }
};

const listarPlataformas = async (_req, res) => {
    try {
        res.json(await rawgService.getPlatforms());
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { listarJogos, buscarJogo, listarGeneros, listarPlataformas };
