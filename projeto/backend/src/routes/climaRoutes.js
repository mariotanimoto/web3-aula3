const express = require('express');
const climaController = require('../controllers/climaController');

const router = express.Router();
router.get('/', climaController.buscarClima);

module.exports = router;
