module.exports = app => {
    const articleViews = require("../controllers/articleView.controller.js")
    const authMiddleware = require('../middleware/authmiddleware.js');
    var router = require("express").Router();

    // Create a new articleView
    router.post("/", [authMiddleware.verifyToken], articleViews.create);
    
    // Retrieve all articleViews
    router.get("/", [authMiddleware.verifyToken], articleViews.findAll);

    // Retrieve a single articleView with id
    router.get("/:id", [authMiddleware.verifyToken], articleViews.findOne);

    // Retrieve a single articleView with userId
    router.get("/byUserId/:userId", [authMiddleware.verifyToken], articleViews.findArticleViewsByUserId);

    // Retrieve a single articleView with articleId
    router.get("/byArticleId/:articleId", [authMiddleware.verifyToken], articleViews.findArticleViewsByArticleId);

    // Update a articleView with id
    router.put("/:id", [authMiddleware.verifyToken], articleViews.update);

    // Delete a articleView with id
    router.delete("/:id", [authMiddleware.verifyToken], articleViews.delete);

    // Delete all articleViews
    router.delete("/", [authMiddleware.verifyToken], articleViews.deleteAll);

    app.use('/api/articleViews', router);
};