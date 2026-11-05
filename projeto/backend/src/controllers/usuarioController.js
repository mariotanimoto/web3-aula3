const usuarioService = require('../services/usuarioService');

const buscarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obterTodosUsuarios();
    return res.status(200).json(usuarios);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno ao buscar usuários' });
  }
};

const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (typeof nome !== 'string' || typeof email !== 'string' || typeof senha !== 'string' || !nome.trim() || !email.trim() || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const usuario = await usuarioService.criarUsuario(nome.trim(), email.trim(), senha);
    return res.status(201).json(usuario);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Este email já está cadastrado' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro interno ao criar usuário' });
  }
};

const listarUsuarioPorId = async (req, res) => {
  try {
    const usuario = await usuarioService.obterUsuarioPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno ao buscar usuário' });
  }
};

const editarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (typeof nome !== 'string' || typeof email !== 'string' || !nome.trim() || !email.trim() || (senha !== undefined && typeof senha !== 'string')) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios; senha deve ser texto' });
    }

    const usuario = await usuarioService.editarUsuario(req.params.id, nome.trim(), email.trim(), senha);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.status(200).json(usuario);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Este email já está cadastrado' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro interno ao editar usuário' });
  }
};

const excluirUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.excluirUsuario(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno ao excluir usuário' });
  }
};

module.exports = { buscarUsuarios, listarUsuarioPorId, criarUsuario, editarUsuario, excluirUsuario };
