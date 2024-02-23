let homepagelink = document.getElementById('homepagelink')
let writeFormSection = document.getElementById('writeFormSection')
let writeForm = document.getElementById('writeForm')
let title = document.getElementById('title')
let body = document.getElementById('body')

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

window.addEventListener('DOMContentLoaded', async function(e){
    e.preventDefault()
    await fetchUser()
    try {
        writeFormSection.style.display = 'block'
    } catch (error) {
      console.error('Error:', error);
    }
});

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

writeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;
    const data = {
        userId: loggedInUser.id,
        title: title,
        body: body
    };

    postData("/api/articles/", data)
        .then((response) => {
        })
        .catch((error) => {
            console.error("Error:", error);
        })
        .then(() => {
            window.location.href = '/';
        });
});

async function getUserIdFromUsername(username) {
    const response = await fetch(`/api/users/byUsername/${username}`);
    const user = await response.json();
    return user.id
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
