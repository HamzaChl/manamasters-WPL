import express, { request, response } from "express";
import { addUser, changeDeckName, checkCardExists, deleteCards, deleteOneCard, findUser, findUserName, get10Cards, getAllDecks, getCardById, getDeck, insertCardInDeck} from "../database";
import { AddDeck, Card, Deck, User } from "../types";
import { continueLogin, requireLogin } from "../middleware/middleware";
import { WithId } from "mongodb";
import { shuffle } from "../functions";


export default function mtgRouter() {
  const router = express.Router();

  router.get("/refresh", requireLogin, async (req, res) => {
    req.session.cards = await get10Cards();
    res.redirect("/MagicTheGathering/home#search-form-id");
  });

  router.get("/login", continueLogin, (req, res) => {
    res.render("login", {
      word: "login",
    });
  });

  router.get("/registreer", continueLogin, (req, res) => {
    res.render("registreer", {
      word: "registreer",
    });
  });

  router.post("/login", continueLogin, async (req, res) => {
    const formRegister: User = req.body;
    formRegister.username = formRegister.username.toLowerCase();
    const user: User | null = await findUser(formRegister);

    if (user) {
      req.session.username = formRegister.username;
      res.redirect("/MagicTheGathering/home");
    } else {
      res.status(401).render("login", {
        error: "De verstrekte inloggegevens zijn niet correct.",
        word: "login",
      });
    }
  });

  router.post("/registreer", continueLogin, async (req, res) => {
    const formRegister: User = req.body;
    formRegister.username = formRegister.username.toLowerCase();
    const user: WithId<User> | null = await findUserName(formRegister);
    let error: string | undefined = undefined;

    if (user) {
      error = "Gebruikersnaam bestaat al. Gelieve in te loggen.";
      res.render("login", {
        error: error,
        word: "login",
      });
    } else if (formRegister.username.length < 5) {
      error = "Gelieve een geldige gebruikersnaam in te geven.";
      res.render("registreer", {
        error: error,
        word: "registreer",
      });
    } else if (formRegister.password.length < 8) {
      error = "Wachtwoord moet minimaal 8 karakters lang zijn.";
      res.render("registreer", {
        error: error,
        word: "registreer",
      });
    } else {
      await addUser(formRegister);
      req.session.username = formRegister.username;
      res.redirect("/MagicTheGathering/home");
    }
  });

  router.get("/home", requireLogin, async (req, res) => {
    const searchValue: string | undefined =
      typeof req.query.search === "string" ? req.query.search : undefined;
    req.session.deckNumber = undefined;
    req.session.shuffledCards = undefined;
    let randomResults: Card[] = [];
    if (searchValue) {
      randomResults = await get10Cards(searchValue);
    } else {
      if (req.session.cards) {
        randomResults = req.session.cards;
      } else {
        req.session.cards = await get10Cards();
        randomResults = req.session.cards;
      }
    }
    let alreadyInDecks: { deck: string | undefined }[] = [];
    const decks = ["1", "2", "3", "4", "5", "6"];
    let deckNames: string[] = [];
    const allDecks: Deck[] = await getAllDecks(req.session.username!);
    for (const deck of allDecks) {
      deckNames.push(deck.deckName);
    }
    for (let i = 0; i < 10; i++) {
      alreadyInDecks[i] = { deck: "" };
      for (const deckId of decks) {
        const deck: boolean = await checkCardExists(
          deckId,
          randomResults[i].id,
          req.session.username!
        );
        if (deck) {
          alreadyInDecks[i].deck += deckNames[parseInt(deckId) - 1] + ", ";
        }
      }
      alreadyInDecks[i].deck = alreadyInDecks[i].deck!.substring(
        0,
        alreadyInDecks[i].deck!.length - 2
      );
      if (alreadyInDecks[i].deck === "") {
        alreadyInDecks[i].deck = undefined;
      }
    }

    res.render("home", {
      active: "Home",
      cards: randomResults,
      alreadyInDecks: alreadyInDecks,
      allDecks: allDecks,
    });
  });

  router.post("/home", requireLogin, async (req, res) => {
    const response: AddDeck = req.body;
    const user: string | undefined = req.session.username;
    const error: string | undefined = await insertCardInDeck(response, user!);
    if (error) {
      const allDecks: Deck[] = await getAllDecks(req.session.username!);
      res.render("home", {
        limit60: error,
        cards: req.session.cards,
        allDecks: allDecks,
      });
      return;
    }
    res.redirect("/MagicTheGathering/home#search-form-id");
  });

  router.get("/decks", requireLogin, async (req, res) => {
    const decks: Deck[] = await getAllDecks(req.session.username!);
    res.render("decks", {
      active: "Decks",
      decks: decks,
    });
  });

  router.get("/deck", requireLogin, (req, res) => {
    res.render("decksindividueel", {
      active: "Deck",
    });
  });

  router.get("/deck/:id", requireLogin, async (req, res) => {
    const id: string = req.params.id;
    const user: string | undefined = req.session.username;
    if (user) {
      const deck: WithId<Deck> | null = await getDeck(id, user);
      let total: number = 0;
      let divide: number = 0;
      let totalLandCards: number = 0;
      let manaCostTotal: number = 0;
      const cardCounts: { [key: string]: number } = {};
      let uniqueCards: Card[] = [];
      if (deck) {
        for (const card of deck.cards) {
          if (card.manaCost) {
            const manaCost: number = parseInt(card.manaCost.substring(1, 2));
            if (!isNaN(manaCost)) {
              total += manaCost;
              divide++;
            }
          }
          if (card.type.toLowerCase().includes("land")) {
            totalLandCards++;
          }
          cardCounts[card.id] = (cardCounts[card.id] || 0) + 1;
        }
        if (divide != 0) {
          manaCostTotal = parseFloat((total / divide).toFixed(2));
        }
        const uniqueCards = deck.cards.filter(
          ((card) => {
            const seenIds = new Set();
            return (card) => {
              if (seenIds.has(card.id)) {
                return false;
              } else {
                seenIds.add(card.id);
                return true;
              }
            };
          })()
        );

        res.render("decksindividueel", {
          active: "Deck",
          uniqueCards: uniqueCards,
          cardCounts: cardCounts,
          deck: deck,
          id: id,
          manaCost: manaCostTotal,
          totalLandCards: totalLandCards,
          popupEdit: req.session.popupEdit,
        });
      }
    }
  });

  router.get("/deck/:id/:cardId", requireLogin, async (req, res) => {
    const card: WithId<Card> | null = await getCardById(req.params.cardId);
    const id: string = req.params.id;
    const user: string | undefined = req.session.username;

    const deck: WithId<Deck> | null = await getDeck(id, user!);
    let total: number = 0;
    let divide: number = 0;
    let totalLandCards: number = 0;
    let manaCostTotal: number = 0;
    const cardCounts: { [key: string]: number } = {};
    let uniqueCards: Card[] = [];
    if (deck) {
      for (const card of deck.cards) {
        if (card.manaCost) {
          const manaCost: number = parseInt(card.manaCost.substring(1, 2));
          if (!isNaN(manaCost)) {
            total += manaCost;
            divide++;
          }
        }
        if (card.type.toLowerCase().includes("land")) {
          totalLandCards++;
        }
        cardCounts[card.id] = (cardCounts[card.id] || 0) + 1;
      }
      if (divide != 0) {
        manaCostTotal = parseFloat((total / divide).toFixed(2));
      }
      uniqueCards = Array.from(
        new Set(deck.cards.map((card) => JSON.stringify(card)))
      ).map((cardJson) => JSON.parse(cardJson));
    }

    res.render("decksindividueel", {
      active: "Deck",
      uniqueCards: uniqueCards,
      card: card,
      cardCounts: cardCounts,
      deck: deck,
      id: id,
      manaCost: manaCostTotal,
      totalLandCards: totalLandCards,
    });
  });

  router.get("/edit/:id", requireLogin, (req, res) => {
    if (req.session.popupEdit) {
      req.session.popupEdit = false;
    } else {
      req.session.popupEdit = true;
    }
    res.redirect("/MagicTheGathering/deck/" + req.params.id);
  });

  router.post("/edit/:id", requireLogin, async (req, res) => {
    const username: string | undefined = req.session.username;
    const id: string = req.params.id;
    const deckname: string = req.body.name;
    const url: string = req.body.url;
    await changeDeckName(username!, id, deckname, url);
    req.session.popupEdit = false;
    res.redirect("/MagicTheGathering/deck/" + req.params.id);
  });

  router.get("/deck/:id/:cardId/min", requireLogin, async (req, res) => {
    const id: string = req.params.id;
    const cardId: string = req.params.cardId;
    await deleteOneCard(id, cardId, req.session.username!);
    const cardExists: boolean = await checkCardExists(
      id,
      cardId,
      req.session.username!
    );
    if (cardExists) {
      res.redirect(`/MagicTheGathering/deck/${id}/${cardId}`);
    } else {
      res.redirect(`/MagicTheGathering/deck/${id}`);
    }
  });

  router.get("/deck/:id/:cardId/add", requireLogin, async (req, res) => {
    const id: string = req.params.id;
    const cardId: string = req.params.cardId;
    const response: AddDeck = {
      id: cardId,
      deck: id,
    };
    await insertCardInDeck(response, req.session.username!);
    res.redirect(`/MagicTheGathering/deck/${id}/${cardId}`);
  });

  router.get("/deck/:id/:cardId/delete", requireLogin, async (req, res) => {
    await deleteCards(req.params.id, req.params.cardId, req.session.username!);
    res.redirect(`/MagicTheGathering/deck/${req.params.id}`);
  });

  router.get("/drawtest", requireLogin, async (req, res) => {
    const index: number | undefined = req.session.index;
    const deckNumber: string | undefined = req.session.deckNumber;
    const drawPercentageId: string | undefined = req.session.drawPercentage;

    const allDecks: Deck[] = await getAllDecks(req.session.username!);
    let shuffledCards: Card[] | undefined = req.session.shuffledCards;

    if (!deckNumber) {
      res.render("drawtest", {
        active: "Drawtest",
        allDecks: allDecks,
        error: "leeg",
      });
      return;
    }

    const deck: WithId<Deck> | null = await getDeck(
      deckNumber,
      req.session.username!
    );
    let cards: Card[] = [];
    let deckNames: string[] = [];
    for (const deck of allDecks) {
      deckNames.push(deck.deckName);
    }
    if (!deck || (deck && deck.cards.length === 0)) {
      res.render("drawtest", {
        active: "Drawtest",
        error: `Geen kaarten gevonden in deck ${
          deckNames[parseInt(deckNumber) - 1]
        }`,
        deckNumber: parseInt(deckNumber),
        cards: undefined,
        allDecks: allDecks,
      });
      return;
    } else {
      cards = deck.cards;
    }

    if (!req.session.shuffledCards) {
      req.session.shuffledCards = shuffle(cards);
      shuffledCards = req.session.shuffledCards;
    }

    if (shuffledCards) {
      if (index !== undefined && index !== null) {
        let drawPercentage: number | string = 0;
        for (let i = 0; i < shuffledCards.length; i++) {
          if (shuffledCards[i]._id!.toString() === drawPercentageId) {
            const indexCard: number = i;
            if (indexCard <= index) {
              drawPercentage = "0";
            } else {
              drawPercentage = parseFloat(
                (100 / (indexCard - index)).toFixed(2)
              );
            }
          }
        }

        if (index >= shuffledCards.length) {
          res.render("drawtest", {
            active: "Drawtest",
            deckNumber: parseInt(deckNumber),
            limit60: "stop",
            cards: cards,
            card: undefined,
            deckName: deckNames[parseInt(deckNumber) - 1],
            index: index,
            popupPreviousCards: req.session.popupPreviousCards,
            drawPercentage: drawPercentage,
            drawPercentageId: drawPercentageId,
            allDecks: allDecks,
          });
          return;
        } else {
          const card: Card = shuffledCards[index];
          res.render("drawtest", {
            active: "Drawtest",
            deckNumber: parseInt(deckNumber),
            card: card,
            cards: cards,
            deckName: deckNames[parseInt(deckNumber) - 1],
            index: index,
            popupPreviousCards: req.session.popupPreviousCards,
            drawPercentage: drawPercentage,
            drawPercentageId: drawPercentageId,
            allDecks: allDecks,
          });
          return;
        }
      } else {
        let drawPercentage: number | string = 0;
        for (let i = 0; i < shuffledCards.length; i++) {
          if (shuffledCards[i]._id?.toString() === drawPercentageId) {
            if (!index) {
              if (i === 0) {
                drawPercentage = 100;
              } else {
                drawPercentage = parseFloat((100 / (i + 1)).toFixed(2));
              }
            } else {
              drawPercentage = "0";
            }
          }
        }

        res.render("drawtest", {
          active: "Drawtest",
          deckNumber: parseInt(deckNumber),
          cards: cards,
          deckName: deckNames[parseInt(deckNumber) - 1],
          index: index,
          popupPreviousCards: req.session.popupPreviousCards,
          drawPercentage: drawPercentage,
          drawPercentageId: drawPercentageId,
          allDecks: allDecks,
        });
        return;
      }
    }
  });

  router.post("/drawtest", requireLogin, (req, res) => {
    const deckNumber: string = req.body.deck;
    const drawPercentage: string = req.body.drawPercentage;

    if (req.session.deckNumber && req.session.deckNumber != req.body.deck) {
      req.session.index = undefined;
      req.session.shuffledCards = undefined;
    }
    req.session.deckNumber = deckNumber;
    req.session.drawPercentage = drawPercentage;

    res.redirect("/MagicTheGathering/drawtest");
  });

  router.get("/drawtest/showpreviouscards", requireLogin, async (req, res) => {
    req.session.popupPreviousCards = true;
    res.redirect("/MagicTheGathering/drawtest#deck-select");
  });

  router.get(
    "/drawtest/closeshowpreviouscards",
    requireLogin,
    async (req, res) => {
      req.session.popupPreviousCards = false;
      res.redirect("/MagicTheGathering/drawtest#deck-select");
    }
  );

  router.get("/drawtest/draw", requireLogin, (req, res) => {
    if (req.session.index || req.session.index === 0) {
      req.session.index++;
    } else {
      req.session.index = 0;
    }
    res.redirect("/MagicTheGathering/drawtest#deck-select");
  });

  router.get("/drawtest/reset", requireLogin, (req, res) => {
    req.session.index = undefined;
    if (req.session.shuffledCards) {
      req.session.shuffledCards = shuffle(req.session.shuffledCards);
    }
    res.redirect("/MagicTheGathering/drawtest#deck-select");
  });

  router.get("/closeLimit", requireLogin, (req, res) => {
    res.redirect("/MagicTheGathering/home#search-form-id");
  });

  router.get("/export/:id", requireLogin, async (req, res) => {
    const deck: WithId<Deck> | null = await getDeck(
      req.params.id,
      req.session.username!
    );
    res.type("application/json");
    if (deck) {
      const cards: Card[] = deck.cards;
      if (cards.length === 0) {
        res.json({
          Melding: "Geen kaarten gevonden",
        });
      } else {
        res.json(cards);
      }
    } else {
      res.json({
        Melding: "Geen kaarten gevonden",
      });
    }
  });

  router.get("/handleiding", (req, res) => {
    res.render("handleiding", {
      active: "Handleiding",
    });
  });

  router.get("/error", (req, res) => {
    if (!req.session.username) {
      res.redirect("/projects");
      return;
    }
    res.redirect("/MagicTheGathering/home");
  });

  router.post("/uitloggen", (req, res) => {
    req.session.destroy(() => {
      console.log("Succesvol uitgelogd");
    });
    res.redirect("/MagicTheGathering/login");
  });

  return router;
}