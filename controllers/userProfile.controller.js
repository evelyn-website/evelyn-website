const db = require('../models');
const Op = require('../db')
const { restart } = require('nodemon');
const users = require("./user.controller.js");
const User = db.users
const UserProfile = db.userProfiles

// Create and Save a new userProfile
exports.create = (req, res) => {
    // Validate request
    if (!req.body.userId) {
        res.status(400).send({
          message: "Content cannot be empty!"
        });
        return;
      }

    // Create a userProfile
    const userProfile = {
        userId: req.body.userId,
        bio: req.body.bio,
        birthday: req.body.birthday
    };
    // Save userProfile in the database
    UserProfile.create(userProfile)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the userProfile."
        });
      });
  };

// Retrieve all userProfile from the database.
exports.findAll = (req, res) => {  
    UserProfile.findAll({attributes: ['id', 'userId','bio','birthday','createdAt']})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving userProfile."
        });
      });
  };
  

// Find a single UserProfile with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    UserProfile.findByPk(id)
      .then(data => {
        if (data) {
            res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find UserProfile with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving UserProfile with id=" + id
        });
      });
  };

// Find userProfile by user id
exports.findUserProfileByUserId = (req, res) => {
    UserProfile.findOne({ where: { userId: req.params.userId } })
    .then(data => {
    res.send(data);
    })
    .catch(err => {
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving userProfile."
    });
    });
};

// Find userProfile by username
exports.findUserProfileByUsername = async (req, res) => {
    try {
      const user = await User.findOne({ where: { username: req.params.username } });
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }
  
      const userProfiles = await UserProfile.findOne({ where: { userId: user.id } });
      res.send(userProfiles);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Some error occurred while retrieving userProfile."
      });
    }
};
  

// Update a userProfile by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    
    if (!req.body.bio) {
        res.status(400).send({
          message: "Content cannot be empty!"
        });
        return;
    }

    const updatedProfile = {
        bio: req.body.bio,
        birthday: req.body.birthday
    }

    UserProfile.update({bio: updatedProfile.bio, birthday: updatedProfile.birthday}, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "UserProfile was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update UserProfile with id=${id}. Maybe UserProfile was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating UserProfile with id=" + id
        });
      });
  };

  exports.updateBySignedInUser = (req, res) => {

    const userId = req.token

    if (!userId) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
    }

    let updatedProfile;

    updatedProfile = {
      bio: req.body.bio,
      birthday: req.body.birthday
    }

    UserProfile.update(updatedProfile, {
      where: { userId: userId }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "UserProfile was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update UserProfile with userId=${userId}. Maybe UserProfile was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        console.error(err)
        res.status(500).send({
          message: "Error updating UserProfile with userId=" + userId
        });
      });
  };

// Delete a UserProfile with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    UserProfile.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Profile was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete profile with id=${id}. Maybe profile was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete profile with id=" + id
        });
      });
  };

// Delete all Profiles from the database.
exports.deleteAll = (req, res) => {
    UserProfile.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Profiles were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all profiles."
        });
      });
  };
  
