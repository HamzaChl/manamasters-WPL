import { MongoClient, Collection } from "mongodb";
import { Card } from "./types";
import dotenv from "dotenv";

dotenv.config();

const uri: string = process.env.URI ?? "mongodb://localhost:27017";
const client = new MongoClient(uri);
const collection: Collection<Card> =  client.db("tijdelijk").collection<Card>("mtg");



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

export async function get10Cards(searchValue?: string ): Promise<Card[]> {
    if (searchValue) {
        await collection.dropIndex("*");
        await collection.createIndex({name: "text", text: "text"});
        return await collection.aggregate<Card>([
            { $match: { $text: {$search: searchValue } } },
            { $sample: { size: 10 } }
        ]).toArray();
    } else {
        return await collection.aggregate<Card>([{ $sample: { size: 10 } }]).toArray();
    }
};

export async function connect() {
    try {
        await client.connect();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error: any) {
        console.error(error.message);
    };
}