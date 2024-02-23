module.exports = app => {
    const articles = require("../controllers/article.controller.js");
    const verifyToken = require('../middleware/authmiddleware.js');
    var router = require("express").Router();
  
    // Create a new Article
    router.post("/", verifyToken, articles.create);
  
    // Retrieve all articles
    router.get("/", verifyToken, articles.findAll);
  
    // Retrieve a single article with id
    router.get("/:id", verifyToken, articles.findOne);

    // Retrieve a single Article with userId
    router.get("/byUserId/:userId", verifyToken, articles.findArticleByUserId);

    // Retrieve a single Article with userId
    router.get("/byUsername/:username", verifyToken, articles.findArticleByUsername);

    // Update a article with id
    router.put("/:id", verifyToken, articles.update);
  
    // Delete a article with id
    router.delete("/:id", verifyToken, articles.delete);
  
    // Delete all articles
    router.delete("/", verifyToken, articles.deleteAll);
  
    app.use('/api/articles', verifyToken, router);
  };