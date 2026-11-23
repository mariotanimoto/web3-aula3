'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    await queryInterface.createTable('jogos_biblioteca', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rawgGameId: { type: Sequelize.INTEGER, allowNull: false },
      nome: { type: Sequelize.STRING, allowNull: false },
      imagem: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM('playing', 'completed', 'planned', 'dropped'),
        allowNull: false,
        defaultValue: 'planned'
      },
      genreIds: { type: Sequelize.JSON, allowNull: false },
      genreNames: { type: Sequelize.JSON, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addConstraint('jogos_biblioteca', {
      fields: ['usuarioId', 'rawgGameId'],
      type: 'unique',
      name: 'unique_user_rawg_game'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('jogos_biblioteca');
    await queryInterface.removeColumn('usuarios', 'googleId');
  }
};
