const express = require("express");
const Booking = require("../models/Booking");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { calculateFare } = require("../services/fareService");

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking (user)
 * @access  Private (User)
 */
router.post("/", auth, async (req, res) => {
  try {
    const {
      pickup,
      destination,
      distanceKm,
      bookingType,
      paymentMode,
    } = req.body;

    // 1️⃣ Call FastAPI Fare Engine
    const fareData = await calculateFare(distanceKm, bookingType);

    // 2️⃣ Create booking in MongoDB
    const booking = await Booking.create({
      user: req.user.id,
      pickup,
      destination,
      distanceKm,
      bookingType,
      fare: fareData.total_fare,
      paymentMode,
      status: "pending",
    });

    // 3️⃣ Return booking + fare breakdown
    res.status(201).json({
      booking,
      fareBreakdown: fareData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
});

/**
 * @route   GET /api/bookings/my
 * @desc    Get logged-in user's bookings
 * @access  Private (User)
 */
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

/**
 * @route   GET /api/bookings/all
 * @desc    Get all bookings
 * @access  Private (Admin)
 */
router.get("/all", auth, role("admin"), async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
});

/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Update booking status
 * @access  Private (Admin)
 */
router.patch("/:id/status", auth, role("admin"), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
