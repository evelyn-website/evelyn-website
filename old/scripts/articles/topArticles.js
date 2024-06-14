var homepagelink = document.getElementById('homepagelink')
var articledisplay = document.getElementById('articledisplay')
var prevnext = document.getElementById('prevnext')
var listTitle = document.getElementById('listTitle')
var articleTable = document.getElementById("articleTable")
var backToTopArticles = document.getElementById('backToTopArticles')
var selectedArticleTitle = document.getElementById('selectedArticleTitle')
var authorName = document.getElementById('authorName')
var authorBy = document.getElementById('authorBy')
var articleDisplay = document.getElementById('articleDisplay')
var articleBody = document.getElementById('articleBody')
var lists = document.getElementById('lists')

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

window.addEventListener('DOMContentLoaded', async function(e){
    e.preventDefault()
    try {
        fetchUser()
    } catch (error) {
        console.error('Error:', error);
    }
});