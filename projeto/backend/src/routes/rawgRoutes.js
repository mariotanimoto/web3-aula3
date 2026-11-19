const express = require('express');
const controller = require('../controllers/rawgController');
const router = express.Router();

router.get('/games', controller.listarJogos);
router.get('/games/:id', controller.buscarJogo);
router.get('/genres', controller.listarGeneros);
router.get('/platforms', controller.listarPlataformas);

module.exports = router;
