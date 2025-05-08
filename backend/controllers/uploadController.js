import { extractTextFromFile } from "../utils/fileParser.js";
import { embedAndStoreChunks } from "../utils/vectorSearch.js";

export const processFileAndStoreEmbeddings = async (req, res) => {
  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;

  try {
    const text = await extractTextFromFile(fileBuffer, fileName);
    await embedAndStoreChunks(text);
    res.json({ message: "File processed and embeddings stored ✅" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
};
