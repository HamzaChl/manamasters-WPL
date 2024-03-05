const openPopup = (name, rarity, text, type, imageUrl) => {
  document.getElementById("popupCardImg").src = imageUrl;
  document.getElementById("popup").style.display = "block";

  document.getElementById("card-name").innerText = `${name}`;
  document.getElementById("card-rarity").innerText = `${rarity}`;
  document.getElementById("card-text").innerText = `${text}`;
  document.getElementById("card-type").innerText = `${type}`;
};

const closePopup = () => {
  document.getElementById("popup").style.display = "none";
};

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closePopup();
  }
});

const main = async () => {
  const randomPage = Math.floor(Math.random() * 310);
  try {
    const response = await fetch(
      `https://api.magicthegathering.io/v1/cards?page=${randomPage}`
    );
    const data = await response.json();

    const cardName = document.getElementsByClassName("card-name");
    const cardHolder = document.getElementsByClassName("card-holder");
    const cardIMG = document.getElementsByClassName("card-img");

    let i = 0;

    while (i < cardHolder.length) {
      const random = Math.floor(Math.random() * 100);

      if (data.cards[random].imageUrl && data.cards[random].name) {
        const rarityLetter = getRarityLetter(data.cards[random].rarity);

        cardIMG[i].src = data.cards[random].imageUrl;
        cardName[
          i
        ].innerHTML = `${data.cards[random].name} <span class="rarity">${rarityLetter}</span>`;
        cardIMG[i].style.boxShadow = "0px 2px 6px 5px rgba(0, 0, 0, 0.5)";
        cardIMG[i].style.outline = "1px solid white";

        if (data.cards[random].rarity === "Uncommon") {
          cardIMG[i].style.boxShadow = "0px 2px 6px 5px rgba(18, 80, 179, 0.5)";
          cardIMG[i].style.outline = "1px solid rgb(18, 80, 179)";
        } else if (data.cards[random].rarity === "Common") {
          cardIMG[i].style.boxShadow =
            "0px 2px 6px 5px rgba(255, 255, 255, 0.5)";
          cardIMG[i].style.outline = "1px solid rgb(255, 255, 255)";
        } else if (data.cards[random].rarity === "Rare") {
          cardIMG[i].style.boxShadow =
            "0px 2px 6px 5px rgba(174, 186, 85, 0.5)";
          cardIMG[i].style.outline = "1px solid rgb(174, 186, 85)";
        } else {
          cardIMG[i].style.boxShadow = "0px 2px 15px 5px rgba(151, 0, 0, 0.8)";
          cardIMG[i].style.outline = "1px solid rgb(151, 0, 0)";
          cardIMG[i].classList.add("wobble-hor-bottom");
        }

        cardHolder[i].addEventListener("click", () => {
          if (cardIMG[i] && cardIMG[i].classList) {
            cardIMG[i].classList.remove("wobble-hor-bottom");
          }
          openPopup(
            data.cards[random].name,
            data.cards[random].rarity,
            data.cards[random].text,
            data.cards[random].type,
            data.cards[random].imageUrl
          );
        });

        i++;
      }
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
};

document.addEventListener("DOMContentLoaded", (e) => {
  main();
});

// SEARCH FUNCTION

const form = document.getElementById("search-form-id");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const searchTerm = document
    .getElementById("search")
    .value.trim()
    .toLowerCase();

  try {
    const response = await fetch(
      `https://api.magicthegathering.io/v1/cards?name=${searchTerm}`
    );
    const searchData = await response.json();
    resetCardDisplay(searchData.cards);
  } catch (error) {
    console.error(error);
  }
});

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

function getRarityLetter(rarity) {
  switch (rarity) {
    case "Common":
      return "●";
    case "Uncommon":
      return "♦";
    case "Rare":
      return "★";
    case "Mythic":
      return "❈";
    default:
      return "";
  }
}
