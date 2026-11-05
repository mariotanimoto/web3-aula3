'use strict';

// Compatibility entry point for code using the conventional Sequelize models path.
const Usuario = require('../src/models/Usuario');
const { sequelize } = require('../src/instances/mysql');
const Sequelize = require('sequelize');

module.exports = { Usuario, sequelize, Sequelize };
