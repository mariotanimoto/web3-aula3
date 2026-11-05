const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const obterTodosUsuarios = () => Usuario.findAll();

const obterUsuarioPorId = (id) => Usuario.findByPk(id);

const criarUsuario = async (nome, email, senha) => {
    const senhaHash = await bcrypt.hash(senha, 12);
    return Usuario.create({ nome, email: email.toLowerCase(), senha: senhaHash });
};

const editarUsuario = async (id, nome, email, senha) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;

    const dados = { nome, email: email.toLowerCase() };
    if (senha) dados.senha = await bcrypt.hash(senha, 12);

    await usuario.update(dados);
    return usuario;
};

const excluirUsuario = async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;

    await usuario.destroy();
    return usuario;
};

module.exports = {
    obterTodosUsuarios,
    obterUsuarioPorId,
    criarUsuario,
    editarUsuario,
    excluirUsuario,
};
