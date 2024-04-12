document.getElementById("userCreateForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

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


    postData("/auth/register", data)
        .then((response) => {
        })
        .catch((error) => {
            console.error("Error:", error);
        }).then(
            window.location.href = '/'
        )
        ;
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

