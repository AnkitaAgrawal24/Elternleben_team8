import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  expertUuid: { type: String, required: true },
  start_datetime: {
    type: String,
    required: true,
  },
  end_datetime: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Slot", slotSchema);
