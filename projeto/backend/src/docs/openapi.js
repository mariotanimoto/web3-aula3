module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Game Catalogue API',
    version: '1.0.0',
    description: 'Backend de catálogo de jogos integrado à RAWG Video Games Database API.'
  },
  servers: [{ url: 'http://localhost:3000/api', description: 'Servidor local' }],
  paths: {
    '/games': {
      get: {
        summary: 'Listar e pesquisar jogos',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Nome ou termo de pesquisa' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'page_size', in: 'query', schema: { type: 'integer', default: 20, maximum: 40 } },
          { name: 'genres', in: 'query', schema: { type: 'string' }, description: 'ID ou slug do gênero' },
          { name: 'parent_platforms', in: 'query', schema: { type: 'string' } },
          { name: 'ordering', in: 'query', schema: { type: 'string', example: '-rating' } }
        ],
        responses: { '200': { description: 'Lista paginada de jogos retornada pela RAWG.' }, '502': { description: 'Falha ao consultar RAWG.' } }
      }
    },
    '/games/{id}': {
      get: {
        summary: 'Obter detalhes de um jogo',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Detalhes do jogo.' }, '404': { description: 'Jogo não encontrado.' } }
      }
    },
    '/genres': { get: { summary: 'Listar gêneros', responses: { '200': { description: 'Gêneros disponíveis.' } } } },
    '/platforms': { get: { summary: 'Listar plataformas principais', responses: { '200': { description: 'Plataformas disponíveis.' } } } }
  }
};
