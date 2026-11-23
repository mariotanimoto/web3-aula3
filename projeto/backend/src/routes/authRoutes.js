const express = require('express');
const { autenticar } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/google', authController.loginGoogle);
router.get('/me', autenticar, authController.me);

module.exports = router;
