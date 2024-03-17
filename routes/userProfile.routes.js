module.exports = app => {
    const userProfiles = require("../controllers/userProfile.controller.js");
    const authMiddleware = require('../middleware/authmiddleware.js');
    var router = require("express").Router();
  
    // Create a new userProfile
    router.post("/", [authMiddleware.verifyToken], userProfiles.create);
  
    // Retrieve all userProfiles
    router.get("/", [authMiddleware.verifyToken], userProfiles.findAll);
  
    // Retrieve a single userProfile with id
    router.get("/:id", [authMiddleware.verifyToken], userProfiles.findOne);

    // Retrieve a single userProfile with userId
    router.get("/byUserId/:userId", [authMiddleware.verifyToken], userProfiles.findUserProfileByUserId);

    // Retrieve a single userProfile with userId
    router.get("/byUsername/:username", [authMiddleware.verifyToken], userProfiles.findUserProfileByUsername);

    // Update a userProfile with id
    router.put("/:id", [authMiddleware.verifyToken], userProfiles.update);

    // Update a userProfile with userId
    router.put("/byUserId/:userId", [authMiddleware.verifyToken], userProfiles.updateByUserId);
  
    // Delete a userProfile with id
    router.delete("/:id", [authMiddleware.verifyToken], userProfiles.delete);
  
    // Delete all userProfiles
    router.delete("/", [authMiddleware.verifyToken], userProfiles.deleteAll);
  
    app.use('/api/userProfiles', router);
  };