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
    } else {
        loginButton.value = "Login";
        h1Login.textContent = "Login"
        registerButton.textContent = "Registreer";
    }
    login = false;
});

loginButton.addEventListener("click", function (e) {
    e.preventDefault();
});
