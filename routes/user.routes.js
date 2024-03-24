module.exports = app => {
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();
  const {verifyToken, verifyAdmin} = require('../middleware/authmiddleware.js');

  // Create a new User
  router.post("/", verifyAdmin, users.create);

  // Retrieve all Users
  router.get("/", verifyToken, users.findAll);

   // Retrieve a single User from JWT
   router.get("/fromJWT/", verifyToken, users.getUserFromJWT);

  // Retrieve a single User with id
  router.get("/:id", verifyToken, users.findOne);

  // Update a User with id
  router.put("/:id", verifyAdmin, users.update);

  // Delete a User with id
  router.delete("/:id", verifyAdmin, users.delete);

  // Delete all Users
  router.delete("/", verifyAdmin, users.deleteAll);

  app.use('/api/users', verifyToken, router);
};