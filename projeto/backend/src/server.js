require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(router);

app.get('/', (_req, res) => {
    res.json({ message: 'Game Catalogue API is running', documentation: '/api-docs' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
