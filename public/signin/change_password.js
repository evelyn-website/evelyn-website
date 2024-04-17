var resetform = document.getElementById('reset-form');
var submit = document.getElementById('submit')

async function checkUser(email) {
    response = await getData(`/auth/userCheck/${email}`)
    return (response)
}

submit.addEventListener('click', async (e) => {
    e.preventDefault();
    const password1Input = document.getElementById("password1")
    const password2Input = document.getElementById("password2")
    const password1 = password1Input.value.trim();
    const password2 = password2Input.value.trim();
    if (password1 != password2) {
        document.querySelector(".bad-input-warning").textContent="Passwords do not match!"
        document.querySelector(".bad-input-warning").style.display='block'
        return;
    } else if (password1 == '' || password2 == '') {
        document.querySelector(".bad-input-warning").textContent="Password cannot be blank!"
        document.querySelector(".bad-input-warning").style.display='block'
        return;
    } else {
    data = {password: password1}
    try {
        putData('/auth/changePassword', data)
        window.location.href = '/'
    } catch (error) {
        console.error('Error:', error);
    }}
});

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

async function getData(url = "") {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return await response.json();
  }