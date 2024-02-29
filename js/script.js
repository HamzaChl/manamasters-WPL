const lenis = new Lenis();

lenis.on("scroll", (e) => {
  // console.log(e);
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const openPopup = (details, imageUrl) => {
  document.getElementById("cardDetails").innerText = details;
  document.getElementById("popupCardImg").src = imageUrl;
  document.getElementById("popup").style.display = "block";
};

const closePopup = () => {
  document.getElementById("popup").style.display = "none";
};

const main = async () => {
  const randomPage = Math.floor(Math.random() * 310);
  try {
    const response = await fetch(`https://api.magicthegathering.io/v1/cards?page=${randomPage}`);
    const data = await response.json();
    //const responses = await Promise.all(allRarities.map((oneRarity) => fetch(`https://api.magicthegathering.io/v1/cards?rarity=${oneRarity}`)));
    //const data = await Promise.all(responses.map((responses) => responses.json()));
    // lukt niet want teveel fetches server error zie andere oplossing voor de mythic te krijgen
    console.log(data.cards);

    const cardName = document.getElementsByClassName("card-name");
    const cardHolder = document.getElementsByClassName("card-holder");
    const cardIMG = document.getElementsByClassName("card-img");

    for (let i = 0; i < cardHolder.length; i++) {
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
          cardIMG[i].style.boxShadow = "0px 2px 6px 5px rgba(18, 80, 179, 0.6)";
          cardIMG[i].style.outline = "1px solid rgb(18, 80, 179)";
        } else if (data.cards[random].rarity === "Common") {
          cardIMG[i].style.boxShadow =
            "0px 2px 6px 5px rgba(255, 255, 255, 0.6)";
          cardIMG[i].style.outline = "1px solid rgb(255, 255, 255)";
        } else if (data.cards[random].rarity === "Rare") {
          cardIMG[i].style.boxShadow =
            "0px 2px 6px 5px rgba(174, 186, 85, 0.7)";
          cardIMG[i].style.outline = "1px solid rgb(174, 186, 85)";
        } else {
          cardIMG[i].style.boxShadow = "0px 2px 6px 5px rgba(151, 0, 0, 0.9)";
          cardIMG[i].style.outline = "1px solid rgb(151, 0, 0)";
        }

        cardHolder[i].addEventListener("click", () => {
          openPopup(
            `Card Name: ${data.cards[random].name}\nRarity: ${data.cards[random].rarity}`,
            data.cards[random].imageUrl
          );
        });
      } else {
        i--;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", (e) => {
  main();
});

// Fonction pour obtenir la lettre de rareté correspondante
function getRarityLetter(rarity) {
  switch (rarity) {
    case "Common":
      return "●";
    case "Uncommon":
      return "♦";
    case "Rare":
      return "★";
    case "Mythic":
      return "˗ˏˋ ★ ˎˊ˗";
    default:
      return "";
  }
}

// ALS ER OP FORM GESUBMIT WORDT, PAGINA OMHOOG

const form = document.getElementById("search-id");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(form.value)
});