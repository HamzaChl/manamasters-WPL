let registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");
let login = true;

registerButton.addEventListener("click", function (e) {
    e.preventDefault();
    const h1Login = document.getElementById("h1Login");
    if (loginButton.value === "Login") {
        loginButton.value = "Registreer";
        h1Login.textContent = "Registreer"
        registerButton.textContent = "login";
        document.title = "Magic The Gathering | Registreer"
    } else {
        loginButton.value = "Login";
        h1Login.textContent = "Login"
        registerButton.textContent = "Registreer";
        document.title = "Magic The Gathering | Login";
    }
    login = false;
});

loginButton.addEventListener("click", function (e) {
    e.preventDefault();
});
