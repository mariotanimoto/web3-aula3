const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const usuario = await authService.login(email, senha);
        return res.status(200).json({ data: usuario });

    } catch (error) {
        if (error.message === 'CREDENCIAIS_INVALIDAS') {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        return res.status(500).json({ error: 'Erro interno no login' });
    }
};
