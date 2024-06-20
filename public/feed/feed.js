let loggedInUser;
let sortOrder;
let pageCounter = 0;

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
        window.location.href = '/login';
        return;
      }
      viewLinkBoxes()
    } catch (error) {
      console.error(error);
    }
  }

  const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  };

const articles = document.getElementById('articles')

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

function profileLinkHandler(author) {
  author.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = `/profiles/${author.textContent}`
  })
  author.classList.add('article-author-clickable')
}

const myProfileLink = document.getElementById('my-profile-link')

myProfileLink.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = `/profiles/${loggedInUser.username}`
})

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
    postData('/api/articleViews/forUser',{articleId: articleId})
}

function expandBox(articleBox) {
    const hiddenBodies = articleBox.querySelectorAll('.article-body-hidden');
    hiddenBodies.forEach(hiddenBody => hiddenBody.classList.replace('article-body-hidden', 'article-body'));
    articleBox.classList.replace('article-box', 'article-box-expanded')
    expandedBoxes.push(articleBox)
    articleId = articleBox.querySelector('.article-id').textContent
    articleAuthor = articleBox.querySelector('.article-author')
    profileLinkHandler(articleAuthor)
    if (!isViewThrottled(articleId)) {
        registerView(articleId, loggedInUser.id)
    }
    getReplies(articleId, 0)
}

function closeBox(articleBox) {
    const visibleBodies = articleBox.querySelectorAll('.article-body');
    visibleBodies.forEach(visibleBody => visibleBody.classList.replace('article-body', 'article-body-hidden'));
    articleBox.classList.replace('article-box-expanded', 'article-box')
    const index = expandedBoxes.indexOf(articleBox)
    expandedBoxes.splice(index, 1)
    replies = document.querySelectorAll(`.parent-article-id-${articleId}`)
    replies.forEach(reply => reply.remove())
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
    newBody.innerText = body
    newId.textContent = id
    newBox.id = id
    expandHandler(newBox)
}

function addReply(direction, id_after, id, parent_article_id, author, body) {
    const parent = document.getElementById(`${parent_article_id}`)
    const newBox = articles.appendChild(document.createElement("div"))
    const newBy = newBox.appendChild(document.createElement("div"))
    const newAuthor = newBox.appendChild(document.createElement("div"))
    const newBody = newBox.appendChild(document.createElement("div"))
    const newId = newBox.appendChild(document.createElement("div"))
    newBox.classList.add('reply')
    newBox.classList.add('article-box-expanded')
    newBy.classList.add('article-by')
    newAuthor.classList.add('article-author')
    newBody.classList.add('article-body')
    newId.classList.add('article-id')
    newBy.textContent = 'by '
    newAuthor.textContent = author
    newBody.innerText = body
    newId.textContent = id
    newBox.classList.add(`parent-article-id-${parent_article_id}`)
    const idAfter = document.getElementById(`${id_after}`)
    idAfter.insertAdjacentElement(direction, newBox)
}

function addShowMoreBox(parent_article_id) {
    const parent = document.getElementById(`${parent_article_id}`)
    const newBox = articles.appendChild(document.createElement("div"))
    const newBody = newBox.appendChild(document.createElement("div"))
    const currentPageCount = newBox.appendChild(document.createElement("div"))
    newBox.classList.add('reply')
    newBox.classList.add('article-box-expanded')
    newBody.classList.add('article-body')
    currentPageCount.classList.add('article-id')
    newBody.innerText = 'Show Newer Replies'
    newBox.classList.add(`parent-article-id-${parent_article_id}`)
    newBox.id = `show-more-${parent_article_id}`
    currentPageCount.textContent = 0
    parent.insertAdjacentElement('afterend', newBox)
    showMoreHandler(newBox, parent_article_id)
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

async function getReplies(parent_article_id, offset) {
  const response = await fetch(`/api/articles/findReplies/${parent_article_id}/${offset}`)
  const results = await response.json();
  const countRequest = await fetch(`/api/articles/countReplies/${parent_article_id}`)
  const countResults = await countRequest.json();
  const remainingCount = countResults.count - ((offset+1)*50)
  const showMoreBox = document.getElementById(`show-more-${parent_article_id}`)
  if (remainingCount > 0 && !showMoreBox) {
    addShowMoreBox(parent_article_id)
  }
  if (offset > 0) {
    results.forEach(reply=> {
      addReply('beforebegin', showMoreBox.id, reply.id, parent_article_id, reply.user.username, reply.body)
    })
  } else {
    results.reverse().forEach(reply=> {
      addReply('afterend', parent_article_id, reply.id, parent_article_id, reply.user.username, reply.body)
    })
  }
  if (remainingCount <= 0 && showMoreBox) {
    showMoreBox.remove()
  }
}

function showMoreHandler(showMoreBox, parent_article_id) {
    showMoreBox.addEventListener('click', (e) => {
        e.preventDefault();
        const boxCount = showMoreBox.querySelector('.article-id')
        const newCount = parseInt(boxCount.textContent) + 1
        getReplies(parent_article_id, newCount)
        boxCount.textContent = newCount
      });
} 

async function getNextArticles() {
  pageCounter += 1;
  if (sortOrder == 'recent') {
    getRecentArticles(pageCounter)
  } else if (sortOrder == 'topAllTime') {
    getTopArticles(pageCounter)
  } else {
    location.reload();
  }
}

async function clearArticles() {
    articles.querySelectorAll('.article-box-expanded').forEach(box => box.remove())
    articles.querySelectorAll('.article-box').forEach(box => box.remove());
    pageCounter = 0;
}

const sortButton = document.getElementById('sort-button')

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


document.addEventListener('scroll', async function (e){
  if(document.documentElement.scrollHeight === Math.ceil(window.scrollY + window.innerHeight)) {
    let delayres = await delay(300);
    getNextArticles();
  }
})

const openPostMenuButton = document.getElementById('open-post-menu-button')
const postModal = document.querySelector('.post-modal')
const opacityBackground = document.querySelector('.opacity-background')

function openPostMenu() {
  postModal.style.display = 'block'
  opacityBackground.style.display = 'block'
}

function closePostMenu () {
  postModal.style.display = 'none'
  opacityBackground.style.display = 'none'
}

openPostMenuButton.addEventListener('click', async function(e) {
  e.preventDefault()
  openPostMenu()
})

opacityBackground.addEventListener('click', async function(e) {
  e.preventDefault()
  closePostMenu()
})

window.addEventListener('keydown', function(e) {
  if (e.key == "Escape") {
    closePostMenu()
  }
});


const createArticle = async (data) => {
  postData('/api/articles/forUser', data)
  closePostMenu()
  let delayres = await delay(100);
  location.reload()
}

const submit = document.getElementById('submit')

submit.addEventListener('click', async (e) => {
  e.preventDefault();
  const titleInput = document.getElementById("title")
  const title = titleInput.value.trim();
  const bodyInput = document.getElementById("body")
  const body = bodyInput.value.trim();
  if (title == '') {
      document.querySelector(".bad-input-warning").textContent="Title cannot be blank!"
      document.querySelector(".bad-input-warning").style.display='block'
      return;
  } else {
  data = {title: title, body: body}
  try {
    createArticle(data)
  } catch (error) {
      console.error('Error:', error);
  }}
});

const logout = document.getElementById('logout-button')

logout.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        logoutFunc()
    } catch (error) {
        console.error("Error:", error)
    }
})

const viewLinkBoxes = () => {
  linkBoxes = document.querySelectorAll('.link-box')
  linkBoxes.forEach(linkBox=> linkBox.style.display='block')
}

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

  async function logoutFunc() {
    const response = await fetch('/auth/logout', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    // Handle server response (e.g., reload on success)
    if (response.ok) {
      window.location.href = '/'
    } else {
      window.alert("Logout failed")
    }
  }