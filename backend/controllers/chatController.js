import {
  getExperts,
  getWebinars,
  registerForWebinar,
  //getVideos,
} from "../utils/mockApiService.js";
import { searchRelevantChunks } from "../utils/vectorSearch.js";
import { askOpenAI } from "../utils/openai.js";

export const getChatResponse = async (req, res) => {
  const { message } = req.body;

  try {
    console.log("🔍 Incoming message:", message);
    const relevantChunks = await searchRelevantChunks(message);

    const contextString = relevantChunks
      .map((chunk) => chunk.content)
      .join("\n\n---\n\n");

    let botReply = await askOpenAI(
      `Use the following context to answer the user's question briefly:\n\n${contextString}\n\nUser: ${message}\n\nAnswer in a short and direct manner, and if relevant, suggest a webinar or a consultation.`
    );

    let options = null;

    if (message.toLowerCase().includes("webinar") && !options) {
      const webinars = await getWebinars();
      options = {
        type: "webinar",
        data: webinars.map((w) => ({
          id: w.uuid,
          title: w.topic,
          date: w.start_time,
        })),
        message: "Here are some relevant webinars you might be interested in:",
      };
    } else if (
      message.toLowerCase().includes("consultation") ||
      (message.toLowerCase().includes("expert") && !options)
    ) {
      const experts = await getExperts();
      options = {
        type: "consultation",
        message:
          "If you'd like to book a consultation with an expert, you can go to the consultation booking page.",
      };
    }

    console.log("🧠 Bot Reply:", botReply);
    console.log("💡 Options:", options);

    res.json({ botReply, options });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};
