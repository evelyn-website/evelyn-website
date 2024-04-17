var resetform = document.getElementById('reset-form');
var submit = document.getElementById('submit')

function isResetThrottled() {
    const localStorageKey = `last-reset-email`;
    const lastResetEmailTime = localStorage.getItem(localStorageKey);
    const throttleThreshold = 5 * 1000; 

    if (lastResetEmailTime) {
        const now = Date.now();
        const timeSinceLastEmail = now - lastResetEmailTime;
        return timeSinceLastEmail < throttleThreshold;
    } else {
    return false;
    }
}

function sendResetRequest(data) {
    localStorage.setItem(`last-reset-email`, Date.now())
    postData('/auth/reset-password-email', data)
}

async function checkUser(email) {
    response = await getData(`/auth/userCheck/${email}`)
    return (response)
}

submit.addEventListener('click', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email")
    const email = emailInput.value.trim();
    if (email == '') {
        document.querySelector(".bad-input-warning").textContent="Email cannot be blank!"
        document.querySelector(".bad-input-warning").style.display='block'
        return;
    } else {
    data = {email: email}
    const exists = await checkUser(email)
    try {
        if (exists) {
            if (!isResetThrottled()) {
                document.querySelector(".reset-form").style.display='none'
                document.querySelector(".reset-form-header").textContent = "Check your email!"
                document.querySelector(".reset-form-desc").textContent = `We sent password reset instructions to ${email}. \n Make sure to check your spam folder if you don't see it right away.`
                sendResetRequest(data)
            }
        } else {
            document.querySelector(".bad-input-warning").textContent="No user with this email exists"
            document.querySelector(".bad-input-warning").style.display='block'
        }
    } catch (error) {
        console.error('Error:', error);
    }}
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