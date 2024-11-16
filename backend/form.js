import { MongoClient } from "mongodb";

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const client = await connectToDatabase();
        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection('businesses');

        // Insert the data from the request body
        const result = await collection.insertOne(req.body);

        res.status(201).json({ message: 'Business added successfully!', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
