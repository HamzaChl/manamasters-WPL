const popup = document.getElementById("popupdecksIndividueel");
document.getElementById("popupdecksIndividueel").style.visibility = "hidden";
const pictures = document.getElementsByClassName("picturesDecksIndividueel");

for (const picture of pictures) {
  picture.addEventListener("click", function (e) {
    if (document.getElementById("popupdecksIndividueel").style.visibility === "hidden") {
      document.getElementById("popupdecksIndividueel").style.visibility = "visible";
      document.getElementById("popupdecksIndividueel").style.height = "100vh";
    }
  });
}

document
  .getElementById("buttonClosePopUpIndividueel")
  .addEventListener("click", function (e) {
    document.getElementById("popupdecksIndividueel").style.visibility = "hidden";
    document.getElementById("popupdecksIndividueel").style.height = 0;
  });

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    document.getElementById("popupdecksIndividueel").style.visibility = "hidden";
    document.getElementById("popupdecksIndividueel").style.height = 0;
  }
});
