import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import mtgRouter from "./routers/magicthegathering";
import { errorHandler } from "./middleware/middleware";
import { error } from "console";
import { connect } from "./database";
import session from "./middleware/session";



dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));
app.use(session);
app.use((req, res, next) => {
    res.locals.error = undefined;
    res.locals.limit60 = undefined;
    next();
})

app.set("port", process.env.PORT || 3000);

app.use("/MagicTheGathering", mtgRouter());

app.get("/", (req, res) => {
    res.redirect("/projects")
});

app.get("/projects", (req, res) => {
    res.render("landingpage");
});



app.use(errorHandler(404, "De pagina die je probeerde te vinden bestaat niet."))
   .use(errorHandler(500, "Interne serverfout. Probeer het later opnieuw."))
   .use(errorHandler(403, "Verboden. Toegang geweigerd."))
   .use(errorHandler(401, "Ongeautoriseerd. Log alsjeblieft in."))
   .use(errorHandler(400, "Foute aanvraag. Ongeldige syntaxis."));

app.listen(app.get("port"), async () => {
    await connect();
    console.log("Server started on http://localhost:" + app.get('port'));
});
