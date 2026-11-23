const JogoBiblioteca = require('../models/JogoBiblioteca');
const rawg = require('../services/api');

const generos = async (req, res) => {
    try {
        const jogos = await JogoBiblioteca.findAll({ where: { usuarioId: req.usuario.id }, attributes: ['genreIds', 'genreNames'] });
        const genres = new Map();
        for (const jogo of jogos) {
            (jogo.genreIds || []).forEach((id, index) => {
                genres.set(String(id), { id, name: jogo.genreNames?.[index] || 'Genre' });
            });
        }
        res.json([...genres.values()].sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
        res.status(500).json({ error: 'Não foi possível carregar os gêneros.' });
    }
};

const listar = async (req, res) => {
    try {
        const { genre, status } = req.query;
        const where = { usuarioId: req.usuario.id };
        if (status) where.status = status;
        const jogos = await JogoBiblioteca.findAll({ where, order: [['updatedAt', 'DESC']] });
        const filtrados = genre
            ? jogos.filter((jogo) => (jogo.genreIds || []).map(String).includes(String(genre)))
            : jogos;
        res.json(filtrados);
    } catch (error) {
        res.status(500).json({ error: 'Não foi possível carregar a biblioteca.' });
    }
};

const adicionar = async (req, res) => {
    try {
        const { rawgGameId, status = 'planned' } = req.body;
        if (!rawgGameId) return res.status(400).json({ error: 'rawgGameId é obrigatório.' });
        if (!['playing', 'completed', 'planned', 'dropped'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido.' });
        }

        const game = await rawg.getGameById(rawgGameId);
        const [entry, created] = await JogoBiblioteca.findOrCreate({
            where: { usuarioId: req.usuario.id, rawgGameId: game.id },
            defaults: {
                nome: game.name,
                imagem: game.background_image || null,
                status,
                genreIds: (game.genres || []).map((genre) => genre.id),
                genreNames: (game.genres || []).map((genre) => genre.name)
            }
        });
        if (!created) await entry.update({ status, nome: game.name, imagem: game.background_image || null, genreIds: (game.genres || []).map((genre) => genre.id), genreNames: (game.genres || []).map((genre) => genre.name) });
        res.status(created ? 201 : 200).json(entry);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || 'Não foi possível adicionar o jogo.' });
    }
};

const atualizar = async (req, res) => {
    const { status } = req.body;
    if (!['playing', 'completed', 'planned', 'dropped'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido.' });
    }
    const entry = await JogoBiblioteca.findOne({ where: { id: req.params.id, usuarioId: req.usuario.id } });
    if (!entry) return res.status(404).json({ error: 'Jogo não encontrado na biblioteca.' });
    await entry.update({ status });
    return res.json(entry);
};

const remover = async (req, res) => {
    const deleted = await JogoBiblioteca.destroy({ where: { id: req.params.id, usuarioId: req.usuario.id } });
    if (!deleted) return res.status(404).json({ error: 'Jogo não encontrado na biblioteca.' });
    return res.status(204).send();
};

module.exports = { generos, listar, adicionar, atualizar, remover };
