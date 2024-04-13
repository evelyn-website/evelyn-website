module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const db = require('../models');
    const User = db.users
    const UserProfile = db.userProfiles
    const UserPermission = db.userPermissions
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const nodemailer = require('nodemailer')
    require('dotenv').config()
    const users = require("../controllers/user.controller.js");
    const {normalCreateRateLimit, extremeCreateRateLimit} = require('../middleware/ratelimit.js')

    // User registration
    router.post('/register', [normalCreateRateLimit, extremeCreateRateLimit], async (req, res) => {
        try{
            // Validate request
            if (!req.body.username) {
              res.status(400).send({
                message: "Content can not be empty!"
              });
              return;
            }

          // Create a User
          const user = {
              username: req.body.username.trim(),
              email: req.body.email.trim(),
              password: req.body.password.trim()
          };
      
          let salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
          
          const savedUser = await User.create(user);
          // Create the userProfile alongside the User
          const userProfile = await UserProfile.create({
            userId: savedUser.id 
          });
          
          const userPermission = await UserPermission.create({
            userId: savedUser.id,
            permissions: {}
          })

          res.send(savedUser); 

          }
          catch (err) {
            res.status(500).send({
              message: err.message || "Some error occurred while creating the user."
            });
          }
    });

    // User login
    router.post('/login', async (req, res) => {
        try {
            let { username, password } = req.body;
            username = username.trim()
            password = password.trim()
            const user = await User.findOne({ where: { username: username } })
            if (!user) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const userPermission = await UserPermission.findOne({ where: {userId: user.id} })
            if (!userPermission) {
              UserPermission.create({userId: user.id, permissions: {}})
            }
            const token = jwt.sign({ userId: user.id, permissions: userPermission.permissions }, process.env.JWT_SECRET, {
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


    // password reset
    router.post('/reset-password-email', async (req, res) => {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      })
      const email = req.body.email
      const user = await User.findOne({ where: { email: email } })
      if (!user) {
        res.status(422) 
      } else {
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: req.body.email,
        subject: "Hello from Nodemailer",
        text: "This is a test email sent using Nodemailer.",
      }; 
      try {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email: ", error);
          } else {
            console.log("Email sent: ", info.response);
          }
        });
        
        res.status(200).json({ message: 'Email sent successfully'})
      } catch (error) {
        console.error("Error sending reset email:", error);
        res.status(500).json({ error: 'Sending reset email failed' });
      }
    }})
      
    app.use('/auth', router);
}

   