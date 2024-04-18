import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import mtgRouter from "./routers/magicthegathering";
import { errorHandler } from "./middleware/middleware";
import { error } from "console";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.use("/MagicTheGathering", mtgRouter());

app.get("/", (req, res) => {
    res.redirect("/projects")
});

app.get("/projects", (req, res) => {
    res.render("landingpage");
});

app.use(errorHandler(404, "The page you were trying to find does not exists"))
   .use(errorHandler(500, "Internal server error. Please try again later."))
   .use(errorHandler(403, "Forbidden. Access denied."))
   .use(errorHandler(401, "Unauthorized. Please log in."))
   .use(errorHandler(400, "Bad request. Invalid syntax."));


app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});