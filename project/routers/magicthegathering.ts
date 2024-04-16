import express from "express";

export default function mtgRouter() {
    const router = express.Router();

    router.get("/login", (req, res) => {
        res.render("login");
    });

    router.get("/home", (req, res) => {
        res.render("home", {
            active: "Home"
        });
    });

    router.get("/decks", (req, res) => {
        res.render("decks", {
            active:  "Decks"
        });
    });

    router.get("/deck", (req, res) => {
        res.render("decksindividueel", {
            active: "Deck"
        });
    });
    

    router.get("/drawtest", (req, res) => {
        res.render("drawtest", {
            active: "Drawtest"
        });
    });
    
    
    return router;
};