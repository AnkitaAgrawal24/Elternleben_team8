import mongoose from "mongoose";

const WebinarSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  registrants: [
    {
      name: String,
      email: String,
      registeredAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Webinar", WebinarSchema);
