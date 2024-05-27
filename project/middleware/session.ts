import dotenv from "dotenv";
import session from "express-session";
import mongoDbSession from "connect-mongodb-session";
import { Card } from "../types";

dotenv.config();
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
  uri: process.env.URI ?? "mongodb://localhost:27017",
  collection: "sessions",
  databaseName: "tijdelijk",
});

mongoStore.on("error", (error) => {
  console.error(error);
});

declare module "express-session" {
  export interface SessionData {
    username?: string;
    cards?: Card[];
    loginUsername?: string;
    index: number;
    deckNumber: string;
    shuffledCards: Card[];
    popupPreviousCards: boolean;
    drawPercentage: string;
    popupEdit: boolean;
  }
}

export default session({
  secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
  store: mongoStore,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  },
});