const sequelize = require('../db');
const Sequelize = require('sequelize');

const UserProfile = sequelize.define("userProfiles", {
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
   bio: {
      type: Sequelize.TEXT,
   },
   birthday: {
      type: Sequelize.DATEONLY,
   },
});

module.exports = UserProfile;