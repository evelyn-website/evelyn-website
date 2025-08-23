const sequelize = require('sequelize');
const Op = sequelize.Op;
require('dotenv').config();
const DB_URL = process.env.DB_URL

const Sequelize = new sequelize.Sequelize(DB_URL);

module.exports = Sequelize;
