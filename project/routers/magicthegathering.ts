import express, { request, response } from "express";
import {  addUser, findUser, findUserName, get10Cards, insertCardInDeck } from "../database";
import { AddDeck, Card, User } from "../types";
import  { requireLogin } from "../middleware/middleware";
import bcrypt from 'bcrypt';
import { WithId } from "mongodb";
import { log } from "console";



export default function mtgRouter() {
    const router = express.Router();

    router.get("/login", (req, res) => {
        
        res.render("login", {
            word: "login"
        });
    });

    
    router.get("/registreer", (req, res) => {
        res.render("registreer", {
            word: "registreer"
        });
    });

    router.post("/login", async (req, res) => {
        const formRegister: User = req.body;
        formRegister.username = formRegister.username.toLowerCase();        
        const user: WithId<User> | null = await findUser(formRegister);
        
        if (user) {
            req.session.username = formRegister.username;
            res.redirect("/MagicTheGathering/home");  
        } else {
            res.render("login", {
                error: "De verstrekte inloggegevens zijn niet correct.",
                word: "login"
            });
        };
    });

    router.post("/registreer", async (req, res) => {
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
            error = "Gelieve een geldige gebruikersnaam in te geven (Ps. te kort)";
            res.render("registreer", {
                error: error,
                word: "registreer"
            });
        } else if (formRegister.password.length < 8) {
            error = "Wachtwoord moet minimaal 8 karakters lang zijn";
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
        let randomResults: Card[] = await get10Cards(searchValue); 
        console.log(req.session.username);
        
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
                error: error
            });
            return;
       };
       res.redirect("/MagicTheGathering/home");
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

    router.get("/drawtest", requireLogin, (req, res) => {
        res.render("drawtest", {
            active: "Drawtest"
        });
    });

    router.get("/error", (req, res) => {
        if (!req.session.username) {
            res.redirect("/projects");
            return;
        };
        res.redirect("/MagicTheGathering/home");
    });

    router.get("/uitloggen", (req, res) => {
        req.session.destroy(() => {
            console.log("Succesvol uitgelogd");
        });
        res.redirect("/MagicTheGathering/login");
    });

    return router;
};