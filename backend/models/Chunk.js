import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  content: String,
  embedding: [Number],
  source: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chunk = mongoose.model("Chunk", chunkSchema);

export default Chunk;
