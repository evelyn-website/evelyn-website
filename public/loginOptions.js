var loginOptions = document.getElementById("loginOptions")

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
  
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const user = await fetchUser();
  
      if (user) {
        window.location.href = '/'
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