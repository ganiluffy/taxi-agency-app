const express = require("express");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
require("./config/passport");

app.use(passport.initialize());

const app = express();

const connectDB = require("./config/db");

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));




app.get("/", (req, res) => {
  res.send("Taxi Agency Backend is running");
});
const auth = require("./middleware/authMiddleware");

app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log(process.env.JWT_SECRET);
