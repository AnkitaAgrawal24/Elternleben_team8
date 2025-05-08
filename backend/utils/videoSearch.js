import { getEmbedding } from "../utils/openai.js";

import { cosineSimilarity } from "./similarity.js";

export const searchRelevantVideos = async (query) => {
  const queryEmbedding = await getEmbedding(query);
  const allVideos = await Video.find();

  const ranked = allVideos.map((video) => {
    const similarity = cosineSimilarity(queryEmbedding, video.embedding);
    return { ...video.toObject(), similarity };
  });

  ranked.sort((a, b) => b.similarity - a.similarity);
  return ranked.slice(0, 3);
};
