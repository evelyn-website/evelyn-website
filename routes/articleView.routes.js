module.exports = app => {
    const articleViews = require("../controllers/articleView.controller.js")
    const verifyToken = require('../middleware/authmiddleware.js');
    var router = require("express").Router();

    // Create a new articleView
    router.post("/", verifyToken, articleViews.create);
    
    // Retrieve all articleViews
    router.get("/", verifyToken, articleViews.findAll);

    // Retrieve a single articleView with id
    router.get("/:id", verifyToken, articleViews.findOne);

    // Retrieve a single articleView with userId
    router.get("/byUserId/:userId", verifyToken, articleViews.findArticleViewsByUserId);

    // Retrieve a single articleView with articleId
    router.get("/byArticleId/:articleId", verifyToken, articleViews.findArticleViewsByArticleId);

    // Update a articleView with id
    router.put("/:id", verifyToken, articleViews.update);

    // Delete a articleView with id
    router.delete("/:id", verifyToken, articleViews.delete);

    // Delete all articleViews
    router.delete("/", verifyToken, articleViews.deleteAll);

    app.use('/api/articleViews', router);
};