import { MongoClient, Collection, WithId, ObjectId } from "mongodb";
import { AddDeck, ApiCard, Card, Deck, User } from "./types";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { log } from "console";

dotenv.config();
const saltRounds: number = 10;

const uri: string = process.env.URI ?? "mongodb://localhost:27017";
const client = new MongoClient(uri);
const collectionCards: Collection<Card> = client
  .db("tijdelijk")
  .collection<Card>("mtg");
const collectionUsers: Collection<User> = client
  .db("tijdelijk")
  .collection<User>("Usersmtg");
const collecionDecks: Collection<Deck> = client
  .db("tijdelijk")
  .collection<Deck>("UserDecks");

async function getAllCards() {
  const amountCards: number = await collectionCards.countDocuments();
  if (amountCards === 0) {
    for (let i = 0; i < 821; i++) {
      const response = await fetch(
        `https://api.magicthegathering.io/v1/cards?page=${i}`
      );
      const data: ApiCard[] = (await response.json()).cards;
      let filteredData: Card[] = [];
      for (const card of data) {
        if (card.imageUrl) {
          const correctedCard: Card = {
            name: card.name,
            manaCost: card.manaCost,
            id: card.id,
            imageUrl: card.imageUrl,
            type: card.type,
            rarity: card.rarity,
            text: card.text,
          };
          filteredData.push(correctedCard);
        }
      }
      if (filteredData.length > 0) {
        collectionCards.insertMany(filteredData);
      }
    }
  } else {
    console.log(`Database is already filled with ${amountCards}`);
  }
}

export async function changeDeckName(
  username: string,
  id: string,
  deckname: string,
  url: string
) {
  const deck: WithId<Deck> | null = await collecionDecks.findOne({
    $and: [{ id: id }, { username: username }],
  });
  if (url === "") {
    url = `https://raw.githubusercontent.com/Imrxng/fotosProjectWEB/main/deck${id}.webp`;
  } else if (deckname === "") {
    deckname = deck!.deckName;
  }
  await collecionDecks.updateOne(
    { id: id, username: username },
    { $set: { deckName: deckname, url: url } }
  );
}

export async function get10Cards(searchValue?: string): Promise<Card[]> {
  if (searchValue) {
    await collectionCards.dropIndex("*");
    await collectionCards.createIndex({ name: "text", text: "text" });
    return await collectionCards
      .aggregate<Card>([
        { $match: { $text: { $search: searchValue } } },
        { $sample: { size: 10 } },
      ])
      .toArray();
  } else {
    return await collectionCards
      .aggregate<Card>([{ $sample: { size: 10 } }])
      .toArray();
  }
}

export async function getCardById(id: string) {
  return await collectionCards.findOne({ id: id });
}

export async function addUser(user: User) {
  user = {
    username: user.username,
    password: await bcrypt.hash(user.password, saltRounds),
  };
  await collectionUsers.insertOne(user);
  const deckNames = [
    "Deck 01",
    "Deck 02",
    "Deck 03",
    "Deck 04",
    "Deck 05",
    "Deck 06",
  ];
  for (let i = 0; i < deckNames.length; i++) {
    const deck: Deck = {
      id: (i + 1).toString(),
      cards: [],
      username: user.username,
      deckName: deckNames[i],
      url: `https://raw.githubusercontent.com/Imrxng/fotosProjectWEB/main/deck${
        i + 1
      }.webp`,
    };
    await collecionDecks.insertOne(deck);
  }
}

export async function findUser(user: User) {
  const foundUser: User | null = await findUserName(user);
  if (foundUser) {
    const passwordCorrect: boolean = await bcrypt.compare(
      user.password,
      foundUser.password
    );
    if (passwordCorrect) {
      return foundUser;
    }
  }
  return null;
}

export async function getAllDecks(username: string) {
  return await collecionDecks.find({ username: username }).toArray();
}

export async function findUserName(user: User) {
  return await collectionUsers.findOne({ username: user.username });
}

export async function insertCardInDeck(response: AddDeck, username: string) {
  const card: Card | null = await collectionCards.findOne({
    id: response.id,
  });
  if (card) {
    const deck: Deck | null = await collecionDecks.findOne({
      $and: [{ id: response.deck }, { username: username }],
    });
    if (deck) {
      const cards: Card[] = [];
      for (const deckCard of deck.cards) {
        if (deckCard.id === card.id) {
          cards.push(deckCard);
        }
      }

      if (deck.cards.length === 60) {
        return `Limiet van kaarten in ${deck.deckName} bereikt.`;
      } else if (
        cards.length === 4 &&
        !card.type.toLowerCase().includes("land")
      ) {
        return `Limiet van deze kaart bereikt in ${deck.deckName}.`;
      }

      delete card._id;
      card._id = new ObjectId();

      await collecionDecks.updateOne(
        { $and: [{ id: response.deck }, { username: username }] },
        { $push: { cards: card } }
      );
      return undefined;
    }
  }
}

export async function deleteOneCard(
  deckNumber: string,
  cardId: string,
  username: string
) {
  const deck: WithId<Deck> | null = await getDeck(deckNumber, username);
  if (deck) {
    const cardIndex = deck.cards.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
      deck.cards.splice(cardIndex, 1);
      await collecionDecks.updateOne(
        { id: deckNumber, username: username },
        { $set: { cards: deck.cards } }
      );
    }
  }
}

export async function deleteCards(
  deckNumber: string,
  cardId: string,
  username: string
) {
  await collecionDecks.updateOne(
    { $and: [{ id: deckNumber, username: username }] },
    { $pull: { cards: { id: cardId } } }
  );
}

export async function getDeck(deckNumber: string, username: string) {
  return await collecionDecks.findOne({
    $and: [{ id: deckNumber }, { username: username }],
  });
}

export async function checkCardExists(
  deckNumber: string,
  cardId: string,
  username: string
) {
  const deck: WithId<Deck> | null = await getDeck(deckNumber, username);
  if (deck) {
    const cardExists = deck.cards.some((card) => card.id === cardId);
    return cardExists;
  }
  return false;
}

async function exit() {
  try {
    await client.close();
    console.log("Disconnected from database");
  } catch (error: any) {
    console.error(error.message);
  } finally {
    process.exit(0);
  }
}

export async function connect() {
  try {
    await client.connect();
    console.log("Connected to database");
    process.on("SIGINT", exit);
    await getAllCards();
  } catch (error: any) {
    console.error(error.message);
  }
}
