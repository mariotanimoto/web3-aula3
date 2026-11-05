const Clima = require('../models/Clima');

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

async function requisitarJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`OPEN_METEO_HTTP_${response.status}`);
  }

  return response.json();
}

async function obterClimaPorCidade(cidade) {
  const busca = new URL(GEOCODING_URL);
  busca.search = new URLSearchParams({
    name: cidade,
    count: '1',
    language: 'pt',
    format: 'json',
  }).toString();

  const resultadoBusca = await requisitarJson(busca);
  const local = resultadoBusca.results?.[0];

  if (!local) {
    const erro = new Error('CIDADE_NAO_ENCONTRADA');
    erro.statusCode = 404;
    throw erro;
  }

  const previsaoUrl = new URL(FORECAST_URL);
  previsaoUrl.search = new URLSearchParams({
    latitude: String(local.latitude),
    longitude: String(local.longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','),
    forecast_days: '5',
    timezone: 'auto',
  }).toString();

  const dados = await requisitarJson(previsaoUrl);

  return new Clima({
    localizacao: {
      nome: local.name,
      regiao: local.admin1 ?? null,
      pais: local.country ?? null,
      latitude: local.latitude,
      longitude: local.longitude,
      fusoHorario: dados.timezone,
    },
    atual: dados.current,
    previsaoDiaria: dados.daily,
    unidade: {
      temperatura: dados.current_units?.temperature_2m,
      sensacaoTermica: dados.current_units?.apparent_temperature,
      velocidadeVento: dados.current_units?.wind_speed_10m,
      precipitacao: dados.current_units?.precipitation,
    },
  });
}

module.exports = { obterClimaPorCidade };
