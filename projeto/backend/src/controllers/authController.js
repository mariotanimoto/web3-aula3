const authService = require('../services/authService');

const loginGoogle = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ error: 'Credencial Google não enviada.' });
        const result = await authService.loginWithGoogle(credential);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(error.status || 401).json({ error: error.message || 'Falha na autenticação Google.' });
    }
};

const me = async (req, res) => {
    const Usuario = require('../models/Usuario');
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email, foto: usuario.foto });
};

module.exports = { loginGoogle, me };
