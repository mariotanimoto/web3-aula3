const climaService = require('../services/climaService');

const buscarClima = async (req, res) => {
  try {
    const cidade = req.query.cidade;

    if (typeof cidade !== 'string' || !cidade.trim()) {
      return res.status(400).json({ error: 'Informe uma cidade usando o parâmetro cidade.' });
    }

    const clima = await climaService.obterClimaPorCidade(cidade.trim());
    return res.status(200).json(clima);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ error: 'Cidade não encontrada.' });
    }

    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return res.status(504).json({ error: 'O serviço de clima demorou para responder.' });
    }

    console.error('Erro ao consultar Open-Meteo:', error);
    return res.status(502).json({ error: 'Não foi possível consultar o serviço de clima.' });
  }
};

module.exports = { buscarClima };
