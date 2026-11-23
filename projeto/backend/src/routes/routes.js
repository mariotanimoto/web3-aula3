const express = require('express');
const { autenticar } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const gameController = require('../controllers/gameController');
const bibliotecaController = require('../controllers/bibliotecaController');

const router = express.Router();

router.post('/auth/google', authController.loginGoogle);
router.get('/auth/me', autenticar, authController.me);

router.get('/games', gameController.listarJogos);
router.get('/games/genres', gameController.listarGeneros);
router.get('/games/:id', gameController.buscarJogo);

router.get('/library/genres', autenticar, bibliotecaController.generos);
router.get('/library', autenticar, bibliotecaController.listar);
router.post('/library', autenticar, bibliotecaController.adicionar);
router.patch('/library/:id', autenticar, bibliotecaController.atualizar);
router.delete('/library/:id', autenticar, bibliotecaController.remover);

module.exports = router;
