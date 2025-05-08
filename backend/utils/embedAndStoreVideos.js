import { getEmbedding } from "../utils/openai.js";

export const embedAndStoreVideos = async (videos) => {
  for (const video of videos) {
    const combinedText = `${video.title} ${video.description}`;
    const embedding = await getEmbedding(combinedText);

    await Video.create({
      title: video.title,
      description: video.description,
      url: video.url,
      embedding,
    });
  }
};
