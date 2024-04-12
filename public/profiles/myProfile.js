var homepagelink = document.getElementById('homepagelink')
var userProfile = document.getElementById('profile')
var profileUsername = document.getElementById('profileUsername')
var profileBio = document.getElementById('profileBio')
var profileBirthday = document.getElementById('profileBirthday')
var profileCreatedAt = document.getElementById('profileCreatedAt')
var editProfileButton = document.getElementById('editProfileButton')
var editProfileForm = document.getElementById('editProfileForm')

let loggedInUser;

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

async function putData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "PUT",
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

async function updateProfile() {
    await fetchUser();
    const response = await fetch(`/api/userProfiles/byUserId/${loggedInUser.id}`)
    const userProfile = await response.json();
    profile.style.display = 'inline-block'
    profileUsername.innerText = loggedInUser.username
    profileBio.innerText = `Bio: ${userProfile.bio}`
    profileBirthday.innerText = `Birthday: ${userProfile.birthday}`
    profileCreatedAt.innerText = `Profile Created: ${loggedInUser.createdAt.toString().slice(0,10)}`
    editProfileButton.style.display = 'block'
}

editProfileButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        editProfileButton.style.display = 'none'
        editProfileForm.style.display = 'block'
    } catch (error) {
        console.error("Error:", error)
    }
})

editProfileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
    await fetchUser();
    const bioForm = document.getElementById("bioForm").value;
    const birthdayForm = document.getElementById("birthdayForm").value;

    const data = {
        bio: bioForm,
        birthday: birthdayForm
    };

    await putData('/api/userProfiles/bySignedInUser', data)
    .catch((error) => {
    console.log(error)
    console.error("Error:", error);
    });
    window.location.href = '/myprofile'; 
    } catch (error) {
        console.error("Error:", error);  
    }
});

window.addEventListener('DOMContentLoaded', () => {
    fetchUser()
      .then(updateProfile)
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  });