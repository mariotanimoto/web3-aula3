const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    const [scheme, token] = (req.headers.authorization || '').split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Token Bearer não enviado' });
    }
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET não está configurado');
        return res.status(500).json({ error: 'Autenticação não configurada no servidor' });
    }

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

const autorizar = (...perfisPermitidos) => (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    return next();
};

module.exports = { autenticar, autorizar };
