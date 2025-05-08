import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import mongoose from "mongoose";
import chatRouter from "./routes/chatRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import webinarRouter from "./routes/webinarRoutes.js";
import consultationRouter from "./routes/consultationRoutes.js";
//import { getWebinars } from "./utils/mockApiService.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

//Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB error:", err));

// Routes
app.use("/api/chat", chatRouter);
// app.use("/api/upload", uploadRoutes);
app.use("/api/upload", uploadRouter);

app.get("/", (req, res) => {
  res.send("RAG Chatbot Backend Running ");
});

//app.use("/api/webinars", webinarRouter);
app.use("/api", consultationRouter); // Notice: experts & bookings are mounted at /api
app.use("/api/webinars", webinarRouter);
//

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
