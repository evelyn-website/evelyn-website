var loginOptions = document.getElementById("loginOptions")
var pages = document.getElementById("pages")
var logout = document.getElementById('logout')

async function fetchUser() {
    try {
      const loggedInUser = await getUser('fromJWT');
      return loggedInUser;
    } catch (error) {
      console.error(error);
      return null; 
    }
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

  logout.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        postData("/auth/logout")
        location.reload();
    } catch (error) {
        console.error("Error:", error)
    }
})
  
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const user = await fetchUser();
  
      if (user) {
        loginOptions.style.display = 'none';
        pages.style.display = 'block';
      } else { 
        loginOptions.style.display = 'block'
        pages.style.display = 'none'
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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