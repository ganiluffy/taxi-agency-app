const express = require("express");
const Booking = require("../models/Booking");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();
router.post("/", auth, async (req, res) => {
  try {
    const booking = await Booking.create({
      user: req.user.id,
      pickup: req.body.pickup,
      destination: req.body.destination,
      distanceKm: req.body.distanceKm,
      bookingType: req.body.bookingType,
      fare: req.body.fare,
      paymentMode: req.body.paymentMode,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
});
router.get("/my", auth, async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });
  res.json(bookings);
});
router.get("/all", auth, role("admin"), async (req, res) => {
  const bookings = await Booking.find().populate("user", "name email");
  res.json(bookings);
});
router.patch("/:id/status", auth, role("admin"), async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(booking);
});
module.exports = router;
