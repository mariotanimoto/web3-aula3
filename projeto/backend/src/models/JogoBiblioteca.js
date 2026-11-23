const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../instances/mysql');
const Usuario = require('./Usuario');

class JogoBiblioteca extends Model {}

JogoBiblioteca.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' },
      onDelete: 'CASCADE'
    },
    rawgGameId: { type: DataTypes.INTEGER, allowNull: false },
    nome: { type: DataTypes.STRING, allowNull: false },
    imagem: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM('playing', 'completed', 'planned', 'dropped'),
      allowNull: false,
      defaultValue: 'planned'
    },
    genreIds: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    genreNames: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }
  },
  { sequelize, modelName: 'JogoBiblioteca', tableName: 'jogos_biblioteca', timestamps: true, indexes: [{ unique: true, fields: ['usuarioId', 'rawgGameId'] }] }
);

Usuario.hasMany(JogoBiblioteca, { foreignKey: 'usuarioId', as: 'biblioteca' });
JogoBiblioteca.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = JogoBiblioteca;
