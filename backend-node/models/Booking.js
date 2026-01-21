const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    distanceKm: {
      type: Number,
      required: true,
    },
    bookingType: {
      type: String,
      enum: ["ride", "full-day"],
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["cash", "qr"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
