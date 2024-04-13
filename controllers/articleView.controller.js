const db = require('../models');
const Op = require('../db')
const User = db.users
const Article = db.articles
const  ArticleView = db.articleViews

// Create and Save a new articleView
exports.create = (req, res) => {
    // Validate request
    if (!req.body.userId) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }

    // Create a articleView
    const articleView = {
        userId: req.body.userId,
        articleId: req.body.articleId
    };
    // Save articleView in the database
    ArticleView.create(articleView)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the articleView."
        });
      });
  };

  exports.createForUser = (req, res) => {
    // Validate request
    if (!req.body.articleId) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }

    // Create a articleView
    const articleView = {
        userId: req.token,
        articleId: req.body.articleId
    };
    // Save articleView in the database
    ArticleView.create(articleView)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the articleView."
        });
      });
  };

// Retrieve all ArticleView from the database.
exports.findAll = (req, res) => {  
    ArticleView.findAll({attributes: ['id', 'userId','articleId','createdAt']})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving ArticleView."
        });
      });
  };
  

// Find a single ArticleView with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    ArticleView.findByPk(id)
      .then(data => {
        if (data) {
            res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find ArticleView with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving ArticleView with id=" + id
        });
      });
  };

// Find ArticleView by user id
exports.findArticleViewsByUserId = (req, res) => {
    ArticleView.findAll({ where: { userId: req.params.userId } })
    .then(data => {
    res.send(data);
    })
    .catch(err => {
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving ArticleView."
    });
    });
};

// Find ArticleView by user id
exports.findArticleViewsByArticleId = (req, res) => {
  ArticleView.findAll({ where: { userId: req.params.articleId } })
  .then(data => {
  res.send(data);
  })
  .catch(err => {
  res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving ArticleView."
  });
  });
};

// Update a ArticleView by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    ArticleView.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "ArticleView was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update ArticleView with id=${id}. Maybe ArticleView was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating UserProfile with id=" + id
        });
      });
  };

// Delete an ArticleView with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    ArticleView.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "View was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete View with id=${id}. Maybe View was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete View with id=" + id
        });
      });
  };

// Delete all Views from the database.
exports.deleteAll = (req, res) => {
    ArticleView.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Articles were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all articles."
        });
      });
  };
  

