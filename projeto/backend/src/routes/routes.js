const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const authRoutes = require('./authRoutes');
const climaRoutes = require('./climaRoutes');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/clima', climaRoutes);
router.use('/usuarios', autenticar, autorizar('admin'), usuarioRoutes);

module.exports = router;
