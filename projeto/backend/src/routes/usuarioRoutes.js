const express = require('express');
const { autenticar } = require('../middlewares/authMiddleware');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.get('/me', autenticar, usuarioController.minhaConta);
router.delete('/me', autenticar, usuarioController.excluirMinhaConta);

module.exports = router;
