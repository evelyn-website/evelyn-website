var loginform = document.getElementById('loginform');
var homepagelink = document.getElementById('homepagelink');

loginform.addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  
try {
    const data = { username, password };
    await loginFunc('/auth/login', data); 
  } catch (error) {
    console.error('Error:', error);
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

    window.location.href = homepagelink.href;
  } else {
    window.alert("Incorrect username/password")
  }
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

