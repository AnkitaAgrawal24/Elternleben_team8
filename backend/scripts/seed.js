import dotenv from "dotenv";
import axios from "axios";
import { MongoClient } from "mongodb";
import fs from "fs";

dotenv.config();

// Azure OpenAI Config
const openaiHeaders = {
  "api-key": process.env.AZURE_OPENAI_API_KEY,
  "Content-Type": "application/json",
};

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI);

async function generateEmbedding(text) {
  const response = await axios.post(
    `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME}/embeddings?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
    { input: text },
    { headers: openaiHeaders }
  );
  return response.data.data[0].embedding;
}

async function seedData() {
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME);
    const collection = db.collection(process.env.MONGODB_COLLECTION_NAME);

    // Load your dataset
    const rawData = fs.readFileSync("./scripts/dataset.json", "utf-8");
    const documents = JSON.parse(rawData);

    const documentsWithEmbeddings = [];

    for (const doc of documents) {
      const embedding = await generateEmbedding(doc.text);
      documentsWithEmbeddings.push({
        text: doc.text,
        embedding: embedding,
      });
      console.log(`✅ Embedded: ${doc.text.substring(0, 30)}...`);
    }

    //Clean previous documents
    await collection.deleteMany({});

    // Insert new documents
    await collection.insertMany(documentsWithEmbeddings);
    console.log("🎉 Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error.message);
  } finally {
    await client.close();
  }
}

seedData();
