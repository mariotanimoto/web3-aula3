const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.get('/', usuarioController.buscarUsuarios);
router.get('/:id', usuarioController.listarUsuarioPorId);
router.post('/', usuarioController.criarUsuario);
router.put('/:id', usuarioController.editarUsuario);
router.delete('/:id', usuarioController.excluirUsuario);

module.exports = router;
