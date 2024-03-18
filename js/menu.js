let menu = document.getElementById("mobile-menu");
let hamenu = document.getElementById("hamburger");

hamenu.addEventListener("click", () => {
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
});

const media = matchMedia("(min-width:1085px)");

media.addEventListener("change", () => {
  menu.style.display = "none";
});
