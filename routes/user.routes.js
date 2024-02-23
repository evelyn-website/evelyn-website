module.exports = app => {
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();
  const verifyToken = require('../middleware/authmiddleware.js');

  // Create a new User
  router.post("/", verifyToken, users.create);

  // Retrieve all Users
  router.get("/", verifyToken, users.findAll);

   // Retrieve a single User from JWT
   router.get("/fromJWT/", verifyToken, users.getUserFromJWT);

  // Retrieve a single User with id
  router.get("/:id", verifyToken, users.findOne);

  // Retrieve a single User with email
  router.get("/byEmail/:email", verifyToken, users.findUserByEmail);

  // Retrieve a single User with username
  router.get("/byUsername/:username", verifyToken, users.findUserByUsername);

  // Update a User with id
  router.put("/:id", verifyToken, users.update);

  // Delete a User with id
  router.delete("/:id", verifyToken, users.delete);

  // Delete all Users
  router.delete("/", verifyToken, users.deleteAll);

  app.use('/api/users', verifyToken, router);
};