/**
 * Modelo de domínio (não é um model Sequelize): representa os dados
 * de clima retornados pelo Open-Meteo, sem persistir previsões no MySQL.
 */
class Clima {
  constructor({ localizacao, atual, previsaoDiaria, unidade }) {
    this.localizacao = localizacao;
    this.atual = atual;
    this.previsaoDiaria = previsaoDiaria;
    this.unidade = unidade;
    this.fonte = 'Open-Meteo';
  }
}

module.exports = Clima;
