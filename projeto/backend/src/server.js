require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./routes/routes');
const { sequelize } = require('./instances/mysql');
require('./models/Usuario');
require('./models/JogoBiblioteca');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
const swaggerUi = require('swagger-ui-express');
const openapi = require('./docs/openapi');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/api', router);

sequelize.authenticate()
    .then(() => app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)))
    .catch((error) => {
        console.error('Não foi possível conectar ao MySQL:', error);
        process.exit(1);
    });
