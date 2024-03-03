let registerButton = document.getElementById("Registreer");
const loginButton = document.getElementById("loginButton");
let login = true;
registerButton.addEventListener("click", function (e) {
    e.preventDefault();
    const h1Login = document.getElementById("h1Login");
    loginButton.value = "Registreer";
    h1Login.textContent = "Registreer"
    registerButton.style.visibility = "hidden";
    login = false;
});

loginButton..addEventListener("click", function (e) {
    e.preventDefault();
});
