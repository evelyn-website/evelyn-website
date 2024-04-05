const sequelize = require('../db');
const Sequelize = require('sequelize');

const Article = sequelize.define("articles", {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   title: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   body: {
      type: Sequelize.TEXT,
   },
   userId: {
      type: Sequelize.INTEGER,
      allowNull: false
   }
});

module.exports = Article;

