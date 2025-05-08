import express from "express";
import Webinar from "../models/Webinar.js";

const router = express.Router();

router.post("/:webinar_id/registrants", async (req, res) => {
  console.log("Received data:", req.body);
  console.log("Params:", req.params.webinar_id);
  try {
    const webinar = await Webinar.findById(req.params.webinar_id);
    if (!webinar) return res.status(404).json({ message: "Webinar not found" });

    const { email, first_name, last_name } = req.body;
    webinar.registrants.push({
      name: `${first_name}${last_name ? " " + last_name : ""}`,
      email: email,
    });
    await webinar.save();

    return res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
