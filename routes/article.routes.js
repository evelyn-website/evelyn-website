module.exports = app => {
    const articles = require("../controllers/article.controller.js");
    const authMiddleware = require('../middleware/authmiddleware.js');
    var router = require("express").Router();
  
    // Create a new Article
    router.post("/", [authMiddleware.verifyToken], articles.create);
  
    // Retrieve all articles
    router.get("/", [authMiddleware.verifyToken], articles.findAll);
  
    // Retrieve a single article with id
    router.get("/:id", [authMiddleware.verifyToken], articles.findOne);

    // Retrieve a single Article with userId
    router.get("/byUserId/:userId", [authMiddleware.verifyToken], articles.findArticleByUserId);

    // Retrieve a single Article with userId
    router.get("/byUsername/:username", [authMiddleware.verifyToken], articles.findArticleByUsername);

    // Update a article with id
    router.put("/:id", [authMiddleware.verifyToken], articles.update);
  
    // Delete a article with id
    router.delete("/:id", [authMiddleware.verifyToken], articles.delete);
  
    // Delete all articles
    router.delete("/", [authMiddleware.verifyToken], articles.deleteAll);
  
    app.use('/api/articles', [authMiddleware.verifyToken], router);
  };