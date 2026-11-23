const Usuario = require('../models/Usuario');

const obterUsuarioPorId = async (id) => Usuario.findByPk(id);

const excluirUsuario = async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    await usuario.destroy();
    return usuario;
};

module.exports = { obterUsuarioPorId, excluirUsuario };
