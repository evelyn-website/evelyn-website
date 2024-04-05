const sequelize = require('../db');
const Sequelize = require('sequelize');

const User = require('../models/user.model');
const Article = require('../models/article.model');
const UserProfile = require('../models/userProfile.model')
const UserPermission = require('../models/userPermission.model')
const hash = require('hash-util');
const ArticleView = require('./articleView.model');
const db = {
    users: User,
    articles: Article,
    userProfiles: UserProfile,
    articleViews: ArticleView,
    userPermissions: UserPermission, 
}   

User.hasMany(Article, {onDelete: 'CASCADE'});
Article.belongsTo(User)
User.hasOne(UserProfile, {onDelete: 'CASCADE'});
User.hasOne(UserPermission, {onDelete: 'CASCADE'})
User.hasMany(ArticleView);
Article.hasMany(ArticleView, {onDelete: 'CASCADE'});

sequelize
    .sync({})
    .then(conn => {
    })
    .then(user => {
        return Promise.all([
            // Article.create({title: 'test article',body: 'test body', userId: user.id}),
        ])
    })
    .then(article => {
        return Promise.all([])
    })
    .then(userProfile => {
        return Promise.all([])
    })
    .then(articleView => {
        return Promise.all([])
    })
    .then(userPermission => {
        return Promise.all([])
    })
    .catch(err => {
        console.error('Error:', err);
    })


module.exports = db