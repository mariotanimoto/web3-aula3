
const Usuario = require('../models/Usuario');

const obterTodosUsuarios = async () => {
    return await Usuario.findAll();
};

const obterUsuarioPorId = async (id) => {
    return await Usuario.findByPk(id);
};

const criarUsuario = async (nome, email, senha) => {
    return await Usuario.create({
        nome,
        email,
        senha
    });
};

const editarUsuario = async (id, nome, email, senha) => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        return null;
    }

    await usuario.update({
        nome,
        email,
        senha
    });

    return usuario;
};

const excluirUsuario = async (id) => {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        return null;
    }

    await usuario.destroy();

    return usuario;
};

module.exports = {
    obterTodosUsuarios,
    obterUsuarioPorId,
    criarUsuario,
    editarUsuario,
    excluirUsuario
};
