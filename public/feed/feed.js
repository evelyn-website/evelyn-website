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

const articles = document.querySelector('.articles')
var articleBoxes = document.querySelectorAll('.article-box')

expandedBoxes = []

function expandHandler(articleBox) {
    articleBox.addEventListener('click', (e) => {
        e.preventDefault();

        if (expandedBoxes.includes(articleBox)) {
            closeBox(articleBox);
        } else {
            expandBox(articleBox)
        }
      });
} 

articleBoxes.forEach(articleBox => {
    expandHandler(articleBox)
});


function expandBox(articleBox) {
    const hiddenBodies = articleBox.querySelectorAll('.article-body-hidden');
    hiddenBodies.forEach(hiddenBody => hiddenBody.classList.replace('article-body-hidden', 'article-body'));
    articleBox.classList.replace('article-box', 'article-box-expanded')
    expandedBoxes.push(articleBox)
}

function closeBox(articleBox) {
    const visibleBodies = articleBox.querySelectorAll('.article-body');
    visibleBodies.forEach(visibleBody => visibleBody.classList.replace('article-body', 'article-body-hidden'));
    articleBox.classList.replace('article-box-expanded', 'article-box')
    const index = expandedBoxes.indexOf(articleBox)
    expandedBoxes.splice(index, 1)
}

function addArticle(title, author, body) {
    const newBox = articles.appendChild(document.createElement("div"))
    const newTitle = newBox.appendChild(document.createElement("div"))
    const newBy = newBox.appendChild(document.createElement("div"))
    const newAuthor = newBox.appendChild(document.createElement("div"))
    const newBody = newBox.appendChild(document.createElement("div"))
    newBox.classList.add('article-box')
    newTitle.classList.add('article-title')
    newBy.classList.add('article-by')
    newAuthor.classList.add('article-author')
    newBody.classList.add('article-body-hidden')
    newTitle.textContent = title;
    newBy.textContent = 'by '
    newAuthor.textContent = author
    newBody.textContent = body
    expandHandler(newBox)
}

async function getRecentArticles() {
    const response = await fetch(`/api/articles/recent`);
    const fetchedArticles = await response.json();
    console.log('fetchedArticles', fetchedArticles)
    fetchedArticles.forEach(article=> {
        console.log('article', article)
        addArticle(article.title, article.user.username, article.body)
    })
}

window.addEventListener('DOMContentLoaded', async function(e){
    e.preventDefault()
    try {
    fetchUser()
    getRecentArticles()
    } catch (error) {
      console.error('Error:', error);
    }
  });