const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');

const router = express.Router();

router.use('/usuarios', usuarioRoutes);

module.exports = router;