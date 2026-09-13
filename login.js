const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const errorMessage =
        document.getElementById("errorMessage");

    if (username === "bala" && password === "1234") {

        localStorage.setItem("loggedIn", "true");

        localStorage.setItem(
            "username",
            username
        );

        window.location.href = "index.html";

    } else {

        errorMessage.textContent =
            "❌ Invalid username or password.";

    }

});