document.getElementById("userCreateForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const data = {
        username: username,
        email: email,
        password: password
    };

    const spaceRegEx = /\s/g

    if (username.match(spaceRegEx)) {
        window.alert("Username must not have whitespace!")
        return;
    }
    if (email.match(spaceRegEx)) {
        window.alert("Email must not have whitespace!")
        return;
    }
    if (password.match(spaceRegEx)) {
        window.alert("Password must not have whitespace!")
        return;
    }
    try {
        await registerFunc(data)
    } catch (error) {
        console.error('Error:', error)
    }
});

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
      window.alert("Incorrect username/password")
    }
  }