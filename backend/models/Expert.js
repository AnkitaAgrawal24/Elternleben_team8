import mongoose from "mongoose";

const expertSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  name: String,
  is_available: Boolean,
  // add more fields as needed
});

const Expert = mongoose.model("Expert", expertSchema);

export default Expert;
