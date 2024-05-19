port = 3000
const express = require('express');
const path = require('path');
const { globalRateLimiter } = require('./middleware/ratelimit')
const cors = require('cors')

const app = express();
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded form data 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const cookieParser = require('cookie-parser');
app.use(cookieParser());

const corsOptions = {
  origin: ['https://evelynwebsite.com', 'http://localhost:3000']
}
app.use(cors(corsOptions))

// Standard auth middleware
app.use((req, res, next) => {
  try {
    const token = req.cookies.jwt;
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

// Rate Limiting

app.use(globalRateLimiter)


// Routes

// Homepages

app.get('/login', function (req, res) {
  res.sendFile('login.html',  {root: './pages/login'});
});

app.get('/', function (req,res) {
  res.sendFile('feed.html', {root: './pages/feed'});
})

// Auth Pages


app.get('/reset-password', function (req, res) {
  res.sendFile('reset_password.html', {root: './pages/password-reset'})
})

app.get('/change-password', function (req, res) {
  res.sendFile('change_password.html', {root: './pages/password-reset'})
})




// Profiles

app.get('/profiles/:username', function(req, res) {
  res.sendFile('profile-template.html', {root: './pages/profiles'})
})

app.get('/profiles/:username/get-username', async (req, res) => {
  const username = req.params.username;
  res.json({ username });
});


require("./routes/user.routes")(app);
require("./routes/userProfile.routes")(app);
require("./routes/article.routes")(app);
require("./routes/articleView.routes")(app);
require("./routes/auth.routes")(app);

app.listen(port, function () {
  console.log(`App now listening on port ${port}!`);
});