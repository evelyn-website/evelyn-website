require('dotenv').config();
module.exports = {
    "local": {
      "username": process.env.DEV_DATABASE_USER,
      "password": process.env.DEV_DATABASE_PASS,
      "database": process.env.DEV_DATABASE_NAME,
      "host": process.env.DEV_DATABASE_HOST,
      "dialect": "postgres"
    },
  };
  