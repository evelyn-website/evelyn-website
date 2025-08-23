const sequelize = require('../db');
const Sequelize = require('sequelize');

const User = sequelize.define("users", {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   username: {
      type: Sequelize.CITEXT,
      allowNull: false,
      validate: {
         not: /\s/g 
      },
      indexes: [
         {
            unique: true,
            name: 'unique_username',
            fields: [sequelize.fn('lower', sequelize.col('username'))]
          }      
      ]
   },
   email: {
      type: Sequelize.CITEXT,
      allowNull: false,
      indexes: [
         {
            unique: true,
            name: 'unique_email',
            fields: [sequelize.fn('lower', sequelize.col('email'))]
          }      
      ]
   },
   password: {
      type: Sequelize.STRING,
      allowNull: false
   },
});

module.exports = User;