module.exports = app => {
    const articleViews = require("../controllers/articleView.controller.js")
    const {verifyToken, verifyAdmin} = require('../middleware/authmiddleware.js');
    const {normalCreateRateLimit, extremeCreateRateLimit} = require('../middleware/ratelimit.js')
    var router = require("express").Router();

    // Create a new articleView
    router.post("/forUser", [verifyToken, normalCreateRateLimit, extremeCreateRateLimit], articleViews.createForUser);
    
    // Create a new articleView
    router.post("/", verifyAdmin, articleViews.create);
    
    // Retrieve all articleViews
    router.get("/", verifyToken, articleViews.findAll);

    // Retrieve a single articleView with id
    router.get("/:id", verifyAdmin, articleViews.findOne);

    // Retrieve a single articleView with userId
    router.get("/byUserId/:userId", verifyAdmin, articleViews.findArticleViewsByUserId);

    // Retrieve a single articleView with articleId
    router.get("/byArticleId/:articleId", verifyAdmin, articleViews.findArticleViewsByArticleId);

    // Update a articleView with id
    router.put("/:id", verifyAdmin, articleViews.update);

    // Delete a articleView with id
    router.delete("/:id", verifyAdmin, articleViews.delete);

    // Delete all articleViews
    router.delete("/", verifyAdmin, articleViews.deleteAll);

    app.use('/api/articleViews', router);
};