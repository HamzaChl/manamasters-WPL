import { MongoClient, Collection } from "mongodb";
import { Card, User } from "./types";
import dotenv from "dotenv";

dotenv.config();

const uri: string = process.env.URI ?? "mongodb://localhost:27017";
const client = new MongoClient(uri);
const collectionCards: Collection<Card> =  client.db("tijdelijk").collection<Card>("mtg");
const collectionUsers: Collection<User> =  client.db("tijdelijk").collection<User>("Usersmtg");



export async function get10Cards(searchValue?: string ): Promise<Card[]> {
    if (searchValue) {
        await collectionCards.dropIndex("*");
        await collectionCards.createIndex({name: "text", text: "text"});
        return await collectionCards.aggregate<Card>([
            { $match: { $text: {$search: searchValue } } },
            { $sample: { size: 10 } }
        ]).toArray();
    } else {
        return await collectionCards.aggregate<Card>([{ $sample: { size: 10 } }]).toArray();
    }
};

export async function addUser(user: User) {
    await collectionUsers.insertOne(user);
};

export async function findUser(user: User) {
    return await collectionUsers.findOne({$and: [{username: user.username}, {password: user.password}]});
};

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error: any) {
        console.error(error.message);
    } finally {
        process.exit(0);
    };
}


export async function connect() {
    try {
        await client.connect();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error: any) {
        console.error(error.message);
    };
}