var homepagelink = document.getElementById('homepagelink')
var articledisplay = document.getElementById('articledisplay')
var prevnext = document.getElementById('prevnext')
var previous = document.getElementById('previous')
var next = document.getElementById('next')

let page = 0;
let articles;
let loggedInUser;

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

document.getElementById('previous').addEventListener('click', handleNavigation);
document.getElementById('next').addEventListener('click', handleNavigation);

async function handleNavigation(e) {
  if (e.target.id === 'previous') {
    page--;
  } else {
    page++;
  }
  page = Math.max(0, Math.min(page, articles.length - 1));
  // Ensure page stays within bounds
  updateArticleDisplay();
}

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


function updateArticleDisplay() {
  prevnext.style.display = 'block'
  const artNum = "Article " + (page + 1).toString();
  const title = document.getElementById("title");
  const body = document.getElementById("bd");
  const articleNum = document.getElementById("articleNum");

  articleNum.innerHTML = artNum;
  title.innerHTML = articles[page].title;
  body.innerHTML = articles[page].body;

  if (page === 0) {
    previous.style.display = 'none'
  } else {
    previous.style.display = 'inline-block'
  }
  if (page === (articles.length - 1)) {
    next.style.display = 'none'
  } else {
    next.style.display = 'inline-block'
  }
}

async function getArticles(userId) {
  const response = await fetch(`/api/articles/byUserId/${userId}`);
  const articles = await response.json();
  return articles;
}

window.addEventListener('DOMContentLoaded', async function(e){
  e.preventDefault()
  await fetchUser()
  try {
  articles = await getArticles(loggedInUser.id);
  updateArticleDisplay() 
  } catch (error) {
    console.error('Error:', error);
  }
});
