let registerButton = document.getElementById("Registreer");

registerButton.addEventListener("click", function (e) {
    e.preventDefault();
    const loginButton = document.getElementById("loginButton");
    const h1Login = document.getElementById("h1Login");
    loginButton.value = "Registreer";
    h1Login.textContent = "Registreer"
    registerButton.style.visibility = "hidden";
});