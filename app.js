port = 3000
const express = require('express');
const path = require('path'); // For path handling


const app = express();
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded form data 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use((req, res, next) => {
  try {
    const token = req.cookies.jwtToken;
    if (token) {
      req.header('Authorization', `Bearer ${token}`); 
      req.token = token;
    }   
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/', function (req, res) {
  res.sendFile('homepage.html',  {root: './pages/homepage'});
});

app.get('/feed', function (req,res) {
  res.sendFile('feed.html', {root: './pages/feed'});
})

app.get('/signin', function (req, res) {
  res.sendFile('signin.html',  {root: './pages/signin'});
});

app.get('/signup', function (req, res) {
  res.sendFile('signup.html',  {root: './pages/signup'});
});

app.get('/reset-password', function (req, res) {
  res.sendFile('password_reset.html', {root: './pages/signin'})
})

app.get('/articles/write', function (req, res) {
  res.sendFile('write.html',  {root: './pages/articles'});
});

app.get('/articles/read', function (req, res) {
  res.sendFile('read.html',  {root: './pages/articles'});
});

app.get('/articles/readall', function (req, res) {
  res.sendFile('readall.html',  {root: './pages/articles'});
});

app.get('/myprofile', function (req, res) {
  res.sendFile('myProfile.html', {root: './pages/profiles'})
});

require("./routes/user.routes")(app);
require("./routes/userProfile.routes")(app);
require("./routes/article.routes")(app);
require("./routes/articleView.routes")(app);
require("./routes/auth.routes")(app);

app.listen(port, function () {
  console.log(`App now listening on port ${port}!`);
});