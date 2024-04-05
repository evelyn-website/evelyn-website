const sequelize = require('../db');
const Sequelize = require('sequelize');

const User = sequelize.define("users", {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   username: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
      validate: {
         not: /\s/g 
       }   
   },
   email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
   },
   password: {
      type: Sequelize.STRING,
      allowNull: false
   },
});

module.exports = User;