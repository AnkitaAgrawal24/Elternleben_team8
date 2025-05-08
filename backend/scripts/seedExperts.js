import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Expert from "../models/Expert.js";
import Slot from "../models/Slot.js";
import Booking from "../models/Booking.js";

dotenv.config();

const MOCK_API = "http://127.0.0.1:8000";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  });

const seedExpertsData = async () => {
  try {
    await Expert.deleteMany({});
    await Slot.deleteMany({});

    const { data: experts } = await axios.get(`${MOCK_API}/experts`);

    for (const expert of experts) {
      const newExpert = await Expert.create({
        uuid: expert.uuid,
        name: expert.name,
        is_available: expert.is_available,
      });

      const { data: slots } = await axios.get(
        `${MOCK_API}/experts/${expert.id}/available-slots`
      );
      const slotDocs = slots.map((slot) => ({
        expertUuid: expert.uuid,
        start_datetime: slot.start_datetime,
        end_datetime: slot.end_datetime,
      }));

      await Slot.insertMany(slotDocs);

      console.log(` Seeded expert: ${newExpert.name} (${slots.length} slots)`);
    }

    console.log(" Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error(" Seeding failed:", err.message);
    process.exit(1);
  }
};

seedExpertsData();
