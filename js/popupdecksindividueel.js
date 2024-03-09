const popup = document.getElementById("popupdecksIndividueel");
popup.style.visibility = "hidden";
const pictures = document.getElementsByClassName("picturesDecksIndividueel");

for (const picture of pictures) {
    picture.addEventListener("click", function (e) {
        if (popup.style.visibility === "hidden") {
            popup.style.visibility = "visible";
            popup.style.height = "100vh";
        } else if (popup.style.visibility === "visible"){
            popup.style.visibility = "hidden";
            popup.style.height = 0;
        }
    });  
};