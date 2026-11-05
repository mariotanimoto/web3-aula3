const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const login = async (email, senha) => {
    const usuario = await Usuario.unscoped().findOne({ where: { email } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        const error = new Error('CREDENCIAIS_INVALIDAS');
        throw error;
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não configurado');
    }

    const token = jwt.sign(
        { id: usuario.id, email: usuario.email, perfil: usuario.perfil },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    const dadosUsuario = usuario.toJSON();
    delete dadosUsuario.senha;

    return { usuario: dadosUsuario, token };
};

module.exports = { login };
