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
    const fs = require('fs')
    const path = require('path')
    const { promisify } = require('util')
    require('dotenv').config()
    const users = require("../controllers/user.controller.js");
    const { verifyResetToken } = require('../middleware/auth-middleware.js');
    const {normalCreateRateLimit, extremeCreateRateLimit, resetEmailRateLimit, globalRateLimiter} = require('../middleware/ratelimit.js')

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
          responseUser = { user: savedUser.username, email: savedUser.email }
          res.status(200).send(responseUser); 
          }
          catch (err) {
            res.status(500).send({
              message: err.message || "Some error occurred while creating the user."
            });
          }
    });

    // User login
    router.post('/login', [globalRateLimiter, normalCreateRateLimit], async (req, res) => {
        try {
            let { username, password } = req.body;
            username = username.trim()
            password = password.trim()
            if (!(username && password)) {
              res.status(400).send({
              message: "Content can not be empty!"
              });
              return;
            }
            const user = await User.findOne({ where: { username: username } })
            if (!user) {
                return res.status(401).json({ error: 'Incorrect username or password' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Incorrect username or password' });
            }
            const userPermission = await UserPermission.findOne({ where: {userId: user.id} })
            if (!userPermission) {
              UserPermission.create({userId: user.id, permissions: {}})
            }
            const token = jwt.sign({ userId: user.id, permissions: userPermission.permissions, login: true }, process.env.JWT_SECRET, {
                expiresIn: '24h',
            })
          res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict'}); 
          res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    });

    router.post('/logout', async (req, res) => {
        try {
          res.clearCookie('jwt', { httpOnly: true });
          res.status(200).json({ message: 'Logged out successfully' }); 
        } catch (error) {
          console.error("Error logging out:", error);
          res.status(500).json({ error: 'Logout failed' });
        }
      });


    // password reset

    const readFile = promisify(fs.readFile);

    router.post('/reset-password-email', [resetEmailRateLimit], async (req, res) => {
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
      if (!email) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }
      const user = await User.findOne({ where: { email: email } })
      if (!user) {
        res.status(422) 
        return;
      } else {

      const resetToken = jwt.sign({ userId: user.id, login: false, passwordReset: true }, process.env.JWT_SECRET, {
          expiresIn: '20m',
      })
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: req.body.email,
        subject: "Evelyn Website Password Reset",
        text: "Forgot Your Password? \n Click the link to reset it. \n \n If you didn't request a password reset, probably just let me know and we can investigate.",
        html: await readFile(path.resolve(__dirname, '../pages/email-templates/reset-template.html'), 'utf8')
        .then(htmlString => htmlString.replace('[resetTokenPlaceholder]', `${resetToken}`)),
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


    router.get('/userCheckEmail/:email', [globalRateLimiter, normalCreateRateLimit], async (req, res) => {
      try {
        if (!email) {
          res.status(400).send({
            message: "Content can not be empty!"
          });
          return;
        }
        const email = req.params.email.trim()
        const user = await User.findOne({ where: { email: email } })
            if (user) {
              res.send(true)
            } else {
              res.send(false)
            }
      } catch (error) {
        res.status(500).json({ error: 'Error checking if user exists' });
      }
    })

    router.get('/userCheckUsername/:username', [globalRateLimiter, normalCreateRateLimit], async (req, res) => {
      try {
        const username = req.params.username.trim()
        if (!username) {
          res.status(400).send({
            message: "Content can not be empty!"
          });
          return;
        }
        const user = await User.findOne({ where: { username: username } })
            if (user) {
              res.send(true)
            } else {
              res.send(false)
            }
      } catch (error) {
        res.status(500).json({ error: 'Error checking if user exists' });
      }
    })

    router.get('/resetLink/:resetToken', async (req, res) => {
      try {
        const resetToken = req.params.resetToken
        res.cookie('resetToken', resetToken, { httpOnly: true }); 
        res.redirect("/change-password") 
      } catch (error) {
        console.log('error', error)
        res.status(500).json({ error: 'Error assigning reset token'})
      }
    })


    router.put('/changePassword', [verifyResetToken], async (req, res) => {
      try {
        const userId = req.token
        if (!userId) {
          res.status(401)
          return;
        }

        let salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(req.body.password, salt);

        User.update({password: password}, {
          where: { id: userId }
        }).then(num => {
            if (num == 1) {
              res.send({
                message: "User was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
              });
            }
        })
        res.clearCookie('resetToken', { httpOnly: true });
      } catch (error) {
        res.status(500).json({ error: 'Error updating password'})
      }
    })
      
    app.use('/auth', router);
}

   