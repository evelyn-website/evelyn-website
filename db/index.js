const sequelize = require('sequelize');
const Op = sequelize.Op;
require('dotenv').config();
const DEV_DATABASE_HOST = process.env.DEV_DATABASE_HOST
const DEV_DATABASE_NAME = process.env.DEV_DATABASE_NAME
const DEV_DATABASE_USER = process.env.DEV_DATABASE_USER
const DEV_DATABASE_PASS = process.env.DEV_DATABASE_PASS
const DB_URL = process.env.DB_URL

const Sequelize = new sequelize.Sequelize(DB_URL);

module.exports = Sequelize;
