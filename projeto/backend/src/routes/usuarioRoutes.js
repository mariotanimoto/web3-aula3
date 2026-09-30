const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.buscarUsuarios);
router.get('/:id', usuarioController.listarUsuarioPorId);
router.post('/', usuarioController.criarUsuario);
router.put('/:id', usuarioController.editarUsuario);
router.delete('/:id', autorizar('admin'), usuarioController.excluirUsuario);

module.exports = router;
