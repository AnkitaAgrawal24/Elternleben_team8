import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  embedding: [Number],
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
