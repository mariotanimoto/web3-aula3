const usuarioService = require('../services/usuarioService');

const buscarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obterTodosUsuarios();
        res.status(200).json(usuarios);
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao buscar usuarios'});
    }
};

const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) return res.status(400).json({ err: 'Dados inválidos' });

    const hash = await bcrypt.hash(senha,10);

    const usuario = await usuarioService.criarUsuario(nome, email, hash);
    res.status(201).json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Erro interno ao criar usuario' });
  }
};


module.exports = { buscarUsuarios }