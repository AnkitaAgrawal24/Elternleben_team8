import express from "express";
import Expert from "../models/Expert.js";
import Slot from "../models/Slot.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// GET /api/experts
router.get("/experts", async (req, res) => {
  // const experts = await Expert.find({ available: true });
  const experts = await Expert.find();
  res.json(experts);
});

// GET /api/experts/available - Available experts
router.get("/experts/available", async (req, res) => {
  const experts = await Expert.find({ available: true });
  res.json(experts);
});

// GET /api/experts/:id/available-slots
router.get("/experts/:id/available-slots", async (req, res) => {
  const slots = await Slot.find({ expertUuid: req.params.id });
  res.json(slots.map((s) => s.start_datetime));
});

// POST /api/bookings/new
router.post("/bookings/new", async (req, res) => {
  try {
    const {
      client_name,
      client_email,
      client_phone,
      service,
      expert_id,
      start_datetime,
    } = req.body;

    if (!expert_id || !start_datetime || !client_name || !client_email) {
      return res.status(422).json({
        error:
          "Missing required fields (expert_id, start_datetime, client_name, client_email)",
      });
    }

    const newBooking = await Booking.create({
      expertId: expert_id,
      start_datetime: start_datetime,
      end_datetime: start_datetime,
      name: client_name,
      email: client_email,
      phone: client_phone,
      service: service,
    });

    await Slot.deleteOne({
      expertUuid: expert_id,
      start_datetime: new Date(start_datetime),
    });

    res.status(201).json({ message: "Booking confirmed", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/bookings/:id
router.patch("/bookings/:id", async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(booking);
});

// DELETE /api/bookings/:id
router.delete("/bookings/:id", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking cancelled" });
});

export default router;
