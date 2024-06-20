const db = require('../models');
const Article = db.articles
const { Op } = require('sequelize')
const Sequelize = require('../db')
const { restart } = require('nodemon');
const User = require('../models/user.model'); 
const ArticleView = require('../models/articleView.model.js')

// Create and Save a new Article
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }

    // Create a Article
    const article = {
        title: req.body.title,
        body: req.body.body,
        userId: req.body.userId
    };
    // Save Article in the database
    Article.create(article)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the article."
        });
      });
  };

// Create and Save a new Article for the logged in User
exports.createForUser = (req, res) => {
  // Validate request
  if (!req.body.title) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

  // Create a Article
  const article = {
      title: req.body.title,
      body: req.body.body,
      userId: req.token
  };
  // Save Article in the database
  Article.create(article)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the article."
      });
    });
};

// Retrieve all Articles from the database.
exports.findAll = (req, res) => {  
    Article.findAll({attributes: ['id', 'title','body']})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving articles."
        });
      });
  };
  

// Find 50 most recent articles
exports.findRecent = (req, res) => {
  const page = parseInt(req.params.page, 10)
  let offset = 0;
  if (isNaN(page)) {
    return res.status(422).send({ message: "Bad input! Page must be a number" });
  } else {
    offset = page * 50
  }

  Article.findAll({
    include: [{
      model: User,
      attributes: ['username']
    }],
    where: { parent_article_id: null },
    order: [['createdAt', 'DESC']],
    limit: 50,
    offset: offset,
    attributes: ['id', 'title','body'] 
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving articles."
    });
  });
}

exports.findRecentForUser = (req, res) => {
  const page = parseInt(req.params.page, 10)
  let offset = 0;
  if (isNaN(page)) {
    return res.status(422).send({ message: "Bad input! Page must be a number" });
  } else {
    offset = page * 50
  }

  const userId = parseInt(req.params.userId)

  if (isNaN(userId)) {
    return res.status(422).send({ message: "Bad input! User ID must be a number" });
  }

  Article.findAll({
    include: [{
      model: User,
      attributes: ['username']
    }],
    where: { userId: userId, parent_article_id: null },
    order: [['createdAt', 'DESC']],
    limit: 50,
    offset: offset,
    attributes: ['id', 'title','body'] 
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving articles."
    });
  });
}

exports.topAllTime = (req, res) => {
  const page = parseInt(req.params.page, 10)
  let offset = 0;
  if (isNaN(page)) {
    return res.status(422).send({ message: "Bad input! Page must be a number" });
  } else {
    offset = page * 50
  }

  Article.findAll({
    attributes: [
      [Sequelize.col('articles.id'), 'id'],
      [Sequelize.col('articles.title'), 'title'],
      [Sequelize.col('articles.body'), 'body'],
      [Sequelize.col('articles.userId'), 'userId'],
      [Sequelize.fn('COUNT', Sequelize.col('articleViews.id')), 'viewCount']
    ],
    include: [{
        model: ArticleView,
        required: false,
        duplicating: false,
        attributes: []
      },
      {
        model: User,
        required: false,
        attributes: ['username']
    }],
    where: { parent_article_id: null },
    group: ['articles.id', 'user.id'],
    order: [['viewCount', 'DESC']],
    limit: 50,
    offset: offset
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving articles."
    });
  });
}

exports.topAllTimeForUser = (req, res) => {
  const page = parseInt(req.params.page, 10)
  let offset = 0;
  if (isNaN(page)) {
    return res.status(422).send({ message: "Bad input! Page must be a number" });
  } else {
    offset = page * 50
  }

  const userId = parseInt(req.params.userId)

  if (isNaN(userId)) {
    return res.status(422).send({ message: "Bad input! User ID must be a number" });
  }

  Article.findAll({
    attributes: [
      [Sequelize.col('articles.id'), 'id'],
      [Sequelize.col('articles.title'), 'title'],
      [Sequelize.col('articles.body'), 'body'],
      [Sequelize.col('articles.userId'), 'userId'],
      [Sequelize.fn('COUNT', Sequelize.col('articleViews.id')), 'viewCount']
    ],
    include: [{
        model: ArticleView,
        required: false,
        duplicating: false,
        attributes: []
      },
      {
        model: User,
        required: false,
        attributes: ['username']
    }],
    group: ['articles.id', 'user.id'],
    order: [['viewCount', 'DESC']],
    where: { userId: userId, parent_article_id: null },
    limit: 50,
    offset: offset
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving articles."
    });
  });
}

exports.addReplyToArticle = async (req, res) => {
  // Validate request
  if (!req.body.parent_article_id) {
      res.status(400).send({
        message: "Reply must have a parent article!"
      });
      return;
  }

  const parent_article_id = req.body.parent_article_id

  const parent_article = await Article.findOne({ where: { id: parent_article_id, parent_article_id: null } })
  if (!parent_article) {
    res.status(400).send({
        message: "Parent article must be valid"
      });
  }

  // count positions
  const latestQuery = await Article.findAll({
    attributes: ['id', 'parent_article_id', 'thread_position'],
    order: [['thread_position', 'DESC']],
    where: { parent_article_id: parent_article_id },
    limit: 1,
  })

  // Create a Article
  const article = {
      body: req.body.body,
      userId: req.token,
      thread_position: (latestQuery.length > 0) ? latestQuery[0].thread_position + 1 : 0,
      parent_article_id: parent_article_id,
  };

  // Save Article in the database
  Article.create(article)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the article."
      });
    });
};

exports.findReplies = (req, res) => {
  const page = parseInt(req.params.page, 10)
  let offset = 0;
  if (isNaN(page)) {
    return res.status(422).send({ message: "Bad input! Page must be a number" });
  } else {
    offset = page * 2
  }

  Article.findAll({
    include: [{
      model: User,
      attributes: ['username']
    }],
    where: { parent_article_id: req.params.parent_article_id },
    limit: 50,
    order: [['thread_position', 'DESC']],
    offset: offset,
    attributes: ['id', 'title','body', 'thread_position', 'parent_article_id'] 
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving articles."
    });
  });
}

exports.countReplies = (req, res) => {
  Article.count({
    where: { parent_article_id: req.params.parent_article_id }
  })
  .then(count => {
    res.send({count: count});
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving articles."
    });
  });
}



// Find a single Article with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Article.findByPk(id, {include: [{
      model: User,
      attributes: ['username']
    }]})
      .then(data => {
        if (data) {
            res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Article with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Article with id=" + id
        });
      });
  };

// Find Articles by user id
exports.findArticleByUserId = (req, res) => {
    Article.findAll({ where: { userId: req.params.userId } })
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

// Find Articles by username
exports.findArticleByUsername = async (req, res) => {
    try {
      const user = await User.findOne({ where: { username: req.params.username } });
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }
  
      const articles = await Article.findAll({ where: { userId: user.id } });
      res.send(articles);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Some error occurred while retrieving articles."
      });
    }
};
  

// Update a Article by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Article.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Article was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Article with id=${id}. Maybe Article was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Article with id=" + id
        });
      });
  };

// Delete a Article with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Article.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Article was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Article with id=" + id
        });
      });
  };

// Delete all Article from the database.
exports.deleteAll = (req, res) => {
    Article.destroy({
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
  
