var signupForm = document.getElementById('signup-form');
var signinForm = document.getElementById('signin-form');

// load page checks

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

async function getData(url = "") {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  }

// signup/signin form handling

signinForm.addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const username = document.getElementById('signin-username').value.trim();
    const password = document.getElementById('signin-password').value.trim();
    
  try {
      const data = { username, password };
      await loginFunc('/auth/login', data); 
    } catch (error) {
      console.error('Error:', error);
    }
  });

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password1 = document.getElementById("signup-password-1").value.trim();
    const password2 = document.getElementById("signup-password-2").value.trim();
    const signupWarning = document.getElementById('signup-warning')

    if (username=='') {
        signupWarning.textContent="Username must not be blank"
        signupWarning.style.display='block'
        return;
    }
    if (email=='') {
        signupWarning.textContent="Email must not be blank"
        signupWarning.style.display='block'
        return;
    }
    if (password1=='') {
        signupWarning.textContent="Password must not be blank"
        signupWarning.style.display='block'
        return;
    }

    const spaceRegEx = /\s/g
    if (username.match(spaceRegEx)) {
        signupWarning.textContent="Username must not have whitespace"
        signupWarning.style.display='block'
        return;
    }
    if (email.match(spaceRegEx)) {
        signupWarning.textContent="Email must not have whitespace"
        signupWarning.style.display='block'
        return;
    }
    if (password1.match(spaceRegEx)) {
        signupWarning.textContent="Password must not have whitespace"
        signupWarning.style.display='block'
        return;
    }
    const charRegex = /[^a-zA-Z0-9_@\-.]/g

    if (username.match(charRegex)) {
      signupWarning.textContent="Username contains invalid characters"
      signupWarning.style.display='block'
      return;
    }
    
    const usernameExists = await checkUserUsername(username)
    if (usernameExists) {
        signupWarning.textContent="Username is taken"
        signupWarning.style.display='block'
        return;
    }

    const emailExists = await checkUserEmail(email)
    if (emailExists) {
        signupWarning.textContent="Email address is taken"
        signupWarning.style.display='block'
        return;
    }

    if (password1 != password2) {
        signupWarning.textContent="Passwords must match"
        signupWarning.style.display='block'
        return;
    }

    const data = {
        username: username,
        email: email,
        password: password1
    };

    try {
        await registerFunc(data)
    } catch (error) {
        console.error('Error:', error)
    }
});

async function loginFunc(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  
    // Handle server response (e.g., redirect on success)
    if (response.ok) {
        window.location.href = '/';
    } else {
        const signinWarning = document.getElementById('signin-warning')
        signinWarning.style.display='block'
        signinWarning.textContent='Incorrect username/password'
    }
}
 
async function registerFunc(data = {}) {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
        await loginFunc('/auth/login', data)
    } else {
      window.alert("Error creating account")
    }
}

async function checkUserEmail(email) {
    response = await getData(`/auth/userCheckEmail/${email}`)
    return (response)
}

async function checkUserUsername(username) {
    response = await getData(`/auth/userCheckUsername/${username}`)
    return (response)
}

// page navigation

const showSigninButton = document.getElementById('show-signin-button')
const showSignupButton = document.getElementById('show-signup-button')
const signinMenu = document.getElementById('signin')
const signupMenu = document.getElementById('signup')
const loginModal = document.querySelector('.login-modal')
const opacityBackground = document.querySelector('.opacity-background')

function openPostMenu() {
  loginModal.style.display = 'block'
  opacityBackground.style.display = 'block'
}

function closePostMenu () {
    loginModal.style.display = 'none'
    opacityBackground.style.display = 'none'
    signinMenu.style.display = 'none'
    signupMenu.style.display = 'none'
}

showSigninButton.addEventListener('click', async function(e) {
  e.preventDefault()
  openPostMenu()
  signinMenu.style.display = 'block'
})

showSignupButton.addEventListener('click', async function(e) {
    e.preventDefault()
    openPostMenu()
    signupMenu.style.display = 'block'
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