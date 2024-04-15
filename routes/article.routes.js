module.exports = app => {
    const articles = require("../controllers/article.controller.js");
    const {verifyToken, verifyAdmin} = require('../middleware/auth-middleware.js');
    const {normalCreateRateLimit, extremeCreateRateLimit} = require('../middleware/ratelimit.js')
    var router = require("express").Router();

    // Create a new Article
    router.post("/forUser", [verifyToken, normalCreateRateLimit, extremeCreateRateLimit], articles.createForUser);
  
    // Create a new Article
    router.post("/", verifyAdmin, articles.create);
  
    // Retrieve all articles
    router.get("/", verifyToken, articles.findAll);

    // Retrieve the 50 most recent articles
    router.get("/recent/:page", verifyToken, articles.findRecent)

    router.get('/topAllTime/:page', verifyToken, articles.topAllTime)
  
    // Retrieve a single article with id
    router.get("/:id", verifyToken, articles.findOne);

    // Retrieve a single Article with userId
    router.get("/byUserId/:userId", verifyToken, articles.findArticleByUserId);

    // Update a article with id
    router.put("/:id", verifyAdmin, articles.update);
  
    // Delete a article with id
    router.delete("/:id", verifyAdmin, articles.delete);
  
    // Delete all articles
    router.delete("/", verifyAdmin, articles.deleteAll);
  
    app.use('/api/articles', verifyToken, router);
  };