const sequelize = require('../db');
const Sequelize = require('sequelize');

const UserPermission = sequelize.define("userPermissions", {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
   },
   permissions: {
    type: Sequelize.JSONB,
    allowNull: false
   }
});

module.exports = UserPermission;