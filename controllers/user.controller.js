const db = require('../models');
const User = db.users
const UserProfile = db.userProfiles
const Op = require('../db')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const { restart } = require('nodemon');
const UserPermission = require('../models/userPermission.model');

const saltRounds = 10;


// Create and Save a new User
exports.create = async (req, res) => {
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
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    let salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    
    const savedUser = await User.create(user);

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
  };

exports.findAll = (req, res) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    User.findAll({ attributes: ['id', 'username', 'email'] })
      .then(data => {
        res.send(data); 
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving users."
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Gets user from JWT
exports.getUserFromJWT = (req, res) => {
    const id = req.token
    User.findByPk(id,{attributes: ['id', 'username','email','createdAt','updatedAt']})
    .then(data => {
      if (data) {
          res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id} from JWT.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    User.findByPk(id,{attributes: ['id', 'username','email','createdAt','updatedAt']})
      .then(data => {
        if (data) {
            res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
  };

  exports.findOneSafe = (req, res) => {
    const id = req.params.id;
  
    User.findByPk(id,{attributes: ['id', 'username','createdAt','updatedAt']})
      .then(data => {
        if (data) {
            res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
  };

  
// Find Users by email address
exports.findUserByEmail = (req, res) => {
    User.findOne({ where: { email: req.params.email } })
    .then(data => {
    res.send(data);
    })
    .catch(err => {
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving users."
    });
    });
};

// Find Users by username
exports.findUserByUsername = (req, res) => {
    User.findOne({ where: { username: req.params.username } })
    .then(data => {
    res.send(data);
    })
    .catch(err => {
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving users."
    });
    });
};

exports.getUserWithProfile = (req, res) => {
    try {
      User.findOne({
          attributes: ['id', 'username', 'email'],
          where: { username: req.params.username },
          include: [{
            model: UserProfile,
            attributes: ['bio', 'birthday', 'createdAt']
          }],
        })
        .then(user => {
          if (!user) {
            res.send({error: 'noUserError'})
          } else {
            res.send(user)
          }
        })
        .catch(error => {
          console.log('error', error)
          res.status(500).json({ error: 'Error while retrieving user with profile'})
        })
    } catch (error) {
      console.log('error', error)
      res.status(500).json({ error: 'Error while retrieving user with profile'})
    }
}

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    User.update(req.body, {
      where: { id: id }
    })
      .then(num => {
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
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
  };

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  };

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Users were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all users."
        });
      });
  };
  
