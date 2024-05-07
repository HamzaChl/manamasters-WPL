import express, { request, response } from "express";
import {  addUser, checkCardExists, deleteCards, deleteOneCard, findUser, findUserName, get10Cards, getCardById, getDeck, insertCardInDeck } from "../database";
import { AddDeck, Card, Deck, User } from "../types";
import  { continueLogin, requireLogin } from "../middleware/middleware";
import { WithId } from "mongodb";
import { json } from "stream/consumers";
import { appendFile, link } from "fs";
import { parseArgs } from "util";
import { userInfo } from "os";



export default function mtgRouter() {
    const router = express.Router();


    router.get("/refresh", requireLogin , async(req, res) => {
        req.session.cards = await get10Cards();
        res.redirect("/MagicTheGathering/home#search-form-id");
    });

    router.get("/login", continueLogin ,(req, res) => {
        res.render("login", {
            word: "login"
        });
    });

    
    router.get("/registreer", continueLogin, (req, res) => {
        res.render("registreer", {
            word: "registreer"
        });
    });

    router.post("/login", continueLogin , async (req, res) => {
        const formRegister: User = req.body;
        formRegister.username = formRegister.username.toLowerCase();        
        const user: User| null = await findUser(formRegister);
        
        if (user) {
            req.session.username = formRegister.username;
            res.redirect("/MagicTheGathering/home");  
        } else {
            res.status(401).render("login", {
                error: "De verstrekte inloggegevens zijn niet correct.",
                word: "login"
            });
        };
    });

    router.post("/registreer", continueLogin ,async (req, res) => {
        const formRegister: User = req.body;
        formRegister.username = formRegister.username.toLowerCase();
        const user: WithId<User> | null = await findUserName(formRegister);
        let error: string | undefined = undefined;
        
        if (user) {
            error = "Gebruikersnaam bestaat al. Gelieve in te loggen.";
            res.render("login", {
                error: error,
                word: "login"
            });
        }
        else if (formRegister.username.length < 5) {
            error = "Gelieve een geldige gebruikersnaam in te geven.";
            res.render("registreer", {
                error: error,
                word: "registreer"
            });
        } else if (formRegister.password.length < 8) {
            error = "Wachtwoord moet minimaal 8 karakters lang zijn.";
            res.render("registreer", {
                error: error,
                word: "registreer"
            });
        } else {
            await addUser(formRegister);
            req.session.username = formRegister.username;
            res.redirect("/MagicTheGathering/home");
        };
    });


    router.get("/home", requireLogin ,async (req, res) => {
        const searchValue: string | undefined = typeof req.query.search === "string" ? req.query.search : undefined;
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
        };

        res.render("home", {
            active: "Home",
            cards: randomResults,
        });    
    });



    router.post("/home", requireLogin, async (req, res) => {
       const response: AddDeck = req.body;
       const user: string | undefined = req.session.username;
       const error: string | undefined = await insertCardInDeck(response, user!);
       if (error) {
            res.render("home", {
                limit60: error,
                cards: req.session.cards
            });
            return;
       };
       res.redirect("/MagicTheGathering/home#search-form-id");
    });


    router.get("/decks", requireLogin, (req, res) => {
        res.render("decks", {
            active:  "Decks"
        });
    });
    
    router.get("/deck", requireLogin, (req, res) => {
        res.render("decksindividueel", {
            active:  "Deck"
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
                        const manaCost: number = parseInt(card.manaCost.substring(1,2));
                        if (!isNaN(manaCost)) {
                            total += manaCost
                            divide++;   
                        };            
                    };
                    if (card.type.toLowerCase().includes("land")) {
                        totalLandCards++;
                    };
                    cardCounts[card.id] = (cardCounts[card.id] || 0) + 1; 
                };
                if (divide != 0) {
                    manaCostTotal = parseFloat((total / divide).toFixed(2));  
                };
                uniqueCards = Array.from(new Set(deck.cards.map(card => JSON.stringify(card)))).map(cardJson => JSON.parse(cardJson));
            };
            res.render("decksindividueel", {
                active:  "Deck",
                uniqueCards: uniqueCards,
                cardCounts: cardCounts,
                deck: deck,
                id: id,
                manaCost: manaCostTotal,
                totalLandCards: totalLandCards
            });   
        };
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
                    const manaCost: number = parseInt(card.manaCost.substring(1,2));
                    if (!isNaN(manaCost)) {
                        total += manaCost
                        divide++;   
                    };            
                };
                if (card.type.toLowerCase().includes("land")) {
                    totalLandCards++;
                };
                cardCounts[card.id] = (cardCounts[card.id] || 0) + 1; 
            };
            if (divide != 0) {
                manaCostTotal = parseFloat((total / divide).toFixed(2));  
            };
            uniqueCards = Array.from(new Set(deck.cards.map(card => JSON.stringify(card)))).map(cardJson => JSON.parse(cardJson));
        };

        res.render("decksindividueel", {
            active:  "Deck",
            uniqueCards: uniqueCards,
            card: card,
            cardCounts: cardCounts,
            deck: deck,
            id: id,
            manaCost: manaCostTotal,
            totalLandCards: totalLandCards,
        });   
    });

    router.get("/deck/:id/:cardId/min", requireLogin, async (req, res) => {
        const id: string = req.params.id;
        const cardId: string = req.params.cardId;
        await deleteOneCard(id, cardId, req.session.username!);
        const cardExists: boolean = await checkCardExists(id, cardId, req.session.username!);
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
            deck: id
        };
        await insertCardInDeck(response, req.session.username!);
        res.redirect(`/MagicTheGathering/deck/${id}/${cardId}`);
    });

    router.get("/deck/:id/:cardId/delete", requireLogin, async (req, res) => {
        await deleteCards(req.params.id, req.params.cardId, req.session.username!);
        res.redirect(`/MagicTheGathering/deck/${req.params.id}`);
    });


    router.get("/drawtest", requireLogin, (req, res) => {

        res.render("drawtest", {
            active: "Drawtest"
        });
    });

    router.post("/drawtest", requireLogin, (req, res) => {
        req.body.
        res.render("drawtest", {
            active: "Drawtest"
        });
    });

    router.get("/closeLimit", requireLogin, (req, res) => {
        res.redirect("/MagicTheGathering/home#search-form-id");
    });


    router.get("/export/:id", requireLogin, async (req, res) => {
        const deck: WithId<Deck> | null = await getDeck(req.params.id, req.session.username!);
        res.type("application/json");
        if (deck) {
            const cards: Card[] = deck.cards;
            if (cards.length === 0) {
                res.json({
                    "Melding": "Geen kaarten gevonden"
                });
            } else {
                res.json(cards);
            };
        } else {
            res.json({
                "Melding": "Geen kaarten gevonden"
            });
        };        
    });
    
    router.get("/error", (req, res) => {
        if (!req.session.username) {
            res.redirect("/projects");
            return;
        };
        res.redirect("/MagicTheGathering/home");
    });


    router.post("/uitloggen", (req, res) => {
        req.session.destroy(() => {
            console.log("Succesvol uitgelogd");
        });
        res.redirect("/MagicTheGathering/login");
    });

    return router;
};