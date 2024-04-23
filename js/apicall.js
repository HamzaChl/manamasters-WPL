const openPopup = (name, rarity, text, type, imageUrl) => {
  const popupCardImg = document.getElementById("popupCardImg");
  const popup = document.getElementById("popup");

  if (rarity === "Uncommon") {
    document.getElementById("card-rarity").style.color =
      "rgba(18, 80, 179, 0.6)";
    popupCardImg.style.boxShadow = "0px 2px 6px 5px rgba(18, 80, 179, 0.6)";
  } else if (rarity === "Common") {
    document.getElementById("card-rarity").style.color =
      "rgba(255, 255, 255, 0.6)";
    popupCardImg.style.boxShadow = "0px 2px 6px 5px rgba(255, 255, 255, 0.6)";
  } else if (rarity === "Rare") {
    document.getElementById("card-rarity").style.color =
      "rgba(174, 186, 85, 0.7)";
    popupCardImg.style.boxShadow = "0px 2px 6px 5px rgba(174, 186, 85, 0.7)";
  } else {
    document.getElementById("card-rarity").style.color = "rgba(151, 0, 0, 0.9)";
    popupCardImg.style.boxShadow = "0px 2px 6px 5px rgba(151, 0, 0, 0.9)";
  }

  popupCardImg.src = imageUrl;
  popup.style.display = "block";

  document.getElementById("card-name").innerText = `${name}`;
  document.getElementById("card-rarity").innerText = `${rarity}`;
  document.getElementById("card-text").innerText = `${text}`;
  document.getElementById("card-type").innerText = `${type}`;
};



            openPopup(
              data.cards[random].name,
              data.cards[random].rarity,
              data.cards[random].text,
              data.cards[random].type,
              data.cards[random].imageUrl
            );
          



function resetCardDisplay(results) {
  const cardName = document.getElementsByClassName("card-name");
  const cardHolder = document.getElementsByClassName("card-holder");
  const cardIMG = document.getElementsByClassName("card-img");

  for (let i = 0; i < cardHolder.length; i++) {
    const currentResult = results[i];

    cardIMG[i].classList.remove("wobble-hor-bottom");
    if (currentResult && currentResult.imageUrl && currentResult.name) {
      const rarityLetter = getRarityLetter(currentResult.rarity);

      cardIMG[i].src = currentResult.imageUrl;
      cardName[
        i
      ].innerHTML = `${currentResult.name} <span class="rarity">${rarityLetter}</span>`;
      cardIMG[i].style.boxShadow = "0px 2px 6px 5px rgba(0, 0, 0, 0.5)";
      cardIMG[i].style.outline = "1px solid white";

      if (currentResult.rarity === "Uncommon") {
        cardIMG[i].style.boxShadow = "0px 2px 6px 5px rgba(18, 80, 179, 0.6)";
        cardIMG[i].style.outline = "1px solid rgb(18, 80, 179)";
      } else if (currentResult.rarity === "Common") {
        cardIMG[i].style.boxShadow = "0px 2px 6px 5px rgba(255, 255, 255, 0.6)";
        cardIMG[i].style.outline = "1px solid rgb(255, 255, 255)";
      } else if (currentResult.rarity === "Rare") {
        cardIMG[i].style.boxShadow = "0px 2px 6px 5px rgba(174, 186, 85, 0.7)";
        cardIMG[i].style.outline = "1px solid rgb(174, 186, 85)";
      } else {
        cardIMG[i].style.boxShadow = "0px 2px 6px 5px rgba(151, 0, 0, 0.9)";
        cardIMG[i].style.outline = "1px solid rgb(151, 0, 0)";
        cardIMG[i].classList.add("wobble-hor-bottom");
      }

      cardHolder[i].addEventListener("click", () => {
        openPopup(
          currentResult.name,
          currentResult.rarity,
          currentResult.originalText,
          currentResult.type,
          currentResult.imageUrl
        );
      });
    }
  }
}


// wobble werkt nog niet