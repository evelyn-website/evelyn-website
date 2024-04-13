var homepagelink = document.getElementById('homepagelink')
var articledisplay = document.getElementById('articledisplay')
var prevnext = document.getElementById('prevnext')
var listTitle = document.getElementById('listTitle')
var articleTable = document.getElementById("articleTable")
var userTable = document.getElementById('userTable')
var backToAuthors = document.getElementById('backToAuthors')
var backToArticles = document.getElementById('backToArticles')
var selectedArticleTitle = document.getElementById('selectedArticleTitle')
var authorName = document.getElementById('authorName')
var authorBy = document.getElementById('authorBy')
var articleDisplay = document.getElementById('articleDisplay')
var articleBody = document.getElementById('articleBody')
var lists = document.getElementById('lists')

let articles;
let loggedInUser;

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
  });

  return await response.json();
}

async function getUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      return null;
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

async function fetchUser() {
  try {
    loggedInUser = await getUser('fromJWT');
    if (!loggedInUser) {
      window.location.href = '/';
      return;
    }
  } catch (error) {
    console.error(error);
  }
}

async function getAllUsers() {
  const response = await fetch('/api/users/');
  let users = await response.json();
  return users;
}

backToAuthors.addEventListener('click', (e) => {
  e.preventDefault();
  showAuthorsList();
  backToAuthors.style.display = 'none'
  backToArticles.style.display = 'none'
});

backToArticles.addEventListener('click', (e) => {
  e.preventDefault();
  showArticlesList();
  backToArticles.style.display = 'none'
});

async function showArticlesList(){
  articleDisplay.style.display = 'none'
  lists.style.display = 'block'
}

async function showAuthorsList(){
  lists.style.display = 'block'
  listTitle.textContent = 'List of Authors:'
  articleTable.style.display = 'none'
  articleTable.textContent = ''
  userTable.style.display = 'block'
  articleDisplay.style.display = 'none'
}

function showUsersInTable(users) {
  listTitle.style.display = 'block';
  counter = 0;
  for (const user of users) {
    var row = userTable.insertRow(counter);
    var cell = row.insertCell(0);
    cell.innerHTML = `<a href="">${user.username}</a>`;
    cell.addEventListener('click', (e) => {
      e.preventDefault();
      showAllTitlesForUser(user);
    });
    counter++;
  }
}

async function showAllTitlesForUser(user){
  const articles = await getArticles(user.id)
  listTitle.textContent = 'List of Articles:'
  userTable.style.display = 'none'
  articleTable.style.display = 'inline-block'
  backToAuthors.style.display = 'block'
  counter = 0;
  if (articles.length != 0) {
    for (const article of articles) {
      var row = articleTable.insertRow(counter);
      var titleCell = row.insertCell(0);
      titleCell.innerHTML = `<a href="">${article.title}</a>`;
      titleCell.addEventListener('click', (e) => {
        e.preventDefault();
        showArticle(article,user);
      });
      counter++;
    }
  } else {
    var row = articleTable.insertRow()
    var noArticles = row.insertCell(0)
    noArticles.innerHTML = `<h4>No articles for user ${user.username}</h4>`
  }
}

async function showArticle(article,user){
  lists.style.display = 'none'
  articleDisplay.style.display = 'block'
  backToArticles.style.display = 'block'
  selectedArticleTitle.textContent = article.title
  authorName.innerText = user.username
  articleBody.textContent = article.body
  postData('/api/articleViews/forUser',{articleId: article.id})
}

async function getArticles(userId) {
  const response = await fetch(`/api/articles/byUserId/${userId}`);
  const articles = await response.json();
  return articles;
}

window.addEventListener('DOMContentLoaded', async function(e){
  e.preventDefault()
  try {
  fetchUser()
  const listUsers = await getAllUsers();
  showUsersInTable(listUsers)
  } catch (error) {
    console.error('Error:', error);
  }
});