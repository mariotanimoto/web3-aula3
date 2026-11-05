const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const dados = await authService.login(email.trim().toLowerCase(), senha);
        return res.status(200).json({ data: dados });
    } catch (error) {
        if (error.message === 'CREDENCIAIS_INVALIDAS') {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        console.error(error);
        return res.status(500).json({ error: 'Erro interno no login' });
    }
};

module.exports = { login };
