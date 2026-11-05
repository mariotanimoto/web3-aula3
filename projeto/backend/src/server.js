require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./routes/routes');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(router);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
