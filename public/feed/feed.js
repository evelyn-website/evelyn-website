let loggedInUser;
let sortOrder;

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

function isViewThrottled(articleId) {
    const localStorageKey = `lastViewedArticle-${articleId}`;
    const lastViewedTime = localStorage.getItem(localStorageKey);
    const throttleThreshold = 30 * 1000; 

    if (lastViewedTime) {
        const now = Date.now();
        const timeSinceLastView = now - lastViewedTime;
        return timeSinceLastView < throttleThreshold;
    } else {
    return false;
    }
}

function registerView(articleId, userId) {
    localStorage.setItem(`lastViewedArticle-${articleId}`, Date.now())
    postData('/api/articleViews',{userId: userId, articleId: articleId})
}

function expandBox(articleBox) {
    const hiddenBodies = articleBox.querySelectorAll('.article-body-hidden');
    hiddenBodies.forEach(hiddenBody => hiddenBody.classList.replace('article-body-hidden', 'article-body'));
    articleBox.classList.replace('article-box', 'article-box-expanded')
    expandedBoxes.push(articleBox)
    articleId = articleBox.querySelector('.article-id').textContent
    if (!isViewThrottled(articleId)) {
        registerView(articleId, loggedInUser.id)
    }
}

function closeBox(articleBox) {
    const visibleBodies = articleBox.querySelectorAll('.article-body');
    visibleBodies.forEach(visibleBody => visibleBody.classList.replace('article-body', 'article-body-hidden'));
    articleBox.classList.replace('article-box-expanded', 'article-box')
    const index = expandedBoxes.indexOf(articleBox)
    expandedBoxes.splice(index, 1)
}

function addArticle(id, title, author, body) {
    const newBox = articles.appendChild(document.createElement("div"))
    const newTitle = newBox.appendChild(document.createElement("div"))
    const newBy = newBox.appendChild(document.createElement("div"))
    const newAuthor = newBox.appendChild(document.createElement("div"))
    const newBody = newBox.appendChild(document.createElement("div"))
    const newId = newBox.appendChild(document.createElement("div"))
    newBox.classList.add('article-box')
    newTitle.classList.add('article-title')
    newBy.classList.add('article-by')
    newAuthor.classList.add('article-author')
    newBody.classList.add('article-body-hidden')
    newId.classList.add('article-id')
    newTitle.textContent = title;
    newBy.textContent = 'by '
    newAuthor.textContent = author
    newBody.textContent = body
    newId.textContent = id
    expandHandler(newBox)
}

async function getRecentArticles(offset) {
    const response = await fetch(`/api/articles/recent/${offset}`);
    const fetchedArticles = await response.json();
    fetchedArticles.forEach(article=> {
        addArticle(article.id, article.title, article.user.username, article.body)
    })
}

async function getTopArticles(offset) {
    const response = await fetch(`/api/articles/topAllTime/${offset}`);
    const results = await response.json();
    results.forEach(article=> {
        addArticle(article.id, article.title, article.user.username, article.body)
    })
}

async function clearArticles() {
    articles.querySelectorAll('.article-box-expanded').forEach(box => box.remove())
    articles.querySelectorAll('.article-box').forEach(box => box.remove());
}

const sortButton = document.getElementById('sortbutton')

sortButton.addEventListener('click', async function(e){
    e.preventDefault()
    clearArticles()
    if (sortOrder == 'recent') {
        getTopArticles(0)
        sortOrder = 'topAllTime'
        sortButton.innerText = 'Sort by Recent'
    } else if (sortOrder == 'topAllTime') {
        getRecentArticles(0)
        sortOrder = 'recent'
        sortButton.innerText = 'Sort by Popular'
    }
})

window.addEventListener('DOMContentLoaded', async function(e){
    e.preventDefault()
    try {
    fetchUser()
    getRecentArticles(0)
    sortOrder = 'recent'
    } catch (error) {
      console.error('Error:', error);
    }
  });