const rawg = require('../services/api');

const listarJogos = async (req, res) => {
    try {
        const data = await rawg.getGames(req.query);
        res.json(data);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

const buscarJogo = async (req, res) => {
    try {
        res.json(await rawg.getGameById(req.params.id));
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

const listarGeneros = async (req, res) => {
    try {
        res.json(await rawg.getGenres());
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

module.exports = { listarJogos, buscarJogo, listarGeneros };
