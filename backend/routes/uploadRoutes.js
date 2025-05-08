import express from "express";
import multer from "multer";
import fs from "fs";
// import {getEmbedding} from "../utils/openaiService.js"
import Chunk from "../models/Chunk.js";
import { getEmbedding } from "../utils/openai.js";
//import {collection} from "../utils/mongodb.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("📄 File path:", filePath);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    console.log("📄 File content read:", fileContent.slice(0, 100)); // Show first 100 chars

    const embedding = await getEmbedding(fileContent);
    console.log("📊 Embedding generated, sample:", embedding.slice(0, 5));

    await Chunk.create({
      content: fileContent,
      embedding,
    });

    fs.unlinkSync(filePath);
    res.json({ message: "File uploaded and embedded successfully 🚀" });
  } catch (error) {
    console.error("🔥 Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
