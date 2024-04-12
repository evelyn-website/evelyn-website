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

submit.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    if (email == '') {
        window.alert('Email cannot be blank!')
        return;
    } else {
    data = {email: email}
    try {
        if (!isResetThrottled()) {
            sendResetRequest(data)
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

