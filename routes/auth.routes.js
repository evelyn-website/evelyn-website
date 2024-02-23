module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const db = require('../models');
    const User = db.users
    const UserProfile = db.userProfiles
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const users = require("../controllers/user.controller.js");

    // User registration
    // router.post('/register', async (req, res) => {
    //     try{
    //         // Validate request
    //         if (!req.body.username) {
    //           res.status(400).send({
    //             message: "Content can not be empty!"
    //           });
    //           return;
    //         }

    //       // Create a User
    //       const user = {
    //           username: req.body.username,
    //           email: req.body.email,
    //           password: req.body.password
    //       };
      
    //       let salt = bcrypt.genSaltSync(10);
    //       user.password = bcrypt.hashSync(user.password, salt);
          
    //       const savedUser = await User.create(user);
    //       // Create the userProfile alongside the User
    //       const userProfile = await UserProfile.create({
    //         userId: savedUser.id 
    //       });      

    //       res.send(savedUser); 

    //       }
    //       catch (err) {
    //         res.status(500).send({
    //           message: err.message || "Some error occurred while creating the user."
    //         });
    //       }
    // });

    // User login
    router.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log(username)
            const user = await User.findOne({ where: { username: username } })
            if (!user) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: '24h',
        });
        res.cookie('jwtToken', token, { httpOnly: true }); 
        res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    });

    router.post('/logout', async (req, res) => {
        try {
          res.clearCookie('jwtToken', { httpOnly: true });
          res.status(200).json({ message: 'Logged out successfully' }); 
        } catch (error) {
          console.error("Error logging out:", error);
          res.status(500).json({ error: 'Logout failed' });
        }
      });
      
    app.use('/auth', router);
}

   