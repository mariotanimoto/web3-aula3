'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'perfil', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'usuario',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'perfil');
  },
};
