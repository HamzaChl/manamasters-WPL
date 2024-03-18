const popup = document.getElementById("popupdecksIndividueel");
popup.style.visibility = "hidden";
const pictures = document.getElementsByClassName("picturesDecksIndividueel");

for (const picture of pictures) {
  picture.addEventListener("click", function (e) {
    if (popup.style.visibility === "hidden") {
      popup.style.visibility = "visible";
      popup.style.height = "100vh";
    }
  });
}

document
  .getElementById("buttonClosePopUpIndividueel")
  .addEventListener("click", function (e) {
    popup.style.visibility = "hidden";
    popup.style.height = 0;
  });

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    popup.style.visibility = "hidden";
    popup.style.height = 0;
  }
});
