let loggedInUser;
let sortOrder;
let pageArticle;
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

async function getData(url = "") {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  }
  

async function getArticleIdFromParams () {
    idObject = await getData(`/articles/${encodeURIComponent(window.location.pathname.split('/')[2])}/get-article-id`)
    return idObject.id
}

async function getArticleFromId(id) {
    const article = await getData(`/api/articles/${id}`)
    if (article.message) {
        return ({ error: 'noArticleError'})
    } else {
        return (article)
    }
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

const myProfileLink = document.getElementById('my-profile-link')

myProfileLink.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = `/profiles/${loggedInUser.username}`
})


const articles = document.getElementById('articles')

function addArticle(id, title, author, body) {
    const newBox = articles.appendChild(document.createElement("div"))
    const newTitle = newBox.appendChild(document.createElement("div"))
    const newBy = newBox.appendChild(document.createElement("div"))
    const newAuthor = newBox.appendChild(document.createElement("div"))
    const newBody = newBox.appendChild(document.createElement("div"))
    const newId = newBox.appendChild(document.createElement("div"))
    newBox.classList.add('article-box-expanded')
    newTitle.classList.add('article-title')
    newBy.classList.add('article-by')
    newAuthor.classList.add('article-author')
    newBody.classList.add('article-body')
    newId.classList.add('article-id')
    newTitle.textContent = title;
    newBy.textContent = 'by '
    newAuthor.textContent = author
    newBody.innerText = body
    newId.textContent = id
    newBox.id = id
    newAuthor.addEventListener('click', (e) => {
      e.preventDefault()
      window.location.href = `/profiles/${author}`
    })
}

const getRepliesForArticle = async(parent_article_id, offset) => {
    const response = await fetch(`/api/articles/findReplies/${parent_article_id}/${offset}`)
    const results = await response.json();
    results.forEach(article=> {
        addArticle(article.id, article.title, article.user.username, article.body)
    })
}

async function getNextArticles() {
    pageCounter += 1;
    getRepliesForArticle(pageArticle.id, pageCounter)
}


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


const createReply = async (data) => {
  postData('/api/articles/newReply', data)
  closePostMenu()
  let delayres = await delay(100);
  location.reload()
}

const loadArticle = async(article) => {
    const pageArticleTitle = document.querySelector('.page-article-box-title');
    const pageArticleAuthor = document.querySelector('.page-article-box-author');
    const pageArticleBody = document.querySelector('.page-article-box-body');
    if (pageArticle.error == 'noArticleError') {
        pageArticleTitle.textContent = 'No article with id found'
        return;
    } else {
        pageArticleTitle.textContent = `${article.title}`
        pageArticleAuthor.textContent = `by ${article.user.username}`
        if (article.body) {pageArticleBody.innerText = `${article.body}`}
        pageArticleAuthor.addEventListener('click', (e) => {
          e.preventDefault()
          window.location.href = `/profiles/${article.user.username}`
        })
    }
}


const submitArticle = document.getElementById('submit-article')

submitArticle.addEventListener('click', async (e) => {
  e.preventDefault();
  const bodyInput = document.getElementById("body")
  const body = bodyInput.value.trim();
  if (body == '') {
      document.querySelector(".bad-input-warning").textContent="Reply cannot be blank!"
      document.querySelector(".bad-input-warning").style.display='block'
      return;
  } else {
    data = {parent_article_id: pageArticle.id, body: body}
    createReply(data)
  try {
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
    await fetchUser()
    const articleId = await getArticleIdFromParams()
    pageArticle = await getArticleFromId(articleId)

    if (pageArticle.error == 'noArticleError') {
        loadArticle(pageArticle)
    } else {
        loadArticle(pageArticle)
        getRepliesForArticle(pageArticle.id, 0)
        sortOrder = 'recent'
    }
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