import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  expertId: {
    type: String,
    required: true,
  },
  start_datetime: {
    type: String,
    required: false,
  },
  end_datetime: {
    type: String,
    required: false,
  },
  client_name: {
    type: String,
    required: true,
  },
  client_email: {
    type: String,
    required: true,
  },
  client_phone: {
    type: Number,
    required: false,
  },
  service: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Booking", bookingSchema);
