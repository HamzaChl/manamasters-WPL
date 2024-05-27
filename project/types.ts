import { ObjectId } from "mongodb";

export interface ErrorHandlerOptions {
  statusCode: number;
}

export interface Deck {
  cards: Card[];
  id: string;
  username: string;
  deckName: string;
  url: string;
}

export interface AddDeck {
  id: string;
  deck: string;
}

export interface Card {
  _id?: ObjectId;
  name: string;
  manaCost: string;
  type: string;
  rarity: string;
  text: string;
  imageUrl: string;
  id: string;
}

export interface ApiCard {
  _id?: string;
  name: string;
  manaCost: string;
  cmc: number;
  colors: string[];
  colorIdentity: string[];
  type: string;
  types: string[];
  rarity: string;
  set: string;
  setName: string;
  text: string;
  flavor?: string;
  artist: string;
  number: string;
  layout: string;
  multiverseid?: string;
  imageUrl: string;
  watermark?: string;
  printings: string[];
  originalText: string;
  originalType: string;
  id: string;
}

export interface User {
  username: string;
  password: string;
}
