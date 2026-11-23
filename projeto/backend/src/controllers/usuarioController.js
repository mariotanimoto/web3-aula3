const usuarioService = require('../services/usuarioService');

const minhaConta = async (req, res) => {
    try {
        const usuario = await usuarioService.obterUsuarioPorId(req.usuario.id);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

        return res.json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            foto: usuario.foto
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Não foi possível carregar a conta.' });
    }
};

const excluirMinhaConta = async (req, res) => {
    try {
        const usuario = await usuarioService.excluirUsuario(req.usuario.id);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Não foi possível excluir a conta.' });
    }
};

module.exports = { minhaConta, excluirMinhaConta };
