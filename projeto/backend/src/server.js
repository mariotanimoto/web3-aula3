require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const router = require('../src/routes/routes')
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});