const usuarioService = require('../services/usuarioService');

const buscarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obterTodosUsuarios();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ err: 'Erro interno ao buscar usuarios' });
  }
};

const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) return res.status(400).json({ err: 'Dados inválidos' });

    const usuario = await usuarioService.criarUsuario(nome, email, senha);
    res.status(201).json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Erro interno ao criar usuario' });
  }
};

const listarUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await usuarioService.obterUsuarioPorId(id);

    if (!usuario) {
      return res.status(404).json({ err: 'Usuario não encontrado' });
    }

    res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Erro interno ao buscar usuario' });
  }
};

const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ err: 'Dados inválidos' });
    }

    const usuario = await usuarioService.editarUsuario(
      id,
      nome,
      email,
      senha
    );

    if (!usuario) {
      return res.status(404).json({ err: 'Usuario não encontrado' });
    }

    res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Erro interno ao editar usuario' });
  }
};

const excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await usuarioService.excluirUsuario(id);

    if (!usuario) {
      return res.status(404).json({ err: 'Usuario não encontrado' });
    }

    res.status(200).json({ mensagem: 'Usuario excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Erro interno ao excluir usuario' });
  }
};


module.exports = { buscarUsuarios, listarUsuarioPorId, criarUsuario, editarUsuario, excluirUsuario };