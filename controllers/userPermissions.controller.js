const db = require('../models');
const Op = require('../db')
const { restart } = require('nodemon');
const users = require("./user.controller.js");
const User = db.users

// Create and Save a new userPermission
exports.create = (req, res) => {
    // Validate request
    if (!req.body.userId) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }
    if (!req.body.permissions) {
        permSet: {}
    }

    // Create a userPermission
    const userPermission = {
        userId: req.body.userId,
        permissions: permSet
    };
    // Save userPermission in the database
    UserPermission.create(userPermission)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the userPermission."
        });
      });
  };

// Retrieve all userPermission from the database.
exports.findAll = (req, res) => {  
    UserPermission.findAll({attributes: ['id', 'userId','permissions']})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving userPermission."
        });
      });
  };
  

// Find a single UserPermission with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    UserPermission.findByPk(id)
      .then(data => {
        if (data) {
            res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find UserPermission with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving UserPermission with id=" + id
        });
      });
  };

// Find userPermission by user id
exports.findUserPermissionByUserId = (req, res) => {
    UserPermission.findOne({ where: { userId: req.params.userId } })
    .then(data => {
    res.send(data);
    })
    .catch(err => {
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving userPermission."
    });
    });
};

// Find userPermission by username
exports.findUserPermissionByUsername = async (req, res) => {
    try {
      const user = await User.findOne({ where: { username: req.params.username } });
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }
  
      const userPermission = await UserPermission.findOne({ where: { userId: user.id } });
      res.send(userPermission);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Some error occurred while retrieving userPermission."
      });
    }
};
  

// Update a userPermission by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    
    if (!req.body.bio) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
    }

    UserPermission.update({permissions: req.body.permissions}, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "UserPermission was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update UserPermission with id=${id}. Maybe UserPermission was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating UserPermission with id=" + id
        });
      });
  };

  exports.updateByUserId = (req, res) => {
    const userId = req.params.userId;
    if (!req.params.userId) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
    }

    let updatedPermission;

    if (req.body.permissions) {
        updatedPermission = {
            permissions: req.body.permissions
      }
    } else {
        updatedProfile = {}
    }

    UserPermission.update(updatedPermission, {
      where: { userId: userId }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "UserPermission was updated successfully."
          });
        } else {
          console.log('failed')
          res.send({
            message: `Cannot update UserPermission with userId=${userId}. Maybe UserPermission was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message: "Error updating UserPermission with userId=" + userId
        });
      });
  };

// Delete a UserPermission with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    UserPermission.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Permission was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Permission with id=${id}. Maybe Article was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Permission with id=" + id
        });
      });
  };

// Delete all Article from the database.
exports.deleteAll = (req, res) => {
    UserPermission.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} permissions were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all permissions."
        });
      });
  };
  
