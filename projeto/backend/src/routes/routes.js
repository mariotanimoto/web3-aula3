const express = require('express');
const rawgRoutes = require('./rawgRoutes');
const openapi = require('../docs/openapi');
const router = express.Router();

router.use('/api', rawgRoutes);
router.get('/api-docs.json', (_req, res) => res.json(openapi));
router.get('/api-docs', (_req, res) => {
    res.type('html').send(`<!doctype html>
<html><head><meta charset="utf-8"><title>Game Catalogue API - Swagger</title>
<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"></head>
<body><div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<script>SwaggerUIBundle({ url: '/api-docs.json', dom_id: '#swagger-ui' });</script>
</body></html>`);
});

module.exports = router;
