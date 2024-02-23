const sequelize = require('sequelize');
const Op = sequelize.Op;
require('dotenv').config();
const DEV_DATABASE_HOST = process.env.DEV_DATABASE_HOST
const DEV_DATABASE_NAME = process.env.DEV_DATABASE_NAME
const DEV_DATABASE_USER = process.env.DEV_DATABASE_USER
const DEV_DATABASE_PASS = process.env.DEV_DATABASE_PASS

const Sequelize = new sequelize.Sequelize(
   DEV_DATABASE_NAME,
   DEV_DATABASE_USER,
   DEV_DATABASE_PASS,
    {
      host: DEV_DATABASE_HOST,
      dialect: 'postgres',
      port: '5432'
    }
);

module.exports = Sequelize;
