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
   },
   body: {
      type: Sequelize.TEXT,
   },
   userId: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
   parent_article_id: {
      type: Sequelize.INTEGER
   },
   thread_position: {
      type: Sequelize.INTEGER
   }
});

module.exports = Article;

