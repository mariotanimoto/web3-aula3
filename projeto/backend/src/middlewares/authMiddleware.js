const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ error: 'Token não enviado' });
    }

    const token = header.split(' ')[1];  // remove a palavra "Bearer"

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;  // disponibiliza para o Controller
        next();                 // libera a requisição
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

const autorizar = (...perfisPermitidos) => {
    return (req, res, next) => {
        // req.usuario foi preenchido pelo middleware autenticar
        if (!perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        next();
    };
};

module.exports = { autenticar, autorizar };