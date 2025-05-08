import axios from "axios";

export const getEmbedding = async (text) => {
  const response = await axios.post(
    // "https://api.openai.com/v1/embeddings",
    `<span class="math-inline">\{process\.env\.AZURE\_OPENAI\_ENDPOINT\}/openai/deployments/</span>{process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME}/embeddings?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
    {
      input: text,
      model: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME,
    },
    {
      headers: {
        // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "api-key": process.env.AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data[0].embedding;
};

export const askOpenAI = async (prompt) => {
  const response = await axios.post(
    `<span class="math-inline">\{process\.env\.AZURE\_OPENAI\_ENDPOINT\}/openai/deployments/</span>{process.env.AZURE_GPT_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
    {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
    },
    {
      headers: {
        "api-key": process.env.AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].message.content;
};
