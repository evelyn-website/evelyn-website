module.exports = app => {
    const userProfiles = require("../controllers/userProfile.controller.js");
    const {verifyToken} = require('../middleware/authmiddleware.js');
    var router = require("express").Router();
  
    // Create a new userProfile
    router.post("/", verifyToken, userProfiles.create);
  
    // Retrieve all userProfiles
    router.get("/", verifyToken, userProfiles.findAll);
  
    // Retrieve a single userProfile with id
    router.get("/:id", verifyToken, userProfiles.findOne);

    // Retrieve a single userProfile with userId
    router.get("/byUserId/:userId", verifyToken, userProfiles.findUserProfileByUserId);

    // Retrieve a single userProfile with userId
    router.get("/byUsername/:username", verifyToken, userProfiles.findUserProfileByUsername);

    // Update a userProfile with id
    router.put("/:id", verifyToken, userProfiles.update);

    // Update a userProfile with userId
    router.put("/byUserId/:userId", verifyToken, userProfiles.updateByUserId);
  
    // Delete a userProfile with id
    router.delete("/:id", verifyToken, userProfiles.delete);
  
    // Delete all userProfiles
    router.delete("/", verifyToken, userProfiles.deleteAll);
  
    app.use('/api/userProfiles', router);
  };