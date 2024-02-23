const sequelize = require('../db');
const Sequelize = require('sequelize');

const ArticleView = sequelize.define("articleViews", {
   id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
   },
   userId: {
        type: Sequelize.INTEGER,
        allowNull: false
   },
   articleId: {
        type: Sequelize.INTEGER,
        allowNull: false
   },
});

module.exports = ArticleView;