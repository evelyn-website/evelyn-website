module.exports = app => {
    const userProfiles = require("../controllers/userProfile.controller.js");
    const {verifyToken, verifyAdmin} = require('../middleware/auth-middleware.js');
    var router = require("express").Router();
  
    // Create a new userProfile
    router.post("/", verifyAdmin, userProfiles.create);
  
    // Retrieve all userProfiles
    router.get("/", verifyAdmin, userProfiles.findAll);
  
    // Retrieve a single userProfile with id
    router.get("/:id", verifyAdmin, userProfiles.findOne);

    // Retrieve a single userProfile with userId
    router.get("/byUserId/:userId", verifyAdmin, userProfiles.findUserProfileByUserId);

    // Update a userProfile with userId
    router.put("/bySignedInUser", verifyToken, userProfiles.updateBySignedInUser);

    // Update a userProfile with id
    router.put("/:id", verifyAdmin, userProfiles.update);
  
    // Delete a userProfile with id
    router.delete("/:id", verifyAdmin, userProfiles.delete);
  
    // Delete all userProfiles
    router.delete("/", verifyAdmin, userProfiles.deleteAll);
  
    app.use('/api/userProfiles', router);
  };