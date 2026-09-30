const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use('/usuarios', autenticar, autorizar('admin'), usuarioRoutes);

module.exports = router;