import Chunk from "../models/Chunk.js"; // MongoDB model
import { cosineSimilarity } from "./similarity.js";
import { getEmbedding } from "../utils/openai.js";

export const embedAndStoreChunks = async (text) => {
  const chunks = text.match(/.{1,500}/g); // Split into 500 char chunks
  for (const chunk of chunks) {
    try {
      const embedding = await getEmbedding(chunk);

      console.log(" Inserting chunk:", chunk.slice(0, 50), "..."); // log preview
      console.log(" Embedding sample:", embedding.slice(0, 5)); // log preview

      await Chunk.create({ content: chunk, embedding });
    } catch (err) {
      console.error(" Failed to create chunk:", err.message);
      throw err; // Bubble the error up
    }
  }
};

export const searchRelevantChunks = async (query) => {
  console.log(" Searching relevant chunks for query:", query);
  let queryEmbedding;
  try {
    queryEmbedding = await getEmbedding(query);
    console.log(
      " Query embedding sample:",
      queryEmbedding ? queryEmbedding.slice(0, 5) : null
    );
  } catch (error) {
    console.error(" Error getting query embedding:", error);
    throw error; // Re-throw to be caught in chatController
  }

  try {
    const allChunks = await Chunk.find();
    console.log(" Found", allChunks.length, "chunks in the database.");

    const similarities = allChunks.map((chunk) => {
      const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        content: chunk.content,
        similarity: similarity,
      };
    });

    console.log(" Calculated similarities for", similarities.length, "chunks.");

    similarities.sort((a, b) => b.similarity - a.similarity);
    console.log("Sorted similarities:", similarities.slice(0, 3));

    const relevantChunks = similarities.slice(0, 3);
    console.log(" Relevant chunks found:\n", relevantChunks);
    return relevantChunks; // Return the array of objects
  } catch (error) {
    console.error(" Error during chunk search:", error);
    throw error; // Re-throw to be caught in chatController
  }
};
