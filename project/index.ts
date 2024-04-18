import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import mtgRouter from "./routers/magicthegathering";
import { Collection, MongoClient } from "mongodb";
import { Card, CardData } from "./types";
import { errorHandler } from "./middleware/middleware";
import { error } from "console";

export const uri = "mongodb+srv://school:school@mycluster.rj0zjqu.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";
export const client = new MongoClient(uri);
export const collection: Collection<Card> =  client.db("tijdelijk").collection<Card>("mtg");

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


app.listen(app.get("port"), async () => {
    console.log("Server started on http://localhost:" + app.get('port'));
    try {
        await client.connect();
        const random = Math.floor(Math.random() * 56125) -10;
        const allCards =  await collection.find({}).toArray();
    } catch (error: any) {
        console.log(error);
    } finally {
        await client.close();
    };
});
